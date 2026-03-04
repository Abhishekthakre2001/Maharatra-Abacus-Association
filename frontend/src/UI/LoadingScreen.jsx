import {
  Loader2,
  ShieldCheck,
  Cloud,
  Sparkles,
} from "lucide-react";

import logo from "../assets/logo.png"; // 👈 adjust path if needed

export default function LoadingScreen() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">

      {/* Soft floating shapes */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-200/40 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-sky-200/40 rounded-full blur-3xl animate-pulse delay-2000" />

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-6">

        {/* Logo with smooth zoom animation */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-blue-300/40 blur-xl animate-pulse" />

          <div className="relative bg-white p-6 rounded-full shadow-lg animate-zoom">
            <img
              src={logo}
              alt="Abacus Logo"
              className="w-16 h-16 object-contain"
            />
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        .animate-zoom {
          animation: zoomInOut 2.5s ease-in-out infinite;
        }

        @keyframes zoomInOut {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.12);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
