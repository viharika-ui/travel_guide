import { NavLink } from "react-router-dom";
import { useGuide } from "../../context/GuideContext";


const GuideSidebar = () => {
  const { gToken } = useGuide();

  if (!gToken) return null;

  return (
    <div className="min-h-screen bg-white border-r border-slate-200 w-[220px] shrink-0">
      <ul className="mt-5 text-[#515151]">
        {/* Dashboard */}
        <NavLink
          to="/guide-dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 py-3.5 px-4 md:px-6 cursor-pointer transition-all duration-200 ${
              isActive
                ? "bg-[#F2F7FF] border-r-4 border-[#3B82F6] text-[#3B82F6] font-medium"
                : "hover:bg-slate-50"
            }`
          }
        >
          {/* Dashboard icon */}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <p className="hidden md:block text-sm">Dashboard</p>
        </NavLink>

        {/* Bookings */}
        <NavLink
          to="/guide-bookings"
          className={({ isActive }) =>
            `flex items-center gap-3 py-3.5 px-4 md:px-6 cursor-pointer transition-all duration-200 ${
              isActive
                ? "bg-[#F2F7FF] border-r-4 border-[#3B82F6] text-[#3B82F6] font-medium"
                : "hover:bg-slate-50"
            }`
          }
        >
          {/* Calendar/booking icon */}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="hidden md:block text-sm">Bookings</p>
        </NavLink>

        {/* Profile */}
        <NavLink
          to="/guide-profile"
          className={({ isActive }) =>
            `flex items-center gap-3 py-3.5 px-4 md:px-6 cursor-pointer transition-all duration-200 ${
              isActive
                ? "bg-[#F2F7FF] border-r-4 border-[#3B82F6] text-[#3B82F6] font-medium"
                : "hover:bg-slate-50"
            }`
          }
        >
          {/* Person icon */}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <p className="hidden md:block text-sm">Profile</p>
        </NavLink>
      </ul>
    </div>
  );
};

export default GuideSidebar;
