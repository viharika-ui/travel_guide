import { useEffect, useState } from "react";
import { useGuide } from "../../context/GuideContext";
import { C, StatCard, Avatar, Btn, Spinner, Badge } from "../../components";
import { toast } from "react-toastify";
import axios from "axios";

const GuideDashboard = () => {
  const { gToken, dashData, getDashData, cancelBooking, completeBooking, backendUrl, guideData, setGuideData } =
    useGuide();

  const [isUpdatingAvailability, setIsUpdatingAvailability] = useState(false);

  useEffect(() => {
    if (gToken) {
      getDashData();
    }
  }, [gToken, getDashData]);

  if (!dashData) return <Spinner />;

  const toggleAvailability = async () => {
    if (!guideData) return;
    setIsUpdatingAvailability(true);
    try {
      const formData = new FormData();
      formData.append("about", guideData.about || "");
      formData.append("fee", guideData.fee || 0);
      formData.append("address", JSON.stringify(guideData.address || {}));
      formData.append("available", (!guideData.available).toString());
      
      const { data } = await axios.post(
        `${backendUrl}/api/guide/update-profile`,
        formData,
        { headers: { gToken } }
      );

      if (data.success) {
        toast.success(`Availability changed to ${!guideData.available ? 'Available' : 'Not available'}`);
        setGuideData((prev) => ({ ...prev, available: !prev.available }));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsUpdatingAvailability(false);
    }
  };

  return (
    <div style={{ maxWidth: 1040, margin: "0 auto", paddingBottom: 40 }}>
      {/* Header Section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
        <div>
          <h1 style={{ color: C.text, fontSize: 26, fontWeight: 800, margin: 0 }}>Dashboard Overview</h1>
          <p style={{ color: C.muted, marginTop: 4 }}>
            Quickly understand your performance, incoming earnings, and notifications.
          </p>
        </div>
        
        {guideData && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: C.card, padding: "10px 16px", borderRadius: 12, border: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Status:</span>
            <button
              onClick={toggleAvailability}
              disabled={isUpdatingAvailability}
              style={{
                width: 44, height: 24, borderRadius: 30, border: "none", cursor: isUpdatingAvailability ? "not-allowed" : "pointer",
                background: guideData.available ? C.success : "#cbd5e1",
                position: "relative", transition: "background 0.3s", opacity: isUpdatingAvailability ? 0.6 : 1
              }}
            >
              <div style={{
                width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3,
                left: guideData.available ? 23 : 3, transition: "left 0.3s"
              }} />
            </button>
            <span style={{ fontSize: 13, fontWeight: 700, color: guideData.available ? C.success : C.muted }}>
              {guideData.available ? 'Available' : 'Busy'}
            </span>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        <StatCard icon="💰" label="Total Earnings" value={`₹${dashData.earnings}`} color={C.success} />
        <StatCard icon="🎫" label="Total Bookings" value={dashData.bookings} color={C.accent} />
        <StatCard icon="👥" label="Total Tourists" value={dashData.tourists} color={C.purple} />
        <StatCard
          icon="⭐"
          label="Avg. Rating"
          value={`${(dashData.averageRating || 0).toFixed(1)} (${dashData.reviewsCount || 0})`}
          color="#f59e0b"
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        
        {/* Recent Bookings List */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: `1px solid ${C.border}` }}>
            <h3 style={{ color: C.text, margin: 0, fontSize: 16, fontWeight: 700 }}>Recent Action Required</h3>
            <a href="/guide/bookings" style={{ fontSize: 13, color: C.accent2, textDecoration: "none", fontWeight: 600 }}>View all</a>
          </div>
          
          {dashData.latestBookings.length === 0 ? (
            <div style={{ padding: "32px 0", textAlign: "center", color: C.muted, fontSize: 14 }}>No recent bookings found.</div>
          ) : (
            <div>
              {dashData.latestBookings.slice(0, 5).map((booking, index) => {
                const accepted = booking.accepted ?? true;
                return (
                <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: index < 4 ? `1px solid ${C.border}60` : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <Avatar src={booking.userData?.image} name={booking.userData?.name} size={42} />
                    <div>
                      <div style={{ color: C.text, fontSize: 14, fontWeight: 600 }}>
                        {booking.userData?.name || "Unknown"}
                      </div>
                      <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>
                        {booking.slotDate} • ₹{booking.amount} • {accepted ? "Accepted" : "Pending"} • {booking.paymentStatus === "paid" ? "Paid" : booking.paymentStatus === "cash_pending" ? "Cash pending" : "Unpaid"}
                      </div>
                    </div>
                  </div>
                  <div>
                    {booking.cancelled ? (
                      <Badge status="failed" />
                    ) : booking.isCompleted ? (
                      <Badge status="active" />
                    ) : (
                      <div style={{ display: "flex", gap: 8 }}>
                        <Btn variant="ghost" size="sm" onClick={() => cancelBooking(booking._id)}>Reject</Btn>
                        <Btn size="sm" onClick={() => completeBooking(booking._id)}>Complete</Btn>
                      </div>
                    )}
                  </div>
                </div>
              );
              })}
            </div>
          )}
        </div>

        {/* Reviews Column */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px 24px" }}>
          <h3 style={{ color: C.text, margin: "0 0 20px", fontSize: 16, fontWeight: 700 }}>Latest Reviews</h3>

          {dashData.latestReviews?.length ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {dashData.latestReviews.slice(0, 6).map((review) => (
                <div key={review.bookingId} style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 12, background: C.bg }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{review.userName}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#d97706" }}>{review.rating}/5</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: C.muted, lineHeight: 1.4 }}>
                    {review.reviewText || "No comment shared."}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: C.muted, fontSize: 14, margin: 0 }}>No reviews yet from travelers.</p>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default GuideDashboard;
