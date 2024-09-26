const { menu } = require('../models'); // Import model menu
const { Op } = require('sequelize')
const fs = require('fs')
const path = require('path')
const uploud = require('./uplou.controller').single(`image`)
// GET: Mengambil semua menu
exports.findAllMenu = async (req, res) => {
  try {
    const menus = await menu.findAll();
    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving menus", error });
  }
};

// GET: Mengambil menu berdasarkan ID
exports.findMenuById = async (req, res) => {
  const { id } = req.params;
  try {
    const menus = await menu.findByPk(id);
    if (!menus) {
      return res.status(404).json({ message: "menu not found" });
    }
    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving menu", error });
  }
};

// POST: Menambah menu baru
exports.addMenu = async (req, res) => {
  uploud(req, res, async function (err) {
    if (err) {
      // Jika terjadi error saat upload gambar
      return res.status(400).json({ message: err });
    }

    const { nama_menu, jenis, deskripsi, harga } = req.body;
    
    // Validasi apakah ada file yang diupload
    const image = req.file ? req.file.filename : null;

    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    try {
      // Membuat menu baru dengan data yang diterima
      const newMenu = await menu.create({
        nama_menu,
        jenis,
        deskripsi,
        gambar : image, // Simpan nama file gambar
        harga
      });

      // Jika berhasil, kirim respon dengan data menu yang baru
      res.status(201).json(newMenu);
    } catch (error) {
      // Jika terjadi error, kirim pesan error
      res.status(500).json({ message: error.message });
      console.log(error.message);
    }
  });
};

// PUT: Mengupdate menu berdasarkan ID
exports.updateMenu = async (req, res) => {
  const { id } = req.params;
  uploud(req, res, async function (err) {
    if (err) {
      // Jika terjadi error saat upload gambar
      return res.status(400).json({ message: err });
    }

    const { nama_menu, jenis, deskripsi, harga } = req.body;

    try {
      const menus = await menu.findByPk(id);
      if (!menus) {
        return res.status(404).json({ message: "menu not found" });
      }

      // Update fields
      menus.nama_menu = nama_menu || menus.nama_menu;
      menus.jenis = jenis || menus.jenis;
      menus.deskripsi = deskripsi || menus.deskripsi;
      menus.harga = harga || menus.harga;

      // Jika ada file gambar yang baru di-upload, hapus gambar lama dan update dengan yang baru
      if (req.file) {
        // Hapus file gambar lama jika ada
        if (menus.gambar) {
          const oldImagePath = path.join(__dirname, '../image', menus.gambar);
          fs.unlink(oldImagePath, (err) => {
            if (err) {
              console.error('Error deleting old image:', err);
            }
          });
        }

        // Simpan nama file gambar baru
        menus.gambar = req.file.filename;
      }

      // Simpan perubahan ke database
      await menus.save();

      res.status(200).json({ message: "menu updated successfully", menus });
    } catch (error) {
      res.status(500).json({ message: "Error updating menu", error });
    }
  });
};

// DELETE: Menghapus menu berdasarkan ID
exports.deleteMenu = async (req, res) => {
  const { id } = req.params;
  try {
    const menus = await menu.findByPk(id);
    if (!menus) {
      return res.status(404).json({ message: "menu not found" });
    }

    await menus.destroy(); // Hapus menu
    res.status(200).json({ message: "menu deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting menu", error });
  }
};
