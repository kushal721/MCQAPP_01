import React, { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Eye, EyeOff, Lock, Mail, Shield } from "../../components/icons";
import { errorMessage } from "../../api";
import { useAuth } from "../../lib/auth";
import Logo from "../../components/Logo";
import Spinner, { PageLoader } from "../../components/ui/Spinner";

const Login = () => {
  const { status, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (status === "checking") return <PageLoader label="Checking your session…" />;
  if (status === "signedIn") return <Navigate to={from} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(errorMessage(err, "Couldn't sign in."));
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-paper">
      {/* Brand panel */}
      <div className="hidden w-[44%] border-r border-line bg-paper-sunk lg:block">
        <div className="flex h-full flex-col justify-between p-12">
          <Logo suffix="Admin" />
          <div>
            <h2 className="max-w-md text-5xl font-extrabold leading-[1.05] tracking-tight text-ink">
              Manage the question bank.
            </h2>
            <ul className="mt-8 max-w-md divide-y divide-line-strong border-y border-line-strong text-ink-700">
              {[
                "Create courses and split them into subjects",
                "Write questions with two to six options",
                "Add the explanation students see after answering",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 py-3 text-sm">
                  <Check className="h-4 w-4 shrink-0 text-marigold-700" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <p className="flex items-center gap-2 text-sm text-ink-500">
            <Shield className="h-4 w-4" /> Authorised staff only.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-1 flex-col px-4 py-8 sm:px-8">
        <div className="flex items-center justify-between">
          <div className="lg:hidden">
            <Logo />
          </div>
          <Link
            to="/"
            className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" /> Back to site
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-sm animate-fade-up">
            <h1 className="text-4xl font-extrabold tracking-tight text-ink">Sign in</h1>
            <p className="mt-2 text-sm text-ink-500">
              Use your admin account to access the dashboard.
            </p>

            <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
              <div>
                <label htmlFor="email" className="label">Email</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="username"
                    className="input pl-10"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="label">Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className="input pl-10 pr-11"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-ink-400 hover:text-ink"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-wrong-200 bg-wrong-50 px-4 py-3 text-sm font-medium text-wrong-700"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="btn-primary w-full py-3"
                disabled={submitting || !email || !password}
              >
                {submitting && <Spinner className="h-4 w-4" />}
                Sign in
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-ink-400">
              No account? Ask an existing admin, or create one with{" "}
              <code className="whitespace-nowrap rounded bg-paper-sunk px-1.5 py-0.5 text-ink-700">
                npm run create-admin
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
