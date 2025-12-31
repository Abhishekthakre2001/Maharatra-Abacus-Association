import React from 'react'
import DataTable from '../UI/DataTable';
import { Users } from 'lucide-react';
import Button from '../UI/Button';


export default function StudentList() {
    // Sample static data for display
    const students = [
        {
            id: 1,
            name: 'John Doe',
            class: 'Grade 10-A',
            address: '123 Main Street, New York, NY',
            mobileNumber: '9876543210',
            dob: '2008-05-15',
            level: 'Intermediate',
            username: 'johndoe',

        },
        {
            id: 2,
            name: 'Sarah Smith',
            class: 'Grade 9-B',
            address: '456 Oak Avenue, Los Angeles, CA',
            mobileNumber: '9876543211',
            dob: '2009-08-22',
            level: 'Beginner',
            username: 'sarahsmith',

        },
        {
            id: 3,
            name: 'Michael Johnson',
            class: 'Grade 11-C',
            address: '789 Pine Road, Chicago, IL',
            mobileNumber: '9876543212',
            dob: '2007-03-10',
            level: 'Advanced',
            username: 'mikejohnson',

        },
        {
            id: 4,
            name: 'Emily Davis',
            class: 'Grade 8-A',
            address: '321 Elm Street, Houston, TX',
            mobileNumber: '9876543213',
            dob: '2010-11-05',
            level: 'Beginner',
            username: 'emilydavis',

        },
        {
            id: 5,
            name: 'David Wilson',
            class: 'Grade 12-B',
            address: '654 Maple Drive, Phoenix, AZ',
            mobileNumber: '9876543214',
            dob: '2006-01-18',
            level: 'Expert',
            username: 'davidwilson',

        }
    ];
    const loading = false;

    const handleEdit = (row) => {
        console.log('Edit student:', row);
        // Add edit logic here
    };

    const handleDelete = (row) => {
        console.log('Delete student:', row);
        // Add delete logic here
    };

    const columns = [
        {
            key: 'id',
            label: 'Sr. No.',
            render: (value, row, index, serial) => serial + 1
        },
        {
            key: 'name',
            label: 'Student Name',
            sortable: true,
            render: (value) => <span className="font-medium">{value}</span>
        },
        {
            key: 'class',
            label: 'Class',
            sortable: true,
            render: (value) => <span>{value}</span>
        },
        {
            key: 'address',
            label: 'Address',
            sortable: true,
            render: (value) => <span className="text-sm">{value}</span>
        },
        {
            key: 'mobileNumber',
            label: 'Mobile Number',
            sortable: true,
            render: (value) => <span>{value}</span>
        },
        {
            key: 'dob',
            label: 'Date of Birth',
            sortable: true,
            isDate: true,
            render: (value) =>
                value ? new Date(value).toLocaleDateString("en-GB") : ""
        },
        {
            key: 'level',
            label: 'Level',
            sortable: true,
            render: (value) => <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">{value}</span>
        },
        {
            key: 'username',
            label: 'Username',
            sortable: true,
            render: (value) => <span className="font-medium text-gray-600">{value}</span>
        },

    ];

    return (
        <>
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
                <div className="flex justify-center md:justify-end mt-6">
                    <Button icon={Users} variant="primary" onClick={() => window.location.href = "/add-student"}>Add Student</Button>
                </div>
            </div>

            {/* Student Table */}
            <div className="p-0 my-8">
                <DataTable
                    columns={columns}
                    data={students}
                    title="All Students"
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
