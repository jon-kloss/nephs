@status(verified)
@foundation @setup
@blocks(intro-skill)
@blocks(game-skill)
@blocks(story-skill)
@blocks(character-skill)
@blocks(gallery-skill)

# Feature: Project Setup

As an uncle who wants to set up a creative workshop for my nephews
I want a project template with CLAUDE.md, skills, and directory structure
So that each kid has a ready-to-go workshop when they open Claude Code

## Technical Context

- **Template**: A git repo the uncle clones to each kid's machine (or creates manually)
- **CLAUDE.md**: The heart of the workshop — shapes Claude's personality and enforces guardrails
- **Skills directory**: `.claude/skills/` with one subdirectory per skill
- **Creations directory**: `creations/{games,stories,characters}/` for generated files
- **Gallery**: `gallery/index.html` — static page updated by /gallery skill
- **Claude Code config**: Uncle's API key configured via `claude config` or environment variable

### CLAUDE.md Template Design

The CLAUDE.md ships as a **template** with placeholders (`{{KID_NAME}}`, `{{INTERESTS}}`, `{{FAVORITE_GAMES}}`). The `/intro` skill fills these in during the first session. Uncle does NOT need to edit CLAUDE.md manually.

The CLAUDE.md must make Claude:
1. Greet the kid by name (filled in by /intro)
2. Use short, encouraging, jargon-free language
3. Suggest skills when the kid describes what they want ("Sounds like you want to build a game! Try /game")
4. Never show raw error messages — translate to kid-friendly language
5. Keep responses under 3 sentences unless generating code
6. Use fun language (not cringe — no "super duper awesome", just natural and encouraging)
7. Enforce age-appropriate content in ALL interactions, not just skills
8. Default to Phaser.js for any game-related generation
9. Detect unpersonalized state (placeholders still present) and nudge toward `/intro`

### CLAUDE.md Content Guardrails

- No violent, sexual, or scary content
- No real weapons (fantasy/game weapons like Minecraft swords are OK)
- No horror themes
- Redirect off-topic requests back to creating: "That's interesting! Want to make a game about that?"
- If kid tries to "jailbreak" or push boundaries, stay friendly but firm

## Background

- Given the uncle has a MacBook to set up for each nephew
- And Claude Code is installed (`npm install -g @anthropic-ai/claude-code`)
- And the uncle has an Anthropic API key

## Rule: Uncle can set up a workshop in under 5 minutes

### Scenario: Setting up from template

- Given the uncle has cloned/created the project template
- When he opens the project directory
- Then the directory contains CLAUDE.md (with template placeholders), .claude/skills/, and creations/ subdirectories
- And he only needs to configure the API key via `ANTHROPIC_API_KEY` environment variable or Claude Code settings
- And CLAUDE.md does NOT need manual editing — /intro handles personalization

### Scenario: API key configuration

- Given the uncle has his Anthropic API key
- When he runs `export ANTHROPIC_API_KEY=sk-ant-...` (or adds it to shell profile)
- Then Claude Code can make API calls
- And the kid never sees or needs to know about the API key

## Rule: Claude greets kids warmly on startup

### Scenario: First interaction (not yet personalized)

- Given CLAUDE.md still has `{{KID_NAME}}` placeholders
- When the kid runs `claude` in the workshop directory
- Then Claude says something like "Hey! Looks like we haven't met yet. Run /intro so I can get to know you!"
- And does NOT proceed with other activities until /intro is run

### Scenario: First interaction (personalized)

- Given CLAUDE.md has been personalized with name "Alex" and interests "Minecraft, Fortnite"
- When Alex runs `claude` in the workshop directory
- Then Claude greets Alex by name
- And mentions what they can do: build games, write stories, create characters
- And suggests starting with /game for the wow moment

### Scenario: Returning user

- Given the kid has used the workshop before and has 3 creations
- When they start a new Claude Code session
- Then Claude greets them and mentions they can keep building or start something new

## Rule: Directory structure supports all creation types

### Scenario: Fresh project structure

- Given a newly set up workshop
- Then the following directories exist:
  - `creations/games/`
  - `creations/stories/`
  - `creations/characters/`
  - `gallery/`
- And `.claude/skills/` contains subdirectories for each skill

## Rule: Skills are discoverable

### Scenario: Kid asks what they can do

- Given the workshop is running
- When the kid types "what can I do?" or "help"
- Then Claude lists the available skills with fun descriptions:
  - `/game` — Build a video game you can play in your browser
  - `/story` — Write a choose-your-own-adventure story
  - `/character` — Create an AI character you can talk to
  - `/gallery` — See all the cool things you've built
