import { useState } from "react";
import InputField from "../UI/InputField";
import SelectField from "../UI/SelectField";
import { useCreate } from "../hooks/useCreate";
import examRegistartionApi from '../api/exam_registartion';
import MessageModal from "../utils/MessageModal";

export default function Registration() {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    class: "",
    address: "",
    city: "",
    pincode: "",
    parentName: "",
    whatsapp: "",
    mobile: "",
    username: "",
    password: "",
    confirmPassword: "",
    level: "",
    dob: "",
    learningCenter: "",
    subscription_end_date: "2024-12-31",
    usertype: "student",
    createdby: 1,
    status: 0,
  });

  const [modal, setModal] = useState({
    open: false,
    type: "",
    title: "",
    message: ""
  });

  const [errors, setErrors] = useState({});

  const nameRegex = /^[A-Za-z\s]+$/;
  const mobileRegex = /^[0-9]{10}$/;
  const pincodeRegex = /^[0-9]{6}$/;

  // 🔥 Validate Single Field (Real-Time)
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "firstName":
      case "middleName":
      case "lastName":
      case "parentName":
      case "city":
        if (!value.trim()) error = "This field is required";
        else if (!nameRegex.test(value))
          error = "Only letters allowed";
        break;

      case "mobile":
      case "whatsapp":
        if (!mobileRegex.test(value))
          error = "Must be 10 digit number";
        break;

      case "pincode":
        if (!pincodeRegex.test(value))
          error = "Must be 6 digit number";
        break;

      case "address":
      case "learningCenter":
      case "username":
        if (!value.trim()) error = "This field is required";
        break;

      case "password":
        if (value.length < 6)
          error = "Minimum 6 characters required";
        break;

      case "confirmPassword":
        if (value !== formData.password)
          error = "Passwords do not match";
        break;

      case "dob":
        if (!value) error = "Date of birth required";
        break;

      case "class":
        if (!value) error = "Select class";
        break;

      case "level":
        if (!value) error = "Select level";
        break;

      default:
        break;
    }

    return error;
  };

  const classOptions = [
    { label: "class 1 - Beginner", value: 1 },
    { label: "class 2 - Basic", value: 2 },
    { label: "class 3 - Intermediate", value: 3 },
    { label: "class 4 - Advanced", value: 4 },
    { label: "class 5", value: 5 },
  ];

  const levelOptions = [
    { label: "Level 1 - Beginner", value: 1 },
    { label: "Level 2 - Basic", value: 2 },
    { label: "Level 3 - Intermediate", value: 3 },
    { label: "Level 4 - Advanced", value: 4 },
    { label: "Grand Level", value: 5 },
  ];


  // 🔥 Handle Change with Real-Time Validation
  const handleChange = (field) => (e) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    const error = validateField(field, value);

    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));

    // Re-check confirm password when password changes
    if (field === "password" && formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          value !== formData.confirmPassword
            ? "Passwords do not match"
            : "",
      }));
    }
  };

  // 🔥 Validate All On Submit
  const validateAll = () => {
    let newErrors = {};

    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateAll()) {
      create(formData); // 🔥 THIS SAVES DATA TO API
    }
  };


  const { create, loading: createLoading } = useCreate(
    examRegistartionApi.create,
    () => {
      // alert("Registration Submitted Successfully 🎉");
      setModal({
        open: true,
        type: "success",
        title: "Success",
        message: "Student Registration successfully 🎉"
      });
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100">

        {/* TOP BAR */}
        <div className="bg-gradient-to-r from-blue-700 to-cyan-600 text-white py-4 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold">
              🧮 Abacus Learning Center
            </h1>
            <span>Exam Registration Form</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-white shadow-2xl rounded-3xl p-8">

            <form onSubmit={handleSubmit} className="space-y-10">

              <SectionTitle title="Student Details" />

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <InputField label="First Name" value={formData.firstName} onChange={handleChange("firstName")} error={errors.firstName} showError={!!errors.firstName} required />
                <InputField label="Middle Name" value={formData.middleName} onChange={handleChange("middleName")} error={errors.middleName} showError={!!errors.middleName} required />
                <InputField label="Last Name" value={formData.lastName} onChange={handleChange("lastName")} error={errors.lastName} showError={!!errors.lastName} required />
                <InputField label="Date of Birth" type="date" value={formData.dob} onChange={handleChange("dob")} error={errors.dob} showError={!!errors.dob} required />
                <SelectField
                  label="Class"
                  options={classOptions}
                  value={formData.class}
                  onChange={handleChange("class")}
                  error={errors.class}
                  showError={!!errors.class}
                  required
                />

                <SelectField
                  label="Level"
                  options={levelOptions}
                  value={formData.level}
                  onChange={handleChange("level")}
                  error={errors.level}
                  showError={!!errors.level}
                  required
                />

              </div>

              <SectionTitle title="Contact Information" />

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <InputField label="Parent Name" value={formData.parentName} onChange={handleChange("parentName")} error={errors.parentName} showError={!!errors.parentName} required />
                <InputField label="Mobile Number" value={formData.mobile} onChange={handleChange("mobile")} error={errors.mobile} showError={!!errors.mobile} required />
                <InputField label="WhatsApp Number" value={formData.whatsapp} onChange={handleChange("whatsapp")} error={errors.whatsapp} showError={!!errors.whatsapp} required />
                <InputField label="Address" value={formData.address} onChange={handleChange("address")} error={errors.address} showError={!!errors.address} required />
                <InputField label="City" value={formData.city} onChange={handleChange("city")} error={errors.city} showError={!!errors.city} required />
                <InputField label="Pincode" value={formData.pincode} onChange={handleChange("pincode")} error={errors.pincode} showError={!!errors.pincode} required />
              </div>

              <SectionTitle title="Account Details" />

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <InputField label="Username" value={formData.username} onChange={handleChange("username")} error={errors.username} showError={!!errors.username} required />
                <InputField label="Password" type="password" value={formData.password} onChange={handleChange("password")} error={errors.password} showError={!!errors.password} required />
                <InputField label="Confirm Password" type="password" value={formData.confirmPassword} onChange={handleChange("confirmPassword")} error={errors.confirmPassword} showError={!!errors.confirmPassword} required />
                <InputField label="Learning Center Name" value={formData.learningCenter} onChange={handleChange("learningCenter")} error={errors.learningCenter} showError={!!errors.learningCenter} required />
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={createLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-2xl text-lg font-semibold disabled:opacity-50"
                >
                  {createLoading ? "Submitting..." : "Submit Registration"}
                </button>

              </div>

            </form>
          </div>
        </div>
      </div>
    </>


  );
}

function SectionTitle({ title }) {
  return (
    <div className=" border-gray-300 pl-4 border-b-1 pb-2">
      <h2 className="text-xl font-semibold text-blue-700">{title}</h2>
    </div>
  );
}
