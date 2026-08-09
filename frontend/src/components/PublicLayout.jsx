import { useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import CiviLogo from "./CiviLogo";
import PublicSidebar from "./PublicSidebar";
import Footer from "./Footer";
import GetStartedModal from "./GetStartedModal";

export default function PublicLayout() {
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const openGetStarted = () => setModalOpen(true);

  return (
    <div className="min-h-screen bg-base lg:flex">
      {/* Desktop left sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[228px] flex-shrink-0 border-r border-white/[0.06] bg-surface/40 px-3 py-4 lg:block">
        <PublicSidebar onGetStarted={openGetStarted} />
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/[0.06] bg-base/90 px-4 py-3.5 backdrop-blur-xl lg:hidden">
        <CiviLogo />
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
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-white/[0.08] bg-surface px-3 py-4 lg:hidden"
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
              <PublicSidebar
                onNavigate={() => setMobileOpen(false)}
                onGetStarted={() => {
                  setMobileOpen(false);
                  openGetStarted();
                }}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex-1">
          <Outlet context={{ openGetStarted }} />
        </div>
        <Footer />
      </div>

      <GetStartedModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

export function useGetStarted() {
  return useOutletContext();
}
