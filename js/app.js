// ══════════════════════════════════════════════════
//  TAB SYSTEM
// ══════════════════════════════════════════════════
function switchTab(id) {
  localStorage.setItem("mechafire-tab", id);
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  const btns = document.querySelectorAll('#tab-bar .tab-btn');
  const names = ['buildings','warbringer','crystals','heroes','skills','inventory'];
  const idx = names.indexOf(id);
  if (idx >= 0) btns[idx].classList.add('active');
  // Mobile menu
  const mBtns = document.querySelectorAll('#tab-mobile-menu button');
  mBtns.forEach(b => b.classList.remove('active'));
  if (idx >= 0 && mBtns[idx]) mBtns[idx].classList.add('active');
  const label = el('tab-mobile-label');
  if (label && idx >= 0 && mBtns[idx]) label.textContent = mBtns[idx].textContent;
  // Close mobile menu
  const menu = el('tab-mobile-menu');
  const toggle = el('tab-mobile-toggle');
  if (menu) menu.classList.remove('open');
  if (toggle) toggle.classList.remove('open');
}
function toggleMobileMenu() {
  el('tab-mobile-menu').classList.toggle('open');
  el('tab-mobile-toggle').classList.toggle('open');
}

// ══════════════════════════════════════════════════
//  BUILDINGS TAB
// ══════════════════════════════════════════════════

function bldBuildUI() {
  const g = document.getElementById("bld-grid");
  BUILDINGS.forEach((b,i) => {
    const c = document.createElement("div");
    c.className = "card"; c.id = `bld-card-${i}`;
    c.innerHTML = `<div class="card-title">${b.name}</div>
      <div class="ctrl-row"><label>Current</label><select id="bld-cur-${i}" onchange="bldOnCurChange(${i})">${optRange(BLD_MIN,BLD_MAX,BLD_MIN,v=>v<28?"< 28":v)}</select></div>
      <div class="ctrl-row"><label>Target</label><select id="bld-tgt-${i}" onchange="bldRecalc()">${optRange(BLD_MIN,BLD_MAX,BLD_MIN,v=>v<28?"< 28":v)}</select></div>
      <div class="card-cost" id="bld-cost-${i}"></div>
      <div class="prereqs" id="bld-prereq-${i}"></div>`;
    g.appendChild(c);
  });
  bldRecalc();
}

function bldOnCurChange(i) {
  const c = +document.getElementById(`bld-cur-${i}`).value;
  const t = +document.getElementById(`bld-tgt-${i}`).value;
  if (t < c) document.getElementById(`bld-tgt-${i}`).value = c;
  bldRecalc();
}

function bldRecalc() {
  let tNeu=0,tUC=0,tDC=0,tBP=0,tUp=0;
  const blockers = new Set();
  const bd = BUILDINGS.map((b,i) => {
    const cur = +document.getElementById(`bld-cur-${i}`).value;
    const tgt = +document.getElementById(`bld-tgt-${i}`).value;
    let neu=0,uc=0,dc=0,bp=0,prs=[];
    if (tgt > cur) {
      for (let l = Math.max(cur+1,28); l <= tgt; l++) {
        const d = b.levels[l];
        if (d) { neu += d.neurotium||0; uc += d.unionCode||0; dc += d.defComp||0; bp += BLD_BP_PER_LVL;
          if (d.prereqs) d.prereqs.forEach(p => prs.push({...p, forLevel:l}));
        }
      }
    }
    return {cur,tgt,neu,uc,dc,bp,prs};
  });
  bd.forEach((d,i) => {
    const card = document.getElementById(`bld-card-${i}`);
    const costEl = document.getElementById(`bld-cost-${i}`);
    const prEl = document.getElementById(`bld-prereq-${i}`);
    card.classList.toggle("active", d.tgt > d.cur);
    let parts = [];
    if (d.neu) parts.push(`<span>${d.neu}</span> Neurotium`);
    if (d.uc) parts.push(`<span>${d.uc}</span> Union Code`);
    if (d.dc) parts.push(`<span>${d.dc}</span> Defense Components`);
    if (d.bp) parts.push(`<span>${d.bp}</span> Blueprints`);
    costEl.innerHTML = parts.join(" &middot; ");
    if (d.prs.length) {
      prEl.innerHTML = d.prs.map(p => {
        const di = BLD_ID_MAP[p.building], db = BUILDINGS[di];
        const dt = +document.getElementById(`bld-tgt-${di}`).value;
        const met = dt >= p.level;
        if (!met) blockers.add(di);
        return `<div class="prereq-line ${met?"prereq-met":"prereq-unmet"}" onclick="document.getElementById('bld-card-${di}').scrollIntoView({behavior:'smooth',block:'center'})" title="Jump to ${db.name}">
          <span class="prereq-indicator"></span><span>Lvl ${p.forLevel} needs ${db.name} ${p.level}${met?"":" (target: "+(dt<28?"< 28":dt)+")"}</span></div>`;
      }).join("");
    } else prEl.innerHTML = "";
    tNeu+=d.neu; tUC+=d.uc; tDC+=d.dc; tBP+=d.bp;
    if (d.tgt>d.cur) tUp += d.tgt - Math.max(d.cur,27);
  });
  BUILDINGS.forEach((_,i) => {
    document.getElementById(`bld-card-${i}`).classList.toggle("blocker", blockers.has(i));
  });
  document.getElementById("bld-summary").innerHTML = summaryHTML([
    ["Neurotium",tNeu,"neurotium",["#9074C9","#9B50B9"]],["Union Code",tUC,"unionCode"],["Defense Components",tDC,"defComp",["#F6EC98","#665F65"]],["Master Blueprints",tBP,"masterBlueprint",["#67B6CD","#B74283"]]
  ]);
  autoSave();
}

