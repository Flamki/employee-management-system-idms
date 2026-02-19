import { useState } from "react";
import api, { setAuthToken } from "../api";

function IdmsLogo() {
  return (
    <svg
      viewBox="602.61 133.49 160.39 39.01"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <defs>
        <linearGradient id="idms-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff00aa" />
          <stop offset=".48" stopColor="#f400b2" />
          <stop offset="1" stopColor="#9600ff" />
        </linearGradient>
      </defs>
      <path fill="url(#idms-g)" d="M602.61,133.49h8.28v39.01h-8.28v-39.01Z" />
      <path
        fill="url(#idms-g)"
        d="M619.76,133.49h20.1c12.59,0,18.92,5.02,18.92,15.13v8.75c0,10.11-6.33,15.13-18.92,15.13h-20.1v-39.01ZM638.67,167.48c7.86,0,11.82-3.13,11.82-9.46v-10.05c0-6.32-3.96-9.46-11.82-9.46h-10.64v28.96h10.64Z"
      />
      <path
        fill="url(#idms-g)"
        d="M667.04,133.49h10.64l14.78,30.97,14.78-30.97h10.64v39.01h-8.28v-27.25l-13,27.25h-8.28l-13-27.25v27.25h-8.28v-39.01Z"
      />
      <path
        fill="url(#idms-g)"
        d="M726.15,167.48h26.6c1.6,0,2.36-.65,2.36-1.89v-9.52c0-1.24-.77-1.89-2.36-1.89h-17.73c-5.91,0-8.87-2.36-8.87-7.09v-6.5c0-4.73,2.96-7.09,8.87-7.09h25.42v5.02h-23.64c-1.6,0-2.36.65-2.36,1.89v6.86c0,1.24.77,1.89,2.36,1.89h17.73c5.91,0,8.87,2.36,8.87,7.09v9.16c0,4.73-2.96,7.09-8.87,7.09h-28.37v-5.02Z"
      />
    </svg>
  );
}

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ identity: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

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
        .ls-root,
        .ls-root * {
          box-sizing: border-box;
          font-family: "IDMSInter", "Inter", sans-serif;
        }

        .ls-root {
          min-height: 100vh;
          display: grid;
          place-items: center;
          background: #f5f5f5;
          margin: 0;
          padding: 0;
        }

        .ls-stage {
          position: relative;
          width: min(1366px, 100vw, calc(100vh * 1366 / 630));
          aspect-ratio: 1366 / 630;
          background: #f5f5f5;
          overflow: hidden;
        }

        .ls-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .ls-card {
          position: absolute;
          left: 33.5286%;
          top: 17.0937%;
          width: 32.9429%;
          height: 65.8111%;
          background: #fff;
          border: 1px solid #ff3296;
          border-radius: 4px;
          box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
        }

        .ls-inner {
          height: 100%;
          padding: 6.2227% 8.2978% 7.7909%;
        }

        .ls-brand {
          display: flex;
          justify-content: center;
        }

        .ls-logo-wrap {
          width: 36.2222%;
        }

        .ls-divider {
          height: 1px;
          width: 66.608%;
          margin-left: auto;
          margin-right: auto;
          margin-top: 4.1485%;
          background: #ff3296;
        }

        .ls-welcome {
          margin-top: 2.6195%;
          text-align: center;
          color: #ff3296;
          font-size: 13px;
          font-weight: 400;
          line-height: 1.15;
        }

        .ls-fields {
          margin-top: 7.2357%;
        }

        .ls-label {
          display: block;
          margin-bottom: 8px;
          color: #4682c8;
          font-size: 13px;
          font-weight: 400;
          line-height: 1.1;
        }

        .ls-field + .ls-field {
          margin-top: 6.4104%;
        }

        .ls-input-row {
          height: 35px;
          border: 0.3px solid #5a5a5a;
          border-radius: 2px;
          background: #fff;
          display: flex;
          align-items: center;
          padding: 0 11px;
        }

        .ls-input-row:focus-within {
          border-color: #4682c8;
        }

        .ls-input-row input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #5a5a5a;
          font-size: 13px;
          font-weight: 400;
          line-height: 1;
          padding: 0;
        }

        .ls-input-row input::placeholder {
          color: #787878;
          opacity: 1;
        }

        .ls-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
          min-height: 14px;
        }

        .ls-check-label {
          display: inline-flex;
          align-items: center;
          color: #5a5a5a;
          font-size: 13px;
          font-weight: 400;
          line-height: 1;
          user-select: none;
          cursor: pointer;
        }

        .ls-check-label.sm {
          gap: 14px;
        }

        .ls-check-label.lg {
          gap: 9px;
        }

        .ls-check-label input[type="checkbox"] {
          appearance: none;
          -webkit-appearance: none;
          background: #fff;
          border: 0.3px solid #5a5a5a;
          border-radius: 1px;
          display: block;
          margin: 0;
          position: relative;
          flex-shrink: 0;
        }

        .ls-check-label.sm input[type="checkbox"] {
          width: 12px;
          height: 12px;
        }

        .ls-check-label.lg input[type="checkbox"] {
          width: 14px;
          height: 14px;
        }

        .ls-check-label input[type="checkbox"]:checked {
          background: #4682c8;
          border-color: #4682c8;
        }

        .ls-check-label input[type="checkbox"]:checked::after {
          content: "";
          position: absolute;
          left: 3px;
          top: 0;
          width: 3px;
          height: 6px;
          border: solid #fff;
          border-width: 0 1.5px 1.5px 0;
          transform: rotate(45deg);
        }

        .ls-check-label.lg input[type="checkbox"]:checked::after {
          left: 4px;
          top: 1px;
        }

        .ls-error {
          margin-top: 7px;
          color: #ff3296;
          font-size: 12px;
          line-height: 1.1;
        }

        .ls-submit {
          width: 100%;
          height: 41.7px;
          margin-top: 37.3px;
          border: 0;
          border-radius: 2.41px;
          background: #4678be;
          color: #fff;
          font-size: 18px;
          font-weight: 400;
          line-height: 1;
          letter-spacing: 0;
          cursor: pointer;
          transition: background 0.12s ease;
        }

        .ls-submit:hover:not(:disabled) {
          background: #3f6fb2;
        }

        .ls-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        @media (max-width: 760px) {
          .ls-stage {
            width: 100vw;
            min-height: 100vh;
            aspect-ratio: auto;
            height: 100vh;
          }

          .ls-card {
            left: 50%;
            top: 12%;
            width: min(450px, calc(100% - 24px));
            height: auto;
            min-height: 414.61px;
            transform: translateX(-50%);
          }

          .ls-inner {
            padding: 25.8px 24px 24px;
          }

          .ls-fields {
            margin-top: 28px;
          }

          .ls-field + .ls-field {
            margin-top: 24px;
          }

          .ls-options {
            margin-top: 18px;
          }

          .ls-submit {
            margin-top: 32px;
          }
        }
      `}</style>

      <div className="ls-root">
        <div className="ls-stage">
          <svg className="ls-bg" viewBox="0 0 1366 630" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="1366" height="630" fill="#f5f5f5" />
            <polygon points="1366,254.47 683,332.23 0,254.48 0,0 1366,0" fill="#4678be" />
          </svg>

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
                        onChange={(e) => setForm((prev) => ({ ...prev, identity: e.target.value }))}
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
                        onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
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
