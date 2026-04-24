@status(verified)
@ui @gallery
@depends-on(project-setup)

# Feature: Gallery Skill (/gallery)

As a kid who has built multiple creations
I want to see all my creations in one visual page
So that I can revisit them, show them to friends, and feel proud of what I've built

## Technical Context

- **Skill file**: `.claude/skills/gallery/SKILL.md`
- **Output**: `gallery/index.html` — regenerated each time /gallery is invoked
- **Data source**: Scans `creations/games/`, `creations/stories/`, `creations/characters/` for HTML files
- **Style**: Colorful card grid, game-UI inspired (bright colors, big icons, fun fonts)
- **Implementation**: Self-contained HTML/CSS/JS with no external dependencies
- **Browser launch**: `open gallery/index.html` (macOS)

## Background

- Given the workshop is running
- And the kid has created at least one creation

## Rule: Gallery shows all creations as visual cards

### Scenario: Viewing the gallery with creations

- Given the kid has 3 games and 1 story in `creations/`
- When they type `/gallery`
- Then Claude scans the creations directories
- And generates `gallery/index.html` with a card for each creation
- And each card shows the filename-derived title and a type icon (gamepad/book/chat)
- And cards are organized by type (Games, Stories, Characters)
- And opens the gallery in the browser

### Scenario: Empty gallery

- Given no creations exist yet
- When the kid types `/gallery`
- Then Claude generates a gallery page with a friendly message
- And suggests: "Your gallery is empty! Try /game to build your first creation."

## Rule: Gallery links directly to creations

### Scenario: Opening a creation from the gallery

- Given the gallery shows a game called "Diamond Collector"
- When the kid clicks on it
- Then the game opens in the browser and is immediately playable
- And the gallery uses relative file paths so links work locally

## Rule: Gallery is visually fun

### Scenario: Kid-friendly design

- Given the gallery is generated
- Then it uses bright colors and large text
- And has a fun header ("Alex's Workshop" or similar using the kid's name from CLAUDE.md)
- And each creation type has a distinct visual style (different card colors or icons)
- And the page looks good on a MacBook screen (responsive within laptop viewport)
