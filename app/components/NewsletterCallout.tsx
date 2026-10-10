"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export function NewsletterCallout() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email) return;
    try {
      localStorage.setItem("briefly-newsletter-subscriber", email);
    } catch {
      // ignore
    }
    setSubmitted(true);
  };

  return (
    <section
      className="my-16 bg-white border border-editorial-border rounded-2xl p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-sm"
      data-purpose="newsletter-signup"
    >
      <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-editorial-accent mb-2 block">
        Direct to your inbox
      </span>
      <h3 className="font-serif text-3xl sm:text-4xl font-bold text-editorial-charcoal mb-3 tracking-tight">
        The 7:00 AM World Intelligence Brief
      </h3>
      <p className="text-sm text-editorial-muted max-w-lg mx-auto mb-6">
        No clickbait. No automated spam. Just the verified signals shaping
        finance, geopolitics, and technology each morning.
      </p>

      {submitted ? (
        <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs font-semibold text-emerald-800">
          <Check size={16} className="text-emerald-600" />
          <span>Subscribed with {email}. Look out for the morning brief!</span>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your work email address"
            required
            className="w-full text-xs px-4 py-3 rounded-xl border border-editorial-border focus:ring-1 focus:ring-editorial-charcoal focus:border-editorial-charcoal text-editorial-charcoal placeholder:text-editorial-muted bg-white"
          />
          <button
            type="submit"
            className="w-full sm:w-auto whitespace-nowrap text-xs font-semibold px-6 py-3 rounded-xl bg-editorial-charcoal text-white hover:bg-black transition shadow-sm"
          >
            Get Free Brief
          </button>
        </form>
      )}

      <span className="text-[10px] text-editorial-muted mt-3 block">
        Unsubscribe in one click. Respecting your privacy since day one.
      </span>
    </section>
  );
}

