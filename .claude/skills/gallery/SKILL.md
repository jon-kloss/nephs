---
name: gallery
description: Browse all creations in a visual gallery. Generates a colorful HTML page with cards for every game, story, and character, then opens it in the browser.
---

# /gallery — See Your Creations!

Scan the creations directory, generate a visual gallery page, and open it in the browser.

## When to Use

- Kid says "show my stuff", "see my gallery", or any variation
- Kid types `/gallery`

## Process

### Step 1: Scan creations directories

Read the contents of these directories:
- `creations/games/` — look for `.html` files
- `creations/stories/` — look for `.html` files
- `creations/characters/` — look for `.md` files

List all files found. Derive a display title from each filename (convert kebab-case to Title Case: `diamond-collector.html` → "Diamond Collector").

### Step 2: Handle empty gallery

If no creations exist in any directory, generate a gallery page with a friendly message: "Your gallery is empty! Try /game to build your first creation."

### Step 3: Generate gallery/index.html

Generate a self-contained HTML/CSS/JS file at `gallery/index.html`. The page should be:

- **Colorful and fun** — bright background colors, large text, rounded card corners
- **Organized by type** — separate sections for Games, Stories, and Characters with distinct card colors:
  - Games: blue/purple cards with a gamepad emoji icon
  - Stories: green/teal cards with a book emoji icon
  - Characters: orange/red cards with a chat emoji icon
- **Personalized** — use the kid's name from CLAUDE.md in the header (e.g., "Alex's Workshop" or "[Name]'s Creations")
- **Clickable** — each card links to the creation file using **relative file paths** (e.g., `../creations/games/diamond-collector.html`) so links work locally from the `gallery/` directory
- **Responsive** — looks good on a MacBook screen (no need for mobile support)
- **No external dependencies** — all CSS and JS embedded in the file

Each card should show:
- The creation's title (derived from filename)
- A type icon (emoji)
- The file type (Game / Story / Character)

### Step 4: Open in browser

Open the gallery using: `open gallery/index.html`

Tell the kid: "Here's your gallery! Click on anything to open it."

## Notes

- The gallery is regenerated fresh each time /gallery is run — it always reflects the current state of creations/
- If the kid asks to see their stuff or mentions their gallery outside of the /gallery command, suggest running /gallery