function bldResetAll() { BUILDINGS.forEach((_,i) => { el(`bld-cur-${i}`).value=BLD_MIN; el(`bld-tgt-${i}`).value=BLD_MIN; }); bldRecalc(); }
function bldSetAllTarget(v) { BUILDINGS.forEach((_,i) => { el(`bld-tgt-${i}`).value=v; }); bldRecalc(); }

// ══════════════════════════════════════════════════
//  WARBRINGER TAB
// ══════════════════════════════════════════════════
function wbTierColor(tierName) {
  if (tierName.startsWith("Legendary")) return WB_TIER_COLORS.Legendary;
  if (tierName.startsWith("Epic")) return WB_TIER_COLORS.Epic;
  if (tierName.startsWith("Rare")) return WB_TIER_COLORS.Rare;
  if (tierName.startsWith("Fine")) return WB_TIER_COLORS.Fine;
  return "var(--text)";
}
// Per-tier costs: [quantumCube, fusionModule, controlKnob]
// null = no cost at this tier for any slot
// Per slot: first tier that has costs (before this, upgrades are free for that slot)

function wbBuildUI() {
  const g = el("wb-grid");
  WB_SLOTS.forEach((s,i) => {
    const c = document.createElement("div");
    c.className = "card"; c.id = `wb-card-${i}`;
    c.innerHTML = `<div class="card-title">${s.name}</div>
      <div class="ctrl-row"><label>Current</label><select id="wb-cur-${i}" onchange="wbOnCurChange(${i})">${wbTierOpts(-1)}</select></div>
      <div class="ctrl-row"><label>Target</label><select id="wb-tgt-${i}" onchange="wbRecalc()">${wbTierOpts(-1)}</select></div>
      <div class="card-cost" id="wb-cost-${i}"></div>`;
    g.appendChild(c);
  });
  wbRecalc();
}
function wbTierOpts(sel) {
  let h = `<option value="-1" ${sel===-1?"selected":""}>None</option>`;
  WB_TIERS.forEach((t,i) => { h += `<option value="${i}" ${i===sel?"selected":""} style="color:${wbTierColor(t)}">${t}</option>`; });
  return h;
}
function wbOnCurChange(i) {
  const c = +el(`wb-cur-${i}`).value, t = +el(`wb-tgt-${i}`).value;
  if (t < c) el(`wb-tgt-${i}`).value = c;
  wbRecalc();
}
function wbUpdateSelectColors() {
  WB_SLOTS.forEach((_,i) => {
    ["cur","tgt"].forEach(k => {
      const s = el(`wb-${k}-${i}`);
      const v = +s.value;
      s.style.color = v >= 0 ? wbTierColor(WB_TIERS[v]) : "";
    });
  });
}
function wbRecalc() {
  let tQC=0, tFM=0, tCK=0;
  WB_SLOTS.forEach((s,i) => {
    const cur = +el(`wb-cur-${i}`).value, tgt = +el(`wb-tgt-${i}`).value;
    const card = el(`wb-card-${i}`), costEl = el(`wb-cost-${i}`);
    let qc=0,fm=0,ck=0;
    const firstIdx = WB_TIERS.indexOf(s.firstTier);
    if (tgt > cur) {
      card.classList.add("active");
      for (let ti = cur+1; ti <= tgt; ti++) {
        if (ti < firstIdx) continue;
        const costs = WB_COSTS_COMMON[WB_TIERS[ti]];
        if (costs) { qc+=costs[0]; fm+=costs[1]; ck+=costs[2]; }
      }
    } else card.classList.remove("active");
    let parts = [];
    if (qc) parts.push(`<span>${qc.toLocaleString()}</span> Quantum Cube`);
    if (fm) parts.push(`<span>${fm.toLocaleString()}</span> Fusion Module`);
    if (ck) parts.push(`<span>${ck.toLocaleString()}</span> Control Knob`);
    costEl.innerHTML = parts.join(" &middot; ");
    tQC+=qc; tFM+=fm; tCK+=ck;
  });
  el("wb-summary").innerHTML = summaryHTML([["Quantum Cube",tQC,"quantumCube",["#F5D7F5","#A2A5D8"]],["Fusion Module",tFM,"fusionModule",["#7F8FAC","#F2DB62"]],["Control Knob",tCK,"controlKnob",["#D97136","#E7DFE3"]]]);
  wbUpdateSelectColors();
  autoSave();
}
function wbResetAll() { WB_SLOTS.forEach((_,i) => { el(`wb-cur-${i}`).value=-1; el(`wb-tgt-${i}`).value=-1; }); wbRecalc(); }

