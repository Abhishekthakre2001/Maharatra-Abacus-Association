import React from 'react'
import AppBar from '../UI/AppBar';
import { useFetchData } from "../hooks/useFetchData";
import userApi from "../api/userApi";
import DataTable from '../UI/DataTable';
import { useNavigate } from "react-router-dom";

export default function StudentForExam() {

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : {};
    const navigate = useNavigate();
    const { data: students, loading, reload } = useFetchData(() => {
        if (!user?.id) return Promise.resolve([]);
        return userApi.getregistredstudentbyadminid(user.id);
    });

    const levelMap = {
        0: "Bud level",
        9: "New commer",
        10: "A level",
        1: "1st level",
        2: "2nd level",
        3: "3rd level",
        4: "4th level",
        5: "5th level",
        6: "6th level",
        7: "7th level",
        8: "8th level",
    };

    const columns = [
        {
            key: "name",
            label: "Student Name",
            sortable: true,
            render: (value) => (
                <span className="font-semibold text-gray-800">
                    {value}
                </span>
            )
        },
          {
            key: "username",
            label: "Username",
            sortable: true
        },

        {
            key: "password",
            label: "Password",
            sortable: true
        },
         {
            key: "age",
            label: "Age",
            sortable: true
        },
       
        {
            key: "class",
            label: "Class",
            sortable: true,
            render: (value) => value || "N/A"
        },
        {
            key: "level",
            label: "Level",
            sortable: true,
            render: (value) => `${levelMap[value] || "Unknown"} (${value})`
        },
        {
            key: "mobilenumber",
            label: "Mobile Number",
            sortable: true
        },
        {
            key: "whatsapp_number",
            label: "WhatsApp Number",
            sortable: true
        },
        {
            key: "parent_name",
            label: "Parent Name",
            sortable: true
        },
        {
            key: "learning_center_name",
            label: "Learning Center",
            sortable: true
        },
        {
            key: "city",
            label: "City",
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
            key: "registration_date",
            label: "Registration Date",
            sortable: true,
            isDate: true,
            render: (value) =>
                value ? new Date(value).toLocaleDateString("en-GB") : ""
        },
        {
            key: "usertype",
            label: "User Type",
            sortable: true
        },
        {
            key: "status",
            label: "Status",
            sortable: true,
            render: (value) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs ${value === 1
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                        }`}
                >
                    {value === 1 ? "Active" : "Inactive"}
                </span>
            )
        }
    ];


    console.log("students", students)

    return (
        <>
            <AppBar
                title="Register Student for Exam"
                subtitle="Manage all student exams"
            />

            {/* Student Table */}
            <div className="p-0 my-8">
                <DataTable
                    columns={columns}
                    data={students}
                    title="Exam Registrations"
                    onView={(row) => navigate(`/add-student/${row.user_id}?from=exam-student`)}
                    searchable
                    pagination
                    showActions
                    loading={loading}
                />
            </div>
        </>
    )
}