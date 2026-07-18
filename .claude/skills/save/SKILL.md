---
name: save
description: Save the kid's work to the cloud (GitHub) so it's backed up and shared. Runs git add/commit/push behind the scenes with a friendly message and cheerful confirmation. Use whenever the kid says "save", "save my work", "push", "back this up", or wants to make sure their stuff isn't lost.
---

# /save — Save Your Work to the Cloud!

Back up everything the kid has built by pushing it to GitHub. The kid should **never see
git commands, jargon, or error text.** They just say "save my work" and it happens. You do
all the technical parts silently and report back with a simple, happy message.

## When to Use

- Kid types `/save`
- Kid says "save my work", "save this", "push it", "back it up", "don't lose my stuff"
- After finishing a build step or feature, offer it: "Want me to save your work?"

## What "Saving" Means (say it simply)

To the kid: *"Saving puts your work in the cloud so it's safe and your uncle can see it
too — like hitting save on a video game."*

Behind the scenes this is `git add` + `git commit` + `git push`. The kid never needs to
know those words.

## Process

Do all of this yourself with the Bash tool. Keep the kid out of the plumbing.

### Step 1: See what changed
```bash
cd /Users/jon/Projects/nephs && git status --short
```
- If **nothing changed**, tell them warmly: "Everything's already saved — you're all
  good!" and stop. Don't commit an empty change.

### Step 2: Stage the work (skip junk)
```bash
git add creations/ .claude/ specs/ 2>/dev/null; git status --short
```
- Stage the folders that hold real work. **Never** stage `.DS_Store` or other junk. If a
  `.gitignore` doesn't already list `.DS_Store`, quietly add one first (see Setup below).

### Step 3: Save it with a friendly message
Write a short, plain-language commit message describing what they just did — no jargon.
Good: `Save Mall Drifters mall build`. Bad: `refactor: update workspace hierarchy`.
```bash
git commit -m "Save <plain description of what they did>

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

### Step 4: Push to the cloud
```bash
git push 2>&1
```

### Step 5: Cheer (and hide any errors)
- **On success:** "Saved! ✅ Your work is safe in the cloud and your uncle can see it now."
- **If push fails** (auth, network, etc.): do NOT show the error. Say: "Your work is
  saved on this computer, but I couldn't send it to the cloud just now — a grown-up might
  need to check the connection. Your stuff is safe either way!" Then, for the grown-up
  only if they're around, briefly note what failed so they can fix it.

## First-Time Setup (do once, silently)

If these aren't in place, handle them quietly before the first save — don't make the kid
watch:

- **Ignore junk files:** if `nephs/.gitignore` doesn't exist or doesn't mention
  `.DS_Store`, create/append it with `.DS_Store` on its own line.
- **Git credentials:** pushing needs auth. If `git push` fails with a username/credential
  error, the machine's GitHub login isn't wired up — run `gh auth setup-git` (requires the
  grown-up to have logged in with `gh auth login` first). If `gh` isn't logged in, tell
  the grown-up: "A grown-up needs to run `gh auth login` once to connect this computer to
  GitHub — after that, saving is one click forever."

## Keep It Kid-Safe

- Never print raw git output, error stacks, or merge-conflict text to the kid.
- Never ask the kid to type a git command.
- If something's genuinely broken, reassure first ("your work is safe on this computer"),
  then flag it for a grown-up — never let the kid feel they broke something.
