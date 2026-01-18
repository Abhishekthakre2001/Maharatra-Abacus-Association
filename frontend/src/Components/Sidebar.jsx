import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  QrCode,
  LogOut,
  Proportions,
  CaptionsOff,
  List
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import colors from "../utils/Color";


const Sidebar = ({ isCollapsed, setIsCollapsed }) => {

  // const isCollapsed = true;
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const logout = () => {
    localStorage.clear();
    document.cookie = "token=; Max-Age=0; path=/";
    navigate("/");
  };


  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { id: "student-list", label: "Students", icon: Proportions, path: "/students-list" },
    // { id: "add-student", label: "Add Student", icon: Users, path: "/add-student" },
    { id: "questions", label: "Questions", icon: QrCode, path: "/questions" },
    { id: "result", label: "Result", icon: List, path: "/results" },
    { id: "exam-schedule", label: "Exam Schedule", icon: CaptionsOff, path: "/exam-schedule" },
    { id: "masters", label: "Masters", icon: Settings, path: "/masters" },
    // { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
  ];

  const isActive = (path) => {
    // Special case: /add-student should highlight the students tab
    if (path === "/students-list" && (location.pathname === "/add-student" || location.pathname.startsWith("/add-student/"))) {
      return true;
    }
    // Special case: /add-question should highlight the questions tab
    if (path === "/questions" && (location.pathname === "/add-question" || location.pathname.startsWith("/add-question/"))) {
      return true;
    }
    return location.pathname === path;
  };

  const handleClick = (path) => {
    // Only navigate, do not expand sidebar if collapsed
    navigate(path);
  };


  // ✅ DESKTOP SIDEBAR
  return (
    <>
      <div
        className={`
        hidden  md:block
        fixed top-4 left-4 h-[92vh]
        ${isCollapsed ? "w-20" : "w-64"}
        transition-all duration-500
        rounded-3xl
        bg-opacity-70 backdrop-blur-xl
        shadow-[0px_20px_40px_rgba(0,0,0,0.45)]
        flex flex-col justify-between z-50
      `}
        style={{
          backgroundImage: `linear-gradient(to bottom, ${colors.primary.blue600}, ${colors.text.dark})`
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-md bg-white/10 backdrop-blur-sm">
              <img src={logo} alt="Logo" className="w-full h-full object-cover" />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-white font-semibold text-lg tracking-wide leading-none">
                  DevEraa
                </span>
                <span className="text-xs mt-1 tracking-wide" style={{ color: colors.text.gray300 }}>
                  Grow with Deveraa
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className=" p-1 rounded-full transition"
            style={{ backgroundColor: colors.sidebar.toggle_bg, color: colors.sidebar.toggle_color }}
          >
            <ChevronLeft
              size={20}
              className={`${isCollapsed ? "rotate-180" : ""} transition`}
            />
          </button>
        </div>

        {/* Menu */}
        <div className="px-3 space-y-2 mt-10">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.path)}
                type="button"
                className={`
          w-full flex items-center gap-3 px-4 py-3 rounded-xl
          transition-all duration-300
          ${isActive(item.path) ? "text-white shadow-lg" : "hover:bg-white/10"}
          ${isCollapsed && "justify-center"}
        `}
                style={{
                  backgroundColor: isActive(item.path)
                    ? colors.sidebar.active_button
                    : "transparent",
                  color: isActive(item.path)
                    ? colors.text.white
                    : colors.text.gray300,
                }}
              >
                <Icon size={20} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>

        {/* Push Logout to Bottom */}
        <div className="mt-auto">
          {/* Divider */}
          <div className="px-4">
            <div className="h-px bg-white/20 mt-25" />
          </div>

          {/* Logout */}
          <div className="p-4">
            <button
              onClick={logout}
              className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-xl
         shadow-lg transition hover:opacity-90
        ${isCollapsed && "justify-center"}
      `}
              style={{ backgroundColor: colors.accent.orange, color: colors.text.white }}
            >
              <LogOut size={20} />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>

      </div>

      {/* Content Shift */}
      <div
        className={`${isCollapsed ? "md:ml-20" : "md:ml-64"} transition-all duration-500`}
      />
    </>
  );
};

export default Sidebar;
