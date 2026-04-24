import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const skillContent = readFileSync(
  join(ROOT, ".claude", "skills", "character", "SKILL.md"),
  "utf-8"
);

// --- Scenario: Creating a character ---

describe("Scenario: Creating a character", () => {
  it("skill asks who the character is", () => {
    assert.match(
      skillContent,
      /who.*character|what.*character|minecraft villager|basketball coach|space explorer/i,
      "Must ask about the character identity"
    );
  });

  it("skill asks what the character knows about", () => {
    assert.match(
      skillContent,
      /what.*know|expertise|redstone|basketball move|alien planet/i,
      "Must ask about character knowledge/expertise"
    );
  });

  it("skill asks how the character talks", () => {
    assert.match(
      skillContent,
      /how.*talk|speaking style|catchphrase|funny.*serious|accent/i,
      "Must ask about speaking style"
    );
  });

  it("skill saves character profile to creations/characters/", () => {
    assert.ok(
      skillContent.includes("creations/characters/"),
      "Must save profiles to creations/characters/"
    );
  });

  it("skill enters character mode after creation", () => {
    assert.match(
      skillContent,
      /enter.*character.*mode|role.?play|character.*arrival|is here/i,
      "Must enter character mode after profile is created"
    );
  });
});

// --- Scenario: Quick character from description ---

describe("Scenario: Quick character from description", () => {
  it("skill handles inline description with /character command", () => {
    assert.match(
      skillContent,
      /skip.*redundant|description.*with.*command|provides.*description/i,
      "Must handle when kid provides character description with /character command"
    );
  });
});

// --- Scenario: In-character conversation ---

describe("Scenario: In-character conversation", () => {
  it("skill instructs Claude to stay in character", () => {
    assert.match(
      skillContent,
      /stay in character|maintain.*personality|consistent.*personality/i,
      "Must instruct Claude to maintain character during chat"
    );
  });

  it("skill instructs Claude to give genuinely helpful information", () => {
    assert.match(
      skillContent,
      /genuinely helpful|real.*useful|helpful.*information/i,
      "Must give real helpful answers in-character"
    );
  });
});

// --- Scenario: Exiting character mode ---

describe("Scenario: Exiting character mode", () => {
  it("skill supports exit commands", () => {
    assert.ok(
      skillContent.includes('"bye"') &&
        skillContent.includes('"exit"') &&
        skillContent.includes('"quit"'),
      "Must document all three exit commands (bye, exit, quit)"
    );
  });

  it("skill returns to normal workshop mode after exit", () => {
    assert.match(
      skillContent,
      /return.*normal|workshop.*assistant|drop.*character/i,
      "Must return to normal workshop mode on exit"
    );
  });

  it("skill suggests next activities after exit", () => {
    assert.match(
      skillContent,
      /\/game|\/story|\/character/,
      "Must suggest next activities after character mode exit"
    );
  });
});

// --- Scenario: Talking to an existing character ---

describe("Scenario: Talking to an existing character", () => {
  it("skill supports revisiting existing characters", () => {
    assert.match(
      skillContent,
      /existing.*character|talk to|revisit|previous/i,
      "Must support revisiting previously created characters"
    );
  });

  it("skill reads character profile from disk", () => {
    assert.match(
      skillContent,
      /[Rr]ead.*profile|read.*character/i,
      "Must read character profile from disk"
    );
  });
});

// --- Scenario: Listing available characters ---

describe("Scenario: Listing available characters", () => {
  it("skill supports listing all characters", () => {
    assert.match(
      skillContent,
      /list.*character|scan.*character|who can I talk to/i,
      "Must support listing available characters"
    );
  });
});

// --- Scenario: Content guardrails in character chat ---

describe("Scenario: Content guardrails in character chat", () => {
  it("skill enforces age-appropriate character interactions", () => {
    assert.match(
      skillContent,
      /age.?appropriate|kid.?safe/i,
      "Must enforce age-appropriate content in character interactions"
    );
  });

  it("skill redirects inappropriate topics", () => {
    assert.match(
      skillContent,
      /redirect.*fun|redirect.*inappropriate|gently redirect/i,
      "Must redirect inappropriate topics to fun subjects"
    );
  });

  it("skill ensures character profile includes markdown format", () => {
    assert.ok(
      skillContent.includes("**Personality**") &&
        skillContent.includes("**Speaking style**") &&
        skillContent.includes("**Catchphrase**"),
      "Profile template must include Personality, Speaking style, and Catchphrase fields"
    );
  });
});

// --- Character profile persistence ---

describe("Character profile persistence", () => {
  it("skill notes conversation history resets between sessions", () => {
    assert.match(
      skillContent,
      /conversation history.*NOT preserved|fresh each time|history.*reset/i,
      "Must note that conversation history resets between sessions"
    );
  });

  it("skill notes character personality persists via profile file", () => {
    assert.match(
      skillContent,
      /persist|saved to disk|profile.*saved/i,
      "Must note that character personality persists via file"
    );
  });
});
