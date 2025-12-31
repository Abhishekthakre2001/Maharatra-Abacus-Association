import React from "react";
import { Download } from "lucide-react";

const ReportCard = ({
  title,
  subtitle,
  icon: Icon,
  gradient = "from-blue-500 to-indigo-600",
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer w-full max-w-sm mx-auto rounded-3xl p-6 shadow-xl text-white bg-gradient-to-br ${gradient} relative overflow-hidden hover:scale-105 transition duration-300`}
    >
      <div className="flex justify-center mb-3">
        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
          <Icon size={32} />
        </div>
      </div>

      <h2 className="text-center text-xl font-bold">{title}</h2>
      {subtitle && <p className="text-center text-white/80 text-sm mt-1">{subtitle}</p>}

      {/* <div className="flex justify-center mt-5">
        <button className="bg-white text-gray-800 font-semibold px-5 py-2 rounded-full shadow-md pointer-events-none">
          <div className="flex items-center gap-2">
            <Download size={18} />
            View
          </div>
        </button>
      </div> */}
    </div>
  );
};

export default ReportCard;
