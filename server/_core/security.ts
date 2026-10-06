import type { NextFunction, Request, Response } from "express";

const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "img-src 'self' data: blob:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // The platform runtime and Vite inject inline modules, so 'unsafe-inline' is
  // required here; the remaining directives still restrict everything else.
  "script-src 'self' 'unsafe-inline'",
  "connect-src 'self'",
].join("; ");

/**
 * Sets conservative security headers on every response. The Content-Security-
 * Policy and HSTS header are only sent in production, where the app is served
 * over HTTPS and no dev-time tooling needs to run.
 */
export function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-DNS-Prefetch-Control", "off");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=15552000; includeSubDomains");
    res.setHeader("Content-Security-Policy", CSP);
  }
  next();
}
