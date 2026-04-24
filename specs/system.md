@status(approved)
@system

# System: Nephs Workshop

A Claude Code project template that turns a MacBook into an AI-powered creative workshop for kids (under 13). Instead of building a custom tool, this project uses Claude Code itself as the creative engine — with custom skills (/game, /story, /character, /gallery) that provide kid-friendly Socratic guidance, and a CLAUDE.md that shapes Claude into an encouraging workshop assistant.

Uncle sets up the project, provides his Anthropic API key, and guides kids remotely over FaceTime. Kids open the terminal, type `claude`, and start creating.

## Architecture

```
Claude Code (installed on kid's MacBook, uncle's API key)
  + CLAUDE.md (personality, guardrails, age-appropriate behavior)
  + Custom skills (kid-friendly creation workflows)
  = AI Creative Workshop
```

No custom server, no custom CLI, no deployment. Claude Code IS the tool.

## Tech Stack

- **AI Agent**: Claude Code (CLI) with uncle's Anthropic API key
- **Game Engine**: Phaser.js 3.x (loaded via CDN in generated HTML files)
- **Story/Chat UI**: Self-contained HTML/CSS/JS files
- **Browser**: macOS `open` command to launch creations in default browser
- **Skills**: Markdown skill files in `.claude/skills/`
- **Config**: CLAUDE.md for personality + guardrails

## Project Structure (on kid's MacBook)

```
nephs-workshop/
  CLAUDE.md                          # Workshop personality + guardrails
  .claude/
    skills/
      game/SKILL.md                  # /game — build Phaser.js games
      story/SKILL.md                 # /story — interactive stories
      character/SKILL.md             # /character — AI character creation
      gallery/SKILL.md              # /gallery — browse all creations
  creations/
    games/                           # Generated Phaser.js game HTML files
    stories/                         # Generated interactive story HTML files
    characters/                      # Character profiles (markdown)
  gallery/
    index.html                       # Visual gallery of all creations
```

## Feature Map

| Feature | Spec | Dependencies | Priority |
|---------|------|--------------|----------|
| Project Setup | project-setup.md | (none) | P0 - Foundation |
| Intro Skill | intro-skill.md | project-setup | P0 - First Run |
| Game Skill | game-skill.md | project-setup | P0 - The Wow Moment |
| Gallery Skill | gallery-skill.md | project-setup | P1 - Playground |
| Story Skill | story-skill.md | project-setup | P2 - Expansion |
| Character Skill | character-skill.md | project-setup | P2 - Expansion |

## The Wow Moment Flow

1. Uncle installs Claude Code on kid's MacBook, configures API key
2. Uncle creates the workshop project (clones template or runs setup)
3. Kid opens Terminal (uncle guides over FaceTime)
4. Kid types `claude`
5. Claude nudges: "Hey! Let's get to know each other. Run /intro!"
6. Kid types `/intro` → answers 3-4 fun questions → CLAUDE.md is personalized
7. Kid types `/game`
7. Skill asks 3-4 fun questions (theme, mechanics, special features)
8. Claude generates a Phaser.js game → opens in browser
9. Kid plays their game, then says "add more enemies" or "make it harder"
10. Claude updates the game → browser shows changes

## Non-Functional Requirements

### Scenario: First creation under 3 minutes

- Given the workshop is set up and Claude Code is running
- When a kid invokes /game and answers the design questions
- Then a playable Phaser.js game opens in the browser within 90 seconds of the final answer

### Scenario: Age-appropriate content everywhere

- Given CLAUDE.md includes content guardrails
- When a kid makes any request (via skill or freeform)
- Then all generated content is appropriate for under-13 audiences
- And Claude gently redirects inappropriate requests

### Scenario: Remotely guidable

- Given an uncle guiding over FaceTime
- When the kid follows spoken instructions
- Then every step requires only typing simple words/sentences
- And Claude's responses are short, encouraging, and jargon-free

### Scenario: Resilient to kid input

- Given kids may misspell words, be vague, or go off-topic
- When input is imperfect
- Then Claude interprets intent generously
- And asks a friendly clarifying question if truly ambiguous
- And never shows error messages or technical jargon
