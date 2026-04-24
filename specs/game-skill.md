@status(verified)
@game @wow-moment @phaser
@depends-on(project-setup)

# Feature: Game Skill (/game)

As a kid who loves video games
I want to describe a game and have AI build it for me
So that I can play a game I designed in my browser within minutes

This is the **wow moment** — the first thing kids experience. The /game skill uses kid-friendly Socratic questions to guide them through designing their game, then Claude generates a complete Phaser.js game and opens it in the browser.

## Technical Context

- **Skill file**: `.claude/skills/game/SKILL.md`
- **Output**: Self-contained HTML file with Phaser.js loaded via CDN
- **Game engine**: Phaser.js 3.x (`https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.min.js`)
- **Graphics**: Programmatic (colored shapes, emoji-based sprites, or Canvas-drawn characters — no external assets)
- **Storage**: `creations/games/<slug>.html`
- **Browser launch**: `open creations/games/<slug>.html` (macOS)

### Phaser.js Game Template Structure

Generated games follow this structure:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>[Game Title]</title>
  <script src="https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.min.js"></script>
  <style>body { margin: 0; background: #000; display: flex; justify-content: center; align-items: center; height: 100vh; }</style>
</head>
<body>
<script>
  // Complete Phaser.js game config and scenes
  // Title screen → Gameplay → Game Over
  // All graphics generated programmatically (no external assets)
</script>
</body>
</html>
```

### Skill Interaction Model

The skill uses 3-4 guided questions, not open-ended prompting:
1. **What kind of game?** (platformer, collector, sports, quiz, etc.)
2. **What's the theme?** (Minecraft, space, sports, animals, etc.)
3. **What does the player do?** (collect things, avoid enemies, answer questions, score goals)
4. **Any special features?** (power-ups, levels, high score, etc.) — optional

Then Claude generates the game. No more than 4 questions before the kid sees results.

## Background

- Given the workshop is running (`claude` started in the project directory)
- And CLAUDE.md is loaded with personality and guardrails

## Rule: Skill guides kids through game design with Socratic questions

### Scenario: Starting the game skill

- Given the kid types `/game`
- Then the skill greets them excitedly and asks the first question
- And the question offers suggestions based on their interests (from CLAUDE.md)
- And the kid can pick a suggestion or describe their own idea

### Scenario: Completing the design questions

- Given the kid has answered all design questions
- Then Claude summarizes what it's about to build: "OK! Building a Minecraft-themed platformer where you collect diamonds and avoid creepers. Hang on..."
- And begins generating the Phaser.js game

### Scenario: Kid gives a one-line description instead of answering questions

- Given the kid types `/game a basketball shooting game`
- Then the skill skips redundant questions
- And may ask 1 clarifying question at most ("Should it have a timer or unlimited shots?")
- And generates the game quickly

## Rule: Generated games use Phaser.js and are self-contained

### Scenario: Game file structure

- Given the AI generates a game
- Then the output is a single HTML file
- And it loads Phaser.js from CDN
- And all game logic is embedded in the file (no external scripts)
- And all graphics are generated programmatically (no external image assets)

### Scenario: Game includes title screen and instructions

- Given any generated game
- Then it shows a title screen with the game name
- And displays control instructions ("Arrow keys to move, Space to jump")
- And has a "Press SPACE to Start" or "Click to Play" prompt

### Scenario: Game has core mechanics working

- Given any generated game
- Then the player can control a character or interact with the game
- And there is a score or progress indicator
- And there is a win condition, game-over state, or increasing difficulty
- And the game runs smoothly in Safari or Chrome

## Rule: Kids can iterate on their games

### Scenario: Modifying the current game

- Given a game was just created and is open in the browser
- When the kid types "make the character faster" or "add more enemies"
- Then Claude reads the current game file
- And generates an updated version preserving existing functionality
- And saves it (overwriting the file)
- And tells the kid to refresh the browser (or re-opens it)

### Scenario: Multiple iterations

- Given a game has been modified 3 times
- When the kid requests another change
- Then Claude reads the current state of the file (not a cached version)
- And all previous modifications are preserved in the code

### Scenario: Starting a new game

- Given the kid types `/game` while a previous game exists
- Then the skill starts a fresh design flow
- And the previous game remains in `creations/games/` (not overwritten)

## Rule: Game types cover kid interests

### Scenario Outline: Various game types are supported

- Given the kid describes a <game_type> game
- When Claude generates it with Phaser.js
- Then it produces a playable game with appropriate <mechanics>

#### Examples

| game_type | mechanics |
|-----------|-----------|
| platformer | arcade physics, gravity, platforms, jumping, collecting items |
| sports | ball physics, goals/hoops, scoring, timer |
| collector | top-down movement, spawning items, avoid obstacles, increasing speed |
| quiz/trivia | question display, multiple choice buttons, score tracking |
| clicker | click detection, counter, upgrades display |
| space shooter | ship movement, projectiles, enemy waves, lives |

## Rule: All games are age-appropriate

### Scenario: Content guardrails in games

- Given any game request
- When the game involves conflict (enemies, obstacles)
- Then enemies are cartoon/fantasy style (not realistic violence)
- And "defeating" enemies uses kid-friendly mechanics (jumping on them, collecting them, tagging them)
- And there is no blood, gore, or realistic weapons
