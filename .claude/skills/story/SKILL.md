---
name: story
description: Create an interactive choose-your-own-adventure story. Asks about theme and characters, then generates a branching story as a self-contained HTML file.
---

# /story — Write an Adventure Story!

Guide the kid through designing an interactive story, then generate a choose-your-own-adventure HTML page and open it in the browser.

## When to Use

- Kid says "write a story", "make a story", or any variation
- Kid types `/story`
- Kid types `/story [description]` with an inline description

## Process

### Step 1: Ask Design Questions (3 max)

Ask these questions one at a time. Use the kid's interests from CLAUDE.md to suggest ideas.

1. **"What's your story about?"**
   Suggest genres: "An adventure? A mystery? A sports drama? A space mission?"

2. **"Who's the main character?"**
   "Are you the hero? A Minecraft player? An astronaut? Someone else?"

3. **"What's the big challenge?"**
   "What's the quest or goal? Find treasure? Save the world? Win the championship?"

**If the kid provides a description with the command** (e.g., `/story a Minecraft adventure to find the Ender Dragon`), skip redundant questions and generate immediately.

### Step 2: Generate the Story HTML

Generate a self-contained HTML file with an interactive choose-your-own-adventure UI:

- **Branching narrative** — at each decision point, show **2-3 choices** as large, clickable buttons
- **Visual design** — book-like presentation with themed colors:
  - Adventure: green/earth tones
  - Mystery: purple/dark tones
  - Sports: blue/energetic
  - Sci-fi: dark blue/neon
- **Victory path** — at least one path must lead to a triumphant, celebratory ending
- **Try again on failure** — losing/bad paths offer a "Try again?" button that returns to the last decision point
- **Smooth transitions** — clicking a choice should smoothly reveal the next story segment (fade or slide)
- **No external dependencies** — all HTML/CSS/JS embedded in one file
- **Engaging writing** — vivid, exciting language appropriate for kids under 13

### Step 3: Save and Open

1. Save to `creations/stories/<kebab-case-slug>.html`
2. Open in browser: `open creations/stories/<slug>.html`
3. Tell the kid: "Your story is ready! Click the choices to play through it!"

### Step 4: Expand Existing Stories

When the kid wants to add to a story:

1. **Read the current story HTML** from disk to get the latest version
2. **Add new branching content** — new decision points, paths, or story segments
3. **Save the updated file** — overwrite the same file
4. **Tell the kid to refresh** the browser or re-open the file

## Content Guardrails

All stories must be age-appropriate and kid-safe:

- Stories should be exciting and positive — adventures, mysteries, quests, not horror or violence
- No blood, gore, realistic weapons, or scary/horror themes even if the story concept suggests it
- If a kid requests something inappropriate, gently redirect: "How about we make it a spooky mystery with friendly ghosts instead?"
- Keep each story segment short (2-4 sentences) so kids stay engaged
- The story should feel interactive — every choice should lead to meaningfully different outcomes
