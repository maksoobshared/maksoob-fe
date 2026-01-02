import { useState, useEffect } from "react";
import auth from "@/components/services/auth";
import {
  getAccessToken,
  clearAccessToken,
} from "@/components/services/cookies";
import { useAtomValue } from "jotai";
import { sessionAtom } from "@/lib/atoms";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const session = useAtomValue(sessionAtom);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(getAccessToken());
  }, []);

  useEffect(() => {
    if (session?.token) {
      setToken(session.token);
    } else {
      setToken(getAccessToken());
    }
  }, [session?.token]);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await auth.register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      setMessage(res?.message || "Registered successfully");
      setToken(res?.token ?? getAccessToken());
    } catch (err: any) {
      setMessage(err?.message || "Registration failed");
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await auth.login({ email, password });
      console.log("Login response:", res);
      setMessage(res?.message || "Logged in");
      setToken(res?.token ?? getAccessToken());
    } catch (err: any) {
      setMessage(err?.message || "Login failed");
    }
  }

  async function handleLogout() {
    try {
      await auth.logout();
    } catch (e) {
      // ignore
    }
    clearAccessToken();
    setToken(null);
    setMessage("Logged out");
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-slate-800/80 border border-slate-700 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="text-2xl font-semibold">Auth Test</h1>
          {token ? (
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-sm rounded-lg bg-red-500/90 hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : null}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Register */}
          <form
            onSubmit={handleRegister}
            className="space-y-3 bg-slate-900/40 border border-slate-700 rounded-xl p-4"
          >
            <h2 className="text-lg font-semibold">Register</h2>
            <div className="space-y-1">
              <label className="text-sm text-slate-300">Name</label>
              <input
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-slate-300">Email</label>
              <input
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-slate-300">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-slate-300">Confirm Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full mt-2 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-sm font-medium transition"
            >
              Register
            </button>
          </form>

          {/* Login */}
          <form
            onSubmit={handleLogin}
            className="space-y-3 bg-slate-900/40 border border-slate-700 rounded-xl p-4"
          >
            <h2 className="text-lg font-semibold">Login</h2>
            <div className="space-y-1">
              <label className="text-sm text-slate-300">Email</label>
              <input
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-slate-300">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full mt-2 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-sm font-medium transition"
            >
              Login
            </button>
          </form>
        </div>

        {/* Token + message */}
        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-semibold">Token:</span>{" "}
            {token ? (
              <span className="break-all text-xs text-emerald-300">
                {token}
              </span>
            ) : (
              <span className="italic text-slate-400">no token</span>
            )}
          </div>

          {message && (
            <p className="text-sm text-slate-200 bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2">
              {message}
            </p>
          )}
          {session?.name && (
            <div className="text-sm">
              <span className="font-semibold">User Name:</span>{" "}
              <span>{session.name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