// ══════════════════════════════════════════════════
//  CRYSTALS TAB
// ══════════════════════════════════════════════════
// Cost to upgrade TO each level (from previous level)

function cryBuildUI() {
  const g = el("cry-grid");
  CRY_SLOTS.forEach((s,i) => {
    const c = document.createElement("div");
    c.className = "card"; c.id = `cry-card-${i}`;
    c.innerHTML = `<div class="card-title">${s}</div>
      <div class="ctrl-row"><label>Current</label><select id="cry-cur-${i}" onchange="cryOnCurChange(${i})">${cryOpts(0)}</select></div>
      <div class="ctrl-row"><label>Target</label><select id="cry-tgt-${i}" onchange="cryRecalc()">${cryOpts(0)}</select></div>
      <div class="card-cost" id="cry-cost-${i}"></div>`;
    g.appendChild(c);
  });
  cryRecalc();
}
function cryOpts(sel) {
  let h = `<option value="0" ${sel===0?"selected":""}>None</option>`;
  for (let l=1;l<=10;l++) h += `<option value="${l}" ${l===sel?"selected":""}>Lvl ${l}</option>`;
  return h;
}
function cryOnCurChange(i) {
  const c = +el(`cry-cur-${i}`).value, t = +el(`cry-tgt-${i}`).value;
  if (t < c) el(`cry-tgt-${i}`).value = c;
  cryRecalc();
}
function cryRecalc() {
  let tAmp=0, tGem=0;
  CRY_SLOTS.forEach((s,i) => {
    const cur = +el(`cry-cur-${i}`).value, tgt = +el(`cry-tgt-${i}`).value;
    const card = el(`cry-card-${i}`), costEl = el(`cry-cost-${i}`);
    let amp=0, gem=0;
    if (tgt > cur) {
      card.classList.add("active");
      for (let l=cur+1; l<=tgt; l++) {
        const d = CRY_LEVELS[l-1];
        amp += d.amp; gem += d.gem;
      }
    } else card.classList.remove("active");
    let parts = [];
    if (amp) parts.push(`<span>${amp.toLocaleString()}</span> Crystal Amplifier`);
    if (gem) parts.push(`<span>${gem.toLocaleString()}</span> Cosmic Gemcore`);
    costEl.innerHTML = parts.join(" &middot; ");
    tAmp+=amp; tGem+=gem;
  });
  el("cry-summary").innerHTML = summaryHTML([["Crystal Amplifier",tAmp,"crystalAmp",["#EBE3E1","#B9B3B0"]],["Cosmic Gemcore",tGem,"cosmicGem",["#7BB3D6","#EFEFE8"]]]);
  autoSave();
}
function cryResetAll() { CRY_SLOTS.forEach((_,i) => { el(`cry-cur-${i}`).value=0; el(`cry-tgt-${i}`).value=0; }); cryRecalc(); }

// ══════════════════════════════════════════════════
//  HERO SHARDS TAB
// ══════════════════════════════════════════════════

// Lookup: hero name → rarity

let heroCount = 0;

function heroNameOpts(sel) {
  let h = `<option value="">-- Select Hero --</option>`;
  let lastRar = "";
  if (lastRar) h += `</optgroup>`;
  return h;
}

