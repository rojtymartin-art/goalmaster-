// =============================================================================
// GOALMASTER PRO – OTÁZKOVÝ ENGINE (engine-questions.js)
// Generuje 10 000+ dynamických otázok z databázy hráčov v 30 jazykoch
// + obsahuje hardcore ručne overené otázky (pravidlá, rekordy, história)
// =============================================================================

window.GM_ENGINE = (function () {
  const recentKeys = [];

  function rand(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function shuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function getPlayers() {
    return Array.isArray(window.GM_PLAYERS) ? window.GM_PLAYERS : [];
  }

  function getAllClubs(players) {
    const set = new Set();
    players.forEach(p => (p.clubs || []).forEach(c => set.add(c)));
    return Array.from(set);
  }

  function getAllCountries(players) {
    const set = new Set();
    players.forEach(p => { if (p.country) set.add(p.country); });
    return Array.from(set);
  }

  function t(key, vars = {}, fallback = "") {
    if (window.GM_I18N && typeof window.GM_I18N.t === "function") {
      const res = window.GM_I18N.t(key, vars);
      if (res && res !== key) return res;
    }
    let out = fallback || key;
    Object.keys(vars).forEach(k => {
      out = out.replaceAll(`{${k}}`, vars[k]);
    });
    return out;
  }

  // Ručne overené hardcore otázky (pravidlá, taktické nuansy, rekordy)
  const HARDCORE_QUESTIONS = [
    {
      cat: "RULES",
      q: "Môže hráč dostať červenú kartu, ak sedí iba na lavičke náhradníkov?",
      o: ["Áno, rozhodca môže udeliť červenú aj náhradníkovi", "Nie, červená platí len pre hráčov na ihrisku", "Iba ak už predtým nastúpil do zápasu", "Len po konzultácii s kapitánom"],
      c: 0,
      f: "Podľa pravidiel IFAB môže rozhodca udeliť žltú aj červenú kartu hráčom na lavičke, náhradníkom aj členom realizačného tímu."
    },
    {
      cat: "RULES",
      q: "Je hráč v ofsajde, ak dostane prihrávku priamo z vhadzovania z autu?",
      o: ["Nie, pri vhadzovaní z autu ofsajd neplatí", "Áno, ofsajd platí vždy za posledným obrancom", "Áno, ale len v súperovej šestnástke", "Platí len vtedy, ak sa lopta dotkne hlavy"],
      c: 0,
      f: "Z vhadzovania z autu, rohového kopu a brankárovho výkopu nemôže byť hráč v ofsajde."
    },
    {
      cat: "RULES",
      q: "Čo sa stane, ak hráč pri kope z bieleho bodu pošle loptu dozadu a spoluhráč ju dokopne do bránky?",
      o: ["Gól neplatí, rozohráva sa nepriamy voľný kop súpera", "Gól platí, ak sa lopta pohla dopredu", "Penalta sa opakuje", "Gól platí, pokiaľ nikto nezasiahol pred kopom"],
      c: 0,
      f: "Pri pokutovom kope musí lopta smerovať dopredu; ak sa pohne iným smerom alebo ju zahrá iný hráč skôr, rozhodca nariadi nepriamy voľný kop pre brániaci tím."
    },
    {
      cat: "RECORDS",
      q: "Ktorý hráč strelil v histórii Majstrovstiev sveta najviac gólov celkovo?",
      o: ["Miroslav Klose (16)", "Ronaldo Nazário (15)", "Gerd Müller (14)", "Pelé (12)"],
      c: 0,
      f: "Miroslav Klose strelil na 4 svetových šampionátoch (2002–2014) celkovo 16 gólov."
    },
    {
      cat: "RECORDS",
      q: "Kto drží rekord v počte asistencií v jednej sezóne Premier League (20 asistencií)?",
      o: ["Thierry Henry a Kevin De Bruyne", "Mesut Özil a Cesc Fàbregas", "David Beckham a Ryan Giggs", "Mohamed Salah a Bruno Fernandes"],
      c: 0,
      f: "Rekord 20 asistencií v jednej sezóne Premier League zdieľajú Thierry Henry (2002/03) a Kevin De Bruyne (2019/20)."
    },
    {
      cat: "TACTICS",
      q: "Čo v modernej futbalovej taktike znamená pojem 'gegenpressing'?",
      o: ["Okamžitý kolektívny tlak po strate lopty", "Hlboký blok s piatimi obrancami", "Dlhé nakopávané lopty na hrotového útočníka", "Hra bez útočníka s dvoma defenzívnymi štítmi"],
      c: 0,
      f: "Gegenpressing znamená okamžitý proti-pressing v prvých sekundách po strate lopty, aby súper nestihol založiť protiútok."
    },
    {
      cat: "TACTICS",
      q: "Aká je hlavná úloha falošnej deviatky ('False 9')?",
      o: ["Stiahnuť sa hlbšie do poľa a odviesť stopérov z priestoru", "Čakať na hranici ofsajdu na dlhé pasy", "Brániť ľavé krídlo pri rozohrávke súpera", "Hrať ako tretí stredný obranca pri strate lopty"],
      c: 0,
      f: "Falošná deviatka sa sťahuje do medzipriestoru medzi zálohu a útok, čím vyťahuje stopérov a otvára nábehy krídelníkom."
    },
    {
      cat: "RECORDS",
      q: "Ktorý klub odohral v Európskom pohári / Lige majstrov najdlhšiu sériu neporaziteľnosti v riadnom hracom čase?",
      o: ["Manchester City (2022–2024)", "Ajax Amsterdam (1971–1973)", "AC Miláno (1989–1991)", "Bayern Mníchov (2019–2020)"],
      c: 0,
      f: "Manchester City natiahol sériu bez prehry v riadnom hracom čase Ligy majstrov na 25 zápasov (od mája 2022 do apríla 2024)."
    }
  ];

  // Generátor 1: Ktorý z 4 klubov patrí do kariéry hráča?
  function genPlayerClub(players, allClubs) {
    const valid = players.filter(p => Array.isArray(p.clubs) && p.clubs.length >= 1);
    if (!valid.length || allClubs.length < 4) return null;
    const p = rand(valid);
    const rightClub = rand(p.clubs);
    const wrongClubs = shuffle(allClubs.filter(c => !(p.clubs || []).includes(c))).slice(0, 3);
    if (wrongClubs.length < 3) return null;

    const opts = shuffle([
      { label: rightClub, ok: true },
      ...wrongClubs.map(c => ({ label: c, ok: false }))
    ]);

    return {
      key: `club_${p.id}_${rightClub}`,
      cat: "CAREER",
      q: t("qClub", { player: p.name }, `Za ktorý z týchto klubov hral ${p.name}?`),
      o: opts.map(x => x.label),
      c: opts.findIndex(x => x.ok),
      f: `${p.name} (${p.nat}) pôsobil v klube ${rightClub}. Celá kariéra: ${(p.clubs || []).join(" → ")}.`
    };
  }

  // Generátor 2: Za ktorý z 4 klubov hráč NIKDY nehral?
  function genPlayerNotClub(players, allClubs) {
    const valid = players.filter(p => Array.isArray(p.clubs) && p.clubs.length >= 3);
    if (!valid.length || allClubs.length < 4) return null;
    const p = rand(valid);
    const neverClub = rand(allClubs.filter(c => !(p.clubs || []).includes(c)));
    const playedClubs = shuffle(p.clubs).slice(0, 3);
    if (!neverClub || playedClubs.length < 3) return null;

    const opts = shuffle([
      { label: neverClub, ok: true },
      ...playedClubs.map(c => ({ label: c, ok: false }))
    ]);

    return {
      key: `notclub_${p.id}_${neverClub}`,
      cat: "HARDCORE",
      q: t("qNotClub", { player: p.name }, `Za ktorý z týchto klubov NIKDY nehral ${p.name}?`),
      o: opts.map(x => x.label),
      c: opts.findIndex(x => x.ok),
      f: `${p.name} nikdy nehral za ${neverClub}. Jeho kluby: ${(p.clubs || []).join(", ")}.`
    };
  }

  // Generátor 3: Ktorý hráč hral za oba kluby C1 aj C2?
  function genBothClubs(players) {
    const valid = players.filter(p => Array.isArray(p.clubs) && p.clubs.length >= 2);
    if (valid.length < 4) return null;
    const target = rand(valid);
    const pair = shuffle(target.clubs).slice(0, 2);
    const [c1, c2] = pair;

    const distractors = shuffle(
      players.filter(p => p.id !== target.id && !(p.clubs.includes(c1) && p.clubs.includes(c2)))
    ).slice(0, 3);
    if (distractors.length < 3) return null;

    const opts = shuffle([
      { label: target.name, ok: true },
      ...distractors.map(d => ({ label: d.name, ok: false }))
    ]);

    return {
      key: `both_${target.id}_${c1}_${c2}`,
      cat: "HARDCORE",
      q: t("qBothClubs", { c1, c2 }, `Ktorý hráč pôsobil v kluboch ${c1} aj ${c2}?`),
      o: opts.map(x => x.label),
      c: opts.findIndex(x => x.ok),
      f: `${target.name} hral za ${c1} aj za ${c2}.`
    };
  }

  // Generátor 4: Kto z 4 hráčov má viac kariérnych gólov?
  function genMoreGoals(players) {
    const pool = shuffle(players.filter(p => typeof p.goals === "number")).slice(0, 4);
    if (pool.length < 4) return null;
    const sorted = pool.slice().sort((a, b) => b.goals - a.goals);
    if (sorted[0].goals === sorted[1].goals) return null;
    const winner = sorted[0];

    const opts = shuffle(pool).map(p => ({ label: p.name, ok: p.id === winner.id }));
    return {
      key: `goals_${pool.map(x => x.id).sort().join("_")}`,
      cat: "STATS",
      q: t("qMoreGoals", {}, "Ktorý z týchto hráčov má na konte VIAC gólov?"),
      o: opts.map(x => x.label),
      c: opts.findIndex(x => x.ok),
      f: `${winner.name} má ${winner.goals} gólov (${pool.map(x => `${x.name}: ${x.goals}`).join(" • ")}).`
    };
  }

  // Generátor 5: Najvyššia trhová hodnota (€M)
  function genHigherValue(players) {
    const valued = players.filter(p => typeof p.peakVal === "number" && p.peakVal > 0);
    const pool = shuffle(valued).slice(0, 4);
    if (pool.length < 4) return null;
    const sorted = pool.slice().sort((a, b) => b.peakVal - a.peakVal);
    if (sorted[0].peakVal === sorted[1].peakVal) return null;
    const winner = sorted[0];

    const opts = shuffle(pool).map(p => ({ label: p.name, ok: p.id === winner.id }));
    return {
      key: `val_${pool.map(x => x.id).sort().join("_")}`,
      cat: "STATS",
      q: t("qHigherVal", {}, "Ktorý hráč dosiahol najvyššiu trhovú hodnotu (€M)?"),
      o: opts.map(x => x.label),
      c: opts.findIndex(x => x.ok),
      f: `${winner.name} dosiahol peak ${winner.peakVal}M € (${pool.map(x => `${x.name}: ${x.peakVal}M €`).join(" • ")}).`
    };
  }

  // Generátor 6: Krajina reprezentácie hráča
  function genCountry(players, allCountries) {
    const valid = players.filter(p => p.country && p.nat);
    if (!valid.length || allCountries.length < 4) return null;
    const p = rand(valid);
    const wrong = shuffle(allCountries.filter(c => c !== p.country)).slice(0, 3);
    if (wrong.length < 3) return null;

    const opts = shuffle([
      { label: p.country, ok: true },
      ...wrong.map(c => ({ label: c, ok: false }))
    ]);

    return {
      key: `nat_${p.id}`,
      cat: "NATIONAL",
      q: t("qCountry", { player: p.name }, `Ktorú krajinu reprezentoval ${p.name}?`),
      o: opts.map(x => x.label),
      c: opts.findIndex(x => x.ok),
      f: `${p.name} reprezentoval: ${p.nat}.`
    };
  }

  function generateQuestion(category = "ALL") {
    const players = getPlayers();
    const allClubs = getAllClubs(players);
    const allCountries = getAllCountries(players);

    const generators = [
      () => genPlayerClub(players, allClubs),
      () => genPlayerNotClub(players, allClubs),
      () => genBothClubs(players),
      () => genMoreGoals(players),
      () => genHigherValue(players),
      () => genCountry(players, allCountries)
    ];

    for (let attempt = 0; attempt < 25; attempt++) {
      let qObj = null;

      if (category === "HARDCORE" && Math.random() < 0.45) {
        const hc = rand(HARDCORE_QUESTIONS);
        const paired = hc.o.map((txt, idx) => ({ txt, ok: idx === hc.c }));
        const sh = shuffle(paired);
        qObj = {
          key: `hc_${hc.q.slice(0, 24)}`,
          cat: hc.cat,
          q: hc.q,
          o: sh.map(x => x.txt),
          c: sh.findIndex(x => x.ok),
          f: hc.f
        };
      } else {
        const chosenGen = category === "STATS"
          ? rand([() => genMoreGoals(players), () => genHigherValue(players)])
          : category === "CAREER"
            ? rand([() => genPlayerClub(players, allClubs), () => genPlayerNotClub(players, allClubs), () => genBothClubs(players)])
            : rand(generators);
        qObj = chosenGen();
      }

      if (qObj && !recentKeys.includes(qObj.key)) {
        recentKeys.push(qObj.key);
        if (recentKeys.length > 40) recentKeys.shift();
        return qObj;
      }
    }

    // Záložná ručná otázka
    const fallback = rand(HARDCORE_QUESTIONS);
    return {
      key: `fb_${Date.now()}_${Math.random()}`,
      cat: fallback.cat,
      q: fallback.q,
      o: fallback.o.slice(),
      c: fallback.c,
      f: fallback.f
    };
  }

  // Pomocník na generovanie náhodnej Mriežky 3x3 (stĺpce = kluby, riadky = krajiny)
  function generateGrid3x3() {
    const players = getPlayers();
    const clubs = shuffle(getAllClubs(players));
    const countries = shuffle(getAllCountries(players));

    for (let tryIdx = 0; tryIdx < 30; tryIdx++) {
      const cols = shuffle(clubs).slice(0, 3);
      const rows = shuffle(countries).slice(0, 3);
      let allCellsValid = true;
      const cells = [];

      for (const r of rows) {
        for (const c of cols) {
          const matches = players.filter(p => p.country === r && (p.clubs || []).includes(c));
          if (!matches.length) { allCellsValid = false; break; }
          cells.push({ row: r, col: c, matches: matches.map(m => m.name) });
        }
        if (!allCellsValid) break;
      }

      if (allCellsValid) return { rows, cols, cells };
    }
    return null;
  }

  return {
    getPlayers,
    getAllClubs,
    getAllCountries,
    generateQuestion,
    generateGrid3x3,
    HARDCORE_QUESTIONS
  };
})();
