import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Phone, MapPin, User, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import colors from "../../utils/Color";
import Button from "../../UI/Button";
import MessageModal from "../../utils/MessageModal";

const StudentAppBar = ({
  subtitle,
  userInitials = "AT",
  userImage = null,
  onLogout,
  className = ""
}) => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  if (!user) return null;

  const getUserInitial = (u) =>
    u?.name ? u.name.trim().charAt(0).toUpperCase() : "U";

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-IN") : "—";

  const logout = () => {
    localStorage.clear();
    document.cookie = "token=; Max-Age=0; path=/";
    onLogout && onLogout();
    navigate("/");
  };

  return (
    <>
      {/* ================= APP BAR ================= */}
      <div
        className={`relative backdrop-blur-xl flex flex-row justify-between rounded-2xl p-6 mx-2 shadow-lg ${className}`}
        style={{
          backgroundImage: `linear-gradient(
            to right,
            ${colors.appbar.bg.gradientFrom},
            ${colors.appbar.bg.gradientTo}
          )`,
          color: colors.appbar.text.title,
        }}
      >
        <div className="flex items-center gap-4">

          {/* LOGO */}
          <img
            src={colors.Client.logo_url}
            alt={colors.Client.brand_name}
            className="w-12 h-12 object-contain rounded-md bg-white p-1 shadow"
          />

          {/* BRAND TEXT */}
          <div className="text-left">
            <h2 className="text-lg font-semibold">
              {colors.Client.brand_name}
            </h2>

            <p
              className="text-sm"
              style={{ color: colors.appbar.text.subtitle }}
            >
              {colors.Client.brand_sub_title}
            </p>
          </div>

        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-4 bg-transparent border-0"
        >
          {userImage ? (
            <img
              src={userImage}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg"
            />
          ) : (
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center font-bold border-2 border-white"
              style={{ backgroundColor: colors.appbar.user.avatar_bg }}
            >
              {getUserInitial(user)}
            </div>
          )}

          {/* <div className="text-left">
            <h2 className="text-lg font-semibold">
              {user.name}
            </h2>
            <p
              className="text-sm"
              style={{ color: colors.appbar.text.subtitle }}
            >
              {subtitle}
            </p>
          </div> */}
        </button>
      </div>

      {/* ================= PROFILE MODAL ================= */}
      {open &&
        createPortal(
          <div className="fixed inset-0 z-[99999] bg-black/40 flex items-center justify-center p-4">
            <div
              className="w-full max-w-md rounded-3xl shadow-2xl p-6 relative"
              style={{ backgroundColor: colors.common.white }}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
              >
                ×
              </button>

              {/* Avatar */}
              <div className="flex flex-col items-center gap-3">
                {userImage ? (
                  <img
                    src={userImage}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover shadow border"
                  />
                ) : (
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                    style={{ backgroundColor: colors.appbar.user.avatar_bg }}
                  >
                    {getUserInitial(user)}
                  </div>
                )}

                <h3
                  className="text-xl font-semibold"
                  style={{ color: colors.text.gray800 }}
                >
                  {user.name}
                </h3>
                <p
                  className="text-sm"
                  style={{ color: colors.text.gray500 }}
                >
                  @{user.username}
                </p>
              </div>

              {/* DETAILS */}
              <div className="mt-6 space-y-4 text-sm">
                <ProfileRow icon={User} label="Username" value={user.username} />
                <ProfileRow icon={MapPin} label="Address" value={user.address} />
                <ProfileRow icon={Phone} label="Mobile" value={user.mobilenumber} />
                <ProfileRow
                  icon={Calendar}
                  label="Subscription Ends"
                  value={formatDate(user.subscription_end_date)}
                />
              </div>

              {/* Logout */}
              <div className="mt-6">
                <Button
                  variant="danger"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    setOpen(false);
                    setShowLogoutConfirm(true);
                  }}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ================= LOGOUT CONFIRM ================= */}
      <MessageModal
        open={showLogoutConfirm}
        type="warning"
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={logout}
      />
    </>
  );
};

const ProfileRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
    <Icon size={18} className="text-gray-500" />
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium">{value || "—"}</p>
    </div>
  </div>
);

export default StudentAppBar;
