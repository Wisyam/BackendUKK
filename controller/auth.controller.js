const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { user } = require('../models/index');

// Secret key untuk JWT (sebaiknya diletakkan dalam environment variable)
const JWT_SECRET = 'konz123';

// Fungsi Authentication (Login)
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Cari User berdasarkan username
        const User = await user.findOne({ where: { username } });
        if (!User) {
            return res.status(401).json({ message: "user not found" });
        }

        // Cek password
        const isPasswordValid = await bcrypt.compare(password, User.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Buat token JWT
        const token = jwt.sign(
            { userId: User.user_id, role: User.role }, 
            JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: "Login successful", token, User });
    } catch (error) {
        res.status(500).json({ message: "Error during login", error: error.message });
    }
};

// Fungsi Middleware untuk Authorization (perlu ditambahkan di route yang membutuhkan proteksi)
exports.authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token

    if (!token) {
        return res.status(403).json({ message: "Access token is missing or invalid" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET); // Verifikasi token
        req.User = decoded; // Menyimpan userId dan role ke req.User
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token", error: error.message });
    }
};

// Fungsi Authorization berdasarkan role
exports.authorize = (requiredRole) => {
    return (req, res, next) => {
        const { role } = req.User; // Ambil role dari token yang sudah didekode

        if (!requiredRole.includes(role)) {
            return res.status(401).json({ message: `Access denied. Only ${requiredRole}s can access this resource.` });
        }

        next(); // Lanjutkan ke route berikutnya jika User memiliki role yang sesuai
    };
};
