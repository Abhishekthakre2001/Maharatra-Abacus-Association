import React, { useEffect, useState } from "react";
import Input from "../UI/InputField";
import SelectField from "../UI/SelectField";
import Button from "../UI/Button";
import { Save, X } from "lucide-react";
import userApi from "../api/userApi";
import levelApi from "../api/LevelApi";
import { useCreate } from "../hooks/useCreate";
import { useUpdate } from "../hooks/useUpdate";
import { useParams, useNavigate } from "react-router-dom";
import MessageModal from "../utils/MessageModal";
import { validateStudent } from "../utils/studentValidator";
import AppBar from "../UI/AppBar";


export default function AddStudent() {

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : {};

    console.log("User", user.id);



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
        status: 1,
        usertype: "student"
    });

    const [errors, setErrors] = useState({});

    const [modal, setModal] = useState({
        open: false,
        type: "",
        title: "",
        message: ""
    });

    const [levels, setLevels] = useState([]);

    const { id } = useParams();
    const navigate = useNavigate();

    const { create, loading: createLoading } = useCreate(userApi.create, () => {
        setModal({
            open: true,
            type: "success",
            title: "Success",
            message: "Student added successfully"
        });
        setTimeout(() => {
            handleCancel();
        }, 1200);
    });

    const { update, loading: updateLoading } = useUpdate(userApi.update, () => {
        setModal({
            open: true,
            type: "success",
            title: "Success",
            message: "Student updated successfully"
        });
        setTimeout(() => {
            if (user.id === 50) {
                navigate('/exam-student');
            } else {
                navigate('/students-list');
            }

        }, 1200);
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

    // ...existing code...

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Only require password fields if creating
        if (!id) {
            if (formData.password !== formData.confirmPassword) {
                setErrors({
                    confirmPassword: "Password and Confirm Password must be same"
                });
                return;
            }
        } else {
            // If updating, but one password field is filled, require both and match
            if ((formData.password || formData.confirmPassword) && formData.password !== formData.confirmPassword) {
                setErrors({
                    confirmPassword: "Password and Confirm Password must be same"
                });
                return;
            }
        }

        // Validate required fields (skip password for update)
        let validationErrors = validateStudent(formData);
        if (id) {
            // Remove password/confirmPassword errors for update
            delete validationErrors.password;
            delete validationErrors.confirmPassword;
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});

        const user = JSON.parse(localStorage.getItem("user"));

        // Only send password if filled during update
        const payload = {
            name: formData.name,
            class: formData.class,
            address: formData.address,
            mobilenumber: formData.mobileNumber,
            username: formData.username,
            level: formData.level,
            dob: formData.dob,
            subscription_end_date: formData.subscription_end_date,
            usertype: formData.usertype,
            createdby: user.id,
            password: formData.password,
            status: formData.status
        };
        if (!id || formData.password) {
            payload.password = formData.password;
        }

        try {
            if (id) {
                await update(id, payload);
            } else {
                await create(payload);
            }
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
        navigate("/students-list");
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

            createdby: "admin",
            status: null
        });
        setErrors({});
    };

    useEffect(() => {
        if (!id) return;

        userApi.getbyid(id)
            .then(res => {
                const u = res?.data || res;
                setFormData({
                    name: u.name || "",
                    class: u.class || "",
                    address: u.address || "",
                    mobileNumber: u.mobilenumber || "",
                    username: u.username || "",
                    password: u.password,
                    confirmPassword: u.password,
                    level: u.level || "",
                    dob: u.dob ? u.dob.split('T')[0] : "",
                    subscription_end_date: u.subscription_end_date ? u.subscription_end_date.split('T')[0] : "",
                    usertype: u.usertype || "student",
                    status: u.status
                });
            })
            .catch(() => {
                setModal({ open: true, type: 'error', title: 'Error', message: 'Failed to load student data' });
            });
    }, [id]);

    useEffect(() => {
        const adminid = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).id : null;
        levelApi.getbyadminid(adminid)
            .then(res => {
                const payload = res && res.data !== undefined ? res.data : res;
                setLevels(Array.isArray(payload) ? payload : []);
            })
            .catch(() => {
                // ignore
            });
    }, []);

    return (
        <>
            <MessageModal
                open={modal.open}
                type={modal.type}
                title={modal.title}
                message={modal.message}
                onClose={() => setModal({ ...modal, open: false })}
            />
            <AppBar title="Student Management" subtitle="Manage and view all students" />

            {/* ⬇️ EVERYTHING BELOW IS YOUR ORIGINAL DESIGN (UNCHANGED) ⬇️ */}
            <div className="h-full flex flex-col">
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 my-6 flex-1">
                    <div className="p-4 md:p-6 border-b border-slate-200">
                        <h2 className="text-xl md:text-2xl font-bold text-center">
                            {id ? "Update Student Info" : "Add Student Info"}
                        </h2>
                        <p className="text-sm text-slate-500 mt-1 text-center">
                            Fill in the details below to add a new student.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-4 md:p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 space-x-4 space-y-1">
                            <Input label="Student Name" value={formData.name} onChange={handleChange("name")} required error={errors.name} showError={!!errors.name} />
                            <Input label="Class" value={formData.class} onChange={handleChange("class")} required error={errors.class} showError={!!errors.class} />
                            <Input label="Address" value={formData.address} onChange={handleChange("address")} required error={errors.address} showError={!!errors.address} />
                            <Input label="Mobile Number" type="number" value={formData.mobileNumber} onChange={handleChange("mobileNumber")} required error={errors.mobileNumber} showError={!!errors.mobileNumber} />
                            <Input label="Date of Birth" type="date" value={formData.dob} onChange={handleChange("dob")} required error={errors.dob} showError={!!errors.dob} />
                            <Input label="Subscription End Date" type="date" value={formData.subscription_end_date} onChange={handleChange("subscription_end_date")} required error={errors.subscription_end_date} showError={!!errors.subscription_end_date} />
                            {/* <SelectField
                                label="Level"
                                value={formData.level}
                                onChange={handleChange("level")}
                                options={levels.map(lv => ({
                                    value: lv.level,
                                    label: lv.level || lv.name || `Level ${lv.id}`
                                }))}
                                placeholder="-- Select Level --"
                                required
                                error={errors.level}
                                showError={!!errors.level}
                            /> */}
                            <SelectField
                                label="Level"
                                value={formData.level}
                                onChange={handleChange("level")}
                                options={levels.map(lv => ({
                                    value: lv.level,
                                    label: lv.level_name
                                        ? `${lv.level} - ${lv.level_name}`
                                        : `${lv.level}`
                                }))}
                                placeholder="-- Select Level --"
                                required
                                error={errors.level}
                                showError={!!errors.level}
                            />
                            <Input label="Username" value={formData.username} onChange={handleChange("username")} required error={errors.username} showError={!!errors.username} />
                            <Input type="password" label="Password" value={formData.password} onChange={handleChange("password")} required={!id} error={errors.password} showError={!!errors.password} />
                            <Input type="password" label="Confirm Password" value={formData.confirmPassword} onChange={handleChange("confirmPassword")} required={!id} error={errors.confirmPassword} showError={!!errors.confirmPassword} />
                            <SelectField
                                label="Is Active"
                                value={Number(formData.status)}   // 🔑 ensure number
                                onChange={handleChange("status")} // ✅ FIXED
                                options={[
                                    { value: 1, label: "Active" },
                                    { value: 0, label: "Deactive" }
                                ]}
                                placeholder="-- Select Status --"
                                required
                                error={errors.status}             // ✅ FIXED
                                showError={!!errors.status}
                            />


                        </div>
                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 md:mt-8">
                            <Button type="button" variant="secondary" onClick={handleCancel} icon={X}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="primary" icon={Save} disabled={createLoading || updateLoading}>
                                {(createLoading || updateLoading) ? (id ? "Updating..." : "Saving...") : (id ? "Update Student" : "Save Student")}
                            </Button>
                        </div>


                    </form>
                </div>
            </div>
        </>
    );
}
