const express = require("express");
// Định nghĩa mô hình (schema) cho collections
const Visit = require("../models/visit"); // Thay đổi đường dẫn nếu cần
// const Prescription = require("./models/Prescription"); // Thay đổi đường dẫn nếu cần
const Medicine = require("../models/medicine"); // Thay đổi đường dẫn nếu cần
const router = express.Router();

// API để tính tổng doanh thu
router.get("/", async (req, res) => {
  try {
    // Lấy tất cả các lượt khám
    const visits = await Visit.find({}).populate("treatments"); // Populates medicines

    let totalRevenue = 0;

    // Lặp qua từng lượt khám
    for (const visit of visits) {
      const visitCost = visit.total_cost || 0; // Lấy chi phí khám

      // Tính tổng chi phí thuốc cho lượt khám này
      let totalMedicineCost = 0;
      for (const medicineId of visit.treatments) {
        const medicine = await Medicine.findById(medicineId);
        totalMedicineCost += medicine.price || 0; // Cộng dồn chi phí thuốc
      }

      // Cộng dồn tổng doanh thu
      totalRevenue += visitCost + totalMedicineCost;
    }

    // Trả về tổng doanh thu
    res.json({ total_revenue: totalRevenue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Có lỗi xảy ra khi truy xuất dữ liệu." });
  }
});
module.exports = router;
