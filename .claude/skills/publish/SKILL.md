---
name: publish
description: Publish a game to itch.io using butler. Lists the kid's games, prepares the upload, and pushes to itch.io so anyone can play it online.
---

# /publish — Put Your Game on the Internet!

Upload a game to itch.io so friends and family can play it in their browser. Uses the `butler` CLI tool to push the game build.

## When to Use

- Kid says "publish my game", "put my game online", "share my game", or any variation
- Kid types `/publish`
- Kid types `/publish [game name]` to publish a specific game

## Pre-Requisites

Before the publish flow begins, silently check these two things:

### 1. Is butler installed?

Run `which butler` to check. If butler is NOT installed:

Say: "To put your games online, we need a tool called butler. Ask your grown-up helper to run these in the terminal:"

```bash
curl -L -o /tmp/butler.zip https://broth.itch.zone/butler/darwin-arm64/LATEST/archive/default
unzip -o /tmp/butler.zip -d ~/bin
chmod +x ~/bin/butler
```

If `~/bin` is not in PATH, also add: `echo 'export PATH="$HOME/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc`

Then say: "Once that's done, try /publish again!"

**Stop here** — do not continue the flow.

### 2. Is butler logged in?

Check if the credentials file exists at `~/Library/Application Support/itch/butler_creds`. Also check if `BUTLER_API_KEY` is set in the environment. If neither exists:

Say: "We need to connect to itch.io. Ask your grown-up helper to:"

1. Go to https://itch.io/user/settings/api-keys and create an API key
2. Then run this in the terminal to save it:

```bash
export BUTLER_API_KEY="paste-your-key-here"
butler login
```

**Important:** `butler login` requires the API key to be set via environment variable — it does not work interactively inside Claude Code. The grown-up helper can also add `export BUTLER_API_KEY="..."` to their `~/.zshrc` to make it permanent.

Then say: "Once that's done, try /publish again!"

**Stop here** — do not continue the flow.

### 3. Is the itch.io username configured?

Check CLAUDE.md for the `**itch.io Username**` field. If it still says `{{ITCH_USERNAME}}` or is missing:

Ask: "What's the itch.io username for your account? (Ask your grown-up helper if you're not sure!)"

When they provide it, update CLAUDE.md by replacing `{{ITCH_USERNAME}}` with the username. Store it in the Kid Profile section.

**Important:** Butler uses the URL-slug form of the username (hyphens, not underscores). If the user gives a username like `cool_kid`, convert it to `cool-kid` for the butler push target. The itch.io URL will be `https://<url-slug>.itch.io/`.

## Process

### Step 1: List Available Games

Scan `creations/games/` for `.html` files. If no games exist, say: "You haven't built any games yet! Try /game to make one, then come back to publish it."

If the kid provided a game name with the command (e.g., `/publish diamond collector`), try to match it to an existing file. If there's only one game, skip the selection and use it automatically.

If there are multiple games, list them with numbers:

"Which game do you want to publish?"
1. Diamond Collector
2. Space Adventure
3. Basketball Shooter

### Step 2: Prepare the Upload

itch.io HTML5 games need the main file named `index.html`. Prepare the upload:

```bash
GAME_FILE="creations/games/<slug>.html"
UPLOAD_DIR=$(mktemp -d)
cp "$GAME_FILE" "$UPLOAD_DIR/index.html"
```

### Step 3: Push to itch.io

Derive the itch.io game slug from the filename (it's already kebab-case). Read the username from CLAUDE.md.

```bash
butler push "$UPLOAD_DIR" "<username>/<game-slug>:html5"
```

**If the push succeeds:**

Clean up the temp directory and say: "Your game is live! Anyone can play it at:"

```
https://<username>.itch.io/<game-slug>
```

Then say: "Share that link with your friends and family!"

**If the push fails because the game page doesn't exist on itch.io:**

Say: "Almost there! The game page needs to be created on itch.io first. Ask your grown-up helper to:"
1. Go to itch.io and click **Dashboard → Create new project**
2. Set the title to **[Game Title]**
3. Set "Kind of project" to **HTML**
4. Set the viewport to **800 × 600**
5. Save the page

Then say: "Once that's done, try /publish again and it'll upload automatically!"

**If the push fails for any other reason:**

Say: "Hmm, that didn't work. Ask your grown-up helper to check the terminal for what happened." Do not show raw error output to the kid.

### Step 4: Clean Up

Always remove the temp directory after the push completes (whether it succeeded or failed):

```bash
rm -rf "$UPLOAD_DIR"
```

## Notes

- The itch.io account belongs to the grown-up helper (kids under 13 can't have their own account) — this is fine and expected
- Butler does incremental uploads, so re-publishing after changes is fast
- The game page on itch.io needs to be created once via the web dashboard — butler handles all subsequent uploads
- Game slugs on itch.io match the kebab-case filenames from the workshop (e.g., `diamond-collector`)
- After the first publish, updating is just `/publish` again — butler pushes only the changes
