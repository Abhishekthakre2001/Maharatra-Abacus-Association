// ✅ src/components/DashboardCard.jsx
import React from "react";

const DashboardCard = ({ title, value, icon: Icon }) => {
  return (
    <div
      className="
        group
        bg-gradient-to-br from-blue-50 to-indigo-100
        rounded-2xl
        shadow-md hover:shadow-xl hover:shadow-blue-300/40
        transition-all duration-300
        p-6 border border-blue-100
        hover:-translate-y-1
      "
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-indigo-600 font-medium text-sm">{title}</p>
          <h2 className="text-4xl font-bold text-slate-800 mt-2">{value}</h2>
        </div>

        <div
          className="
            w-14 h-14 rounded-xl
            bg-gradient-to-br from-blue-500 to-indigo-600
            text-white shadow-lg
            flex items-center justify-center
            group-hover:scale-110 transition-transform
          "
        >
          <Icon size={26} />
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
