"use client";

import { useState, useEffect, useRef } from "react";
import {
  X, Hammer, Leaf, Layers, ShieldCheck,
  ChevronRight, Phone, CheckCircle2,
  MessageCircle, Ruler, Calendar, User, Sparkles, Loader2,
} from "lucide-react";
import { PRICING, calcEstimate, formatSize, unitFor } from "@/lib/pricing";

// ─── Types ────────────────────────────────────────────────────────────────────
type Step = "details" | "service" | "type" | "size" | "timeline" | "quote";

interface Answers {
  name?: string;
  phone?: string;
  email?: string;
  postcode?: string;
  suburb?: string;
  service?: string;
  type?: string;
  size?: string;
  timeline?: string;
}

export interface QuoteChatProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Step Options ─────────────────────────────────────────────────────────────
const SERVICE_OPTIONS = [
  { label: "Concreting",             Icon: Hammer,      desc: "Driveways, slabs, paths & more" },
  { label: "Landscaping",            Icon: Leaf,        desc: "Gardens, turf & paving" },
  { label: "Architectural Concrete", Icon: Sparkles,    desc: "Floating steps & bench tops" },
  { label: "Decking",                Icon: Layers,      desc: "Timber & composite decks" },
  { label: "Fencing",                Icon: ShieldCheck, desc: "Colorbond, timber & glass" },
];

const TYPE_OPTIONS: Record<string, { label: string; desc: string; enquiry?: boolean }[]> = Object.fromEntries(
  Object.entries(PRICING).map(([service, types]) => [
    service,
    Object.entries(types).map(([label, p]) => ({
      label,
      desc: p.enquiry ? "Contact for pricing" : `$${p.low}–$${p.high} / ${p.unit}`,
      enquiry: p.enquiry,
    })),
  ])
);

const TIMELINE_OPTIONS = [
  { label: "ASAP — within 2 weeks", desc: "Urgent, ready to start now" },
  { label: "Next month",            desc: "Getting things organised" },
  { label: "1–3 months away",       desc: "Planning ahead" },
  { label: "Just exploring",        desc: "No rush, comparing options" },
];

