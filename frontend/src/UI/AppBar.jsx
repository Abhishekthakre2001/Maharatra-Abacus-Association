import React, { useState } from "react";
import {
  Menu,
  LogOut,
  X,
  LayoutDashboard,
  QrCode,
  Settings,
  Proportions,
  CaptionsOff,
  List
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import colors from "../utils/Color";

const AppBar = ({
  title,
  subtitle,
  showMobileUser = false,
  userName = "User Name",
  userInitials = "AT",
  className = ""
}) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { id: "student-list", label: "Students", icon: Proportions, path: "/students-list" },
    { id: "questions", label: "Questions", icon: QrCode, path: "/questions" },
    { id: "result", label: "Result", icon: List, path: "/results" },
    { id: "exam-schedule", label: "Exam Schedule", icon: CaptionsOff, path: "/exam-schedule" },
    { id: "masters", label: "Masters", icon: Settings, path: "/masters" },
  ];

  const isActive = (path) => {
    if (
      path === "/students-list" &&
      (location.pathname === "/add-student" || location.pathname.startsWith("/add-student/"))
    ) return true;

    if (
      path === "/questions" &&
      (location.pathname === "/add-question" || location.pathname.startsWith("/add-question/"))
    ) return true;

    return location.pathname === path;
  };

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  const logout = () => {
    localStorage.clear();
    document.cookie = "token=; Max-Age=0; path=/";
    navigate("/");
  };

  return (
    <div className="sticky top-4 md:top-4 z-50">

      {/* APP BAR */}
      <div
        className={`z-50 bg-opacity-70 backdrop-blur-xl rounded-2xl p-6 md:p-8 text-white shadow-lg ${className}`}
        style={{
          backgroundImage: `linear-gradient(to right, ${colors.primary.blue600}, ${colors.text.dark})`
        }}
      >
        <div className="flex items-center justify-between">
          {/* LEFT */}
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">{title}</h1>
            {subtitle && <p className="text-sm md:text-lg">{subtitle}</p>}
          </div>

          {/* RIGHT – MOBILE MENU BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-xl"
            style={{ backgroundColor: colors.accent.orange }}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* MOBILE USER INFO */}
        {showMobileUser && (
          <div className="flex gap-4 mt-4 md:hidden">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center font-bold"
              style={{ backgroundColor: colors.primary.blue500 }}
            >
              {userInitials}
            </div>
            <div>
              <p className="text-sm" style={{ color: colors.text.blue200 }}>
                Welcome Back,
              </p>
              <p className="font-semibold">{userName}</p>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {open && (
        <div
          className="md:hidden absolute top-full left-0 w-full mt-3 rounded-2xl shadow-xl backdrop-blur-xl bg-opacity-80 z-40 h-[75vh]"
          style={{
            backgroundImage: `linear-gradient(to bottom, ${colors.primary.blue600}, ${colors.text.dark})`
          }}
        >
          <div className="p-3 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <>
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition`}
                    style={{
                      backgroundColor: active ? colors.accent.orange : "transparent",
                      color: active ? colors.text.white : colors.text.gray300
                    }}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>

                </>
              );
            })}
          </div>
          {/* Logout */}
          <div className="p-4" onClick={() => logout()}>
            <button
              className={`mt-[15%]
                              w-full flex items-center gap-3 px-4 py-3 rounded-xl
                              text-white shadow-lg transition
                              "justify-center"}
                            `}
              style={{ backgroundColor: colors.accent.orange }}
            >
              <LogOut size={20} />
              {<span>Logout</span>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppBar;
