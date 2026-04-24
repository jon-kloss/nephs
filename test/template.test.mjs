import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const EXPECTED_SKILLS = ["intro", "game", "story", "character", "gallery"];

// Read once, share across tests
const claudeMd = readFileSync(join(ROOT, "CLAUDE.md"), "utf-8");

function readSkill(name) {
  return readFileSync(
    join(ROOT, ".claude", "skills", name, "SKILL.md"),
    "utf-8"
  );
}

describe("Scenario: Setting up from template", () => {
  it("CLAUDE.md exists with correct template placeholders in Kid Profile", () => {
    assert.ok(existsSync(join(ROOT, "CLAUDE.md")), "CLAUDE.md must exist");
    assert.ok(
      claudeMd.includes("**Name**: {{KID_NAME}}"),
      "Kid Profile must have **Name**: {{KID_NAME}}"
    );
    assert.ok(
      claudeMd.includes("**Interests**: {{INTERESTS}}"),
      "Kid Profile must have **Interests**: {{INTERESTS}}"
    );
    assert.ok(
      claudeMd.includes("**Favorite Games**: {{FAVORITE_GAMES}}"),
      "Kid Profile must have **Favorite Games**: {{FAVORITE_GAMES}}"
    );
  });

  it("only known placeholders exist in CLAUDE.md", () => {
    const allPlaceholders = claudeMd.match(/\{\{[A-Z_]+\}\}/g) || [];
    const known = new Set(["{{KID_NAME}}", "{{INTERESTS}}", "{{FAVORITE_GAMES}}"]);
    for (const p of allPlaceholders) {
      assert.ok(known.has(p), `Unknown placeholder found: ${p}`);
    }
  });

  it("CLAUDE.md contains /intro nudge for unpersonalized detection", () => {
    assert.ok(
      claudeMd.includes('Run /intro so I can get to know you'),
      "Must contain the /intro nudge message for unpersonalized state"
    );
  });
});

describe("Scenario: Fresh project structure", () => {
  it("all required directories exist", () => {
    const required = [
      "creations/games",
      "creations/stories",
      "creations/characters",
      "gallery",
      ...EXPECTED_SKILLS.map((s) => `.claude/skills/${s}`),
    ];
    for (const dir of required) {
      assert.ok(existsSync(join(ROOT, dir)), `${dir}/ must exist`);
    }
  });

  it("empty creation directories have .gitkeep files", () => {
    const emptyDirs = [
      "creations/games",
      "creations/stories",
      "creations/characters",
      "gallery",
    ];
    for (const dir of emptyDirs) {
      assert.ok(
        existsSync(join(ROOT, dir, ".gitkeep")),
        `${dir}/.gitkeep must exist for git tracking`
      );
    }
  });

  it("no unexpected skill directories exist", () => {
    const skillsDir = join(ROOT, ".claude", "skills");
    const actual = readdirSync(skillsDir).sort();
    assert.deepStrictEqual(
      actual,
      [...EXPECTED_SKILLS].sort(),
      "Skill directories must match expected list exactly"
    );
  });
});

describe("Scenario: First interaction (personalized)", () => {
  it("CLAUDE.md lists all skills with command names and descriptions", () => {
    assert.ok(claudeMd.includes("/intro"), "Must list /intro skill");
    assert.ok(claudeMd.includes("/game"), "Must list /game skill");
    assert.ok(claudeMd.includes("/story"), "Must list /story skill");
    assert.ok(claudeMd.includes("/character"), "Must list /character skill");
    assert.ok(claudeMd.includes("/gallery"), "Must list /gallery skill");
    // Verify descriptions accompany commands (not just command names in random places)
    assert.ok(
      claudeMd.includes("/game** — Build a video game"),
      "Must have description for /game"
    );
    assert.ok(
      claudeMd.includes("/story** — Write a choose-your-own-adventure"),
      "Must have description for /story"
    );
  });

  it("CLAUDE.md suggests /game first for new users", () => {
    assert.ok(
      claudeMd.includes("Always suggest **/game** first"),
      "Must recommend /game as the first wow moment for new users"
    );
  });
});

