const { ObjectId } = require("mongodb"); // Nhập ObjectId từ mongodb
const patient = require("../../models/patient");
const visit = require("../../models/visit");

async function getPatientDetails(patientId) {
  try {
    // Lấy thông tin bệnh nhân
    const patientRecord = await patient.findById(patientId);
    if (!patientRecord) {
      console.log("Patient not found");
      return { error: "Patient not found" }; // Trả về thông báo lỗi
    }

    // Lấy danh sách tất cả các lần khám của bệnh nhân và nhóm theo bệnh
    const visits = await visit
      .find({ patient: patientId }) // Khởi tạo ObjectId đúng cách
      .sort({ admission_date: 1 }); // Sắp xếp theo ngày khám tăng dần

    // Nhóm theo bệnh và tính toán số lần khám
    const diseaseMap = {};
    visits.forEach((visit) => {
      const diseaseName = visit.disease_name;
      if (!diseaseMap[diseaseName]) {
        diseaseMap[diseaseName] = {
          disease_name: diseaseName,
          totalVisits: 0,
          latestAdmissionDate: visit.admission_date,
          currentStatus: visit.isCured ? "Cured" : "Under Treatment",
          visitData: [],
        };
      }
      diseaseMap[diseaseName].totalVisits += 1;
      diseaseMap[diseaseName].latestAdmissionDate = visit.admission_date;
      diseaseMap[diseaseName].currentStatus = visit.isCured
        ? "Cured"
        : "Under Treatment";

      // Thêm thứ tự lần khám vào visitData
      diseaseMap[diseaseName].visitData.push({
        visit_code: visit.visit_code,
        admission_date: visit.admission_date,
        discharge_date: visit.discharge_date,
        total_cost: visit.total_cost,
        isCured: visit.isCured,
        currentStatus: visit.isCured ? "Cured" : "Under Treatment",
        visit_order: diseaseMap[diseaseName].totalVisits, // Thêm trường visit_order
      });
    });

    const diseaseStatus = Object.values(diseaseMap); // Chuyển đổi map thành mảng

    // Gộp thông tin vào đối tượng cuối cùng
    const result = {
      patientInfo: {
        _id: patientRecord._id,
        patient_code: patientRecord.patient_code,
        name: patientRecord.name,
        birth_date: patientRecord.birth_date,
        address: patientRecord.address,
        phone_number: patientRecord.phone_number,
        diseaseStatus, // Chỉ trả về trạng thái bệnh
      },
    };

    return result; // Trả về kết quả
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while retrieving patient details" }; // Trả về thông báo lỗi nếu có lỗi
  }
}

module.exports = { getPatientDetails };
