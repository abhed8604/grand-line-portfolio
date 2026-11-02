import { test, expect } from "@playwright/test";
import { safeHref } from "./build";
import { content } from "../content";

test("safeHref permits safe relative and external paths", () => {
  expect(safeHref("./resume.pdf")).toBe("./resume.pdf");
  expect(safeHref("../resume.pdf")).toBe("../resume.pdf");
  expect(safeHref("/resume.pdf")).toBe("/resume.pdf");
  expect(safeHref("#home")).toBe("#home");
  expect(safeHref("mailto:test@example.com")).toBe("mailto:test@example.com");
  expect(safeHref("tel:+1234567890")).toBe("tel:+1234567890");
  expect(safeHref("https://github.com/abhed8604")).toBe("https://github.com/abhed8604");
  expect(safeHref("http://example.com")).toBe("http://example.com");
});

test("safeHref blocks unsafe URLs and scripts", () => {
  expect(safeHref("javascript:alert(1)")).toBe("#");
  expect(safeHref("data:text/html,<script>")).toBe("#");
  expect(safeHref("vbscript:msgbox(1)")).toBe("#");
  expect(safeHref("")).toBe("#");
});

test("content.resume.url is accepted by safeHref", () => {
  const href = safeHref(content.resume.url);
  expect(href).not.toBe("#");
  expect(href).toBe("./resume.pdf");
});

test("navigation contains exactly 8 chapters in order", () => {
  const expectedIds = ["home", "about", "skills", "projects", "education", "experience", "resume", "contact"];
  expect(content.nav.map((n) => n.id)).toEqual(expectedIds);
});

