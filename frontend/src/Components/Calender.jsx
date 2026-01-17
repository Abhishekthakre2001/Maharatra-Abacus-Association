import React, { useState, useEffect } from "react";
import AppBar from "../UI/AppBar";
import Button from "../UI/Button";
import InputField from "../UI/InputField";
import SelectField from "../UI/SelectField";
import Modal from "../UI/Modal";
import { Calendar1, MoveLeft, MoveRight, Trash2 } from 'lucide-react';
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
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null, loading: false });

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

    // const handleSave = async () => {
    //     if (!user?.id) {
    //         setModal({
    //             open: true,
    //             type: "error",
    //             title: "Not signed in",
    //             message: "Please sign in to schedule an exam."
    //         });
    //         return;
    //     }

    //     try {
    //         await create({
    //             ...examData,
    //             date: selectedDate,
    //             createdby: user.id
    //         });

    //         setModal({
    //             open: true,
    //             type: "success",
    //             title: "Success",
    //             message: "Exam scheduled successfully."
    //         });

    //         // optional: reset form
    //         setExamData(initialState);

    //     } catch (error) {

    //         console.log("error", error?.response?.data?.message)
    //         if (error?.response?.data?.message == 'Set not available for this level') {
    //             setModal({
    //                 open: true,
    //                 type: "error",
    //                 title: "Fail",
    //                 message: "Set not available for this level"
    //             });
    //         } else {
    //             setModal({
    //                 open: true,
    //                 type: "error",
    //                 title: "Fail",
    //                 message: "Exam Not Schedule Properly"
    //             });
    //         }

    //     }
    // };
    const handleSave = async () => {
        if (!user?.id) {
            setModal({
                open: true,
                type: "error",
                title: "Not signed in",
                message: "Please sign in to schedule an exam."
            });
            return;
        }

        try {
            await examScheduleApi.create({
                ...examData,
                date: selectedDate,
                createdby: user.id
            });

            // ✅ reload calendar data
            reload();

            // ✅ close schedule modal
            setOpenModal(false);

            // ✅ reset form
            setExamData({
                exam_title: "",
                exam_level: "",
                paper_set: "",
                start_time: "",
                end_time: ""
            });

            // ✅ show success modal
            setModal({
                open: true,
                type: "success",
                title: "Success",
                message: "Exam scheduled successfully."
            });

        } catch (error) {
            const msg = error?.response?.data?.message;

            setModal({
                open: true,
                type: "error",
                title: "Fail",
                message: msg || "Exam not scheduled properly"
            });
        }
    };


    const { data: schedules, reload } = useFetchData(() => {
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



    return (
        <>
            <MessageModal
                open={modal.open}
                type={modal.type}
                title={modal.title}
                message={modal.message}
                onClose={() => setModal({ ...modal, open: false })}
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
                title="Student Management"
                subtitle="Exam Schedule Calendar"
            />

            <div className="px-4 sm:px-6 py-4 sm:py-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

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

                            return (
                                <div
                                    key={i}
                                    onClick={() => day && setSelectedDate(fullDate)}
                                    className={`h-10 sm:h-12 flex items-center justify-center rounded-xl cursor-pointer ${!day ? "bg-transparent cursor-default" : ""} ${selectedDate === fullDate ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-blue-100"}`}
                                >
                                    <span className="text-xs sm:text-sm">{day}</span>
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
                                    {selectedDate}
                                </span>
                            </p>

                            {/* ✅ ALWAYS SHOW BUTTON */}
                            <Button
                                className="mb-4 w-full sm:w-auto"
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
                                        

                                            <div  key={exam.id}
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
                                        <p className="mt-3">{exam.start_time} To {exam.end_time} </p>
                                        </div>
                                      
                                    </div>

                                    <div onClick={() => handleDelete(exam.id)}
                                        className="
        w-14 h-14 rounded-xl
        bg-gradient-to-br from-blue-300 to-blue-200
        text-blue-600 
        flex items-center justify-center
        group-hover:scale-110 transition-transform
      "
                                    >
                                        {/* Example icon */}
                                        <Trash2 size={22} />
                                    </div>
                                </div>
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
