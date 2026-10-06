import { afterEach, describe, expect, it, vi } from "vitest";
import { createRateLimiter } from "./rate-limit";

function mockReq(ip = "10.0.0.1"): any {
  return { ip, socket: { remoteAddress: ip } };
}

function mockRes(): any {
  const res: any = { statusCode: 0, body: undefined, headers: {} };
  res.setHeader = (key: string, value: string) => {
    res.headers[key] = value;
    return res;
  };
  res.status = (code: number) => {
    res.statusCode = code;
    return res;
  };
  res.json = (payload: unknown) => {
    res.body = payload;
    return res;
  };
  return res;
}

afterEach(() => {
  vi.useRealTimers();
});

describe("createRateLimiter", () => {
  it("allows requests up to the limit, then blocks with 429 and Retry-After", () => {
    const limiter = createRateLimiter({ windowMs: 60_000, max: 3 });
    const req = mockReq();

    for (let i = 0; i < 3; i++) {
      const next = vi.fn();
      limiter(req, mockRes(), next);
      expect(next).toHaveBeenCalledOnce();
    }

    const res = mockRes();
    const next = vi.fn();
    limiter(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(429);
    expect(res.headers["Retry-After"]).toBeDefined();
    expect(res.body).toMatchObject({ error: expect.any(String) });
  });

  it("uses a custom error message when provided", () => {
    const limiter = createRateLimiter({ windowMs: 60_000, max: 1, message: "slow down" });
    const req = mockReq();
    limiter(req, mockRes(), vi.fn());

    const res = mockRes();
    limiter(req, res, vi.fn());
    expect(res.body).toEqual({ error: "slow down" });
  });

  it("tracks clients independently by key", () => {
    const limiter = createRateLimiter({ windowMs: 60_000, max: 1, key: (req) => String((req as any).ip) });

    const first = vi.fn();
    limiter(mockReq("1.1.1.1"), mockRes(), first);
    expect(first).toHaveBeenCalledOnce();

    const other = vi.fn();
    limiter(mockReq("2.2.2.2"), mockRes(), other);
    expect(other).toHaveBeenCalledOnce();

    const blocked = mockRes();
    const denied = vi.fn();
    limiter(mockReq("1.1.1.1"), blocked, denied);
    expect(denied).not.toHaveBeenCalled();
    expect(blocked.statusCode).toBe(429);
  });

  it("resets the counter after the window elapses", () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    const limiter = createRateLimiter({ windowMs: 1_000, max: 1 });
    const req = mockReq();

    limiter(req, mockRes(), vi.fn());

    const blocked = mockRes();
    limiter(req, blocked, vi.fn());
    expect(blocked.statusCode).toBe(429);

    vi.advanceTimersByTime(1_001);

    const next = vi.fn();
    limiter(req, mockRes(), next);
    expect(next).toHaveBeenCalledOnce();
  });
});
