"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import HeroVideo from "./components/HeroVideo";

export default function HomePage() {
  const [settings, setSettings] = useState(null);
  const [hideWidget, setHideWidget] = useState(false);
  const videoSectionRef = useRef(null);
  const pricingSectionRef = useRef(null);
  const finalCtaRef = useRef(null);

  useEffect(() => {
    api("/api/settings").then((d) => setSettings(d.settings)).catch(() => {});
  }, []);

  // Hide the floating "Get In" widget while the video, pricing, or final
  // CTA sections are on screen — those sections already have their own
  // strong call to action, so the floating one would be redundant there.
  useEffect(() => {
    const targets = [videoSectionRef.current, pricingSectionRef.current, finalCtaRef.current].filter(Boolean);
    if (targets.length === 0) return;

    const visible = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        });
        setHideWidget(visible.size > 0);
      },
      { threshold: 0.25 }
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  const contactEmail = settings?.contactEmail || "support@withthefoundry.io";

  return (
    <div className="foundry-home">

      {/* HERO */}
      <section className="hero">
        <div className="wrap">
          <div className="hero-logo">THE FOUNDRY<span className="sub">NETWORK</span></div>
          <div className="hero-rule"></div>
          <div className="hero-tag">
            ESTABLISHED 2026 &nbsp;|&nbsp; JWALLER CLUB<br />
            <span style={{ display: "inline-block", marginTop: 8 }}>CONSTRUCTION · REAL ESTATE</span>
          </div>
          <h1>
            {settings?.heroHeadline || "Built For Men Who Build Real Businesses."}
          </h1>
          <p className="hero-sub">
            {settings?.heroSubheadline ||
              "A private network of construction and real estate operators. Rooms built around the work you actually do."}
          </p>
          <div className="hero-media" ref={videoSectionRef}>
            {settings && <HeroVideo videoUrl={settings.heroVideoUrl} />}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="cta-band" id="join">
        <Link href="/apply" className="btn btn-primary">GET ACCESS →</Link>
        <div className="rule-fade"></div>
        <div className="stat-line">4,000+ operators &nbsp;·&nbsp; 2 categories &nbsp;·&nbsp; answers in hours, not days</div>
      </section>

      {/* PAIN */}
      <section className="section">
        <div className="wrap">
          <h2>You&apos;re Not Alone Anymore.</h2>
          <p className="lead">Your friends don&apos;t run crews or chase closings. They don&apos;t carry payroll through a slow February, eat a bid they underpriced, or sit on a piece of land waiting for it to make sense. So when it gets hard you&apos;re guessing, or you&apos;re taking advice from someone who has never done it.</p>
          <div className="pain-grid">
            <div className="pain-card"><div className="num">01</div><h3>No One To Ask</h3></div>
            <div className="pain-card"><div className="num">02</div><h3>No One To Compare Against</h3></div>
            <div className="pain-card"><div className="num">03</div><h3>No One Who&apos;s Already Been There</h3></div>
          </div>
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section className="section">
        <div className="wrap">
          <h2 style={{ marginBottom: 36 }}>What&apos;s Inside</h2>
          <div className="inside-grid">
            <div className="inside-card"><h3>Two Categories.</h3><p>Construction and Real Estate. Pick your side, or run both.</p></div>
            <div className="inside-card"><h3>Rooms For The Work You Do.</h3><p>Wholesaling, land flipping, short term rentals, blue collar construction, getting your first deal done. Rooms open as the network grows, so the map follows the members.</p></div>
            <div className="inside-card"><h3>Rooms At Every Level.</h3><p>This isn&apos;t only for guys getting started. Some members are placing multimillion dollar deals and carrying portfolios past fifty million. There are rooms at that altitude too, and the people in them are reachable.</p></div>
            <div className="inside-card"><h3>Sales And Lead Generation.</h3><p>The skill both sides need and neither gets taught. Lead flow, follow up, handling the call, and walking a customer up instead of selling him once.</p></div>
            <div className="inside-card"><h3>Coach Rooms.</h3><p>Live weekly sessions with operators running real volume, plus the recordings.</p></div>
            <div className="inside-card"><h3>The Vault.</h3><p>Guides, templates, quotes, contracts, and every past mastermind recording.</p></div>
          </div>
        </div>
      </section>

      {/* IS THIS FOR YOU */}
      <section className="section">
        <div className="wrap">
          <h2 style={{ marginBottom: 36 }}>Is This For You?</h2>
          <div className="fit-grid">
            <div className="fit-card for">
              <h3>For</h3>
              <ul>
                <li>Contractors and subs doing real work who want to run it like a business</li>
                <li>Operators stuck under $500K who want a path past it</li>
                <li>Real estate guys doing their first deals or scaling into land and development</li>
                <li>Established operators who want deal flow and peers at their own level</li>
              </ul>
            </div>
            <div className="fit-card not">
              <h3>Not For</h3>
              <ul>
                <li>Anyone tired of being the smartest person in a room that doesn&apos;t build anything</li>
                <li>People looking for a get rich scheme</li>
                <li>People who won&apos;t post, ask, or show up</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section pricing-wrap" id="pricing" ref={pricingSectionRef}>
        <h2>Two Ways In</h2>
        <p className="lead" style={{ margin: "0 auto" }}>Same network. Pick how you pay.</p>

        <div className="pricing-grid">
          <div className="price-card yearly">
            <span className="best-badge">Best Value</span>
            <div className="plan-label">Yearly</div>
            <div className="amount">$375</div>
            <div className="amount-note">$31.25/mo · save $69 · auto-renews annually</div>
            <p style={{ fontSize: 14, color: "var(--ink-soft)", marginBottom: 14 }}>Everything in monthly, plus:</p>
            <ul>
              <li>Every downloadable guide in the Vault, free</li>
              <li>Full past mastermind recording archive, free</li>
            </ul>
            <Link href="/apply" className="btn btn-primary">Start Yearly</Link>
          </div>
          <div className="price-card monthly">
            <div className="plan-label">Month To Month</div>
            <div className="amount">$37</div>
            <div className="amount-note">Billed monthly. Cancel anytime.</div>
            <p style={{ fontSize: 14, color: "var(--ink-soft)", marginBottom: 14 }}>Full network access.</p>
            <Link href="/apply" className="btn btn-outline">Start Monthly</Link>
          </div>
        </div>
      </section>

      {/* NARRATIVE */}
      <section className="narrative">
        <div className="wrap">
          <h2>Why The Foundry</h2>
          <div className="narrative-rule"></div>
          <div>
            <p>A foundry melts iron, steel, and aluminum down and pours it into a mold. What comes out is a solid part, something that holds weight. It goes into a building, a bridge, a machine. It doesn&apos;t evaporate when the market turns.</p>
            <p>That&apos;s the business you&apos;re in. Concrete, steel, dirt, roofs and doors. Land, contracts, closings, and the buildings they become. <strong>Real assets.</strong> One day is a jobsite in July, the next is a title company, a lender, and a seller who won&apos;t call you back. Different work, same grind, and the number on paper is always the easy part.</p>
            <p>Most of the internet sells you the opposite: heat with no mold. Motivation that cools into nothing.</p>
            <p>The Foundry is the mold. The raw material is you, a guy with a truck, a license, a first deal, or a portfolio you already built. The heat is the work: the bids, the calls, the offers, the reps. The mold is the structure. Operators who have already poured what you&apos;re pouring, rooms built around the work instead of around theory, and answers in hours instead of days.</p>
          </div>

          <div className="process-line">
            <div className="process-step">
              <div className="process-dot"></div>
              <div className="label">Ore</div>
              <p>A license, a truck, a first offer.</p>
            </div>
            <div className="process-step">
              <div className="process-dot"></div>
              <div className="label">Heat</div>
              <p>The bids, the deals, the reps.</p>
            </div>
            <div className="process-step">
              <div className="process-dot"></div>
              <div className="label">Cast</div>
              <p>Something that holds weight.</p>
            </div>
          </div>

          <div className="narrative-close">This Is Where It Sets.</div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ marginBottom: 30 }}>Questions</h2>

        <div>
          <details className="faq-item">
            <summary>What Do I Actually Get?</summary>
            <div className="a">Access to the full private network: rooms built around the work you do, live weekly coach sessions with operators running real volume plus every recording, and The Vault, which holds guides, templates, quotes, and contracts you can use on your own jobs and deals. You post a question and people who have already done that work answer it.</div>
          </details>
          <details className="faq-item">
            <summary>Is This A Course?</summary>
            <div className="a">No. A course is something you watch. This is a room you work in. There are recordings and materials in The Vault, but the value is the operators in here and the answers you get from them, not a video library you&apos;ll never finish.</div>
          </details>
          <details className="faq-item">
            <summary>I Already Run A Real Business. Is This Beneath Me?</summary>
            <div className="a">No. Some members are placing multimillion dollar deals and carrying portfolios past fifty million, and there are rooms built for that level. The price is low because the network is large, not because the ceiling is. If you want peers at your altitude and deal flow you can actually act on, that exists in here.</div>
          </details>
          <details className="faq-item">
            <summary>How Much Time Does It Take?</summary>
            <div className="a">As much or as little as you want. Most guys check in a few times a week, ask what they&apos;re stuck on, and show up to the sessions that apply to them. There&apos;s no curriculum to keep up with and nothing to fall behind on.</div>
          </details>
          <details className="faq-item">
            <summary>Can I Cancel?</summary>
            <div className="a">Yes. Monthly is month to month, so cancel anytime and you keep access through the period you paid for. Yearly runs a full year and auto-renews, and you can cancel before it renews.</div>
          </details>
          <details className="faq-item">
            <summary>How Do I Get In After I Pay?</summary>
            <div className="a">Immediately. The invite appears on screen the second your payment goes through, and it&apos;s emailed to you as well. If you lose it, the email is your backup.</div>
          </details>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta" ref={finalCtaRef}>
        <div className="final-rule"></div>
        <h2>Stop Guessing.<br />Get In The Room.</h2>
        <Link href="/apply" className="btn btn-primary">GET ACCESS →</Link>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-mark">F</div>
        <div className="footer-links">
          <a href="https://withthefoundry.io/terms">Terms</a>
          <a href="https://withthefoundry.io/privacy">Privacy</a>
          <a href="https://withthefoundry.io/refunds">Refunds</a>
          <a href="https://withthefoundry.io/member-agreement">Member Agreement</a>
        </div>
        <div className="footer-email">{contactEmail}</div>
        <div className="footer-copy">© 2026 The Foundry Network</div>
        <p className="footer-disclaimer">Earnings disclaimer: results are not typical or guaranteed; nothing here is financial or investment advice.</p>
      </footer>

      {/* FLOATING STICKY WIDGET */}
      <div className={`float-widget${hideWidget ? " is-hidden" : ""}`}>
        <div>
          <div className="price">{settings?.subscriptionPriceLabel || "$37/mo"}</div>
          <div className="sub">by application only</div>
        </div>
        <Link href="/apply" className="btn btn-primary">GET IN</Link>
      </div>

    </div>
  );
}
