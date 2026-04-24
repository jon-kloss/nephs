---
name: intro
description: First-time workshop personalization. Asks the kid their name, favorite games, and interests, then updates CLAUDE.md with their answers.
---

# /intro — Welcome to Your Workshop!

Personalize this workshop by asking the kid a few fun questions and updating CLAUDE.md with their answers.

## When to Use

- First time opening the workshop (CLAUDE.md still has `{{KID_NAME}}` placeholder)
- When a kid or uncle wants to update their profile info

## Process

### Step 1: Check if already personalized

Read CLAUDE.md and check if it still contains `{{KID_NAME}}`.

- **If `{{KID_NAME}}` is found**: This is a fresh workshop. Proceed to Step 2.
- **If `{{KID_NAME}}` is NOT found** (already personalized): Say "Your workshop is already set up! Want to update your info?" If they say yes, proceed to Step 2 (ask the same questions and update CLAUDE.md with new answers). If they say no, suggest trying /game, /story, or /character.

### Step 2: Ask fun questions (one at a time)

Ask these questions one at a time. Keep it fun and casual — these are kids!

1. **"First things first — what's your name?"**
   - Wait for answer. Use their name in follow-up questions.

2. **"Awesome, [name]! What games do you like to play? (Minecraft, Fortnite, Roblox, or something else?)"**
   - Wait for answer. This becomes `{{FAVORITE_GAMES}}`.

3. **"Cool! What about sports or other stuff you're into?"**
   - Wait for answer. Combine with games for `{{INTERESTS}}`.

4. *(Optional)* If the conversation feels natural, ask: **"Last one: what should we call your workshop? Or I can just call it [name]'s Workshop."**
   - This is optional — skip if the kid seems eager to start building.

### Step 3: Update CLAUDE.md with their answers

Read CLAUDE.md and replace the placeholders using the Edit tool with `replace_all: true`:

1. Replace all instances of `{{KID_NAME}}` with their name
2. Replace `{{FAVORITE_GAMES}}` with their favorite games (comma-separated)
3. Replace `{{INTERESTS}}` with ALL their interests combined — games + sports + hobbies (comma-separated)

**Example replacements:**
- Name: "Alex" → `{{KID_NAME}}` becomes `Alex`
- Games: "Minecraft, Fortnite" → `{{FAVORITE_GAMES}}` becomes `Minecraft, Fortnite`
- Interests: "Minecraft, Fortnite, basketball, Legos" → `{{INTERESTS}}` becomes `Minecraft, Fortnite, basketball, Legos`

Use the Edit tool three times:
```
Edit CLAUDE.md: old_string="{{KID_NAME}}" new_string="[their name]" replace_all=true
Edit CLAUDE.md: old_string="{{FAVORITE_GAMES}}" new_string="[their games]" replace_all=true
Edit CLAUDE.md: old_string="{{INTERESTS}}" new_string="[all interests]" replace_all=true
```

### Step 4: Confirm and suggest next step

After updating CLAUDE.md, say something like:

"You're all set, [name]! Your workshop is ready. Try **/game** to build your first game!"

Keep it short and exciting — they're ready to create!

## Important Notes

- Keep questions fun and encouraging — no interrogation vibes
- If a kid gives a one-word answer, that's fine — don't push for more
- If they seem confused, give examples: "Like Minecraft? Fortnite? Roblox?"
- The uncle might run /intro on the kid's behalf during setup — that's fine, same process
- After /intro completes, the CLAUDE.md should have zero remaining `{{` placeholders
