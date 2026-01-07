import React from "react";
import colors from "../../utils/Color";

const StudentAppBar = ({
  title,
  subtitle,
  showMobileUser = false,
  userName = "User Name",
  userInitials = "AT",
  userImage = null,
  onLogout,
  className = ""
}) => {
  return (
    <div
      className={`bg-gradient-to-r from-blue-600 bg-opacity-70 backdrop-blur-xl shadow-[0px_20px_40px_rgba(0,0,0,0.45)] rounded-2xl p-6 text-white shadow-xl ${className}`}
      style={{
        backgroundImage: `linear-gradient(to right, ${colors.primary.blue600}, ${colors.text.dark})`
      }}
    >
      <div className="flex items-center justify-between">
        {/* Left Side - Student Info */}
        <div className="flex items-center gap-4">
          {/* Student Image/Initials */}
          {userImage ? (
            <img 
              src={userImage} 
              alt={userName}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-white shadow-lg"
            />
          ) : (
            <div 
              className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-lg font-bold shadow-lg border-2 border-white"
              style={{ backgroundColor: colors.primary.blue500 }}
            >
              {userInitials}
            </div>
          )}
          
          {/* Student Name and Title */}
          <div>
            <h2 className="text-lg md:text-xl font-semibold">{userName}</h2>
            <p className="text-sm md:text-base opacity-90">{title}</p>
          
          </div>
        </div>

        {/* Right Side - Logout Button */}
        <button
          onClick={onLogout}
          className="px-4 py-2 md:px-6 md:py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
            />
          </svg>
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default StudentAppBar;