describe("Scenario: Returning user", () => {
  it("CLAUDE.md contains returning user instructions referencing creations/", () => {
    assert.ok(
      claudeMd.includes("## Returning Users"),
      "Must have a Returning Users section"
    );
    assert.ok(
      claudeMd.includes("creations/"),
      "Returning user instructions must reference the creations/ directory"
    );
    assert.match(
      claudeMd,
      /Welcome back|welcome back/,
      "Must contain a welcome-back greeting for returning users"
    );
  });
});

describe("CLAUDE.md personality and guardrails", () => {
  it("enforces age-appropriate content for under-13", () => {
    assert.ok(
      claudeMd.includes("kid under 13"),
      "Must explicitly state the audience is under 13"
    );
    assert.ok(
      claudeMd.includes("Content Guardrails"),
      "Must have a Content Guardrails section"
    );
  });

  it("instructs Claude to keep responses short and jargon-free", () => {
    assert.ok(
      claudeMd.includes("under 3 sentences"),
      "Must instruct responses under 3 sentences"
    );
    assert.ok(
      claudeMd.includes("No jargon"),
      "Must explicitly prohibit jargon"
    );
  });

  it("prohibits violent, sexual, scary, and horror content", () => {
    assert.ok(
      claudeMd.includes("Never generate"),
      "Must have an explicit 'Never generate' prohibition list"
    );
    assert.ok(
      claudeMd.includes("Violent, sexual, or scary/horror content"),
      "Must list all prohibited content types"
    );
  });

  it("handles jailbreak/boundary-pushing attempts", () => {
    assert.match(
      claudeMd,
      /push.+boundaries|jailbreak|stay.+firm/i,
      "Must have instructions for handling boundary-pushing"
    );
    assert.ok(
      claudeMd.includes("I can't do that one"),
      "Must have a firm but friendly redirect for off-limits requests"
    );
  });

  it("defaults to Phaser.js 3.x with CDN URL for games", () => {
    assert.ok(
      claudeMd.includes("Phaser.js 3.x"),
      "Must specify Phaser.js version 3.x"
    );
    assert.ok(
      claudeMd.includes(
        "https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.min.js"
      ),
      "Must include the exact Phaser CDN URL"
    );
  });
});

describe("SKILL.md files have valid frontmatter and correct names", () => {
  for (const skill of EXPECTED_SKILLS) {
    it(`${skill}/SKILL.md has valid closed frontmatter with matching name`, () => {
      const content = readSkill(skill);

      // Frontmatter must open and close with ---
      assert.match(
        content,
        /^---\n[\s\S]*?\n---/,
        "Must have properly opened AND closed YAML frontmatter"
      );

      // Name must match directory
      const nameMatch = content.match(/name:\s*(.+)/);
      assert.ok(nameMatch, "Must have a name field");
      assert.strictEqual(
        nameMatch[1].trim(),
        skill,
        `name field must match directory name '${skill}'`
      );

      // Description must be a real sentence (>20 chars)
      const descMatch = content.match(/description:\s*(.+)/);
      assert.ok(descMatch, "Must have a description field");
      assert.ok(
        descMatch[1].trim().length > 20,
        "Description must be a meaningful sentence (>20 chars)"
      );

      // Must have content after frontmatter
      const afterFrontmatter = content.split(/\n---\n/)[1] || "";
      assert.ok(
        afterFrontmatter.trim().length > 0,
        "Must have content body after frontmatter"
      );
    });
  }
});

describe("Cross-file consistency", () => {
  it("skills listed in CLAUDE.md match skill directories on disk", () => {
    const skillsDir = join(ROOT, ".claude", "skills");
    const dirsOnDisk = readdirSync(skillsDir).sort();
    for (const dir of dirsOnDisk) {
      assert.ok(
        claudeMd.includes(`/${dir}`),
        `Skill directory '${dir}' must be referenced as /${dir} in CLAUDE.md`
      );
    }
  });

  it("creation directory paths in CLAUDE.md match actual directories", () => {
    const referencedDirs = ["creations/games", "creations/stories", "creations/characters"];
    for (const dir of referencedDirs) {
      assert.ok(
        claudeMd.includes(dir),
        `CLAUDE.md must reference ${dir}`
      );
      assert.ok(
        existsSync(join(ROOT, dir)),
        `${dir} must exist on disk`
      );
    }
  });
});
