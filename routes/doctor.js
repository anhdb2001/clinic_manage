const express = require("express");
const Doctor = require("../models/doctor");
const { calculateDoctorSalary } = require("./utils/calculateSalary");
const router = express.Router();

// Lấy danh sách bác sĩ
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Tạo mới một bác sĩ
router.post("/", async (req, res) => {
  const doctor = new Doctor(req.body);

  try {
    const newDoctor = await doctor.save();
    res.status(201).json(newDoctor);
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
    const doctorSalaries = await calculateDoctorSalary(year, month);
    res.json(doctorSalaries);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Có lỗi xảy ra khi tính lương bác sĩ" });
  }
});

module.exports = router;
