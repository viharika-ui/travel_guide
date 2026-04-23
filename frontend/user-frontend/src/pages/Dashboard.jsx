import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Bookings from "./dashboard/Bookings";
import Profile from "./dashboard/Profile";

export default function Dashboard() {
  const { t } = useTranslation();
  const navClass = ({ isActive }) =>
    `block px-4 py-2 rounded ${isActive ? "bg-saffron text-white" : "text-navy hover:bg-slate-100"}`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-navy mb-6">{t("nav.dashboard")}</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <nav className="w-48 shrink-0 space-y-1">
          <NavLink to="/dashboard/bookings" className={navClass}>
            {t("nav.bookings")}
          </NavLink>
          <NavLink to="/dashboard/profile" className={navClass}>
            {t("nav.profile")}
          </NavLink>
        </nav>
        <div className="flex-1">
          <Routes>
            <Route index element={<Navigate to="bookings" replace />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
