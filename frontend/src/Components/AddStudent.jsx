import React, { useEffect, useState } from "react";
import Input from "../UI/InputField";
import Button from "../UI/Button";
import { Save, X } from "lucide-react";
import userApi from "../api/userApi";
import { useCreate } from "../hooks/useCreate";
import MessageModal from "../utils/MessageModal";
import { validateStudent } from "../utils/studentValidator";


export default function AddStudent() {


    const [formData, setFormData] = useState({
        name: "",
        class: "",
        address: "",
        mobileNumber: "",
        username: "",
        password: "",
        confirmPassword: "",
        level: "",
        dob: "",
        subscription_end_date: "",
        usertype: "student"
    });

    const [errors, setErrors] = useState({});

    const [modal, setModal] = useState({
        open: false,
        type: "",
        title: "",
        message: ""
    });

    const { create, loading } = useCreate(userApi.create, () => {
        setModal({
            open: true,
            type: "success",
            title: "Success",
            message: "Student added successfully"
        });
        handleCancel();
    });

    const handleChange = (field) => (e) => {
        setFormData((prev) => ({
            ...prev,
            [field]: e.target.value
        }));

        // clear error for this field
        setErrors((prev) => ({
            ...prev,
            [field]: ""
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 🔐 Password match
        if (formData.password !== formData.confirmPassword) {
            setErrors({
                confirmPassword: "Password and Confirm Password must be same"
            });
            return;
        }

        const validationErrors = validateStudent(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});

        const user = JSON.parse(localStorage.getItem("user"));

        const payload = {
            name: formData.name,
            class: formData.class,
            address: formData.address,
            mobilenumber: formData.mobileNumber,
            username: formData.username,
            password: formData.password,
            level: formData.level,
            dob: formData.dob,
            subscription_end_date: formData.subscription_end_date,
            usertype: formData.usertype,
            createdby: user.id
        };

        try {
            await create(payload);
        } catch (err) {
            const errorMsg =
                err?.response?.data?.error ||
                err?.response?.data?.message ||
                "";

            // ✅ Handle duplicate username
            if (errorMsg.includes("users.username")) {
                setErrors({
                    username: "Username not available, use another username"
                });
            } else {
                setModal({
                    open: true,
                    type: "error",
                    title: "Error",
                    message: "Something went wrong. Please try again."
                });
            }
        }
    };




    const handleCancel = () => {
        setFormData({
            name: "",
            class: "",
            address: "",
            mobileNumber: "",
            username: "",
            password: "",
            confirmPassword: "",
            level: "",
            dob: "",
            subscription_end_date: "",
            usertype: "student",
            status: 1,
            createdby: "admin"
        });
    };

    return (
        <>
            <MessageModal
                open={modal.open}
                type={modal.type}
                title={modal.title}
                message={modal.message}
                onClose={() => setModal({ ...modal, open: false })}
            />

            {/* ⬇️ EVERYTHING BELOW IS YOUR ORIGINAL DESIGN (UNCHANGED) ⬇️ */}
            <div className="max-w-7xl mx-auto">
                <div className="bg-gradient-to-r from-blue-600 to-[#110F12]
        bg-opacity-70 backdrop-blur-xl shadow-[0px_20px_40px_rgba(0,0,0,0.45)]
        rounded-2xl p-8 text-white shadow-xl">

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                                Student Management
                            </h1>
                            <p className="hidden md:block text-white text-sm md:text-lg">
                                Manage and view all students
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 my-6 overflow-hidden">
                    <div className="p-4 md:p-6 border-b border-slate-200">
                        <h2 className="text-xl md:text-2xl font-bold text-center">
                            Add Student Info
                        </h2>
                        <p className="text-sm text-slate-500 mt-1 text-center">
                            Fill in the details below to add a new student.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-4 md:p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 space-x-4 space-y-1">

                            <Input label="Student Name" value={formData.name} onChange={handleChange("name")} required error={errors.name}
                                showError={!!errors.name} />
                            <Input label="Class" value={formData.class} onChange={handleChange("class")} required error={errors.class}
                                showError={!!errors.class} />
                            <Input label="Address" value={formData.address} onChange={handleChange("address")} required error={errors.address}
                                showError={!!errors.address} />

                            <Input
                                label="Mobile Number"
                                type="number"
                                value={formData.mobileNumber}
                                onChange={handleChange("mobileNumber")}
                                required
                                error={errors.mobileNumber}
                                showError={!!errors.mobileNumber}
                            />

                            <Input
                                label="Date of Birth"
                                type="date"
                                value={formData.dob}
                                onChange={handleChange("dob")}
                                required
                                error={errors.dob}
                                showError={!!errors.dob}
                            />

                            <Input
                                label="Subscription End Date"
                                type="date"
                                value={formData.subscription_end_date}
                                onChange={handleChange("subscription_end_date")}
                                required
                                error={errors.subscription_end_date}
                                showError={!!errors.subscription_end_date}
                            />

                            <Input label="Level" value={formData.level} onChange={handleChange("level")} required error={errors.level}
                                showError={!!errors.level} />
                            <Input label="Username" value={formData.username} onChange={handleChange("username")} required error={errors.username}
                                showError={!!errors.username} />

                            <Input type="password" label="Password" value={formData.password} onChange={handleChange("password")} required error={errors.password}
                                showError={!!errors.password} />
                            <Input type="password" label="Confirm Password" value={formData.confirmPassword} onChange={handleChange("confirmPassword")} required error={errors.confirmPassword}
                                showError={!!errors.confirmPassword} />

                        </div>

                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 md:mt-8">
                            <Button type="button" variant="secondary" onClick={handleCancel} icon={X}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="primary" icon={Save} disabled={loading}>
                                {loading ? "Saving..." : "Save Student"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
