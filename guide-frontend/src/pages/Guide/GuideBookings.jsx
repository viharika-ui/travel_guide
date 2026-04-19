import { useEffect } from "react";
import { useGuide } from "../../context/GuideContext";

const GuideBookings = () => {
  const { gToken, appointments, getGuideAppointments, cancelBooking, completeBooking } =
    useGuide();

  useEffect(() => {
    if (gToken) getGuideAppointments();
  }, [gToken]);

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-4 text-lg font-semibold text-slate-700">All Bookings</p>

      <div className="bg-white border border-slate-100 rounded-xl shadow-sm text-sm overflow-hidden">
        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-[0.5fr_2fr_1.5fr_1fr_1.5fr_1fr_1.5fr] gap-1 px-5 py-3 border-b border-slate-100 bg-slate-50 text-slate-500 font-medium text-xs uppercase tracking-wide">
          <p>#</p>
          <p>Tourist</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fee</p>
          <p>Action</p>
        </div>

        {/* Table Rows */}
        {appointments.length === 0 ? (
          <p className="text-center text-slate-400 py-16 text-sm">
            No bookings found
          </p>
        ) : (
          appointments.map((item, index) => (
            <div
              key={item._id}
              className="flex flex-wrap justify-between sm:grid sm:grid-cols-[0.5fr_2fr_1.5fr_1fr_1.5fr_1fr_1.5fr] gap-1 items-center px-5 py-3.5 border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
            >
              {/* # */}
              <p className="text-slate-400 text-xs">{index + 1}</p>

              {/* Tourist */}
              <div className="flex items-center gap-2">
                <img
                  src={item.userData?.image}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover bg-slate-100 shrink-0"
                />
                <p className="text-slate-700 font-medium text-sm">
                  {item.userData?.name}
                </p>
              </div>

              {/* Payment */}
              <div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    item.payment
                      ? "bg-green-50 text-green-600"
                      : "bg-yellow-50 text-yellow-600"
                  }`}
                >
                  {item.payment ? "Online" : "Cash"}
                </span>
              </div>

              {/* Age */}
              <p className="text-slate-600 text-sm">
                {item.userData?.dob
                  ? new Date().getFullYear() -
                    new Date(item.userData.dob).getFullYear()
                  : "N/A"}
              </p>

              {/* Date & Time */}
              <p className="text-slate-600 text-sm">
                {item.slotDate}, {item.slotTime}
              </p>

              {/* Fee */}
              <p className="text-slate-700 font-medium text-sm">
                ₹ {item.amount}
              </p>

              {/* Action */}
              <div className="flex items-center gap-2">
                {item.cancelled ? (
                  <span className="text-xs text-red-500 font-medium bg-red-50 px-2.5 py-1 rounded-full">
                    Cancelled
                  </span>
                ) : item.isCompleted ? (
                  <span className="text-xs text-green-600 font-medium bg-green-50 px-2.5 py-1 rounded-full">
                    Completed
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() => cancelBooking(item._id)}
                      title="Cancel booking"
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      {/* X icon */}
                      <svg
                        className="w-8 h-8 border border-slate-200 rounded-full p-1.5 hover:border-red-200 hover:bg-red-50 transition-all"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => completeBooking(item._id)}
                      title="Mark as completed"
                      className="text-slate-400 hover:text-green-600 transition-colors"
                    >
                      {/* Check icon */}
                      <svg
                        className="w-8 h-8 border border-slate-200 rounded-full p-1.5 hover:border-green-200 hover:bg-green-50 transition-all"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GuideBookings;
