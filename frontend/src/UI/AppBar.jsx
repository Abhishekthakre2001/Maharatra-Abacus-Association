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
  List,
  RotateCcw
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

  // const hardReload = () => {
  //   window.location.reload(true); // force reload
  // };
  const hardReload = async () => {
    try {
      // setIsRefreshing(true);

      // 1. Clear local/session temporary app data if needed
      // Keep this only if you do NOT want to remove login/session data
      // localStorage.clear();
      // sessionStorage.clear();

      // If you want to preserve auth, remove only app cache keys manually instead
      // localStorage.removeItem("someOldCacheKey");

      // 2. Clear Cache Storage used by PWA/service worker
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
      }

      // 3. Unregister all service workers
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => registration.unregister()));
      }

      // 4. Force browser to fetch fresh page from server
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("_ts", Date.now().toString());

      window.location.replace(currentUrl.toString());
    } catch (error) {
      console.error("Hard refresh failed:", error);
      window.location.reload();
    }
  };

  return (
    <div className="sticky top-4 md:top-4 z-50">

      {/* APP BAR */}
      <div
        className={`z-50 bg-opacity-70 backdrop-blur-xl rounded-2xl p-6 md:p-8 text-white shadow-lg ${className}`}
        style={{
          backgroundImage: `linear-gradient(
    to right,
    ${colors.appbar.bg.gradientFrom},
    ${colors.appbar.bg.gradientTo}
  )`
        }}

      >
        <div className="flex items-center justify-between">
          <div className="md:hidden w-12 h-12 rounded-2xl overflow-hidden bg-white/10">
            <img src={colors.Client.logo_url} alt="Logo" className="w-full h-full object-cover" />
          </div>
          {/* LEFT */}
          <div className="md:hidden">
            <h1 className="text-2xl lg:text-3xl font-bold" style={{ color: colors.appbar.text.title }}>{colors.Client.brand_name}</h1>
            {subtitle && <p className="text-sm md:text-lg" style={{ color: colors.appbar.text.subtitle }}>{colors.Client.brand_sub_title}</p>}
          </div>
          <div className="hidden md:block">
            <h1 className="text-2xl lg:text-3xl font-bold" style={{ color: colors.appbar.text.title }}>{title}</h1>
            {subtitle && <p className="text-sm md:text-lg" style={{ color: colors.appbar.text.subtitle }}>{subtitle}</p>}
          </div>

          <div className="flex items-center gap-3">

            {/* 🔄 HARD REFRESH BUTTON (DESKTOP ONLY) */}
            <button
              onClick={hardReload}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 group"
              style={{
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)"
              }}
            >
              <RotateCcw
                size={18}
                className="transition-transform duration-500 group-hover:rotate-180"
              />
              <span className="text-sm font-medium">Refresh</span>
            </button>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-xl"
              style={{
                backgroundColor: colors.appbar.toggle.background,
                color: colors.appbar.toggle.icon,
              }}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>

          </div>



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
            backgroundImage: `linear-gradient(
    to bottom,
    ${colors.appbar.bg.gradientFrom},
    ${colors.appbar.bg.gradientTo}
  )`
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
                      backgroundColor: active
                        ? colors.appbar.menu.active_bg
                        : "transparent",
                      color: active
                        ? colors.appbar.menu.active_text
                        : colors.appbar.menu.default_text,
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
                               shadow-lg transition
                              "justify-center"}
                            `}
              style={{
                backgroundColor: colors.appbar.logout.bg,
                color: colors.appbar.logout.text,
              }}

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
