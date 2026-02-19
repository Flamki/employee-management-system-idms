import { useState } from "react";
import api from "../api";
import { setAuthToken } from "../api";

function IdmsLogo() {
  return (
    <svg viewBox="600 131 165 44" xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <linearGradient id="idms-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0"   stopColor="#ff00aa"/>
          <stop offset=".48" stopColor="#f400b2"/>
          <stop offset="1"   stopColor="#9600ff"/>
        </linearGradient>
      </defs>
      <path fill="url(#idms-g)" d="M602.61,133.49h8.28v39.01h-8.28v-39.01Z"/>
      <path fill="url(#idms-g)" d="M619.76,133.49h20.1c12.59,0,18.92,5.02,18.92,15.13v8.75c0,10.11-6.33,15.13-18.92,15.13h-20.1v-39.01ZM638.67,167.48c7.86,0,11.82-3.13,11.82-9.46v-10.05c0-6.32-3.96-9.46-11.82-9.46h-10.64v28.96h10.64Z"/>
      <path fill="url(#idms-g)" d="M667.04,133.49h10.64l14.78,30.97,14.78-30.97h10.64v39.01h-8.28v-27.25l-13,27.25h-8.28l-13-27.25v27.25h-8.28v-39.01Z"/>
      <path fill="url(#idms-g)" d="M726.15,167.48h26.6c1.6,0,2.36-.65,2.36-1.89v-9.52c0-1.24-.77-1.89-2.36-1.89h-17.73c-5.91,0-8.87-2.36-8.87-7.09v-6.5c0-4.73,2.96-7.09,8.87-7.09h25.42v5.02h-23.64c-1.6,0-2.36.65-2.36,1.89v6.86c0,1.24.77,1.89,2.36,1.89h17.73c5.91,0,8.87,2.36,8.87,7.09v9.16c0,4.73-2.96,7.09-8.87,7.09h-28.37v-5.02Z"/>
    </svg>
  );
}

