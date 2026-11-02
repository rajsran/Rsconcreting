"use client";

import { useState, useEffect, useRef } from "react";
import {
  X, Hammer, Leaf, Layers, ShieldCheck,
  ChevronRight, Phone, CheckCircle2, Loader2,
  MessageCircle, Ruler, Calendar, User, Mail,
} from "lucide-react";
import { PRICING, calcEstimate, formatSize, unitFor } from "@/lib/pricing";

// ─── Types ────────────────────────────────────────────────────────────────────
type Step = "service" | "type" | "size" | "timeline" | "name" | "email" | "phone" | "quote";

interface Answers {
  service?: string;
  type?: string;
  size?: string;
  timeline?: string;
  name?: string;
  email?: string;
  phone?: string;
}

export interface QuoteChatProps {
  isOpen: boolean;
  onClose: () => void;
}


// ─── Step Options ─────────────────────────────────────────────────────────────
const SERVICE_OPTIONS = [
  { label: "Concreting",      Icon: Hammer,      desc: "Driveways, slabs, paths & more" },
  { label: "Landscaping",     Icon: Leaf,        desc: "Gardens, turf & paving" },
  { label: "Decking",         Icon: Layers,      desc: "Timber & composite decks" },
  { label: "Fencing",         Icon: ShieldCheck, desc: "Colorbond, timber & glass" },
];


// Built from lib/pricing.ts so the prices shown here always match the estimate
const TYPE_OPTIONS: Record<string, { label: string; desc: string }[]> = Object.fromEntries(
  Object.entries(PRICING).map(([service, types]) => [
    service,
    Object.entries(types).map(([label, p]) => ({
      label,
      desc: `$${p.low}–$${p.high} / ${p.unit}`,
    })),
  ])
);


const TIMELINE_OPTIONS = [
  { label: "ASAP — within 2 weeks", desc: "Urgent, ready to start now" },
  { label: "Next month",            desc: "Getting things organised" },
  { label: "1–3 months away",       desc: "Planning ahead" },
  { label: "Just exploring",        desc: "No rush, comparing options" },
];

