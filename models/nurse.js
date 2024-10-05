const mongoose = require("mongoose");

const nurseSchema = new mongoose.Schema({
  id_number: { type: String, required: true, unique: true }, // Chứng minh thư/CMT
  nurse_code: { type: String, required: true, unique: true }, // Mã số nhân viên
  name: { type: String, required: true }, // Tên y tá
  birth_date: { type: Date, required: true }, // Ngày sinh
  address: { type: String, required: true }, // Địa chỉ
  phone_number: { type: String, required: true }, // Số điện thoại
  education_level: { type: String, required: true }, // Trình độ đào tạo
  years_of_experience: { type: Number, required: true }, // Thâm niên
});

module.exports = mongoose.model("Nurse", nurseSchema);