export default function LoginPage({ onLogin }) {
  const [form, setForm]                 = useState({ identity: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe]     = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError]               = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const res = await api.post("/auth/login", form);
      setAuthToken(res.data.token, rememberMe);
      onLogin?.(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /*
          SVG canvas: 1366 × 630
          Card: w=450 (32.9% of 1366), h=414.61 (65.8% of 630)

          All measurements use --cw (card width) as the base unit so the
          card scales proportionally with the viewport, matching the SVG.

          --cw  = 32.94vw  (450/1366 * 100)
          --ch  = 65.81vh  (414.61/630 * 100)  — used for fixed-height items
          --pad = 8.3% of card width (37.34/450)
        */
        :root {
          --cw:  clamp(320px, 32.94vw, 600px);
          --pad: calc(var(--cw) * 0.083);

          /* All vertical gaps scaled from SVG measurements / card-height ratio */
          /* Using card-height = var(--cw) / 1.085 (aspect ratio 450/414.61) */
          --ch: calc(var(--cw) / 1.0854);

          --gap-top-logo:      calc(var(--ch) * 0.0623);  /* 25.8/414.61  */
          --gap-logo-divider:  calc(var(--ch) * 0.0415);  /* 17.2/414.61  */
          --gap-divider-title: calc(var(--ch) * 0.0262);  /* 10.86/414.61 */
          --gap-title-fields:  calc(var(--ch) * 0.0724);  /* 30/414.61    */
          --gap-field-field:   calc(var(--ch) * 0.0641);  /* 26.58/414.61 */
          --gap-field-opts:    calc(var(--ch) * 0.0483);  /* 20/414.61    */
          --gap-opts-btn:      calc(var(--ch) * 0.0900);  /* 37.3/414.61  */
          --gap-btn-bottom:    calc(var(--ch) * 0.0780);  /* 32.3/414.61  */

          --input-h:  calc(var(--ch) * 0.0844);  /* 35/414.61    */
          --btn-h:    calc(var(--ch) * 0.1006);  /* 41.7/414.61  */

          /* Font sizes scaled from SVG measurements */
          /* SVG font cap-heights measured in absolute px, scaled by ch/414.61 */
          --fs-heading: calc(var(--ch) * 0.0290);  /* ~12px at 414px card  */
          --fs-label:   calc(var(--ch) * 0.0290);  /* ~12px                */
          --fs-input:   calc(var(--ch) * 0.0265);  /* ~11px                */
          --fs-opts:    calc(var(--ch) * 0.0265);  /* ~11px                */
          --fs-btn:     calc(var(--ch) * 0.0314);  /* ~13px                */

          /* Logo: 163/450 = 36.2% of card width */
          --logo-w: calc(var(--cw) * 0.362);

          /* Checkbox sizes */
          --cb-sm: calc(var(--ch) * 0.029);   /* 12px */
          --cb-lg: calc(var(--ch) * 0.0338);  /* 14px */
        }

        .ls-root {
          width: 100vw;
          min-height: 100vh;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Inter-Regular", "Inter", sans-serif;
          position: relative;
          overflow: hidden;
        }

        .ls-bg {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
        }
        .ls-bg svg {
          position: absolute; inset: 0; width: 100%; height: 100%;
        }

        .ls-stage {
          position: relative; z-index: 1;
          display: flex; align-items: center; justify-content: center;
          width: 100%; min-height: 100vh;
          padding: 24px 16px;
        }

        /* Card: w=32.94vw, border=#ff3296, rx=4px, drop-shadow */
        .ls-card {
          background: #fff;
          border: 1px solid #ff3296;
          border-radius: 4px;
          box-shadow: 0 0 6px rgba(0,0,0,0.20);
          width: var(--cw);
        }

        .ls-inner {
          padding: var(--gap-top-logo) var(--pad) var(--gap-btn-bottom);
        }

        /* Brand: logo centered, width = 36.2% of card */
        .ls-brand {
          display: flex;
          justify-content: center;
        }
        .ls-logo-wrap {
          width: var(--logo-w);
        }

        /* Pink divider — tapers at ends */
        .ls-divider {
          height: 1px;
          margin-top: var(--gap-logo-divider);
          background: linear-gradient(to right,
            transparent 0%, #ff3296 12%, #ff3296 88%, transparent 100%
          );
        }

        /* Pink heading */
        .ls-welcome {
          text-align: center;
          font-size: var(--fs-heading);
          font-weight: 400;
          color: #ff3296;
          letter-spacing: 0.02em;
          margin-top: var(--gap-divider-title);
        }

        /* Fields container */
        .ls-fields {
          margin-top: var(--gap-title-fields);
        }

        /* Field labels */
        .ls-label {
          display: block;
          font-size: var(--fs-label);
          font-weight: 400;
          color: #4682c8;
          letter-spacing: 0.01em;
          margin-bottom: calc(var(--ch) * 0.0193); /* ~8px */
        }

        /* Input rows: h=35px in SVG */
        .ls-input-row {
          display: flex;
          align-items: center;
          border: 0.3px solid #5a5a5a;
          border-radius: 2px;
          height: var(--input-h);
          padding: 0 calc(var(--cw) * 0.022);
          background: #fff;
        }
        .ls-input-row:focus-within {
          border-color: #4682c8;
        }
        .ls-input-row input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: var(--fs-input);
          font-family: inherit;
          color: #5a5a5a;
          min-width: 0;
        }
        .ls-input-row input::placeholder {
          color: #b8b8b8;
        }

        /* Gap between field groups */
        .ls-field + .ls-field {
          margin-top: var(--gap-field-field);
        }

        /* Options row */
        .ls-options {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: calc(var(--cw) * 0.02);
          margin-top: var(--gap-field-opts);
        }

        .ls-check-label {
          display: flex;
          align-items: center;
          gap: calc(var(--cw) * 0.013);
          font-size: var(--fs-opts);
          font-weight: 400;
          color: #5a5a5a;
          cursor: pointer;
          user-select: none;
        }

        /* Left checkbox 12×12 */
        .ls-check-label.sm input[type="checkbox"] {
          appearance: none;
          -webkit-appearance: none;
          width: var(--cb-sm);
          height: var(--cb-sm);
          min-width: var(--cb-sm);
          border: 0.3px solid #5a5a5a;
          border-radius: 1px;
          background: #fff;
          cursor: pointer;
          flex-shrink: 0;
          position: relative;
        }

        /* Right checkbox 14×14 */
        .ls-check-label.lg input[type="checkbox"] {
          appearance: none;
          -webkit-appearance: none;
          width: var(--cb-lg);
          height: var(--cb-lg);
          min-width: var(--cb-lg);
          border: 0.3px solid #5a5a5a;
          border-radius: 1px;
          background: #fff;
          cursor: pointer;
          flex-shrink: 0;
          position: relative;
        }

        .ls-check-label input[type="checkbox"]:checked {
          background: #4682c8;
          border-color: #4682c8;
        }

        /* Perfectly centered checkmark */
        .ls-check-label input[type="checkbox"]:checked::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 55%;
          height: 30%;
          border-left: 1.5px solid #fff;
          border-bottom: 1.5px solid #fff;
          transform: translate(-50%, -65%) rotate(-45deg);
        }

        .ls-error {
          margin-top: calc(var(--ch) * 0.019);
          font-size: var(--fs-opts);
          color: #ff3296;
        }

        /* Login button: h=41.7px, rx=2.41, fill=#4678be */
        .ls-submit {
          display: block;
          width: 100%;
          height: var(--btn-h);
          margin-top: var(--gap-opts-btn);
          background: #4678be;
          color: #fff;
          border: none;
          border-radius: 2.41px;
          font-size: var(--fs-btn);
          font-weight: 400;
          font-family: inherit;
          cursor: pointer;
          letter-spacing: 0.06em;
          transition: background 0.12s;
        }
        .ls-submit:hover:not(:disabled) { background: #3869ad; }
        .ls-submit:disabled { opacity: 0.65; cursor: not-allowed; }
      `}</style>

      <div className="ls-root">
        <div className="ls-bg">
          <svg viewBox="0 0 1366 630" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <rect width="1366" height="630" fill="#f5f5f5"/>
            <polygon points="1366,254.47 683,332.23 0,254.48 0,0 1366,0" fill="#4678be"/>
          </svg>
        </div>

        <div className="ls-stage">
          <div className="ls-card">
            <div className="ls-inner">

              <div className="ls-brand">
                <div className="ls-logo-wrap">
                  <IdmsLogo />
                </div>
              </div>

              <div className="ls-divider" />

              <div className="ls-welcome">Welcome to HR Admin Panel</div>

              <form onSubmit={submit}>
                <div className="ls-fields">

                  <div className="ls-field">
                    <label className="ls-label">Username</label>
                    <div className="ls-input-row">
                      <input
                        type="text"
                        placeholder="Enter Username"
                        value={form.identity}
                        onChange={(e) => setForm((p) => ({ ...p, identity: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="ls-field">
                    <label className="ls-label">Enter Password</label>
                    <div className="ls-input-row">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Password"
                        value={form.password}
                        onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                </div>

                <div className="ls-options">
                  <label className="ls-check-label sm">
                    <input
                      type="checkbox"
                      checked={showPassword}
                      onChange={(e) => setShowPassword(e.target.checked)}
                    />
                    Show Password
                  </label>
                  <label className="ls-check-label lg">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    Remember Me
                  </label>
                </div>

                {error && <p className="ls-error">{error}</p>}

                <button className="ls-submit" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Signing in..." : "Login"}
                </button>

              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

