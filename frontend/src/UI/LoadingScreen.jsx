import {
  PackageCheck,
  Loader2,
  ShieldCheck,
  Cloud,
} from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 flex items-center justify-center">

      <div className="bg-slate-950/90 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-[420px] text-center space-y-6 border border-white/10">

        {/* Logo */}
        <div className="flex justify-center">
          <div className="bg-blue-600/20 p-4 rounded-full">
            <PackageCheck size={44} className="text-blue-500" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl font-semibold text-gray-100 tracking-wide">
          Ideal Profilers
        </h1>

        <p className="text-sm text-slate-400">
          Inventory Management Suite
        </p>

        {/* Loader */}
        <div className="flex justify-center">
          <Loader2 className="animate-spin text-orange-400" size={34} />
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <div className="h-2 w-2/3 bg-gradient-to-r from-blue-500 to-orange-400 animate-pulse" />
        </div>

        {/* Status */}
        <p className="text-xs text-slate-400">
          Syncing coil inventory & validating QR codes…
        </p>

        {/* Features */}
        <div className="flex justify-center gap-6 text-slate-400 text-xs pt-2">
          <div className="flex items-center gap-1">
            <ShieldCheck size={14} className="text-blue-500" />
            Secure
          </div>
          <div className="flex items-center gap-1">
            <Cloud size={14} className="text-blue-500" />
            Cloud Ready
          </div>
        </div>
      </div>
    </div>
  );
}
