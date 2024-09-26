const express = require('express');
const menuController = require('../controller/menu.controller');
const authController = require('../controller/auth.controller')
const app = express();
app.use(express.json());

// Route untuk mengambil semua menu
app.get('/', authController.authenticate, authController.authorize('admin'), menuController.findAllMenu);

// Route untuk mengambil menu berdasarkan ID
app.get('/:id', authController.authenticate, authController.authorize('admin'), menuController.findMenuById);

// Route untuk menambah menu baru
app.post('/', authController.authenticate, authController.authorize('admin'), menuController.addMenu);

// Route untuk mengupdate menu
app.put('/:id', authController.authenticate, authController.authorize('admin'), menuController.updateMenu);

// Route untuk menghapus menu
app.delete('/:id', authController.authenticate, authController.authorize('admin'), menuController.deleteMenu);

module.exports = app;
