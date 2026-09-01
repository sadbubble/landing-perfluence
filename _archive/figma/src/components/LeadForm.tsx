import { useState, useEffect, useRef, useCallback } from "react";
import type { Tariff } from "../content/ru";

export interface FormData {
  phone: string;
  fullName: string;
  address: string;
  tariff: string;
  comment: string;
  consent: boolean;
  company?: string; // honeypot
}

interface LeadFormProps {
  title: string;
  subtitle: string;
  labelPhone: string;
  placeholderPhone: string;
  labelName: string;
  placeholderName: string;
  labelAddress: string;
  placeholderAddress: string;
  labelTariff: string;
  placeholderTariff: string;
  labelComment: string;
  placeholderComment: string;
  consentText: string;
  consentLink: string;
  privacyPath: string;
  submitLabel: string;
  submittingLabel: string;
  successTitle: string;
  successText: string;
  errorRequired: string;
  errorPhone: string;
  errorConsent: string;
  errorSubmit: string;
  resetLabel: string;
  tariffs: Tariff[];
  selectedTariffSlug?: string;
  onSubmit: (data: FormData) => Promise<void> | void;
}

type Status = "idle" | "submitting" | "success";

// ── Phone mask helpers ────────────────────────────────────────────────────────

/** Format 0-10 raw digits into "+7 (NNN) NNN-NN-NN" (progressive) */
function fmtPhone(d: string): string {
  if (!d) return "+7";
  let r = "+7 (";
  r += d.slice(0, Math.min(3, d.length));
  if (d.length < 3) return r;
  r += ") " + d.slice(3, Math.min(6, d.length));
  if (d.length < 6) return r;
  r += "-" + d.slice(6, Math.min(8, d.length));
  if (d.length < 8) return r;
  r += "-" + d.slice(8, 10);
  return r;
}

/** Extract raw user digits (up to 10) from any phone string. */
function extractDigits(val: string): string {
  let d = val.replace(/\D/g, "");
  // Strip one leading country-code digit (7 or 8) when total > 10
  if (d.length > 10 && (d.startsWith("7") || d.startsWith("8"))) {
    d = d.slice(1);
  }
  return d.slice(0, 10);
}

/** Strip the "+7" prefix contribution (always one leading "7") from onChange value. */
function stripPrefix(val: string): string {
  let d = val.replace(/\D/g, "");
  if (d.startsWith("7")) d = d.slice(1);
  else if (d.startsWith("8")) d = d.slice(1);
  return d.slice(0, 10);
}