function heroBuildUI() {
  const g = el("hero-grid");
  const ee = document.createElement("div");
  ee.className = "card"; ee.id = "hero-ee-card";
  ee.innerHTML = `<div class="card-title">Exclusive Equipment</div>
    <div class="ctrl-row"><label>Current</label><select id="hero-ee-cur" onchange="heroOnEECurChange()">${heroEEOpts(0)}</select></div>
    <div class="ctrl-row"><label>Target</label><select id="hero-ee-tgt" onchange="heroRecalc()">${heroEEOpts(0)}</select></div>
    <div class="card-cost" id="hero-ee-cost"></div>`;
  g.appendChild(ee);
  heroAddHero();
  heroEnsureGhost();
}
function heroEnsureGhost() {
  let ghost = el("hero-ghost");
  if (!ghost) {
    ghost = document.createElement("div");
    ghost.className = "ghost-card"; ghost.id = "hero-ghost";
    ghost.textContent = "+ Add Hero";
    ghost.onclick = () => { heroAddHero(); heroEnsureGhost(); };
  }
  el("hero-grid").appendChild(ghost);
}
function heroAddHero(name, cur, tgt) {
  const i = heroCount++;
  const g = el("hero-grid");
  const c = document.createElement("div");
  c.className = "card"; c.id = `hero-card-${i}`;
  const rar = HERO_NAME_TO_RAR[name] || "";
  const borderColor = rar ? HERO_RAR_COLORS[rar] : "";
  if (borderColor) c.style.borderTopColor = borderColor;
  c.innerHTML = `<div style="display:flex;align-items:center;gap:6px;margin-bottom:10px">
      <select id="hero-name-${i}" onchange="heroOnNameChange(${i})" style="flex:1;padding:6px 8px;background:var(--bg);color:${rar?HERO_RAR_COLORS[rar]:'var(--text-bright)'};border:1px solid var(--border);border-radius:4px;font-family:'Orbitron',monospace;font-size:0.75rem;cursor:pointer">${heroNameOpts(name||"")}</select>
      <span id="hero-rar-badge-${i}" style="font-family:'Orbitron',monospace;font-size:0.65rem;font-weight:700;color:${rar?HERO_RAR_COLORS[rar]:'var(--text-dim)'};min-width:28px;text-align:center">${rar||""}</span>
      <button onclick="heroRemove(${i})" style="background:none;border:1px solid var(--border);color:var(--danger);border-radius:4px;cursor:pointer;padding:4px 8px;font-size:0.7rem;line-height:1" title="Remove hero">&times;</button>
    </div>
    <div class="ctrl-row"><label>Current</label><select id="hero-cur-${i}" onchange="heroOnLvlChange(${i})">${heroLvlOpts(cur||0)}</select></div>
    <div class="ctrl-row"><label>Target</label><select id="hero-tgt-${i}" onchange="heroRecalc()">${heroLvlOpts(tgt||0)}</select></div>
    <div class="card-cost" id="hero-cost-${i}"></div>`;
  const ghost = el("hero-ghost");
  if (ghost) g.insertBefore(c, ghost);
  else g.appendChild(c);
  heroRecalc();
  return i;
}
function heroOnNameChange(i) {
  const sel = el(`hero-name-${i}`);
  const name = sel.value;
  const rar = HERO_NAME_TO_RAR[name] || "";
  const color = rar ? HERO_RAR_COLORS[rar] : "var(--text-bright)";
  sel.style.color = color;
  const badge = el(`hero-rar-badge-${i}`);
  badge.textContent = rar;
  badge.style.color = color;
  const card = el(`hero-card-${i}`);
  card.style.borderTopColor = rar ? HERO_RAR_COLORS[rar] : "";
  heroRecalc();
}
function heroRemove(i) {
  const c = el(`hero-card-${i}`);
  if (c) c.remove();
  heroRecalc();
}
function heroGetAll() {
  const heroes = [];
  for (let i=0; i<heroCount; i++) {
    if (!el(`hero-card-${i}`)) continue;
    const name = el(`hero-name-${i}`).value;
    heroes.push({
      idx: i,
      name: name,
      rarity: HERO_NAME_TO_RAR[name] || "",
      cur: +el(`hero-cur-${i}`).value,
      tgt: +el(`hero-tgt-${i}`).value
    });
  }
  return heroes;
}
function heroEEOpts(sel) {
  let h = `<option value="0" ${sel===0?"selected":""}>None</option>`;
  for (let l=1;l<=10;l++) h += `<option value="${l}" ${l===sel?"selected":""}>Lvl ${l}</option>`;
  return h;
}
function heroLvlOpts(sel) {
  let h = `<option value="0" ${sel===0?"selected":""}>None</option>`;
  HERO_LEVEL_LABELS.forEach((lbl,i) => {
    h += `<option value="${i+1}" ${(i+1)===sel?"selected":""}>${lbl}</option>`;
  });
  return h;
}
function heroOnEECurChange() {
  const c = +el("hero-ee-cur").value, t = +el("hero-ee-tgt").value;
  if (t < c) el("hero-ee-tgt").value = c;
  heroRecalc();
}
function heroOnLvlChange(i) {
  const c = +el(`hero-cur-${i}`).value, t = +el(`hero-tgt-${i}`).value;
  if (t < c) el(`hero-tgt-${i}`).value = c;
  heroRecalc();
}
function heroRecalc() {
  let tEE = 0;
  const shardTotals = { R: 0, SR: 0, SSR: 0 };
  // Exclusive equip
  const eeCur = +el("hero-ee-cur").value, eeTgt = +el("hero-ee-tgt").value;
  let eeCost = 0;
  if (eeTgt > eeCur) {
    el("hero-ee-card").classList.add("active");
    for (let l = eeCur+1; l <= eeTgt; l++) eeCost += HERO_EE_COST[l-1];
  } else el("hero-ee-card").classList.remove("active");
  el("hero-ee-cost").innerHTML = eeCost ? `<span>${eeCost}</span> Exclusive Equip Pieces` : "";
  tEE = eeCost;
  // Heroes
  heroGetAll().forEach(h => {
    const card = el(`hero-card-${h.idx}`), costEl = el(`hero-cost-${h.idx}`);
    let shards = 0;
    if (h.tgt > h.cur) {
      card.classList.add("active");
      for (let p = h.cur; p < h.tgt; p++) shards += HERO_SHARD_COSTS[p];
    } else card.classList.remove("active");
    costEl.innerHTML = shards ? `<span>${shards.toLocaleString()}</span> <span style="color:${HERO_RAR_COLORS[h.rarity]}">${h.rarity}</span> Shards` : "";
    shardTotals[h.rarity] += shards;
  });
  el("hero-summary").innerHTML = summaryHTML([
    ["Excl. Equip Pieces",tEE,"exclEquip"],
    [`<span style="color:var(--rarity-r)">R</span> Shards`,shardTotals.R,"shardsR","var(--rarity-r)"],
    [`<span style="color:var(--rarity-sr)">SR</span> Shards`,shardTotals.SR,"shardsSR","var(--rarity-sr)"],
    [`<span style="color:var(--rarity-ssr)">SSR</span> Shards`,shardTotals.SSR,"shardsSSR","var(--rarity-ssr)"]
  ]);
  autoSave();
}
function heroResetAll() {
  el("hero-ee-cur").value=0; el("hero-ee-tgt").value=0;
  heroGetAll().forEach(h => { el(`hero-cur-${h.idx}`).value=0; el(`hero-tgt-${h.idx}`).value=0; });
  heroRecalc();
}

