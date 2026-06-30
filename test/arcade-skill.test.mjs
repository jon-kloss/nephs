import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const skillContent = readFileSync(
  join(ROOT, ".claude", "skills", "arcade", "SKILL.md"),
  "utf-8"
);

describe("Scenario: Building the arcade site", () => {
  it("skill scans the games directory for the kid's games", () => {
    assert.ok(
      skillContent.includes("creations/games/"),
      "Must scan creations/games/ for games to include"
    );
  });

  it("skill builds a self-contained site under creations/arcade/", () => {
    assert.ok(
      skillContent.includes("creations/arcade/site"),
      "Must build the site into creations/arcade/site/"
    );
  });

  it("skill bundles a copy of each game so the arcade is self-contained", () => {
    assert.match(
      skillContent,
      /self-contained|copy each game|cp .*creations\/games/i,
      "Must copy games into the site rather than depend on external hosting"
    );
  });

  it("skill generates an arcade landing page with Play buttons", () => {
    assert.match(
      skillContent,
      /index\.html/,
      "Must generate an index.html landing page"
    );
    assert.match(
      skillContent,
      /Play/,
      "Landing page must give each game a Play button/link"
    );
  });

  it("skill opens the arcade locally for the kid to see", () => {
    assert.ok(
      skillContent.includes("open creations/arcade/site/index.html"),
      "Must open the built arcade in the browser"
    );
  });

  it("skill handles the empty-games case by suggesting /game", () => {
    assert.match(
      skillContent,
      /no.*games|\/game/i,
      "Must redirect to /game when there are no games yet"
    );
  });
});

describe("Scenario: Publishing the arcade online", () => {
  it("skill publishes to GitHub Pages", () => {
    assert.match(
      skillContent,
      /GitHub Pages/i,
      "Must publish via GitHub Pages"
    );
  });

  it("skill reads the arcade repo from the configured profile field", () => {
    assert.ok(
      skillContent.includes("{{ARCADE_REPO}}") &&
        skillContent.includes("GitHub Arcade Repo"),
      "Must check/store the GitHub Arcade Repo profile field"
    );
  });

  it("skill pushes the built site to the repo", () => {
    assert.match(
      skillContent,
      /git push/,
      "Must push the site to the arcade repo"
    );
  });

  it("skill derives the live URL from the repo for the kid to share", () => {
    assert.match(
      skillContent,
      /github\.io/,
      "Must give the kid the live github.io link"
    );
  });
});

describe("Scenario: Grown-up helper setup", () => {
  it("skill explains the one-time GitHub repo + Pages setup", () => {
    assert.match(
      skillContent,
      /grown-up helper/i,
      "Must route account/repo setup through the grown-up helper"
    );
    assert.match(
      skillContent,
      /Settings.*Pages|Pages/i,
      "Must explain enabling GitHub Pages"
    );
  });

  it("skill does not show raw errors to the kid", () => {
    assert.match(
      skillContent,
      /don't show.*error|didn't work/i,
      "Must keep raw errors away from the kid, matching the workshop tone"
    );
  });
});

describe("Scenario: Updating later", () => {
  it("skill is re-runnable to add new games without extra setup", () => {
    assert.match(
      skillContent,
      /again|rebuild|republish|update/i,
      "Must support re-running to pick up newly built games"
    );
  });
});

describe("Frontmatter", () => {
  it("has valid closed frontmatter with name 'arcade'", () => {
    assert.match(
      skillContent,
      /^---\n[\s\S]*?\n---/,
      "Must have opened and closed YAML frontmatter"
    );
    const nameMatch = skillContent.match(/name:\s*(.+)/);
    assert.ok(nameMatch && nameMatch[1].trim() === "arcade", "name must be 'arcade'");
  });
});
