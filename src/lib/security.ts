/**
 * HomeSelect Enterprise Security Firewall Module
 * Built-in Web Application Firewall (WAF), CSRF Guard, and Rate Limiter
 */

class SecurityFirewall {
  private csrfToken: string = '';
  private rateLimitWindowMs: number = 60000; // 1 minute
  private maxRequestsPerWindow: number = 5;
  private requestLog: number[] = [];

  constructor() {
    this.generateCsrfToken();
  }

  /**
   * Generates a secure CSRF token
   */
  public generateCsrfToken(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    this.csrfToken = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    return this.csrfToken;
  }

  public getCsrfToken(): string {
    return this.csrfToken || this.generateCsrfToken();
  }

  /**
   * Sanitizes input to prevent XSS attacks
   */
  public sanitizeInput(input: string): string {
    if (!input) return '';
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Validates request against rate limits
   */
  public checkRateLimit(): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
    const now = Date.now();
    this.requestLog = this.requestLog.filter(time => now - time < this.rateLimitWindowMs);

    if (this.requestLog.length >= this.maxRequestsPerWindow) {
      const oldestRequest = this.requestLog[0];
      const retryAfterSeconds = Math.ceil((oldestRequest + this.rateLimitWindowMs - now) / 1000);
      return { allowed: false, remaining: 0, retryAfterSeconds };
    }

    this.requestLog.push(now);
    return {
      allowed: true,
      remaining: this.maxRequestsPerWindow - this.requestLog.length,
      retryAfterSeconds: 0,
    };
  }

  /**
   * Validates email format and inspects for injection patterns
   */
  public validateEmail(email: string): { valid: boolean; reason?: string } {
    const cleanEmail = this.sanitizeInput(email.trim());
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(cleanEmail)) {
      return { valid: false, reason: 'Please provide a valid email format.' };
    }

    // Check malicious injection payloads
    if (/(script|select|union|drop|--|<|>|%0a|%0d)/i.test(email)) {
      return { valid: false, reason: 'Security alert: Invalid characters detected.' };
    }

    return { valid: true };
  }
}

export const firewall = new SecurityFirewall();
