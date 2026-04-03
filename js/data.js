// ══════════════════════════════════════════════════
//  MECHA FIRE - GAME DATA
//  All game constants, costs, and roster data.
//  Edit this file when game data changes.
// ══════════════════════════════════════════════════

const BUILDINGS = [
  { name: "Reactor Core", id: "reactor-core", levels: {
    28:{neurotium:0}, 29:{neurotium:120,prereqs:[{building:"council-hall",level:29},{building:"tank-camp",level:29}]},
    30:{neurotium:0}, 31:{neurotium:0},
    32:{neurotium:180,prereqs:[{building:"council-hall",level:31},{building:"cyborg-lab",level:31}]},
    33:{neurotium:220,prereqs:[{building:"council-hall",level:32},{building:"mobile-camp",level:32}]},
    34:{neurotium:260,prereqs:[{building:"council-hall",level:33},{building:"tank-camp",level:33}]},
    35:{neurotium:300,prereqs:[{building:"council-hall",level:34},{building:"air-camp",level:34}]}
  }},
  { name: "Council Hall", id: "council-hall", levels: {
    28:{neurotium:0}, 29:{neurotium:63}, 30:{neurotium:0}, 31:{neurotium:105}, 32:{neurotium:0},
    33:{neurotium:154}, 34:{neurotium:182},
    35:{neurotium:210,prereqs:[{building:"rally-field",level:35},{building:"rebirth-center",level:35}]}
  }},
  { name: "Mobile Camp", id: "mobile-camp", levels: {
    28:{neurotium:12},29:{neurotium:18},30:{neurotium:24},31:{neurotium:30},32:{neurotium:36},33:{neurotium:44},34:{neurotium:52},
    35:{neurotium:60,prereqs:[{building:"tank-camp",level:35},{building:"air-camp",level:35}]}
  }},
  { name: "Tank Camp", id: "tank-camp", levels: {
    28:{neurotium:12},29:{neurotium:18},30:{neurotium:24},31:{neurotium:30},32:{neurotium:36},33:{neurotium:44},34:{neurotium:52},
    35:{neurotium:60,prereqs:[{building:"water-works",level:35},{building:"aurinite-pit",level:35}]}
  }},
  { name: "Air Camp", id: "air-camp", levels: {
    28:{neurotium:12},29:{neurotium:18},30:{neurotium:24},31:{neurotium:30},32:{neurotium:36},33:{neurotium:44},34:{neurotium:52},
    35:{neurotium:60,prereqs:[{building:"power-plant",level:35},{building:"tunnel-farm",level:35}]}
  }},
  { name: "Rally Field", id: "rally-field", levels: {
    28:{neurotium:9,unionCode:400},29:{neurotium:14,unionCode:600},30:{neurotium:18,unionCode:800},31:{neurotium:23,unionCode:1000},
    32:{neurotium:27,unionCode:1200},33:{neurotium:33,unionCode:1500},34:{neurotium:39,unionCode:2000},
    35:{neurotium:45,unionCode:3000,prereqs:[{building:"defence-outpost",level:35},{building:"warehouse",level:35}]}
  }},
  { name: "Defence Outpost", id: "defence-outpost", levels: {
    28:{neurotium:9,defComp:400},29:{neurotium:14,defComp:600},30:{neurotium:18,defComp:800},31:{neurotium:23,defComp:1000},
    32:{neurotium:27,defComp:1200},33:{neurotium:33,defComp:1500},34:{neurotium:39,defComp:2000},35:{neurotium:45,defComp:3000}
  }},
  { name: "Cyborg Lab", id: "cyborg-lab", levels: {
    28:{neurotium:12},29:{neurotium:18},30:{neurotium:24},31:{neurotium:30},32:{neurotium:36},33:{neurotium:44},34:{neurotium:52},
    35:{neurotium:60,prereqs:[{building:"council-hall",level:35},{building:"mobile-camp",level:35}]}
  }},
  { name: "Rebirth Center", id: "rebirth-center", levels: {
    28:{neurotium:10},29:{neurotium:16},30:{neurotium:21},31:{neurotium:27},32:{neurotium:32},33:{neurotium:40},34:{neurotium:47},
    35:{neurotium:54,prereqs:[{building:"hospital",level:35},{building:"gas-station-x8",level:35}]}
  }},
  { name: "Hospital", id: "hospital", levels: {28:{neurotium:9},29:{neurotium:14},30:{neurotium:18},31:{neurotium:23},32:{neurotium:27},33:{neurotium:33},34:{neurotium:39},35:{neurotium:45}}},
  { name: "Warehouse", id: "warehouse", levels: {28:{neurotium:6},29:{neurotium:10},30:{neurotium:14},31:{neurotium:18},32:{neurotium:22},33:{neurotium:26},34:{neurotium:31},35:{neurotium:36}}},
  { name: "Power Plant", id: "power-plant", levels: {28:{neurotium:3},29:{neurotium:5},30:{neurotium:7},31:{neurotium:9},32:{neurotium:11},33:{neurotium:13},34:{neurotium:16},35:{neurotium:18}}},
  { name: "Tunnel Farm", id: "tunnel-farm", levels: {28:{neurotium:5},29:{neurotium:7},30:{neurotium:10},31:{neurotium:12},32:{neurotium:14},33:{neurotium:18},34:{neurotium:21},35:{neurotium:24}}},
  { name: "Water Works", id: "water-works", levels: {28:{neurotium:5},29:{neurotium:7},30:{neurotium:10},31:{neurotium:12},32:{neurotium:14},33:{neurotium:18},34:{neurotium:21},35:{neurotium:24}}},
  { name: "Aurinite Pit", id: "aurinite-pit", levels: {28:{neurotium:5},29:{neurotium:7},30:{neurotium:10},31:{neurotium:12},32:{neurotium:14},33:{neurotium:18},34:{neurotium:21},35:{neurotium:24}}},
  { name: "Gas Station x8", id: "gas-station-x8", levels: {28:{neurotium:5},29:{neurotium:7},30:{neurotium:10},31:{neurotium:12},32:{neurotium:14},33:{neurotium:18},34:{neurotium:21},35:{neurotium:24}}}
];
const BLD_ID_MAP = {};
BUILDINGS.forEach((b,i) => { BLD_ID_MAP[b.id] = i; });
const BLD_BP_PER_LVL = 10, BLD_MIN = 27, BLD_MAX = 35;
const WB_TIERS = [
  "Fine","Fine I","Fine II","Rare","Rare I","Rare II","Rare III",
  "Epic","Epic I","Epic II","Epic III","Epic IV",
  "Legendary","Legendary I","Legendary II","Legendary III","Legendary IV",
  "Legendary T1","Legendary T1 I","Legendary T1 II","Legendary T1 III","Legendary T1 IV"
];
const WB_TIER_COLORS = {
  Fine: "#458627", Rare: "var(--rarity-r)", Epic: "var(--rarity-sr)", Legendary: "var(--rarity-ssr)"
};
const WB_COSTS_COMMON = {
  "Fine":null,"Fine I":null,"Fine II":null,"Rare":null,
  "Rare I":[0,0,30],"Rare II":[0,0,40],"Rare III":[0,0,60],
  "Epic":[0,0,80],
  "Epic I":[5500,55,35],"Epic II":[6500,65,40],"Epic III":[7500,75,45],"Epic IV":[8500,85,50],
  "Legendary":[10000,100,65],"Legendary I":[14500,145,35],"Legendary II":[15000,150,40],
  "Legendary III":[16500,165,40],"Legendary IV":[17000,170,45],
  "Legendary T1":[22000,220,55],"Legendary T1 I":[28500,285,50],"Legendary T1 II":[37000,370,70],
  "Legendary T1 III":[48000,480,90],"Legendary T1 IV":[62000,620,110]
};
const WB_SLOTS = [
  { name: "Helmet", firstTier: "Epic II" },
  { name: "Armor", firstTier: "Rare III" },
  { name: "Belt", firstTier: "Epic" },
  { name: "Drive", firstTier: "Rare II" },
  { name: "Boots", firstTier: "Epic I" },
  { name: "Charger x2", firstTier: "Rare I" }
];
const CRY_LEVELS = [
  { level: 1, amp: 3,   gem: 3 },
  { level: 2, amp: 8,   gem: 20 },
  { level: 3, amp: 20,  gem: 30 },
  { level: 4, amp: 50,  gem: 40 },
  { level: 5, amp: 100, gem: 50 },
  { level: 6, amp: 150, gem: 60 },
  { level: 7, amp: 200, gem: 70 },
  { level: 8, amp: 200, gem: 100 },
  { level: 9, amp: 270, gem: 200 },
  { level: 10, amp: 350, gem: 440 }
];
const CRY_SLOTS = ["Helmet","Armor","Belt","Boots","Drive","Charger 1","Charger 2"];
const HERO_EE_COST = [5,10,15,20,25,30,35,40,45,50]; // levels 1-10

