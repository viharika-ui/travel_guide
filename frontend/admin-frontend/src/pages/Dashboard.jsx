import { useState, useEffect } from "react";
import { getStats } from "../api/api";
import { C, StatCard, Spinner, Avatar, Badge } from "../components";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function BookingStatusChart({ data }) {
  const colors = { paid: C.success, pending: C.warning, failed: C.danger, refunded: C.purple };
  const total = data.reduce((s, d) => s + d.count, 0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {data.map(d => (
        <div key={d._id}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ color: C.text, fontSize: 13, textTransform: "capitalize" }}>{d._id}</span>
            <span style={{ color: C.muted, fontSize: 13 }}>{d.count} ({total ? Math.round(d.count / total * 100) : 0}%)</span>
          </div>
          <div style={{ background: C.border, borderRadius: 4, height: 8 }}>
            <div style={{
              width: total ? `${(d.count / total) * 100}%` : "0%",
              background: colors[d._id] || C.muted, height: "100%", borderRadius: 4,
              transition: "width .5s ease",
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!data) return <div style={{ color: C.danger }}>Failed to load stats.</div>;

  const { stats, bookingsByStatus, recentBookings, recentUsers } = data;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ color: C.text, fontSize: 26, fontWeight: 800, margin: 0 }}>Dashboard</h1>
        <p style={{ color: C.muted, marginTop: 4 }}>Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, marginBottom: 28 }}>
        <StatCard icon="🎫" label="Total Bookings" value={stats.totalBookings} color={C.accent} />
        <StatCard icon="👥" label="Registered Users" value={stats.totalUsers} color={C.purple} />
        <StatCard icon="🦺" label="Guide Users" value={stats.totalGuides} color={C.success} />
        <StatCard icon="📦" label="Tour Packages" value={stats.totalPackages} color={C.accent2} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginBottom: 28 }}>
        <StatCard icon="🗺️" label="Destinations" value={stats.totalDestinations} color={C.warning} />
        <StatCard icon="🌍" label="Regions" value={stats.totalRegions} color={C.success} />
        <StatCard icon="📍" label="States" value={stats.totalStates} color={C.accent} />
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20, marginBottom: 24 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
          <h3 style={{ color: C.text, margin: "0 0 20px", fontSize: 16, fontWeight: 700 }}>Bookings by Status</h3>
          <BookingStatusChart data={bookingsByStatus} />
        </div>
      </div>

      {/* Recent rows */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Recent Bookings */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
          <h3 style={{ color: C.text, margin: "0 0 20px", fontSize: 16, fontWeight: 700 }}>Recent Bookings</h3>
          {recentBookings.length === 0
            ? <div style={{ color: C.muted, textAlign: "center", padding: "24px 0" }}>No bookings yet</div>
            : recentBookings.map(b => (
              <div key={b._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}20` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar src={b.userId?.avatar} name={b.userId?.name} size={34} />
                  <div>
                    <div style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{b.userId?.name || "Unknown"}</div>
                    <div style={{ color: C.muted, fontSize: 12 }}>₹{b.totalPrice?.toLocaleString()}</div>
                  </div>
                </div>
                <Badge status={b.paymentStatus} />
              </div>
            ))}
        </div>

        {/* Recent Users */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
          <h3 style={{ color: C.text, margin: "0 0 20px", fontSize: 16, fontWeight: 700 }}>New Users</h3>
          {recentUsers.length === 0
            ? <div style={{ color: C.muted, textAlign: "center", padding: "24px 0" }}>No users yet</div>
            : recentUsers.map(u => (
              <div key={u._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}20` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar src={u.avatar} name={u.name} size={34} />
                  <div>
                    <div style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{u.name}</div>
                    <div style={{ color: C.muted, fontSize: 12 }}>{u.email}</div>
                  </div>
                </div>
                <div style={{ color: C.muted, fontSize: 12 }}>{new Date(u.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
