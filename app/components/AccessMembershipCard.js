"use client";
import { useState } from "react";
import { api } from "@/lib/api";

// A membership is granted only after the admin personally speaks with the
// applicant — there is no self-serve checkout anywhere in this flow.
// Step 1: pick a channel (Email / WhatsApp / Telegram), configured by the
// admin. Step 2: a confirmation gate before sending them off, since this
// commits them to actually reaching out. Step 3: redirect with a
// pre-filled message so they don't have to type the intro themselves.
export default function AccessMembershipCard({ settings, userName, leadId }) {
  const [step, setStep] = useState(null); // null | "channel" | "confirm"
  const [channel, setChannel] = useState(null);

  const contactEmail = settings?.contactEmail || "";
  const whatsappLink = settings?.whatsappLink || "";
  const telegramLink = settings?.telegramLink || "";

  const template = settings?.membershipMessageTemplate || "Hi, I'm interested in joining the membership. My name is {name}.";
  const message = userName ? template.replace("{name}", userName) : template.replace("{name}", "").replace(/\s+\./, ".").trim();

  function closeAll() {
    setStep(null);
    setChannel(null);
  }

  function chooseChannel(c) {
    setChannel(c);
    setStep("confirm");
  }

  function confirmAndGo() {
    let url = "";
    if (channel === "email") {
      const subject = encodeURIComponent("Membership Interest");
      const body = encodeURIComponent(message);
      url = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    } else if (channel === "whatsapp") {
      url = appendQueryParam(whatsappLink, "text", message);
    } else if (channel === "telegram") {
      url = appendQueryParam(telegramLink, "text", message);
    }
    // Open first, synchronously, so the browser's popup blocker still sees
    // this as a direct response to the click — then log it in the
    // background. A failed log shouldn't stop them from reaching out.
    if (url) window.open(url, "_blank");
    if (leadId) {
      api(`/api/leads/${leadId}/request-access`, {
        method: "PATCH",
        body: JSON.stringify({ channel }),
      }).catch(() => {});
    }
    closeAll();
  }

  const channelAvailable = {
    email: !!contactEmail,
    whatsapp: !!whatsappLink,
    telegram: !!telegramLink,
  };

  return (
    <>
      <div className="membership-card">
        <h3>This Club Isn&apos;t For Everyone.</h3>
        <p>
          The Foundry Club is built for men who take construction, real estate, and business seriously.
          If you&apos;ve decided this is the room you want to be in, reach out to complete your enrollment.
          Get in touch only when you&apos;re ready to join.
        </p>
        <button className="btn btn-primary" onClick={() => setStep("channel")}>
          GET ACCESS →
        </button>
      </div>

      {step === "channel" && (
        <div className="access-modal-backdrop" onClick={closeAll}>
          <div className="access-modal" onClick={(e) => e.stopPropagation()}>
            <h4>How Would You Like To Reach Out?</h4>
            <p className="sub">Pick a channel — we&apos;ll open it with your message ready to send.</p>
            <div className="channel-list">
              <button className="btn btn-outline" disabled={!channelAvailable.email} onClick={() => chooseChannel("email")}>
                Email
              </button>
              <button className="btn btn-outline" disabled={!channelAvailable.whatsapp} onClick={() => chooseChannel("whatsapp")}>
                WhatsApp
              </button>
              <button className="btn btn-outline" disabled={!channelAvailable.telegram} onClick={() => chooseChannel("telegram")}>
                Telegram
              </button>
            </div>
            <button className="cancel-link" onClick={closeAll}>Cancel</button>
          </div>
        </div>
      )}

      {step === "confirm" && (
        <div className="access-modal-backdrop" onClick={closeAll}>
          <div className="access-modal" onClick={(e) => e.stopPropagation()}>
            <h4>Ready To Become A Member?</h4>
            <p className="sub">We&apos;ll open {channel === "email" ? "your email app" : channel} with an intro message ready to go.</p>
            <div className="confirm-list">
              <button className="btn btn-primary" onClick={confirmAndGo}>Yes, I&apos;m Ready</button>
              <button className="btn btn-outline" onClick={closeAll}>Not Ready Yet</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function appendQueryParam(baseUrl, key, value) {
  if (!baseUrl) return "";
  try {
    const url = new URL(baseUrl);
    url.searchParams.set(key, value);
    return url.toString();
  } catch {
    // Not a valid absolute URL — fall back to naive concatenation.
    const sep = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${sep}${key}=${encodeURIComponent(value)}`;
  }
}
