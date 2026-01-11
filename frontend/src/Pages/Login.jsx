import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import userApi from "../api/userApi";
import MessageModal from "../utils/MessageModal";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [modal, setModal] = useState({
    open: false,
    type: "",
    title: "",
    message: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await userApi.login({ username, password });

      const { token, user } = res.data;

      // ✅ Save token in cookie (simple JS cookie)
      document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24}`;

      // ✅ Save user & token in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("res", res.data.user.usertype)

      if (res.data.user.usertype === "student") {
        navigate("/student-dashboard")
      } else {
        navigate("/dashboard");
      }



    } catch (err) {
      setModal({
        open: true,
        type: "error",
        title: "Login Failed",
        message: err?.response?.data?.message || "Invalid username or password",
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      <MessageModal
        open={modal.open}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal({ ...modal, open: false })}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">

          <h2 className="text-3xl font-bold text-center mb-2">
            Welcome Back
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Sign in to your dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl bg-gray-50"
                placeholder="Enter username"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border rounded-xl bg-gray-50"
                  placeholder="Enter password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>

          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
