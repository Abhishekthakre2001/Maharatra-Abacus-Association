import { useEffect } from "react";

const useAutoLogout = () => {
  useEffect(() => {
    const checkSession = () => {
      const expiry =
        localStorage.getItem("refreshTokenExpiry") ||
        sessionStorage.getItem("refreshTokenExpiry");

      if (!expiry) return;

      const expiryTime = new Date(expiry).getTime();

      if (Date.now() >= expiryTime) {
        localStorage.clear();
        sessionStorage.clear();

        window.location.replace("/");
      }
    };

    // Check immediately on app load
    checkSession();

    // Check every second
    const interval = setInterval(checkSession, 1000);

    return () => clearInterval(interval);
  }, []);
};

export default useAutoLogout;