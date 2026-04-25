import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from "../Components/Sidebar";
import AppBar from '../UI/AppBar';
import DataTable from '../UI/DataTable';
import ExamResultApi from "../api/examResultApi";
import examScheduleApi from "../api/examScheduleApi";


export default function Examnotattemp() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [examList, setExamList] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);

    const [selectedRow, setSelectedRow] = useState(null);

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
        { key: "exam_status", label: "Status" },
        { key: "username", label: "Username" },
        { key: "mobilenumber", label: "Mobile Number" },
        { key: "address", label: "Address" },
        // { key: "learning_center_name", label: "Learning Center" },
        // { key: "age", label: "Age" },
        { key: "exam_title", label: "Exam Name" },
        { key: "exam_level", label: "Exam Level" },
        // { key: "paper_set", label: "Paper Set" },
        // { key: "date", label: "Exam Date", isDate: true },
        { key: "exam_start_at", label: "Start Time" },
        { key: "exam_end_at", label: "End Time" },
        { key: "exam_time", label: "Exam Time" },
        { key: "time_taken", label: "Time Taken" },
        { key: "total_question", label: "Total Questions" },
        { key: "total_solve", label: "Solved" },
        { key: "total_unsolve", label: "Unsolved" },
        { key: "total_correct", label: "Correct" },
        // { key: "percentage", label: "Percentage" },
        // { key: "grade", label: "Grade" },
        // { key: "rank", label: "Rank" },

    ];

    const formatDate = (value) => {
        if (!value) return "";
        const date = new Date(value);
        return date.toLocaleDateString("en-GB", {
            timeZone: "UTC",
        });
    };

    const formatTime = (value) => {
        if (!value) return "";
        const date = new Date(value);
        return date.toLocaleTimeString("en-GB", {
            timeZone: "UTC",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });
    };

    const fetchResults = async (examId, level) => {
        if (!examId && examId !== 0) return;


        // const examId = 15;
        // const level = 0;

        try {
            setLoading(true);
            const res = await ExamResultApi.getExamResultsBylevelnotattempt(examId, level);
            const payload = res?.data?.data || [];
            setData(Array.isArray(payload) ? payload : []);
        } catch (error) {
            console.error("Failed to fetch exam results:", error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchExamList = async () => {
        try {
            const res = await examScheduleApi.getByadmin(adminId);
            setExamList(res?.data || []);
        } catch (err) {
            console.error("Failed to fetch exam list", err);
            setExamList([]);
        }
    };

    useEffect(() => {
        fetchExamList();
    }, []);

    useEffect(() => {
        fetchResults();
    }, []);


    const handleExamChange = (e) => {
        const value = JSON.parse(e.target.value);

        setSelectedExam(value);

        fetchResults(value.id, value.exam_level);
    };

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
                // learning_center_name: item.learning_center_name || "",
                // age: item.age || "",
                exam_title: item.exam_title || "",
                exam_level: item.exam_level ?? item.level ?? "",
                // paper_set: item.paper_set || "",
                // date: formatDate(item.date),
                exam_start_at: formatTime(item.exam_start_at),
                exam_end_at: formatTime(item.exam_end_at),
                exam_time: item.exam_time || "",
                time_taken: item.time_taken || "",
                total_question: totalQuestion,
                total_solve: item.total_solve ?? 0,
                total_unsolve: item.total_unsolve ?? 0,
                total_correct: totalCorrect,
                // percentage: `${percentage}%`,
                // grade: getGrade(percentage),
                // rank: getRank(percentage),
                exam_status: item.exam_status || "",
            };
        });
    }, [data]);

    return (
        <>


            <Sidebar
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
                />

                <div className="mt-8">

                    <div className="mb-4">
                        <select
                            className="border px-3 py-2 rounded w-full md:w-1/3"
                            onChange={handleExamChange}
                            defaultValue=""
                        >
                            <option value="" disabled>Select Exam</option>

                            {examList.map((exam) => (
                                <option
                                    key={exam.id}
                                    value={JSON.stringify({
                                        id: exam.id,
                                        exam_level: exam.exam_level
                                    })}
                                >
                                    {exam.exam_level} - {exam.paper_set} - {exam.exam_title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <DataTable
                        columns={columns}
                        data={tableData}
                        title="Exam Status List"
                        searchable
                        pagination
                        loading={loading}
                        exportable={true}
                        showActions={true}
                    // onDelete={handleDelete}
                    />
                </div>
            </main>
        </>
    );
}