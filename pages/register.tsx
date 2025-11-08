import { useState, useEffect } from "react";
import auth from "@/components/services/auth";
import {
  getAccessToken,
  clearAccessToken,
} from "@/components/services/cookies";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(getAccessToken());
  }, []);

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
      // If token is set by auth.register, refresh local token state
      setToken(getAccessToken());
    } catch (err: any) {
      setMessage(err?.message || "Registration failed");
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await auth.login({ email, password });
      setMessage(res?.message || "Logged in");
      setToken(getAccessToken());
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
    <div style={{ padding: 20 }}>
      <h1>Auth test</h1>

      <form onSubmit={handleRegister} style={{ marginBottom: 20 }}>
        <h2>Register</h2>
        <div>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Confirm</label>
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />
        </div>
        <button type="submit">Register</button>
      </form>

      <form onSubmit={handleLogin} style={{ marginBottom: 20 }}>
        <h2>Login</h2>
        <div>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>

      <div style={{ marginTop: 20 }}>
        <strong>Token:</strong>{" "}
        {token ? (
          <span style={{ wordBreak: "break-all" }}>{token}</span>
        ) : (
          <em>no token</em>
        )}
      </div>

      {token ? (
        <div style={{ marginTop: 12 }}>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : null}

      {message ? <p style={{ marginTop: 12 }}>{message}</p> : null}
    </div>
  );
}
