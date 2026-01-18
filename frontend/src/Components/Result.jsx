import React, { useState } from 'react'
import { useFetchData } from "../hooks/useFetchData";
import DataTable from "../UI/DataTable"
import Modal from '../UI/Modal';
import ResultApi from '../api/result';
import AppBar from '../UI/AppBar';
import userApi from "../api/userApi";

export default function Result() {

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : {};
    const { data: students, loading, reload } = useFetchData(() => {
        if (!user?.id) return Promise.resolve([]);
        return userApi.getbyadminid(user.id);
    });

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Fetch student results using hook
    const {
        data: studentResults = [],
        loading: loadingResult,
        reload: reloadResults
    } = useFetchData(
        selectedStudent ? () => ResultApi.getbystudentid(selectedStudent.id) : () => Promise.resolve([]),
        [selectedStudent]
    );

    // Log student-wise result to console
    React.useEffect(() => {
        if (selectedStudent) {
            console.log(`Results for student ${selectedStudent.name}:`, studentResults);
        }
    }, [studentResults, selectedStudent]);

    const handleView = (student) => {
        setSelectedStudent(student);
        setModalOpen(true);
    };

    const columns = [
        // {
        //     key: "id",
        //     label: "Sr. No.",
        //     render: (value, row, index, serial) => serial + 1
        // },
        {
            key: "name",
            label: "Student Name",
            sortable: true,
            render: (value) => <span className="font-medium">{value}</span>
        },
        {
            key: "class",
            label: "Class",
            sortable: true
        },
        {
            key: "address",
            label: "Address",
            sortable: true,
            render: (value) => <span className="text-sm">{value}</span>
        },
        {
            key: "mobilenumber",
            label: "Mobile Number",
            sortable: true
        },
        {
            key: "dob",
            label: "Date of Birth",
            sortable: true,
            isDate: true,
            render: (value) =>
                value ? new Date(value).toLocaleDateString("en-GB") : ""
        },
        {
            key: "subscription_end_date",
            label: "Subscription End Date",
            sortable: true,
            isDate: true,

            render: (value) =>
                value ? new Date(value).toLocaleDateString("en-GB") : ""
        },

        {
            key: "username",
            label: "Username",
            sortable: true,
            render: (value) => (
                <span className="font-medium" >{value}</span>
            )
        }
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <AppBar
                title="Student Management"
                subtitle="Manage and view all students"
            />

            {/* Student Table */}
            <div className="p-0 my-8">
                <DataTable
                    columns={columns}
                    data={students}
                    title="All Students"
                    onView={handleView}
                    searchable
                    pagination
                    showActions
                    loading={loading}
                />
            </div>

            {/* Student Result Modal */}
            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={selectedStudent ? `${selectedStudent.name} - Results` : 'Student Results'}>
                {loadingResult ? (
                    <div className="py-8 text-center">Loading...</div>
                ) : studentResults.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">No results found for this student.</div>
                ) : (
                    <div className="space-y-4">
                        {studentResults.map((result, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-xl p-4 mb-2 shadow">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <div><span className="font-semibold">Date:</span> {result.date ? new Date(result.date).toLocaleDateString("en-GB") : ''}</div>
                                    <div><span className="font-semibold">Time:</span> {result.time}</div>
                                    <div><span className="font-semibold">Total Questions:</span> {result.total_question}</div>
                                    <div><span className="font-semibold">Total Answered:</span> {result.total_answer}</div>
                                    <div><span className="font-semibold">Total Correct:</span> {result.total_correct}</div>
                                    <div><span className="font-semibold">Total Unsolved:</span> {result.total_unsolve}</div>
                                    <div><span className="font-semibold">Total Time:</span> {result.totaltime}</div>
                                    <div><span className="font-semibold">Time Taken:</span> {result.time_taken}</div>
                                    <div><span className="font-semibold">Created At:</span> {result.createdat ? new Date(result.createdat).toLocaleString("en-GB") : ''}</div>
                                    <div><span className="font-semibold">Created By:</span> {result.createdby}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Modal>
        </div>
    )
}
