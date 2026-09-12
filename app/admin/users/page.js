"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AdminNav from "../../components/AdminNav";
import RequireAdmin from "../../components/RequireAdmin";

const CHANNEL_LABELS = { email: "Email", whatsapp: "WhatsApp", telegram: "Telegram" };

function AdminUsers() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    api("/api/admin/leads").then((d) => setLeads(d.leads));
  }, []);

  return (
    <div className="admin-main">
      <h2>Users</h2>
      <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: "6px 0 20px" }}>
        Everyone who submitted their details on the Get In flow — one row per email, most recently active first.
      </p>
      <table>
        <thead><tr><th>Name</th><th>Email</th><th>Country</th><th>Last Submitted</th><th>Times Entered</th><th>Times Requested Access</th><th>Last Channel</th></tr></thead>
        <tbody>
          {leads.length === 0 && <tr><td colSpan={7}>No submissions yet.</td></tr>}
          {leads.map((l) => (
            <tr key={l.email}>
              <td>{l.firstName} {l.surname}</td>
              <td>{l.email}</td>
              <td>{l.country}</td>
              <td>{new Date(l.lastSubmittedAt).toLocaleDateString()}</td>
              <td>{l.timesEntered}</td>
              <td>{l.timesRequestedAccess}</td>
              <td>{l.lastChannel ? CHANNEL_LABELS[l.lastChannel] || l.lastChannel : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <RequireAdmin>
      <div className="admin-shell">
        <AdminNav />
        <AdminUsers />
      </div>
    </RequireAdmin>
  );
}