const STEP_ORDER: Step[] = ["details", "service", "type", "size", "timeline", "quote"];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function QuoteChat({ isOpen, onClose }: QuoteChatProps) {
  const [step, setStep]         = useState<Step>("details");
  const [answers, setAnswers]   = useState<Answers>({});
  const [customText, setCustomText] = useState("");
  const [submittedRef]              = useState({ value: false });

  // Details form state
  const [detailsForm, setDetailsForm] = useState({ name: "", phone: "", email: "", postcode: "" });
  const [detailsErrors, setDetailsErrors] = useState<Partial<Record<keyof typeof detailsForm, string>>>({});
  const [suburbs,       setSuburbs]       = useState<string[]>([]);
  const [suburb,        setSuburb]        = useState("");
  const [suburbLoading, setSuburbLoading] = useState(false);
  const [suburbError,   setSuburbError]   = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setStep("details");
      setAnswers({});
      setCustomText("");
      setDetailsForm({ name: "", phone: "", email: "", postcode: "" });
      setDetailsErrors({});
      setSuburbs([]);
      setSuburb("");
      setSuburbLoading(false);
      setSuburbError(false);
      submittedRef.value = false;
    }
  }, [isOpen]);

  // Fetch suburbs when postcode reaches 4 digits
  useEffect(() => {
    if (detailsForm.postcode.length !== 4) {
      setSuburbs([]);
      setSuburb("");
      return;
    }
    let cancelled = false;
    setSuburbLoading(true);
    fetch(`/api/suburb?postcode=${detailsForm.postcode}`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        const list: string[] = data.suburbs ?? [];
        setSuburbs(list);
        if (list.length === 1) setSuburb(list[0]);
      })
      .catch(() => { if (!cancelled) setSuburbs([]); })
      .finally(() => { if (!cancelled) setSuburbLoading(false); });
    return () => { cancelled = true; };
  }, [detailsForm.postcode]);

  const scrollTop = () =>
    setTimeout(() => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 60);

  const validateDetails = () => {
    const errs: typeof detailsErrors = {};
    if (!detailsForm.name.trim()) errs.name = "Required";
    if (!detailsForm.phone.trim()) errs.phone = "Required";
    if (!detailsForm.email.trim()) errs.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(detailsForm.email)) errs.email = "Invalid email";
    if (!detailsForm.postcode.trim()) errs.postcode = "Required";
    setDetailsErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submitDetails = () => {
    if (!validateDetails()) return;
    if (suburbs.length > 1 && !suburb) {
      setSuburbError(true);
      setTimeout(() => setSuburbError(false), 600);
      return;
    }
    setAnswers(prev => ({ ...prev, ...detailsForm, suburb: suburb || undefined }));
    setStep("service");
    scrollTop();
  };

  const advance = (key: keyof Answers, value: string) => {
    const next: Answers = { ...answers, [key]: value };
    setAnswers(next);
    setCustomText("");
    scrollTop();

    if (key === "timeline") {
      finishQuote(next);
      return;
    }

    // Skip size step for enquiry types (e.g. Architectural Bench Top)
    if (key === "type" && PRICING[next.service ?? ""]?.[value]?.enquiry) {
      setStep("timeline");
      return;
    }

    const nextMap: Partial<Record<keyof Answers, Step>> =
      { service: "type", type: "size", size: "timeline" };

    const nextStep = nextMap[key];
    if (nextStep) setStep(nextStep);
  };

  const finishQuote = (final: Answers) => {
    setStep("quote");
    // Fire-and-forget — quote is calculated client-side, no need to wait
    fetch("/api/quote/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(final),
    })
      .then(() => { submittedRef.value = true; })
      .catch(() => {});
  };

  const isLinear  = unitFor(answers) === "lm";
  const isSteps   = PRICING[answers.service ?? ""]?.[answers.type ?? ""]?.unit === "step";
  const isEnquiry = PRICING[answers.service ?? ""]?.[answers.type ?? ""]?.enquiry === true;
  const typeOpts  = answers.service ? (TYPE_OPTIONS[answers.service] ?? []) : [];
  const estimate  = calcEstimate(answers);
  const progress  = Math.round((STEP_ORDER.indexOf(step) / (STEP_ORDER.length - 1)) * 100);
  const firstName = answers.name?.split(" ")[0] ?? "";

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal panel */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden w-full max-w-[420px] pointer-events-auto"
          style={{ height: "min(92vh, 720px)", maxHeight: "calc(100vh - 2rem)" }}
        >
          {/* ── Header ── */}
          <div className="bg-ink-900 px-5 pt-4 pb-3 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-tight">Free Quote — 30 Seconds</p>
                  <p className="text-white/50 text-[11px]">RS Concreting · Melbourne Suburbs</p>
                </div>
              </div>
              <button onClick={onClose} className="text-white/50 hover:text-white p-1 transition-colors" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            {step !== "quote" && (
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div
                  className="bg-violet-400 h-1.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>

          {/* ── Scrollable body ── */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50 space-y-2.5">

            {/* ══ DETAILS ══ */}
            {step === "details" && (
              <form className="flex flex-col gap-3" onSubmit={e => { e.preventDefault(); submitDetails(); }}>
                <div className="mb-1">
                  <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center mb-2">
                    <User className="w-4 h-4 text-violet-600" />
                  </div>
                  <h3 className="font-bold text-ink-900 text-[1rem] leading-snug">Your details</h3>
                  <p className="text-ink-400 text-xs mt-1">Fill in your info and we&apos;ll get you a quote in seconds</p>
                </div>

                <div className="flex flex-col gap-2.5">
                  <div>
                    <label className="text-ink-600 text-xs font-semibold mb-1 block">Full Name</label>
                    <input
                      type="text"
                      value={detailsForm.name}
                      onChange={e => setDetailsForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. John Smith"
                      autoFocus
                      className={`w-full bg-white border rounded-2xl px-4 py-3 text-sm text-ink-900 placeholder-ink-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all ${detailsErrors.name ? "border-red-400" : "border-gray-200"}`}
                    />
                    {detailsErrors.name && <p className="text-red-500 text-xs mt-1">{detailsErrors.name}</p>}
                  </div>

                  <div>
                    <label className="text-ink-600 text-xs font-semibold mb-1 block">Mobile Number</label>
                    <input
                      type="tel"
                      value={detailsForm.phone}
                      onChange={e => setDetailsForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="e.g. 0412 345 678"
                      className={`w-full bg-white border rounded-2xl px-4 py-3 text-sm text-ink-900 placeholder-ink-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all ${detailsErrors.phone ? "border-red-400" : "border-gray-200"}`}
                    />
                    {detailsErrors.phone && <p className="text-red-500 text-xs mt-1">{detailsErrors.phone}</p>}
                  </div>

                  <div>
                    <label className="text-ink-600 text-xs font-semibold mb-1 block">Email Address</label>
                    <input
                      type="email"
                      value={detailsForm.email}
                      onChange={e => setDetailsForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="e.g. john@example.com"
                      className={`w-full bg-white border rounded-2xl px-4 py-3 text-sm text-ink-900 placeholder-ink-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all ${detailsErrors.email ? "border-red-400" : "border-gray-200"}`}
                    />
                    {detailsErrors.email && <p className="text-red-500 text-xs mt-1">{detailsErrors.email}</p>}
                  </div>

                  <div>
                    <label className="text-ink-600 text-xs font-semibold mb-1 block">Postcode</label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={detailsForm.postcode}
                        onChange={e => {
                          setSuburb("");
                          setDetailsForm(f => ({ ...f, postcode: e.target.value.replace(/\D/g, "").slice(0, 4) }));
                        }}
                        placeholder="e.g. 3335"
                        className={`w-full bg-white border rounded-2xl px-4 py-3 text-sm text-ink-900 placeholder-ink-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all ${detailsErrors.postcode ? "border-red-400" : "border-gray-200"}`}
                      />
                      {suburbLoading && (
                        <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400 animate-spin" />
                      )}
                    </div>
                    {detailsErrors.postcode && <p className="text-red-500 text-xs mt-1">{detailsErrors.postcode}</p>}
                  </div>

                  {suburbs.length > 1 && (
                    <div className={`flex flex-col gap-1.5 transition-all ${suburbError ? "animate-pulse" : ""}`}>
                      <p className={`text-[11px] px-1 font-semibold transition-colors ${suburbError ? "text-red-500" : "text-ink-400"}`}>
                        {suburbError ? "Please select your suburb to continue" : "Select your suburb"}
                      </p>
                      <div className={`flex flex-wrap gap-2 rounded-xl p-2 transition-all ${suburbError ? "border-2 border-red-400 bg-red-50" : ""}`}>
                        {suburbs.map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => { setSuburb(s); setSuburbError(false); }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                              suburb === s
                                ? "bg-violet-600 text-white border-violet-600"
                                : suburbError
                                  ? "bg-white text-red-700 border-red-300 hover:border-red-500"
                                  : "bg-white text-ink-700 border-gray-200 hover:border-violet-400 hover:text-violet-700"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {suburbs.length === 1 && (
                    <p className="text-xs text-violet-600 font-semibold px-1">📍 {suburbs[0]}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-violet-600 text-white font-bold rounded-2xl text-sm hover:bg-violet-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-1"
                >
                  Get My Quote <ChevronRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* ══ SERVICE ══ */}
            {step === "service" && (
              <Step q="What service do you need?" sub="Tap any option — we'll give you a price in seconds ⚡">
                {SERVICE_OPTIONS.map(({ label, Icon, desc }) => (
                  <OptionBtn
                    key={label}
                    label={label}
                    desc={desc}
                    icon={<Icon className="w-5 h-5 text-violet-600" />}
                    onClick={() => advance("service", label)}
                  />
                ))}
              </Step>
            )}

            {/* ══ TYPE ══ */}
            {step === "type" && (
              <Step q={`What type of ${answers.service?.toLowerCase()}?`} sub="Choose the finish that suits your project">
                {typeOpts.map(({ label, desc }) => (
                  <OptionBtn key={label} label={label} desc={desc} onClick={() => advance("type", label)} />
                ))}
                <NotSure onClick={() => advance("type", `Standard ${answers.service}`)} />
              </Step>
            )}

            {/* ══ SIZE ══ */}
            {step === "size" && (
              <Step
                q={isSteps ? "How many steps?" : isLinear ? "How long is the project?" : "How large is the area?"}
                sub={isSteps ? "Enter the number of steps — we'll estimate $1,500–$2,000 per step" : isLinear ? "Enter the total length in metres" : "Enter the total area in square metres"}
                icon={<Ruler className="w-4 h-4 text-violet-600" />}
              >
                <TextInput
                  inputRef={inputRef}
                  type="number"
                  value={customText}
                  placeholder={isSteps ? "e.g. 3" : isLinear ? "e.g. 28" : "e.g. 45"}
                  onChange={(v) => setCustomText(v.replace(/[^0-9]/g, ""))}
                  onEnter={() => customText.trim() && advance("size", customText.trim())}
                  onSubmit={() => customText.trim() && advance("size", customText.trim())}
                  submitLabel="Continue"
                />
                {!isSteps && <NotSure label="Not sure — measure on-site" onClick={() => advance("size", "To be measured on-site")} />}
              </Step>
            )}

            {/* ══ TIMELINE ══ */}
            {step === "timeline" && (
              <Step q="When do you want to start?" sub="Helps us plan your job in our schedule" icon={<Calendar className="w-4 h-4 text-violet-600" />}>
                {TIMELINE_OPTIONS.map(({ label, desc }) => (
                  <OptionBtn key={label} label={label} desc={desc} onClick={() => advance("timeline", label)} />
                ))}
                <NotSure label="Flexible / Not sure yet" onClick={() => advance("timeline", "Flexible")} />
              </Step>
            )}

            {/* ══ QUOTE RESULT ══ */}
            {step === "quote" && (
              <div className="flex flex-col gap-3 pb-2">
                <>
                    <div className="bg-gradient-to-br from-violet-600 to-violet-700 rounded-2xl p-5 text-center text-white">
                      <CheckCircle2 className="w-10 h-10 text-violet-300 mx-auto mb-2" />
                      <p className="font-black text-lg leading-tight">
                        {firstName ? `${firstName}, your quote is ready!` : "Your quote is ready!"}
                      </p>
                      <p className="text-violet-300 text-xs mt-1">Based on your selections below</p>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-sm divide-y divide-gray-100">
                      {[
                        { label: "Location", value: answers.suburb ? `${answers.suburb} ${answers.postcode}` : answers.postcode },
                        { label: "Service",  value: answers.type || answers.service },
                        { label: "Size",     value: formatSize(answers) },
                        { label: "Timeline", value: answers.timeline },
                      ].filter(r => r.value && r.value !== "Not provided").map(({ label, value }) => (
                        <div key={label} className="flex justify-between items-center py-2 first:pt-0 last:pb-0">
                          <span className="text-ink-400 text-xs">{label}</span>
                          <span className="text-ink-900 text-sm font-semibold text-right max-w-[58%] leading-snug">{value}</span>
                        </div>
                      ))}
                    </div>

                    {isEnquiry ? (
                      <div className="bg-ink-900 rounded-2xl p-5 text-center">
                        <p className="text-white/50 text-[10px] font-bold tracking-widest uppercase mb-1">Pricing</p>
                        <p className="text-white font-black text-lg leading-tight">Confirmed On-Site</p>
                        <p className="text-white/40 text-xs mt-2 leading-relaxed">
                          Architectural Bench Top pricing varies by size, finish &amp; complexity.<br />
                          We&apos;ll contact you to discuss and confirm the final price on-site — no obligation.
                        </p>
                      </div>
                    ) : estimate ? (
                      <div className="bg-ink-900 rounded-2xl p-5 text-center">
                        <p className="text-white/50 text-[10px] font-bold tracking-widest uppercase mb-1">Rough Estimate</p>
                        <p className="text-white font-black text-[2rem] leading-none">
                          ${estimate.low.toLocaleString()} – ${estimate.high.toLocaleString()}
                        </p>
                        <p className="text-white/40 text-xs mt-2 leading-relaxed">
                          {isSteps
                            ? `${estimate.quantity} step${estimate.quantity !== 1 ? "s" : ""} at $${PRICING[answers.service!][answers.type!].low.toLocaleString()}–$${PRICING[answers.service!][answers.type!].high.toLocaleString()} per step`
                            : `Supply & install · ${estimate.quantity} ${estimate.unit} at $${PRICING[answers.service!][answers.type!].low}–$${PRICING[answers.service!][answers.type!].high} / ${estimate.unit}`
                          }<br />
                          Accurate quote after free on-site inspection
                        </p>
                      </div>
                    ) : (
                      <div className="bg-ink-900 rounded-2xl p-5 text-center">
                        <p className="text-white/50 text-xs mb-1 uppercase tracking-widest">Next Step</p>
                        <p className="text-white font-bold text-lg">Free On-Site Inspection</p>
                        <p className="text-white/40 text-xs mt-2">We&apos;ll measure and quote on the spot — no obligation.</p>
                      </div>
                    )}

                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5">
                      <p className="text-amber-800 text-xs leading-relaxed">
                        💡 <strong>Rough guide only.</strong> Final price depends on site conditions,
                        excavation, access, soil type &amp; materials chosen. A free on-site visit
                        gives you a fixed, accurate quote.
                      </p>
                    </div>

                    {answers.phone && (
                      <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4 text-center">
                        <p className="text-violet-700 text-sm font-semibold">
                          📞 We&apos;ll call{firstName ? ` ${firstName}` : " you"} on
                        </p>
                        <p className="text-violet-900 font-black text-xl mt-0.5">{answers.phone}</p>
                        <p className="text-violet-500 text-xs mt-1">within 24 hours · usually much sooner</p>
                      </div>
                    )}

                    <a
                      href="tel:0476863201"
                      className="flex items-center justify-center gap-2.5 w-full py-4 bg-violet-600 text-white font-bold rounded-2xl text-sm hover:bg-violet-700 active:scale-[0.98] transition-all"
                    >
                      <Phone className="w-4 h-4" />
                      Call Now: 0476 863 201
                    </a>

                    <button
                      onClick={() => {
                        setStep("details");
                        setAnswers({});
                        setCustomText("");
                        setDetailsForm({ name: "", phone: "", email: "", postcode: "" });
                        setDetailsErrors({});
                        submittedRef.value = false;
                        scrollTop();
                      }}
                      className="w-full py-3 border border-gray-200 text-ink-500 text-sm font-medium rounded-2xl hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Start a new quote
                    </button>
                </>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Step({ q, sub, icon, children }: { q: string; sub?: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="mb-0.5">
        {icon && (
          <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center mb-2">
            {icon}
          </div>
        )}
        <h3 className="font-bold text-ink-900 text-[1rem] leading-snug">{q}</h3>
        {sub && <p className="text-ink-400 text-xs mt-1 leading-relaxed">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

function OptionBtn({ label, desc, icon, onClick }: { label: string; desc?: string; icon?: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-left hover:border-violet-400 hover:bg-violet-50 active:scale-[0.98] transition-all shadow-sm group"
    >
      {icon && (
        <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0 group-hover:bg-violet-100 transition-colors">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-ink-900 text-sm leading-tight">{label}</p>
        {desc && <p className="text-ink-400 text-[11px] mt-0.5 leading-tight">{desc}</p>}
      </div>
      <ChevronRight className="w-4 h-4 text-ink-300 shrink-0 group-hover:text-violet-500 transition-colors" />
    </button>
  );
}

function NotSure({ onClick, label = "Not sure" }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-3 border border-dashed border-gray-200 text-ink-400 text-sm rounded-2xl hover:bg-gray-100 hover:text-ink-600 transition-all"
    >
      🤔 {label}
    </button>
  );
}

function TextInput({ inputRef, type, value, placeholder, onChange, onEnter, onSubmit, submitLabel }: {
  inputRef: React.RefObject<HTMLInputElement | null>;
  type: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
  onEnter: () => void;
  onSubmit: () => void;
  submitLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") onEnter(); }}
        placeholder={placeholder}
        autoFocus
        className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-base text-ink-900 placeholder-ink-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
      />
      <button
        onClick={onSubmit}
        disabled={!value.trim()}
        className="w-full py-3.5 bg-violet-600 text-white font-bold rounded-2xl text-sm hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98] flex items-center justify-center gap-2"
      >
        {submitLabel ?? "Continue"} <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
