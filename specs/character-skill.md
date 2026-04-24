@status(verified)
@chat @phase2
@depends-on(project-setup)

# Feature: Character Skill (/character)

As a kid who loves game characters
I want to create custom AI characters I can talk to
So that I can have fun conversations with characters I invented

## Technical Context

- **Skill file**: `.claude/skills/character/SKILL.md`
- **Character profile**: Saved as `creations/characters/<slug>.md` — contains name, personality, knowledge, speaking style
- **Chat**: Happens directly in Claude Code — Claude role-plays the character using the profile as a system prompt
- **No separate chat UI needed** — Claude Code's terminal IS the chat interface
- **Session persistence**: Character profile file persists between sessions; conversation history resets per session (Claude Code limitation)

### Character Profile Format

```markdown
# Character: Redstone Rex

**Type**: Minecraft Villager
**Personality**: Enthusiastic, nerdy about redstone, speaks in villager-esque patterns ("Hmm, yes yes!")
**Knowledge**: Expert in Minecraft redstone contraptions, circuits, and builds
**Speaking style**: Short sentences, uses Minecraft terms, occasionally says "Hmm!" and "Emeralds!"
**Catchphrase**: "That's a fine piece of redstone work!"
**Topics they love**: Redstone, farming, trading, village life
**Topics they redirect**: Anything non-Minecraft gets redirected with "Hmm, that reminds me of a redstone build!"
```

### Skill Interaction Model

3 guided questions:
1. **Who's your character?** (a Minecraft villager, a basketball coach, a space explorer, etc.)
2. **What do they know about?** (redstone, basketball moves, alien planets, etc.)
3. **How do they talk?** (funny, serious, uses catchphrases, etc.)

## Background

- Given the workshop is running
- And CLAUDE.md is loaded

## Rule: Skill guides kids through character creation

### Scenario: Creating a character

- Given the kid types `/character`
- Then the skill asks 3 fun questions about their character
- And after answering, Claude creates the character profile markdown file
- And saves it to `creations/characters/<slug>.md`
- And immediately enters character mode: "Redstone Rex is here! Say hi!"
- And Claude begins role-playing as the character

### Scenario: Quick character from description

- Given the kid types `/character a basketball coach who tells bad jokes`
- Then the skill creates the profile with minimal follow-up
- And enters character mode immediately

## Rule: Claude stays in character during chat

### Scenario: In-character conversation

- Given the kid is chatting with "Redstone Rex" (Minecraft villager expert)
- When the kid types "how do I make a piston door?"
- Then Claude responds in-character with villager speech patterns
- And gives genuinely helpful Minecraft information
- And stays in the character's personality

### Scenario: Exiting character mode

- Given the kid is chatting with a character
- When they type "bye" or "exit" or "I want to do something else"
- Then Claude drops the character role
- And returns to normal workshop assistant mode
- And says something like "Redstone Rex waves goodbye! What do you want to do next?"

## Rule: Characters can be revisited

### Scenario: Talking to an existing character

- Given the kid previously created "Coach Mike"
- When they type "talk to Coach Mike" or `/character Coach Mike`
- Then Claude reads the character profile from `creations/characters/coach-mike.md`
- And enters character mode as Coach Mike

### Scenario: Listing available characters

- Given the kid has created 3 characters
- When they type "who can I talk to?" or list characters
- Then Claude lists all character profiles in `creations/characters/`

## Rule: All character interactions are kid-safe

### Scenario: Content guardrails in character chat

- Given any character conversation
- When the kid sends any message
- Then the character's response is always age-appropriate
- And the character gently redirects inappropriate topics back to fun subjects
- And this applies regardless of the character's defined personality
