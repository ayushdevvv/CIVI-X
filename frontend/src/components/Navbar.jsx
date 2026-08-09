import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Headset, Shield, ArrowUpRight } from "lucide-react";
import CiviLogo from "./CiviLogo";

const LINKS = [
  { label: "Track Complaint", to: "/track" },
  { label: "About", to: "/about" },
  { label: "Contact Us", to: "/contact" },
];

export default function Navbar({ onGetStarted }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="public-nav-shell">
      <div className="public-navbar">
        <CiviLogo />

        <nav className="public-navbar-center" aria-label="Primary navigation">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `public-nav-link ${isActive ? "active" : ""}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="public-navbar-actions">
          <Link to="/admin" className="public-admin-nav">
            <Shield size={15} />
            <span>Admin Workspace</span>
          </Link>
          <Link to="/helpline" className="public-helpline-nav">
            <Headset size={15} />
            <span>Helpline</span>
          </Link>
          <button className="public-mobile-toggle" onClick={() => setOpen((v) => !v)} aria-label="Open menu">
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div className="public-mobile-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside className="public-mobile-panel" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 27, stiffness: 280 }}>
              <div className="flex items-center justify-between">
                <CiviLogo />
                <button className="public-mobile-close" onClick={() => setOpen(false)}><X size={18} /></button>
              </div>
              <div className="public-mobile-divider" />
              <div className="public-mobile-links">
                {LINKS.map((link) => (
                  <Link key={link.to} to={link.to} onClick={() => setOpen(false)}>{link.label}<ArrowUpRight size={15} /></Link>
                ))}
                <Link to="/helpline" onClick={() => setOpen(false)} className="public-mobile-helpline"><Headset size={16} /> Talk to Helpline</Link>
                <Link to="/admin" onClick={() => setOpen(false)} className="public-admin-link"><Shield size={14} /> Admin workspace</Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
