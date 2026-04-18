import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from "../Components/Sidebar";
import AppBar from '../UI/AppBar';
import DataTable from '../UI/DataTable';
import ExamResultApi from "../api/examResultApi";

export default function ExamResult() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const authUser = JSON.parse(localStorage.getItem("user") || "{}");
    const adminId =
        authUser?.id ||
        authUser?.admin_id ||
        localStorage.getItem("admin_id");

    const getPercentage = (correct, total) => {
        const safeCorrect = Number(correct) || 0;
        const safeTotal = Number(total) || 0;
        if (!safeTotal) return 0;
        return Number(((safeCorrect / safeTotal) * 100).toFixed(2));
    };

    const getRank = (percentage) => {
        if (percentage >= 95 && percentage <= 100) return "Champions of Champion";
        if (percentage >= 90 && percentage < 95) return "Champion";
        if (percentage >= 80 && percentage < 90) return "1st Rank";
        if (percentage >= 70 && percentage < 80) return "2nd Rank";
        if (percentage >= 60 && percentage < 70) return "3rd Rank";
        return "Participant";
    };

    const getGrade = (percentage) => {
        if (percentage >= 95 && percentage <= 100) return "A++";
        if (percentage >= 90 && percentage < 95) return "A+";
        if (percentage >= 80 && percentage < 90) return "A";
        if (percentage >= 70 && percentage < 80) return "B";
        if (percentage >= 60 && percentage < 70) return "C";
        if (percentage >= 50 && percentage < 60) return "D";
        return "F";
    };

    const columns = [
        { key: "name", label: "Student Name" },
        // { key: "username", label: "Username" },
        // { key: "mobilenumber", label: "Mobile Number" },
        { key: "address", label: "Address" },
        { key: "learning_center_name", label: "Learning Center" },
        // { key: "age", label: "Age" },
        { key: "exam_name", label: "Exam Name" },
        { key: "exam_level", label: "Exam Level" },
        // { key: "paper_set", label: "Paper Set" },
        { key: "date", label: "Exam Date", isDate: true },
        // { key: "exam_start_at", label: "Start Time" },
        // { key: "exam_end_at", label: "End Time" },
        { key: "exam_time", label: "Exam Time" },
        { key: "time_taken", label: "Time Taken" },
        { key: "total_question", label: "Total Questions" },
        { key: "total_solve", label: "Solved" },
        { key: "total_unsolve", label: "Unsolved" },
        { key: "total_correct", label: "Correct" },
        // { key: "percentage", label: "Percentage" },
        // { key: "grade", label: "Grade" },
        { key: "rank", label: "Rank" },
        // { key: "status", label: "Status" },
    ];

    const formatDate = (value) => {
        if (!value) return "";
        return new Date(value).toLocaleDateString("en-GB", {
            timeZone: "Asia/Kolkata"
        });
    };

    const formatTime = (value) => {
        if (!value) return "";
        return new Date(value).toLocaleTimeString("en-IN", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        });
    };

    useEffect(() => {
        if (!adminId) {
            console.log("adminId not found");
            setData([]);
            return;
        }

        const fetchResults = async () => {
            try {
                setLoading(true);
                console.log("Calling API with adminId:", adminId);

                const res = await ExamResultApi.getExamResultsByAdmin(adminId);

                console.log("API response:", res?.data);

                const payload = res?.data?.data || [];

                const submittedOnly = Array.isArray(payload)
                    ? payload.filter((item) => item.status === "SUBMITTED")
                    : [];

                setData(submittedOnly);
            } catch (error) {
                console.error("Failed to fetch exam results:", error);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [adminId]);

    const tableData = useMemo(() => {
        return (data || []).map((item) => {
            const totalQuestion = item.total_question ?? 0;
            const totalCorrect = item.total_correct ?? 0;
            const percentage = getPercentage(totalCorrect, totalQuestion);

            return {
                id: item.id,
                user_id: item.user_id,
                name: item.name || "",
                username: item.username || "",
                mobilenumber: item.mobilenumber || "",
                address: item.address || "",
                learning_center_name: item.learning_center_name || "",
                age: item.age || "",
                exam_name: item.exam_name || "",
                exam_level: item.exam_level || "",
                paper_set: item.paper_set || "",
                date: formatDate(item.date),
                exam_start_at: formatTime(item.exam_start_at),
                exam_end_at: formatTime(item.exam_end_at),
                exam_time: item.exam_time || "",
                time_taken: item.time_taken || "",
                total_question: totalQuestion,
                total_solve: item.total_solve ?? 0,
                total_unsolve: item.total_unsolve ?? 0,
                total_correct: totalCorrect,
                percentage: `${percentage}%`,
                grade: getGrade(percentage),
                rank: getRank(percentage),
                status: item.status || "",
            };
        });
    }, [data]);

    return (
        <>
            {/* <Sidebar
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
            />

            <main
                className={`
                    transition-all duration-500
                    ${isCollapsed ? "md:ml-20" : "md:ml-64"}
                    px-2 md:px-8 py-6 mb-12
                `}
            >
                <AppBar
                    title="Exam Results"
                    subtitle="View and manage exam results for students"
                /> */}

                <div className="mt-8">
                    <DataTable
                        columns={columns}
                        data={tableData}
                        title="Exam Results"
                        searchable
                        pagination
                        loading={loading}
                        exportable={true}
                        showActions={false}
                    />
                </div>
            {/* </main> */}
        </>
    );
}