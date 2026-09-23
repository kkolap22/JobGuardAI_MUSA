import { Link, NavLink } from "react-router-dom";
import { NAV_LINKS } from "../../utils/constants";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#e4e7ec]/80 bg-white/85 backdrop-blur-xl">
      <div className="flex h-[76px] items-center justify-between px-6 lg:px-12">
        <Link to="/" className="font-display text-2xl font-bold tracking-tight">Job<span className="text-[#08ad50]">Guard+</span></Link>
        <nav className="hidden h-full items-center gap-6 md:flex">{NAV_LINKS.map(({ to, label }) => <NavLink key={to} to={to} end className={({ isActive }) => `text-sm font-bold transition-colors ${isActive ? "text-[#08ad50]" : "text-slate-600 hover:text-[#08ad50]"}`}>{label}</NavLink>)}</nav>
        <div className="flex items-center gap-3"><Link to="/login" className="rounded-lg border border-[#e4e7ec] px-4 py-2 text-sm font-bold text-slate-700 hover:border-[#08ad50] hover:text-[#08ad50]">Login</Link><Link to="/signup" className="rounded-xl bg-[#078e42] px-4 py-2 text-sm font-bold text-white">Sign Up</Link></div>
      </div>
    </header>
  );
}