import { X } from "lucide-react";

const Modal = ({ open, onClose, title, children, width = "max-w-lg" }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className={`bg-white rounded-xl shadow-xl w-full ${width} p-6 relative animate-fadeIn`}>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-1 text-gray-600 hover:text-black transition"
                >
                    <X size={22} />
                </button>

                {/* Title */}
                {title && (
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">{title}</h2>
                )}

                {/* Content */}
                <div>{children}</div>
            </div>
        </div>
    );
};

export default Modal;
