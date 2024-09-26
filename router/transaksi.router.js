const express = require('express')
const transaksiController = require('../controller/transaksi.controller')
const authController = require('../controller/auth.controller')
const app = express()
app.use(express.json())

app.get('/', authController.authenticate, authController.authorize(['manager', 'kasir']), transaksiController.getAllTransaksi)
app.get('/tgl', authController.authenticate, authController.authorize('manager'), transaksiController.getAllTransaksiByDate)
app.get('/kasir', authController.authenticate, authController.authorize('manager'), transaksiController.getAllTransaksiByKasirId)
app.get('/smonth', authController.authenticate, authController.authorize('manager'), transaksiController.getMonthlyRevenue)
app.get('/pelanggan', authController.authenticate, authController.authorize('manager'), transaksiController.getTransaksiByNamaPelanggan)

app.get('/:id', authController.authenticate, authController.authorize('manager'), transaksiController.getTransaksiById)

app.post('/', authController.authenticate, authController.authorize('kasir'), transaksiController.createTransaksi)

app.put('/:id', authController.authenticate, authController.authorize('kasir'), transaksiController.updateTransaksi)

app.delete('/:id', authController.authenticate, authController.authorize('manager'), transaksiController.deleteTransaksi)

module.exports = app