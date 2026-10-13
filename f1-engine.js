/* Grid Dynasty – career engine (no DOM). Karting -> F4 -> F3 -> F2 -> F1 with lateral moves. */
(function (root) {
  const D = typeof require !== 'undefined' && typeof module !== 'undefined' ? require('./f1-data.js') : root.F1D;
  const { CATS, NATS, ACADEMIES, PROMO, LATERAL, STUCK_CATS, TIER3_SIDE, STATS } = D;

  const rnd = Math.random;
  const gauss = () => { let u = 0, v = 0; while (!u) u = rnd(); while (!v) v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const pick = a => a[Math.floor(rnd() * a.length)];
  const R1 = x => Math.round(x * 10) / 10;

  const MAX_AGE = 43;
  const kartCat = age => age <= 8 ? 'kart1' : age <= 11 ? 'kart2' : age <= 13 ? 'kart3' : 'kart4';
  const ovrOf = s => Math.round(0.2 * s.PAC + 0.15 * s.QUA + 0.2 * s.RAC + 0.15 * s.CON + 0.07 * s.WET + 0.1 * s.TYR + 0.05 * s.FIT + 0.08 * s.MEN);
  const potLabel = p => p >= 1.18 ? 'Wonderkid' : p >= 1.05 ? 'Talent' : p >= 0.92 ? 'Prospect' : 'Late bloomer';

  /* ---------- creation ---------- */
  function rollStats(arch) {
    const s = {};
    STATS.forEach(k => s[k] = clamp(Math.round(46 + gauss() * 3.5), 32, 64));
    if (arch === 'qualifier') { s.QUA += 10; s.PAC += 5; s.RAC -= 3; s.CON -= 2; }
    else if (arch === 'racer') { s.RAC += 10; s.TYR += 5; s.QUA -= 4; s.CON += 1; }
    else if (arch === 'wet') { s.WET += 14; s.CON += 4; s.PAC -= 2; }
    else { STATS.forEach(k => s[k] += 2); }
    return s;
  }

  function newGame(o) {
    const G = {
      v: 1, name: o.name || 'Driver', nat: o.nat || 'GB', arch: o.arch || 'allround', age: 7, season: 1,
      stats: rollStats(o.arch), pot: clamp(1 + gauss() * 0.14, 0.75, 1.3),
      rep: 12 + rnd() * 8, sponsor: 1, academy: null,
      cat: 'kart1', team: null, contract: 0, seasonsInCat: 0, deal: { cost: 0, sal: 0 },
      history: [], tot: { races: 0, wins: 0, podiums: 0, poles: 0, earn: 0, peak: 0, trophies: {}, titles: {} },
      tr: {}, trPrev: {}, gen: {}, phase: 'intro', S: null, market: null, news: null, last: null,
    };
    Object.values(CATS).forEach(C => { G.tr[C.id] = {}; C.teams.forEach(t => G.tr[C.id][t[0]] = C.lvl + t[1]); });
    G.tot.peak = ovrOf(G.stats);
    rerollClub(G);
    return G;
  }
  function rerollStats(G) { G.stats = rollStats(G.arch); G.pot = clamp(1 + gauss() * 0.14, 0.75, 1.3); G.tot.peak = ovrOf(G.stats); }
  function rerollClub(G) {
    const C = CATS.kart1; const t = pick(C.teams.slice(2)); G.team = t[0]; G.contract = 1;
    G.deal = { cost: costOf(G, 'kart1', t[0]), sal: 0 };
  }

  /* ---------- helpers ---------- */
  const teamDef = (cat, name) => CATS[cat].teams.find(t => t[0] === name);
  const pf = (G, cat, name) => clamp((G.tr[cat][name] - (CATS[cat].lvl - 10)) / 20, 0, 1);
  const costOf = (G, cat, name) => { const C = CATS[cat]; return C.pay ? Math.round(lerp(C.cost[0], C.cost[1], pf(G, cat, name))) : 0; };
  const salOf = (G, cat, name) => { const C = CATS[cat]; return C.pay ? 0 : Math.round(lerp(C.sal[0], C.sal[1], Math.pow(pf(G, cat, name), 1.8)) * (0.35 + G.rep / 160)); };
  const funding = G => 8 * Math.exp(0.075 * G.rep) * G.sponsor;
  const affordable = (G, cat, name) => { const C = CATS[cat]; return !C.pay || costOf(G, cat, name) <= funding(G) || (G.academy && C.tier >= 1 && C.tier <= 3); };

  function genName(G, cat, team, i) {
    const key = cat + '|' + team + '|' + i;
    if (G.gen[key]) return G.gen[key];
    const reg = { sf: 'JP', sfl: 'JP', indy: 'US', nxt: 'US', fe: null };
    let nat = (reg[cat] && rnd() < 0.8) ? reg[cat] : pick(Object.keys(NATS));
    const N = NATS[nat]; let nm;
    do { nm = pick(N.first) + ' ' + pick(N.last); } while (Object.values(G.gen).includes(nm));
    return G.gen[key] = nm;
  }
  function roster(G, cat, team) {
    const C = CATS[cat], t = teamDef(cat, team), real = t[2] ? t[2].split('|') : [];
    return Array.from({ length: C.dpt }, (_, i) => real[i] || genName(G, cat, team, i));
  }

  /* ---------- season setup ---------- */
  function startSeason(G) {
    const C = CATS[G.cat];
    const drivers = [];
    C.teams.forEach(t => {
      const name = t[0], car = G.tr[C.id][name], names = roster(G, C.id, name);
      names.forEach((nm, i) => {
        const isP = name === G.team && i === C.dpt - 1;
        const skill = C.lvl + 0.4 * (car - C.lvl) + gauss() * 3.5 + ((C.boost && C.boost[nm]) || 0);
        drivers.push({ id: drivers.length, name: isP ? G.name : nm, team: name, car, skill, isPlayer: isP, pts: 0, w: 0, p: 0, pole: 0, races: 0, dnf: 0 });
      });
    });
    G.S = { cat: G.cat, round: 0, drivers, log: [], boost: 0, carMod: 0, injured: 0, tmp: 0, tmpUntil: 0, wheelDue: false, wheelDone: false, euro: false, wcWin: false, trophies: [], over: false };
    G.phase = 'season'; G.market = null;
  }
  const player = G => G.S.drivers.find(d => d.isPlayer);
  const standings = G => G.S.drivers.slice().sort((a, b) => b.pts - a.pts || b.w - a.w || b.p - a.p || a.id - b.id);

  /* ---------- race sim ---------- */
  function playRound(G) {
    const S = G.S, C = CATS[S.cat];
    if (S.round >= C.rounds) return null;
    const st = G.stats, P = player(G), ri = S.round;
    const wet = rnd() < 0.18;
    const out = S.injured > 0;
    const tmp = S.round < S.tmpUntil ? S.tmp : 0;
    const Dq = 0.35 * st.PAC + 0.45 * st.QUA + 0.1 * st.MEN + 0.1 * st.CON;
    const Dr = 0.28 * st.PAC + 0.28 * st.RAC + 0.14 * st.CON + 0.14 * st.TYR + 0.08 * st.MEN + 0.08 * st.FIT;
    const wetAdj = wet ? (st.WET - 60) * 0.3 : 0;
    const active = S.drivers.filter(d => !(d.isPlayer && out));
    const carOf = d => d.car + (d.isPlayer ? S.carMod : 0);
    const bonus = S.boost + tmp;

    active.forEach(d => {
      const sk = d.isPlayer ? Dq + bonus + wetAdj : d.skill;
      d.q = 0.55 * sk + 0.45 * carOf(d) + gauss() * (wet ? 3.6 : 2.2);
    });
    const qOrder = active.slice().sort((a, b) => b.q - a.q);
    const qpos = out ? null : qOrder.indexOf(P) + 1;
    if (qOrder.length && !(qOrder[0].isPlayer && out)) qOrder[0].pole++;
    if (!out && qOrder[0] === P) { /* pole counted */ }

    const entry = { round: ri + 1, name: C.names[ri] || ('Round ' + (ri + 1)), wet, qpos, races: [], pole: !out && qOrder[0] === P, out };
    let prev = qOrder;
    C.rf.forEach((rf, k) => {
      let grid;
      if (rf.grid === 'q') grid = qOrder.slice();
      else if (rf.grid === 'prev') grid = prev.slice();
      else { const n = +rf.grid.replace('rev', ''); grid = qOrder.slice(); const top = grid.slice(0, n).reverse(); grid = top.concat(grid.slice(n)); }
      const n = grid.length;
      grid.forEach((d, gi) => {
        d.grid = gi + 1;
        const sk = d.isPlayer ? Dr + bonus + wetAdj : d.skill;
        const sig = d.isPlayer ? clamp(5.6 - st.CON / 38, 3, 5) : 4.2;
        d.s = 0.55 * sk + 0.45 * carOf(d) + (n / 2 - gi) * 0.16 + gauss() * (sig + (wet ? 1.5 : 0));
        const pd = d.isPlayer ? clamp(0.075 - (st.CON - 60) * 0.0009, 0.02, 0.1) : 0.06;
        d.crash = rnd() < pd;
      });
      const fin = grid.filter(d => !d.crash).sort((a, b) => b.s - a.s);
      const dnf = grid.filter(d => d.crash);
      const res = fin.concat(dnf);
      res.forEach((d, i) => {
        d.races++;
        if (d.crash) { d.dnf++; return; }
        const pts = rf.pts[i] || 0; d.pts += pts;
        if (i === 0) d.w++;
        if (i < 3) d.p++;
      });
      if (!out) {
        const pos = res.indexOf(P) + 1;
        entry.races.push({ n: rf.n, grid: P.grid, pos, dnf: P.crash, pts: P.crash ? 0 : (rf.pts[pos - 1] || 0) });
        if (pos === 1 && !P.crash) {
          if (C.special && C.special[ri]) S.trophies.push(C.special[ri]);
          if (C.kartWC && ri === C.rounds - 1) S.wcWin = true;
        }
      }
      prev = res;
    });
    S.log.push(entry);
    S.round++;
    if (S.injured > 0) S.injured--;
    if (C.kartWC && S.round === 5 && standings(G)[0].isPlayer) S.euro = true;
    if (!S.wheelDone && S.round >= Math.floor(C.rounds / 2) && S.round < C.rounds) { S.wheelDue = true; }
    if (S.round >= C.rounds) S.over = true;
    return entry;
  }
  function simToEnd(G) { while (!G.S.over && !G.S.wheelDue) playRound(G); }

  /* ---------- mid-season wheel ---------- */
  function spinWheel(G) {
    const S = G.S, C = CATS[S.cat], st = G.stats;
    const opts = [
      { w: 12, f() { S.injured = C.tier === 0 ? 1 : 2; st.FIT = Math.max(30, st.FIT - 1); return ['💥', 'Heavy crash', `You miss the next ${S.injured} round${S.injured > 1 ? 's' : ''} with injury.`]; } },
      { w: 10, ok: !G.academy && G.rep >= 40 && C.tier >= 1 && C.tier <= 3 && G.age <= 24, f() { G.academy = pick(ACADEMIES); G.rep = Math.min(100, G.rep + 4); return ['🎓', 'Academy signing', `${G.academy.n} signs you. Seat costs are covered from now on.`]; } },
      { w: 10, ok: C.pay && C.tier <= 3, f() { G.sponsor = Math.max(0.35, G.sponsor * 0.7); return ['📉', 'Sponsor pulls out', 'Your backers cut the budget. Next year\'s seat options will be tighter.']; } },
      { w: 10, ok: C.pay, f() { G.sponsor = Math.min(3, G.sponsor * 1.35); return ['💷', 'New sponsor', 'A new backer boosts your funding. Bigger seats are in reach.']; } },
      { w: 8, ok: C.tier >= 2, f() { G.rep = Math.min(100, G.rep + 5); st.MEN = Math.min(99, st.MEN + 1); return ['📞', 'Reserve call-up', C.tier >= 3 ? 'You stand in for an FP1 session at a grand prix. Big reputation boost.' : 'You get a test day with a top outfit. Reputation up.']; } },
      { w: 14, f() { S.carMod += 2.5; return ['🔧', 'Car upgrade', 'Your team brings a big upgrade. The car is quicker for the rest of the season.']; } },
      { w: 8, f() { S.carMod -= 2; return ['🛠️', 'Reliability woes', 'A bad development path hurts the car for the rest of the year.']; } },
      { w: 12, f() { const k = pick(STATS); st[k] = Math.min(99, st[k] + 3); return ['⚡', 'Breakthrough', `Something clicks. +3 ${D.STAT_NAMES[k]}.`]; } },
      { w: 10, f() { S.boost += 2; return ['🎧', 'Engineer clicks', 'A new race engineer unlocks extra pace. +2 to your driving for the rest of the year.']; } },
      { w: 6, f() { S.tmp = -3; S.tmpUntil = S.round + 2; return ['🤒', 'Illness', 'A nasty bug costs you performance for the next two rounds.']; } },
    ].filter(o => o.ok === undefined || o.ok);
    let t = opts.reduce((a, o) => a + o.w, 0) * rnd(), o = opts[0];
    for (const x of opts) { t -= x.w; if (t <= 0) { o = x; break; } }
    S.wheelDue = false; S.wheelDone = true;
    const r = o.f(); return { icon: r[0], title: r[1], desc: r[2] };
  }
  function skipWheel(G) { G.S.wheelDue = false; G.S.wheelDone = true; }

  /* ---------- season end ---------- */
  const REP_W = [1.4, 1.25, 1.25, 1.3, 1.4];
  function finishSeason(G) {
    const S = G.S, C = CATS[S.cat], P = player(G), tbl = standings(G);
    const pos = tbl.indexOf(P) + 1, N = tbl.length, q = N > 1 ? 1 - (pos - 1) / (N - 1) : 1;
    const champ = pos === 1, ovr = ovrOf(G.stats);
    const tro = [];
    if (C.kartWC) { if (S.euro) tro.push('Karting European Champion'); if (S.wcWin) tro.push('Karting World Champion'); }
    else if (champ) tro.push(C.titleName);
    S.trophies.forEach(t => tro.push(t));
    const anyTitle = champ || (C.kartWC && (S.euro || S.wcWin));
    let earn = 0;
    if (!C.pay) earn = Math.round(salOf(G, S.cat, G.team) * (0.9 + q * 0.25) + P.w * salOf(G, S.cat, G.team) * 0.02);
    const dRep = REP_W[C.tier] * (q * 10 - 3.5) + (anyTitle ? 6 : 0) + Math.min(P.w, 10) * 0.15;
    G.rep = clamp(G.rep + dRep, 5, 100);
    const h = { season: G.season, age: G.age, cat: S.cat, catName: C.name, short: C.short, team: G.team, races: P.races, wins: P.w, podiums: P.p, poles: P.pole, pts: P.pts, pos, N, ovr, trophies: tro, earn, champ: anyTitle, cost: G.deal.cost };
    G.history.push(h);
    const T = G.tot; T.races += P.races; T.wins += P.w; T.podiums += P.p; T.poles += P.pole; T.earn += earn; T.peak = Math.max(T.peak, ovr);
    tro.forEach(t => T.trophies[t] = (T.trophies[t] || 0) + 1);
    if (anyTitle) T.titles[S.cat] = (T.titles[S.cat] || 0) + 1;
    G.seasonsInCat++;
    G.contract = Math.max(0, G.contract - 1);
    G.last = { pos, N, q, champ: anyTitle, cat: S.cat, ovr, wins: P.w };

    const msgs = [];
    if (G.academy && C.tier >= 1 && q < 0.3 && rnd() < 0.5) { msgs.push(`${G.academy.n} drops you after a poor year.`); G.academy = null; }

    // news: champions and team power rankings
    G.trPrev = {};
    Object.keys(G.tr).forEach(c => { G.trPrev[c] = Object.assign({}, G.tr[c]); });
    Object.keys(G.tr).forEach(c => Object.keys(G.tr[c]).forEach(n => { const base = CATS[c].lvl + teamDef(c, n)[1]; G.tr[c][n] = R1(clamp(G.tr[c][n] + gauss() * 1.5 + 0.25 * (base - G.tr[c][n]), CATS[c].lvl - 14, CATS[c].lvl + 14)); }));
    const champs = [];
    const show = ['f1', 'f2', 'f3', 'f4', 'indy', 'wec', 'fe', 'sf'];
    const curName = C.short;
    if (!show.includes(S.cat)) champs.push({ cat: curName, who: tbl[0].name, team: tbl[0].team });
    show.forEach(c => {
      const CC = CATS[c];
      if (c === S.cat) { champs.push({ cat: CC.short, who: tbl[0].name, team: tbl[0].team }); return; }
      let tot = 0; const w = CC.teams.map(t => { const x = Math.exp(G.trPrev[c][t[0]] / 2.6 - CC.lvl / 2.6); tot += x; return x; });
      let r = rnd() * tot, ti = 0; for (; ti < w.length; ti++) { r -= w[ti]; if (r <= 0) break; }
      const t = CC.teams[Math.min(ti, CC.teams.length - 1)];
      champs.push({ cat: CC.short, who: roster(G, c, t[0])[rnd() < 0.7 ? 0 : (CC.dpt > 1 ? 1 : 0)], team: t[0] });
    });
    const rank = Object.keys(G.tr[S.cat]).map(n => ({ n, r: Math.round(G.tr[S.cat][n]), d: Math.round(G.tr[S.cat][n]) - Math.round(G.trPrev[S.cat][n]) })).sort((a, b) => b.r - a.r);
    const rising = rank.slice().sort((a, b) => b.d - a.d).slice(0, 3).filter(x => x.d > 0);
    const falling = rank.slice().sort((a, b) => a.d - b.d).slice(0, 3).filter(x => x.d < 0);
    G.news = { champs, rank, rising, falling, msgs, table: tbl.slice(0, 10).map(d => ({ name: d.name, team: d.team, pts: d.pts, w: d.w, isPlayer: d.isPlayer })) };
    G.phase = 'wrap';
    return h;
  }

  /* ---------- market ---------- */
  function attract(G, catId) {
    const L = G.last, C = CATS[catId];
    return clamp(45 * L.q + 1.8 * (L.ovr - C.lvl) + 0.35 * (G.rep - 50) + (L.champ ? 15 : 0) + 30, 0, 140);
  }
  function makeOffer(G, kind, catId, team, extra) {
    const C = CATS[catId], r = G.tr[catId][team], ros = roster(G, catId, team);
    const tm = ros.slice(0, C.dpt - 1)[0] || ros[0];
    const tmSkill = C.lvl + 0.4 * (r - C.lvl), ovr = ovrOf(G.stats);
    const role = ovr >= tmSkill + 2 ? 'Lead driver' : ovr >= tmSkill - 3 ? 'Equal status' : 'Second driver';
    const years = C.tier === 0 ? 1 : 1 + Math.floor(rnd() * 3);
    return Object.assign({ kind, cat: catId, team, r: Math.round(r), cost: costOf(G, catId, team), sal: salOf(G, catId, team), years, role, tm, tier: C.tier }, extra || {});
  }
  function offersFor(G, catId, A, n, excludeTeam) {
    const C = CATS[catId], res = [];
    C.teams.forEach(t => {
      const name = t[0]; if (name === excludeTeam && catId === G.cat) return;
      const P = 100 * pf(G, catId, name);
      let a = A; if (catId === 'f1' && G.academy && G.academy.f1.includes(name)) a += 25;
      if (a + gauss() * 7 >= P - 5 && affordable(G, catId, name)) res.push(name);
    });
    res.sort((a, b) => pf(G, catId, b) - pf(G, catId, a));
    let teams = res.slice(0, n);
    if (!teams.length) {
      const cheap = C.teams.map(t => t[0]).filter(x => !(x === excludeTeam && catId === G.cat)).sort((a, b) => pf(G, catId, a) - pf(G, catId, b));
      teams = [cheap[0]];
    }
    return teams.map(nm => { const o = makeOffer(G, 'move', catId, nm); if (!affordable(G, catId, nm)) { o.cost = Math.round(o.cost * 0.6); o.scholarship = true; } return o; });
  }
  const f4Thr = age => age <= 16 ? 44 : age === 17 ? 38 : 28;

  function buildMarket(G) {
    const L = G.last, C = CATS[G.cat], nextAge = G.age + 1;
    const M = { options: [], stuck: false, forced: false, academy: null, nextAge, note: '' };
    const stay = () => { const o = makeOffer(G, 'stay', G.cat, G.team); o.cost = costOf(G, G.cat, G.team); o.years = G.contract > 0 ? G.contract : (C.tier === 0 ? 1 : 1 + Math.floor(rnd() * 2)); o.fresh = G.contract === 0; return o; };
    const canStay = () => affordable(G, G.cat, G.team) || true;
    let promoOffers = [], promoCat = null;

    if (nextAge >= MAX_AGE) { M.forced = true; M.note = 'Age catches up. Time to hang up the helmet.'; }
    else if (C.tier === 0) {
      if (nextAge <= 15) {
        const nc = kartCat(nextAge);
        if (nc !== G.cat) { M.options.push(...offersFor(G, nc, attract(G, nc), 4, null).map(o => Object.assign(o, { kind: 'promo' }))); }
        else { M.options.push(stay()); M.options.push(...offersFor(G, G.cat, attract(G, G.cat), 3, G.team)); }
      } else {
        const thr = f4Thr(nextAge);
        if (G.rep >= thr) {
          promoCat = 'f4'; promoOffers = offersFor(G, 'f4', attract(G, 'f4'), 4, null).map(o => Object.assign(o, { kind: 'promo' }));
          M.options.push(...promoOffers); M.note = 'Your karting reputation earned you F4 offers.';
        } else M.note = 'Not enough karting rep for an F4 seat yet (need ' + thr + ' rep).';
        if (nextAge <= 17) { if (G.cat !== 'kart4') { const o = offersFor(G, 'kart4', attract(G, 'kart4'), 2, null); M.options.push(...o); } else { M.options.push(stay()); M.options.push(...offersFor(G, 'kart4', attract(G, 'kart4'), 2, G.team)); } }
        else if (G.rep < thr) { M.forced = true; M.stuck = true; M.note = 'Out of karting years and no F4 seat. Go sideways to GT4 or call it a day.'; LATERAL.gt4 && M.options.push(...offersFor(G, 'gt4', attract(G, 'gt4'), 2, null).map(o => Object.assign(o, { kind: 'lateral' }))); }
      }
    } else {
      const cat = G.cat, pos = L.pos;
      const tgt = PROMO[cat];
      let promoted = false;
      if (tgt) {
        if (TIER3_SIDE.includes(cat)) promoted = G.age <= 30 && pos <= 2 && G.rep >= 78 && G.history.some(h => h.cat === 'f2') && rnd() < 0.25;
        else if (pos <= 3) promoted = cat === 'f2' ? rnd() < (pos === 1 ? 1 : pos === 2 ? 0.8 : 0.55) * (L.ovr < 76 ? 0.5 : 1) : true;
        else if (pos <= (cat === 'f2' ? 6 : 8)) {
          const p = cat === 'f2' ? clamp(0.2 + (G.rep - 60) / 150 + (7 - pos) * 0.03, 0.05, 0.5) : clamp(0.35 + (G.rep - 45) / 120 + (9 - pos) * 0.02, 0.1, 0.8);
          promoted = rnd() < p; M.maybe = true;
        }
        if (promoted) { promoCat = tgt[0]; promoOffers = offersFor(G, promoCat, attract(G, promoCat) + (pos <= 3 ? 8 : 0), 4, null).map(o => Object.assign(o, { kind: 'promo' })); M.options.push(...promoOffers); M.note = pos <= 3 ? 'Top 3 finish. Doors are opening.' : 'A mid-table finish still got you a look. Your rep did the talking.'; }
      }
      const stuck = STUCK_CATS.includes(cat) && G.seasonsInCat >= 3 && !promoted;
      if (stuck) {
        M.stuck = true; M.note = '3 seasons without promotion in ' + C.short + '. Retire or take a lateral move.';
        (LATERAL[cat] || []).forEach(lc => offersFor(G, lc, attract(G, lc), 2, null).forEach(o => M.options.push(Object.assign(o, { kind: 'lateral' }))));
      } else {
        M.options.push(stay());
        M.options.push(...offersFor(G, cat, attract(G, cat), 3, G.team));
        if (G.age >= 21 && (TIER3_SIDE.includes(cat) || cat === 'f1')) {
          const others = TIER3_SIDE.filter(c => c !== cat).sort(() => rnd() - 0.5).slice(0, 2);
          others.forEach(lc => offersFor(G, lc, attract(G, lc), 1, null).forEach(o => M.options.push(Object.assign(o, { kind: 'lateral' }))));
        }
      }
    }
    M.options = M.options.filter((o, i, a) => a.findIndex(x => x.cat === o.cat && x.team === o.team) === i);
    // academy offer
    if (!G.academy && !M.forced && C.tier >= 1 && C.tier <= 3 && G.age <= 24 && L.q >= 0.75 && G.rep >= 40 && rnd() < 0.4) M.academy = pick(ACADEMIES);
    G.market = M; G.phase = 'market';
    return M;
  }

  function growth(G) {
    const age = G.age; // already new age
    let g = age <= 11 ? 2.4 : age <= 15 ? 2.0 : age <= 19 ? 1.4 : age <= 23 ? 0.8 : age <= 27 ? 0.3 : age <= 31 ? 0 : age <= 35 ? -0.8 : -1.5;
    const st = G.stats;
    STATS.forEach(k => {
      let x = (g > 0 ? g * G.pot : g) + gauss() * 1.1;
      if (age >= 30 && (k === 'FIT' || k === 'PAC')) x -= 0.8;
      if (age >= 28 && (k === 'MEN' || k === 'RAC' || k === 'CON')) x += 0.5;
      st[k] = clamp(Math.round(st[k] + x), 25, 99);
    });
  }

  function chooseOption(G, idx, trainStat, acceptAcademy) {
    const M = G.market, o = M.options[idx];
    if (!o || o.kind === 'retire') return retire(G);
    if (acceptAcademy && M.academy) { G.academy = M.academy; G.rep = Math.min(100, G.rep + 4); }
    G.age++; G.season++;
    growth(G);
    if (trainStat) G.stats[trainStat] = Math.min(99, G.stats[trainStat] + 2);
    if (G.academy) { const k = pick(STATS); G.stats[k] = Math.min(99, G.stats[k] + 1); }
    if (o.cat !== G.cat) { G.seasonsInCat = 0; G.cat = o.cat; }
    if (o.team !== G.team || o.kind !== 'stay') { G.contract = o.years; }
    G.team = o.team; G.deal = { cost: o.scholarship ? o.cost : costOf(G, o.cat, o.team), sal: salOf(G, o.cat, o.team) };
    G.tot.peak = Math.max(G.tot.peak, ovrOf(G.stats));
    startSeason(G);
  }

  function retire(G) {
    G.phase = 'retired';
    const T = G.tot, ti = G.tot.titles;
    const score = (T.trophies['F1 World Champion'] || 0) * 12 + ((ti.wec || 0) + (ti.indy || 0) + (ti.fe || 0) + (ti.sf || 0)) * 3 + (ti.f2 || 0) * 1.5 + (ti.f3 || 0) + (ti.f4 || 0) * 0.5 + G.history.filter(h => h.cat === 'f1').reduce((a, h) => a + h.wins, 0) * 0.3 + (T.trophies['Karting World Champion'] || 0) * 1.5 + (T.trophies['24 Hours of Le Mans win'] || 0) * 2 + (T.trophies['Indy 500 win'] || 0) * 2 + (T.trophies['Monaco GP win'] || 0);
    const reachedF1 = G.history.some(h => h.cat === 'f1');
    const label = score >= 100 ? 'a GOAT' : score >= 50 ? 'an all-time legend' : score >= 22 ? 'a true great' : score >= 8 ? 'a star' : reachedF1 ? 'a grand prix driver' : score >= 2 ? 'a solid pro' : G.history.length > 8 ? 'a journeyman' : 'a dreamer';
    const best = G.history.slice().sort((a, b) => (b.champ - a.champ) || (b.wins - a.wins) || (a.pos - b.pos))[0];
    const teams = []; G.history.forEach(h => { if (!teams.includes(h.team)) teams.push(h.team); });
    G.retire = { label, score, best, teams, age: G.age, seasons: G.history.length };
    return G.retire;
  }

  const api = { CATS, rnd, newGame, rerollStats, rerollClub, startSeason, playRound, simToEnd, spinWheel, skipWheel, finishSeason, buildMarket, chooseOption, retire, standings, player, ovrOf, potLabel, funding, costOf, salOf, kartCat, MAX_AGE };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.F1E = api;
})(typeof window !== 'undefined' ? window : globalThis);
