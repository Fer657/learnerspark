import { afterEach, describe, expect, it, vi } from "vitest";

const { getDbMock } = vi.hoisted(() => ({ getDbMock: vi.fn() }));
vi.mock("../db", () => ({ getDb: getDbMock }));

import { registerHealthRoutes } from "./health";

const originalDatabaseUrl = process.env.DATABASE_URL;

function routes(): Record<string, (req: any, res: any) => unknown> {
  const handlers: Record<string, (req: any, res: any) => unknown> = {};
  registerHealthRoutes({ get: (path: string, handler: any) => { handlers[path] = handler; } } as any);
  return handlers;
}

function mockRes(): any {
  const res: any = { statusCode: 0, body: undefined };
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
  getDbMock.mockReset();
  if (originalDatabaseUrl === undefined) delete process.env.DATABASE_URL;
  else process.env.DATABASE_URL = originalDatabaseUrl;
});

describe("health routes", () => {
  it("/healthz reports liveness without touching the database", () => {
    const res = mockRes();
    routes()["/healthz"]({}, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ status: "ok" });
    expect(typeof res.body.uptime).toBe("number");
    expect(typeof res.body.timestamp).toBe("string");
    expect(getDbMock).not.toHaveBeenCalled();
  });

  it("/readyz reports ready with database disabled when DATABASE_URL is unset", async () => {
    delete process.env.DATABASE_URL;
    const res = mockRes();
    await routes()["/readyz"]({}, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ status: "ready", database: "disabled" });
    expect(getDbMock).not.toHaveBeenCalled();
  });

  it("/readyz reports ready when the database responds", async () => {
    process.env.DATABASE_URL = "mysql://user:pass@localhost:3306/db";
    getDbMock.mockResolvedValue({ execute: vi.fn().mockResolvedValue(undefined) });
    const res = mockRes();
    await routes()["/readyz"]({}, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ status: "ready", database: "ok" });
    expect(getDbMock).toHaveBeenCalledOnce();
  });

  it("/readyz returns 503 when the database check fails", async () => {
    process.env.DATABASE_URL = "mysql://user:pass@localhost:3306/db";
    getDbMock.mockRejectedValue(new Error("connection refused"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const res = mockRes();
    await routes()["/readyz"]({}, res);

    expect(res.statusCode).toBe(503);
    expect(res.body).toMatchObject({ status: "unavailable", database: "error" });
  });
});