// Hero star levels: 5 stars, 6 sub-levels each (0-5) = 30 positions
const HERO_SHARD_COSTS = [
  2,2,2,2,2,5,         // 1★ through 1★.5
  5,5,5,5,5,15,         // 2★ through 2★.5
  15,15,15,15,15,40,     // 3★ through 3★.5
  40,40,40,40,40,100,    // 4★ through 4★.5
  100,100,100,100,100,100 // 5★ through 5★.5
];
const HERO_LEVEL_LABELS = [];
for (let star=1; star<=5; star++)
  for (let sub=0; sub<=5; sub++)
    HERO_LEVEL_LABELS.push(sub === 0 ? `${star}\u2605` : `${star}\u2605.${sub}`);
const HERO_RAR_COLORS = { R: "var(--rarity-r)", SR: "var(--rarity-sr)", SSR: "var(--rarity-ssr)" };
const HERO_ROSTER = [
  { name: "Myoza",      rarity: "R" },
  { name: "Jaxor",      rarity: "R" },
  { name: "Celsia",     rarity: "R" },
  { name: "BunnyBee",   rarity: "SR" },
  { name: "Viathor",    rarity: "SR" },
  { name: "Lily",       rarity: "SR" },
  { name: "Lance",      rarity: "SR" },
  { name: "Akita",      rarity: "SR" },
  { name: "Kirastar",   rarity: "SR" },
  { name: "Lexia",      rarity: "SR" },
  { name: "Auria",      rarity: "SR" },
  { name: "Xarlie",     rarity: "SR" },
  { name: "Ragnarok",   rarity: "SSR" },
  { name: "Voidbat",    rarity: "SSR" },
  { name: "Randor",     rarity: "SSR" },
  { name: "Lucy",       rarity: "SSR" },
  { name: "Marco",      rarity: "SSR" },
  { name: "Astrax",     rarity: "SSR" },
  { name: "Nyxamon",    rarity: "SSR" },
  { name: "Melissa",    rarity: "SSR" },
  { name: "Axiom-7",    rarity: "SSR" },
  { name: "Zima",       rarity: "SSR" },
  { name: "Galactron",  rarity: "SSR" },
  { name: "Blitzbrute", rarity: "SSR" },
  { name: "Grunt",      rarity: "SSR" },
  { name: "Cerebrix",   rarity: "SSR" },
  { name: "Cragorex",   rarity: "SSR" },
  { name: "Megil",      rarity: "SSR" },
  { name: "Mantislayer",rarity: "SSR" },
  { name: "Sancia",    rarity: "SSR" }
];
const HERO_NAME_TO_RAR = {};
HERO_ROSTER.forEach(h => { HERO_NAME_TO_RAR[h.name] = h.rarity; });
  HERO_ROSTER.forEach(hero => {
    if (hero.rarity !== lastRar) {
      if (lastRar) h += `</optgroup>`;
      h += `<optgroup label="${hero.rarity}">`;
      lastRar = hero.rarity;
    }
    h += `<option value="${hero.name}" ${hero.name===sel?"selected":""}>${hero.name}</option>`;
  });
