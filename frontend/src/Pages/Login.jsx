import React, { useState } from "react";
import { Eye, EyeOff, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import userApi from "../api/userApi";
import MessageModal from "../utils/MessageModal";
import colors from "../utils/Color";

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

      <div className="h-screen flex overflow-hidden" style={{ backgroundColor: colors.background.blue50 }}>
        {/* LEFT SIDE - WELCOME */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-y-auto" style={{ color: colors.text.gray800 }}>
          <div className="flex flex-col justify-center items-start w-full px-8 lg:px-12 xl:px-16 py-8 lg:py-12">
            <div className="max-w-lg mx-auto w-full">
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 lg:mb-4 leading-tight" style={{ color: colors.text.gray800 }}>
                Welcome to our
                <br />
                <span className="bg-gradient-to-r bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, ${colors.primary.blue600}, ${colors.primary.blue700})` }}>
                  Community
                </span>
              </h1>
              
              <p className="text-base lg:text-lg mb-8 lg:mb-12" style={{ color: colors.text.gray500 }}>
                A virtual way productive journey starts from here.
              </p>

              {/* Illustration */}
              <div className="mb-8 lg:mb-12 flex justify-center">
                <div className="relative">
                  {/* Placeholder for illustration - you can replace with actual image */}
                  <div className="w-56 h-56 lg:w-72 lg:h-72 xl:w-80 xl:h-80 rounded-full flex items-center justify-center shadow-2xl" style={{ background: `linear-gradient(to bottom right, ${colors.primary.blue200}, ${colors.background.blue100})` }}>
                    <div className="text-center">
                      <div className="text-4xl lg:text-5xl xl:text-6xl mb-3 lg:mb-4">🎓</div>
                      <p className="text-xl lg:text-2xl font-bold" style={{ color: colors.text.gray700 }}>Abacus</p>
                      <p className="text-base lg:text-lg" style={{ color: colors.text.gray600 }}>Learning Platform</p>
                    </div>
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute -top-3 -right-3 lg:-top-4 lg:-right-4 w-14 h-14 lg:w-20 lg:h-20 bg-yellow-300 rounded-full opacity-60"></div>
                  <div className="absolute -bottom-3 -left-3 lg:-bottom-4 lg:-left-4 w-12 h-12 lg:w-16 lg:h-16 bg-pink-300 rounded-full opacity-60"></div>
                </div>
              </div>

              
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-6 sm:mb-8 text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2" style={{ color: colors.text.gray800 }}>
                Welcome to <span style={{ color: colors.primary.blue600 }}>Abacus</span>
              </h1>
              <p style={{ color: colors.text.gray500 }}>Sign in to continue</p>
            </div>

            <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-3xl shadow-2xl border border-white">
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2" style={{ color: colors.text.gray800 }}>
                  Sign in to Continue
                </h2>
                <p className="text-sm" style={{ color: colors.text.gray500 }}>
                  Enter your email and password
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {/* Email/Username */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text.gray700 }}>
                    Email or Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 sm:py-3.5 border border-gray-200 rounded-lg sm:rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text.gray700 }}>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 sm:py-3.5 border border-gray-200 rounded-lg sm:rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
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

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-xs sm:text-sm flex-wrap gap-2">
                  <label className="flex items-center gap-2 cursor-pointer group" style={{ color: colors.text.gray600 }}>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                      />
                    </div>
                    <span className="transition">Remember Me</span>
                  </label>
                  <a href="#" className="font-medium transition" style={{ color: colors.primary.blue600 }}>
                    Forgot Password?
                  </a>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  style={{ background: `linear-gradient(to right, ${colors.primary.blue600}, ${colors.primary.blue700})` }}
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
                    "Sign in"
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-5 sm:my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white" style={{ color: colors.text.gray500 }}>or continue with</span>
                </div>
              </div>

              {/* Social Login */}
             

              {/* Footer */}
              <div className="mt-5 sm:mt-6 text-center">
                <p className="text-xs sm:text-sm" style={{ color: colors.text.gray600 }}>
                  Don't have an account?{" "}
                  <a href="#" className="font-semibold transition" style={{ color: colors.primary.blue600 }}>
                    Contact Admin
                  </a>
                </p>
              </div>
            </div>

           
          </div>
        </div>
      </div>

    </>
  );
};

export default Login;
