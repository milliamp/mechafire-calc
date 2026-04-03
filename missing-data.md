# Mecha Fire - Missing & Incomplete Game Data

This document tracks all known gaps in the app's game data.
Once data is confirmed, it can be added to `js/data.js`.

---

## Buildings - Missing Neurotium Costs

These building levels have `neurotium: 0` in the app, but likely have actual costs:

| Building | Level | Notes |
|---|---|---|
| Reactor Core | 28 | No data in original spreadsheet |
| Reactor Core | 30 | No data in original spreadsheet |
| Reactor Core | 31 | No data in original spreadsheet |
| Council Hall | 28 | No data in original spreadsheet |
| Council Hall | 30 | No data in original spreadsheet |
| Council Hall | 32 | No data in original spreadsheet |

## Buildings - Levels 36+

### Reactor Core (from screenshots)

| To Level | Neurotium | Pre-Req 1 | Pre-Req 2 | Source |
|---|---|---|---|---|
| 36 | ? | ? | ? | **MISSING** |
| 37 | 120 | Aircraft Camp 37 | Council Hall 37 | IMG_1520.jpg |
| 38 | 120 | Council Hall 38 | Mobile Camp 38 | IMG_1517.png |
| 39 | 120 | Council Hall 39 | Tank Camp 39 | IMG_1518.png |
| 40 | 180 | Council Hall 40 | Aircraft Camp 40 | IMG_1519.png |
| 41 | 180 | Council Hall 41 | Mobile Camp 41 | IMG_1521.png |
| 42 | 180 | Council Hall 42 | Tank Camp 42 | IMG_1522.png |
| 43 | 180 | Council Hall 43 | Aircraft Camp 43 | IMG_1523.png |
| 44 | 180 | Cyborg Lab 44 | Council Hall 44 | IMG_1524.png |

**Note:** Neurotium jumps from 120 to 180 at level 40. Level 44 also shows Master Blueprints = 10.
**Note:** Prereq pattern cycles Mobile Camp -> Tank Camp -> Aircraft Camp, with Cyborg Lab appearing at 44.

### Level 39 - All Buildings (from user)

| Building | Neurotium | Pre-Req 1 | Notes |
|---|---|---|---|
| Reactor Core | 120 | Council Hall 39 | Pre-Req 2: Tank Camp 39 |
| Council Hall | 60 | RC 39 | |
| Mobile Camp | 40 | RC 39 | |
| Tank Camp | 40 | RC 39 | |
| Air Camp | 40 | RC 39 | |
| Rally Field | 40 | RC 39 | Union Code? |
| Defence Outpost | ? | ? | Def Components? |
| Cyborg Lab | 20 | RC 39 | |
| Rebirth Center | 40 | RC 39 | |
| Hospital | 40 | RC 39 | |
| Warehouse | 20 | RC 39 | |
| Power Plant | 10 | RC 39 | |
| Tunnel Farm | 10 | RC 39 | |
| Water Works | 10 | RC 39 | |
| Aurinite Pit | 10 | RC 39 | |
| Gas Station x8 | 10 | RC 39 | |

**Still missing for Level 39:** Defence Outpost, Union Code (Rally), Def Components (Defence Outpost), Master Blueprints, Pre-Req 2 for most buildings.

---

## Warbringer - Missing Early Tier Costs

All tiers have costs in-game, but data is missing for early tiers in the original spreadsheet:

| Tier | Status |
|---|---|
| Fine, Fine I, Fine II | Costs unknown |
| Rare | Costs unknown |
| Rare I | Only Control Knob known (30) -- QC/FM missing |
| Rare II | Only Control Knob known (40) -- QC/FM missing |
| Rare III | Only Control Knob known (60) -- QC/FM missing |
| Epic | Only Control Knob known (80) -- QC/FM missing |
| Epic I+ | All costs known |

Per-slot unlock tiers may also be wrong -- the spreadsheet showed certain slots starting at different tiers, but in-game all slots may have costs from Fine onwards.

---

## Hero Generations / Seasons

Once all heroes are mapped, the hero dropdown can be sorted by generation then alphabetically.

| Hero | Rarity | Generation |
|---|---|---|
| Myoza | R | Gen-I |
| Jaxor | R | Gen-I |
| Celsia | R | Gen-I |
| BunnyBee | SR | Gen-I |
| Viathor | SR | Gen-I |
| Lily | SR | Gen-I |
| Lance | SR | Gen-I |
| Akita | SR | Gen-I |
| Kirastar | SR | Gen-I |
| Lexia | SR | Gen-I |
| Auria | SR | Gen-I |
| Xarlie | SR | Gen-I |
| Megil | SSR | Gen-I |
| Marco | SSR | Gen-II |
| Nyxamon | SSR | Gen-II |
| Blitzbrute | SSR | Gen-II |
| Axiom-7 | SSR | Gen-IV |
| Ragnarok | SSR | Gen-IV |
| Cerebrix | SSR | Gen-IV |
| Voidbat | SSR | Gen-V |
| Galactron | SSR | Gen-V |
| Mantislayer | SSR | Gen-V |
| Cragorex | SSR | Gen-V |
| Lucy | SSR | ? |
| Astrax | SSR | ? |
| Randor | SSR | ? |
| Melissa | SSR | ? |
| Zima | SSR | ? |
| Grunt | SSR | ? |
| Sancia | SSR | ? |

**Still missing:** Gen for Lucy, Astrax, Randor, Melissa, Zima, Grunt, Sancia. Also Gen-III heroes unknown.

---

## Other Missing Data

- **Union Code amounts** for Rally Field at levels 36+
- **Defense Component amounts** for Defence Outpost at levels 36+
- **Master Blueprint costs** per level (assumed 10 for all, unconfirmed beyond 35)
- **Crystal sub-type assignments** per slot (which type goes where)
- **Exclusive Equipment** -- unclear if cost per level varies by hero rarity
