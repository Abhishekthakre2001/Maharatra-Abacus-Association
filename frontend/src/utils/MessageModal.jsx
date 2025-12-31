import React from "react";
import { X, CheckCircle, AlertTriangle } from "lucide-react";

const MessageModal = ({
  open,
  type = "success", // "success" or "error"
  title,
  message,
  onClose,
}) => {
  if (!open) return null;

  const isSuccess = type === "success";

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-2xl shadow-2xl w-80 space-y-4 animate-scaleIn relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-slate-500 hover:text-red-500 transition"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex justify-center">
          {isSuccess ? (
            <CheckCircle size={48} className="text-green-500" />
          ) : (
            <AlertTriangle size={48} className="text-red-500" />
          )}
        </div>

        {/* Title */}
        <h2
          className={`text-xl font-semibold text-center ${
            isSuccess ? "text-green-600" : "text-red-600"
          }`}
        >
          {title}
        </h2>

        {/* Message */}
        <p className="text-center text-slate-600">{message}</p>

        {/* Buttons */}
        <div className="flex justify-center gap-3 pt-2">
          <button
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            onClick={onClose}
          >
            OK
          </button>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
        .animate-scaleIn {
          animation: scaleIn 0.25s ease-out;
        }
        @keyframes scaleIn {
          0% { opacity: 0; transform: scale(0.85); }
          100% { opacity: 1; transform: scale(1); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        `}
      </style>
    </div>
  );
};

export default MessageModal;



//  how to use this 

// import React, { useState } from "react";
// import MessageModal from "../components/MessageModal";

// export default function DemoPage() {
//   const [modal, setModal] = useState({
//     open: false,
//     type: "success",
//     title: "",
//     message: "",
//   });

//   const showSuccess = () => {
//     setModal({
//       open: true,
//       type: "success",
//       title: "Success!",
//       message: "Data saved successfully ✅",
//     });
//   };

//   const showError = () => {
//     setModal({
//       open: true,
//       type: "error",
//       title: "Error!",
//       message: "Something went wrong ❌",
//     });
//   };

//   return (
//     <>
//       <button
//         onClick={showSuccess}
//         className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
//       >
//         Show Success
//       </button>

//       <button
//         onClick={showError}
//         className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded ml-3"
//       >
//         Show Error
//       </button>

//       <MessageModal
//         open={modal.open}
//         type={modal.type}
//         title={modal.title}
//         message={modal.message}
//         onClose={() => setModal({ ...modal, open: false })}
//       />
//     </>
//   );
// }
