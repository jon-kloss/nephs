---
name: game
description: Build a playable Phaser.js browser game. Asks a few fun design questions, then generates a self-contained HTML5 game file and opens it in the browser.
---

# /game — Build a Video Game!

Guide the kid through designing a game with fun Socratic questions, then generate a complete playable Phaser.js game and open it in the browser. This is the **wow moment** — make it fast, fun, and magical.

## When to Use

- Kid says "build a game", "make a game", or any variation
- Kid types `/game`
- Kid types `/game [description]` with an inline description

## Process

### Step 1: Ask Design Questions (3-4 max)

Ask these questions one at a time. Reference the kid's interests from CLAUDE.md to offer personalized suggestions.

1. **"What kind of game do you want to make?"**
   Suggest options based on their interests: "A platformer like Minecraft? A sports game? A quiz? A space shooter?"
   Supported types: platformer, sports, collector, quiz/trivia, clicker, space shooter

2. **"What's the theme?"**
   "Should it be Minecraft-themed? Space? Sports? Animals? Something else?"

3. **"What does the player do?"**
   "Do they collect things? Avoid enemies? Answer questions? Score goals?"

4. *(Optional)* **"Any special features?"**
   "Power-ups? Multiple levels? High score? A timer?" — Skip if the kid seems eager to see results.

**If the kid provides a description with the command** (e.g., `/game a basketball shooting game`), skip redundant questions. Ask at most 1 clarifying question if something is ambiguous, then generate immediately.

**After questions are answered**, summarize before building: "OK! Building a Minecraft-themed platformer where you collect diamonds and avoid creepers. Hang on..."

### Step 2: Generate the Phaser.js Game

Generate a **self-contained HTML file** with the following structure. All code must be embedded — no external scripts except the Phaser CDN. Use programmatic graphics only (colored shapes, Canvas-drawn sprites, geometric characters) — no external image assets.

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>[Game Title]</title>
  <script src="https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.min.js"></script>
  <style>
    body { margin: 0; background: #000; display: flex; justify-content: center; align-items: center; height: 100vh; overflow: hidden; }
  </style>
</head>
<body>
<script>
// Define scene classes BEFORE creating the game

class TitleScene extends Phaser.Scene {
  constructor() { super('TitleScene'); }
  create() {
    // Show game name, control instructions, "Press SPACE to Start"
  }
}

class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }
  create() {
    // Main gameplay: controls, score tracking, spawning, collisions
  }
  update() {
    // Game loop: input handling, movement, game-over checks
  }
}

class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOverScene'); }
  create() {
    // Show final score, "Press SPACE to Restart"
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 300 }, debug: false }
  },
  scene: [TitleScene, GameScene, GameOverScene]
};

const game = new Phaser.Game(config);
</script>
</body>
</html>
```

#### Required Game Elements

Every generated game MUST include:

1. **Title screen** — Shows the game name, control instructions (e.g., "Arrow keys to move, Space to jump"), and a "Press SPACE to Start" or "Click to Play" prompt
2. **Working controls** — Keyboard controls appropriate for the game type (arrow keys, WASD, space bar, mouse clicks)
3. **Score or progress tracking** — Visible score counter, level indicator, or progress bar
4. **Win condition or game-over state** — Something that ends/loops the game (lives running out, timer expiring, reaching a goal, beating a score)
5. **Programmatic graphics** — Colored rectangles, circles, text, and Canvas-drawn shapes. No external image URLs. Make them colorful and visually appealing.

#### Game Type Reference

| Type | Key Mechanics | Physics |
|------|--------------|---------|
| Platformer | Gravity, platforms, jumping, collecting items, avoiding enemies | Arcade with gravity |
| Sports | Ball physics, goals/hoops, scoring, timer-based challenges | Arcade, custom ball physics |
| Collector | Top-down movement, spawning items, avoid obstacles, increasing speed | Arcade without gravity |
| Quiz/Trivia | Question display, multiple choice buttons, score tracking, timer | No physics needed (DOM-like) |
| Clicker | Click/tap detection, visible counter, upgrades display | No physics needed |
| Space Shooter | Ship movement, projectiles, enemy waves, lives system | Arcade without gravity |

### Step 3: Save and Open

1. Save the HTML file to `creations/games/<kebab-case-slug>.html` — derive the slug from the game title (e.g., "Diamond Collector" → `diamond-collector.html`)
2. Open the game in the browser using the `open` command: `open creations/games/<slug>.html`
3. Tell the kid: "Your game is open! Go play it! When you're done, come back and tell me what to change."

### Step 4: Iterate on the Game

When the kid wants to modify their game:

1. **Read the current game file** — Always read the existing HTML file from disk to get the latest version
2. **Understand the requested change** — "make the character faster", "add more enemies", "change the colors"
3. **Generate an updated version** — Modify the game code while preserving all existing functionality. Don't start from scratch unless the kid asks to.
4. **Write the updated file** — Overwrite the same file
5. **Tell the kid to refresh** — "Updated! Refresh your browser to see the changes." Or re-open with `open creations/games/<slug>.html`

For multiple iterations, always read the current file state from disk, not from memory. Each modification must preserve all previous changes.

When the kid wants a **new game** (types `/game` again), start a fresh design flow. Save with a **different filename** so the previous game is preserved in their collection.

## Content Guardrails for Games

All games must be kid-friendly and age-appropriate:

- Enemies should be **cartoon/fantasy style** — colored shapes, funny creatures, abstract obstacles
- **No blood, gore, or realistic weapons** — defeating enemies uses jumping on them, collecting them, tagging them, or dodging them
- Conflict is always **playful** — think Minecraft mobs, not Call of Duty
- Themes should be fun and positive — adventures, sports, space exploration, puzzles, collecting
- If a kid requests something violent, redirect: "How about we make the enemies into silly monsters you boop on the head instead?"
