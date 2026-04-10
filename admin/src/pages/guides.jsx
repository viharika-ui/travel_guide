import { useState, useEffect } from "react";
import api from "../api/axios";
import { LANGUAGES } from "../config/languages";

export default function Guides() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/users").then((r) => {
      setUsers(r.data.users || []);
      setLoading(false);
    });
  }, []);

  const updateUser = async (id, updates) => {
    try {
      await api.patch("/users/" + id, updates);
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, ...updates } : u))
      );
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this account?")) return;
    try {
      await api.delete("/users/" + id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Guides & Users</h1>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Role</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Language</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t border-slate-100 items-center">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <select
                    value={u.role}
                    onChange={(e) => updateUser(u._id, { role: e.target.value })}
                    className="rounded border border-slate-300 text-sm"
                    disabled={u.role === "admin"}
                  >
                    <option value="user">user</option>
                    <option value="guide">guide</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="p-3">
                  {u.role === "guide" ? (
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        u.isApproved
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {u.isApproved ? "Approved" : "Pending"}
                    </span>
                  ) : (
                    <span className="text-slate-400 text-xs">-</span>
                  )}
                </td>
                <td className="p-3">
                  <select
                    value={u.preferredLanguage || "en"}
                    onChange={(e) => updateUser(u._id, { preferredLanguage: e.target.value })}
                    className="rounded border border-slate-300 text-sm"
                  >
                    {LANGUAGES?.map((l) => (
                      <option key={l.code} value={l.code}>{l.label}</option>
                    ))}
                  </select>
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    {u.role === "guide" && !u.isApproved && (
                      <button
                        onClick={() => updateUser(u._id, { isApproved: true })}
                        className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Approve Guide
                      </button>
                    )}
                    {u.role === "guide" && u.isApproved && (
                      <button
                        onClick={() => updateUser(u._id, { isApproved: false })}
                        className="bg-orange-500 text-white text-xs px-3 py-1 rounded hover:bg-orange-600"
                      >
                        Revoke
                      </button>
                    )}
                    {u.email !== "admin@incredibleindia.com" && (
                      <button
                        onClick={() => deleteUser(u._id)}
                        className="bg-red-600 text-white text-xs px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