// ══════════════════════════════════════════════════
//  HERO SKILLS TAB
// ══════════════════════════════════════════════════
// 4 skill slots per type, costs per level (books needed for ONE skill slot)
// Regular: 10, 30, 50, 100 for levels 2-5
// Omni: 30, 90, 150, 100 for levels 2-5
// Categories: rarity × heroType × skillType
// Regular heroes: 10/30/50/100 per slot. Omni heroes: 30/90/150/100 per slot.
// Codex consumed depends on rarity + skillType (Expedition or On-map)

function skillBuildUI() {
  const g = el("skill-grid");
  SKILL_CATS.forEach((cat,i) => {
    const c = document.createElement("div");
    c.className = "card"; c.id = `skill-card-${i}`;
    c.innerHTML = `<div class="card-title"><span style="color:${HERO_RAR_COLORS[cat.rarity]}">${cat.rarity}</span> ${cat.heroType} &mdash; ${cat.name}</div>
      <div class="ctrl-row"><label>Current</label><select id="skill-cur-${i}" onchange="skillOnCurChange(${i})">${skillOpts(1)}</select></div>
      <div class="ctrl-row"><label>Target</label><select id="skill-tgt-${i}" onchange="skillRecalc()">${skillOpts(1)}</select></div>
      <div class="card-cost" id="skill-cost-${i}"></div>
      <div style="font-size:0.7rem;color:var(--text-dim);margin-top:4px" id="skill-note-${i}"></div>`;
    g.appendChild(c);
  });
  skillRecalc();
}
function skillOpts(sel) {
  let h = "";
  for (let l=1;l<=5;l++) h += `<option value="${l}" ${l===sel?"selected":""}>Lvl ${l}</option>`;
  return h;
}
function skillOnCurChange(i) {
  const c = +el(`skill-cur-${i}`).value, t = +el(`skill-tgt-${i}`).value;
  if (t < c) el(`skill-tgt-${i}`).value = c;
  skillRecalc();
}
function skillRecalc() {
  const codexTotals = {};
  SKILL_CATS.forEach(cat => { if (!codexTotals[cat.codex]) codexTotals[cat.codex] = 0; });
  SKILL_CATS.forEach((cat,i) => {
    const cur = +el(`skill-cur-${i}`).value, tgt = +el(`skill-tgt-${i}`).value;
    const card = el(`skill-card-${i}`), costEl = el(`skill-cost-${i}`), noteEl = el(`skill-note-${i}`);
    let books = 0;
    const starReqs = [];
    if (tgt > cur) {
      card.classList.add("active");
      for (let l = cur+1; l <= tgt; l++) {
        const d = SKILL_LEVELS[l-2];
        books += (cat.type === "omni" ? d.omni : d.regular) * cat.slots;
        if (d.starReq) starReqs.push(`Lvl ${l}: ${d.starReq}`);
      }
    } else card.classList.remove("active");
    const rarName = {R:"Rare",SR:"Epic",SSR:"Legendary"}[cat.rarity];
    costEl.innerHTML = books ? `<span>${books.toLocaleString()}</span> ${rarName} Skill Codex (${cat.name})` : "";
    noteEl.innerHTML = starReqs.length ? starReqs.map(s => `<span style="color:var(--gold)">${s}</span>`).join(" &middot; ") : "";
    codexTotals[cat.codex] += books;
  });
  el("skill-summary").innerHTML = summaryHTML([
    [`<span style="color:var(--rarity-r)">R</span> Exp`, codexTotals.codexRExp, "codexRExp", "var(--rarity-r)"],
    [`<span style="color:var(--rarity-r)">R</span> On-map`, codexTotals.codexROnmap, "codexROnmap", "var(--rarity-r)"],
    [`<span style="color:var(--rarity-sr)">SR</span> Exp`, codexTotals.codexSRExp, "codexSRExp", "var(--rarity-sr)"],
    [`<span style="color:var(--rarity-sr)">SR</span> On-map`, codexTotals.codexSROnmap, "codexSROnmap", "var(--rarity-sr)"],
    [`<span style="color:var(--rarity-ssr)">SSR</span> Exp`, codexTotals.codexSSRExp, "codexSSRExp", "var(--rarity-ssr)"],
    [`<span style="color:var(--rarity-ssr)">SSR</span> On-map`, codexTotals.codexSSROnmap, "codexSSROnmap", "var(--rarity-ssr)"]
  ]);
  autoSave();
}
function skillResetAll() { SKILL_CATS.forEach((_,i)=>{el(`skill-cur-${i}`).value=1;el(`skill-tgt-${i}`).value=1;});skillRecalc(); }

