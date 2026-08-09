import { Headset } from "lucide-react";
import { Link } from "react-router-dom";
import CiviLogo from "./CiviLogo";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-base">
      <div className="mx-auto flex max-w-7xl flex-col gap-7 px-5 py-10 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <CiviLogo />
          <p className="mt-3 max-w-md text-[9px] leading-relaxed text-white/30">A citizen-first civic platform for reporting, tracking and resolving everyday public issues.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/track" className="btn-ghost text-[9px]">Track Complaint</Link>
          <Link to="/about" className="btn-ghost text-[9px]">About</Link>
          <Link to="/contact" className="btn-ghost text-[9px]">Contact</Link>
          <Link to="/helpline" className="btn-secondary py-2 text-[9px]"><Headset size={13}/> Talk to Helpline</Link>
        </div>
      </div>
    </footer>
  );
}
