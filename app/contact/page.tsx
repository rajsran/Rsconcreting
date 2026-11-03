"use client";

import { useState } from "react";
import { Phone, MapPin, Clock, Instagram, Send, CheckCircle } from "lucide-react";

const services = ["Concreting", "Landscaping", "Decking", "Fencing", "Retaining Walls", "Other"];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", service: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please call us instead.");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please call us instead.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-violet-600 text-sm font-semibold tracking-widest uppercase mb-3">Get In Touch</p>
          <h1 className="font-display font-black text-5xl md:text-6xl text-ink-900 mb-4">Contact Us</h1>
          <p className="text-ink-500 text-lg max-w-2xl">
            Ready for a free quote? Drop us a message or give us a call and we&apos;ll get back to you fast.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-[1fr_1.5fr] gap-12">
          {/* Info */}
          <div>
            <h2 className="font-display font-bold text-2xl text-ink-900 mb-8">Contact Details</h2>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <p className="text-ink-300 text-xs uppercase tracking-widest mb-1">Phone</p>
                  <a href="tel:0476863201" className="text-ink-900 font-semibold hover:text-violet-600 transition-colors block">0476 863 201</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <p className="text-ink-300 text-xs uppercase tracking-widest mb-1">Service Area</p>
                  <p className="text-ink-900 font-semibold">Melbourne Surrounding Suburbs</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <p className="text-ink-300 text-xs uppercase tracking-widest mb-1">Business Hours</p>
                  <p className="text-ink-900 font-semibold">Monday – Friday</p>
                  <p className="text-ink-500">8:00 am – 4:00 pm</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0">
                  <Instagram className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <p className="text-ink-300 text-xs uppercase tracking-widest mb-1">Instagram</p>
                  <a href="https://www.instagram.com/rsconcreting/" target="_blank" rel="noopener noreferrer" className="text-ink-900 font-semibold hover:text-violet-600 transition-colors">@rsconcreting</a>
                </div>
              </li>
            </ul>

          </div>

          {/* Form */}
          <div className="bg-white border border-gray-100 rounded-3xl shadow-card-lg p-8 md:p-10">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-violet-50 border border-violet-100 flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-violet-600" />
                </div>
                <h3 className="font-display font-bold text-2xl text-ink-900 mb-2">Message Sent!</h3>
                <p className="text-ink-400 max-w-xs">
                  Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <>
                <h2 className="font-display font-bold text-2xl text-ink-900 mb-8">Request a Free Quote</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-ink-400 text-xs uppercase tracking-widest mb-2">Your Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="John Smith"
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-ink-900 text-sm placeholder:text-ink-200 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-ink-400 text-xs uppercase tracking-widest mb-2">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="0400 000 000"
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-ink-900 text-sm placeholder:text-ink-200 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-ink-400 text-xs uppercase tracking-widest mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-ink-900 text-sm placeholder:text-ink-200 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-ink-400 text-xs uppercase tracking-widest mb-2">Service Required *</label>
                    <select
                      name="service"
                      required
                      value={form.service}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-ink-900 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all appearance-none"
                    >
                      <option value="" disabled>Select a service…</option>
                      {services.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-ink-400 text-xs uppercase tracking-widest mb-2">Message</label>
                    <textarea
                      name="message"
                      rows={4}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Describe your project or ask a question…"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-ink-900 text-sm placeholder:text-ink-200 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all resize-none"
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-violet-600 text-white font-semibold rounded-xl text-sm shadow-violet hover:bg-violet-700 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {sending ? "Sending…" : "Send Message"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
