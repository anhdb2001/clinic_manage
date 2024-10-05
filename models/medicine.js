const mongoose = require("mongoose");

const MedicineSchema = new mongoose.Schema({
  medicine_code: { type: String, required: true, unique: true }, // Mã số thuốc
  medicine_name: { type: String, required: true }, // Tên thuốc
  price: { type: Number, required: true }, // Giá tiền thuốc
});

module.exports = mongoose.model("Medicine", MedicineSchema);
