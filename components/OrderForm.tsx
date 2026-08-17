"use client";

import { useState } from "react";
import { SECTORS } from "@/lib/validation";

type Sector = (typeof SECTORS)[number]["value"];

type FormState = {
  projectName: string;
  email: string;
  objective: string;
  sector: Sector | "";
  budgetUsd: string;
  timelineDays: string;
  references: string;
};

const initialState: FormState = {
  projectName: "",
  email: "",
  objective: "",
  sector: "",
  budgetUsd: "2500",
  timelineDays: "14",
  references: "",
};

const STEPS = ["Mission Brief", "Select Sector", "Command Center", "Launch"];

export default function OrderForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ id: string } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validateStep(current: number): boolean {
    const e: Record<string, string> = {};
    if (current === 0) {
      if (form.projectName.trim().length < 2) e.projectName = "Give the mission a name";
      if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
      if (form.objective.trim().length < 20) e.objective = "A bit more detail, at least 20 characters";
    }
    if (current === 1) {
      if (!form.sector) e.sector = "Choose a sector";
    }
    if (current === 2) {
      const b = Number(form.budgetUsd);
      const t = Number(form.timelineDays);
      if (!b || b < 100) e.budgetUsd = "Minimum budget is $100";
      if (!t || t < 1) e.timelineDays = "Minimum timeline is 1 day";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submit() {
    if (!validateStep(0) || !validateStep(1) || !validateStep(2)) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          budgetUsd: Number(form.budgetUsd),
          timelineDays: Number(form.timelineDays),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong");
      }
      setResult({ id: data.order.id });
    } catch (err: any) {
      setSubmitError(err.message || "Could not submit order");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="glass rounded-2xl p-10 md:p-14 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-nebula/20 border border-nebula-bright/40 flex items-center justify-center mb-6">
          <span className="text-2xl">🛰️</span>
        </div>
        <h3 className="font-display text-2xl md:text-3xl text-white mb-3">Mission received</h3>
        <p className="text-mist max-w-md mx-auto mb-6">
          Order <span className="font-mono text-nebula-bright">{result.id.slice(0, 10)}</span> is
          logged and awaiting review. We&apos;ll reply at{" "}
          <span className="text-white">{form.email}</span> within one business day.
        </p>
        <button
          onClick={() => {
            setResult(null);
            setForm(initialState);
            setStep(0);
          }}
          className="font-mono text-xs tracking-widest uppercase px-6 py-3 rounded-lg border border-nebula-bright/40 text-nebula-bright hover:bg-nebula-bright/10 transition-colors"
        >
          Submit another mission
        </button>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 md:p-12 relative overflow-hidden">
      <Corners />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
        {/* Step rail */}
        <div className="lg:col-span-3 flex flex-row lg:flex-col justify-between gap-4 border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0 lg:pr-6">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 shrink-0 rounded-full border-2 flex items-center justify-center font-mono text-xs transition-colors ${
                  i === step
                    ? "border-nebula-bright text-nebula-bright shadow-glow"
                    : i < step
                    ? "border-quasar text-quasar"
                    : "border-white/20 text-white/30"
                }`}
              >
                {i < step ? "✓" : String(i + 1).padStart(2, "0")}
              </div>
              <span
                className={`font-mono text-xs tracking-wider uppercase hidden md:block ${
                  i === step ? "text-nebula-bright" : "text-white/40"
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="lg:col-span-9">
          <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
            <h3 className="font-display text-xl md:text-2xl text-white">
              Step {String(step + 1).padStart(2, "0")}: {STEPS[step]}
            </h3>
            <span className="font-mono text-[11px] text-nebula-bright bg-nebula-bright/10 px-3 py-1 rounded-full border border-nebula-bright/30 whitespace-nowrap">
              STATUS: {step === 3 ? "READY" : "AWAITING INPUT"}
            </span>
          </div>

          {step === 0 && (
            <div className="space-y-6">
              <Field label="Project Designation" error={errors.projectName}>
                <input
                  value={form.projectName}
                  onChange={(e) => update("projectName", e.target.value)}
                  placeholder="e.g. Apollo Storefront"
                  className="field-input"
                />
              </Field>
              <Field label="Contact Email" error={errors.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@company.com"
                  className="field-input"
                />
              </Field>
              <Field label="Mission Objective" error={errors.objective}>
                <textarea
                  rows={4}
                  value={form.objective}
                  onChange={(e) => update("objective", e.target.value)}
                  placeholder="What should this website achieve? Who is it for?"
                  className="field-input resize-none"
                />
              </Field>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              {errors.sector && <p className="text-sm text-red-300">{errors.sector}</p>}
              <div className="grid sm:grid-cols-2 gap-4">
                {SECTORS.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => update("sector", s.value)}
                    className={`text-left rounded-xl border p-5 transition-all ${
                      form.sector === s.value
                        ? "border-nebula-bright bg-nebula-bright/10 shadow-glow"
                        : "border-white/10 hover:border-white/25"
                    }`}
                  >
                    <div className="font-display text-white text-lg">{s.label}</div>
                    <div className="text-sm text-mist mt-1">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <Field label={`Budget — $${Number(form.budgetUsd || 0).toLocaleString()}`} error={errors.budgetUsd}>
                <input
                  type="range"
                  min={100}
                  max={50000}
                  step={100}
                  value={form.budgetUsd}
                  onChange={(e) => update("budgetUsd", e.target.value)}
                  className="w-full accent-nebula-bright"
                />
              </Field>
              <Field label={`Timeline — ${form.timelineDays} days`} error={errors.timelineDays}>
                <input
                  type="range"
                  min={1}
                  max={90}
                  value={form.timelineDays}
                  onChange={(e) => update("timelineDays", e.target.value)}
                  className="w-full accent-quasar"
                />
              </Field>
              <Field label="Reference links (optional)">
                <input
                  value={form.references}
                  onChange={(e) => update("references", e.target.value)}
                  placeholder="Sites, brand docs, inspiration..."
                  className="field-input"
                />
              </Field>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-4 font-mono text-sm">
                <Summary label="Project" value={form.projectName} />
                <Summary label="Email" value={form.email} />
                <Summary
                  label="Sector"
                  value={SECTORS.find((s) => s.value === form.sector)?.label || "—"}
                />
                <Summary label="Budget" value={`$${Number(form.budgetUsd).toLocaleString()}`} />
                <Summary label="Timeline" value={`${form.timelineDays} days`} />
                {form.references && <Summary label="References" value={form.references} />}
              </dl>
              <div>
                <span className="text-xs uppercase tracking-wider text-white/40 font-mono">
                  Objective
                </span>
                <p className="text-mist mt-1">{form.objective}</p>
              </div>
              {submitError && <p className="text-sm text-red-300">{submitError}</p>}
            </div>
          )}

          <div className="flex justify-between pt-10">
            <button
              type="button"
              onClick={back}
              disabled={step === 0}
              className="font-mono text-xs tracking-widest uppercase px-5 py-3 rounded-lg text-white/50 hover:text-white disabled:opacity-0 transition-colors"
            >
              ← Back
            </button>
            {step < 3 ? (
              <button
                type="button"
                onClick={next}
                className="font-mono text-xs tracking-widest uppercase px-6 py-3 rounded-lg border border-nebula-bright/50 text-nebula-bright hover:bg-nebula-bright/10 transition-colors"
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={submitting}
                className="font-mono text-xs tracking-widest uppercase px-6 py-3 rounded-lg bg-nebula-bright text-void hover:bg-white transition-colors disabled:opacity-60"
              >
                {submitting ? "Launching…" : "Launch Mission 🚀"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="font-mono text-[11px] text-white/50 uppercase tracking-wider block">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-300">{error}</p>}
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-white/40 text-[11px] uppercase tracking-wider">{label}</dt>
      <dd className="text-white mt-0.5 truncate">{value}</dd>
    </div>
  );
}

function Corners() {
  const base = "absolute w-4 h-4 border-nebula-bright/40";
  return (
    <>
      <span className={`${base} top-4 left-4 border-t border-l`} />
      <span className={`${base} top-4 right-4 border-t border-r`} />
      <span className={`${base} bottom-4 left-4 border-b border-l`} />
      <span className={`${base} bottom-4 right-4 border-b border-r`} />
    </>
  );
}
