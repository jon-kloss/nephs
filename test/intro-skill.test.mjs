import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const skillContent = readFileSync(
  join(ROOT, ".claude", "skills", "intro", "SKILL.md"),
  "utf-8"
);

describe("Scenario: First-time intro", () => {
  it("skill instructs Claude to ask for the kid's name", () => {
    assert.match(
      skillContent,
      /ask.*name|what's your name|what.*call you/i,
      "Must contain a prompt asking for the kid's name"
    );
  });

  it("skill instructs Claude to ask about favorite games", () => {
    assert.match(
      skillContent,
      /ask.*game|what.*game|what.*play/i,
      "Must contain a prompt about favorite games"
    );
  });

  it("skill instructs Claude to ask about other interests", () => {
    assert.match(
      skillContent,
      /interest|sport|hobb/i,
      "Must ask about interests beyond games"
    );
  });
});

describe("Scenario: Intro completes and updates CLAUDE.md", () => {
  it("skill instructs Claude to read CLAUDE.md", () => {
    assert.match(
      skillContent,
      /[Rr]ead.*CLAUDE\.md|CLAUDE\.md.*read/,
      "Must instruct Claude to read CLAUDE.md"
    );
  });

  it("skill instructs Claude to replace all three placeholders", () => {
    assert.ok(
      skillContent.includes("{{KID_NAME}}"),
      "Must reference {{KID_NAME}} placeholder"
    );
    assert.ok(
      skillContent.includes("{{INTERESTS}}"),
      "Must reference {{INTERESTS}} placeholder"
    );
    assert.ok(
      skillContent.includes("{{FAVORITE_GAMES}}"),
      "Must reference {{FAVORITE_GAMES}} placeholder"
    );
  });

  it("skill instructs Claude to replace placeholders using Edit tool with replace_all", () => {
    assert.match(
      skillContent,
      /[Ee]dit/,
      "Must reference the Edit tool"
    );
    assert.ok(
      skillContent.includes("replace_all"),
      "Must instruct use of replace_all to catch all placeholder occurrences"
    );
  });

  it("skill confirms completion and suggests /game", () => {
    assert.match(
      skillContent,
      /\/game/,
      "Must suggest /game after intro completes"
    );
    assert.match(
      skillContent,
      /ready|all set|done|set up/i,
      "Must confirm the workshop is ready"
    );
  });
});

describe("Scenario: Running intro again (already personalized)", () => {
  it("skill instructs Claude to detect already-personalized state", () => {
    assert.match(
      skillContent,
      /already.*personal|does not contain.*\{\{|doesn't contain.*\{\{|no.*placeholder|check.*\{\{KID_NAME\}\}/i,
      "Must detect when CLAUDE.md is already personalized"
    );
  });

  it("skill offers to update existing info", () => {
    assert.match(
      skillContent,
      /update.*info|update.*personali|redo.*intro|re-run/i,
      "Must offer to update existing personalization"
    );
  });

  it("skill suggests /story and /character as fallbacks when user declines update", () => {
    assert.ok(
      skillContent.includes("/story"),
      "Must suggest /story as a fallback option"
    );
    assert.ok(
      skillContent.includes("/character"),
      "Must suggest /character as a fallback option"
    );
  });
});

describe("Scenario: Uncle runs intro during setup", () => {
  it("skill accommodates uncle running intro on behalf of kid", () => {
    assert.match(
      skillContent,
      /uncle|parent|on.*behalf|behalf/i,
      "Must mention that an uncle/parent can run intro for the kid"
    );
  });
});

describe("Scenario: Kid starts without running intro", () => {
  it("skill or CLAUDE.md handles unpersonalized nudge", () => {
    // This is handled by CLAUDE.md (verified in template.test.mjs)
    // But the skill should also reference this behavior
    assert.match(
      skillContent,
      /\{\{KID_NAME\}\}|placeholder|personali[sz]/i,
      "Must reference the personalization detection mechanism"
    );
  });
});

describe("Intro skill functional: placeholder replacement", () => {
  it("CLAUDE.md template has replaceable placeholders in correct format", () => {
    const claudeMd = readFileSync(join(ROOT, "CLAUDE.md"), "utf-8");

    // Simulate replacement
    const replaced = claudeMd
      .replace(/\{\{KID_NAME\}\}/g, "Alex")
      .replace(/\{\{INTERESTS\}\}/g, "Minecraft, Fortnite, basketball")
      .replace(/\{\{FAVORITE_GAMES\}\}/g, "Minecraft, Fortnite");

    // Verify no placeholders remain
    assert.ok(
      !replaced.includes("{{"),
      "After replacement, no {{ placeholders should remain"
    );

    // Verify replacements are in correct positions
    assert.ok(
      replaced.includes("**Name**: Alex"),
      "Kid name should appear in Kid Profile"
    );
    assert.ok(
      replaced.includes("**Interests**: Minecraft, Fortnite, basketball"),
      "Interests should appear in Kid Profile"
    );
    assert.ok(
      replaced.includes("**Favorite Games**: Minecraft, Fortnite"),
      "Favorite games should appear in Kid Profile"
    );

    // Verify the personalized name appears in greeting context
    assert.ok(
      replaced.includes("helping **Alex** build cool things"),
      "Kid name should appear in the Who You Are section"
    );
  });
});
