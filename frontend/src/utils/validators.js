// utils/validators.js

export const validators = {
    required: (value) => {
        if (!value || value.toString().trim() === "") {
            return "This field is required";
        }
        return null;
    },

    supplierName: (value) => {
        if (!value || value.trim() === "") return "Supplier name is required";

        const hasAlphabet = /[A-Za-z]/.test(value);
        const onlyNumbers = /^[0-9]+$/.test(value);
        const onlySpecial = /^[^A-Za-z0-9]+$/.test(value);

        // FIXED: numbers + special characters only
        const numberSpecialCombo =
            /^[^A-Za-z]+$/.test(value) && /[0-9]/.test(value);

        if (!hasAlphabet)
            return "Must contain at least one alphabet (A-Z)";

        if (onlyNumbers)
            return "Only numbers are not allowed";

        if (onlySpecial)
            return "Only special characters are not allowed";

        if (numberSpecialCombo)
            return "Must include alphabets — cannot be only numbers & special characters";

        return null;
    },


    coiltype: (value) => {
        if (!value || value.trim() === "")
            return "Coil Type is required";

        const hasAlphabet = /[A-Za-z]/.test(value);

        // Only numbers (spaces allowed)
        const onlyNumbers = /^[0-9\s]+$/.test(value);

        // Only special characters (spaces allowed)
        const onlySpecial = /^[^A-Za-z0-9\s]+$/.test(value);

        // Number + special only (NO alphabets)
        const numberSpecialCombo = /^[0-9\W_]+$/.test(value) && !hasAlphabet;

        if (!hasAlphabet)
            return "Must contain at least one alphabet (A-Z)";

        if (onlyNumbers)
            return "Only numbers are not allowed";

        if (onlySpecial)
            return "Only special characters are not allowed";

        if (numberSpecialCombo)
            return "Must include alphabets — cannot be only numbers & special characters";

        return null;
    },

    positiveNumber: (value) => {
        if (!value || value.toString().trim() === "")
            return "This field is required";

        // Allow only: 123, 123.4, 123.45  (no letters, no symbols)
        const regex = /^[0-9]+(\.[0-9]{1,2})?$/;

        if (!regex.test(value))
            return "Only positive integers or decimals allowed";

        if (parseFloat(value) <= 0)
            return "Value must be greater than zero";

        return null;
    },

    basicColorName: (value) => {
        if (!value || value.trim() === "")
            return "Basic color name is required";

        const trimmed = value.trim();

        // Max length 20 characters
        if (trimmed.length > 20)
            return "Maximum 20 characters allowed";

        // Only alphabets + single spaces between words
        const regex = /^[A-Za-z]+( [A-Za-z]+)*$/;

        if (!regex.test(trimmed))
            return "Only alphabets and single spaces allowed (no numbers or special characters)";

        return null;
    },

    colorCode: (value) => {
        if (!value || value.trim() === "")
            return "Color code is required";

        const trimmed = value.trim();

        // Only: alphabets + numbers + spaces + hyphen allowed
        const regex = /^[A-Za-z0-9\- ]+$/;

        if (!regex.test(trimmed))
            return "Only alphabets, numbers, spaces and hyphens (-) are allowed";

        // No consecutive hyphens
        if (/--/.test(trimmed))
            return "Invalid format: multiple hyphens are not allowed";

        // No starting / ending hyphen
        if (trimmed.startsWith("-") || trimmed.endsWith("-"))
            return "Color code cannot start or end with a hyphen";

        // Optional: max length limit (50)
        if (trimmed.length > 50)
            return "Maximum 50 characters allowed";

        return null;
    },

    companyName: (value) => {
        if (!value || value.trim() === "")
            return "Company name is required";

        const trimmed = value.trim();

        // At least 1 alphabet mandatory
        if (!/[A-Za-z]/.test(trimmed))
            return "Company name must contain at least one alphabet";

        // Allowed characters: alphabets, digits, space, hyphen, ampersand, comma
        const regex = /^[A-Za-z0-9 &,\-]+$/;
        if (!regex.test(trimmed))
            return "Only alphabets, numbers, spaces, hyphens (-), commas (,), and ampersand (&) are allowed";

        // No double spaces
        if (/\s{2,}/.test(trimmed))
            return "Company name cannot contain multiple spaces";

        // No consecutive hyphens
        if (/--/.test(trimmed))
            return "Company name cannot contain multiple hyphens";

        // Cannot start or end with hyphen
        if (trimmed.startsWith("-") || trimmed.endsWith("-"))
            return "Company name cannot start or end with a hyphen";

        // Max length 40
        if (trimmed.length > 40)
            return "Maximum 40 characters allowed";

        return null;
    },


    fullName: (value) => {
        if (!value || value.trim() === "")
            return "Full name is required";

        const trimmed = value.trim();

        // Only alphabets + single spaces
        const regex = /^[A-Za-z]+( [A-Za-z]+)*$/;

        if (!regex.test(trimmed))
            return "Only alphabets allowed with single spaces (no numbers/special chars)";

        // Max length 40 (optional)
        if (trimmed.length > 40)
            return "Maximum 40 characters allowed";

        return null;
    },

    mobile: (value) => {
        if (!value || value.trim() === "")
            return "Mobile Number is required";

        const regex = /^[6-9]\d{9}$/;
        return regex.test(value) ? null : "Invalid mobile number";
    },

    emailFormat: (value) => {
        if (!value || value.trim() === "")
            return "E-mail is required";

        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(value) ? null : "Invalid email address";
    },


    departmentName: (value) => {
        if (!value || value.trim() === "")
            return "Department is required";

        const trimmed = value.trim();

        const regex = /^[A-Za-z ]+$/;
        if (!regex.test(trimmed))
            return "Department must contain only alphabets and spaces";

        if (trimmed.length > 30)
            return "Maximum 30 characters allowed";

        return null;
    },

    passwordRule: (value, required) => {
        if (required && (!value || value.trim() === ""))
            return "Password is required";

        return null; // No other restriction
    },

    pastOrToday(value) {
        if (!value) return "Date is required";

        // Convert both to YYYY-MM-DD only (avoid time zone issues)
        const selected = new Date(value + "T00:00:00");
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selected.getTime() > today.getTime())
            return "Date cannot be in the future";

        return null;
    },




    requiredSelect(value) {
        if (!value || value.trim() === "" || value === "Select")
            return "This field is required";
        return null;
    },

    positiveDecimal(value) {
        if (!value || value.toString().trim() === "")
            return "This field is required";

        const regex = /^[0-9]+(\.[0-9]+)?$/;

        if (!regex.test(value))
            return "Enter a positive integer or decimal value";

        if (parseFloat(value) <= 0)
            return "Value must be greater than zero";

        return null;
    },

    vehicle(value) {
        if (!value || value.trim() === "")
            return "Vehicle number is required";

        // MH12AB1234 / MH12AA1234 / MH12A1234
        const regex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,2}[0-9]{4}$/i;

        return regex.test(value)
            ? null
            : "Invalid vehicle number (e.g., MH12AB1234)";
    },



    gst: (value) => {
        if (!value) return "GST number is required";
        const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        return regex.test(value) ? null : "Invalid GST Number";
    },

    // vehicle: (value) => {
    //     const regex = /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/i;
    //     return regex.test(value) ? null : "Invalid vehicle number (e.g., MH12AB1234)";
    // },

    email: (value) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(value) ? null : "Invalid email address";
    },

    number: (value) => {
        return isNaN(value) ? "Must be a number" : null;
    },

    minLength: (value, len) => {
        return value.length < len ? `Minimum ${len} characters required` : null;
    },

    maxLength: (value, len) => {
        return value.length > len ? `Maximum ${len} characters allowed` : null;
    }
};
