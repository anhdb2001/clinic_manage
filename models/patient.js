const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  id_number: { type: String, required: true, unique: true }, // Chứng minh thư/CMT
  patient_code: { type: String, required: true, unique: true }, // Mã số bệnh nhân
  name: { type: String, required: true }, // Tên bệnh nhân
  birth_date: { type: Date, required: true }, // Ngày sinh
  address: { type: String, required: true }, // Địa chỉ
  phone_number: { type: String, required: true }, // Số điện thoại
});

module.exports = mongoose.model("Patient", patientSchema);
