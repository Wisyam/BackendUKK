const { meja } = require("../models/index");

exports.getAllMeja = async (req, res) => {
  try {
    const Meja = await meja.findAll();
    res.status(200).json(Meja);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getMejaById = async (req, res) => {
  const { id } = req.params;
  try {
    const Meja = await meja.findByPk(id);
    res.status(200).json(Meja);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.addMeja = async (req, res) => {
  const { nomor_meja } = req.body;
  try {
    const existingMeja = await meja.findOne({ where: { nomor_meja } });
    if (existingMeja) {
      return res.status(400).json({ message: "Nomor meja already exists" });
    }
    const newMeja = await meja.create({ nomor_meja });
    res.status(201).json({ message: "Meja added successfully", newMeja });
  } catch (error) {
    res.json({
      message: "Error adding meja",
      error,
    });
    console.log(error.message)
  }
};

exports.updateMeja = async (req, res) => {
  const { id } = req.params; // Ambil id meja dari URL parameter
  const { nomor_meja } = req.body;
  try {
    const Meja = await meja.findByPk(id);
    if (!Meja) {
      return res.status(404).json({ message: "Meja not found" });
    }

    // Cek apakah nomor_meja baru sudah ada di database (duplikasi)
    const existingMeja = await meja.findOne({ where: { nomor_meja } });
    if (existingMeja && existingMeja.id !== id) {
      return res.status(400).json({ message: "Nomor meja already exists" });
    }

    // Update nomor meja
    Meja.nomor_meja = nomor_meja;
    await Meja.save(); // Simpan perubahan

    res.status(200).json({ message: "Meja updated successfully", meja });
  } catch (error) {
    res.status(500).json({ message: "Error updating meja", error });
  }
};

exports.deleteMeja = async (req, res) => {
  const { id } = req.params;
  try {
    const Meja = await meja.findByPk(id);
    if (!Meja) {
      return res.status(404).json({ message: "meja not found" });
    }

    await Meja.destroy(); // Hapus user
    res.status(200).json({ message: "meja deleted successfully", Meja });
  } catch (error) {
    res.status(500).json({ message: "Error deleting meja", error });
  }
};


// exports.mejaStatus = async (req, res) => {
//   const { status } = req.params
//   try {
//     const Meja = await meja.findAll({where: {status}})
//     if(Meja.length > 0){
//       return res.status(200).json({
//         data:Meja
//       })
//     }
//     else{
//       return res.status(404).json({
//         message : "gada role kek gtu"
//       })
//     }
//   } catch (error) {
//       return res.status(400).json({
//         message : error.message
//       })
//   }
// } //disable aja dlu soalnya gwe gapake status di db