// controllers/user.controller.js
const { user } = require("../models/index"); // Import model user (pastikan sudah buat modelnya)
const bcrypt = require('bcrypt');

// Controller untuk mendapatkan semua user
const getAllusers = async (req, res) => {
  try {
    const users = await user.findAll(); // Mengambil semua user dari database
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// Controller untuk mendapatkan user berdasarkan ID
const getuserById = async (req, res) => {
  const { id } = req.params; // Mengambil ID dari parameter URL
  try {
    const User = await user.findByPk(id); // Mengambil user berdasarkan primary key (id)
    if (!User) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json(User);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

// Controller untuk membuat user
const createuser = async (req, res) => {
  const { nama_user, username, password, role } = req.body; // Data user yang dikirim melalui request body
  try {
    // Cek apakah username sudah ada
    const existingUser = await user.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password sebelum menyimpan user
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru dengan password yang sudah di-hash
    const newuser = await user.create({ nama_user, username, password: hashedPassword, role });
    res.status(201).json(newuser);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

// Controller untuk mengupdate user
const updateuser = async (req, res) => {
  const { id } = req.params;
  const { nama_user, role, username, password } = req.body;
  try {
    // Cari user berdasarkan id
    const User = await user.findByPk(id);
    if (!User) {
      return res.status(404).json({ message: "User not found" });
    }

    // Jika ada password yang di-submit, lakukan hashing
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      User.password = hashedPassword;
    }

    // Update field lainnya jika ada
    User.nama_user = nama_user || User.nama_user;
    User.role = role || User.role;
    User.username = username || User.username;

    // Simpan perubahan
    await User.save();
    res.status(200).json(User);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

// Controller untuk menghapus user
const deleteuser = async (req, res) => {
  const { id } = req.params;
  try {
    const User = await user.findByPk(id);
    if (!User) {
      return res.status(404).json({ message: "user not found" });
    }

    await User.destroy(); // Hapus user
    res.status(200).json({ message: "user deleted successfully", User });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

const findByRole = async (req, res) => {
  const { role } = req.params
  try {
    const User = await user.findAll({where: {role : role}})
    if(User.length > 0){
      return res.status(200).json({
        data:User
      })
    }
    else{
      return res.status(404).json({
        message : "gada role kek gtu"
      })
    }
  } catch (error) {
      return res.status(400).json({
        message : error.message
      })
  }
}

module.exports = {
  getAllusers,
  getuserById,
  createuser,
  updateuser,
  deleteuser,
  findByRole
};
