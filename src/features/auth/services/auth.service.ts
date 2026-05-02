import { BaseService } from "@/services/base.service";
import type {
  RequestOtpPayload,
  RequestOtpResponse,
  VerifyOtpPayload,
  AuthResponse,
  Session,
  AuthMeResponse
} from "../types/auth.types";

export class AuthService extends BaseService {
  constructor() {
    super("auth", "v1"); // -> api/v1/auth
  }

  /**
   * Request an OTP for LOGIN or REGISTER intent.
   */
  async requestOtp(payload: RequestOtpPayload): Promise<RequestOtpResponse> {
    return this.post("/otp", payload);
  }

  /**
   * Verify the OTP and receive the auth token.
   */
  async verifyOtp(payload: VerifyOtpPayload): Promise<AuthResponse> {
    return this.post("/otp/verify", payload);
  }

  /**
   * Get all active sessions for the current user.
   */
  async getSessions(): Promise<Session[]> {
    return this.get("/sessions");
  }

  /**
   * Logout the current device (revokes current session).
   */
  async logoutCurrentDevice(): Promise<{ message: string }> {
    return this.post("/logout");
  }

  /**
   * Logout all devices for the current user.
   */
  async logoutAllDevices(): Promise<{ message: string }> {
    return this.post("/logout-all");
  }

  /**
   * Revoke a specific session by its ID.
   */
  async revokeSession(sid: string): Promise<{ message: string }> {
    return this.delete(`/sessions/${sid}`);
  }

  /**
   * Get the current user profile and role.
   */
  async getMe(): Promise<AuthMeResponse> {
    return this.get("/me");
  }
}

export const authService = new AuthService();

