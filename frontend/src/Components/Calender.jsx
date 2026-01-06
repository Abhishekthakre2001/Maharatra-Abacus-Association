import React, { useState } from "react";
import AppBar from "../UI/AppBar";
import Button from "../UI/Button";
import InputField from "../UI/InputField";
import Modal from "../UI/Modal";

export default function Calender() {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today);
    const [selectedDate, setSelectedDate] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const [examData, setExamData] = useState({
        examName: "",
        examTime: "",
    });

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);

    const handleSave = () => {
        console.log({
            date: selectedDate,
            ...examData,
        });
        setOpenModal(false);
        setExamData({ examName: "", examTime: "" });
    };

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
                            ◀
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
                            ▶
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
                            <p className="text-gray-600 mb-4">
                                📅 Selected Date:{" "}
                                <span className="font-medium">
                                    {selectedDate}
                                </span>
                            </p>

                            <Button onClick={() => setOpenModal(true)}>
                                Schedule Exam
                            </Button>
                        </>
                    )}
                </div>
            </div>
            <Modal open={openModal} onClose={() => setOpenModal(false)} title="Schedule Exam">
                <div className="space-y-4">
                    <InputField
                        label="Exam Name"
                        type="text"
                        value={examData.examName}
                        onChange={(e) =>
                            setExamData({ ...examData, examName: e.target.value })
                        }
                    />

                    <InputField
                        label="Exam Time"
                        type="time"
                        value={examData.examTime}
                        onChange={(e) =>
                            setExamData({ ...examData, examTime: e.target.value })
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
