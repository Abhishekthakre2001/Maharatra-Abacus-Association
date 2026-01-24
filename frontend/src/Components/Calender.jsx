// Helper to format time in 12-hour format with AM/PM
function formatTime12hr(timeStr) {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(":");
    let hour = parseInt(h, 10);
    const minute = m ? m.padStart(2, '0') : '00';
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour}:${minute} ${ampm}`;
}
import React, { useState, useEffect } from "react";
import AppBar from "../UI/AppBar";
import Button from "../UI/Button";
import InputField from "../UI/InputField";
import SelectField from "../UI/SelectField";
import Modal from "../UI/Modal";
import { Calendar1, MoveLeft, MoveRight, Trash2, Pencil, Edit, } from 'lucide-react';
import { useCreate } from "../hooks/useCreate";
import examScheduleApi from "../api/examScheduleApi";
import { useFetchData } from "../hooks/useFetchData";
import { useUpdate } from "../hooks/useUpdate";
import { useDelete } from "../hooks/useDelete";
import DeleteConfirmModal from "../UI/DeleteConfirmModal";
import MessageModal from "../utils/MessageModal";
import levelApi from "../api/LevelApi";
import setsApi from "../api/SetsApi";


export default function Calender() {

    const [levels, setLevels] = useState([]);
    const [sets, setSets] = useState([]);

    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today);
    const formatToday = (date) =>
        date.toISOString().split("T")[0];

    const [selectedDate, setSelectedDate] = useState(formatToday(today));

    const [openModal, setOpenModal] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [updateExamId, setUpdateExamId] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null, loading: false });
    const [haserror, sethaserror] = useState(false);
    const [buttonloading, setbuttonloading] = useState(false)

    const [examData, setExamData] = useState({
        exam_title: "",
        exam_level: "",
        paper_set: "",
        start_time: "",
        end_time: ""
    });

    const [modal, setModal] = useState({
        open: false,
        type: "",
        title: "",
        message: ""
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
        setModal({
            open: true,
            type: "success",
            title: "Success",
            message: "Exam scheduled successfully!"
        });
    });

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : {};


    //     const handleSave = async () => {
    //         if (!user?.id) {
    //             setModal({
    //                 open: true,
    //                 type: "error",
    //                 title: "Not signed in",
    //                 message: "Please sign in to schedule an exam."
    //             });
    //             return;
    //         }
    // console.log("selectedDate",examData)
    //         try {
    //             if (isUpdate && updateExamId) {
    //                 // Update existing exam
    //                 await examScheduleApi.update(updateExamId, {
    //                     ...examData,
    //                     date: selectedDate,
    //                     updatedby: user.id
    //                 });
    //             } else {
    //                 // Create new exam
    //                 await examScheduleApi.create({
    //                     ...examData,
    //                     date: selectedDate,
    //                     createdby: user.id
    //                 });
    //             }

    //             reload();
    //             setOpenModal(false);
    //             setExamData({
    //                 exam_title: "",
    //                 exam_level: "",
    //                 paper_set: "",
    //                 start_time: "",
    //                 end_time: ""
    //             });
    //             setIsUpdate(false);
    //             setUpdateExamId(null);
    //             setModal({
    //                 open: true,
    //                 type: "success",
    //                 title: "Success",
    //                 message: isUpdate ? "Exam updated successfully." : "Exam scheduled successfully."
    //             });
    //         } catch (error) {
    //             const msg = error?.response?.data?.message;
    //             setModal({
    //                 open: true,
    //                 type: "error",
    //                 title: "Fail",
    //                 message: msg || (isUpdate ? "Exam not updated properly" : "Exam not scheduled properly")
    //             });
    //         }
    //     };

    const handleSave = async () => {
        setbuttonloading(true)
        if (!user?.id) {
            setModal({
                open: true,
                type: "error",
                title: "Not signed in",
                message: "Please sign in to schedule an exam."
            });
            return;
        }

        const { exam_title, exam_level, paper_set, start_time, end_time } = examData;

        // ---------- BASIC REQUIRED FIELD VALIDATION ----------
        if (
            !exam_title?.trim() ||
            !exam_level ||
            !paper_set ||
            !start_time ||
            !end_time ||
            !selectedDate
        ) {
            setModal({
                open: true,
                type: "error",
                title: "Validation Error",
                message: "All fields are compulsory."
            });
            sethaserror(true);
            setOpenModal(false);
            setbuttonloading(false);
            return;
        }

        // ---------- DATE & TIME VALIDATION ----------
        const today = new Date();
        const selected = new Date(selectedDate);

        // Normalize dates (compare only date part)
        today.setHours(0, 0, 0, 0);
        selected.setHours(0, 0, 0, 0);

        const now = new Date();

        // Convert start & end time to Date objects
        const startTime = new Date(selectedDate);
        const endTime = new Date(selectedDate);

        const [startHour, startMinute] = start_time.split(":");
        const [endHour, endMinute] = end_time.split(":");

        startTime.setHours(startHour, startMinute, 0);
        endTime.setHours(endHour, endMinute, 0);

        // ---------- IF TODAY → START TIME MUST BE IN FUTURE ----------
        if (today.getTime() === selected.getTime()) {
            if (startTime <= now) {
                setModal({
                    open: true,
                    type: "error",
                    title: "Invalid Start Time",
                    message: "Start time must be greater than current time."
                });
                setOpenModal(false);
                sethaserror(true);
                setbuttonloading(false);
                return;
            }
        }

        // ---------- END TIME MUST BE GREATER THAN START TIME ----------
        if (endTime <= startTime) {
            setModal({
                open: true,
                type: "error",
                title: "Invalid End Time",
                message: "End time must be greater than start time."
            });
            setOpenModal(false);
            sethaserror(true);
            setbuttonloading(false);
            return;
        }

        // ---------- API CALL ----------
        try {
            if (isUpdate && updateExamId) {
                await examScheduleApi.update(updateExamId, {
                    ...examData,
                    date: selectedDate,
                    updatedby: user.id
                });
            } else {
                await examScheduleApi.create({
                    ...examData,
                    date: selectedDate,
                    createdby: user.id
                });
            }

            reload();
            setOpenModal(false);
            setExamData({
                exam_title: "",
                exam_level: "",
                paper_set: "",
                start_time: "",
                end_time: ""
            });
            sethaserror(false);
            setIsUpdate(false);
            setUpdateExamId(null);
            setbuttonloading(false);

            setModal({
                open: true,
                type: "success",
                title: "Success",
                message: isUpdate
                    ? "Exam updated successfully."
                    : "Exam scheduled successfully."
            });
        } catch (error) {
            const msg = error?.response?.data?.message;
            sethaserror(true);
            setbuttonloading(false);
            setModal({
                open: true,
                type: "error",
                title: "Fail",
                message: msg || (isUpdate
                    ? "Exam not updated properly"
                    : "Exam not scheduled properly")
            });

        }
    };



    const { data: schedules, loading, reload } = useFetchData(() => {
        if (!user?.id) return Promise.resolve([]);
        return examScheduleApi.getByadmin(user.id);
    });

    useEffect(() => {
        const adminid = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).id : null;

        // Fetch levels
        levelApi.getbyadminid(adminid)
            .then(res => {
                const payload = res && res.data !== undefined ? res.data : res;
                setLevels(Array.isArray(payload) ? payload : []);
            })
            .catch(err => console.error('Failed to load levels', err));

        // Fetch sets
        setsApi.getbyadminid(adminid)
            .then(res => {
                const payload = res && res.data !== undefined ? res.data : res;
                setSets(Array.isArray(payload) ? payload : []);
            })
            .catch(err => console.error('Failed to load sets', err));
    }, []);

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toISOString().split("T")[0];
    };

    const filteredSchedules = schedules.filter(
        (exam) => formatDate(exam.date) === selectedDate
    );

    const handleDelete = (id) => {
        setDeleteModal({ open: true, id, loading: false });
    };


    const { remove } = useDelete(
        examScheduleApi.delete,
        () => {
            reload(); // refresh list after delete
            setDeleteModal({ open: false, id: null, loading: false });
        }
    );

    console.log("loading", loading)

    return (
        <>
            <MessageModal
                open={modal.open}
                type={modal.type}
                title={modal.title}
                message={modal.message}
                onClose={() => {
                    if (haserror) {
                        setModal({ ...modal, open: false });
                        setOpenModal(true);
                    } else {
                        setModal({ ...modal, open: false });
                    }
                }}

            />
            <DeleteConfirmModal
                open={deleteModal.open}
                loading={deleteModal.loading}
                onClose={() => setDeleteModal({ open: false, id: null, loading: false })}
                onConfirm={async () => {
                    setDeleteModal(dm => ({ ...dm, loading: true }));
                    await remove(deleteModal.id);
                }}
                title="Delete Confirmation"
                message="Are you sure you want to delete this exam? This action cannot be undone."
            />
            <AppBar
                title="Exam Management"
                subtitle="Schedule, organize, and manage examinations"
            />


            <div className="px-4 sm:px-6 py-4 sm:py-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

                {loading ?
                    (
                        <>
                            <div className="fixed inset-0 flex items-center justify-center bg-white">
                                <div className="flex flex-col items-center gap-4">
                                    <svg
                                        aria-hidden="true"
                                        className="w-10 h-10 animate-spin text-blue-600"
                                        viewBox="0 0 100 101"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873"
                                            fill="currentFill"
                                        />
                                    </svg>

                                    <p className="text-blue-600 text-sm font-medium animate-pulse">
                                        Loading, please wait...
                                    </p>
                                </div>
                            </div>

                        </>
                    ) : (<>
                        {/* CALENDAR */}
                        <div className="bg-white rounded-lg sm:rounded-2xl shadow p-4 sm:p-6">
                            <div className="flex flex-row justify-between items-center gap-2 mb-4">
                                <Button
                                    onClick={() => setCurrentMonth(new Date(year, month - 1))}
                                    variant="secondary"
                                    size="sm"
                                >
                                    <MoveLeft />
                                </Button>

                                <h2 className="text-base sm:text-lg font-semibold">
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
                            <div className="grid grid-cols-7 text-center text-xs sm:text-sm font-medium text-gray-500 mb-2">
                                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                                    (day) => (
                                        <div key={day}>{day}</div>
                                    )
                                )}
                            </div>

                            {/* DATES */}
                            <div className="grid grid-cols-7 gap-1 sm:gap-2">
                                {days.map((day, i) => {
                                    const fullDate =
                                        day &&
                                        `${year}-${String(month + 1).padStart(
                                            2,
                                            "0"
                                        )}-${String(day).padStart(2, "0")}`;

                                    // Check if this date has a scheduled exam
                                    const hasExam = schedules.some(exam => {
                                        const examDate = exam.date ? exam.date.split('T')[0] : '';
                                        return examDate === fullDate;
                                    });

                                    let dayClass = "bg-gray-100 hover:bg-blue-100";
                                    let textClass = "text-xs sm:text-sm";
                                    if (selectedDate === fullDate) {
                                        dayClass = "bg-blue-600 text-white";
                                    } else if (hasExam) {
                                        dayClass = "bg-orange-200 text-orange-700 font-bold";
                                        textClass = "text-xs sm:text-sm";
                                    }
                                    return (
                                        <div
                                            key={i}
                                            onClick={() => day && setSelectedDate(fullDate)}
                                            className={`h-10 sm:h-12 flex items-center justify-center rounded-xl cursor-pointer ${!day ? "bg-transparent cursor-default" : dayClass}`}
                                        >
                                            <span className={textClass}>{day}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* RIGHT PANEL */}
                        {/* RIGHT PANEL */}
                        <div className="bg-white rounded-lg sm:rounded-2xl shadow p-4 sm:p-6">
                            <h3 className="text-base sm:text-lg font-semibold mb-3">
                                Exam Schedule
                            </h3>

                            {!selectedDate ? (
                                <p className="text-gray-500">
                                    Select a date from calendar
                                </p>
                            ) : (
                                <>
                                    <p className="text-gray-600 mb-4 flex gap-2 items-center text-sm">
                                        <Calendar1 />
                                        Selected Date:
                                        <span className="font-medium">
                                            {new Date(selectedDate).toLocaleDateString("en-GB")}
                                        </span>
                                    </p>

                                    {/* ✅ ALWAYS SHOW BUTTON */}
                                    <Button
                                        className="mb-4 w-full sm:w-auto"
                                        onClick={() => {
                                            // Only allow scheduling for today or future
                                            if (selectedDate >= formatToday(today)) setOpenModal(true);
                                        }}
                                        disabled={selectedDate < formatToday(today)}
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


                                                <div key={exam.id}
                                                    className="
    group
    bg-gradient-to-br from-blue-50 to-indigo-100
    rounded-2xl
    shadow-md hover:shadow-md hover:shadow-blue-300/40
    transition-all duration-300
    p-6 border border-blue-100
    hover:-translate-y-1
  "
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-gray-500 font-medium text-md">
                                                                {exam.exam_title}
                                                            </p>
                                                            <div className="flex gap-4">
                                                                <h2 className="text-2xl font-bold text-slate-800 mt-2">
                                                                    {exam.exam_level}{exam.paper_set}
                                                                </h2>
                                                                <p className="mt-3">
                                                                    {formatTime12hr(exam.start_time)} To {formatTime12hr(exam.end_time)}
                                                                </p>
                                                            </div>

                                                        </div>

                                                        <div className="flex gap-2 items-center">
                                                            {/* <button
                                                                onClick={() => {
                                                                    setIsUpdate(true);
                                                                    setUpdateExamId(exam.id);
                                                                    setExamData({
                                                                        exam_title: exam.exam_title,
                                                                        exam_level: exam.exam_level,
                                                                        paper_set: exam.paper_set,
                                                                        start_time: exam.start_time,
                                                                        end_time: exam.end_time
                                                                    });
                                                                    setOpenModal(true);
                                                                }}
                                                                className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-300 to-orange-200 text-orange-700 flex items-center justify-center group-hover:scale-110 transition-transform border border-green-200"
                                                                title="Update Exam"
                                                            >
                                                                <Pencil size={15} />
                                                            </button>
                                                            <div onClick={() => handleDelete(exam.id)}
                                                                className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-300 to-red-200 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform"
                                                                title="Delete Exam"
                                                            >
                                                                <Trash2 size={15} />
                                                            </div> */}

                                                            <button title="Update Exam" className="p-1 sm:p-1.5 text-orange-600 hover:bg-orange-100 rounded" onClick={() => {
                                                                setIsUpdate(true);
                                                                setUpdateExamId(exam.id);
                                                                setExamData({
                                                                    exam_title: exam.exam_title,
                                                                    exam_level: exam.exam_level,
                                                                    paper_set: exam.paper_set,
                                                                    start_time: exam.start_time,
                                                                    end_time: exam.end_time
                                                                });
                                                                setOpenModal(true);
                                                            }}>
                                                                <Edit size={14} className="sm:w-4 sm:h-4" />
                                                            </button>

                                                            <button className="p-1 sm:p-1.5 text-red-600 hover:bg-red-100 rounded" onClick={() => handleDelete(exam.id)}>
                                                                <Trash2 size={14} className="sm:w-4 sm:h-4" />
                                                            </button>

                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>


                                    )}


                                </>
                            )}
                        </div>
                    </>)
                }




            </div>
            <Modal open={openModal} onClose={() => { setOpenModal(false); setIsUpdate(false); setUpdateExamId(null); }} title={isUpdate ? "Update Exam" : "Schedule Exam"}>
                <div className="space-y-4">
                    <InputField
                        label="Exam Name"
                        type="text"
                        value={examData.exam_title}
                        onChange={(e) =>
                            setExamData({ ...examData, exam_title: e.target.value })
                        }
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Level<span className="text-red-500 ml-1">*</span>
                        </label>
                        <SelectField
                            label=""
                            value={examData.exam_level}
                            onChange={(e) =>
                                setExamData({ ...examData, exam_level: e.target.value })
                            }
                            options={levels.map(l => ({
                                value: l.level,
                                label: l.level || l.name || `Level ${l.id}`
                            }))}
                            placeholder="-- Select Level --"
                        />
                    </div>


                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Set<span className="text-red-500 ml-1">*</span>
                        </label>
                        <SelectField
                            label=""
                            value={examData.paper_set}
                            onChange={(e) =>
                                setExamData({ ...examData, paper_set: e.target.value })
                            }
                            options={sets.map(s => ({
                                value: s.set_name,
                                label: s.set_name || s.name || `Set ${s.id}`
                            }))}
                            placeholder="-- Select Set --"
                        />
                    </div>

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
                    <Button
                        variant="outline"
                        onClick={() => {
                            setOpenModal(false);
                            setExamData({
                                exam_title: "",
                                exam_level: "",
                                paper_set: "",
                                start_time: "",
                                end_time: ""
                            });
                        }}
                    >
                        Cancel
                    </Button>

                    <Button onClick={handleSave} disabled={buttonloading}>
                        {buttonloading ? "Saveing..." : 'Save'}
                    </Button>
                </div>
            </Modal>
        </>
    );
}
