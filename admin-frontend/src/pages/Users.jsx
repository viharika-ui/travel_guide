import { useState, useEffect, useCallback } from "react";
import { getUsers, deleteUser } from "../api/api";
import {
  C, Btn, Modal, Table, TR, TD, Badge, Pagination,
  SearchBar, PageHeader, Avatar, Toast, ConfirmDialog, Spinner,
} from "../components";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const data = await getUsers(params);
      setUsers(data.users);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter]);

  useEffect(() => { load(); }, [load]);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  async function handleDelete() {
    try {
      await deleteUser(deleteId);
      showToast("User deleted");
      setDeleteId(null);
      load();
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  return (
    <div>
      <PageHeader title={`Users (${total})`} />

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center" }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search name or email..." />
        <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
          style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 14px", color: C.text, fontSize: 14, outline: "none" }}>
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {loading ? <Spinner /> : (
        <>
          <Table headers={["User", "Email", "Phone", "Role", "City", "Joined", "Actions"]}
            empty={users.length === 0 ? "No users found" : null}>
            {users.map(u => (
              <TR key={u._id}>
                <TD>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar src={u.avatar} name={u.name} size={36} />
                    <span style={{ fontWeight: 600 }}>{u.name}</span>
                  </div>
                </TD>
                <TD style={{ color: C.muted }}>{u.email}</TD>
                <TD style={{ color: C.muted }}>{u.phone || "—"}</TD>
                <TD><Badge status={u.role} /></TD>
                <TD style={{ color: C.muted }}>{u.city || "—"}</TD>
                <TD style={{ color: C.muted }}>{new Date(u.createdAt).toLocaleDateString()}</TD>
                <TD>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn size="sm" variant="danger" onClick={() => setDeleteId(u._id)}>Delete</Btn>
                  </div>
                </TD>
              </TR>
            ))}
          </Table>
          <Pagination page={page} pages={pages} onPage={setPage} />
        </>
      )}

      {deleteId && <ConfirmDialog msg="Are you sure you want to delete this user?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}
      <Toast msg={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}
