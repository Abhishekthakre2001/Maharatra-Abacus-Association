import React from "react";
import colors from "../utils/Color";

const AppBar = ({
  title,
  subtitle,
  showMobileUser = false,
  userName = "User Name",
  userInitials = "AT",
  className = ""
}) => {
  return (
    <div
      className={`sticky top-0 z-50 bg-gradient-to-r from-blue-600 bg-opacity-70 backdrop-blur-xl shadow-[0px_20px_40px_rgba(0,0,0,0.45)] rounded-2xl p-8 text-white shadow-xl ${className}`}
      style={{
        backgroundImage: `linear-gradient(to right, ${colors.primary.blue600}, ${colors.text.dark})`
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">{title}</h1>
          {subtitle && (
            <p className="hidden md:block text-white text-sm md:text-lg">
              {subtitle}
            </p>
          )}
          {showMobileUser && (
            <div className="flex gap-4 my-4 md:my-0">
              {/* User Icon */}
              <div 
                className="md:hidden w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-md"
                style={{ backgroundColor: colors.primary.blue500 }}
              >
                {userInitials}
              </div>
              {/* Welcome Text */}
              <div className="text-left md:hidden">
                <p className="text-sm" style={{ color: colors.text.blue200 }}>
                  Welcome Back,
                </p>
                <p className="text-lg font-semibold text-white">{userName}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppBar;
