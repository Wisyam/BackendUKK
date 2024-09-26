const { transaksi, detail_transaksi, menu, sequelize } = require('../models/index')
// const nowDate = new Date()
const { Op } = require('sequelize')

exports.getAllTransaksi = async (req, res) => {
    try {
        const data = await transaksi.findAll({
            include: [
                {
                    model: detail_transaksi,
                    as: 'detailTransaksi', // Sesuaikan dengan alias yang digunakan di relasi
                    include: [
                        {
                            model: menu,
                            as: 'menu' // Sesuaikan dengan alias yang digunakan di relasi
                        }
                    ]
                }
            ]
        });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get transaksi by ID including details and related menu
exports.getTransaksiById = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await transaksi.findByPk(id, {
            include: [
                {
                    model: detail_transaksi,
                    as: 'detailTransaksi', // Sesuaikan dengan alias yang digunakan di relasi
                    include: [
                        {
                            model: menu,
                            as: 'menu' // Sesuaikan dengan alias yang digunakan di relasi
                        }
                    ]
                }
            ]
        });
        if (!data) {
            return res.status(404).json({ message: 'Transaksi not found' });
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createTransaksi = async (req, res) => {
    const { user_id, meja_id, nama_pelanggan, status, detailTransaksi } = req.body;
    const nowDate = new Date(); // Mendapatkan tanggal transaksi saat ini
    
    try {
        // Buat transaksi baru
        const newTransaksi = await transaksi.create({
            user_id,
            meja_id,
            tgl_transaksi: nowDate,
            nama_pelanggan,
            status
        }); 

        // Buat detail transaksi dengan mengambil harga dari tabel menu
        if (detailTransaksi && Array.isArray(detailTransaksi)) {
            const details = [];

            for (const item of detailTransaksi) {
                // Cari menu berdasarkan menu_id untuk mendapatkan harga
                const menuItem = await menu.findByPk(item.menu_id);
                if (!menuItem) {
                    throw new Error(`Menu with id ${item.menu_id} not found`);
                }

                const count = item.count || 1; // Default count to 1 if not provided

                // Buat entry sebanyak 'count' kali
                for (let i = 0; i < count; i++) {
                    details.push({
                        transaksi_id: newTransaksi.transaksi_id, // ID transaksi yang baru dibuat
                        menu_id: item.menu_id,
                        harga: menuItem.harga // Ambil harga dari tabel menu
                    });
                }
            }

            // Simpan semua detail transaksi
            await detail_transaksi.bulkCreate(details);
        }

        res.status(201).json(newTransaksi);
    } catch (error) {
        res.status(500).json({ message: "Error creating transaksi", error: error.message });
    }
};

// Mengupdate transaksi berdasarkan ID
exports.updateTransaksi = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Enum status yang valid, pastikan ini sesuai dengan enum di database
    const validStatuses = ['pending', 'success'];

    try {
        // Cek apakah status yang dikirim valid
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        // Cari transaksi berdasarkan ID
        const transaksiToUpdate = await transaksi.findByPk(id);
        if (!transaksiToUpdate) {
            return res.status(404).json({ message: "Transaksi not found" });
        }

        // Update hanya kolom status
        transaksiToUpdate.status = status;

        // Simpan perubahan
        await transaksiToUpdate.save();
        res.status(200).json({ message: "Status updated successfully", transaksiToUpdate });
    } catch (error) {
        res.status(500).json({ message: "Error updating transaksi status", error: error.message });
    }
};

// Menghapus transaksi berdasarkan ID
exports.deleteTransaksi = async (req, res) => {
    const { id } = req.params;

    // Mulai transaksi Sequelize
    const t = await sequelize.transaction();

    try {
        const transaksiToDelete = await transaksi.findByPk(id, { transaction: t });
        if (!transaksiToDelete) {
            return res.status(404).json({ message: "Transaksi not found" });
        }

        // Hapus detail transaksi terkait terlebih dahulu
        await detail_transaksi.destroy({
            where: { transaksi_id: id },
            transaction: t
        });

        // Hapus transaksi utama
        await transaksiToDelete.destroy({ transaction: t });

        // Commit transaksi jika semua operasi berhasil
        await t.commit();

        res.status(200).json({ message: "Transaksi and its details deleted successfully" });
    } catch (error) {
        // Rollback jika ada error
        await t.rollback();
        res.status(500).json({ message: "Error deleting transaksi", error: error.message });
    }
};



// READING DATA SECTION

exports.getAllTransaksiByDate = async (req, res) => {
    const { tgl_transaksi } = req.body; // Ambil parameter tanggal dari query string

    try {
        // Query untuk mencari transaksi berdasarkan tanggal
        const transaksiList = await transaksi.findAll({
            where: {
                // Membandingkan hanya berdasarkan tanggal, abaikan waktu
                tgl_transaksi: {
                    [Op.between]: [
                        `${tgl_transaksi} 00:00:00`, // Awal hari
                        `${tgl_transaksi} 23:59:59`  // Akhir hari
                    ],
                },
            },
            include: [
                {
                    model: detail_transaksi,
                    as: 'detailTransaksi',
                    include: {
                        model: menu,
                        as: 'menu',
                    },
                },
            ],
        });

        // Jika transaksi tidak ditemukan
        if (transaksiList.length === 0) {
            return res.status(404).json({ message: "No transactions found on this date" });
        }

        // Berhasil, kembalikan data transaksi
        res.status(200).json(transaksiList);
    } catch (error) {
        res.status(500).json({ message: "Error fetching transactions", error: error.message });
    }
};


exports.getAllTransaksiByKasirId = async (req, res) => {
    const { kasir_id } = req.body; // Ambil parameter kasir_id dari body request

    try {
        // Query untuk mencari transaksi berdasarkan kasir_id
        const transaksiList = await transaksi.findAll({
            where: {
                user_id: kasir_id, // Menggunakan user_id untuk filter
            },
            include: [
                {
                    model: detail_transaksi,
                    as: 'detailTransaksi',
                    include: {
                        model: menu,
                        as: 'menu',
                    },
                },
            ],
        });

        // Jika transaksi tidak ditemukan
        if (transaksiList.length === 0) {
            return res.status(404).json({ message: "No transactions found for this kasir" });
        }

        // Berhasil, kembalikan data transaksi
        res.status(200).json(transaksiList);
    } catch (error) {
        res.status(500).json({ message: "Error fetching transactions", error: error.message });
    }
};

const { fn, col } = require('sequelize'); // Sequelize operator dan fungsi

exports.getMonthlyRevenue = async (req, res) => {
    const { month, year } = req.body; // Ambil parameter bulan dan tahun dari body request

    if (!month || !year || isNaN(month) || isNaN(year) || month < 1 || month > 12) {
        return res.status(400).json({ message: "Invalid month or year provided" });
    }

    try {
        // Dapatkan tanggal awal dan akhir bulan
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59); // Akhir bulan

        // Query untuk menghitung total pendapatan
        const totalRevenue = await detail_transaksi.findAll({
            attributes: [[fn('SUM', col('harga')), 'total_pendapatan']],
            include: [
                {
                    model: transaksi,
                    as: 'transaksi',
                    attributes: [],
                    where: {
                        tgl_transaksi: {
                            [Op.between]: [startDate, endDate], // Rentang waktu yang benar
                        },
                    },
                },
            ],
            raw: true,
        });

        if (!totalRevenue[0].total_pendapatan) {
            return res.status(200).json({ message: "No revenue found for this month", total_pendapatan: 0 });
        }

        res.status(200).json({ total_pendapatan: totalRevenue[0].total_pendapatan });
    } catch (error) {
        res.status(500).json({ message: "Error calculating monthly revenue", error: error.message });
    }
};

exports.getTransaksiByNamaPelanggan = async (req, res) => {
    const { nama_pelanggan } = req.body; // Ambil nama_pelanggan dari parameter URL

    try {
        // Cari semua transaksi yang sesuai dengan nama_pelanggan
        const transaksiData = await transaksi.findAll({
            where: {
                nama_pelanggan: nama_pelanggan
            },
            include: [
                {
                    model: detail_transaksi,
                    as: 'detailTransaksi',
                    include: [
                        {
                            model: menu,
                            as: 'menu',
                            attributes: ['nama_menu', 'harga'] // Ambil nama menu dan harga dari tabel menu
                        }
                    ]
                }
            ]
        });

        if (transaksiData.length === 0) {
            return res.status(404).json({ message: "No transactions found for this customer" });
        }

        res.status(200).json(transaksiData);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving transactions", error: error.message });
    }
};