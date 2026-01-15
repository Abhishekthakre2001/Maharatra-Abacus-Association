import { X, Trash2 } from "lucide-react";

const DeleteConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title = "Delete Confirmation",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  width = "max-w-md",
  loading = false,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2">
      <div className={`bg-white rounded-xl shadow-xl w-full ${width} p-6 relative animate-fadeIn`}>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 text-gray-600 hover:text-black transition"
        >
          <X size={22} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <Trash2 size={22} className="text-red-600" />
          {title}
        </h2>

        {/* Message */}
        <p className="text-gray-600 mb-6">{message}</p>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition flex items-center gap-2 ${
              loading && "opacity-60 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
            ) : (
              <Trash2 size={18} />
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;

// how to use this modal

// import React, { useState } from "react";
// import DeleteConfirmModal from "./DeleteConfirmModal";

// const Demo = () => {
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);

  // const handleDelete = () => {
  //   setLoading(true);
  //   setTimeout(() => {
  //     alert("Item deleted!");
  //     setLoading(false);
  //     setOpen(false);
  //   }, 1500);
  // };

//   return (
//     <>
//       <button
//         onClick={() => setOpen(true)}
//         className="px-4 py-2 bg-red-600 text-white rounded-lg"
//       >
//         Delete
//       </button>

//       <DeleteConfirmModal
//         open={open}
//         onClose={() => setOpen(false)}
//         onConfirm={handleDelete}
//         loading={loading}
//         message="Do you really want to delete this record?"
//       />
//     </>
//   );
// };

// export default Demo;