const SKILL_LEVELS = [
  { level: 2, regular: 10, omni: 30, starReq: null },
  { level: 3, regular: 30, omni: 90, starReq: "Star 1" },
  { level: 4, regular: 50, omni: 150, starReq: "Star 2" },
  { level: 5, regular: 100, omni: 100, starReq: "Star 3/4" }
];
const SKILL_CATS = [
  { name: "Expedition",  slots: 4, type: "regular", rarity: "R",   heroType: "Regular", codex: "codexRExp" },
  { name: "On-Map",      slots: 4, type: "regular", rarity: "R",   heroType: "Regular", codex: "codexROnmap" },
  { name: "Expedition",  slots: 4, type: "regular", rarity: "SR",  heroType: "Regular", codex: "codexSRExp" },
  { name: "On-Map",      slots: 4, type: "regular", rarity: "SR",  heroType: "Regular", codex: "codexSROnmap" },
  { name: "Expedition",  slots: 4, type: "regular", rarity: "SSR", heroType: "Regular", codex: "codexSSRExp" },
  { name: "On-Map",      slots: 4, type: "regular", rarity: "SSR", heroType: "Regular", codex: "codexSSROnmap" },
  { name: "Expedition",  slots: 4, type: "omni",    rarity: "SSR", heroType: "Omni",    codex: "codexSSRExp" },
  { name: "On-Map",      slots: 4, type: "omni",    rarity: "SSR", heroType: "Omni",    codex: "codexSSROnmap" }
];
const INV_CURRENCIES = [
  { key: "neurotium",      label: "Neurotium",           group: "Buildings",    colors: ["#9074C9","#9B50B9"] },
  { key: "unionCode",      label: "Union Code",          group: "Buildings" },
  { key: "defComp",        label: "Defense Components",  group: "Buildings",    colors: ["#F6EC98","#665F65"] },
  { key: "masterBlueprint",label: "Master Blueprints",   group: "Buildings",    colors: ["#67B6CD","#B74283"] },
  { key: "quantumCube",    label: "Quantum Cube",        group: "Warbringer",   colors: ["#F5D7F5","#A2A5D8"] },
  { key: "fusionModule",   label: "Fusion Module",       group: "Warbringer",   colors: ["#7F8FAC","#F2DB62"] },
  { key: "controlKnob",    label: "Control Knob",        group: "Warbringer",   colors: ["#D97136","#E7DFE3"] },
  { key: "crystalAmp",     label: "Crystal Amplifier",   group: "Crystals",     colors: ["#EBE3E1","#B9B3B0"] },
  { key: "cosmicGem",      label: "Cosmic Gemcore",      group: "Crystals",     colors: ["#7BB3D6","#EFEFE8"] },
  { key: "exclEquip",      label: "Excl. Equip Pieces",  group: "Hero Shards" },
  { key: "shardsR",        label: '<span style="color:var(--rarity-r)">R</span> Shards',   group: "Hero Shards", color: "var(--rarity-r)" },
  { key: "shardsSR",       label: '<span style="color:var(--rarity-sr)">SR</span> Shards',  group: "Hero Shards", color: "var(--rarity-sr)" },
  { key: "shardsSSR",      label: '<span style="color:var(--rarity-ssr)">SSR</span> Shards', group: "Hero Shards", color: "var(--rarity-ssr)" },
  { key: "codexRExp",      label: '<span style="color:var(--rarity-r)">R</span> Codex (Exp)',     group: "Skill Codexes", color: "var(--rarity-r)" },
  { key: "codexROnmap",    label: '<span style="color:var(--rarity-r)">R</span> Codex (On-map)',  group: "Skill Codexes", color: "var(--rarity-r)" },
  { key: "codexSRExp",     label: '<span style="color:var(--rarity-sr)">SR</span> Codex (Exp)',    group: "Skill Codexes", color: "var(--rarity-sr)" },
  { key: "codexSROnmap",   label: '<span style="color:var(--rarity-sr)">SR</span> Codex (On-map)', group: "Skill Codexes", color: "var(--rarity-sr)" },
  { key: "codexSSRExp",    label: '<span style="color:var(--rarity-ssr)">SSR</span> Codex (Exp)',   group: "Skill Codexes", color: "var(--rarity-ssr)" },
  { key: "codexSSROnmap",  label: '<span style="color:var(--rarity-ssr)">SSR</span> Codex (On-map)',group: "Skill Codexes", color: "var(--rarity-ssr)" }
];