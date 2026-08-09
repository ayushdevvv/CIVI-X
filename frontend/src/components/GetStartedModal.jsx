import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { X, FilePlus2, ShieldCheck, ArrowRight } from "lucide-react";

export default function GetStartedModal({ open, onClose }) {
  const navigate = useNavigate();

  function go(path) {
    onClose();
    navigate(path);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-base/80 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="public-access-modal relative z-10 overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:bg-white/[0.06] hover:text-white"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <p className="public-access-kicker">CIVI-X ACCESS</p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Choose your workspace
            </h2>
            <div className="public-access-grid">
              <button
                onClick={() => go("/report")}
                className="public-access-card group"
              >
                <span className="public-access-icon">
                  <FilePlus2 size={20} className="text-white" />
                </span>
                <h3 className="font-bold text-white">Resident</h3>
                <span className="public-access-continue">
                  Continue <ArrowRight size={14} />
                </span>
              </button>

              <button
                onClick={() => go("/admin")}
                className="public-access-card admin group"
              >
                <span className="public-access-icon">
                  <ShieldCheck size={20} className="text-white" />
                </span>
                <h3 className="font-bold text-white">Admin</h3>
                <span className="public-access-continue">
                  Continue <ArrowRight size={14} />
                </span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
