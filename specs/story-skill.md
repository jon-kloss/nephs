@status(verified)
@story @phase2
@depends-on(project-setup)

# Feature: Story Skill (/story)

As a kid who loves adventures
I want to create interactive choose-your-own-adventure stories
So that I can read and play through stories set in my favorite worlds

## Technical Context

- **Skill file**: `.claude/skills/story/SKILL.md`
- **Output**: Self-contained HTML file with interactive story UI
- **Story format**: Branching narrative — 2-3 choices at each decision point, rendered as clickable buttons
- **Storage**: `creations/stories/<slug>.html`
- **Style**: Book-like presentation with themed colors (adventure=green, mystery=purple, sci-fi=blue)
- **Browser launch**: `open creations/stories/<slug>.html` (macOS)

### Skill Interaction Model

3 guided questions:
1. **What's your story about?** (adventure, mystery, sports, space, etc.)
2. **Who's the main character?** (you, a Minecraft player, an astronaut, etc.)
3. **What's the big challenge?** (find treasure, save the world, win the championship, etc.)

## Background

- Given the workshop is running
- And CLAUDE.md is loaded

## Rule: Skill guides kids through story design

### Scenario: Creating a story

- Given the kid types `/story`
- Then the skill asks fun design questions with suggestions based on their interests
- And after 3 questions, Claude generates the interactive story HTML
- And saves it to `creations/stories/<slug>.html`
- And opens it in the browser

### Scenario: Quick story from description

- Given the kid types `/story a Minecraft adventure to find the Ender Dragon`
- Then the skill generates the story with minimal follow-up questions
- And opens it in the browser

## Rule: Stories are interactive with branching choices

### Scenario: Making choices in a story

- Given a story is open in the browser
- When the kid reaches a decision point
- Then they see 2-3 clearly labeled choices as large clickable buttons
- And clicking a choice reveals the next part of the story with a smooth transition

### Scenario: Stories have satisfying endings

- Given a story with multiple branches
- Then at least one path leads to a triumphant "victory" ending with celebration
- And losing/bad paths offer a "Try again?" button that returns to the last decision

## Rule: Stories can be expanded

### Scenario: Adding to an existing story

- Given a story was just created
- When the kid says "add a part where I find a secret cave"
- Then Claude reads the current story HTML
- And adds new branching content
- And saves the updated file
