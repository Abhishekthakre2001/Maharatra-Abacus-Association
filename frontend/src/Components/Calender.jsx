import React, { useState } from "react";
import AppBar from "../UI/AppBar";
import Button from "../UI/Button";
import InputField from "../UI/InputField";
import Modal from "../UI/Modal";
import { Calendar1, MoveLeft, MoveRight, Trash2 } from 'lucide-react';
import { useCreate } from "../hooks/useCreate";
import examScheduleApi from "../api/examScheduleApi";
import { useFetchData } from "../hooks/useFetchData";
import { useUpdate } from "../hooks/useUpdate";
import { useDelete } from "../hooks/useDelete";


export default function Calender() {

    const levels = [
        { id: 1, level: 1 },
        { id: 2, level: 2 },
        { id: 3, level: 3 },
        { id: 4, level: 4 },
        { id: 5, level: 5 }
    ];

    const paperSets = [
        { id: "A", name: "Set A" },
        { id: "B", name: "Set B" },
        { id: "C", name: "Set C" },
        { id: "D", name: "Set D" }
    ];



    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today);
    const [selectedDate, setSelectedDate] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const [examData, setExamData] = useState({
        exam_title: "",
        exam_level: "",
        paper_set: "",
        start_time: "",
        end_time: ""
    });


    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);

    // const handleSave = () => {
    //     console.log({
    //         date: selectedDate,
    //         ...examData,
    //     });
    //     setOpenModal(false);
    //     setExamData({ examName: "", examTime: "" });
    // };


    const { create } = useCreate(examScheduleApi.create, () => {
        reload(); // reload schedules
        setOpenModal(false);
    });

    const handleSave = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        create({
            ...examData,
            date: selectedDate,
            createdby: user.id
        });
    };

    const user = JSON.parse(localStorage.getItem("user"));

    const { data: schedules, reload } = useFetchData(() => examScheduleApi.getByadmin(user.id));


    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toISOString().split("T")[0];
    };

    const filteredSchedules = schedules.filter(
        (exam) => formatDate(exam.date) === selectedDate
    );

    const handleDelete = (id) => {
        if (!window.confirm("Are you sure you want to delete this exam?")) return;
        remove(id);
    };


    const { remove, loading: deleteLoading } = useDelete(
        examScheduleApi.delete,
        () => {
            reload(); // refresh list after delete
        }
    );



    return (
        <>
            <AppBar
                title="Student Management"
                subtitle="Exam Schedule Calendar"
            />

            <div className="p-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* CALENDAR */}
                <div className="bg-white rounded-2xl shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <Button
                            onClick={() => setCurrentMonth(new Date(year, month - 1))}
                            variant="secondary"
                            size="sm"
                        >
                            <MoveLeft />
                        </Button>

                        <h2 className="text-lg font-semibold">
                            {currentMonth.toLocaleString("default", {
                                month: "long",
                            })}{" "}
                            {year}
                        </h2>

                        <Button
                            onClick={() => setCurrentMonth(new Date(year, month + 1))}
                            variant="secondary"
                            size="sm"
                        >
                            <MoveRight />
                        </Button>
                    </div>

                    {/* WEEK DAYS */}
                    <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500 mb-2">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                            (day) => (
                                <div key={day}>{day}</div>
                            )
                        )}
                    </div>

                    {/* DATES */}
                    <div className="grid grid-cols-7 gap-2">
                        {days.map((day, i) => {
                            const fullDate =
                                day &&
                                `${year}-${String(month + 1).padStart(
                                    2,
                                    "0"
                                )}-${String(day).padStart(2, "0")}`;

                            return (
                                <div
                                    key={i}
                                    onClick={() => day && setSelectedDate(fullDate)}
                                    className={`
                                        h-12 flex items-center justify-center rounded-xl cursor-pointer
                                        ${!day ? "bg-transparent cursor-default" : ""}
                                        ${selectedDate === fullDate
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 hover:bg-blue-100"}
                                    `}
                                >
                                    {day}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT PANEL */}
                {/* RIGHT PANEL */}
                <div className="bg-white rounded-2xl shadow p-6">
                    <h3 className="text-lg font-semibold mb-3">
                        Exam Schedule
                    </h3>

                    {!selectedDate ? (
                        <p className="text-gray-500">
                            Select a date from calendar
                        </p>
                    ) : (
                        <>
                            <p className="text-gray-600 mb-4 flex gap-2 items-center">
                                <Calendar1 />
                                Selected Date:
                                <span className="font-medium">
                                    {selectedDate}
                                </span>
                            </p>

                            {/* ✅ ALWAYS SHOW BUTTON */}
                            <Button
                                className="mb-4"
                                onClick={() => setOpenModal(true)}
                            >
                                Schedule Exam
                            </Button>

                            {/* SCHEDULE LIST */}
                            {filteredSchedules.length === 0 ? (
                                <p className="text-gray-500">
                                    No exams scheduled for this date
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {filteredSchedules.map(exam => (
                                        <div
                                            key={exam.id}
                                            className="p-3 rounded-xl border bg-gray-50 flex justify-between items-start"
                                        >
                                            <div>
                                                <div className="font-semibold">
                                                    {exam.exam_title}
                                                </div>

                                                <div className="text-sm text-gray-600">
                                                    Level {exam.exam_level} | Set {exam.paper_set}
                                                </div>

                                                <div className="text-sm">
                                                    {exam.start_time} - {exam.end_time}
                                                </div>
                                            </div>

                                            {/* DELETE BUTTON */}
                                            <button
                                                onClick={() => handleDelete(exam.id)}
                                                disabled={deleteLoading}
                                                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition"
                                                title="Delete Exam"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                    ))}
                                </div>
                            )}

                        </>
                    )}
                </div>


            </div>
            <Modal open={openModal} onClose={() => setOpenModal(false)} title="Schedule Exam">
                <div className="space-y-4">
                    <InputField
                        label="Exam Name"
                        type="text"
                        value={examData.exam_title}
                        onChange={(e) =>
                            setExamData({ ...examData, exam_title: e.target.value })
                        }
                    />

                    <select
                        className="w-full border rounded-lg p-2"
                        value={examData.exam_level}
                        onChange={(e) =>
                            setExamData({ ...examData, exam_level: e.target.value })
                        }
                    >
                        <option value="">Select Level</option>
                        {levels.map(l => (
                            <option key={l.id} value={l.id}>
                                Level {l.level}
                            </option>
                        ))}
                    </select>


                    <select
                        className="w-full border rounded-lg p-2"
                        value={examData.paper_set}
                        onChange={(e) =>
                            setExamData({ ...examData, paper_set: e.target.value })
                        }
                    >
                        <option value="">Select Set</option>
                        {["A", "B", "C", "D"].map(set => (
                            <option key={set} value={set}>{set}</option>
                        ))}
                    </select>

                    <InputField
                        label="Start Time"
                        type="time"
                        value={examData.start_time}
                        onChange={(e) =>
                            setExamData({ ...examData, start_time: e.target.value })
                        }
                    />

                    <InputField
                        label="End Time"
                        type="time"
                        value={examData.end_time}
                        onChange={(e) =>
                            setExamData({ ...examData, end_time: e.target.value })
                        }
                    />


                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <Button variant="outline" onClick={() => setOpenModal(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>
                        Save
                    </Button>
                </div>
            </Modal>
        </>
    );
}
