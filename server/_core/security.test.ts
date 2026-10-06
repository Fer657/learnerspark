import { afterEach, describe, expect, it, vi } from "vitest";
import { securityHeaders } from "./security";

const originalNodeEnv = process.env.NODE_ENV;

function mockRes(): any {
  const res: any = { headers: {} };
  res.setHeader = (key: string, value: string) => {
    res.headers[key] = value;
    return res;
  };
  return res;
}

afterEach(() => {
  if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
  else process.env.NODE_ENV = originalNodeEnv;
});

describe("securityHeaders", () => {
  it("sets baseline headers and calls next outside production", () => {
    process.env.NODE_ENV = "development";
    const res = mockRes();
    const next = vi.fn();

    securityHeaders({} as any, res, next);

    expect(res.headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(res.headers["X-Frame-Options"]).toBe("SAMEORIGIN");
    expect(res.headers["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(res.headers["Permissions-Policy"]).toContain("camera=()");
    expect(res.headers["Content-Security-Policy"]).toBeUndefined();
    expect(res.headers["Strict-Transport-Security"]).toBeUndefined();
    expect(next).toHaveBeenCalledOnce();
  });

  it("adds CSP and HSTS in production", () => {
    process.env.NODE_ENV = "production";
    const res = mockRes();
    const next = vi.fn();

    securityHeaders({} as any, res, next);

    expect(res.headers["Content-Security-Policy"]).toContain("default-src 'self'");
    expect(res.headers["Content-Security-Policy"]).toContain("object-src 'none'");
    expect(res.headers["Strict-Transport-Security"]).toContain("max-age=");
    expect(next).toHaveBeenCalledOnce();
  });
});
