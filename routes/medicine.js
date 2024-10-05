const express = require("express");
const Medicine = require("../models/medicine");
const router = express.Router();

// Lấy danh sách đơn thuốc
router.get("/", async (req, res) => {
  try {
    const medicine = await Medicine.find();
    res.json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Tạo mới một bệnh nhân
router.post("/", async (req, res) => {
  const medicine = new Medicine(req.body);

  try {
    const newMedicine = await medicine.save();
    res.status(201).json(newMedicine);
  } catch (error) {
    if (error.code === 11000) {
      // Mã lỗi cho vi phạm chỉ mục duy nhất
      res.status(400).send({ message: "ID already exists." });
    } else {
      res.status(500).send({ message: error.message });
    }
  }
});

module.exports = router;
