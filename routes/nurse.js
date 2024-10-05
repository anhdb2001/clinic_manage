const express = require("express");
const Nurse = require("../models/nurse");
const { calculateNurseSalary } = require("./utils/calculateSalary");
const router = express.Router();

// Lấy danh sách bệnh nhân
router.get("/", async (req, res) => {
  try {
    const nurse = await Nurse.find();
    res.json(nurse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Tạo mới một bệnh nhân
router.post("/", async (req, res) => {
  const nurse = new Nurse(req.body);

  try {
    const newNurse = await nurse.save();
    res.status(201).json(newNurse);
  } catch (error) {
    if (error.code === 11000) {
      // Mã lỗi cho vi phạm chỉ mục duy nhất
      res.status(400).send({ message: "ID already exists." });
    } else {
      res.status(500).send({ message: error.message });
    }
  }
});

router.get("/salary/:year/:month", async (req, res) => {
  const { year, month } = req.params;
  try {
    const doctorSalaries = await calculateNurseSalary(year, month);
    res.json(doctorSalaries);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Có lỗi xảy ra khi tính lương y tá" });
  }
});
module.exports = router;
