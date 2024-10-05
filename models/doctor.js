const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  id_number: { type: String, required: true, unique: true }, // Chứng minh thư/CMT
  doctor_code: { type: String, required: true, unique: true }, // Mã số bác sĩ
  name: { type: String, required: true }, // Tên bác sĩ
  birth_date: { type: Date, required: true }, // Ngày sinh
  address: { type: String, required: true }, // Địa chỉ
  job_level: { type: String, required: true }, // Bậc nghề
  years_of_experience: { type: Number, required: true }, // Thâm niên
  education_level: { type: String, required: true }, // Trình độ đào tạo
  specializations: [{ type: String }], // Chuyên môn
});

module.exports = mongoose.model("Doctor", doctorSchema);
