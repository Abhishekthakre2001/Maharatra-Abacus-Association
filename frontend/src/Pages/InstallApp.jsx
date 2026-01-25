import React, { useEffect, useState } from "react";
import { Download, CheckCircle } from "lucide-react";
import Button from "../UI/Button";
import logo from "../assets/logo.png"; // your app logo

export default function InstallApp() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => {
      setInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-xl p-6 text-center">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src={logo}
            alt="Dev-Abacus"
            className="w-20 h-20 rounded-2xl"
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-slate-800">
          Install Dev-Abacus
        </h1>

        <p className="text-sm text-slate-500 mt-2">
          Practice smarter • Faster exams • Offline ready
        </p>

        {/* Features */}
        <div className="mt-6 space-y-3 text-left">
          {[
            "⚡ Fast & lightweight app experience",
            "📴 Works even with low internet",
            "🎯 Daily practice & live exams",
            "📱 Full-screen mobile app feel",
          ].map((text, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-sm text-slate-700"
            >
              <CheckCircle size={16} className="text-blue-600" />
              {text}
            </div>
          ))}
        </div>

        {/* Action */}
        <div className="mt-8">
          {installed ? (
            <div className="text-green-600 font-semibold">
              ✅ App Installed
            </div>
          ) : deferredPrompt ? (
            <Button
              variant="primary"
              size="lg"
              onClick={handleInstall}
              className="w-full flex items-center justify-center gap-2"
            >
              <Download size={18} />
              Install App
            </Button>
          ) : (
            <p className="text-xs text-slate-500">
              Installation not supported on this browser
            </p>
          )}
        </div>



        {/* Footer */}
        <p className="text-xs text-slate-400 mt-6">
          DevEraa – Abacus Learning Platform
        </p>
      </div>
    </div>
  );
}
