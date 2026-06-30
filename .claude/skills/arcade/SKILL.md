---
name: arcade
description: Build your own arcade website that holds all your games and put it online with one shareable link. Bundles every game into a self-contained site and publishes it to GitHub Pages.
---

# /arcade — Make Your Own Game Website!

Build the kid their very own arcade website — like a mini itch.io that they own. It's one page with a card for every game they've made, and a **Play** button on each. Then publish the whole thing to the internet so they get a single link they can share with everyone.

This is different from `/publish` (which puts **one** game on itch.io). `/arcade` makes **their own website** with **all** their games in one place.

## When to Use

- Kid says "make my own website", "build my arcade", "a place for all my games", or any variation
- Kid types `/arcade`
- Kid wants to update their arcade after building a new game (`/arcade` again rebuilds and republishes)

## How It Works (the big picture)

1. Build a self-contained website into `creations/arcade/site/` — an arcade landing page plus a copy of every game.
2. Push that site to a **GitHub Pages** repo the grown-up set up once.
3. The arcade goes live at a link like `https://<username>.github.io/<repo>/` that the kid can share.

Running `/arcade` again rescans their games, rebuilds the page, and republishes — new games just show up.

## Pre-Requisites

Before publishing, silently check these. Building the site locally (Steps 1–2 below) works without any of this — only **publishing** (Step 3) needs them. If a pre-req is missing, still build the site and open it locally, then explain the one-time setup for going online.

### 1. Is the arcade repo configured?

Check CLAUDE.md for the `**GitHub Arcade Repo**` field in the Kid Profile. If it still says `{{ARCADE_REPO}}` or is missing, the arcade hasn't been set up to go online yet.

Say: "To put your arcade on the internet, your grown-up helper needs to set up a free home for it first. Here's what they do, just once:"

1. Go to https://github.com and sign in (or make a free account).
2. Click **New repository**. Name it something like `<kid-name>-arcade`. Set it to **Public**. Don't add a README. Click **Create repository**.
3. Open the repo's **Settings → Pages**. Under **Build and deployment**, set **Source** to *Deploy from a branch*, choose branch **main** and folder **/(root)**, and click **Save**.
4. Copy the repo's web address (it looks like `https://github.com/<username>/<kid-name>-arcade.git`).

Then ask: "What's the repo address your grown-up helper just made?"

When they provide it, replace `{{ARCADE_REPO}}` in CLAUDE.md with that URL (store it in the Kid Profile). Then continue.

### 2. Can git push to it?

The first publish needs the grown-up to log in to GitHub once. If a push fails asking for a username or password:

Say: "Almost there! Your grown-up helper needs to connect to GitHub one time. Ask them to:"

1. Go to https://github.com/settings/tokens and create a **Personal Access Token** (classic) with the **repo** box checked. Copy it.
2. When the terminal asks for a **username**, type the GitHub username. When it asks for a **password**, paste the **token** (not the real password).

Say: "After that one time, your computer remembers it and you'll never have to do it again!"

## Process

### Step 1: Check for games

Scan `creations/games/` for `.html` files. Derive a display title from each filename (kebab-case → Title Case: `star-catcher.html` → "Star Catcher").

If there are **no** games yet, say: "Your arcade needs at least one game first! Try /game to build one, then come back." Stop here.

Ask the kid (skip if they already told you): **"What should we call your arcade?"** Suggest something using their name, like "[Name]'s Arcade" or "[Name]'s Game Zone". Use their interests for fun ideas.

### Step 2: Build the site

Create the site folder and copy each game in so the arcade is fully self-contained (it keeps working even if itch.io is down):

```bash
SITE_DIR="creations/arcade/site"
rm -rf "$SITE_DIR"
mkdir -p "$SITE_DIR/games"
for f in creations/games/*.html; do
  slug=$(basename "$f" .html)
  mkdir -p "$SITE_DIR/games/$slug"
  cp "$f" "$SITE_DIR/games/$slug/index.html"
done
```

Then generate the arcade landing page at `creations/arcade/site/index.html`. It must be a **self-contained HTML file** with all CSS embedded — no external assets. Make it:

- **Fun and arcade-flavored** — bright background, big bold title with the arcade name, rounded cards, a gamepad emoji 🎮.
- **A grid of game cards** — one card per game, showing the game's title and a big **▶ Play** button.
- Each Play button links with a **relative path** to that game: `games/<slug>/index.html` (so the same file works locally and on the live site).
- **Personalized** — use the kid's name and the arcade name they chose.
- **Responsive enough** — a simple flex/grid that looks good on a laptop screen.

Use the same friendly card style as the `/gallery` skill (blue/purple game cards, rounded corners, large text). Keep it kid-appropriate per the CLAUDE.md guardrails.

Open it locally so the kid sees it right away:

```bash
open creations/arcade/site/index.html
```

Say something like: "Here's your arcade! Every game has a Play button. Want to put it on the internet so you can share it?"

### Step 3: Publish to GitHub Pages

Only do this if the kid wants it online **and** the pre-requisites are met. Read the repo URL from CLAUDE.md.

Push the built site to the arcade repo. Because the site is rebuilt fresh every time, a force push is correct here — the repo only ever holds the latest arcade:

```bash
REPO_URL="<the URL from CLAUDE.md>"
PUBLISH_DIR=$(mktemp -d)
cp -R creations/arcade/site/. "$PUBLISH_DIR/"
cd "$PUBLISH_DIR"
git init -q
git add -A
git -c user.name="Nephs Workshop" -c user.email="workshop@local" commit -q -m "Update arcade"
git branch -M main
git remote add origin "$REPO_URL"
git push -f origin main
cd - >/dev/null
rm -rf "$PUBLISH_DIR"
```

**If the push succeeds**, work out the live link from the repo URL — `https://github.com/<user>/<repo>.git` becomes `https://<user>.github.io/<repo>/` — and say:

"Your arcade is live! Anyone can play your games at:"

```
https://<user>.github.io/<repo>/
```

Then say: "It can take about a minute to show up the very first time. Share that link with your friends and family!"

**If the push fails because of login** (it asks for a username/password or says authentication failed), show the grown-up login steps from Pre-Requisite 2. Don't show the raw error to the kid.

**If the push fails for any other reason**, say: "Hmm, that didn't work. Ask your grown-up helper to check the terminal for what happened." Don't show raw error output to the kid.

### Step 4: Updating later

When the kid builds new games and wants them on their arcade, they just run `/arcade` again. Rebuild the site (Step 2) and republish (Step 3). New games appear automatically; there's no extra setup the second time.

## Notes

- The GitHub account belongs to the grown-up helper (kids under 13 can't have their own) — that's fine and expected.
- The arcade repo is **public** because that's how anyone can open the link — but it only contains the games, nothing private.
- The arcade is regenerated from scratch each run, so it always matches the kid's current `creations/games/`.
- `/arcade` and `/publish` work great together: `/arcade` is the kid's own website with everything; `/publish` puts a single game on itch.io. Suggest `/arcade` when they want "their own place" for all their games.
- All content follows the CLAUDE.md guardrails — keep titles, text, and styling kid-appropriate.
