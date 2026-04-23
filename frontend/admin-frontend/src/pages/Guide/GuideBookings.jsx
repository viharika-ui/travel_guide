import { useEffect, useState } from "react";
import { useGuide } from "../../context/GuideContext";
import { C, Table, TR, Btn, Badge, Avatar, Modal, StatCard, Spinner } from "../../components";

const GuideBookings = () => {
  const { gToken, appointments, getGuideAppointments, cancelBooking, acceptBooking, completeBooking, confirmCashPayment } =
    useGuide();

  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    if (gToken) getGuideAppointments();
  }, [gToken, getGuideAppointments]);

  if (!appointments) return <Spinner />;

  // Filter logic
  const filteredAppointments = appointments.filter((item) => {
    const matchesSearch = item.userData?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesTab = true;
    if (activeTab === "Upcoming") {
      matchesTab = !item.isCompleted && !item.cancelled;
    } else if (activeTab === "Completed") {
      matchesTab = item.isCompleted;
    } else if (activeTab === "Cancelled") {
      matchesTab = item.cancelled;
    }

    return matchesSearch && matchesTab;
  });

  const totalBookings = appointments.length;
  const completedBookings = appointments.filter((item) => item.isCompleted).length;
  const cancelledBookings = appointments.filter((item) => item.cancelled).length;
  const onlineBookings = appointments.filter((item) => item.payment).length;

  return (
    <div style={{ maxWidth: 1040, margin: "0 auto", paddingBottom: 40 }}>
      {/* Header Section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
        <div>
          <h1 style={{ color: C.text, fontSize: 26, fontWeight: 800, margin: 0 }}>Manage Bookings</h1>
          <p style={{ color: C.muted, marginTop: 4 }}>
            View, filter, and manage your tourist appointments and itineraries.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        <StatCard icon="📅" label="Total Bookings" value={totalBookings} color={C.accent} />
        <StatCard icon="✅" label="Completed" value={completedBookings} color={C.success} />
        <StatCard icon="❌" label="Cancelled" value={cancelledBookings} color={C.danger} />
        <StatCard icon="💳" label="Online Payments" value={onlineBookings} color={C.purple} />
      </div>

      {/* Filters & Search */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 8, background: C.card, padding: 6, borderRadius: 10, border: `1px solid ${C.border}` }}>
          {["All", "Upcoming", "Completed", "Cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? C.bg : "transparent",
                color: activeTab === tab ? C.accent2 : C.muted,
                border: "none", padding: "6px 16px", borderRadius: 6,
                fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s"
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search tourist..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "8px 14px", borderRadius: 8, border: `1px solid ${C.border}`,
            background: C.surface, color: C.text, fontSize: 14, outline: "none", width: 220
          }}
        />
      </div>

      {/* Bookings Table */}
      <Table headers={["Tourist", "Date & Time", "Payment", "Status", "Review", "Actions"]} empty={filteredAppointments.length === 0 ? "No bookings found matching filters." : null}>
        {filteredAppointments.map((item) => {
          const accepted = item.accepted ?? true;
          return (
          <TR key={item._id}>
            <td style={{ padding: "16px", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar src={item.userData?.image} name={item.userData?.name} size={38} />
                <div>
                  <div style={{ color: C.text, fontSize: 14, fontWeight: 600 }}>{item.userData?.name}</div>
                  <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>Ph: {item.userData?.phone || "N/A"}</div>
                </div>
              </div>
            </td>
            <td style={{ padding: "16px", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ color: C.text, fontSize: 14, fontWeight: 500 }}>{item.slotDate}</div>
              <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{item.slotTime}</div>
            </td>
            <td style={{ padding: "16px", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ color: C.text, fontSize: 14, fontWeight: 600, marginBottom: 4 }}>₹{item.amount}</div>
              {item.paymentStatus === "paid" ? (
                <Badge status="paid" />
              ) : (
                <Badge status="pending" />
              )}
              <div style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>
                {item.paymentStatus === "paid" ? "Paid" : item.paymentStatus === "cash_pending" ? "Cash pending" : "Unpaid"}
              </div>
            </td>
            <td style={{ padding: "16px", borderBottom: `1px solid ${C.border}` }}>
              {item.cancelled ? (
                <Badge status="failed" />
              ) : !accepted ? (
                <Badge status="pending" />
              ) : item.isCompleted ? (
                <Badge status="active" />
              ) : (
                <Badge status="paid" />
              )}
              <div style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>
                {item.cancelled ? "Rejected" : !accepted ? "Awaiting acceptance" : item.isCompleted ? "Completed" : "Accepted"}
              </div>
            </td>
            <td style={{ padding: "16px", borderBottom: `1px solid ${C.border}`, minWidth: 220 }}>
              {item.isReviewed ? (
                <div>
                  <div style={{ color: "#d97706", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                    {item.reviewRating}/5
                  </div>
                  <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.4 }}>
                    {item.reviewText || "No review text"}
                  </div>
                </div>
              ) : (
                <span style={{ color: C.muted, fontSize: 12 }}>Not reviewed yet</span>
              )}
            </td>
            <td style={{ padding: "16px", borderBottom: `1px solid ${C.border}`, textAlign: "right" }}>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", alignItems: "center" }}>
                <button 
                  onClick={() => setSelectedBooking(item)}
                  style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 18 }}
                  title="View Details"
                >
                  👁️
                </button>
                {!item.cancelled && !accepted && (
                  <>
                    <Btn size="sm" onClick={() => acceptBooking(item._id)}>Accept</Btn>
                    <Btn size="sm" variant="danger" onClick={() => cancelBooking(item._id)}>Reject</Btn>
                  </>
                )}
                {!item.cancelled && accepted && !item.isCompleted && (
                  <>
                    <Btn size="sm" onClick={() => completeBooking(item._id)}>Complete</Btn>
                    <Btn size="sm" variant="danger" onClick={() => cancelBooking(item._id)}>Cancel</Btn>
                  </>
                )}
                {!item.cancelled && item.paymentStatus === "cash_pending" && (
                  <Btn size="sm" variant="ghost" onClick={() => confirmCashPayment(item._id)}>Mark Paid</Btn>
                )}
              </div>
            </td>
          </TR>
        );
        })}
      </Table>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <Modal title="Booking Details" onClose={() => setSelectedBooking(null)} wide>
          <div style={{ display: "flex", alignItems: "center", gap: 16, borderBottom: `1px solid ${C.border}`, paddingBottom: 24, marginBottom: 24 }}>
            <Avatar src={selectedBooking.userData?.image} name={selectedBooking.userData?.name} size={64} />
            <div>
              <h3 style={{ fontSize: 20, color: C.text, margin: "0 0 4px", fontWeight: 700 }}>{selectedBooking.userData?.name}</h3>
              <p style={{ margin: 0, color: C.muted, fontSize: 14 }}>Contact: {selectedBooking.userData?.phone || "Hidden"}</p>
              <p style={{ margin: 0, color: C.muted, fontSize: 14 }}>Email: {selectedBooking.userData?.email || "Hidden"}</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
            <div>
              <h4 style={{ fontSize: 12, color: C.muted, letterSpacing: 1, margin: "0 0 12px" }}>SCHEDULE</h4>
              <p style={{ margin: "0 0 8px", fontSize: 14, color: C.text }}><strong style={{ width: 60, display: "inline-block" }}>Date:</strong> {selectedBooking.slotDate}</p>
              <p style={{ margin: 0, fontSize: 14, color: C.text }}><strong style={{ width: 60, display: "inline-block" }}>Time:</strong> {selectedBooking.slotTime}</p>
            </div>
            <div>
              <h4 style={{ fontSize: 12, color: C.muted, letterSpacing: 1, margin: "0 0 12px" }}>PAYMENT INFO</h4>
              <p style={{ margin: "0 0 8px", fontSize: 14, color: C.text }}><strong style={{ width: 70, display: "inline-block" }}>Amount:</strong> ₹{selectedBooking.amount}</p>
              <p style={{ margin: 0, fontSize: 14, color: C.text }}><strong style={{ width: 70, display: "inline-block" }}>Method:</strong> {selectedBooking.paymentMethod === "online" ? "Online Payment" : "Cash on Meet"}</p>
              <p style={{ marginTop: 6, fontSize: 14, color: C.text }}><strong style={{ width: 70, display: "inline-block" }}>Status:</strong> {selectedBooking.paymentStatus === "paid" ? "Paid" : selectedBooking.paymentStatus === "cash_pending" ? "Cash pending" : "Unpaid"}</p>
            </div>
          </div>

          <div style={{ background: C.bg, padding: 16, borderRadius: 12, border: `1px solid ${C.border}` }}>
            <h4 style={{ fontSize: 14, color: C.accent2, margin: "0 0 8px" }}>Special Requests / Itinerary</h4>
            <p style={{ margin: 0, fontSize: 14, color: C.text, lineHeight: 1.5 }}>
              {selectedBooking.notes || "Standard meeting requested. No special accessibility needs mentioned in the booking."}
            </p>
          </div>

          <div style={{ background: C.bg, padding: 16, borderRadius: 12, border: `1px solid ${C.border}`, marginTop: 16 }}>
            <h4 style={{ fontSize: 14, color: C.accent2, margin: "0 0 8px" }}>Traveler Review</h4>
            {selectedBooking.isReviewed ? (
              <>
                <p style={{ margin: "0 0 6px", fontSize: 14, color: "#d97706", fontWeight: 700 }}>
                  Rating: {selectedBooking.reviewRating}/5
                </p>
                <p style={{ margin: 0, fontSize: 14, color: C.text, lineHeight: 1.5 }}>
                  {selectedBooking.reviewText || "No written review provided."}
                </p>
              </>
            ) : (
              <p style={{ margin: 0, fontSize: 14, color: C.muted, lineHeight: 1.5 }}>
                This booking has not been reviewed by the traveler yet.
              </p>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 32 }}>
            <Btn variant="ghost" onClick={() => setSelectedBooking(null)}>Close</Btn>
            <Btn>Message Tourist</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default GuideBookings;
