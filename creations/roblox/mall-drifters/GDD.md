# Mall Drifters (our version) — Game Design Document

> A drifting game you slide around a shopping mall to earn Drift Points, then spend
> them on faster cars. Built in Roblox Studio, uncle + nephew, one feature at a time.

---

## 1. High Concept

You drive a car around an indoor mall and **drift** — slide sideways on purpose — to
rack up **Drift Points**. The longer and cleaner you drift without stopping, the higher
your combo multiplier climbs. Spend your points at **the shop** to unlock a second,
faster car that drifts even better. Chill, arcade-y, no combat, no losing.

**One-line pitch:** *Slide around the mall, build a combo, buy a cooler car, do it again.*

---

## 2. Core Fantasy & Design Pillars

**Fantasy:** "I'm a smooth drifter and everyone can see my sick combo number climbing."

Three pillars every decision serves:

1. **Sliding feels good.** The drift is the whole game. It must feel loose and fun, not
   realistic or fiddly. Arcade over simulation, always.
2. **No frustration, no failure.** You can't crash-and-die, run out of time, or get a
   game over. The worst that happens is your combo resets. It's a hangout.
3. **Small, satisfying goals.** See the number go up. Hit a new combo. Afford the next
   car. Every session should have a little "I earned that" moment.

---

## 3. Player Verbs & Controls

The player can only do a few things — that's on purpose.

| Input | Action |
|-------|--------|
| **W / S** | Accelerate / reverse |
| **A / D** | Steer left / right |
| **Left Shift** | Handbrake — breaks grip, starts a slide |
| **C** | Change camera angle |
| **L** | Toggle car headlights *(nephew feature)* |
| **H** | Hide/show the on-screen UI *(nephew feature)* |

That's the entire control scheme. Matching the real Mall Drifters keeps it familiar.

---

## 4. Core Loop

```
   ┌─────────────────────────────────────────────┐
   │                                             │
   ▼                                             │
 DRIVE ──► DRIFT (hold Shift + steer) ──► EARN Drift Points
   │              │                              │
   │              └──► build COMBO (x1 → x5)      │
   │                                             ▼
   │                                       SPEND at SHOP
   │                                             │
   └──────────────── unlock a FASTER car ◄───────┘
```

A full loop the first day: drive → drift a few runs → afford the Neon Slider → buy it →
it drifts better → chase a bigger combo.

---

## 5. Mechanics

### 5.1 Arcade Drift Model (the heart of the game)

We do **not** use real wheel/suspension physics. The car is a single floating part and
we fake the slide. Two directions matter:

- **Heading** — the way the car is *facing*.
- **Momentum** — the way the car is *actually moving*.

When these line up, you're driving straight (full grip). When you hold **Shift** and
steer, the heading swings faster than the momentum can follow. The gap between them is the
**slip angle** — that's a drift.

- **Grippy (normal):** momentum snaps toward heading quickly → tight, controlled turns.
- **Slippy (handbrake held):** momentum turns toward heading *slowly* → the car slides
  out and keeps its old speed sideways. That's the drift.

Everything is a few tunable numbers (grip strength, handbrake grip, turn speed, top
speed) so we can dial in the feel together during the build.

### 5.2 Drift Scoring

While drifting you earn points every fraction of a second:

```
points_per_second = k × speed × slipAmount × comboMultiplier
```

- **speed** — faster = more points (rewards commitment).
- **slipAmount** — bigger slide angle = more points (rewards style), clamped so spinning
  in a circle isn't the optimal strategy.
- You only score when **speed is above a minimum** and **slip is above ~15°**. Below that
  you're just driving.

### 5.3 Combo Multiplier (the juice)

- Starts at **x1**. Every second of *continuous* drifting, it climbs by +0.1, up to **x5**.
- The instant you stop drifting (straighten out, stop, or hit a wall hard), the combo
  **resets to x1** and your banked run points are added to your total.
- On-screen it reads big and bright: `DRIFT!  1,240  x3.4`.
- This one number is the game's whole risk/reward: keep sliding to grow it, or play safe.

