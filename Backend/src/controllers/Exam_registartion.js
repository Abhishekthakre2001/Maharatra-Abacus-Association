const ExamRegistration = require("../models/Exam_registartion");

exports.examRegistration = async (req, res) => {
    try {

        const result = await ExamRegistration.createWithTransaction(req.body);

        return res.status(201).json({
            success: true,
            message: "Exam Registration Successful",
            userId: result.userId
        });

    } catch (error) {
        console.error("Registration Error:", error);

        // ✅ Duplicate username error
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "Username already exists. Please choose another username."
            });
        }

        // ✅ Other DB errors
        if (error.code) {
            return res.status(400).json({
                success: false,
                message: "Database error occurred"
            });
        }

        // ✅ Unknown errors
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
