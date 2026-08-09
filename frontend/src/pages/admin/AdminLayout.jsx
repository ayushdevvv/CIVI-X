import { useState } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CiviLogo from "../../components/CiviLogo";
import {
  LayoutGrid,
  ListOrdered,
  Boxes,
  Search,
  Menu,
  X,
  ArrowLeft,
  Headset,
} from "lucide-react";

const NAV = [
  { label: "Overview", to: "/admin", icon: LayoutGrid, end: true },
  { label: "Priority Queue", to: "/admin/queue", icon: ListOrdered },
  { label: "Issue Clusters", to: "/admin/clusters", icon: Boxes },
  { label: "Civic Insights", to: "/admin/insights", icon: LayoutGrid },
  { label: "All Complaints", to: "/admin/complaints", icon: Search },
  { label: "Citizen Helpline", to: "/admin/helpline", icon: Headset },
];

function SidebarContent({ onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 py-4">
        <CiviLogo admin />
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[11px] font-medium transition-colors ${
                isActive
                  ? "bg-accent-indigo/15 text-white shadow-[inset_0_0_0_1px_rgba(99,102,241,0.35)]"
                  : "text-white/55 hover:bg-white/[0.05] hover:text-white"
              }`
            }
          >
            <item.icon size={17} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-5 pt-3">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium text-white/40 hover:bg-white/[0.05] hover:text-white/70"
        >
          <ArrowLeft size={14} />
          Back to public site
        </Link>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-base lg:flex">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[208px] flex-shrink-0 border-r border-white/[0.06] bg-surface/40 lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/[0.06] bg-base/90 px-4 py-3.5 backdrop-blur-xl lg:hidden">
        <CiviLogo admin />
        <button
          onClick={() => setMobileOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white/70 hover:bg-white/[0.06]"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-64 border-r border-white/[0.08] bg-surface lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-white/50 hover:bg-white/[0.06]"
              >
                <X size={18} />
              </button>
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-6 lg:px-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
