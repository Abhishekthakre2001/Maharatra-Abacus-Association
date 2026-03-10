// src/utils/Color.js
import ThemeApi from "../api/themeApi";

let resolveThemeReady;
export const themeReady = new Promise((resolve) => {
  resolveThemeReady = resolve;
});

/* ================= DEFAULT COLORS (Fallback) ================= */

const colors = {
  Client: {
    brand_name: "DevEraa",
    brand_sub_title: "Grow with Deveraa",
    logo_url: "https://deveraa.com/assets/favicon.png"
  },

  examScheduleCard: {
    card: { bg: "#eff6ff", border: "#dbeafe" },
    text: {
      title: "#6b7280",
      value: "#1e293b",
      time: "#475569",
    },
    action: {
      edit: { text: "#ea580c", bgHover: "#ffedd5" },
      delete: { text: "#dc2626", bgHover: "#fee2e2" },
    },
  },

  button: {
    add: { bg: "#2563eb", text: "#ffffff" },
    export: { bg: "#36afe3", text: "#ffffff" },
    clear: { bg: "#dee9f1", text: "#374151" },
  },

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

  appbar: {
    bg: { gradientFrom: "#2563eb", gradientTo: "#90cdf4" },
    text: { title: "#ffffff", subtitle: "#bfdbfe" },
    toggle: { background: "#ffffff", icon: "#2563eb" },
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

  sidebar: {
    bg: { gradientFrom: "#2563eb", gradientTo: "#90cdf4" },
    text: {
      deveraa: "#ffffff",
      grow_with_deveraa: "#D1D5DB",
    },
    toggle: { background: "#ffffff", text: "#2563eb" },
    menu: {
      active_bg: "#ffffff",
      active_text: "#2563eb",
      default_text: "#efefef",
    },
    logout: {
      logout_Bg: "#ffffff",
      logout_Text: "#2563eb",
    },
  },

  modal: {
    success: "#2563eb",
    warning: "#dc2626",
    info: "#36afe3",
  },

  common: {
    white: "#ffffff",
    black: "#000000",
    gray: "#9ca3af",
    blue100: "#eff6ff",
    blue700: "#2563eb",
    gray600: "#64748b"
  },

  /* =====================
     LOGIN PAGE
  ====================== */
  background: {
    pageGradientFrom: "#eff6ff",
    pageGradientTo: "#e0e7ff",
    card: "#ffffff",
    glassOverlayFrom: "rgba(239,246,255,0.5)",
    glassOverlayTo: "rgba(233,213,255,0.3)",
    blue50: "#eff6ff",
  },

  primary: {
    blue50: "#eff6ff",
    blue100: "#dbeafe",
    blue200: "#bfdbfe",
    blue500: "#3b82f6",
    blue600: "#2563eb",
    blue700: "#1d4ed8",
  },

  text: {
    gray900: "#0f172a",
    gray800: "#1e293b",
    gray700: "#334155",
    gray600: "#475569",
    gray500: "#6b7280",
    gray400: "#9ca3af",
    white: "#ffffff",
  },

  loginButton: {
    bgGradientFrom: "#2563eb",
    bgGradientMid: "#1d4ed8",
    bgGradientTo: "#2563eb",
    text: "#ffffff",
    shadow: "rgba(37,99,235,0.6)",
    shadowHover: "rgba(37,99,235,0.8)",
  },

  checkbox: {
    border: "#d1d5db",
    active: "#2563eb",
  },

  link: {
    primary: "#2563eb",
    hover: "#1d4ed8",
  },

  blob: {
    blue: "#93c5fd",
    purple: "#d8b4fe",
    pink: "#f9a8d4",
  },
};

/* ================= APPLY API COLORS ================= */
const user = JSON.parse(localStorage.getItem("user"));

if (user?.createdby) {
  ThemeApi.getThemeColor(user.createdby)
    .then((res) => {
      const d = res?.data;
      if (!d) {
        resolveThemeReady();
        return;
      }

      console.log("🎨 Applying theme colors from API:", d);

      /* Client Details */
      colors.Client.brand_name = d.brand_name;
      colors.Client.brand_sub_title = d.brand_sub_title;
      colors.Client.logo_url = d.logo_url;

      /* EXAM SCHEDULE CARD */
      colors.examScheduleCard.card.bg = d.examScheduleCard_card_bg;
      colors.examScheduleCard.card.border = d.examScheduleCard_card_border;
      colors.examScheduleCard.text.title = d.examScheduleCard_text_title;
      colors.examScheduleCard.text.value = d.examScheduleCard_text_value;
      colors.examScheduleCard.text.time = d.examScheduleCard_text_time;
      colors.examScheduleCard.action.edit.text = d.examScheduleCard_action_edit_text;
      colors.examScheduleCard.action.edit.bgHover = d.examScheduleCard_action_edit_bgHover;
      colors.examScheduleCard.action.delete.text = d.examScheduleCard_action_delete_text;
      colors.examScheduleCard.action.delete.bgHover = d.examScheduleCard_action_delete_bgHover;

      /* BUTTONS */
      colors.button.add.bg = d.button_add_bg;
      colors.button.add.text = d.button_add_text;
      colors.button.export.bg = d.button_export_bg;
      colors.button.export.text = d.button_export_text;
      colors.button.clear.bg = d.button_clear_bg;
      colors.button.clear.text = d.button_clear_text;

      /* DASHBOARD */
      colors.dashboard.card.bg.gradientFrom = d.dashboard_card_bg_gradientFrom;
      colors.dashboard.card.bg.gradientTo = d.dashboard_card_bg_gradientTo;
      colors.dashboard.card.bg.border = d.dashboard_card_bg_border;
      colors.dashboard.card.shadow.normal = d.dashboard_card_shadow_normal;
      colors.dashboard.card.shadow.hover = d.dashboard_card_shadow_hover;
      colors.dashboard.card.text.title = d.dashboard_card_text_title;
      colors.dashboard.card.text.value = d.dashboard_card_text_value;
      colors.dashboard.card.icon.bgGradientFrom = d.dashboard_card_icon_bgGradientFrom;
      colors.dashboard.card.icon.bgGradientTo = d.dashboard_card_icon_bgGradientTo;
      colors.dashboard.card.icon.color = d.dashboard_card_icon_color;

      /* APP BAR */
      colors.appbar.bg.gradientFrom = d.appbar_bg_gradientFrom;
      colors.appbar.bg.gradientTo = d.appbar_bg_gradientTo;
      colors.appbar.text.title = d.appbar_text_title;
      colors.appbar.text.subtitle = d.appbar_text_subtitle;
      colors.appbar.toggle.background = d.appbar_toggle_background;
      colors.appbar.toggle.icon = d.appbar_toggle_icon;
      colors.appbar.menu.active_bg = d.appbar_menu_active_bg;
      colors.appbar.menu.active_text = d.appbar_menu_active_text;
      colors.appbar.menu.default_text = d.appbar_menu_default_text;
      colors.appbar.menu.hover_bg = d.appbar_menu_hover_bg;
      colors.appbar.user.avatar_bg = d.appbar_user_avatar_bg;
      colors.appbar.user.welcome_text = d.appbar_user_welcome_text;
      colors.appbar.user.name_text = d.appbar_user_name_text;
      colors.appbar.logout.bg = d.appbar_logout_bg;
      colors.appbar.logout.text = d.appbar_logout_text;
      colors.appbar.logout.hover_bg = d.appbar_logout_hover_bg;

      /* SIDEBAR */
      colors.sidebar.bg.gradientFrom = d.sidebar_bg_gradientFrom;
      colors.sidebar.bg.gradientTo = d.sidebar_bg_gradientTo;
      colors.sidebar.text.deveraa = d.sidebar_text_deveraa;
      colors.sidebar.text.grow_with_deveraa = d.sidebar_text_grow_with_deveraa;
      colors.sidebar.toggle.background = d.sidebar_toggle_background;
      colors.sidebar.toggle.text = d.sidebar_toggle_text;
      colors.sidebar.menu.active_bg = d.sidebar_menu_active_bg;
      colors.sidebar.menu.active_text = d.sidebar_menu_active_text;
      colors.sidebar.menu.default_text = d.sidebar_menu_default_text;
      colors.sidebar.logout.logout_Bg = d.sidebar_logout_logout_Bg;
      colors.sidebar.logout.logout_Text = d.sidebar_logout_logout_Text;

      resolveThemeReady();
    })
    .catch((err) => {
      console.error("❌ Failed to load theme colors:", err);
      resolveThemeReady();
    });
} else {
  resolveThemeReady();
}

/* ================= EXPORT ================= */
export default colors;