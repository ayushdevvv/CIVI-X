import { NavLink, Link } from "react-router-dom";
import {
  Home,
  ClipboardCheck,
  MapPin,
  Map as MapIcon,
  Headset,
  Info,
  Mail,
  Shield,
  Plus,
} from "lucide-react";
import CiviLogo from "./CiviLogo";

const NAV = [
  { label: "Home", to: "/", icon: Home, end: true },
  { label: "Report Issue", to: "/report", icon: ClipboardCheck },
  { label: "Track Complaint", to: "/track", icon: MapPin },
  { label: "City Explorer", to: "/explorer", icon: MapIcon },
  { label: "Helpline", to: "/helpline", icon: Headset },
];

const INFO_NAV = [
  { label: "About", to: "/about", icon: Info },
  { label: "Contact Us", to: "/contact", icon: Mail },
];

export default function PublicSidebar({ onNavigate, onGetStarted }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-1 py-1">
        <CiviLogo />
      </div>

      <div className="mt-5 flex items-center gap-1.5 px-2.5 text-[8px] font-bold uppercase tracking-[.14em] text-white/30">
        <span className="h-1.5 w-1.5 rounded-full bg-severity-low shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
        Live &amp; monitoring
      </div>

      <nav className="mt-5 flex-1 space-y-1 px-1">
        <p className="px-2.5 pb-1.5 text-[9px] font-bold uppercase tracking-[.14em] text-white/25">Resident</p>
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-[11px] font-semibold transition-colors ${
                isActive
                  ? "bg-accent-indigo/15 text-white shadow-[inset_0_0_0_1px_rgba(99,102,241,0.35)]"
                  : "text-white/55 hover:bg-white/[0.05] hover:text-white"
              }`
            }
          >
            <item.icon size={16} />
            {item.label}
          </NavLink>
        ))}

        <p className="mt-4 px-2.5 pb-1.5 text-[9px] font-bold uppercase tracking-[.14em] text-white/25">Civi-X</p>
        {INFO_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-[11px] font-semibold transition-colors ${
                isActive
                  ? "bg-accent-indigo/15 text-white shadow-[inset_0_0_0_1px_rgba(99,102,241,0.35)]"
                  : "text-white/55 hover:bg-white/[0.05] hover:text-white"
              }`
            }
          >
            <item.icon size={16} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-2 px-1 pb-2 pt-3">
        <button
          onClick={() => {
            onNavigate?.();
            onGetStarted?.();
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-indigo to-accent-blue px-3 py-2.5 text-[11px] font-bold text-white shadow-glow-sm transition-all hover:shadow-glow hover:-translate-y-0.5"
        >
          <Plus size={15} />
          Report an Issue
        </button>
        <Link
          to="/admin"
          onClick={onNavigate}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-[10px] font-semibold text-white/40 transition-colors hover:bg-white/[0.05] hover:text-white/70"
        >
          <Shield size={13} />
          Admin workspace
        </Link>
        <p className="px-2 pt-1 text-[8px] leading-relaxed text-white/25">
          AI-powered civic issue reporting for Lucknow residents.
        </p>
      </div>
    </div>
  );
}
