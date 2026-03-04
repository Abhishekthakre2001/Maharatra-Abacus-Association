// Color Constants for Application
const colors = {
  /* ================= EXAM SCHEDULE CARD ================= */
  examScheduleCard: {
    card: {
      bg: "#eff6ff",        // light blue (from-blue-50 feel)
      border: "#dbeafe",    // blue-100
    },

    text: {
      title: "#6b7280",    // gray-500
      value: "#1e293b",    // slate-800
      time: "#475569",     // slate-600
    },

    action: {
      edit: {
        text: "#ea580c",   // orange-600
        bgHover: "#ffedd5" // orange-100
      },
      delete: {
        text: "#dc2626",   // red-600
        bgHover: "#fee2e2" // red-100
      }
    }
  },

  /* ================= BUTTONS ================= */
  button: {
    add: {
      bg: "#2563eb",      // blue-600
      text: "#ffffff",
    },

    export: {
      bg: "#36afe3",      // orange-600
      text: "#ffffff",
    },

    clear: {
      bg: "#dee9f1",      // gray-200
      text: "#374151",    // gray-700
    },
  },


  /* ================= DASHBOARD ================= */
  dashboard: {
    card: {
      bg: {
        gradientFrom: "#eff6ff",
        gradientTo: "#e0e7ff",
        border: "#dbeafe",
      },

      shadow: {
        normal: "rgba(0,0,0,0.08)",
        hover: "rgba(59,130,246,0.4)",
      },

      text: {
        title: "#6b7280",
        value: "#1e293b",
      },

      icon: {
        bgGradientFrom: "#93c5fd",
        bgGradientTo: "#bfdbfe",
        color: "#2563eb",
      },
    },
  },



  /* ================= APP BAR ================= */
  appbar: {
    bg: {
      gradientFrom: "#2563eb",   // blue-600
      gradientTo: "#90cdf4",     // light blue
    },

    text: {
      title: "#ffffff",
      subtitle: "#bfdbfe",
    },

    toggle: {
      background: "#ffffff",
      icon: "#2563eb",
    },

    menu: {
      active_bg: "#ffffff",
      active_text: "#2563eb",
      default_text: "#efefef",
      hover_bg: "rgba(255,255,255,0.1)",
    },

    user: {
      avatar_bg: "#3b82f6",
      welcome_text: "#bfdbfe",
      name_text: "#ffffff",
    },

    logout: {
      bg: "#ffffff",
      text: "#2563eb",
      hover_bg: "#e86f2c",
    },
  },

  /* ================= SIDEBAR ================= */
  sidebar: {
    bg: {
      gradientFrom: "#2563eb",   // blue-600
      gradientTo: "#90cdf4",     // light blue
    },

    text: {
      deveraa: "#ffffff",
      grow_with_deveraa: "#D1D5DB"
    },

    toggle: {
      background: "#ffffff",
      text: "#2563eb",
    },

    menu: {
      active_bg: "#ffffff",
      active_text: "#2563eb",
      default_text: "#efefef"
    },

    logout: {
      logout_Bg: "#ffffff",
      logout_Text: "#2563eb"
    },
  },

  modal: {
    success: "#22c55e",
    warning: "#ef4444",
    info: "#2563eb",
  },

  common: {
    white: "#ffffff",
    black: "#000000",
    gray: "#9ca3af",
    blue100: "#BBDEFB",
    blue700: "#1D4ED8",
    gray600: "#718096"
  },

  // login page
  /* =====================
   BACKGROUNDS
====================== */
  background: {
    pageGradientFrom: "#eff6ff", // blue-50
    pageGradientTo: "#e0e7ff",   // indigo-100
    card: "#ffffff",
    glassOverlayFrom: "rgba(239,246,255,0.5)",
    glassOverlayTo: "rgba(233,213,255,0.3)",
    blue50: "#eff6ff",
  },

  /* =====================
     PRIMARY BRAND COLORS
  ====================== */
  primary: {
    blue50: "#eff6ff",
    blue100: "#dbeafe",
    blue200: "#bfdbfe",
    blue500: "#3b82f6",
    blue600: "#2563eb",
    blue700: "#1d4ed8",
  },

  /* =====================
     TEXT COLORS
  ====================== */
  text: {
    gray900: "#0f172a",
    gray800: "#1e293b",
    gray700: "#334155",
    gray600: "#475569",
    gray500: "#6b7280",
    gray400: "#9ca3af",
    white: "#ffffff",
  },

  /* =====================
     LOGIN BUTTON
  ====================== */
  loginButton: {
    bgGradientFrom: "#2563eb", // blue-600
    bgGradientMid: "#1d4ed8",  // blue-700
    bgGradientTo: "#2563eb",
    text: "#ffffff",
    shadow: "rgba(37,99,235,0.6)",
    shadowHover: "rgba(37,99,235,0.8)",
  },

  /* =====================
     CHECKBOX
  ====================== */
  checkbox: {
    border: "#d1d5db", // gray-300
    active: "#2563eb",
  },

  /* =====================
     FOOTER / LINKS
  ====================== */
  link: {
    primary: "#2563eb",
    hover: "#1d4ed8",
  },

  /* =====================
     FLOATING BLOBS
  ====================== */
  blob: {
    blue: "#93c5fd",
    purple: "#d8b4fe",
    pink: "#f9a8d4",
  },





};

export default colors;
