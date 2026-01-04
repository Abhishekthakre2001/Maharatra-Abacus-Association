import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import DataTable from '../UI/DataTable';
import DeleteConfirmModal from "../UI/DeleteConfirmModal";
import { useFetchData } from "../hooks/useFetchData";
import userApi from "../api/userApi";
import { useDelete } from "../hooks/useDelete";


export default function StudentList() {

    const navigate = useNavigate();
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const { remove, loading: deleteLoading } = useDelete(
        userApi.delete,
        () => {
            setDeleteOpen(false);
            setSelectedRow(null);
            reload(); // 🔄 reload table after delete
        }
    );


    const user = JSON.parse(localStorage.getItem("user"));
    const { data: students, loading, reload } = useFetchData(() => userApi.getbyadminid(user.id));


    const handleEdit = (row) => {
        // Navigate to add-student in update mode with id
        navigate(`/add-student/${row.id}`);
    };

    const handleDelete = (row) => {
        setSelectedRow(row);
        setDeleteOpen(true);
    };
    const handleConfirmDelete = () => {
        if (selectedRow?.id) {
            remove(selectedRow.id);
        }
    };

    const columns = [
        {
            key: "id",
            label: "Sr. No.",
            render: (value, row, index, serial) => serial + 1
        },
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
            key: "level",
            label: "Level",
            sortable: true,
            render: (value) => (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                    {value}
                </span>
            )
        },
        {
            key: "username",
            label: "Username",
            sortable: true,
            render: (value) => (
                <span className="font-medium text-gray-600">{value}</span>
            )
        }
    ];


    return (
        <>

            <DeleteConfirmModal
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
                loading={deleteLoading}
                title="Delete Student"
                message={`Are you sure you want to delete "${selectedRow?.name}"? This action cannot be undone.`}
            />


            <div className="max-w-7xl mx-auto">
                <div className="bg-gradient-to-r from-blue-600 to-[#110F12]
      bg-opacity-70
      backdrop-blur-xl
      shadow-[0px_20px_40px_rgba(0,0,0,0.45)] rounded-2xl p-8 text-white shadow-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Student Management</h1>
                            <p className="hidden md:block text-white text-sm md:text-lg">Manage and view all students</p>
                            <div className='flex gap-4 my-4 md:my-0'>
                                {/* User Icon */}
                                <div className="md:hidden w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-lg font-bold shadow-md">
                                    {"AT"}
                                </div>
                                {/* Welcome Text */}
                                <div className="text-left md:hidden">
                                    <p className="text-sm text-blue-200">Welcome Back,</p>
                                    <p className="text-lg font-semibold text-white">
                                        User Name
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* logo */}
                        {/* RIGHT - User Info */}
                        <div className="hidden lg:flex items-center gap-4 px-5 py-3 rounded-xl ">
                            {/* Welcome Text */}
                            <div className="text-right">
                                <p className="text-sm text-blue-200">Welcome Back,</p>
                                <p className="text-lg font-semibold text-white">
                                    User Name
                                </p>
                            </div>
                            {/* User Icon */}
                            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-lg font-bold shadow-md">
                                AT
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Student Button - Responsive */}
                {/* <div className="flex justify-center md:justify-end mt-6">
                    <Button icon={Users} variant="primary" onClick={() => window.location.href = "/add-student"}>Add Student</Button>
                </div> */}
            </div>

            {/* Student Table */}
            <div className="p-0 my-8">
                <DataTable
                    columns={columns}
                    data={students}
                    title="All Students"
                    onCreate={() => navigate("/add-student")}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    searchable
                    pagination
                    showActions
                    loading={loading}
                />
            </div>
        </>
    )
}
