import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import GuideLogin from "./pages/Guide/GuideLogin";
import GuideDashboard from "./pages/Guide/GuideDashboard";
import GuideBookings from "./pages/Guide/GuideBookings";
import GuideProfile from "./pages/Guide/GuideProfile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<GuideLogin />} />
        <Route path="/dashboard" element={<GuideDashboard />} />
        <Route path="/bookings" element={<GuideBookings />} />
        <Route path="/profile" element={<GuideProfile />} />
      </Routes>
    </BrowserRouter>
  );
}