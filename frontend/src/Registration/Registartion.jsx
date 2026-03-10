import { useState } from "react";
import InputField from "../UI/InputField";
import SelectField from "../UI/SelectField";
import { useCreate } from "../hooks/useCreate";
import examRegistartionApi from '../api/exam_registartion';
import MessageModal from "../utils/MessageModal";
import Logo from "../assets/Maharashtra_Abacus_Association.jpg";

const initialFormData = {
  age: 0,
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
  createdby: 50,
  status: 0,
};

export default function Registration() {
  const [formData, setFormData] = useState({
    age: 0,
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
    subscription_end_date: "2026-04-30",
    usertype: "student",
    createdby: 50,
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
        if (value === "" || value === null || value === undefined) {
          error = "Select class";
        }
        break;

      case "level":
        if (value === "" || value === null || value === undefined) {
          error = "Select level";
        }
        break;

      default:
        break;
    }

    return error;
  };

  const classOptions = [
    { label: "class 1", value: 1 },
    { label: "class 2", value: 2 },
    { label: "class 3", value: 3 },
    { label: "class 4", value: 4 },
    { label: "class 5", value: 5 },
    { label: "class 6", value: 6 },
    { label: "class 7", value: 7 },
    { label: "class 8", value: 8 },
  ];

  const levelOptions = [
    { label: "Bud level ", value: 0 },
    { label: "New commer ", value: 10 },
    { label: "A level", value: 11 },
    { label: "1st level", value: 1 },
    { label: "2nd level", value: 2 },
    { label: "3rd level", value: 3 },
    { label: "4th level", value: 4 },
    { label: "5th level", value: 5 },
    { label: "6th level", value: 6 },
    { label: "7th level", value: 7 },
    { label: "8th level", value: 8 },
  ];


  // 🔥 Handle Change with Real-Time Validation
  const handleChange = (field) => (e) => {
    const value = e.target.value;

    // setFormData((prev) => ({
    //   ...prev,
    //   [field]: value,
    // }));

    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // ✅ Auto-calc age from DOB
      if (field === "dob") {
        updated.age = calculateAgeFromDob(value);
      }

      return updated;
    });

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

    // ✅ Validate DOB & Age together (optional)
    if (field === "dob") {
      const age = calculateAgeFromDob(value);
      setErrors((prev) => ({
        ...prev,
        dob: !value ? "Date of birth required" : "",
        age: age <= 0 ? "Invalid DOB" : "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAll()) return;

    try {
      await create(formData);
    } catch (error) {
      setModal({
        open: true,
        type: "error",
        title: "Error",
        message:
          error?.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
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
      setFormData(initialFormData);
      setErrors({});
    }
  );

  const calculateAgeFromDob = (dob) => {
    if (!dob) return 0;

    const birth = new Date(dob);
    if (Number.isNaN(birth.getTime())) return 0;

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();

    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age < 0 ? 0 : age;
  };

  console.log("formData", formData)


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
            <h1 className="text-md md:text-3xl font-bold">
              <img src={Logo} alt="DevEraa Logo" className="h-10 w-10 inline mr-2 rounded" />
              Maharashtra Abacus Association
            </h1>
            <span className="hidden md:block">Exam Registration Form</span>
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
                <InputField label="Age" disabled type="number" value={formData.age} onChange={handleChange("age")} error={errors.age} showError={!!errors.age} required />

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
