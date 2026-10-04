import { describe, expect, it } from "vitest";

describe("Admin Console destination", () => {
  it("points to a reachable dashboard that sends anonymous visitors to login", async () => {
    const url = import.meta.env.VITE_ADMIN_CONSOLE_URL;
    expect(url).toMatch(/^https:\/\/[^\s]+\/admin\/dashboard$/);
    const response = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(15000) });
    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toMatch(/^\/admin\/login(?:\?|$)/);
  }, 20000);
});
