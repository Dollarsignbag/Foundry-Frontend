"use client";
import { useEffect, useState } from "react";
import { api, apiUpload } from "@/lib/api";
import AdminNav from "../../components/AdminNav";
import RequireAdmin from "../../components/RequireAdmin";
import HeroVideo from "../../components/HeroVideo";

function AdminSite() {
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);

  useEffect(() => {
    api("/api/admin/settings").then((d) => setForm(d.settings));
  }, []);

  async function handleVideoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setVideoUploading(true);
    setError("");
    try {
      const { url } = await apiUpload("/api/admin/upload-video", file);
      setForm((f) => ({ ...f, heroVideoUrl: url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setVideoUploading(false);
    }
  }

  async function save() {
    try {
      const { settings } = await api("/api/admin/settings", { method: "PUT", body: JSON.stringify(form) });
      setForm(settings);
      setSaved(true);
      setError("");
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e.message);
    }
  }

  if (!form) return <div className="admin-main">Loading…</div>;

  return (
    <div className="admin-main">
      <div className="section-title">
        <h2>Site content</h2>
      </div>
      <p style={{ color: "var(--ink-soft)", marginBottom: 24, maxWidth: 600 }}>
        This controls what shows on the homepage, your contact email, and the channels people
        use to reach out once they apply.
      </p>

      {error && <div className="error" style={{ maxWidth: 560 }}>{error}</div>}
      {saved && <div className="success" style={{ maxWidth: 560 }}>Saved.</div>}

      {/* Branding */}
      <div className="card" style={{ maxWidth: 560, marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16, fontSize: 17 }}>Branding</h3>
        <label>Homepage headline</label>
        <input value={form.heroHeadline} onChange={(e) => setForm({ ...form, heroHeadline: e.target.value })} />

        <label>Homepage subheadline</label>
        <textarea rows={2} value={form.heroSubheadline} onChange={(e) => setForm({ ...form, heroSubheadline: e.target.value })} />

        <label>Homepage hero video</label>
        {form.heroVideoUrl && (
          <div style={{ width: "100%", maxWidth: 360, aspectRatio: "16/8", borderRadius: 6, marginBottom: 10, border: "1px solid var(--line)", overflow: "hidden", position: "relative", background: "#0d1526" }}>
            <HeroVideo videoUrl={form.heroVideoUrl} />
          </div>
        )}
        <input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={handleVideoUpload} disabled={videoUploading} style={{ marginBottom: 8 }} />
        {videoUploading && <p style={{ fontSize: 13, color: "var(--ink-soft)" }}>Uploading video… this can take a minute for larger files.</p>}
        <input
          value={form.heroVideoUrl}
          onChange={(e) => setForm({ ...form, heroVideoUrl: e.target.value })}
          placeholder="Or paste a YouTube, Vimeo, or direct video link instead"
        />
        <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: "0 0 14px" }}>
          Upload a file (MP4/WEBM/MOV, up to 300MB) OR paste a link — not both. A pasted link can be a regular YouTube/Vimeo page link or a direct video file URL; it fills the frame automatically either way.
        </p>

        <label>Contact email</label>
        <input
          type="email"
          value={form.contactEmail}
          onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
          placeholder="you@yourdomain.com"
        />
      </div>

      {/* Membership contact channels — no self-serve payment, admin speaks
          with every applicant first. These links power the Access
          Membership flow's Email/WhatsApp/Telegram buttons. */}
      <div className="card" style={{ maxWidth: 560, marginBottom: 24 }}>
        <h3 style={{ marginBottom: 6, fontSize: 17 }}>Membership contact channels</h3>
        <p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 14 }}>
          When someone clicks "Get Access" and picks a channel, they're sent here with an intro message pre-filled. Leave a field blank to hide that option.
        </p>
        <label>WhatsApp link</label>
        <input
          value={form.whatsappLink}
          onChange={(e) => setForm({ ...form, whatsappLink: e.target.value })}
          placeholder="https://wa.me/15551234567"
        />
        <label>Telegram link</label>
        <input
          value={form.telegramLink}
          onChange={(e) => setForm({ ...form, telegramLink: e.target.value })}
          placeholder="https://t.me/yourusername"
        />
        <label>Intro message</label>
        <textarea
          rows={3}
          value={form.membershipMessageTemplate}
          onChange={(e) => setForm({ ...form, membershipMessageTemplate: e.target.value })}
          placeholder="Hi, I'm interested in joining the membership. My name is {name}."
        />
        <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: "4px 0 0" }}>
          Use <code>{"{name}"}</code> anywhere you want their name inserted. This is the message that's pre-filled when they reach out. Email uses the Contact email field above — no separate link needed for that one.
        </p>
      </div>

      {/* Premium subscription page */}
      <div className="card" style={{ maxWidth: 560, marginBottom: 24, borderColor: "rgba(240,195,116,0.4)" }}>
        <h3 style={{ marginBottom: 6, fontSize: 17 }}>Premium subscription page</h3>
        <p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 14 }}>
          Controls the /pricing page — the price shown, the comparison bullets, and the closing pitch.
        </p>

        <label>Price to display</label>
        <input
          value={form.subscriptionPriceLabel}
          onChange={(e) => setForm({ ...form, subscriptionPriceLabel: e.target.value })}
          placeholder="$9.99/mo"
        />
        <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: "-8px 0 14px" }}>
          Just the text shown on the button and page — set the real Stripe price separately above.
        </p>

        <label>Regular member benefits</label>
        <textarea
          rows={3}
          value={(form.subscriptionBenefitsRegular || []).join("\n")}
          onChange={(e) => setForm({ ...form, subscriptionBenefitsRegular: e.target.value.split("\n") })}
        />
        <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: "-8px 0 14px" }}>One benefit per line.</p>

        <label>Premium member benefits</label>
        <textarea
          rows={4}
          value={(form.subscriptionBenefitsPremium || []).join("\n")}
          onChange={(e) => setForm({ ...form, subscriptionBenefitsPremium: e.target.value.split("\n") })}
        />
        <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: "-8px 0 14px" }}>One benefit per line.</p>

        <label>Closing pitch (shown above the subscribe button)</label>
        <textarea
          rows={2}
          value={form.subscriptionCtaText}
          onChange={(e) => setForm({ ...form, subscriptionCtaText: e.target.value })}
        />
      </div>

      <button className="btn btn-primary" onClick={save}>Save changes</button>
    </div>
  );
}

export default function AdminSitePage() {
  return (
    <RequireAdmin>
      <div className="admin-shell">
        <AdminNav />
        <AdminSite />
      </div>
    </RequireAdmin>
  );
}
