import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const skillContent = readFileSync(
  join(ROOT, ".claude", "skills", "game", "SKILL.md"),
  "utf-8"
);

// --- Scenario: Starting the game skill ---

describe("Scenario: Starting the game skill", () => {
  it("skill asks about the kind of game", () => {
    assert.match(
      skillContent,
      /what kind|what type|platformer|collector|sports|quiz/i,
      "Must ask what kind of game to build"
    );
  });

  it("skill asks about the theme", () => {
    assert.match(
      skillContent,
      /theme|minecraft|space|sports|animal/i,
      "Must ask about game theme"
    );
  });

  it("skill asks about player mechanics", () => {
    assert.match(
      skillContent,
      /what.*player|what.*do|collect|avoid|jump|score/i,
      "Must ask what the player does"
    );
  });

  it("skill suggests ideas based on kid's interests", () => {
    assert.match(
      skillContent,
      /interest|CLAUDE\.md|profile|personali/i,
      "Must reference kid's interests for suggestions"
    );
  });
});

// --- Scenario: Completing the design questions ---

describe("Scenario: Completing the design questions", () => {
  it("skill instructs Claude to summarize before generating", () => {
    assert.match(
      skillContent,
      /summar|building.*game|OK.*building|hang on|let me build/i,
      "Must summarize what it's about to build before generating"
    );
  });
});

// --- Scenario: Kid gives a one-line description ---

describe("Scenario: Kid gives a one-line description", () => {
  it("skill handles description passed as argument to /game", () => {
    assert.match(
      skillContent,
      /skip|already.*descri|one.?line|argument|inline|along.*with/i,
      "Must handle when kid provides full description with /game command"
    );
  });

  it("skill limits follow-up to at most 1 clarifying question", () => {
    assert.match(
      skillContent,
      /1.*clarif|one.*question|at most|minimal/i,
      "Must limit follow-up questions when description is provided"
    );
  });
});

// --- Scenario: Game file structure ---

describe("Scenario: Game file structure", () => {
  it("skill specifies Phaser.js CDN URL", () => {
    assert.ok(
      skillContent.includes(
        "https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.min.js"
      ),
      "Must include exact Phaser.js CDN URL"
    );
  });

  it("skill specifies self-contained HTML output", () => {
    assert.match(
      skillContent,
      /self.?contained|single.*HTML|no external/i,
      "Must specify self-contained HTML files"
    );
  });

  it("skill specifies programmatic graphics (no external assets)", () => {
    assert.match(
      skillContent,
      /programmatic|no external.*asset|colored shape|canvas.?drawn/i,
      "Must specify programmatic graphics without external image assets"
    );
  });

  it("skill includes HTML template structure", () => {
    assert.ok(
      skillContent.includes("<!DOCTYPE html>"),
      "Must include HTML template structure for reference"
    );
    assert.ok(
      skillContent.includes("Phaser.AUTO"),
      "Must include Phaser config example"
    );
  });
});

// --- Scenario: Game includes title screen and instructions ---

describe("Scenario: Game includes title screen and instructions", () => {
  it("skill requires title screen", () => {
    assert.match(
      skillContent,
      /title screen|title.*scene|start.*screen/i,
      "Must require a title screen"
    );
  });

  it("skill requires control instructions", () => {
    assert.match(
      skillContent,
      /control.*instruction|arrow key|space.*jump|how to play/i,
      "Must require control instructions to be shown"
    );
  });
});

// --- Scenario: Game has core mechanics working ---

describe("Scenario: Game has core mechanics working", () => {
  it("skill requires score or progress tracking", () => {
    assert.match(
      skillContent,
      /score|progress|point|counter/i,
      "Must require score or progress tracking"
    );
  });

  it("skill requires win/game-over state", () => {
    assert.match(
      skillContent,
      /win|game.?over|victory|lose|end.*state/i,
      "Must require a win or game-over state"
    );
  });
});

// --- Scenario: Modifying the current game ---

describe("Scenario: Modifying the current game", () => {
  it("skill instructs Claude to read the current game file before modifying", () => {
    assert.match(
      skillContent,
      /[Rr]ead.*current|read.*existing|read.*game.*file|read.*HTML/i,
      "Must instruct Claude to read the existing game file"
    );
  });

  it("skill instructs Claude to preserve existing functionality", () => {
    assert.match(
      skillContent,
      /preserv|keep.*existing|don't.*break|maintain/i,
      "Must instruct to preserve existing game functionality"
    );
  });

  it("skill instructs Claude to open or refresh the browser", () => {
    assert.match(
      skillContent,
      /open.*browser|refresh|re.?open|open.*file/i,
      "Must instruct to open or refresh the browser"
    );
  });
});

// --- Scenario: Multiple iterations ---

describe("Scenario: Multiple iterations", () => {
  it("skill instructs reading from disk, not memory, on each iteration", () => {
    assert.match(
      skillContent,
      /read.*current.*file.*from disk|from disk.*not.*memory|always read.*existing/i,
      "Must instruct to read from disk on each iteration, not from cached memory"
    );
  });

  it("skill instructs preserving all previous modifications", () => {
    assert.match(
      skillContent,
      /preserve.*previous|preserve.*all|previous.*change/i,
      "Must preserve all previous modifications across iterations"
    );
  });
});

// --- Scenario: Starting a new game ---

describe("Scenario: Starting a new game", () => {
  it("skill saves new game with different filename to preserve previous", () => {
    assert.match(
      skillContent,
      /different.*filename|new.*file|previous.*game.*preserve/i,
      "Must save new games with different filenames to preserve old ones"
    );
  });
});

// --- Scenario Outline: Various game types ---

describe("Scenario Outline: Various game types are supported", () => {
  const gameTypes = [
    "platformer",
    "sports",
    "collector",
    "quiz",
    "clicker",
    "space shooter",
  ];

  for (const type of gameTypes) {
    it(`skill references ${type} game type`, () => {
      assert.match(
        skillContent,
        new RegExp(type, "i"),
        `Must mention ${type} as a supported game type`
      );
    });
  }
});

// --- Scenario: Content guardrails in games ---

describe("Scenario: Content guardrails in games", () => {
  it("skill enforces age-appropriate game content", () => {
    assert.match(
      skillContent,
      /age.?appropriate|kid.?friendly|kid.?safe|under.?13/i,
      "Must enforce age-appropriate content in games"
    );
  });

  it("skill specifies cartoon/fantasy style for conflict", () => {
    assert.match(
      skillContent,
      /cartoon|fantasy|no.*blood|no.*gore|no.*realistic.*weapon/i,
      "Must require cartoon/fantasy style for any game conflict"
    );
  });

  it("skill includes redirect instruction for violent content requests", () => {
    assert.ok(
      skillContent.includes("silly monsters") || skillContent.includes("boop"),
      "Must redirect violent content requests with a fun alternative (silly monsters/boop)"
    );
  });
});

// --- Scenario: save path ---

describe("Game creation file management", () => {
  it("skill specifies correct save path", () => {
    assert.ok(
      skillContent.includes("creations/games/"),
      "Must save games to creations/games/"
    );
  });

  it("skill uses kebab-case for filenames", () => {
    assert.match(
      skillContent,
      /kebab.?case|slug|lowercase.*dash/i,
      "Must use kebab-case for game filenames"
    );
  });

  it("skill instructs to open game in browser with macOS open command", () => {
    assert.match(
      skillContent,
      /open.*creations|`open`|open command/i,
      "Must use macOS open command to launch games"
    );
  });
});
