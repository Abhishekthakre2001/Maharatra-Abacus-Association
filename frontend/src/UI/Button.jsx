import React from "react";

const Button = ({
    children,
    onClick,
    type = "button",
    className = "",
    disabled = false,
    loading = false,
    variant = "primary",
    size = "md",
    icon: Icon,
}) => {
    const baseStyles =
        "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200";

    const variantStyles = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white",
        green:"bg-green-600 hover:bg-green-700 text-white",
        secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
        danger: "bg-red-600 hover:bg-red-700 text-white",
        outline: "border border-gray-400 text-gray-800 hover:bg-gray-100",
    };

    const sizeStyles = {
        sm: "px-3 py-1 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${(disabled || loading) && "opacity-60 cursor-not-allowed"
                } ${className}`}
        >
            {loading ? (
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-2"></span>
            ) : Icon ? (
                <Icon className="w-5 h-5 mr-2" />
            ) : null}
            {children}
        </button>
    );
};

export default Button;


// how to use it


// import Button from "./components/Button";
// import { Plus } from "lucide-react";

// function Home() {
//   return (
    // <div className="space-x-4">
    //   <Button onClick={() => alert("Primary clicked!")}>Primary</Button>

    //   <Button variant="secondary">Secondary</Button>

    //   <Button variant="danger">Delete</Button>

    //   <Button variant="outline">Outline</Button>

    //   <Button icon={Plus} onClick={() => alert("Add clicked!")}>
    //     Add User
    //   </Button>

    //   <Button loading>Loading...</Button>
    // </div>
//   );
// }
