import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const skillContent = readFileSync(
  join(ROOT, ".claude", "skills", "gallery", "SKILL.md"),
  "utf-8"
);

describe("Scenario: Viewing the gallery with creations", () => {
  it("skill instructs Claude to scan creations directories", () => {
    assert.ok(
      skillContent.includes("creations/games/") &&
        skillContent.includes("creations/stories/") &&
        skillContent.includes("creations/characters/"),
      "Must reference all three creations directories"
    );
  });

  it("skill instructs to generate gallery/index.html", () => {
    assert.ok(
      skillContent.includes("gallery/index.html"),
      "Must generate gallery/index.html"
    );
  });

  it("skill requires cards organized by type", () => {
    assert.match(
      skillContent,
      /[Oo]rganized by type|separate sections.*Games.*Stories|Games.*Stories.*Characters/i,
      "Must organize cards by creation type"
    );
  });

  it("skill instructs to open gallery in browser", () => {
    assert.match(
      skillContent,
      /open.*gallery|open.*index\.html|`open`/i,
      "Must open the gallery in the browser"
    );
  });
});

describe("Scenario: Empty gallery", () => {
  it("skill handles empty gallery with friendly message", () => {
    assert.match(
      skillContent,
      /empty|no creations|nothing.*yet/i,
      "Must handle empty gallery case"
    );
  });

  it("skill suggests /game when gallery is empty", () => {
    assert.ok(
      skillContent.includes("/game"),
      "Must suggest /game when no creations exist"
    );
  });
});

describe("Scenario: Opening a creation from the gallery", () => {
  it("skill requires relative file paths for links", () => {
    assert.match(
      skillContent,
      /relative|\.\.\/|link.*creation|click.*open/i,
      "Must use relative paths so links work locally"
    );
  });
});

describe("Scenario: Kid-friendly design", () => {
  it("skill specifies colorful, fun visual design", () => {
    assert.ok(
      skillContent.includes("bright") && skillContent.includes("card"),
      "Must specify bright colors and card-based design"
    );
  });

  it("skill uses kid's name in the header", () => {
    assert.match(
      skillContent,
      /kid.*name|CLAUDE\.md|workshop.*name|personali/i,
      "Must use kid's name from CLAUDE.md in the gallery header"
    );
  });
});