### 5.4 The Shop & Economy

- One shop zone in the mall (a marked spot / building — "Brian's Shop" in the original).
- Drive into it (or press a button in range) to open the shop UI.
- Buy the **Neon Slider** for a set price. Points are deducted; the car unlocks; you can
  now choose it at spawn.

**Starting numbers (tune later):**

| Thing | Value | Why |
|-------|-------|-----|
| Good drift run | ~150–300 points | A satisfying single run |
| Neon Slider cost | **1,000 points** | ~4–6 good runs; earned in one sitting, not a grind |
| Combo cap | **x5** | High enough to chase, not silly |

---

## 6. Cars

Two cars for the first milestone. Cars are simple shapes/models — the *feel* comes from
the numbers, not the mesh.

| Car | Cost | Top speed | Grip | Vibe |
|-----|------|-----------|------|------|
| **Mall Cruiser** | Free (starter) | Medium | Higher (easier) | Friendly, forgiving. Learn here. |
| **Neon Slider** | 1,000 pts | High | Lower (slippier) | Faster, slides way more → bigger combos, harder to tame. |

Design rule: the unlockable car isn't just "better," it's **slidier**. It raises the
skill ceiling and the score ceiling, so buying it changes how you play.

---

## 7. World / Setting

An indoor **shopping mall** — wide open floors, big smooth tiles, some pillars and planter
boxes to slide around. Bright, clean, friendly.

- **Drift-friendly layout:** open plazas connected by wide corridors. Room to build speed
  and long arcing slides. Obstacles are *decorative slalom targets*, not tight mazes.
- **Landmarks:** a central fountain/atrium, the shop storefront, a car spawn pad near the
  entrance.
- No shoppers, no hazards, no fall-off-the-map. It's a playground.

---

## 8. UI / HUD

Minimal and readable at speed:

- **Drift meter** (center-top, only while drifting): `DRIFT!  <run points>  x<combo>`
- **Total points** (corner): your bank, always visible.
- **Speedometer** (optional, corner): nice-to-have juice.
- **Shop panel** (only near shop): car card, price, BUY button.
- **H** hides all of it for clean screenshots.

---

## 9. Technical Approach (for the builders)

- **Engine:** Roblox Studio, **Luau**.
- **Car:** one floating Part (or small Model with a PrimaryPart) moved by a velocity
  constraint we drive from script. No wheels, no suspension. Keeps it robust and tweakable.
- **Placement conventions:**
  - Car control / drift / input → **LocalScript** in `StarterPlayer → StarterPlayerScripts`.
  - Scoring, shop purchases, saving → **Script** in **ServerScriptService** (server owns
    the points so they're trustworthy).
  - Mall, cars, shop, spawn pad → **Workspace**.
- **Client/server split:** the client feels the drift and shows the HUD; the server
  keeps the official point total and handles buying/saving. (For milestone 1 we can keep
  scoring client-side and harden later — noted in the build plan.)
- Each script is saved as its own `.lua` file in `scripts/`. Live step list lives in
  `build-guide.md` once we start building.

---

## 10. Scope — Milestones

**Milestone 1 (our first goal): the full mini-loop.**
Drive a car in the mall → hold Shift to drift → watch Drift Points + combo climb → drive
to the shop → buy the Neon Slider → drive the new car. *If this is fun, the game works.*

**Milestone 2 (next):** save your points & owned cars between visits (DataStore),
polish the drift feel, add lights/hide-UI, add a 3rd car, add tandem/multiplayer nicety.

**Milestone 3 (dream):** more cars + a tuning menu, bigger mall, leaderboard, tandem
buddy, music. Only after M1 is fun.

---

## 11. Out of Scope (on purpose, for now)

Combat, damage, timers, losing, real car physics, character customization, in-game money
purchases, other players' cars colliding. We can revisit anything later — but not in M1.

---

*Content note: pure driving/drifting in a mall — no violence, nothing scary. Fully
kid-appropriate.*
