const Doctor = require("../../models/doctor");
const Nurse = require("../../models/nurse");
const Visit = require("../../models/visit");

// Hàm tính lương bác sĩ
const calculateDoctorSalary = async (year, month) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  // Lấy tất cả các bác sĩ từ cơ sở dữ liệu
  const doctors = await Doctor.find(); // Giả sử đây là mô hình bác sĩ
  const visits = await Visit.find({
    admission_date: { $gte: startDate, $lt: endDate },
  });

  const doctorMap = new Map();

  // Tạo số liệu ban đầu cho tất cả các bác sĩ
  doctors.forEach((doctor) => {
    doctorMap.set(doctor._id.toString(), {
      completedTreatments: 0,
      doctorName: doctor.name,
      doctorCode: doctor.doctor_code,
    });
  });

  // Cập nhật số liệu cho các bác sĩ có lượt khám và chữa khỏi
  visits.forEach((visit) => {
    const doctorId = visit.doctor._id.toString(); // Lấy ID bác sĩ
    const isCured = visit.isCured; // Kiểm tra tình trạng chữa khỏi

    if (isCured && doctorMap.has(doctorId)) {
      const doctorData = doctorMap.get(doctorId);
      doctorData.completedTreatments += 1;
      doctorMap.set(doctorId, doctorData);
    }
  });
  console.log(doctorMap);

  // Tính toán lương cho tất cả các bác sĩ
  const doctorSalaries = [];
  for (let [doctorId, doctorData] of doctorMap.entries()) {
    const baseSalary = 7000000; // Lương cơ bản
    const bonus = doctorData.completedTreatments * 1000000; // Thưởng theo số lượt chữa khỏi
    const totalSalary = baseSalary + bonus;

    doctorSalaries.push({
      code: doctorData.doctorCode,
      doctor: doctorData.doctorName,
      completedTreatments: doctorData.completedTreatments,
      baseSalary,
      totalSalary,
    });
  }

  // Trả về thông tin lương bác sĩ
  return doctorSalaries;
};

// Hàm tính lương y tá
const calculateNurseSalary = async (year, month) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  // Lấy tất cả các y tá từ cơ sở dữ liệu
  const nurses = await Nurse.find(); // Giả sử đây là mô hình y tá
  const visits = await Visit.find({
    admission_date: { $gte: startDate, $lt: endDate },
  });

  const nurseMap = new Map();

  // Tạo số liệu ban đầu cho tất cả các y tá
  nurses.forEach((nurse) => {
    nurseMap.set(nurse._id.toString(), {
      numOfVisits: 0,
      nurseName: nurse.name,
      nurseCode: nurse.nurse_code,
    });
  });

  // Cập nhật số liệu cho các y tá có lượt hỗ trợ
  visits.forEach((visit) => {
    visit.nurses.forEach((nurseId) => {
      nurseId = nurseId.toString();

      if (nurseMap.has(nurseId)) {
        const nurseData = nurseMap.get(nurseId);
        nurseData.numOfVisits += 1;
        nurseMap.set(nurseId, nurseData);
      }
    });
  });

  // Tính toán lương cho tất cả các y tá
  const nurseSalaries = [];
  for (let [nurseId, nurseData] of nurseMap.entries()) {
    const baseSalary = 5000000; // Lương cơ bản
    const bonus = nurseData.numOfVisits * 200000; // Thưởng theo số lượt hỗ trợ
    const totalSalary = baseSalary + bonus;

    nurseSalaries.push({
      code: nurseData.nurseCode,
      nurse: nurseData.nurseName,
      numOfVisits: nurseData.numOfVisits,
      baseSalary,
      totalSalary,
    });
  }

  // Trả về thông tin lương y tá
  return nurseSalaries;
};

module.exports = {
  calculateDoctorSalary,
  calculateNurseSalary,
};
