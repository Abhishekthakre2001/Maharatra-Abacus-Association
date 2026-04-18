import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Settings,
  ChevronLeft,
  FileUser,
  LogOut,
  FileQuestionMark,
  FileClock,
  List,
  Users,
  BookCheck
} from "lucide-react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import logo from "../assets/logo.png";
import colors from "../utils/Color";
import MessageModal from "../utils/MessageModal";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isMobile, setIsMobile] = useState(false);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : {};

  console.log("User", user.id);

  // ✅ NEW STATE FOR MODAL
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ✅ ACTUAL LOGOUT FUNCTION
  const logout = () => {
    localStorage.clear();
    document.cookie = "token=; Max-Age=0; path=/";
    navigate("/");
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { id: "student-list", label: "Students", icon: Users, path: "/students-list" },
    { id: "questions", label: "Questions", icon: FileQuestionMark, path: "/questions" },
    { id: "result", label: "Result", icon: FileUser, path: "/results" },
    { id: "exam-schedule", label: "Exam Schedule", icon: FileClock, path: "/exam-schedule" },
    // { id: "exam-result", label: "Exam Result", icon: FileUser, path: "/exam-result" },
    { id: "master", label: "Master", icon: Settings, path: "/masters" },
    // ✅ Only visible for admin id 55
    ...(user?.id === 50
      ? [{ id: "exam-student", label: "Exam Registration", icon: BookCheck, path: "/exam-student" }]
      : []),
  ];

  const isActive = (path) => {
    if (path === "/students-list" && location.pathname.startsWith("/add-student") && searchParams.get('from') === 'students-list') return true;
    if (path === "/exam-student" && location.pathname.startsWith("/add-student") && searchParams.get('from') === 'exam-student') return true;
    if (path === "/questions" && location.pathname.startsWith("/add-question")) return true;

    if (
      path === "/results" &&
      location.pathname.startsWith("/studentresults")
    ) return true;
    return location.pathname === path;
  };

  const handleClick = (path) => navigate(path);

  return (
    <>
      {/* SIDEBAR */}
      <div
        className={`
          hidden md:block fixed top-4 left-4 h-[92vh]
          ${isCollapsed ? "w-20" : "w-64"}
          transition-all duration-500 rounded-3xl
          bg-opacity-70 backdrop-blur-xl
          shadow-[0px_20px_40px_rgba(0,0,0,0.45)]
          flex flex-col justify-between z-50
        `}
        style={{
          backgroundImage: `linear-gradient(
    to bottom,
    ${colors.sidebar.bg.gradientFrom},
    ${colors.sidebar.bg.gradientTo}
  )`
        }}

      >
        {/* HEADER */}
        <div className="flex justify-between items-center p-5">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-2xl overflow-hidden bg-white/10">
              <img src={colors.Client.logo_url} alt="Logo" className="w-full h-full object-cover" />
            </div>

            {!isCollapsed && (
              <div>
                <p className=" font-semibold text-md" style={{ color: `${colors.sidebar.text.deveraa}`}}>{colors.Client.brand_name}</p>
                <p className="text-[14px]" style={{ color: `${colors.sidebar.text.grow_with_deveraa}`}}>{colors.Client.brand_sub_title}</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-full"
            style={{
              backgroundColor: colors.sidebar.toggle.background,
              color: colors.sidebar.toggle.text,
            }}

          >
            <ChevronLeft
              size={20}
              className={`${isCollapsed ? "rotate-180" : ""} transition`}
            />
          </button>
        </div>

        <div className="flex flex-col justify-between h-[80%]">

          {/* MENU */}
          <div className="px-3 space-y-2 mt-10">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleClick(item.path)}
                  className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-300
                  ${isActive(item.path) ? "text-white shadow-lg" : "hover:bg-white/10"}
                  ${isCollapsed && "justify-center"}
                `}
                  style={{
                    backgroundColor: isActive(item.path)
                      ? colors.sidebar.menu.active_bg
                      : "transparent",
                    color: isActive(item.path)
                      ? colors.sidebar.menu.active_text
                      : colors.sidebar.menu.default_text,
                  }}

                >
                  <Icon size={20} />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </div>

          {/* LOGOUT */}
          <div className="mt-auto p-4 mt-10">
            <div className="h-px bg-white/20 mb-4" />

            <button
              onClick={() => setShowLogoutModal(true)}
              className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl
              shadow-lg hover:opacity-90 transition
              ${isCollapsed && "justify-center"}
            `}
              style={{
                backgroundColor: colors.sidebar.logout.logout_Bg,
                color: colors.sidebar.logout.logout_Text,
              }}

            >
              <LogOut size={20} />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>

      </div>

      {/* CONTENT SHIFT */}
      <div className={`${isCollapsed ? "md:ml-20" : "md:ml-64"} transition-all duration-500`} />

      {/* ✅ LOGOUT CONFIRMATION MODAL */}
      <MessageModal
        open={showLogoutModal}
        type="warning"
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        onClose={() => setShowLogoutModal(false)}
        onConfirm={logout}
      />
    </>
  );
};

export default Sidebar;