// ══════════════════════════════════════════════════
//  INVENTORY TAB
// ══════════════════════════════════════════════════
// All trackable currencies

function invBuildUI() {
  const g = el("inv-grid");
  let lastGroup = "";
  INV_CURRENCIES.forEach(c => {
    if (c.group !== lastGroup) {
      lastGroup = c.group;
      const hdr = document.createElement("div");
      hdr.className = "inv-section-header";
      hdr.textContent = c.group;
      g.appendChild(hdr);
    }
    const d = document.createElement("div");
    d.className = "inv-card";
    if (c.colors) {
      d.style.cssText = `border-top: 2px solid ${c.colors[0]}; box-shadow: 0 -4px 12px ${c.colors[0]}33;`;
    } else if (c.color) {
      d.style.cssText = `border-top: 2px solid ${c.color}; box-shadow: 0 -4px 12px ${c.color}33;`;
    }
    const inputColor = c.colors ? c.colors[0] : (c.color || "");
    const labelColor = c.colors ? `background:linear-gradient(90deg,${c.colors[0]},${c.colors[1]});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text` : "";
    d.innerHTML = `<div class="inv-label"${labelColor ? ` style="${labelColor}"` : ""}>${c.label}</div>
      <input type="number" id="inv-${c.key}" min="0" value="0" onchange="invRecalc()" oninput="invRecalc()"${inputColor ? ` style="color:${inputColor}"` : ""}>
      <div class="inv-req" id="inv-req-${c.key}"></div>`;
    g.appendChild(d);
  });
  invRecalc();
}

function invGetStock(key) {
  const e = el(`inv-${key}`);
  return e ? (+e.value || 0) : 0;
}

