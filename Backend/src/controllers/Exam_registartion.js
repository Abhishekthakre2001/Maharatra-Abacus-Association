const ExamRegistration = require("../models/Exam_registartion");
const exportToExcel = require("../utils/excelExport");
const formatExcelData = require("../utils/formatExcelData");
const { getPaginationParams } = require("../utils/getPaginationParams");

exports.examRegistration = async (req, res) => {
  try {
    const result = await ExamRegistration.createRegistration(req.body);

    return res.status(201).json({
      success: true,
      message: "Registration Successful",
      userId: result.userId,
    });
  } catch (error) {
    console.error("Registration Error:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Username already exists.",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message || "Registration Failed",
    });
  }
};


exports.getByCreatedBy = async (req, res) => {
  try {
    const { createdby } = req.params;

    if (!createdby) {
      return res.status(400).json({
        success: false,
        message: "createdby is required"
      });
    }

    const { page, limit, search } =
      getPaginationParams(req);

    const result =
      await ExamRegistration.getByCreatedBy(
        createdby,
        page,
        limit,
        search
      );

    return res.status(200).json(result);

  } catch (error) {
    console.error("Fetch By CreatedBy Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch registrations"
    });
  }
};


exports.exportExamRegistrationData = async (req, res) => {
  try {
    const { createdby } = req.params;

    const result = await ExamRegistration.getByCreatedBy(
      createdby,
      1,
      999999,
      ""
    );

    const data = result.data || [];

    const formattedData = formatExcelData(
      data.map((item) => ({
        ...item,
        dob: item.dob
          ? new Date(item.dob).toLocaleDateString("en-IN")
          : "",
        subscription_end_date: item.subscription_end_date
          ? new Date(item.subscription_end_date).toLocaleDateString("en-IN")
          : "",
        registration_date: item.registration_date
          ? new Date(item.registration_date).toLocaleDateString("en-IN")
          : "",
      })),
      [
        {
          key: "name",
          label: "Student Name",
        },
        {
          key: "class",
          label: "Class",
        },
        {
          key: "learning_center_name",
          label: "Learning Center",
        },
        {
          key: "parent_name",
          label: "Parent Name",
        },
        {
          key: "mobilenumber",
          label: "Mobile Number",
        },
        {
          key: "whatsapp_number",
          label: "WhatsApp Number",
        },
        {
          key: "city",
          label: "City",
        },
        {
          key: "address",
          label: "Address",
        },
        {
          key: "age",
          label: "Age",
        },
        {
          key: "level",
          label: "Level",
        },
        {
          key: "username",
          label: "Username",
        },
        {
          key: "password",
          label: "Password",
        },
        {
          key: "dob",
          label: "Date of Birth",
        },
        {
          key: "subscription_end_date",
          label: "Subscription End Date",
        },
        {
          key: "registration_date",
          label: "Registration Date",
        },
      ]
    );

    const buffer = exportToExcel({
      data: formattedData,
      sheetName: "Exam Registrations",
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="exam-registrations.xlsx"'
    );

    return res.send(buffer);
  } catch (error) {
    console.error("Export Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};