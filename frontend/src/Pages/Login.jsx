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

      <div className="min-h-screen flex overflow-hidden">
        {/* LEFT SIDE - DESIGN */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
          {/* Animated Background Shapes */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 text-white">
            <div className="max-w-md">
              {/* Logo/Icon */}
              <div className="mb-8 flex justify-center">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center shadow-2xl">
                  <Lock className="w-12 h-12 text-white" />
                </div>
              </div>

              <h1 className="text-5xl font-bold mb-6 text-center">
                Welcome to <br />
                <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                  Abacus Classes
                </span>
              </h1>
              
              <p className="text-xl text-center text-blue-100 mb-8 leading-relaxed">
                Unlock your potential with our comprehensive learning management system
              </p>

              {/* Features */}
              <div className="space-y-4">
                {[
                  "📚 Comprehensive Course Management",
                  "👥 Student Progress Tracking",
                  "📊 Real-time Analytics Dashboard",
                  "🎯 Interactive Learning Experience"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition">
                    <span className="text-lg">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-8 flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Lock className="w-10 h-10 text-white" />
              </div>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-100">
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-500">
                  Sign in to continue to your dashboard
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                    placeholder="Enter your username"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>

                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                      placeholder="Enter your password"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    Remember me
                  </label>
                  <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    Forgot Password?
                  </a>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing In...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-700">
                    Contact Admin
                  </a>
                </p>
              </div>
            </div>

            {/* Copyright */}
            <p className="text-center text-sm text-gray-500 mt-8">
              © 2026 Abacus Classes. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  );
};

export default Login;
