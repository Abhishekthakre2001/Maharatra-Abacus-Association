import React, { useState } from 'react'
import { useFetchData } from "../hooks/useFetchData";
import DataTable from "../UI/DataTable"
import AppBar from '../UI/AppBar';
import userApi from "../api/userApi";

export default function Result() {

    const user = JSON.parse(localStorage.getItem("user"));
    const { data: students, loading, reload } = useFetchData(() => userApi.getbyadminid(user.id));

    const handleView = () => {
        console.log("View")
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

        </div>
    )
}
