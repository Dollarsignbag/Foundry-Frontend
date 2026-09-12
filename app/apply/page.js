"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { COUNTRIES } from "../components/countries";
import AccessMembershipCard from "../components/AccessMembershipCard";

export default function ApplyPage() {
  const [settings, setSettings] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [leadId, setLeadId] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    api("/api/settings").then((d) => setSettings(d.settings)).catch(() => {});
  }, []);

  const canContinue = firstName.trim() && surname.trim() && email.trim() && country;

  async function submit(e) {
    e.preventDefault();
    if (!canContinue || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const { lead } = await api("/api/leads", {
        method: "POST",
        body: JSON.stringify({ firstName, surname, email, country }),
      });
      setLeadId(lead.id);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <section style={{ padding: "70px 24px 90px" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--gold)" }}>
            The Foundry Network
          </p>
          <h1 style={{ fontSize: "clamp(26px,4vw,36px)", maxWidth: 560, margin: "14px auto 0" }}>
            You&apos;re One Step Away.
          </h1>
        </div>
        <AccessMembershipCard settings={settings} userName={`${firstName} ${surname}`.trim()} leadId={leadId} />
      </section>
    );
  }

  return (
    <div className="form-narrow card">
      <h2 style={{ marginBottom: 18 }}>Tell Us Who You Are</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={submit}>
        <label>First name <span style={{ color: "var(--brick)" }}>*</span></label>
        <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />

        <label>Surname <span style={{ color: "var(--brick)" }}>*</span></label>
        <input value={surname} onChange={(e) => setSurname(e.target.value)} required />

        <label>Email <span style={{ color: "var(--brick)" }}>*</span></label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Country <span style={{ color: "var(--brick)" }}>*</span></label>
        <select value={country} onChange={(e) => setCountry(e.target.value)} required>
          <option value="" disabled>Select your country</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <button className="btn btn-primary" style={{ width: "100%" }} type="submit" disabled={!canContinue || submitting}>
          {submitting ? "Please wait…" : "Continue"}
        </button>
      </form>
    </div>
  );
}
