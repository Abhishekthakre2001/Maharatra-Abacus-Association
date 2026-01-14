import React, { useState } from "react";
import { createPortal } from "react-dom";
import colors from "../../utils/Color";
import Button from "../../UI/Button";


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
    const [open, setOpen] = useState(false);

    return (
      <div
        className={`relative bg-gradient-to-r from-blue-600 bg-opacity-70 backdrop-blur-xl shadow-[0px_20px_40px_rgba(0,0,0,0.45)] rounded-2xl p-6 text-white shadow-xl ${className}`}
        style={{
          backgroundImage: `linear-gradient(to right, ${colors.primary.blue600}, ${colors.text.dark})`
        }}
      >
        <div className="flex items-center justify-between">
          {/* Left Side - Student Info (avatar clickable) */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setOpen(true)}
              aria-label="Open profile"
              className="flex items-center gap-3 p-0 bg-transparent border-0"
            >
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

              <div className="text-left">
                <h2 className="text-lg md:text-xl font-semibold">ABACUS</h2>
                <p className="text-sm md:text-base opacity-90 hidden md:block">{subtitle}</p>
              </div>
            </button>
          </div>

        </div>

        {/* Profile modal (centered, high z-index) */}
        {open && createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black bg-opacity-60" onClick={() => setOpen(false)} />
            <div className="relative bg-white w-full max-w-md rounded-2xl p-4 md:p-6 shadow-2xl z-[100000] max-h-[90vh] overflow-y-auto">
              <div className="flex justify-end">
                <button onClick={() => setOpen(false)} aria-label="Close profile" className="text-gray-600 hover:text-gray-800 text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-full">
                  ×
                </button>
              </div>

              <div className="flex flex-col items-center gap-3">
                {userImage ? (
                  <img src={userImage} alt={userName} className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 shadow" />
                ) : (
                  <div className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold" style={{ backgroundColor: colors.primary.blue500 }}>{userInitials}</div>
                )}

                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">{userName}</h3>
                  {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
                </div>

                <div className="w-full mt-2">
                  <Button variant="outline" size="lg" onClick={() => { setOpen(false); onLogout && onLogout(); }} className="w-full">
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>, document.body
        )}

      </div>
    );
  };

  export default StudentAppBar;