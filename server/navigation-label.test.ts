import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("contact navigation", () => {
  it("shows Contact your mentors in desktop, mobile, and footer navigation", () => {
    const source = readFileSync(new URL("../client/src/components/SiteChrome.tsx", import.meta.url), "utf8");
    expect(source).toContain('<Link href="/founder" className="founder-nav-link">Contact your mentors</Link>');
    expect(source).toContain('className="mobile-nav-link founder-mobile-link" onClick={() => setOpen(false)}>Contact your mentors</Link>');
    expect(source).toContain('<Link href="/founder">Contact your mentors</Link>');
    expect(source).not.toContain(">Contact</Link>");
  });
});
