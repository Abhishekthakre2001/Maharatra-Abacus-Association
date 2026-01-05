import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import DataTable from '../UI/DataTable';
import DeleteConfirmModal from "../UI/DeleteConfirmModal";
import AppBar from '../UI/AppBar';
import colors from '../utils/Color';
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
            key: "subscription_end_date",
            label: "Subscription End Date",
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
                <span 
                    className="px-2 py-1 rounded-full text-xs"
                    style={{
                        backgroundColor: colors.background.blue100,
                        color: colors.text.blue700
                    }}
                >
                    {value}
                </span>
            )
        },
        {
            key: "username",
            label: "Username",
            sortable: true,
            render: (value) => (
                <span className="font-medium" style={{ color: colors.text.gray600 }}>{value}</span>
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
                <AppBar
                    title="Student Management"
                    subtitle="Manage and view all students"
                />
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
