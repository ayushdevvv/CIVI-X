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
            className="glass-panel relative z-10 w-full max-w-lg overflow-hidden p-6 sm:p-8"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:bg-white/[0.06] hover:text-white"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <p className="section-eyebrow">Get Started</p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              How would you like to use Civi-X?
            </h2>
            <p className="mt-2 text-sm text-white/50">
              Choose a path below — both flows are fully live in this demo.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                onClick={() => go("/report")}
                className="group relative flex flex-col items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:border-accent-indigo/50 hover:bg-white/[0.06] hover:shadow-glow-sm"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent-indigo to-accent-blue shadow-glow-sm">
                  <FilePlus2 size={20} className="text-white" />
                </span>
                <div>
                  <h3 className="font-bold text-white">Report an Issue</h3>
                  <p className="mt-1 text-xs leading-relaxed text-white/45">
                    Submit a civic complaint and get instant AI-powered analysis and a tracking ID.
                  </p>
                </div>
                <span className="mt-auto flex items-center gap-1 text-xs font-semibold text-accent-indigo opacity-0 transition-opacity group-hover:opacity-100">
                  Continue <ArrowRight size={13} />
                </span>
              </button>

              <button
                onClick={() => go("/admin")}
                className="group relative flex flex-col items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:border-accent-blue/50 hover:bg-white/[0.06] hover:shadow-glow-sm"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent-blue to-accent-cyan shadow-glow-sm">
                  <ShieldCheck size={20} className="text-white" />
                </span>
                <div>
                  <h3 className="font-bold text-white">Resolve Issues</h3>
                  <p className="mt-1 text-xs leading-relaxed text-white/45">
                    Open the admin command center — priority queue, clusters, and resolution tools.
                  </p>
                </div>
                <span className="mt-auto flex items-center gap-1 text-xs font-semibold text-accent-blue opacity-0 transition-opacity group-hover:opacity-100">
                  Continue <ArrowRight size={13} />
                </span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
