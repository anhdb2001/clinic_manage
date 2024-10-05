require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const doctorRoutes = require("./routes/doctor");
const patientRoutes = require("./routes/patient");
const nurseRoutes = require("./routes/nurse");
const visitRoutes = require("./routes/visit");
const medicineRoutes = require("./routes/medicine");
const revenueRoutes = require("./routes/calculateRevenue");

const app = express();
app.use(express.json()); // Parse JSON request

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Đã kết nối MongoDB");
  })
  .catch((error) => {
    console.error("Lỗi kết nối MongoDB:", error);
  });

// Routes
app.use("/api/doctor", doctorRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/nurse", nurseRoutes);
app.use("/api/visit", visitRoutes);
app.use("/api/medicine", medicineRoutes);
app.use("/api/revenue", revenueRoutes);

// Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server đang chạy trên cổng ${port}`);
});
