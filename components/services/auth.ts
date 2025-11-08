import { API_V1 } from "./apis";
import { get, post } from "./http";
import { setAccessToken, clearAccessToken } from "./cookies";
import { setSession, clearSession } from "../../lib/atoms";
import type {
  RegisterPayload,
  LoginPayload,
  ForgotPayload,
  ResetPayload,
  RegisterResponse,
  LoginResponse,
  MessageResponse,
  User,
} from "../types";

// Register
export async function register(
  payload: RegisterPayload
): Promise<RegisterResponse> {
  const res = await post<RegisterResponse>(`${API_V1}/auth/register`, payload);
  const { token, user } = normalizeAuthResponse(res);
  if (token) {
    setSession({
      token,
      email: user?.email ?? null,
      name: user?.name ?? null,
      id: user?.id ?? null,
    });
    try {
      setAccessToken(token);
    } catch (e) {
      /* ignore cookie set errors */
    }
  }
  return res;
}

// Login
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await post<LoginResponse>(`${API_V1}/auth/login`, payload);
  const { token, user } = normalizeAuthResponse(res);
  if (token) {
    setSession({
      token,
      email: user?.email ?? null,
      name: user?.name ?? null,
      id: user?.id ?? null,
    });
    try {
      setAccessToken(token);
    } catch (e) {
      /* ignore */
    }
  } else {
    clearSessionSafely();
  }
  return res;
}

// Forgot password
export async function forgotPassword(
  payload: ForgotPayload
): Promise<MessageResponse> {
  return post<MessageResponse>(`${API_V1}/auth/forgot-password`, payload);
}

// Reset password
export async function resetPassword(
  payload: ResetPayload
): Promise<MessageResponse> {
  return post<MessageResponse>(`${API_V1}/auth/reset-password`, payload);
}

// Logout — this endpoint should take a bearer token. We'll add token wiring later.
export async function logout(): Promise<MessageResponse> {
  // NOTE: pass token via headers when available
  try {
    const res = await post<MessageResponse>(`${API_V1}/auth/logout`);
    // clear local cookie even if API call fails quietly
    try {
      clearAccessToken();
      clearSessionSafely();
    } catch (e) {}
    return res;
  } finally {
    try {
      clearAccessToken();
      clearSessionSafely();
    } catch (e) {}
  }
}

// Get current user — requires authorization header (token). We'll wire token later.
export async function me(): Promise<User> {
  // NOTE: pass token via headers when available
  return get<User>(`${API_V1}/auth/me`);
}

const auth = {
  register,
  login,
  forgotPassword,
  resetPassword,
  logout,
  me,
};

export default auth;

function clearSessionSafely() {
  try {
    clearSession();
  } catch (e) {
    /* ignore */
  }
}

function normalizeAuthResponse(
  response: LoginResponse | RegisterResponse | MessageResponse | any
) {
  const payload = (response as any)?.body ?? response;
  const user: User | null = payload?.user ?? null;
  const token: string | null = payload?.token ?? null;
  return { token, user };
}