// Gather total requirements across all tabs
function invGetRequirements() {
  const req = {};
  INV_CURRENCIES.forEach(c => { req[c.key] = 0; });
  // Buildings
  BUILDINGS.forEach((_,i) => {
    const cur = +el(`bld-cur-${i}`).value, tgt = +el(`bld-tgt-${i}`).value;
    if (tgt > cur) {
      const b = BUILDINGS[i];
      for (let l=Math.max(cur+1,28);l<=tgt;l++) {
        const d=b.levels[l]; if(!d) continue;
        req.neurotium += d.neurotium||0;
        req.unionCode += d.unionCode||0;
        req.defComp += d.defComp||0;
        req.masterBlueprint += BLD_BP_PER_LVL;
      }
    }
  });
  // Warbringer
  WB_SLOTS.forEach((s,i) => {
    const cur=+el(`wb-cur-${i}`).value, tgt=+el(`wb-tgt-${i}`).value;
    const firstIdx=WB_TIERS.indexOf(s.firstTier);
    if (tgt>cur) for(let ti=cur+1;ti<=tgt;ti++){
      if(ti<firstIdx) continue;
      const costs=WB_COSTS_COMMON[WB_TIERS[ti]];
      if(costs){req.quantumCube+=costs[0];req.fusionModule+=costs[1];req.controlKnob+=costs[2];}
    }
  });
  // Crystals
  CRY_SLOTS.forEach((_,i) => {
    const cur=+el(`cry-cur-${i}`).value, tgt=+el(`cry-tgt-${i}`).value;
    if(tgt>cur) for(let l=cur+1;l<=tgt;l++){const d=CRY_LEVELS[l-1];req.crystalAmp+=d.amp;req.cosmicGem+=d.gem;}
  });
  // Hero EE
  const eeCur=+el("hero-ee-cur").value, eeTgt=+el("hero-ee-tgt").value;
  if(eeTgt>eeCur) for(let l=eeCur+1;l<=eeTgt;l++) req.exclEquip+=HERO_EE_COST[l-1];
  // Hero shards
  heroGetAll().forEach(h => {
    if(h.tgt>h.cur){ const key="shards"+h.rarity; for(let p=h.cur;p<h.tgt;p++) req[key]+=HERO_SHARD_COSTS[p]; }
  });
  // Skills
  SKILL_CATS.forEach((cat,i) => {
    const cur=+el(`skill-cur-${i}`).value, tgt=+el(`skill-tgt-${i}`).value;
    if(tgt>cur) for(let l=cur+1;l<=tgt;l++){const d=SKILL_LEVELS[l-2];req[cat.codex]+=(cat.type==="omni"?d.omni:d.regular)*cat.slots;}
  });
  return req;
}

function invRecalc() {
  const req = invGetRequirements();
  let shortCount = 0;
  INV_CURRENCIES.forEach(c => {
    const stock = invGetStock(c.key);
    const need = req[c.key];
    const diff = stock - need;
    const reqEl = el(`inv-req-${c.key}`);
    if (need === 0) {
      reqEl.innerHTML = "";
    } else if (diff >= 0) {
      reqEl.innerHTML = `Need <span>${need.toLocaleString()}</span> &mdash; <span class="ok">surplus ${diff.toLocaleString()}</span>`;
    } else {
      reqEl.innerHTML = `Need <span>${need.toLocaleString()}</span> &mdash; <span class="short">short ${Math.abs(diff).toLocaleString()}</span>`;
      shortCount++;
    }
  });
  el("inv-summary").innerHTML = "";
  // Refresh tab summaries to show updated deficits
  // Use a flag to avoid infinite recursion
  if (!invRecalc._updating) {
    invRecalc._updating = true;
    bldRecalc(); wbRecalc(); cryRecalc(); heroRecalc(); skillRecalc();
    invRecalc._updating = false;
  }
  autoSave();
}

// ══════════════════════════════════════════════════
//  SHARED UTILITIES
// ══════════════════════════════════════════════════
function el(id) { return document.getElementById(id); }
function optRange(min, max, sel, fmt) {
  let h = "";
  for (let v=min;v<=max;v++) h += `<option value="${v}" ${v===sel?"selected":""}>${fmt?fmt(v):v}</option>`;
  return h;
}
function summaryCard(label, value, stockKey, colors) {
  // colors can be: a string (single colour), an array of 2 (gradient), or falsy
  const num = typeof value === "number" ? value : 0;
  let deficitHtml = "";
  if (stockKey && num > 0) {
    const stock = invGetStock(stockKey);
    const diff = stock - num;
    if (diff >= 0) {
      deficitHtml = `<div class="deficit deficit-ok">+${diff.toLocaleString()} surplus</div>`;
    } else {
      deficitHtml = `<div class="deficit deficit-short">${diff.toLocaleString()} short</div>`;
    }
  }
  const c1 = Array.isArray(colors) ? colors[0] : colors;
  const c2 = Array.isArray(colors) ? colors[1] : null;
  const cardStyle = c1 ? ` style="--card-color:${c1}"` : "";
  const valStyle = c1 ? ` style="color:${c1};text-shadow:0 0 12px ${c1}60"` : "";
  const lblStyle = (c1 && c2) ? ` style="background:linear-gradient(90deg,${c1},${c2});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text"` : "";
  return `<div class="summary-card"${cardStyle}><div class="label"${lblStyle}>${label}</div><div class="value"${valStyle}>${typeof value==="number"?value.toLocaleString():value}</div>${deficitHtml}</div>`;
}
function summaryHTML(items) {
  // items: [label, value, stockKey?, colors?]  colors = string | [c1,c2]
  return items.map(item => summaryCard(item[0], item[1], item[2], item[3])).join("");
}

