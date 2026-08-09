import { useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import GetStartedModal from "./GetStartedModal";

export default function PublicLayout() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onGetStarted={() => setModalOpen(true)} />
      <div className="flex-1">
        <Outlet context={{ openGetStarted: () => setModalOpen(true) }} />
      </div>
      <Footer />
      <GetStartedModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

export function useGetStarted() {
  return useOutletContext();
}
