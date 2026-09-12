"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AdminNav from "../components/AdminNav";
import RequireAdmin from "../components/RequireAdmin";

const CHANNEL_LABELS = { email: "Email", whatsapp: "WhatsApp", telegram: "Telegram" };

function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/admin/leads/stats").then(setData).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="admin-main">
      <div className="section-title"><h2>Dashboard</h2></div>

      {error && <div className="error">{error}</div>}
      {!data && !error && <p style={{ color: "var(--ink-soft)" }}>Loading…</p>}

      {data && (
        <>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="label">Users Entered Info</div>
              <div className="value">{data.totalLeads}</div>
              <div className="sub">submitted name, email &amp; country</div>
            </div>
            <div className="stat-card">
              <div className="label">Requested Access</div>
              <div className="value">{data.totalRequestedAccess}</div>
              <div className="sub">clicked through to reach out</div>
            </div>
          </div>

          <div className="card" style={{ marginTop: 20 }}>
            <h3 style={{ fontSize: 16, marginBottom: 14 }}>Requests by channel</h3>
            <table>
              <thead><tr><th>Channel</th><th>Requests</th></tr></thead>
              <tbody>
                {Object.entries(data.byChannel).map(([channel, count]) => (
                  <tr key={channel}><td>{CHANNEL_LABELS[channel] || channel}</td><td>{count}</td></tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card" style={{ marginTop: 20 }}>
            <h3 style={{ fontSize: 16, marginBottom: 14 }}>Most recently active</h3>
            <table>
              <thead><tr><th>Name</th><th>Email</th><th>Country</th><th>Times Entered</th><th>Times Requested Access</th><th>Last Channel</th></tr></thead>
              <tbody>
                {data.recent.length === 0 && <tr><td colSpan={6}>No submissions yet.</td></tr>}
                {data.recent.map((l) => (
                  <tr key={l.email}>
                    <td>{l.firstName} {l.surname}</td>
                    <td>{l.email}</td>
                    <td>{l.country}</td>
                    <td>{l.timesEntered}</td>
                    <td>{l.timesRequestedAccess}</td>
                    <td>{l.lastChannel ? (CHANNEL_LABELS[l.lastChannel] || l.lastChannel) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <RequireAdmin>
      <div className="admin-shell">
        <AdminNav />
        <Dashboard />
      </div>
    </RequireAdmin>
  );
}
