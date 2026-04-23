import { useEffect } from "react";
import { useGuide } from "../../context/GuideContext";

const GuideDashboard = () => {
  const { gToken, dashData, getDashData, cancelBooking, completeBooking } =
    useGuide();

  useEffect(() => {
    if (gToken) getDashData();
  }, [gToken]);

  return (
    dashData && (
      <div className="m-5 w-full">
        {/* ── Stat Cards ── */}
        <div className="flex flex-wrap gap-4">
          {/* Earnings */}
          <div className="flex items-center gap-4 bg-white p-4 min-w-52 rounded-xl border border-slate-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            <div className="bg-blue-50 p-3 rounded-lg">
              <svg
                className="w-8 h-8 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xl font-semibold text-slate-800">
                ₹ {dashData.earnings}
              </p>
              <p className="text-sm text-slate-500">Earnings</p>
            </div>
          </div>

          {/* Bookings */}
          <div className="flex items-center gap-4 bg-white p-4 min-w-52 rounded-xl border border-slate-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            <div className="bg-green-50 p-3 rounded-lg">
              <svg
                className="w-8 h-8 text-green-500"
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
            </div>
            <div>
              <p className="text-xl font-semibold text-slate-800">
                {dashData.bookings}
              </p>
              <p className="text-sm text-slate-500">Bookings</p>
            </div>
          </div>

          {/* Tourists */}
          <div className="flex items-center gap-4 bg-white p-4 min-w-52 rounded-xl border border-slate-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            <div className="bg-orange-50 p-3 rounded-lg">
              <svg
                className="w-8 h-8 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xl font-semibold text-slate-800">
                {dashData.tourists}
              </p>
              <p className="text-sm text-slate-500">Tourists</p>
            </div>
          </div>

          {/* Latest Bookings card */}
          <div className="flex items-center gap-4 bg-white p-4 min-w-52 rounded-xl border border-slate-100 shadow-sm">
            <div className="bg-purple-50 p-3 rounded-lg">
              <svg
                className="w-8 h-8 text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-700">
              Latest Bookings
            </p>
          </div>
        </div>

        {/* ── Latest Bookings Table ── */}
        <div className="bg-white mt-6 rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="font-semibold text-slate-700">Latest Bookings</p>
          </div>

          <div className="divide-y divide-slate-50">
            {dashData.latestBookings.length === 0 ? (
              <p className="text-center text-slate-400 py-10 text-sm">
                No bookings yet
              </p>
            ) : (
              dashData.latestBookings.map((booking, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
                >
                  {/* Tourist info */}
                  <div className="flex items-center gap-3">
                    <img
                      src={booking.userData?.image}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover bg-slate-100"
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {booking.userData?.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        Booking on {booking.slotDate}
                      </p>
                    </div>
                  </div>

                  {/* Status / Actions */}
                  {booking.cancelled ? (
                    <span className="text-xs font-medium text-red-500 bg-red-50 px-3 py-1 rounded-full">
                      Cancelled
                    </span>
                  ) : booking.isCompleted ? (
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      Completed
                    </span>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => cancelBooking(booking._id)}
                        className="text-xs text-red-500 border border-red-200 px-3 py-1 rounded-full hover:bg-red-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => completeBooking(booking._id)}
                        className="text-xs text-green-600 border border-green-200 px-3 py-1 rounded-full hover:bg-green-50 transition-colors"
                      >
                        Complete
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default GuideDashboard;
