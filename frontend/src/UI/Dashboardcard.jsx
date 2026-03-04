// ✅ src/components/DashboardCard.jsx
import React from "react";
import colors from "../utils/Color";

const DashboardCard = ({ title, value, icon: Icon }) => {
  return (
    <div
      className="
        group
       
        rounded-2xl
        shadow-md hover:shadow-xl hover:shadow-blue-300/40
        transition-all duration-300
        p-6 
        hover:-translate-y-1
      "
      style={{
        backgroundImage: `linear-gradient(
      to bottom right,
      ${colors.dashboard.card.bg.gradientFrom},
      ${colors.dashboard.card.bg.gradientTo}
    )`,
        border: `1px solid ${colors.dashboard.card.bg.border}`,
        boxShadow: `0 10px 20px ${colors.dashboard.card.shadow.normal}`,
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-[18px]" style={{ color: colors.dashboard.card.text.title }}>{title}</p>
          <h2 className="text-4xl font-bold mt-2" style={{ color: colors.dashboard.card.text.value }}>{value}</h2>
        </div>

        <div
          className="
    w-14 h-14 rounded-xl
    flex items-center justify-center
    group-hover:scale-110 transition-transform
  "
          style={{
            backgroundImage: `linear-gradient(
      to bottom right,
      ${colors.dashboard.card.icon.bgGradientFrom},
      ${colors.dashboard.card.icon.bgGradientTo}
    )`,
            color: colors.dashboard.card.icon.color,
            boxShadow: "0 10px 15px rgba(0,0,0,0.15)",
          }}
        >
          <Icon size={26} />
        </div>

      </div>
    </div>
  );
};

export default DashboardCard;
