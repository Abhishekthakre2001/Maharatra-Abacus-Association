import React, { useState } from 'react'
import Input from '../UI/InputField';
import Button from '../UI/Button';
import { Save, X } from 'lucide-react';

export default function AddStudent() {
    const [formData, setFormData] = useState({
        name: '',
        class: '',
        address: '',
        mobileNumber: '',
        username: '',
        password: '',
        confirmPassword: '',
        level: '',
        dob: ''
    });

    const handleChange = (field) => (e) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add submit logic here
    };

    const handleCancel = () => {
        // Add cancel logic here
        setFormData({
            name: '',
            class: '',
            address: '',
            mobileNumber: '',
            username: '',
            password: '',
            confirmPassword: '',
            level: '',
            dob: ''
        });
    };

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
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 my-6 overflow-hidden">
                    {/* Header */}
                    <div className="p-4 md:p-6 border-b border-slate-200">
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-slate-800 text-center">Add Student Info</h2>
                            <p className="text-sm text-slate-500 mt-1 text-center">Fill in the details below to add a new student.</p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-4 md:p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 space-x-4  space-y-1">
                            {/* Name */}
                            <Input
                                label="Student Name"
                                type="text"
                                placeholder="Enter student name"
                                value={formData.name}
                                onChange={handleChange('name')}
                                required
                            />

                            {/* Class */}
                            <Input
                                label="Class"
                                type="text"
                                placeholder="Enter class"
                                value={formData.class}
                                onChange={handleChange('class')}
                                required
                            />

                            {/* Address */}
                            <Input
                                label="Address"
                                type="text"
                                placeholder="Enter address"
                                value={formData.address}
                                onChange={handleChange('address')}
                                required
                            />

                            {/* Mobile Number */}
                            <Input
                                label="Mobile Number"
                                type="number"
                                placeholder="Enter mobile number"
                                value={formData.mobileNumber}
                                onChange={handleChange('mobileNumber')}
                                required
                            />

                            {/* Date of Birth */}
                            <Input
                                label="Date of Birth"
                                type="date"
                                value={formData.dob}
                                onChange={handleChange('dob')}
                                required
                            />

                            {/* Level */}
                            <Input
                                label="Level"
                                type="text"
                                placeholder="Enter level"
                                value={formData.level}
                                onChange={handleChange('level')}
                                required
                            />

                            {/* Username */}
                            <Input
                                label="Username"
                                type="text"
                                placeholder="Enter username"
                                value={formData.username}
                                onChange={handleChange('username')}
                                required
                            />

                            {/* Password */}
                            <Input
                                label="Password"
                                type="password"
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={handleChange('password')}
                                required
                            />

                            {/* Confirm Password */}
                            <Input
                                label="Confirm Password"
                                type="password"
                                placeholder="Re-enter password"
                                value={formData.confirmPassword}
                                onChange={handleChange('confirmPassword')}
                                required
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 md:mt-8">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleCancel}
                                icon={X}
                                className="w-full sm:w-auto"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                icon={Save}
                                className="w-full sm:w-auto"
                            >
                                Save Student
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
