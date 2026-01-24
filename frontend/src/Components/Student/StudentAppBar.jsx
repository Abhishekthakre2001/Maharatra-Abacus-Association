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

  // ✅ NEW: logout confirmation modal state
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navigate = useNavigate();

  // 🔹 Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) return null;

  const getUserInitial = (userObj) =>
    userObj?.name ? userObj.name.trim().charAt(0).toUpperCase() : "U";

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-IN") : "—";

  // ✅ ACTUAL LOGOUT LOGIC
  const logout = () => {
    localStorage.clear();
    document.cookie = "token=; Max-Age=0; path=/";
    onLogout && onLogout(); // optional external handler
    navigate("/");
  };

  return (
    <>
      {/* ================= APP BAR ================= */}
      <div
        className={`relative bg-opacity-70 backdrop-blur-xl rounded-2xl p-6 mx-2 text-white shadow-lg ${className}`}
        style={{
          backgroundImage: `linear-gradient(to right, ${colors.primary.blue600}, ${colors.text.dark})`
        }}
      >
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
              style={{ backgroundColor: colors.primary.blue500 }}
            >
              {getUserInitial(user)}
            </div>
          )}

          <div className="text-left">
            <h2 className="text-lg font-semibold">{user.name}</h2>
            <p className="text-sm opacity-90">{subtitle}</p>
          </div>
        </button>
      </div>

      {/* ================= PROFILE MODAL ================= */}
      {open &&
        createPortal(
          <div className="fixed inset-0 z-[99999] bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 relative">

              {/* Close */}
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
                    style={{ backgroundColor: colors.primary.blue500 }}
                  >
                    {getUserInitial(user)}
                  </div>
                )}

                <h3 className="text-xl font-semibold text-gray-900">
                  {user.name}
                </h3>
                <p className="text-sm text-gray-500">@{user.username}</p>
              </div>

              {/* DETAILS */}
              <div className="mt-6 space-y-4 text-sm text-gray-700">
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
                    setShowLogoutConfirm(true); // ✅ OPEN WARNING
                  }}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ================= LOGOUT CONFIRMATION ================= */}
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

/* 🔹 Reusable Row */
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
