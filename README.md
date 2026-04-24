# Nephs Workshop

An AI-powered creative workshop for kids. Built on [Claude Code](https://claude.ai/code) with custom skills that let kids build playable browser games, interactive stories, and AI characters through guided conversations.

Kids type natural language and Claude builds things for them — no coding experience needed.

## What Kids Can Do

| Command | What it does |
|---------|-------------|
| `/intro` | Set up the workshop — Claude asks their name, favorite games, and interests |
| `/game` | Build a playable Phaser.js browser game through guided questions |
| `/story` | Write a choose-your-own-adventure story as an interactive HTML page |
| `/character` | Create a custom AI character and chat with it in the terminal |
| `/gallery` | See all their creations in a visual gallery page |

## Quick Start (Uncle Setup Guide)

### Prerequisites

- A Mac (macOS 14+)
- An [Anthropic API key](https://console.anthropic.com/) — you provide this for the kid
- A FaceTime/Zoom call to walk them through it (or do it in person)

### Step 1: Run the Install Script

Have the kid open **Terminal** (Cmd+Space, type "Terminal", press Enter) and paste this:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/jon-kloss/nephs/main/install.sh)
```

The script installs everything automatically:

1. **Xcode Command Line Tools** — developer tools and git
2. **Homebrew** — macOS package manager
3. **Node.js** — runtime needed by Claude Code
4. **Claude Code** — the AI assistant CLI
5. **Ghostty** — a fast, kid-friendly terminal (configured with larger font)
6. **Workshop files** — cloned to `~/workshop`
7. **API key** — prompts the kid to paste it, saves to `~/.zshrc`

The kid may need to enter their Mac password during Homebrew installation — that's normal.

### Step 2: Open Ghostty

After the install finishes, have the kid open **Ghostty** from Applications (or Cmd+Space, type "Ghostty").

### Step 3: Start the Workshop

In Ghostty, type:

```bash
cd ~/workshop
claude
```

### Step 4: Run Intro

Once Claude starts, type:

```
/intro
```

Claude will ask the kid their name, favorite games, and interests. This personalizes the entire workshop experience.

### Step 5: Build Something

After intro, the kid types:

```
/game
```

Claude asks a few fun questions (What kind of game? What's the theme? What does the player do?) then generates a complete playable Phaser.js game and opens it in their browser. This is the wow moment.

## How It Works

The project is a set of Claude Code [custom skills](https://docs.anthropic.com/en/docs/claude-code/skills) — prompt files that shape how Claude behaves when kids interact with it.

```
nephs/
  CLAUDE.md                         # Workshop personality, guardrails, kid profile
  .claude/skills/
    intro/SKILL.md                  # First-run personalization
    game/SKILL.md                   # Phaser.js game builder
    story/SKILL.md                  # Choose-your-own-adventure stories
    character/SKILL.md              # AI character creator and role-play
    gallery/SKILL.md                # Visual gallery of all creations
  creations/
    games/                          # Saved game HTML files
    stories/                        # Saved story HTML files
    characters/                     # Saved character profiles (markdown)
  gallery/                          # Generated gallery page
  install.sh                        # One-step Mac setup
  uninstall.sh                      # Clean removal
```

- **CLAUDE.md** sets Claude's personality (friendly workshop assistant for kids under 13), enforces content guardrails, and stores the kid's profile (name, interests, favorite games).
- **Each SKILL.md** defines a guided workflow — Socratic questions tailored to the kid, then Claude generates the creation.
- **Games** are self-contained HTML files using [Phaser.js 3](https://phaser.io/) loaded via CDN. All graphics are programmatic (colored shapes, Canvas-drawn sprites) — no external assets.
- **Stories** are self-contained HTML files with branching choices as clickable buttons.
- **Characters** are markdown profiles saved to disk. Claude role-plays the character directly in the terminal.

## Content Guardrails

All content is appropriate for kids under 13:

- No violent, sexual, scary/horror, or inappropriate content
- Game enemies are cartoon/fantasy style — no blood, gore, or realistic weapons
- If a kid pushes boundaries, Claude redirects to fun alternatives without lecturing
- Characters always stay kid-safe regardless of their defined personality

## Uninstall

To remove everything:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/jon-kloss/nephs/main/uninstall.sh)
```

This removes the workshop files, Claude Code, Ghostty, and the API key. It asks before removing Node.js and Homebrew since other apps may use them.

## Running Tests

Tests validate that all skill files contain required instructions, guardrails, and cross-file consistency:

```bash
node --test
```

107 tests across 6 test files.

## License

MIT
