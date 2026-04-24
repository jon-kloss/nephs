import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const skillContent = readFileSync(
  join(ROOT, ".claude", "skills", "story", "SKILL.md"),
  "utf-8"
);

describe("Scenario: Creating a story", () => {
  it("skill asks about the story topic/genre", () => {
    assert.match(
      skillContent,
      /what.*story.*about|adventure.*mystery|story.*genre/i,
      "Must ask what the story is about"
    );
  });

  it("skill asks about the main character", () => {
    assert.match(
      skillContent,
      /main character|who.*character|protagonist|hero/i,
      "Must ask about the main character"
    );
  });

  it("skill asks about the challenge/quest", () => {
    assert.match(
      skillContent,
      /big challenge|what.*quest|what.*goal|big.*problem/i,
      "Must ask about the story's challenge"
    );
  });

  it("skill saves to creations/stories/", () => {
    assert.ok(
      skillContent.includes("creations/stories/"),
      "Must save stories to creations/stories/"
    );
  });

  it("skill opens the story in browser", () => {
    assert.match(
      skillContent,
      /open.*browser|open.*story|`open`/i,
      "Must open the story in the browser"
    );
  });
});

describe("Scenario: Quick story from description", () => {
  it("skill handles inline description with /story command", () => {
    assert.match(
      skillContent,
      /skip|inline|description.*with|along.*with|already.*descri/i,
      "Must handle description provided with the command"
    );
  });
});

describe("Scenario: Making choices in a story", () => {
  it("skill requires branching choices with clickable buttons", () => {
    assert.match(
      skillContent,
      /branch|choice|button|click|decision.*point/i,
      "Must include branching choices"
    );
    assert.match(
      skillContent,
      /2.?3|two.*three|multiple.*choice/i,
      "Must show 2-3 choices per decision point"
    );
  });
});

describe("Scenario: Stories have satisfying endings", () => {
  it("skill requires victory endings and try-again options", () => {
    assert.match(
      skillContent,
      /victory|win|triumph|success/i,
      "Must include a victory/winning path"
    );
    assert.match(
      skillContent,
      /try again|restart|go back|retry/i,
      "Must offer a try-again option for losing paths"
    );
  });
});

describe("Scenario: Adding to an existing story", () => {
  it("skill supports expanding stories with new content", () => {
    assert.match(
      skillContent,
      /[Rr]ead.*current.*story|read.*existing|add.*branch.*content|add.*new.*branch/i,
      "Must support reading and expanding existing stories"
    );
  });
});

describe("Scenario: Smooth transitions in stories", () => {
  it("skill requires smooth transitions between story segments", () => {
    assert.match(
      skillContent,
      /smooth.*transition|fade|slide/i,
      "Must require smooth transitions when clicking choices"
    );
  });
});

describe("Scenario: Content guardrails in stories", () => {
  it("skill enforces age-appropriate story content", () => {
    assert.match(
      skillContent,
      /age.?appropriate|kid.?safe/i,
      "Must enforce age-appropriate content in stories"
    );
  });

  it("skill redirects inappropriate story requests", () => {
    assert.match(
      skillContent,
      /redirect|friendly ghost|instead/i,
      "Must redirect inappropriate content requests"
    );
  });
});
