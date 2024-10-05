const express = require("express");
const Patient = require("../models/patient");
const Visit = require("../models/visit");
const { getPatientDetails } = require("./utils/patientDetail");
const router = express.Router();

// Lấy danh sách bệnh nhân
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Tạo mới một bệnh nhân
router.post("/", async (req, res) => {
  const patient = new Patient(req.body);

  try {
    const newPatient = await patient.save();
    res.status(201).json(newPatient);
  } catch (error) {
    if (error.code === 11000) {
      // Mã lỗi cho vi phạm chỉ mục duy nhất
      res.status(400).send({ message: "ID already exists." });
    } else {
      res.status(500).send({ message: error.message });
    }
  }
});

// Cập nhật thông tin visits của bệnh nhân
router.put("/:patient_code/visits", async (req, res) => {
  const { visitId } = req.body; // ID của lần khám cần thêm vào bệnh nhân

  try {
    // Tìm bệnh nhân theo ID
    const patient = await Patient.findOne({
      patient_code: req.params.patient_code,
    });

    if (!patient) {
      return res.status(404).send({ message: "Patient not found." });
    }

    // Kiểm tra xem visitId có hợp lệ không
    const visit = await Visit.findOne({
      visit_code: visitId,
    });
    if (!visit) {
      return res.status(404).send({ message: "Visit not found." });
    }

    // Thêm visitId vào mảng visits của bệnh nhân
    if (!patient.visits.includes(visit._id)) {
      patient.visits.push(visit._id);
    } else {
      return res.status(400).send({ message: "Visit already added." });
    }

    // Lưu lại thông tin bệnh nhân đã được cập nhật
    await patient.save();

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.get("/diseases", async (req, res) => {
  try {
    // Nhận year và month từ query params (ví dụ: /api/diseases?year=2024&month=9)
    const { year, month } = req.query;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // Tìm tất cả các lượt khám trong khoảng thời gian
    const visits = await Visit.find({
      admission_date: {
        $gte: startDate,
        $lt: endDate,
      },
      // isCured: true, // Chỉ lấy các lần khám đã khỏi bệnh
    }).populate("patient"); // Lấy thông tin bệnh nhân

    const diseaseMap = new Map(); // Map để đếm số bệnh nhân cho mỗi loại bệnh

    visits.forEach((visit) => {
      const patientId = visit.patient._id.toString();
      const disease = visit.disease_name;

      if (!diseaseMap.has(disease)) {
        diseaseMap.set(disease, new Set());
      }

      // Thêm ID bệnh nhân vào danh sách Set (để tránh đếm trùng bệnh nhân nhiều lần)
      const patientSet = diseaseMap.get(disease);
      patientSet.add(patientId);

      // Cập nhật map
      diseaseMap.set(disease, patientSet);
    });

    // Biến đổi Map thành danh sách các bệnh với số lượng bệnh nhân
    const result = Array.from(diseaseMap.entries()).map(
      ([disease, patientSet]) => ({
        disease,
        patient_count: patientSet.size, // Đếm số bệnh nhân
      })
    );

    // Sắp xếp theo số bệnh nhân giảm dần
    result.sort((a, b) => b.patient_count - a.patient_count);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/:id", async (req, res) => {
  const patientId = req.params.id; // Lấy ID bệnh nhân từ URL
  const result = await getPatientDetails(patientId); // Gọi hàm lấy thông tin bệnh nhân
  if (result.error) {
    return res.status(404).json({ error: result.error });
  }
  return res.status(200).json(result); // Trả về kết quả dưới dạng JSON
});

module.exports = router;
