const userController = require('../controller/user.controller')
const express = require('express');
const authController = require('../controller/auth.controller')
const app = express()
app.use(express.json())


app.post('/login', authController.login)

app.get('/', authController.authenticate, authController.authorize(["manager", "admin"]), userController.getAllusers);

// Route untuk mengambil user berdasarkan ID
app.get('/:id', authController.authenticate, authController.authorize('admin'), userController.getuserById);

app.get('/role/:role', authController.authenticate, authController.authorize('admin'), userController.findByRole);

// Route untuk menambah user baru
app.post('/', authController.authenticate, authController.authorize('admin'), userController.createuser); // Route untuk menambah user baru

// Route untuk mengupdate user
app.put('/:id', authController.authenticate, authController.authorize('admin'), userController.updateuser);

// Route untuk menghapus user
app.delete('/:id', authController.authenticate, authController.authorize('admin'), userController.deleteuser);

module.exports = app