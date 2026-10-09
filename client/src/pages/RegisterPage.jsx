import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  EVENT,
  TRACKS,
  POPULAR_COLLEGES,
  DEPARTMENTS,
  YEARS,
} from "../config/event.js";
import {
  TbArrowLeft,
  TbArrowRight,
  TbCheck,
  TbAlertCircle,
  TbCopy,
  TbSparkles,
  TbClock,
  TbLock,
} from "react-icons/tb";
import "../styles/register.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const STORAGE_KEY = "aimpact_reg_draft_v1";

const initialMember = (isLeader = false) => ({
  name: "",
  email: "",
  phone: "",
  college: "A.P. Shah Institute of Technology",
  department: "CSE (AI&ML)",
  year: "TE",
  github: "",
  linkedin: "",
  diet: "veg",
  tshirt: "L",
  isLeader,
});

export default function RegisterPage() {
  const navigate = useNavigate();

  // Step state: 1: Team, 2: Members, 3: Review
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Stats / status
  const [stats, setStats] = useState({ open: true, spotsLeft: 150 });
  const [statsLoaded, setStatsLoaded] = useState(false);

  // Form State
  const [formData, setFormData] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!TRACKS.some((t) => t.id === parsed.track)) {
          parsed.track = TRACKS[0]?.id || "ai-education";
        }
        if (parsed.pptUrl === undefined) parsed.pptUrl = "";
        if (parsed.demoVideoUrl === undefined) parsed.demoVideoUrl = "";
        if (parsed.members && Array.isArray(parsed.members)) {
          parsed.members.forEach((m) => {
            if (!DEPARTMENTS.includes(m.department)) {
              m.department = DEPARTMENTS[0];
            }
          });
        }
        return parsed;
      }
    } catch {
      // fallback
    }
    return {
      teamName: "",
      track: TRACKS[0]?.id || "ai-education",
      teamSize: 3,
      idea: "",
      pptUrl: "",
      demoVideoUrl: "",
      members: [initialMember(true), initialMember(false), initialMember(false)],
      consent: { codeOfConduct: false, updates: false },
      website_hp: "", // Honeypot
      formStartedAt: Date.now(),
    };
  });

  // Autosave to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch {
      // ignore
    }
  }, [formData]);

  // Fetch live stats & registration state
  useEffect(() => {
    fetch(`${API_BASE}/api/stats`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setStats(data);
        }
      })
      .catch(() => {})
      .finally(() => setStatsLoaded(true));
  }, []);

  // Sync members length with teamSize
  const handleTeamSizeChange = (newSize) => {
    setFormData((prev) => {
      let currentMembers = [...prev.members];
      if (newSize > currentMembers.length) {
        while (currentMembers.length < newSize) {
          currentMembers.push(initialMember(false));
        }
      } else if (newSize < currentMembers.length) {
        currentMembers = currentMembers.slice(0, newSize);
      }
      return { ...prev, teamSize: newSize, members: currentMembers };
    });
  };

  const updateMember = (index, field, value) => {
    setFormData((prev) => {
      const newMembers = [...prev.members];
      newMembers[index] = { ...newMembers[index], [field]: value };
      return { ...prev, members: newMembers };
    });
    // clear field error on change
    const key = `members.${index}.${field}`;
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }
  };

  const copyCollegeFromLeader = (index) => {
    const leaderCollege = formData.members[0]?.college || "A.P. Shah Institute of Technology";
    updateMember(index, "college", leaderCollege);
  };

  const isValidUrl = (str) => {
    if (!str) return false;
    const urlStr = str.match(/^https?:\/\//i) ? str : `https://${str}`;
    try {
      const u = new URL(urlStr);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  };

  // Validation routines
  const validateStep1 = () => {
    const errors = {};
    if (!formData.teamName || formData.teamName.trim().length < 3) {
      errors.teamName = "Team name must be at least 3 characters";
    } else if (formData.teamName.trim().length > 40) {
      errors.teamName = "Team name cannot exceed 40 characters";
    }
    if (!formData.track) {
      errors.track = "Please select a track";
    }
    if (!formData.teamSize || formData.teamSize < EVENT.minTeamSize || formData.teamSize > EVENT.maxTeamSize) {
      errors.teamSize = `Team size must be between ${EVENT.minTeamSize} and ${EVENT.maxTeamSize}`;
    }
    if (!formData.pptUrl || !formData.pptUrl.trim()) {
      errors.pptUrl = "Presentation / Pitch Deck link is required (e.g. Google Drive link)";
    } else if (!isValidUrl(formData.pptUrl.trim())) {
      errors.pptUrl = "Please enter a valid link for your PPT (e.g. https://drive.google.com/...)";
    }
    if (formData.demoVideoUrl && formData.demoVideoUrl.trim() && !isValidUrl(formData.demoVideoUrl.trim())) {
      errors.demoVideoUrl = "Please enter a valid link for your prototype demo video";
    }
    return errors;
  };

  const validateStep2 = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;

    const emails = new Set();
    const phones = new Set();

    formData.members.forEach((m, idx) => {
      const prefix = `members.${idx}`;
      if (!m.name || m.name.trim().length < 2) {
        errors[`${prefix}.name`] = "Full name is required (min 2 characters)";
      }
      if (!m.email || !emailRegex.test(m.email.trim())) {
        errors[`${prefix}.email`] = "Enter a valid college email address";
      } else {
        const norm = m.email.trim().toLowerCase();
        if (emails.has(norm)) {
          errors[`${prefix}.email`] = "Duplicate email in team roster";
        }
        emails.add(norm);
      }

      const cleanPhone = m.phone.replace(/[\s-]/g, "");
      if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
        errors[`${prefix}.phone`] = "Enter a valid 10-digit Indian mobile number";
      } else {
        const stripped = cleanPhone.replace(/^(?:\+91|91|0)/, "");
        if (phones.has(stripped)) {
          errors[`${prefix}.phone`] = "Duplicate phone in team roster";
        }
        phones.add(stripped);
      }

      if (!m.college || m.college.trim().length < 2) {
        errors[`${prefix}.college`] = "College name is required";
      }
      if (!m.department || m.department.trim().length < 2) {
        errors[`${prefix}.department`] = "Department is required";
      }
      if (!m.year || !["SE", "TE"].includes(m.year)) {
        errors[`${prefix}.year`] = "Select academic year";
      }
    });

    return errors;
  };
  const goToStep2 = () => {
    const errors = validateStep1();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setServerError("");
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToStep3 = () => {
    const errors = validateStep2();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setServerError("");
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!formData.consent.codeOfConduct) {
      setServerError("Please accept the Code of Conduct to proceed.");
      return;
    }
    if (!formData.consent.updates) {
      setServerError("Please consent to receive event updates.");
      return;
    }

    setSubmitting(true);
    setServerError("");

    try {
      const payload = {
        teamName: formData.teamName.trim(),
        track: formData.track,
        teamSize: Number(formData.teamSize),
        idea: formData.idea?.trim() || "",
        pptUrl: formData.pptUrl.trim(),
        demoVideoUrl: formData.demoVideoUrl?.trim() || "",
        members: formData.members.map((m) => ({
          name: m.name.trim(),
          email: m.email.trim().toLowerCase(),
          phone: m.phone.replace(/[\s-]/g, "").replace(/^(?:\+91|91|0)/, ""),
          college: m.college.trim(),
          department: m.department.trim(),
          year: m.year,
          isLeader: Boolean(m.isLeader),
          github: m.github?.trim() || "",
          linkedin: m.linkedin?.trim() || "",
          diet: m.diet || "veg",
          tshirt: m.tshirt || "L",
        })),
        consent: {
          codeOfConduct: true,
          updates: true,
        },
        website_hp: formData.website_hp,
        formStartedAt: formData.formStartedAt,
      };

      const res = await fetch(`${API_BASE}/api/registrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error?.fields) {
          setFieldErrors(data.error.fields);
          // If field belongs to step 1, jump there
          if (data.error.fields.teamName || data.error.fields.track || data.error.fields.pptUrl || data.error.fields.demoVideoUrl) {
            setStep(1);
          } else if (Object.keys(data.error.fields).some((k) => k.startsWith("members") || k === "email" || k === "phone")) {
            setStep(2);
          }
        }
        throw new Error(data.error?.message || "Registration failed. Please check your information.");
      }

      // Clear draft on success
      sessionStorage.removeItem(STORAGE_KEY);

      // Navigate to success page
      navigate(`/success/${data.regId}`, {
        state: {
          teamName: data.teamName,
          regId: data.regId,
          track: data.track,
          pptUrl: data.pptUrl || formData.pptUrl,
          demoVideoUrl: data.demoVideoUrl || formData.demoVideoUrl,
          memberCount: data.memberCount,
          members: data.members,
        },
      });
    } catch (err) {
      setServerError(err.message);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  const isClosed = statsLoaded && (!stats.open || stats.spotsLeft <= 0);

  if (isClosed) {
    return (
      <div className="reg-page">
        <div className="reg-container" style={{ textAlign: "center", paddingTop: "80px" }}>
          <div className="form-card">
            <TbAlertCircle style={{ fontSize: "56px", color: "#ff6b6b", marginBottom: "16px" }} />
            <h1 className="reg-title">Registrations Are Closed</h1>
            <p className="reg-subtitle" style={{ maxWidth: "500px", margin: "0 auto 24px" }}>
              All 150 team spots for AIMPACT 2026 have been filled or the submission deadline has elapsed.
            </p>
            <Link to="/" className="btn btn--solid">
              &larr; Back to Hackathon Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reg-page">
      <div className="reg-bg-glow" aria-hidden="true" />

      <datalist id="colleges-list">
        {POPULAR_COLLEGES.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>

      <div className="reg-container">
        {/* Top bar */}
        <div className="reg-topbar">
          <Link to="/" className="reg-back-link">
            <TbArrowLeft aria-hidden="true" /> Home
          </Link>
          <div className="reg-spots-badge">
            <span className="reg-spots-dot" aria-hidden="true" />
            <span>{stats.spotsLeft} spots remaining</span>
          </div>
        </div>

        {/* Page Title */}
        <header className="reg-header">
          <h1 className="reg-title">Register Your Squad</h1>
          <p className="reg-subtitle">
            Sprint to impact. Form a team of 2–4 minds and register in under 90 seconds.
          </p>
        </header>

        {/* Stepper Progress */}
        <nav className="stepper-nav" aria-label="Registration Progress">
          <div className="stepper-progress-bg">
            <div
              className="stepper-progress-fill"
              style={{
                width: step === 1 ? "0%" : step === 2 ? "50%" : "100%",
              }}
            />
          </div>

          <button
            type="button"
            className={`stepper-step ${step === 1 ? "stepper-step--active" : step > 1 ? "stepper-step--completed" : ""}`}
            onClick={() => setStep(1)}
            aria-current={step === 1 ? "step" : undefined}
          >
            <span className="stepper-circle">{step > 1 ? <TbCheck /> : "1"}</span>
            <span className="stepper-label">Team</span>
          </button>

          <button
            type="button"
            className={`stepper-step ${step === 2 ? "stepper-step--active" : step > 2 ? "stepper-step--completed" : ""}`}
            onClick={goToStep2}
            aria-current={step === 2 ? "step" : undefined}
          >
            <span className="stepper-circle">{step > 2 ? <TbCheck /> : "2"}</span>
            <span className="stepper-label">Members</span>
          </button>

          <button
            type="button"
            className={`stepper-step ${step === 3 ? "stepper-step--active" : ""}`}
            onClick={goToStep3}
            aria-current={step === 3 ? "step" : undefined}
          >
            <span className="stepper-circle">3</span>
            <span className="stepper-label">Review</span>
          </button>
        </nav>

        {/* Server Error Alert */}
        {serverError && (
          <div className="server-error-banner" role="alert">
            <TbAlertCircle style={{ verticalAlign: "middle", marginRight: "6px", fontSize: "18px" }} />
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Honeypot field (hidden from view) */}
          <div style={{ display: "none" }} aria-hidden="true">
            <label htmlFor="website_hp">Leave this empty</label>
            <input
              type="text"
              id="website_hp"
              name="website_hp"
              tabIndex={-1}
              autoComplete="off"
              value={formData.website_hp}
              onChange={(e) => setFormData({ ...formData, website_hp: e.target.value })}
            />
          </div>

          {/* ==================== STEP 1: TEAM ==================== */}
          {step === 1 && (
            <section className="form-card" aria-labelledby="step1-title">
              <h2 id="step1-title" className="form-step-title">
                1. Team Details
              </h2>
              <p className="form-step-desc">Pick your team name, track, and squad size.</p>

              {/* Team Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="teamName">
                  Team Name <span className="req">*</span>
                </label>
                <input
                  id="teamName"
                  className={`form-input ${fieldErrors.teamName ? "form-input--error" : ""}`}
                  type="text"
                  placeholder="e.g. NeuralKnights, Synthetix, CyberPulse"
                  maxLength={40}
                  value={formData.teamName}
                  onChange={(e) => {
                    setFormData({ ...formData, teamName: e.target.value });
                    if (fieldErrors.teamName) {
                      setFieldErrors({ ...fieldErrors, teamName: null });
                    }
                  }}
                  onBlur={() => setTouched({ ...touched, teamName: true })}
                  autoFocus
                />
                {fieldErrors.teamName && <span className="form-error">{fieldErrors.teamName}</span>}
                <span className="form-hint">3–40 characters, case-insensitive uniqueness.</span>
              </div>

              {/* Track Selection */}
              <div className="form-group">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "6px" }}>
                  <label className="form-label" style={{ marginBottom: "2px" }}>
                    Select Hackathon Track <span className="req">*</span>
                  </label>
                  <span style={{ fontSize: "11px", color: "var(--teal-soft)", letterSpacing: "0.5px" }}>
                    100% Open-Ended Innovation
                  </span>
                </div>
                <span className="form-hint" style={{ marginBottom: "10px", display: "block" }}>
                  Full creative freedom: You are open to build any idea or solution that addresses problems in the chosen track.
                </span>
                <div className="track-radio-group" role="radiogroup">
                  {TRACKS.map((t) => {
                    const isSelected = formData.track === t.id;
                    return (
                      <div
                        key={t.id}
                        role="radio"
                        aria-checked={isSelected}
                        tabIndex={0}
                        className={`track-radio-card ${isSelected ? "track-radio-card--selected" : ""}`}
                        onClick={() => setFormData({ ...formData, track: t.id })}
                        onKeyDown={(e) => {
                          if (e.key === " " || e.key === "Enter") {
                            setFormData({ ...formData, track: t.id });
                          }
                        }}
                      >
                        <span className="track-radio-title">{t.label}</span>
                        <span className="track-radio-blurb">{t.blurb}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Team Size */}
              <div className="form-group">
                <label className="form-label">
                  Team Size <span className="req">*</span>
                </label>
                <div className="size-selector" role="group" aria-label="Select squad member count">
                  {[2, 3, 4].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      className={`size-pill ${formData.teamSize === sz ? "size-pill--selected" : ""}`}
                      onClick={() => handleTeamSizeChange(sz)}
                    >
                      {sz} Members
                    </button>
                  ))}
                </div>
              </div>


              {/* PPT / Pitch Deck Link (Compulsory) */}
              <div className="form-group">
                <label className="form-label" htmlFor="pptUrl">
                  Presentation / Pitch Deck (Google Drive Link) <span className="req">*</span>
                </label>
                <input
                  id="pptUrl"
                  type="url"
                  className={`form-input ${fieldErrors.pptUrl ? "form-input--error" : ""}`}
                  placeholder="https://drive.google.com/file/d/... or share link"
                  value={formData.pptUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, pptUrl: e.target.value });
                    if (fieldErrors.pptUrl) {
                      setFieldErrors({ ...fieldErrors, pptUrl: null });
                    }
                  }}
                  onBlur={() => setTouched({ ...touched, pptUrl: true })}
                />
                {fieldErrors.pptUrl && <span className="form-error">{fieldErrors.pptUrl}</span>}
                <span className="form-hint">
                  Ensure Google Drive link sharing is set to <strong>"Anyone with the link can view"</strong>.
                </span>
              </div>

              {/* Demo Video Link (Optional) */}
              <div className="form-group">
                <label className="form-label" htmlFor="demoVideoUrl">
                  Prototype Demo Video Link (Google Drive / YouTube) (Optional)
                </label>
                <input
                  id="demoVideoUrl"
                  type="url"
                  className={`form-input ${fieldErrors.demoVideoUrl ? "form-input--error" : ""}`}
                  placeholder="https://drive.google.com/... or YouTube link"
                  value={formData.demoVideoUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, demoVideoUrl: e.target.value });
                    if (fieldErrors.demoVideoUrl) {
                      setFieldErrors({ ...fieldErrors, demoVideoUrl: null });
                    }
                  }}
                  onBlur={() => setTouched({ ...touched, demoVideoUrl: true })}
                />
                {fieldErrors.demoVideoUrl && <span className="form-error">{fieldErrors.demoVideoUrl}</span>}
                <span className="form-hint">
                  Optional: Short 1–2 minute walkthrough or demo video of your prototype.
                </span>
              </div>

              <div className="form-actions" style={{ justifyContent: "flex-end" }}>
                <button type="button" className="btn btn--solid" onClick={goToStep2}>
                  Next: Member Details <TbArrowRight aria-hidden="true" />
                </button>
              </div>
            </section>
          )}

          {/* ==================== STEP 2: MEMBERS ==================== */}
          {step === 2 && (
            <section className="form-card" aria-labelledby="step2-title">
              <h2 id="step2-title" className="form-step-title">
                2. Member Rosters ({formData.members.length} Members)
              </h2>
              <p className="form-step-desc">
                Member 1 is designated as the Team Leader. Fill contact and academic details.
              </p>

              {formData.members.map((member, idx) => {
                const prefix = `members.${idx}`;
                const isLeader = idx === 0;

                return (
                  <div key={idx} className="member-block">
                    <div className="member-block-header">
                      <h3 className="member-block-title">
                        Member #{idx + 1} {isLeader && <span className="leader-badge">TEAM LEADER</span>}
                      </h3>

                      {!isLeader && (
                        <button
                          type="button"
                          className="copy-college-btn"
                          onClick={() => copyCollegeFromLeader(idx)}
                        >
                          <TbCopy style={{ verticalAlign: "middle", marginRight: "4px" }} />
                          Copy College from Leader
                        </button>
                      )}
                    </div>

                    <div className="form-grid-2">
                      {/* Name */}
                      <div className="form-group">
                        <label className="form-label" htmlFor={`${prefix}.name`}>
                          Full Name <span className="req">*</span>
                        </label>
                        <input
                          id={`${prefix}.name`}
                          type="text"
                          className={`form-input ${fieldErrors[`${prefix}.name`] ? "form-input--error" : ""}`}
                          placeholder="e.g. Aarav Sharma"
                          value={member.name}
                          onChange={(e) => updateMember(idx, "name", e.target.value)}
                        />
                        {fieldErrors[`${prefix}.name`] && (
                          <span className="form-error">{fieldErrors[`${prefix}.name`]}</span>
                        )}
                      </div>

                      {/* Email */}
                      <div className="form-group">
                        <label className="form-label" htmlFor={`${prefix}.email`}>
                          College Email <span className="req">*</span>
                        </label>
                        <input
                          id={`${prefix}.email`}
                          type="email"
                          className={`form-input ${fieldErrors[`${prefix}.email`] ? "form-input--error" : ""}`}
                          placeholder="e.g. 000000@apsit.edu.in"
                          value={member.email}
                          onChange={(e) => updateMember(idx, "email", e.target.value)}
                        />
                        {fieldErrors[`${prefix}.email`] && (
                          <span className="form-error">{fieldErrors[`${prefix}.email`]}</span>
                        )}
                      </div>
                    </div>

                    <div className="form-grid-2">
                      {/* Phone */}
                      <div className="form-group">
                        <label className="form-label" htmlFor={`${prefix}.phone`}>
                          Mobile Number (+91) <span className="req">*</span>
                        </label>
                        <input
                          id={`${prefix}.phone`}
                          type="tel"
                          maxLength={15}
                          className={`form-input ${fieldErrors[`${prefix}.phone`] ? "form-input--error" : ""}`}
                          placeholder="10-digit Indian Mobile"
                          value={member.phone}
                          onChange={(e) => updateMember(idx, "phone", e.target.value)}
                        />
                        {fieldErrors[`${prefix}.phone`] && (
                          <span className="form-error">{fieldErrors[`${prefix}.phone`]}</span>
                        )}
                      </div>

                      {/* College */}
                      <div className="form-group">
                        <label className="form-label" htmlFor={`${prefix}.college`}>
                          College / Institute <span className="req">*</span>
                        </label>
                        <input
                          id={`${prefix}.college`}
                          type="text"
                          list="colleges-list"
                          className={`form-input ${fieldErrors[`${prefix}.college`] ? "form-input--error" : ""}`}
                          placeholder="Type or pick college"
                          value={member.college}
                          onChange={(e) => updateMember(idx, "college", e.target.value)}
                        />
                        {fieldErrors[`${prefix}.college`] && (
                          <span className="form-error">{fieldErrors[`${prefix}.college`]}</span>
                        )}
                      </div>
                    </div>

                    <div className="form-grid-2">
                      {/* Department */}
                      <div className="form-group">
                        <label className="form-label" htmlFor={`${prefix}.department`}>
                          Department <span className="req">*</span>
                        </label>
                        <select
                          id={`${prefix}.department`}
                          className="form-select"
                          value={member.department}
                          onChange={(e) => updateMember(idx, "department", e.target.value)}
                        >
                          {DEPARTMENTS.map((dept) => (
                            <option key={dept} value={dept}>
                              {dept}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Academic Year */}
                      <div className="form-group">
                        <label className="form-label">
                          Academic Year (2nd & 3rd Year Only) <span className="req">*</span>
                        </label>
                        <div className="year-pills" role="radiogroup">
                          {YEARS.map((y) => (
                            <button
                              key={y.value}
                              type="button"
                              className={`year-pill ${member.year === y.value ? "year-pill--selected" : ""}`}
                              onClick={() => updateMember(idx, "year", y.value)}
                            >
                              {y.label || y.value}
                            </button>
                          ))}
                        </div>
                        {fieldErrors[`${prefix}.year`] && (
                          <span className="form-error">{fieldErrors[`${prefix}.year`]}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="form-actions">
                <button type="button" className="btn btn--ghost" onClick={() => setStep(1)}>
                  <TbArrowLeft aria-hidden="true" /> Back to Team
                </button>
                <button type="button" className="btn btn--solid" onClick={goToStep3}>
                  Review & Confirm <TbArrowRight aria-hidden="true" />
                </button>
              </div>
            </section>
          )}

          {/* ==================== STEP 3: REVIEW ==================== */}
          {step === 3 && (
            <section className="form-card" aria-labelledby="step3-title">
              <h2 id="step3-title" className="form-step-title">
                3. Review and Confirm
              </h2>
              <p className="form-step-desc">
                Review your submission. Once confirmed, an official Registration ID will be assigned and confirmation sent.
              </p>

              {/* Team Review */}
              <div className="review-section">
                <div className="review-section-header">
                  <h3 className="review-section-title">Team Overview</h3>
                  <button type="button" className="review-edit-btn" onClick={() => setStep(1)}>
                    Edit Team
                  </button>
                </div>
                <div className="review-grid">
                  <div className="review-item">
                    <label>Team Name</label>
                    <value>{formData.teamName}</value>
                  </div>
                  <div className="review-item">
                    <label>Track</label>
                    <value>{TRACKS.find((t) => t.id === formData.track)?.label || formData.track}</value>
                  </div>
                  <div className="review-item">
                    <label>Team Size</label>
                    <value>{formData.teamSize} Members</value>
                  </div>
                  {formData.idea && (
                    <div className="review-item" style={{ gridColumn: "1 / -1" }}>
                      <label>Idea Statement</label>
                      <value>{formData.idea}</value>
                    </div>
                  )}
                  {formData.pptUrl && (
                    <div className="review-item" style={{ gridColumn: "1 / -1" }}>
                      <label>Pitch Deck / PPT (Google Drive)</label>
                      <value>
                        <a
                          href={formData.pptUrl.match(/^https?:\/\//i) ? formData.pptUrl : `https://${formData.pptUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "var(--teal-soft)", textDecoration: "underline", wordBreak: "break-all" }}
                        >
                          {formData.pptUrl}
                        </a>
                      </value>
                    </div>
                  )}
                  {formData.demoVideoUrl && (
                    <div className="review-item" style={{ gridColumn: "1 / -1" }}>
                      <label>Prototype Demo Video</label>
                      <value>
                        <a
                          href={formData.demoVideoUrl.match(/^https?:\/\//i) ? formData.demoVideoUrl : `https://${formData.demoVideoUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "var(--teal-soft)", textDecoration: "underline", wordBreak: "break-all" }}
                        >
                          {formData.demoVideoUrl}
                        </a>
                      </value>
                    </div>
                  )}
                </div>
              </div>

              {/* Members Review */}
              <div className="review-section">
                <div className="review-section-header">
                  <h3 className="review-section-title">Member Roster</h3>
                  <button type="button" className="review-edit-btn" onClick={() => setStep(2)}>
                    Edit Members
                  </button>
                </div>

                <div className="review-members-grid">
                  {formData.members.map((m, idx) => (
                    <div key={idx} className="review-member-card">
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <strong style={{ color: "#fff" }}>{m.name || `Member ${idx + 1}`}</strong>
                        {idx === 0 && <span className="leader-badge">LEADER</span>}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--teal-soft)", marginBottom: "4px" }}>
                        {m.email}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--rose)", marginBottom: "2px" }}>
                        {m.college}
                      </div>
                      <div style={{ fontSize: "11px", color: "#a0808a" }}>
                        {m.department} • {m.year}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consent Checkboxes */}
              <div className="consent-group">
                <label className="consent-label">
                  <input
                    type="checkbox"
                    className="consent-checkbox"
                    checked={formData.consent.codeOfConduct}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        consent: { ...formData.consent, codeOfConduct: e.target.checked },
                      })
                    }
                  />
                  <span>
                    I and all team members agree to abide by the <strong>AIMPACT Code of Conduct</strong>,
                    guaranteeing original work, fair collaboration, and respectful campus conduct.
                  </span>
                </label>

                <label className="consent-label">
                  <input
                    type="checkbox"
                    className="consent-checkbox"
                    checked={formData.consent.updates}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        consent: { ...formData.consent, updates: e.target.checked },
                      })
                    }
                  />
                  <span>
                    I consent to receive important hackathon schedule alerts, venue passes, and updates via email
                    and the official WhatsApp announcement group.
                  </span>
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn--ghost" onClick={() => setStep(2)}>
                  <TbArrowLeft aria-hidden="true" /> Back
                </button>

                <button
                  type="submit"
                  className="btn btn--solid btn--large"
                  disabled={submitting || !formData.consent.codeOfConduct || !formData.consent.updates}
                >
                  {submitting ? (
                    <>
                      <TbClock className="animate-spin" aria-hidden="true" /> Registering Team...
                    </>
                  ) : (
                    <>
                      <TbSparkles aria-hidden="true" /> Confirm & Register Team
                    </>
                  )}
                </button>
              </div>
            </section>
          )}
        </form>
      </div>
    </div>
  );
}
