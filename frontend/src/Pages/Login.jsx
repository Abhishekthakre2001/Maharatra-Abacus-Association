import React, { useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  Warehouse,
  Package,
  BarChart3,
  TrendingUp,
  Shield,
  Users,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";


const Login = () => {

  const navigate = useNavigate();
  const [mobilenumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Removed functionality
    navigate("/dashboard");
  };

  const features = [
    { icon: <Package className="w-6 h-6" />, title: "Smart Inventory Tracking", description: "Real-time stock monitoring" },
    { icon: <BarChart3 className="w-6 h-6" />, title: "Analytics", description: "Business insights" },
    { icon: <Users className="w-6 h-6" />, title: "Team Management", description: "Role-based access" },
    { icon: <Settings className="w-6 h-6" />, title: "Automation", description: "Smart workflows" }
  ];

  return (
    <>
      <div className="min-h-screen overflow-y-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="w-full max-w-full bg-white/95  overflow-hidden ">
          <div className="overflow-y-hidden grid grid-cols-1 lg:grid-cols-2 h-screen">

            {/* LEFT SIDE */}
            <div className="hidden md:block bg-[#d4b0ee] p-8 text-white relative overflow-hidden">
              <div className="relative z-10 h-full flex flex-col justify-center">
               <img src="./image.png" alt="" />
              </div>
            </div>

            {/* RIGHT SIDE - LOGIN */}
            <div className="p-8 lg:p-12 flex flex-col justify-center bg-white">
              <div className="w-full max-w-md mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-gray-600">Sign in to your dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number
                    </label>
                    <input
                      type="number"
                      value={mobilenumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="block w-full pl-4 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter mobile number"
                      required
                      maxLength={10}
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>

                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500"
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
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Remember me
                    </span>
                  </label>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg"
                  >
                    Sign In to Dashboard
                  </button>

                </form>

              </div>
            </div>

          </div>
        </div>
      </div>

    </>

  );
};

export default Login;