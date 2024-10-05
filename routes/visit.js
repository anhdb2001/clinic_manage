const express = require("express");
const Visit = require("../models/visit");
const Medicine = require("../models/medicine");
const Doctor = require("../models/doctor");
const Nurse = require("../models/nurse");
const Patient = require("../models/patient");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const visit = await Visit.find();
    res.json(visit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    // Kiểm tra bác sĩ
    const doctorExists = await Doctor.findById(req.body.doctor);
    console.log(doctorExists);

    // Kiểm tra các y tá
    const nursePromises = req.body.nurses.map((nurseId) =>
      Nurse.findById(nurseId)
    );
    const nurses = await Promise.all(nursePromises);
    const allNursesExist = nurses.every((nurse) => nurse !== null);
    console.log(nurses);

    // Kiểm tra thuốc
    const treatmentPromises = req.body.treatments.map((treatmentId) =>
      Medicine.findById(treatmentId)
    );
    const treatments = await Promise.all(treatmentPromises);
    const allTreatmentsExist = treatments.every(
      (treatment) => treatment !== null
    );
    console.log(treatments);

    // Kiểm tra tất cả các thực thể
    let errorMessage = "";
    if (!doctorExists) errorMessage += "Doctor does not exist. ";
    if (!allNursesExist) errorMessage += "One or more nurses do not exist. ";
    if (!allTreatmentsExist)
      errorMessage += "One or more prescriptions do not exist.";

    if (errorMessage) {
      return res.status(400).send({ message: errorMessage.trim() });
    }

    // Tạo mới một lần khám
    const visit = new Visit(req.body);
    const newVisit = await visit.save();
    res.status(201).json(newVisit);
  } catch (error) {
    if (error.code === 11000) {
      // Mã lỗi cho vi phạm chỉ mục duy nhất
      res.status(400).send({ message: "ID already exists." });
    } else {
      res.status(500).send({ message: error.message });
    }
  }
});
// API để liệt kê bệnh theo bệnh nhân trong một tháng cho trước
router.get("/diseases", async (req, res) => {
  const { month, year } = req.query; // Nhận tháng và năm từ query

  if (!month || !year) {
    return res.status(400).json({ message: "Month and year are required." });
  }

  try {
    const visits = await Visit.find({
      admission_date: {
        $gte: new Date(year, month - 1, 1), // Ngày bắt đầu tháng
        $lt: new Date(year, month, 1), // Ngày bắt đầu tháng tiếp theo
      },
    })
      .populate("doctor", "name") // Thông tin bác sĩ
      .populate("nurses", "name") // Thông tin y tá
      .populate("treatments", "medicine_name"); // Thông tin thuốc

    // Đếm số lượng bệnh nhân mắc từng bệnh
    const diseaseCount = visits.reduce((acc, visit) => {
      if (!acc[visit.disease_name]) {
        acc[visit.disease_name] = new Set(); // Sử dụng Set để đảm bảo bệnh nhân không được tính nhiều lần
      }
      acc[visit.disease_name].add(visit.patient); // patient là ObjectId của bệnh nhân
      return acc;
    }, {});

    // Chuyển đổi kết quả sang định dạng dễ đọc
    const result = Object.keys(diseaseCount).map((disease) => ({
      disease_name: disease,
      patient_count: diseaseCount[disease].size, // Số lượng bệnh nhân duy nhất
    }));

    // Sắp xếp theo số lượng bệnh nhân giảm dần
    result.sort((a, b) => b.patient_count - a.patient_count);

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
