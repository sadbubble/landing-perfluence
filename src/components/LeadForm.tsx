import { useState, useEffect, useRef } from "react";
import type { Tariff } from "../content/ru";
import { isValidPhone } from "../lib/phone";

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
  chosenTariffLabel: string;
  changeTariffLabel: string;
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

/**
 * Проверка мобильного номера РК.
 *
 * Раньше здесь было `digits.startsWith("7")` — это пропускало городские
 * номера: код Алматы 727 тоже начинается с семёрки. Такой номер проходил
 * валидацию на клиенте, но отклонялся сервером, и человек видел
 * невнятную ошибку отправки вместо подсказки в поле.
 *
 * Теперь используется общая с сервером проверка по кодам операторов —
 * см. supabase/functions/_shared/phone.ts.
 */
function isValidKzPhone(digits: string): boolean {
  return digits.length === 10 && isValidPhone("7" + digits);
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
  chosenTariffLabel,
  changeTariffLabel,
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
  /*
   * Тариф человек уже выбрал кнопкой на карточке. Показывать ему тот же
   * список из четырёх вариантов повторно — значит заставлять принимать
   * одно и то же решение дважды. Поэтому по умолчанию показываем выбор
   * как подтверждённый, а список открываем только по явной просьбе.
   */
  const [changingTariff, setChangingTariff] = useState(false);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [submitError, setSubmitError] = useState("");

  // Sync externally selected tariff (from "Подключить" card click)
  useEffect(() => {
    if (selectedTariffSlug) {
      setTariff(selectedTariffSlug);
      setTouched((t) => ({ ...t, tariff: true }));
      setChangingTariff(false);
    }
  }, [selectedTariffSlug]);

  // ── Validation ──────────────────────────────────────────────────────────────

  const errors = {
    phone: !rawDigits
      ? errorRequired
      : !isValidKzPhone(rawDigits)
      ? errorPhone
      : "",
    fullName: fullName.trim().length < 2 ? errorRequired : "",
    // Адрес не обязателен: менеджер уточняет его при обзвоне, а лишнее
    // обязательное поле в форме стоит части заявок.
    address: "",
    tariff: !tariff ? errorRequired : "",
    consent: !consent ? errorConsent : "",
  };
  const isFormValid = !Object.values(errors).some(Boolean);

  function touch(field: string) {
    setTouched((t) => ({ ...t, [field]: true }));
  }

  function fieldBorder(field: string) {
    return touched[field] && errors[field as keyof typeof errors]
      ? "1.5px solid var(--danger)"
      : "1.5px solid color-mix(in srgb, var(--ink) 15%, transparent)";
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
    setChangingTariff(false);
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
    border: "1.5px solid color-mix(in srgb, var(--ink) 15%, transparent)",
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

  const chosenRowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "11px 14px",
    borderRadius: "12px",
    border: "1.5px solid var(--brand)",
    background: "var(--brand-soft)",
  };

  const changeBtnStyle: React.CSSProperties = {
    border: "none",
    background: "transparent",
    color: "var(--brand-dark)",
    fontFamily: "inherit",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    textDecoration: "underline",
    padding: "10px 4px",
    minHeight: "44px",
    flexShrink: 0,
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
    color: "var(--danger)",
    marginTop: "4px",
    minHeight: "16px",
    lineHeight: 1.4,
  };

  function onFocusBrand(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    e.currentTarget.style.borderColor = "var(--brand)";
  }
  function onBlurReset(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    e.currentTarget.style.borderColor = "color-mix(in srgb, var(--ink) 15%, transparent)";
  }

  // ── Success screen ──────────────────────────────────────────────────────────

  if (status === "success") {
    return (
      <div className="leadform-success">
        <div style={{ textAlign: "center" }}>
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
              b.style.color = "var(--on-brand)";
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
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────────

  const isDisabled = !isFormValid || status === "submitting";

  return (
    <div className="leadform">
      <div>
        <div style={{ marginBottom: "24px" }}>
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

        {/* Форма живёт в модальном окне: фон, отступы и тень даёт окно,
            здесь остаётся только раскладка полей. */}
        <form
          onSubmit={handleSubmit}
          noValidate
          style={{ display: "flex", flexDirection: "column", gap: "18px" }}
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
            <label htmlFor="address" style={labelStyle}>{labelAddress}</label>
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
            {tariff && !changingTariff ? (
              <div style={chosenRowStyle}>
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true"
                  style={{ color: "var(--brand)", flexShrink: 0 }}>
                  <path d="M3 8.5 L6.3 11.8 L13 5" stroke="currentColor" strokeWidth="2.2"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 12, color: "var(--ink-muted)" }}>
                    {chosenTariffLabel}
                  </span>
                  <strong style={{ fontSize: 15, color: "var(--ink)" }}>
                    {tariffs.find((t) => t.slug === tariff)?.name ?? tariff}
                  </strong>
                </span>
                <button type="button" onClick={() => setChangingTariff(true)} style={changeBtnStyle}>
                  {changeTariffLabel}
                </button>
              </div>
            ) : (
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
            )}
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
              background: isDisabled ? "color-mix(in srgb, var(--ink) 10%, transparent)" : "var(--brand)",
              color: isDisabled ? "var(--ink-muted)" : "var(--on-brand)",
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
                color: "var(--danger)",
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
    </div>
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
        stroke="var(--on-brand)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