/** KZ mobile: 10 digits, first must be 7 (70x, 71x, 72x, 75x, 76x, 77x, 78x) */
function isValidKzPhone(digits: string): boolean {
  return digits.length === 10 && digits.startsWith("7");
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function LeadForm({
  title,
  subtitle,
  labelPhone,
  placeholderPhone,
  labelName,
  placeholderName,
  labelAddress,
  placeholderAddress,
  labelTariff,
  placeholderTariff,
  labelComment,
  placeholderComment,
  consentText,
  consentLink,
  privacyPath,
  submitLabel,
  submittingLabel,
  successTitle,
  successText,
  errorRequired,
  errorPhone,
  errorConsent,
  errorSubmit,
  resetLabel,
  tariffs,
  selectedTariffSlug,
  onSubmit,
}: LeadFormProps) {
  const phoneRef = useRef<HTMLInputElement>(null);

  const [rawDigits, setRawDigits] = useState(""); // 0-10 user digits
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [tariff, setTariff] = useState(selectedTariffSlug ?? "");
  const [comment, setComment] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [submitError, setSubmitError] = useState("");

  // Sync externally selected tariff (from "Подключить" card click)
  useEffect(() => {
    if (selectedTariffSlug) {
      setTariff(selectedTariffSlug);
      setTouched((t) => ({ ...t, tariff: true }));
    }
  }, [selectedTariffSlug]);

  // Expose focus method for App to call after scroll
  useEffect(() => {
    (phoneRef.current as any)?.__focusable?.();
  }, []);

  // ── Validation ──────────────────────────────────────────────────────────────

  const errors = {
    phone: !rawDigits
      ? errorRequired
      : !isValidKzPhone(rawDigits)
      ? errorPhone
      : "",
    fullName: fullName.trim().length < 2 ? errorRequired : "",
    address: address.trim().length < 3 ? errorRequired : "",
    tariff: !tariff ? errorRequired : "",
    consent: !consent ? errorConsent : "",
  };
  const isFormValid = !Object.values(errors).some(Boolean);

  function touch(field: string) {
    setTouched((t) => ({ ...t, [field]: true }));
  }

  function fieldBorder(field: string) {
    return touched[field] && errors[field as keyof typeof errors]
      ? "1.5px solid #D0342C"
      : "1.5px solid rgba(18,38,58,0.15)";
  }

  // ── Phone handlers ──────────────────────────────────────────────────────────

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    setRawDigits(stripPrefix(e.target.value));
  }

  function handlePhonePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    setRawDigits(extractDigits(e.clipboardData.getData("text")));
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  const submitting = useRef(false); // guard against double-click

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ phone: true, fullName: true, address: true, tariff: true, consent: true });
    if (!isFormValid) return;
    if (submitting.current || status === "submitting") return;

    submitting.current = true;
    setStatus("submitting");
    setSubmitError("");

    try {
      await onSubmit({
        phone: fmtPhone(rawDigits),
        fullName,
        address,
        tariff,
        comment,
        consent,
        company: honeypot,
      });
      setStatus("success");
    } catch {
      setSubmitError(errorSubmit);
      setStatus("idle");
    } finally {
      submitting.current = false;
    }
  }

  // ── Reset ───────────────────────────────────────────────────────────────────

  function resetForm() {
    setRawDigits("");
    setFullName("");
    setAddress("");
    setTariff("");
    setComment("");
    setConsent(false);
    setTouched({});
    setSubmitError("");
    setStatus("idle");
    setTimeout(() => phoneRef.current?.focus(), 50);
  }

  // ── Shared styles ───────────────────────────────────────────────────────────

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1.5px solid rgba(18,38,58,0.15)",
    borderRadius: "12px",
    padding: "13px 16px",
    fontSize: "15px",
    color: "var(--ink)",
    background: "var(--surface)",
    outline: "none",
    transition: "border-color 0.15s",
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--ink)",
    marginBottom: "6px",
  };

  const errorMsgStyle: React.CSSProperties = {
    fontSize: "12px",
    color: "#D0342C",
    marginTop: "4px",
    minHeight: "16px",
    lineHeight: 1.4,
  };

  function onFocusBrand(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    e.currentTarget.style.borderColor = "var(--brand)";
  }
  function onBlurReset(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    e.currentTarget.style.borderColor = "rgba(18,38,58,0.15)";
  }

  // ── Success screen ──────────────────────────────────────────────────────────

  if (status === "success") {
    return (
      <section id="lead-form" style={{ background: "var(--bg)", padding: "72px 20px" }}>
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            background: "var(--surface)",
            borderRadius: "var(--radius)",
            padding: "clamp(32px, 6vw, 52px) clamp(24px, 6vw, 40px)",
            textAlign: "center",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "var(--brand-soft)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
              <path
                d="M8 17 L14 23 L26 11"
                stroke="var(--brand)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h2
            style={{
              fontSize: "clamp(22px, 4vw, 30px)",
              fontWeight: 800,
              color: "var(--ink)",
              marginBottom: "12px",
            }}
          >
            {successTitle}
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: "var(--ink-muted)",
              lineHeight: 1.65,
              marginBottom: "32px",
            }}
          >
            {successText}
          </p>

          <button
            onClick={resetForm}
            style={{
              background: "transparent",
              color: "var(--brand)",
              border: "2px solid var(--brand)",
              borderRadius: "12px",
              padding: "12px 28px",
              fontSize: "15px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              minHeight: "48px",
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              const b = e.currentTarget;
              b.style.background = "var(--brand)";
              b.style.color = "white";
            }}
            onMouseLeave={(e) => {
              const b = e.currentTarget;
              b.style.background = "transparent";
              b.style.color = "var(--brand)";
            }}
          >
            {resetLabel}
          </button>
        </div>
      </section>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────────

  const isDisabled = !isFormValid || status === "submitting";

  return (
    <section id="lead-form" style={{ background: "var(--bg)", padding: "72px 20px" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>
        <div style={{ marginBottom: "36px" }}>
          <h2
            style={{
              fontSize: "clamp(22px, 4vw, 32px)",
              fontWeight: 800,
              color: "var(--ink)",
              letterSpacing: "-0.3px",
              marginBottom: "10px",
            }}
          >
            {title}
          </h2>
          <p style={{ fontSize: "15px", color: "var(--ink-muted)", lineHeight: 1.6 }}>
            {subtitle}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          style={{
            background: "var(--surface)",
            borderRadius: "var(--radius)",
            padding: "clamp(24px, 5vw, 40px)",
            boxShadow: "var(--shadow-md)",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* Honeypot — visually hidden via CSS, NOT display:none */}
          <div className="visually-hidden-honeypot" aria-hidden="true">
            <label htmlFor="company-trap">Leave this field empty</label>
            <input
              id="company-trap"
              name="company"
              type="text"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* Phone ── ── ── ── ── ── ── ── ── ── ── */}
          <div>
            <label htmlFor="phone" style={labelStyle}>{labelPhone} *</label>
            <input
              id="phone"
              ref={phoneRef}
              type="tel"
              inputMode="tel"
              placeholder={placeholderPhone}
              value={fmtPhone(rawDigits)}
              onChange={handlePhoneChange}
              onPaste={handlePhonePaste}
              onBlur={() => touch("phone")}
              onFocus={onFocusBrand}
              style={{ ...inputStyle, border: fieldBorder("phone") }}
            />
            <p style={errorMsgStyle}>{touched.phone ? errors.phone : ""}</p>
          </div>

          {/* Full name ── ── ── ── ── ── ── ── ── ── */}
          <div>
            <label htmlFor="fullName" style={labelStyle}>{labelName} *</label>
            <input
              id="fullName"
              type="text"
              placeholder={placeholderName}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onBlur={() => touch("fullName")}
              onFocus={onFocusBrand}
              style={{ ...inputStyle, border: fieldBorder("fullName") }}
            />
            <p style={errorMsgStyle}>{touched.fullName ? errors.fullName : ""}</p>
          </div>

          {/* Address ── ── ── ── ── ── ── ── ── ── ── */}
          <div>
            <label htmlFor="address" style={labelStyle}>{labelAddress} *</label>
            <input
              id="address"
              type="text"
              placeholder={placeholderAddress}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onBlur={() => touch("address")}
              onFocus={onFocusBrand}
              style={{ ...inputStyle, border: fieldBorder("address") }}
            />
            <p style={errorMsgStyle}>{touched.address ? errors.address : ""}</p>
          </div>

          {/* Tariff ── ── ── ── ── ── ── ── ── ── ── */}
          <div>
            <label htmlFor="tariff" style={labelStyle}>{labelTariff} *</label>
            <select
              id="tariff"
              value={tariff}
              onChange={(e) => { setTariff(e.target.value); touch("tariff"); }}
              onBlur={() => touch("tariff")}
              onFocus={onFocusBrand}
              style={{
                ...inputStyle,
                border: fieldBorder("tariff"),
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%235A6C7D' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 14px center",
                paddingRight: "40px",
                cursor: "pointer",
              }}
            >
              <option value="" disabled>{placeholderTariff}</option>
              {tariffs.map((t) => (
                <option key={t.slug} value={t.slug}>{t.name}</option>
              ))}
            </select>
            <p style={errorMsgStyle}>{touched.tariff ? errors.tariff : ""}</p>
          </div>

          {/* Comment ── ── ── ── ── ── ── ── ── ── ── */}
          <div>
            <label htmlFor="comment" style={labelStyle}>{labelComment}</label>
            <textarea
              id="comment"
              placeholder={placeholderComment}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              onFocus={onFocusBrand}
              onBlur={onBlurReset}
              style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }}
            />
          </div>

          {/* Consent ── ── ── ── ── ── ── ── ── ── ── */}
          <div>
            <label
              style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}
            >
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => { setConsent(e.target.checked); touch("consent"); }}
                style={{
                  width: "18px",
                  height: "18px",
                  minWidth: "18px",
                  marginTop: "2px",
                  accentColor: "var(--brand)",
                  cursor: "pointer",
                }}
              />
              <span style={{ fontSize: "13px", color: "var(--ink-muted)", lineHeight: 1.5 }}>
                {consentText}
                <a
                  href={privacyPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--brand)", fontWeight: 600 }}
                >
                  {consentLink}
                </a>
              </span>
            </label>
            <p style={{ ...errorMsgStyle, marginLeft: "28px" }}>
              {touched.consent ? errors.consent : ""}
            </p>
          </div>

          {/* Submit ── ── ── ── ── ── ── ── ── ── ── */}
          <button
            type="submit"
            disabled={isDisabled}
            style={{
              background: isDisabled ? "rgba(18,38,58,0.10)" : "var(--brand)",
              color: isDisabled ? "var(--ink-muted)" : "white",
              border: "none",
              borderRadius: "12px",
              padding: "15px 24px",
              fontSize: "16px",
              fontWeight: 700,
              cursor: isDisabled ? "not-allowed" : "pointer",
              width: "100%",
              minHeight: "52px",
              transition: "background 0.15s ease",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
            onMouseEnter={(e) => {
              if (!isDisabled) (e.currentTarget as HTMLButtonElement).style.background = "var(--brand-dark)";
            }}
            onMouseLeave={(e) => {
              if (!isDisabled) (e.currentTarget as HTMLButtonElement).style.background = "var(--brand)";
            }}
          >
            {status === "submitting" ? (
              <>
                <Spinner />
                {submittingLabel}
              </>
            ) : (
              submitLabel
            )}
          </button>

          {/* Submit error ── ── ── ── ── ── ── ── ── */}
          {submitError && (
            <p
              style={{
                fontSize: "13px",
                color: "#D0342C",
                textAlign: "center",
                lineHeight: 1.5,
                marginTop: "-4px",
              }}
              role="alert"
            >
              {submitError}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

function Spinner() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ animation: "spin 0.8s linear infinite", flexShrink: 0 }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="3"
      />
      <path
        d="M12 2 A10 10 0 0 1 22 12"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
