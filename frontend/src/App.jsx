import { Routes, Route } from "react-router-dom";
import PublicLayout from "./components/PublicLayout";
import Landing from "./pages/Landing";
import ReportIssue from "./pages/ReportIssue";
import TrackComplaint from "./pages/TrackComplaint";
import Explorer from "./pages/Explorer";
import NotFound from "./pages/NotFound";
import Helpline from "./pages/Helpline";
import About from "./pages/About";
import Contact from "./pages/Contact";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PriorityQueue from "./pages/admin/PriorityQueue";
import Clusters from "./pages/admin/Clusters";
import Insights from "./pages/admin/Insights";
import AdminComplaints from "./pages/admin/AdminComplaints";
import ComplaintDetail from "./pages/admin/ComplaintDetail";
import AdminHelpline from "./pages/admin/AdminHelpline";

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/report" element={<ReportIssue />} />
        <Route path="/track" element={<TrackComplaint />} />
        <Route path="/track/:id" element={<TrackComplaint />} />
        <Route path="/explorer" element={<Explorer />} />
        <Route path="/helpline" element={<Helpline />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="queue" element={<PriorityQueue />} />
        <Route path="clusters" element={<Clusters />} />
        <Route path="insights" element={<Insights />} />
        <Route path="complaints" element={<AdminComplaints />} />
        <Route path="complaints/:id" element={<ComplaintDetail />} />
        <Route path="helpline" element={<AdminHelpline />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
