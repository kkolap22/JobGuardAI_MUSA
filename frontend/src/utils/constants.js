export const APP_NAME = "JobGuard+";

export const ROUTES = {
  home: "/",
  login: "/login",
  signup: "/signup",
  scan: "/scan",
  history: "/history",
  about: "/about",
};

export const NAV_LINKS = [
  { to: ROUTES.home, label: "Home" },
  { to: ROUTES.scan, label: "Scan" },
  { to: ROUTES.history, label: "History" },
  { to: ROUTES.about, label: "About Us" },
];