// ══════════════════════════════════════════════════
//  SAVE / LOAD (all tabs)
// ══════════════════════════════════════════════════
// Gather current state as an object
function gatherState() {
  const inv = {};
  INV_CURRENCIES.forEach(c => { inv[c.key] = el(`inv-${c.key}`).value; });
  return {
    buildings: BUILDINGS.map((_,i) => ({ cur: el(`bld-cur-${i}`).value, tgt: el(`bld-tgt-${i}`).value })),
    warbringer: WB_SLOTS.map((_,i) => ({ cur: el(`wb-cur-${i}`).value, tgt: el(`wb-tgt-${i}`).value })),
    crystals: CRY_SLOTS.map((_,i) => ({ cur: el(`cry-cur-${i}`).value, tgt: el(`cry-tgt-${i}`).value })),
    heroEE: { cur: el("hero-ee-cur").value, tgt: el("hero-ee-tgt").value },
    heroes: heroGetAll().map(h => ({ name: h.name, cur: String(h.cur), tgt: String(h.tgt) })),
    skills: SKILL_CATS.map((_,i) => ({ cur: el(`skill-cur-${i}`).value, tgt: el(`skill-tgt-${i}`).value })),
    inventory: inv
  };
}

// Auto-save to localStorage (debounced)
let _autoSaveTimer = null;
function autoSave() {
  clearTimeout(_autoSaveTimer);
  _autoSaveTimer = setTimeout(() => {
    localStorage.setItem("mechafire-state", JSON.stringify(gatherState()));
  }, 300);
}

// Apply a state object to the UI
function applyState(s) {
  const blds = Array.isArray(s) ? s : s.buildings;
  if (blds) blds.forEach((b,i) => { if(i<BUILDINGS.length){el(`bld-cur-${i}`).value=b.cur;el(`bld-tgt-${i}`).value=b.tgt;} });
  if (s.warbringer) s.warbringer.forEach((w,i) => { if(i<WB_SLOTS.length){el(`wb-cur-${i}`).value=w.cur;el(`wb-tgt-${i}`).value=w.tgt;} });
  if (s.crystals) s.crystals.forEach((c,i) => { if(i<CRY_SLOTS.length){el(`cry-cur-${i}`).value=c.cur;el(`cry-tgt-${i}`).value=c.tgt;} });
  if (s.heroEE) { el("hero-ee-cur").value=s.heroEE.cur; el("hero-ee-tgt").value=s.heroEE.tgt; }
  if (s.heroes && s.heroes.length) {
    heroGetAll().forEach(h => { const c=el(`hero-card-${h.idx}`); if(c)c.remove(); });
    s.heroes.forEach(h => { heroAddHero(h.name, +h.cur, +h.tgt); });
    heroEnsureGhost();
  }
  if (s.skills) s.skills.forEach((k,i) => { if(i<SKILL_CATS.length){el(`skill-cur-${i}`).value=k.cur;el(`skill-tgt-${i}`).value=k.tgt;} });
  if (s.inventory) INV_CURRENCIES.forEach(c => { const e=el(`inv-${c.key}`); if(e && s.inventory[c.key]!==undefined) e.value=s.inventory[c.key]; });
  bldRecalc(); wbRecalc(); cryRecalc(); heroRecalc(); skillRecalc(); invRecalc();
}

// Load from localStorage on startup
function loadFromStorage() {
  let raw = localStorage.getItem("mechafire-state") || localStorage.getItem("mechafire-buildings");
  if (!raw) return;
  try { applyState(JSON.parse(raw)); } catch(e) {}
}

// Export state as JSON file download
function exportState() {
  const blob = new Blob([JSON.stringify(gatherState(), null, 2)], {type: "application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "mechafire-save.json";
  a.click();
  URL.revokeObjectURL(a.href);
}

// Import state from JSON file
function importState(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try { applyState(JSON.parse(reader.result)); } catch(e) { alert("Invalid save file"); }
  };
  reader.readAsText(file);
  input.value = "";
}

// Reset everything
function resetAllState() {
  if (!confirm("Reset all data across all tabs?")) return;
  localStorage.removeItem("mechafire-state");
  location.reload();
}

// ══════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════
document.addEventListener("DOMContentLoaded", () => {
  bldBuildUI();
  wbBuildUI();
  cryBuildUI();
  heroBuildUI();
  skillBuildUI();
  invBuildUI();
  loadFromStorage();
  const savedTab = localStorage.getItem("mechafire-tab");
  if (savedTab) switchTab(savedTab);
});