const STEP_ORDER: Step[] = ["service", "type", "size", "timeline", "name", "email", "phone", "quote"];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function QuoteChat({ isOpen, onClose }: QuoteChatProps) {
  const [step, setStep]       = useState<Step>("service");
  const [answers, setAnswers] = useState<Answers>({});
  const [customText, setCustomText]     = useState("");
  const [, setShowCustom]     = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  // tracks whether the lead was successfully submitted to the backend
  const [submittedRef]       = useState({ value: false });

  const scrollRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  // Reset every time the modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep("service");
      setAnswers({});
      setCustomText("");
      setShowCustom(false);
      setIsLoading(false);
      submittedRef.value = false;
    }
  }, [isOpen]);

  const scrollTop = () =>
    setTimeout(() => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 60);

  /** Advance to the next step after storing answer[key] = value */
  const advance = (key: keyof Answers, value: string) => {
    const next: Answers = { ...answers, [key]: value };
    setAnswers(next);
    setCustomText("");
    setShowCustom(false);
    scrollTop();

    if (key === "phone") {
      finishQuote(next);
      return;
    }

    const nextMap: Partial<Record<keyof Answers, Step>> =
      { service: "type", type: "size", size: "timeline", timeline: "name", name: "email", email: "phone" };

    const nextStep = nextMap[key];
    if (nextStep) setStep(nextStep);
  };

  const finishQuote = async (final: Answers) => {
    setStep("quote");
    setIsLoading(true);
    // Submit lead to backend (fire-and-forget; no blocking)
    try {
      await fetch("/api/quote/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(final),
      });
      submittedRef.value = true;
    } catch {
      // non-critical
    } finally {
      setIsLoading(false);
    }
  };

  const isLinear      = unitFor(answers) === "lm";
  const stepOrder     = STEP_ORDER;
  const typeOpts      = answers.service ? (TYPE_OPTIONS[answers.service] ?? []) : [];
  const estimate      = calcEstimate(answers);
  const progress      = Math.round((stepOrder.indexOf(step) / (stepOrder.length - 1)) * 100);
  const firstName  = answers.name?.split(" ")[0] ?? "";

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal panel */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden w-full max-w-[420px] pointer-events-auto"
          style={{ height: "min(88vh, 680px)", maxHeight: "calc(100vh - 2rem)" }}
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
                  <p className="text-white/50 text-[11px]">Groundmakers · Melbourne&apos;s West</p>
                </div>
              </div>
              <button onClick={onClose} className="text-white/50 hover:text-white p-1 transition-colors" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress bar — hidden on quote screen */}
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

            {/* ══ SERVICE ══ */}
            {step === "service" && (
              <Step
                q="What service do you need?"
                sub="Tap any option — we'll give you a price in seconds ⚡"
              >
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
              <Step
                q={`What type of ${answers.service?.toLowerCase()}?`}
                sub="Choose the finish that suits your project"
              >
                {typeOpts.map(({ label, desc }) => (
                  <OptionBtn key={label} label={label} desc={desc} onClick={() => advance("type", label)} />
                ))}
                <NotSure onClick={() => advance("type", `Standard ${answers.service}`)} />
              </Step>
            )}

            {/* ══ SIZE ══ */}
            {step === "size" && (
              <Step
                q={isLinear ? "How long is the project?" : "How large is the area?"}
                sub={isLinear ? "Enter the total length in metres" : "Enter the total area in square metres"}
                icon={<Ruler className="w-4 h-4 text-violet-600" />}
              >
                <TextInput
                  inputRef={inputRef}
                  type="number"
                  value={customText}
                  placeholder={isLinear ? "e.g. 28" : "e.g. 45"}
                  onChange={(v) => setCustomText(v.replace(/[^0-9]/g, ""))}
                  onEnter={() => customText.trim() && advance("size", customText.trim())}
                  onSubmit={() => customText.trim() && advance("size", customText.trim())}
                  submitLabel="Continue"
                />
                <NotSure label="Not sure — measure on-site" onClick={() => advance("size", "To be measured on-site")} />
              </Step>
            )}

            {/* ══ TIMELINE ══ */}
            {step === "timeline" && (
              <Step
                q="When do you want to start?"
                sub="Helps us plan your job in our schedule"
                icon={<Calendar className="w-4 h-4 text-violet-600" />}
              >
                {TIMELINE_OPTIONS.map(({ label, desc }) => (
                  <OptionBtn key={label} label={label} desc={desc} onClick={() => advance("timeline", label)} />
                ))}
                <NotSure label="Flexible / Not sure yet" onClick={() => advance("timeline", "Flexible")} />
              </Step>
            )}

            {/* ══ NAME ══ */}
            {step === "name" && (
              <Step
                q="Almost there! What's your name?"
                sub="So we know who to follow up with"
                icon={<User className="w-4 h-4 text-violet-600" />}
              >
                <TextInput
                  inputRef={inputRef}
                  type="text"
                  value={customText}
                  placeholder="Your full name"
                  onChange={setCustomText}
                  onEnter={() => customText.trim() && advance("name", customText.trim())}
                  onSubmit={() => customText.trim() && advance("name", customText.trim())}
                  submitLabel="Continue"
                />
              </Step>
            )}

            {/* ══ EMAIL ══ */}
            {step === "email" && (
              <Step
                q="What's your email address?"
                sub="We'll send your quote PDF here — takes 10 seconds to arrive"
                icon={<Mail className="w-4 h-4 text-violet-600" />}
              >
                <TextInput
                  inputRef={inputRef}
                  type="email"
                  value={customText}
                  placeholder="e.g. jane@example.com"
                  onChange={setCustomText}
                  onEnter={() => customText.trim() && advance("email", customText.trim())}
                  onSubmit={() => customText.trim() && advance("email", customText.trim())}
                  submitLabel="Send My Quote →"
                />
                <button
                  onClick={() => advance("email", "Not provided")}
                  className="w-full py-3 border border-dashed border-gray-300 text-ink-400 text-sm rounded-2xl hover:bg-gray-100 hover:text-ink-600 transition-all"
                >
                  🤔 Skip — no email needed
                </button>
              </Step>
            )}

            {/* ══ PHONE ══ */}
            {step === "phone" && (
              <Step
                q={`${firstName ? `Great, ${firstName}!` : "Great!"} What's your phone number?`}
                sub="Arsdeep or Gurnaib will call within 24 hours"
                icon={<Phone className="w-4 h-4 text-violet-600" />}
              >
                <TextInput
                  inputRef={inputRef}
                  type="tel"
                  value={customText}
                  placeholder="e.g. 0412 345 678"
                  onChange={setCustomText}
                  onEnter={() => customText.trim() && advance("phone", customText.trim())}
                  onSubmit={() => customText.trim() && advance("phone", customText.trim())}
                  submitLabel="Get My Quote →"
                />
                <button
                  onClick={() => finishQuote({ ...answers, phone: "Not provided" })}
                  className="w-full py-3 border border-dashed border-gray-300 text-ink-400 text-sm rounded-2xl hover:bg-gray-100 hover:text-ink-600 transition-all"
                >
                  🤔 Skip for now
                </button>
              </Step>
            )}

            {/* ══ QUOTE RESULT ══ */}
            {step === "quote" && (
              <div className="flex flex-col gap-3 pb-2">

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
                    <p className="text-ink-400 text-sm">Calculating your quote…</p>
                  </div>
                ) : (
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

                        {estimate ? (
                          <div className="bg-ink-900 rounded-2xl p-5 text-center">
                            <p className="text-white/50 text-[10px] font-bold tracking-widest uppercase mb-1">Rough Estimate</p>
                            <p className="text-white font-black text-[2rem] leading-none">
                              ${estimate.low.toLocaleString()} – ${estimate.high.toLocaleString()}
                            </p>
                            <p className="text-white/40 text-xs mt-2 leading-relaxed">
                              Supply &amp; install &middot; {estimate.quantity} {estimate.unit} at ${PRICING[answers.service!][answers.type!].low}&ndash;${PRICING[answers.service!][answers.type!].high} / {estimate.unit}<br />
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

                        {answers.phone && answers.phone !== "Not provided" && (
                          <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4 text-center">
                            <p className="text-violet-700 text-sm font-semibold">
                              📞 We&apos;ll call{firstName ? ` ${firstName}` : " you"} on
                            </p>
                            <p className="text-violet-900 font-black text-xl mt-0.5">{answers.phone}</p>
                            <p className="text-violet-500 text-xs mt-1">within 24 hours · usually much sooner</p>
                          </div>
                        )}

                    {/* CTAs */}
                    <a
                      href="tel:0433457437"
                      className="flex items-center justify-center gap-2.5 w-full py-4 bg-violet-600 text-white font-bold rounded-2xl text-sm hover:bg-violet-700 active:scale-[0.98] transition-all"
                    >
                      <Phone className="w-4 h-4" />
                      Call Now: 0433 457 437
                    </a>

                    <button
                      onClick={() => {
                        setStep("service");
                        setAnswers({});
                        setCustomText("");
                        setShowCustom(false);
                        setIsLoading(false);
                        submittedRef.value = false;
                        scrollTop();
                      }}
                      className="w-full py-3 border border-gray-200 text-ink-500 text-sm font-medium rounded-2xl hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Start a new quote
                    </button>
                  </>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Step({
  q, sub, icon, children,
}: {
  q: string; sub?: string; icon?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {/* Question header */}
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

function OptionBtn({
  label, desc, icon, onClick,
}: {
  label: string; desc?: string; icon?: React.ReactNode; onClick: () => void;
}) {
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

function TextInput({
  inputRef, type, value, placeholder, onChange, onEnter, onSubmit, submitLabel,
}: {
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
