import { describe, expect, it } from "vitest";
import { hashPassword, normalizeEmail, normalizeMobile, verifyPassword } from "./student-auth";

describe("single student identity", () => {
  it("maps Indian mobile formats to the same unique database value", () => {
    expect(normalizeMobile("98765 43210")).toBe("+919876543210");
    expect(normalizeMobile("+91-98765-43210")).toBe("+919876543210");
    expect(normalizeMobile("919876543210")).toBe("+919876543210");
    expect(normalizeMobile("not a number")).toBe("");
    expect(normalizeEmail(" Aspirant@Example.COM ")).toBe("aspirant@example.com");
  });
  it("verifies compatible scrypt hashes without storing plaintext passwords", async () => {
    const hash = await hashPassword("correct-battery-horse");
    expect(hash).toMatch(/^scrypt:32768:8:1\$/);
    expect(hash).not.toContain("correct-battery-horse");
    expect(await verifyPassword("correct-battery-horse", hash)).toBe(true);
    expect(await verifyPassword("wrong-password", hash)).toBe(false);
  });
});
