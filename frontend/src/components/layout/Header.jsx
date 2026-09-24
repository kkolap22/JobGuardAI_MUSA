import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { authApi } from "../../services/auth.api";

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("jobguard_user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("jobguard_user");
      }
    }
  }, []);

  const isLoggedIn = Boolean(
    localStorage.getItem("jobguard_access_token")
  );

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Continue local logout even if the server request fails.
    }

    localStorage.removeItem("jobguard_access_token");
    localStorage.removeItem("jobguard_refresh_token");
    localStorage.removeItem("jobguard_user");

    setUser(null);
    navigate("/", { replace: true });
  };

  const navClass = ({ isActive }) =>
    `text-sm font-semibold transition ${
      isActive
        ? "text-[#08ad50]"
        : "text-slate-600 hover:text-[#08ad50]"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#08ad50] text-white shadow-sm">
            <span className="text-lg font-black">J</span>
          </div>

          <div>
            <div className="font-display text-xl font-extrabold tracking-tight">
              JobGuard<span className="text-[#08ad50]"> AI</span>
            </div>

            <div className="hidden text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:block">
              AI Job Scam Investigator
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-7 md:flex">
          <NavLink to="/" className={navClass}>
            Home
          </NavLink>

          <NavLink to="/about" className={navClass}>
            About
          </NavLink>

          {isLoggedIn && (
            <>
              <NavLink to="/scan" className={navClass}>
                Scan Job
              </NavLink>

              <NavLink to="/history" className={navClass}>
                History
              </NavLink>
            </>
          )}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-bold text-slate-800">
                  {user?.name || "User"}
                </p>

                <p className="max-w-[180px] truncate text-xs text-slate-400">
                  {user?.email || ""}
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-red-200 hover:text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden rounded-xl px-4 py-2 text-sm font-bold text-slate-700 transition hover:text-[#08ad50] sm:block"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="rounded-xl bg-[#08ad50] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#078e42]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}