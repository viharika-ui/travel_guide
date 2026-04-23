import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api/axios";

export default function Bookings() {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState([]);
  const [guideBookings, setGuideBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingReviewId, setSubmittingReviewId] = useState("");
  const [reviewDrafts, setReviewDrafts] = useState({});
  const [payingId, setPayingId] = useState("");

  useEffect(() => {
    Promise.all([api.get("/bookings/my"), api.get("/users/guide-bookings")])
      .then(([packageRes, guideRes]) => {
        setBookings(packageRes.data.bookings || []);
        setGuideBookings(guideRes.data.bookings || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDraftChange = (bookingId, patch) => {
    setReviewDrafts((prev) => ({
      ...prev,
      [bookingId]: {
        rating: prev[bookingId]?.rating || 5,
        reviewText: prev[bookingId]?.reviewText || "",
        ...patch,
      },
    }));
  };

  const submitReview = async (bookingId) => {
    const draft = reviewDrafts[bookingId] || { rating: 5, reviewText: "" };
    setSubmittingReviewId(bookingId);
    try {
      await api.post("/users/guide-bookings/review", {
        bookingId,
        rating: draft.rating,
        reviewText: draft.reviewText,
      });

      setGuideBookings((prev) =>
        prev.map((item) =>
          item._id === bookingId
            ? {
                ...item,
                isReviewed: true,
                reviewRating: draft.rating,
                reviewText: draft.reviewText,
                reviewedAt: new Date().toISOString(),
              }
            : item
        )
      );
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert(error?.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReviewId("");
    }
  };

  const markCashPayment = async (bookingId) => {
    setPayingId(bookingId);
    try {
      const { data } = await api.post("/users/guide-bookings/payment", {
        bookingId,
        method: "cash",
      });

      setGuideBookings((prev) =>
        prev.map((item) => (item._id === bookingId ? data.booking : item))
      );
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert(error?.response?.data?.message || "Failed to update payment method");
    } finally {
      setPayingId("");
    }
  };

  const payOnline = async (booking) => {
    setPayingId(booking._id);
    try {
      const orderRes = await api.post("/payment/create-order", {
        amount: booking.amount,
      });

      const order = orderRes.data;
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "Incredible India",
        description: "Guide Booking",
        order_id: order.id,
        prefill: {
          name: user.name || "",
          email: user.email || "",
        },
        theme: { color: "#00bcd4" },
        handler: async (response) => {
          try {
            await api.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            const { data } = await api.post("/users/guide-bookings/payment", {
              bookingId: booking._id,
              method: "online",
              paymentId: response.razorpay_payment_id,
            });

            setGuideBookings((prev) =>
              prev.map((item) => (item._id === booking._id ? data.booking : item))
            );
          } catch (err) {
            // eslint-disable-next-line no-alert
            alert(err?.response?.data?.message || "Payment verification failed");
          } finally {
            setPayingId("");
          }
        },
        modal: { ondismiss: () => setPayingId("") },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        // eslint-disable-next-line no-alert
        alert(`Payment failed: ${response.error.description}`);
        setPayingId("");
      });
      rzp.open();
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert(error?.response?.data?.message || "Could not initiate payment");
      setPayingId("");
    }
  };

  if (loading) return <p className="text-slate-500">{t("common.loading")}</p>;
  if (bookings.length === 0 && guideBookings.length === 0) return <p className="text-slate-500">{t("dashboard.noBookings")}</p>;

  return (
    <div className="space-y-4">
      {bookings.length > 0 && (
        <>
          <h2 className="text-lg font-bold text-slate-800">Package Bookings</h2>
          {bookings.map((b) => (
            <div
              key={b._id}
              className="p-6 bg-white rounded-xl shadow border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <p className="font-semibold text-navy">{b.packageId?.title || "Package"}</p>
                <p className="text-sm text-slate-500">
                  {t("dashboard.dates")}: {new Date(b.startDate).toLocaleDateString()} – {new Date(b.endDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-slate-500">
                  {t("dashboard.status")}: {b.status} • {t("dashboard.paymentStatus")}: {b.paymentStatus}
                </p>
              </div>
              <span className="text-slate-400 text-sm">#{b._id.slice(-8)}</span>
            </div>
          ))}
        </>
      )}

      {guideBookings.length > 0 && (
        <>
          <h2 className="text-lg font-bold text-slate-800 mt-6">Guide Bookings & Reviews</h2>
          {guideBookings.map((b) => {
            const draft = reviewDrafts[b._id] || { rating: 5, reviewText: "" };
            const canReview = b.isCompleted && !b.cancelled && !b.isReviewed;
            const accepted = b.accepted ?? true;
            const awaitingAcceptance = !b.cancelled && !accepted;
            const canPay = accepted && !b.cancelled && b.paymentStatus !== "paid";

            return (
              <div
                key={b._id}
                className="p-6 bg-white rounded-xl shadow border border-slate-100 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="font-semibold text-navy">{b.guideData?.name || "Travel Guide"}</p>
                    <p className="text-sm text-slate-500">
                      Date: {b.slotDate} at {b.slotTime} • Amount: ₹{b.amount}
                    </p>
                    <p className="text-sm text-slate-500">
                      Status: {b.cancelled ? "Cancelled" : b.isCompleted ? "Completed" : accepted ? "Accepted" : "Pending acceptance"}
                    </p>
                    <p className="text-sm text-slate-500">
                      Payment: {b.paymentStatus === "paid" ? "Paid" : b.paymentStatus === "cash_pending" ? "Cash pending" : "Unpaid"}
                    </p>
                  </div>
                  <span className="text-slate-400 text-sm">#{b._id.slice(-8)}</span>
                </div>

                {awaitingAcceptance && (
                  <div className="rounded-lg bg-blue-50 border border-blue-100 p-3 text-sm text-blue-800">
                    Waiting for the guide to accept your request.
                  </div>
                )}

                {canPay && (
                  <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 space-y-3">
                    <p className="text-sm font-semibold text-slate-800">Complete payment</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={payingId === b._id}
                        className="rounded-md bg-sky-600 text-white px-4 py-2 text-sm font-semibold disabled:opacity-60"
                        onClick={() => payOnline(b)}
                      >
                        {payingId === b._id ? "Processing..." : "Pay Online"}
                      </button>
                      <button
                        type="button"
                        disabled={payingId === b._id}
                        className="rounded-md border border-slate-300 text-slate-700 px-4 py-2 text-sm font-semibold disabled:opacity-60"
                        onClick={() => markCashPayment(b._id)}
                      >
                        Cash on Meet
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">Cash payments are marked pending until the guide confirms.</p>
                  </div>
                )}

                {b.isReviewed && (
                  <div className="rounded-lg bg-amber-50 border border-amber-100 p-3">
                    <p className="text-sm font-semibold text-amber-800">Your Review</p>
                    <p className="text-sm text-amber-700">Rating: {b.reviewRating}/5</p>
                    {b.reviewText ? <p className="text-sm text-amber-700 mt-1">{b.reviewText}</p> : null}
                  </div>
                )}

                {canReview && (
                  <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 space-y-3">
                    <p className="text-sm font-semibold text-slate-800">Rate your guide</p>
                    <div>
                      <label className="text-sm text-slate-600 block mb-1">Rating</label>
                      <select
                        className="w-full sm:w-40 rounded-md border border-slate-300 px-3 py-2"
                        value={draft.rating}
                        onChange={(e) => handleDraftChange(b._id, { rating: Number(e.target.value) })}
                      >
                        {[5, 4, 3, 2, 1].map((val) => (
                          <option key={val} value={val}>{val} Star</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-slate-600 block mb-1">Review</label>
                      <textarea
                        className="w-full rounded-md border border-slate-300 px-3 py-2"
                        rows={3}
                        placeholder="Share your experience with this guide"
                        value={draft.reviewText}
                        onChange={(e) => handleDraftChange(b._id, { reviewText: e.target.value })}
                      />
                    </div>
                    <button
                      type="button"
                      disabled={submittingReviewId === b._id}
                      className="rounded-md bg-sky-600 text-white px-4 py-2 text-sm font-semibold disabled:opacity-60"
                      onClick={() => submitReview(b._id)}
                    >
                      {submittingReviewId === b._id ? "Submitting..." : "Submit Review"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
