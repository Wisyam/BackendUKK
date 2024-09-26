const mejaController = require('../controller/meja.controller'); // Ubah ke meja controller
const express = require('express');
const authController = require('../controller/auth.controller')
const app = express();
app.use(express.json());

// Route untuk mengambil semua meja
app.get('/', authController.authenticate, authController.authorize('admin'), mejaController.getAllMeja);

// Route untuk mengambil meja berdasarkan ID
app.get('/:id', authController.authenticate, authController.authorize('admin'), mejaController.getMejaById);

// Route untuk menambah meja baru
app.post('/', authController.authenticate, authController.authorize('admin'), mejaController.addMeja);

// Route untuk mengupdate meja
app.put('/:id', authController.authenticate,authController.authenticate, authController.authorize('admin'), mejaController.updateMeja);

// Route untuk menghapus meja
app.delete('/:id', authController.authenticate, authController.authorize('admin'), mejaController.deleteMeja);

module.exports = app;
