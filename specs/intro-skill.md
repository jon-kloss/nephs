@status(verified)
@onboarding @foundation
@depends-on(project-setup)

# Feature: Intro Skill (/intro)

As a kid opening the workshop for the first time
I want Claude to ask me about myself in a fun way
So that the workshop feels personal without me editing any files

## Technical Context

- **Skill file**: `.claude/skills/intro/SKILL.md`
- **What it modifies**: Reads CLAUDE.md, replaces template placeholders with real values, writes it back
- **Placeholders in CLAUDE.md template**: `{{KID_NAME}}`, `{{INTERESTS}}`, `{{FAVORITE_GAMES}}`
- **Trigger**: Kid or uncle runs `/intro` on first use
- **Detection**: If CLAUDE.md still contains `{{KID_NAME}}`, the workshop hasn't been personalized yet

### Interaction Model

3-4 fun questions, asked one at a time:
1. **What's your name?** — "First things first — what's your name?"
2. **What games do you play?** — "Awesome! What games do you like? (Minecraft, Fortnite, Roblox, others?)"
3. **What else are you into?** — "Cool! What about sports or other stuff you like?"
4. **Pick a workshop name** (optional) — "Last one: what should we call your workshop? Or I can just call it [Name]'s Workshop."

## Background

- Given Claude Code is running in the workshop directory
- And CLAUDE.md exists with template placeholders

## Rule: Intro asks fun personalization questions

### Scenario: First-time intro

- Given CLAUDE.md contains `{{KID_NAME}}` (not yet personalized)
- When the kid or uncle runs `/intro`
- Then the skill asks for the kid's name
- And asks about their favorite games
- And asks about other interests (sports, hobbies)
- And optionally asks for a workshop name

### Scenario: Intro completes and updates CLAUDE.md

- Given the kid answered: name="Alex", games="Minecraft, Fortnite", interests="basketball, Legos"
- When all questions are answered
- Then Claude reads CLAUDE.md
- And replaces `{{KID_NAME}}` with "Alex"
- And replaces `{{INTERESTS}}` with "Minecraft, Fortnite, basketball, Legos"
- And replaces `{{FAVORITE_GAMES}}` with "Minecraft, Fortnite"
- And writes the updated CLAUDE.md
- And confirms: "You're all set, Alex! Your workshop is ready. Try /game to build your first game!"

## Rule: Intro detects already-personalized workshop

### Scenario: Running intro again

- Given CLAUDE.md does NOT contain `{{KID_NAME}}` (already personalized)
- When the kid runs `/intro`
- Then Claude says "Your workshop is already set up! Want to update your info?"
- And if yes, asks the same questions and updates CLAUDE.md
- And if no, suggests trying /game, /story, or /character

## Rule: Uncle can also run intro for the kid

### Scenario: Uncle runs intro during setup

- Given the uncle is setting up the MacBook before giving it to the kid
- When uncle runs `/intro`
- Then the same questions are asked
- And uncle can answer on the kid's behalf
- And the workshop is ready when the kid first opens it

## Rule: Unpersonalized workshop nudges toward /intro

### Scenario: Kid starts claude without running intro

- Given CLAUDE.md still has `{{KID_NAME}}` placeholder
- When the kid starts Claude Code and types anything
- Then Claude recognizes the workshop isn't personalized yet
- And says: "Hey! Looks like we haven't met yet. Run /intro so I can get to know you!"
