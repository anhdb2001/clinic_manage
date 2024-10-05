const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  visit_code: { type: String, required: true, unique: true }, // Mã số lần khám
  admission_date: { type: Date, required: true }, // Ngày vào viện
  discharge_date: { type: Date }, // Ngày ra viện
  disease_name: { type: String, required: true }, // Tên bệnh
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  }, // Tham chiếu bệnh nhân
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  }, // Tham chiếu bác sĩ
  nurses: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Nurse", required: true },
  ], // Tham chiếu y tá
  treatments: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Medicine", required: true },
  ], // Tham chiếu thuốc kê đơn
  total_cost: { type: Number, required: true }, // Tổng chi phí
  isCured: { type: Boolean, default: false }, // Đã khỏi chưa
});

module.exports = mongoose.model("Visit", visitSchema);
