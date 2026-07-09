# Mall Drifters — Implementation Plan (uncle + nephew, take turns)

How we split the build. You each **own whole features** end-to-end. Nephew takes the
easier / more visual ones, you take the trickier logic. We go in the order below so the
game is **playable a little more after every single feature** — nobody waits on a big
blob before they can press Play.

Legend: 🧒 = nephew owns · 👨 = you (Jon) own · 🎮 = playtest gate (both stop & play)

---

## Milestone 1 — The full mini-loop

Goal: drive → drift → earn points + combo → buy the Neon Slider → drive it.

### Turn order (dependency-correct)

| # | Turn | Feature | What "done" looks like | Depends on |
|---|------|---------|------------------------|------------|
| 1 | 👨 | **The Mall** | An open mall floor in Workspace with walls, a couple pillars, and a flat spawn area. You can walk around it. | — |
| 2 | 🧒 | **Drivable car** | One car part you can sit in and drive with WASD around the mall. No drift yet — just moves and steers. *(A great first script for him — you/I guide it.)* | 1 |
| 3 | 🧒 | **Car #1 look (Mall Cruiser)** | The drive-able part dressed up to look like a real starter car (body, roof, color). Still drives the same. | 2 |
| 4 | 👨 | **Drift handling** | Hold **Left Shift** + steer and the car *slides* — keeps momentum sideways, snaps back to grip when you release. The feel is fun. | 2 |
| 5 | 🎮 | **PLAYTEST** | Both of you drive + drift around the mall. Tune the numbers together until sliding feels good. | 4 |
| 6 | 👨 | **Drift scoring + HUD** | While drifting, `DRIFT! <points> x<combo>` shows on screen; combo climbs while you hold a slide and resets when you stop; total points bank in the corner. | 4 |
| 7 | 🧒 | **The shop building** | A storefront in the mall ("Brian's Shop") with a marked zone/pad you can drive into. Just the build — no buying logic yet. | 1 |
| 8 | 🧒 | **Car #2 look (Neon Slider)** | A second, cooler-looking car model, parked/displayed near the shop. Looks fast. | 3 |
| 9 | 👨 | **Shop logic + buy** | Drive into the shop zone → a BUY panel appears → spend 1,000 points → Neon Slider unlocks (points deducted, can't buy twice). | 6, 7, 8 |
| 10 | 👨 | **Car selector / spawn** | At the spawn pad, choose which owned car to drive; it spawns and you're in it. Neon Slider handles slidier than the Cruiser. | 9 |
| 11 | 🎮 | **PLAYTEST — Milestone 1 done!** | Full loop works start to finish. Celebrate. 🎉 | 10 |

### Who has what (Milestone 1 tally)
- **🧒 Nephew:** #2 Drivable car, #3 Cruiser look, #7 Shop building, #8 Neon Slider look
  → *he owns the whole car plus the shop & second car — a mix of building and his first script.*
- **👨 You:** #1 Mall, #4 Drift, #6 Scoring+HUD, #9 Shop logic, #10 Selector
  → *you build the world and carry the hard physics/economy scripting.*

Roughly even in count. The basic drive script (#2) is gentle enough to be his first taste
of code — you and I guide it — while you keep the tricky drift/scoring/economy logic.

---

## Milestone 2 — Make it stick & feel good (after M1 is fun)

| Turn | Feature | Notes |
|------|---------|-------|
| 👨 | **Save system** | DataStore saves total points + owned cars between visits. Move point-tracking to the server so it's trustworthy. |
| 👨 | **Drift feel polish** | Tune grip/slip curves, add a little tire-screech sound + skid effect. |
| 🧒 | **Lights toggle (L)** | LocalScript: press L → headlights on/off. Easy, satisfying first script for him. |
| 🧒 | **Hide UI (H)** | LocalScript: press H → hide/show HUD for clean screenshots. Another gentle one. |
| 🧒 | **Car #3 look** | A third car to design. |
| 👨 | **3rd car unlock** | Wire the new car into the shop + selector. |

---

## Milestone 3 — Dream list (only if you're still having fun)

Tuning menu · bigger multi-floor mall · leaderboard of top combos · tandem buddy /
multiplayer · music · daily bonus. Design these fresh when you get here.

---

## How we actually build each feature

For every feature, run **`/roblox`** and tell me which numbered feature you're on. I'll:
1. Give you the exact steps in Roblox Studio (where to put the part, what to name it).
2. Write the Luau script and save it to `scripts/<feature>.lua`.
3. Tell you exactly where to paste it (Script in ServerScriptService, LocalScript in
   StarterPlayerScripts, etc. — see the GDD's placement conventions).
4. Tell you how to test it before moving on.

**Ground rules that keep this smooth:**
- **One feature at a time**, in the order above. Don't start #6 before #4 works.
- **Play after every 🎮 gate.** If it's not fun, we tune before adding more.
- Whoever owns a feature drives Studio for it; the other watches (great for learning).
- Every script saved as its own `.lua` file so nothing gets lost between sessions.
- `build-guide.md` will track exactly which step we're on, session to session.

---

## Files in this project

```
mall-drifters/
  GDD.md          ← the design (what & why)
  build-plan.md   ← this file (who builds what, in what order)
  build-guide.md  ← created when we start building (live step tracker)
  scripts/        ← every Luau script, one .lua file each
```

Ready when you are — say **`/roblox`** and we'll start with **#1, the Mall** (your turn).
