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
import logo from "../assets/logo (4).png";


const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { id: "student-list", label: "Student List", icon: Proportions, path: "/students-list" },
    { id: "add-student", label: "Add Student", icon: Users, path: "/add-student" },
    { id: "result", label: "Result", icon: List, path: "/result" },
    { id: "questions", label: "Questions", icon: QrCode, path: "/questions" },
    { id: "exam-schedule", label: "Exam Schedule", icon: CaptionsOff, path: "/exam-schedule" },
    // { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleClick = (path) => {
    navigate(path);
  };

  // ✅ MOBILE: Bottom Navigation
  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 w-full bg-gradient-to-b from-blue-600 to-[#110F12]
      bg-opacity-70 backdrop-blur-xl
      shadow-[0px_20px_40px_rgba(0,0,0,0.45)] overflow-x-auto py-3 z-50 rounded-t-2xl">
        
        <div className="flex justify-between items-center px-4 gap-4 min-w-max">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.path)}
                className={`flex flex-col items-center text-xs min-w-[60px] ${
                  isActive(item.path) ? "text-[#FF7F36]" : "text-gray-300"
                }`}
              >
                <Icon size={20} />
                <span className="mt-1 text-[10px] whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}

          {/* Logout */}
          <button className="flex flex-col items-center text-xs text-red-400 min-w-[60px]">
            <LogOut size={20} />
            <span className="mt-1 text-[10px]">Logout</span>
          </button>
        </div>
      </div>
    );
  }


  // ✅ DESKTOP SIDEBAR
  return (
    <>
      <div
        className={`
        fixed top-4 left-4 h-[92vh]
        ${isCollapsed ? "w-20" : "w-64"}
        transition-all duration-500
        rounded-3xl
        bg-gradient-to-b from-blue-600 to-[#110F12]
        bg-opacity-70 backdrop-blur-xl
        shadow-[0px_20px_40px_rgba(0,0,0,0.45)]
        flex flex-col justify-between z-50
      `}
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
                  Ideal Panel
                </span>
                <span className="text-xs text-gray-300 mt-1 tracking-wide">
                  Inventory Suite
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white  p-1 bg-[#FF7F36] rounded-full transition"
          >
            <ChevronLeft
              size={20}
              className={`${isCollapsed ? "rotate-180" : ""} transition`}
            />
          </button>
        </div>

        {/* Menu */}
        <div className="px-3 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.path)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-300
                  ${isActive(item.path)
                    ? "bg-[#FF7F36] text-white shadow-lg"
                    : "text-gray-300 hover:bg-white/10"
                  }
                  ${isCollapsed && "justify-center"}
                `}
              >
                <Icon size={20} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>

        {/* Logout */}
        <div className="p-4">
          <button
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl
              bg-[#FF7F36] text-white shadow-lg transition
              ${isCollapsed && "justify-center"}
            `}
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Logout</span>}
          </button>
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
