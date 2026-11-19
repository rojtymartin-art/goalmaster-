// =============================================================================
// GOALMASTER PRO – AKČNÉ REŽIMY & MANAŽÉR 2.0 (games-action.js)
// 1. Penalty 2.0 (striedanie streľba + chytanie, animácia letu lopty a skoku, Turnaj)
// 2. Mriežka 3×3 (garantovaný generátor, Krajiny×Kluby aj Kluby×Kluby, našepkávač)
// 3. Manažér & Prezident Klubu 2.0 (45 neopakujúcich sa dilem, liga, prestupy, štadión)
// 4. Chýbajúca jedenástka (Missing XI)
// =============================================================================

window.GM_GAMES = (function () {
  function norm(s) {
    return String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function getPlayers() {
    return Array.isArray(window.GM_PLAYERS) ? window.GM_PLAYERS : [];
  }

  function getHistoricXI() {
    return (window.GM_DATA && Array.isArray(window.GM_DATA.HISTORIC_XI)) ? window.GM_DATA.HISTORIC_XI : [];
  }

  function getSavedState() {
    try { return JSON.parse(localStorage.getItem("goalmaster_ultimate_v2") || "{}"); }
    catch { return {}; }
  }

  // Samostatné čisté zvuky pre akčné hry
  let _ctx = null;
  function playTone(freq, type, dur, delay = 0) {
    const st = getSavedState();
    if (st.sound === false) return;
    try {
      _ctx = _ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (_ctx.state === "suspended") _ctx.resume();
      const o = _ctx.createOscillator(), g = _ctx.createGain();
      o.type = type; o.frequency.setValueAtTime(freq, _ctx.currentTime + delay);
      g.gain.setValueAtTime(0.09, _ctx.currentTime + delay);
      g.gain.exponentialRampToValueAtTime(0.001, _ctx.currentTime + delay + dur);
      o.connect(g); g.connect(_ctx.destination);
      o.start(_ctx.currentTime + delay); o.stop(_ctx.currentTime + delay + dur);
    } catch {}
  }
  const sClick = () => playTone(520, "sine", 0.05);
  const sGoal  = () => { playTone(523, "triangle", 0.1, 0); playTone(659, "triangle", 0.1, 0.09); playTone(880, "triangle", 0.22, 0.18); };
  const sMiss  = () => { playTone(200, "sawtooth", 0.14, 0); playTone(140, "sawtooth", 0.22, 0.12); };

  // Vloží špeciálne štýly pre nové Penalty, 3x3 a Manažéra
  (function injectActionCSS() {
    if (document.getElementById("gmActionStylesV2")) return;
    const st = document.createElement("style");
    st.id = "gmActionStylesV2";
    st.textContent = `
      .gm-pitch-goal {
        position: relative;
        background:
          repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 16px),
          repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 16px),
          linear-gradient(180deg, #071b11 0%, #0f3d23 78%, #15803d 100%);
        border: 6px solid #f1f5f9;
        border-bottom: 4px solid #22c55e;
        border-radius: 12px 12px 4px 4px;
        padding: 12px 10px 44px;
        margin: 10px 0;
        overflow: hidden;
      }
      .gm-goal-grid {
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; position: relative; z-index: 3;
      }
      .gm-target {
        background: rgba(255,255,255,0.07); border: 2px dashed rgba(255,255,255,0.28);
        border-radius: 10px; height: 64px; color: #fff; font-weight: 800; font-size: 0.74rem;
        cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
        transition: all 0.14s;
      }
      .gm-target:hover { background: rgba(255,255,255,0.14); }
      .gm-target.aim { background: rgba(16,185,129,0.34); border: 2px solid #34d399; box-shadow: 0 0 12px rgba(16,185,129,0.45); }
      .gm-target.dive-mode { border-color: rgba(56,189,248,0.55); background: rgba(56,189,248,0.12); }
      .gm-target.dive-mode:hover { background: rgba(56,189,248,0.3); }
      .gm-gk-sprite {
        position: absolute; left: 50%; top: 54%; transform: translate(-50%, -50%);
        font-size: 2.35rem; z-index: 4; pointer-events: none;
        transition: left 0.42s cubic-bezier(0.22,1,0.36,1), top 0.42s cubic-bezier(0.22,1,0.36,1), transform 0.42s ease;
        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.7));
      }
      .gm-ball-sprite {
        position: absolute; left: 50%; top: 92%; transform: translate(-50%, -50%) scale(1.2);
        font-size: 1.55rem; z-index: 6; pointer-events: none;
        transition: left 0.45s cubic-bezier(0.18,0.89,0.32,1.1), top 0.45s cubic-bezier(0.18,0.89,0.32,1.1), transform 0.45s ease;
        filter: drop-shadow(0 4px 6px rgba(0,0,0,0.7));
      }
      .gm-dots-row { display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; background: var(--bg-card); border: 1px solid var(--border); border-radius: 11px; padding: 8px 12px; margin-bottom: 10px; font-size: 0.82rem; font-weight: 800; }
      .gm-gold-zone { position: absolute; top: 0; bottom: 0; left: 45%; width: 10%; background: rgba(245,185,66,0.88); border-left: 2px solid #fef08a; border-right: 2px solid #fef08a; }
      .gm-suggest-box { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; max-height: 108px; overflow-y: auto; }
      .gm-mgr-tabs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-bottom: 12px; }
      .gm-mgr-tab { background: var(--bg-card); color: var(--text-muted); border: 1px solid var(--border); border-radius: 10px; padding: 8px 4px; font-weight: 800; font-size: 0.78rem; cursor: pointer; text-align: center; }
      .gm-mgr-tab.active { background: var(--accent); color: #04130b; border-color: var(--accent); }
      .gm-mgr-kpi { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 10px; }
      @media (max-width: 520px) { .gm-mgr-kpi { grid-template-columns: repeat(2, 1fr); } }
      .gm-kpi-box { background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px; padding: 8px; text-align: center; }
      .gm-kpi-box small { display: block; font-size: 0.68rem; color: var(--text-muted); }
      .gm-kpi-box strong { font-size: 0.96rem; }
      .gm-club-card { background: var(--bg-card); border: 1.5px solid var(--border); border-radius: 14px; padding: 14px; cursor: pointer; text-align: left; transition: all 0.16s; margin-bottom: 10px; width: 100%; color: var(--text); }
      .gm-club-card:hover { border-color: var(--gold); background: var(--bg-card-hover); }
    `;
    document.head.appendChild(st);
  })();

  // ===========================================================================
  // 1. PENALTOVÝ ROZSTREL 2.0 (STRIEDANIE: TY KOPEŠ -> TY CHYTÁŠ + TURNAJ)
  // ===========================================================================
  const penalty = {
    mode: "classic", // "classic" | "cup"
    cupStage: 0,     // 0 = Štvrťfinále, 1 = Semifinále, 2 = Finále
    cupOpps: ["FC Porto", "Bayern Mníchov", "Real Madrid"],
    phase: "shoot",  // "shoot" | "save" | "over"
    aimZone: 2,
    pos: 10,
    dir: 2.1,
    rafId: null,
    youScore: 0,
    aiScore: 0,
    youHist: [],
    aiHist: [],
    round: 1,
    locked: false,
    scoutText: "",
    aiIntendedZone: 0,
    onFinish: null,

    start(onFinish, mode = "classic", cupStage = 0) {
      this.stop();
      if (typeof onFinish === "function") this.onFinish = onFinish;
      this.mode = mode;
      this.cupStage = cupStage;
      this.phase = "shoot";
      this.aimZone = 2;
      this.pos = 12;
      this.dir = 2.0 + cupStage * 0.45;
      this.youScore = 0;
      this.aiScore = 0;
      this.youHist = [];
      this.aiHist = [];
      this.round = 1;
      this.locked = false;
      this.render();
      this.startLoop();
    },

    stop() {
      if (this.rafId) cancelAnimationFrame(this.rafId);
      this.rafId = null;
    },

    // Zachované kvôli kompatibilite s index.html
    selectDive() {},

    setAim(z) {
      if (this.locked || this.phase !== "shoot") return;
      sClick();
      this.aimZone = z;
      document.querySelectorAll(".gm-target").forEach((b, idx) => {
        b.classList.toggle("aim", idx === z);
      });
    },

    startLoop() {
      this.stop();
      const step = () => {
        if (this.phase !== "shoot" || this.locked) return;
        this.pos += this.dir;
        if (this.pos >= 96 || this.pos <= 0) this.dir *= -1;
        const cur = document.getElementById("gmPenCursor");
        if (cur) cur.style.left = this.pos + "%";
        this.rafId = requestAnimationFrame(step);
      };
      this.rafId = requestAnimationFrame(step);
    },

    zoneCoords(z) {
      return [
        { x: "18%", y: "22%", rot: -38 },
        { x: "50%", y: "18%", rot: 0 },
        { x: "82%", y: "22%", rot: 38 },
        { x: "18%", y: "62%", rot: -65 },
        { x: "50%", y: "60%", rot: 0 },
        { x: "82%", y: "62%", rot: 65 }
      ][z] || { x: "50%", y: "50%", rot: 0 };
    },

    formatDots(hist) {
      const total = Math.max(5, hist.length);
      let out = "";
      for (let i = 0; i < total; i++) {
        if (i < hist.length) out += hist[i] ? "🟢" : "🔴";
        else out += "⚪";
      }
      return out;
    },

    isMatchOver() {
      const yKicks = this.youHist.length;
      const aKicks = this.aiHist.length;
      if (yKicks <= 5 && aKicks <= 5) {
        const yLeft = 5 - yKicks;
        const aLeft = 5 - aKicks;
        if (this.youScore > this.aiScore + aLeft) return true;
        if (this.aiScore > this.youScore + yLeft) return true;
        if (yKicks === 5 && aKicks === 5 && this.youScore !== this.aiScore) return true;
        return false;
      }
      // Náhla smrť po 5. sérii
      return yKicks === aKicks && this.youScore !== this.aiScore;
    },

    shootNow() {
      if (this.locked || this.phase !== "shoot") return;
      this.locked = true;
      this.stop();

      const inGold = this.pos >= 45 && this.pos <= 55;
      const inGreen = this.pos >= 30 && this.pos <= 70;
      const extremeMiss = this.pos < 12 || this.pos > 88;

      // Brankár súpera má 6 reálnych smerov (v pohári číta lepšie)
      const keeperSmartChance = 0.16 + this.cupStage * 0.05;
      const keeperZone = Math.random() < keeperSmartChance ? this.aimZone : Math.floor(Math.random() * 6);

      const gk = document.getElementById("gmPenGk");
      const ball = document.getElementById("gmPenBall");
      const gkPos = this.zoneCoords(keeperZone);
      const bPos = this.zoneCoords(this.aimZone);

      if (gk) {
        gk.style.left = gkPos.x;
        gk.style.top = gkPos.y;
        gk.style.transform = `translate(-50%, -50%) rotate(${gkPos.rot}deg)`;
      }

      let scored = false;
      let msg = "";

      if (extremeMiss) {
        if (ball) { ball.style.left = bPos.x; ball.style.top = "-14%"; ball.style.transform = "translate(-50%,-50%) scale(0.6)"; }
        sMiss();
        msg = "💥 Prestrelil si vysoko nad brvno! (Trafil si kraj červenej zóny)";
      } else {
        if (ball) { ball.style.left = bPos.x; ball.style.top = bPos.y; ball.style.transform = "translate(-50%,-50%) scale(0.75)"; }

        if (inGold) {
          if (keeperZone === this.aimZone && Math.random() < 0.2) {
            sMiss();
            msg = "🧤 Neuveriteľný zázračný zákrok brankára z vinkla!";
          } else {
            scored = true; sGoal();
            msg = "🔥 ZLATÁ BOMBA DO ŠIBENICE! Nechytateľný gól!";
          }
        } else if (inGreen) {
          if (keeperZone === this.aimZone) {
            sMiss();
            msg = "🧤 Brankár vystihol smer a loptu vyrazil!";
          } else {
            scored = true; sGoal();
            msg = "⚽ GÓÓÓL! Brankár skočil do zlého rohu!";
          }
        } else {
          // Mimo zelenej = slabšia strela (brankár má vyššiu šancu chytiť alebo tyčka)
          if (keeperZone === this.aimZone || Math.random() < 0.45) {
            sMiss();
            msg = "🥅 Slabá strela mimo zelenej zóny — brankár ju ľahko zneškodnil!";
          } else {
            scored = true; sGoal();
            msg = "⚽ Šťastný gól o tyčku! Nabudúce traf zelenú zónu.";
          }
        }
      }

      if (scored) this.youScore++;
      this.youHist.push(scored);
      this.updateTopBanner(msg, scored);

      setTimeout(() => {
        if (this.isMatchOver()) {
          this.finishMatch();
        } else {
          this.prepareSavePhase();
        }
      }, 1350);
    },

    prepareSavePhase() {
      this.phase = "save";
      this.locked = false;
      this.aiIntendedZone = Math.floor(Math.random() * 6);

      // Skautská nápoveda: 60 % pravda, 40 % finta súpera
      const zoneNames = ["ľavý horný roh", "stred hore", "pravý horný roh", "ľavý dolný roh", "stred bránky", "pravý dolný roh"];
      const honest = Math.random() < 0.6;
      const hintZone = honest ? this.aiIntendedZone : Math.floor(Math.random() * 6);
      this.scoutText = `👀 Súper sa rozbieha a pozerá na: ${zoneNames[hintZone]}! Klikni do bránky, kam skočíš!`;
      this.render();
    },

    diveNow(chosenZone) {
      if (this.locked || this.phase !== "save") return;
      this.locked = true;

      const gk = document.getElementById("gmPenGk");
      const ball = document.getElementById("gmPenBall");
      const gkPos = this.zoneCoords(chosenZone);
      const bPos = this.zoneCoords(this.aiIntendedZone);

      const aiMissesGoal = Math.random() < 0.08;
      if (gk) {
        gk.style.left = gkPos.x;
        gk.style.top = gkPos.y;
        gk.style.transform = `translate(-50%, -50%) rotate(${gkPos.rot}deg)`;
      }

      let aiScored = false;
      let msg = "";

      if (aiMissesGoal) {
        if (ball) { ball.style.left = bPos.x; ball.style.top = "-12%"; ball.style.transform = "translate(-50%,-50%) scale(0.6)"; }
        sGoal();
        msg = "💥 SÚPER TRAFIL BRVNO! Loptu poslal mimo bránky!";
      } else {
        if (ball) { ball.style.left = bPos.x; ball.style.top = bPos.y; ball.style.transform = "translate(-50%,-50%) scale(0.75)"; }
        if (chosenZone === this.aiIntendedZone) {
          sGoal();
          msg = "🦸 FANTASTICKÝ ZÁKROK! Chytil si súperovu penaltu!";
        } else {
          aiScored = true; sMiss();
          msg = "😬 Súper ťa poslal do opačného rohu a skóroval.";
        }
      }

      if (aiScored) this.aiScore++;
      this.aiHist.push(aiScored);
      this.updateTopBanner(msg, !aiScored);

      setTimeout(() => {
        if (this.isMatchOver()) {
          this.finishMatch();
        } else {
          this.round++;
          this.phase = "shoot";
          this.locked = false;
          this.pos = 6;
          this.dir = Math.min(3.7, Math.abs(this.dir) + 0.14) * (Math.random() < 0.5 ? 1 : -1);
          this.render();
          this.startLoop();
        }
      }, 1350);
    },

    finishMatch() {
      this.phase = "over";
      this.locked = true;
      this.stop();
      const won = this.youScore > this.aiScore;
      this.render();

      const fb = document.getElementById("gmPenFb");
      if (this.mode === "cup") {
        if (won && this.cupStage < 2) {
          if (fb) {
            fb.className = "feedback show ok";
            fb.textContent = `🏆 POSTUP! Zdolal si ${this.cupOpps[this.cupStage]} (${this.youScore}:${this.aiScore}). Čaká ťa ${this.cupOpps[this.cupStage + 1]}!`;
          }
          if (typeof window.addReward === "function") window.addReward(60, 50, 3);
        } else if (won && this.cupStage === 2) {
          if (fb) {
            fb.className = "feedback show ok";
            fb.textContent = `🏆👑 SI ŠAMPIÓN POHÁRA! Vo finále si porazil ${this.cupOpps[2]} (${this.youScore}:${this.aiScore})!`;
          }
          if (typeof window.addReward === "function") window.addReward(250, 200, 15);
          if (typeof this.onFinish === "function") this.onFinish(true, this.youScore, this.aiScore);
        } else {
          if (fb) {
            fb.className = "feedback show err";
            fb.textContent = `😢 Vypadol si v zápase proti ${this.cupOpps[this.cupStage]} (${this.youScore}:${this.aiScore}).`;
          }
          if (typeof this.onFinish === "function") this.onFinish(false, this.youScore, this.aiScore);
        }
      } else {
        if (fb) {
          fb.className = `feedback show ${won ? "ok" : "err"}`;
          fb.textContent = won
            ? `🏆 VYHRAL SI ROZSTREL ${this.youScore}:${this.aiScore}!`
            : `😢 Prehral si rozstrel ${this.youScore}:${this.aiScore}. Skús odvetu!`;
        }
        if (typeof this.onFinish === "function") this.onFinish(won, this.youScore, this.aiScore);
      }
    },

    updateTopBanner(msg, ok) {
      const fb = document.getElementById("gmPenFb");
      if (fb) { fb.className = `feedback show ${ok ? "ok" : "err"}`; fb.textContent = msg; }
      const d1 = document.getElementById("gmDotsYou");
      const d2 = document.getElementById("gmDotsAi");
      if (d1) d1.textContent = `${this.youScore} ${this.formatDots(this.youHist)}`;
      if (d2) d2.textContent = `${this.aiScore} ${this.formatDots(this.aiHist)}`;
    },

    render() {
      const host = document.getElementById("gmActionMount");
      if (!host) return;
      const oppName = this.mode === "cup" ? this.cupOpps[this.cupStage] : "Súper AI";
      const stageNames = ["Štvrťfinále", "Semifinále", "FINÁLE"];
      const zones = ["↖️ Ľavý vinkel", "⬆️ Stred hore", "↗️ Pravý vinkel", "↙️ Ľavo dole", "🎯 Stred", "↘️ Pravo dole"];
      const isSave = this.phase === "save";
      const isOver = this.phase === "over";
      const wonCupNext = isOver && this.mode === "cup" && this.youScore > this.aiScore && this.cupStage < 2;

      host.innerHTML = `
        <div class="panel">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
            <strong>🥅 ${this.mode === "cup" ? `Pohár: ${stageNames[this.cupStage]} vs ${oppName}` : "Klasický rozstrel"} • Kolo ${this.round}</strong>
            <div style="display:flex; gap:6px;">
              <button class="chip ${this.mode === "classic" ? "active" : ""}" onclick="window.GM_GAMES.penalty.start(window.GM_GAMES.penalty.onFinish,'classic',0)">Klasika</button>
              <button class="chip ${this.mode === "cup" ? "active" : ""}" onclick="window.GM_GAMES.penalty.start(window.GM_GAMES.penalty.onFinish,'cup',0)">🏆 Pohár (3 zápasy)</button>
            </div>
          </div>

          <div class="gm-dots-row">
            <span>👤 Ty: <span id="gmDotsYou">${this.youScore} ${this.formatDots(this.youHist)}</span></span>
            <span>🤖 ${oppName}: <span id="gmDotsAi">${this.aiScore} ${this.formatDots(this.aiHist)}</span></span>
          </div>

          <div style="padding:8px 10px; border-radius:10px; font-size:0.82rem; font-weight:800; text-align:center; margin-bottom:6px; background:${isSave ? "rgba(56,189,248,0.16)" : "rgba(16,185,129,0.15)"}; border:1px solid ${isSave ? "var(--gem)" : "var(--accent)"}; color:${isSave ? "#7dd3fc" : "#6ee7b7"};">
            ${isOver ? "🏁 Rozstrel skončil!" : isSave ? this.scoutText : "⚽ TVOJ KOP: Klikni na roh bránky a stlač VYSTRELIŤ v zelenej alebo zlatej zóne!"}
          </div>

          <div class="gm-pitch-goal">
            <div class="gm-goal-grid">
              ${zones.map((lbl, i) => `
                <button class="gm-target ${!isSave && i === this.aimZone ? "aim" : ""} ${isSave ? "dive-mode" : ""}"
                  onclick="${isSave ? `window.GM_GAMES.penalty.diveNow(${i})` : `window.GM_GAMES.penalty.setAim(${i})`}">
                  <span>${!isSave && i === this.aimZone ? "🎯" : isSave ? "🧤" : ""} ${lbl}</span>
                </button>
              `).join("")}
            </div>
            <div class="gm-gk-sprite" id="gmPenGk">${isSave ? "🦸" : "🧤"}</div>
            <div class="gm-ball-sprite" id="gmPenBall">⚽</div>
          </div>

          ${!isSave && !isOver ? `
            <div class="timing-track">
              <div class="timing-green" style="left:30%; width:40%;"></div>
              <div class="gm-gold-zone"></div>
              <div class="timing-cursor" id="gmPenCursor" style="left:${this.pos}%;"></div>
            </div>
            <button class="btn btn-gold" style="width:100%; padding:13px; font-size:1rem;" onclick="window.GM_GAMES.penalty.shootNow()">⚽ VYSTRELIŤ PENALTU!</button>
          ` : ""}

          ${wonCupNext ? `
            <button class="btn btn-gold" style="width:100%; padding:13px; margin-top:8px;" onclick="window.GM_GAMES.penalty.start(window.GM_GAMES.penalty.onFinish,'cup',${this.cupStage + 1})">➡️ Postúpiť na ${stageNames[this.cupStage + 1]} (${this.cupOpps[this.cupStage + 1]})</button>
          ` : isOver ? `
            <button class="btn btn-primary" style="width:100%; padding:13px; margin-top:8px;" onclick="window.GM_GAMES.penalty.start(window.GM_GAMES.penalty.onFinish,'${this.mode}',0)">🔄 Hrať znova</button>
          ` : ""}

          <div class="feedback" id="gmPenFb"></div>
        </div>
      `;
    }
  };

  // ===========================================================================
  // 2. FUTBALOVÁ MRIEŽKA 3×3 (100 % RIEŠITEĽNÝ GENERÁTOR + NAŠEPKÁVAČ)
  // ===========================================================================
  const grid3x3 = {
    mode: "country_club", // "country_club" | "club_club"
    data: null,
    solvedCells: {},
    usedPlayers: [],
    selectedIdx: 0,
    hintsUsed: 0,
    onCellWin: null,

    buildSmartGrid(mode) {
      const players = getPlayers();
      if (players.length < 9) return null;

      // Spočítame najpočetnejšie kluby a krajiny v databáze
      const clubMap = new Map();
      const countryMap = new Map();
      players.forEach(p => {
        if (p.country) {
          if (!countryMap.has(p.country)) countryMap.set(p.country, []);
          countryMap.get(p.country).push(p);
        }
        (p.clubs || []).forEach(c => {
          if (!clubMap.has(c)) clubMap.set(c, []);
          clubMap.get(c).push(p);
        });
      });

      const topClubs = Array.from(clubMap.entries())
        .sort((a, b) => b[1].length - a[1].length)
        .slice(0, 18)
        .map(x => x[0]);

      const topCountries = Array.from(countryMap.entries())
        .sort((a, b) => b[1].length - a[1].length)
        .slice(0, 12)
        .map(x => x[0]);

      const tryBuild = (useMode) => {
        const rowSource = useMode === "club_club" ? topClubs.slice(0, 14) : topCountries;
        const colSource = topClubs.slice(0, 14);

        for (let attempt = 0; attempt < 450; attempt++) {
          const rows = shuffle(rowSource).slice(0, 3);
          const cols = shuffle(colSource.filter(c => useMode !== "club_club" || !rows.includes(c))).slice(0, 3);
          if (rows.length < 3 || cols.length < 3) continue;

          const cells = [];
          let valid = true;
          for (const r of rows) {
            for (const c of cols) {
              const matches = players.filter(p =>
                useMode === "club_club"
                  ? (p.clubs || []).includes(r) && (p.clubs || []).includes(c)
                  : p.country === r && (p.clubs || []).includes(c)
              );
              if (!matches.length) { valid = false; break; }
              cells.push({ row: r, col: c, matches });
            }
            if (!valid) break;
          }
          if (valid) return { mode: useMode, rows, cols, cells };
        }
        return null;
      };

      // Najprv skús zvolený režim, potom záložný country_club, potom deterministický top 3×3
      let built = tryBuild(mode);
      if (!built && mode === "club_club") built = tryBuild("country_club");
      if (built) return built;

      // Garantovaný deterministický vyhľadávač (nájde prvú 100% platnú 3×3 mriežku z top krajín a klubov)
      const cTop = topCountries.slice(0, 8);
      const clTop = topClubs.slice(0, 10);
      for (let r1 = 0; r1 < cTop.length; r1++)
      for (let r2 = r1 + 1; r2 < cTop.length; r2++)
      for (let r3 = r2 + 1; r3 < cTop.length; r3++) {
        const rows = [cTop[r1], cTop[r2], cTop[r3]];
        const goodCols = clTop.filter(cl =>
          rows.every(rw => players.some(p => p.country === rw && (p.clubs || []).includes(cl)))
        );
        if (goodCols.length >= 3) {
          const cols = goodCols.slice(0, 3);
          const cells = [];
          rows.forEach(r => cols.forEach(c => {
            cells.push({ row: r, col: c, matches: players.filter(p => p.country === r && (p.clubs || []).includes(c)) });
          }));
          return { mode: "country_club", rows, cols, cells };
        }
      }
      return null;
    },

    start(onCellWin, mode = this.mode) {
      if (typeof onCellWin === "function") this.onCellWin = onCellWin;
      this.mode = mode;
      this.solvedCells = {};
      this.usedPlayers = [];
      this.selectedIdx = 0;
      this.hintsUsed = 0;
      this.data = this.buildSmartGrid(mode);
      this.render();
    },

    selectCell(idx) {
      sClick();
      this.selectedIdx = idx;
      this.render();
      const inp = document.getElementById("gmGridInput");
      if (inp) inp.focus();
    },

    onType(val) {
      const box = document.getElementById("gmGridSuggest");
      if (!box) return;
      const q = norm(val);
      if (q.length < 2) { box.innerHTML = ""; return; }
      const hits = getPlayers()
        .filter(p => norm(p.name).includes(q) && !this.usedPlayers.includes(p.id))
        .slice(0, 8);
      box.innerHTML = hits.map(p =>
        `<button class="chip" onclick="window.GM_GAMES.grid3x3.submitPlayerId('${p.id}')">${p.name} (${p.nat.split(" ")[0]})</button>`
      ).join("");
    },

    submitPlayerId(id) {
      const p = getPlayers().find(x => x.id === id);
      if (!p) return;
      const inp = document.getElementById("gmGridInput");
      if (inp) inp.value = p.name;
      this.submitGuess(p);
    },

    submitGuess(directPlayer = null) {
      if (!this.data) return;
      const inp = document.getElementById("gmGridInput");
      const fb = document.getElementById("gmGridFb");
      const cell = this.data.cells[this.selectedIdx];

      let chosen = directPlayer;
      if (!chosen && inp) {
        const g = norm(inp.value);
        if (!g) return;
        chosen = getPlayers().find(p => {
          const fn = norm(p.name);
          const ln = norm(p.name.split(" ").pop());
          return fn === g || (g.length >= 4 && (fn.includes(g) || ln === g));
        });
      }

      if (!chosen) {
        sMiss();
        if (fb) { fb.className = "feedback show err"; fb.textContent = "❌ Takého hráča v databáze nepoznám — skús kliknúť na návrh pod políčkom."; }
        return;
      }

      if (this.usedPlayers.includes(chosen.id)) {
        sMiss();
        if (fb) { fb.className = "feedback show err"; fb.textContent = `⚠️ Hráča ${chosen.name} si už v tejto mriežke použil! Vyber iného.`; }
        return;
      }

      const ok = cell.matches.some(m => m.id === chosen.id);
      if (ok) {
        sGoal();
        this.solvedCells[this.selectedIdx] = chosen.name;
        this.usedPlayers.push(chosen.id);
        // Automaticky skoč na ďalšie voľné políčko
        const nextOpen = [0,1,2,3,4,5,6,7,8].find(i => !this.solvedCells[i]);
        if (nextOpen !== undefined) this.selectedIdx = nextOpen;

        const allDone = Object.keys(this.solvedCells).length === 9;
        if (typeof this.onCellWin === "function") this.onCellWin(chosen.name, allDone);
        this.render();
        const fb2 = document.getElementById("gmGridFb");
        if (fb2) {
          fb2.className = "feedback show ok";
          fb2.textContent = allDone
            ? `🏆 KOMPLETNÁ MRIEŽKA 9/9! Posledný dielik: ${chosen.name}!`
            : `✅ Správne! ${chosen.name} spĺňa ${cell.row} + ${cell.col}!`;
        }
      } else {
        sMiss();
        if (fb) { fb.className = "feedback show err"; fb.textContent = `❌ ${chosen.name} nesplnil kombináciu (${cell.row} + ${cell.col}).`; }
      }
    },

    giveHint() {
      if (!this.data) return;
      const cell = this.data.cells[this.selectedIdx];
      const avail = cell.matches.filter(m => !this.usedPlayers.includes(m.id));
      const fb = document.getElementById("gmGridFb");
      if (!avail.length) {
        if (fb) { fb.className = "feedback show err"; fb.textContent = "Pre toto políčko si už všetkých hráčov minul inde – skús Novú mriežku."; }
        return;
      }
      const p = avail[Math.floor(Math.random() * avail.length)];
      const initials = p.name.split(" ").map(w => w[0] + ".").join(" ");
      this.hintsUsed++;
      sClick();
      if (fb) {
        fb.className = "feedback show ok";
        fb.textContent = `💡 Nápoveda pre (${cell.row} + ${cell.col}): Pozícia ${p.pos}, OVR ${p.ovr}, iniciály ${initials}`;
      }
    },

    render() {
      const host = document.getElementById("gmActionMount");
      if (!host) return;
      if (!this.data) {
        host.innerHTML = `<div class="panel"><p>Nepodarilo sa načítať hráčov. Skontroluj Diagnostiku v Profile.</p></div>`;
        return;
      }

      const { rows, cols, cells } = this.data;
      const activeCell = cells[this.selectedIdx];
      const done = Object.keys(this.solvedCells).length;
      const validLeft = activeCell.matches.filter(m => !this.usedPlayers.includes(m.id)).length;

      let tableHtml = `<div style="display:grid; grid-template-columns: 74px repeat(3, 1fr); gap:6px; align-items:stretch; margin:10px 0;">
        <div></div>
        ${cols.map(c => `<div style="text-align:center; font-size:0.7rem; font-weight:900; color:var(--gold); background:var(--bg-dark); padding:6px 4px; border-radius:8px; display:grid; place-items:center;">${c}</div>`).join("")}`;

      for (let r = 0; r < 3; r++) {
        tableHtml += `<div style="font-size:0.7rem; font-weight:900; color:var(--gem); background:var(--bg-dark); padding:6px 4px; border-radius:8px; display:grid; place-items:center; text-align:center;">${rows[r]}</div>`;
        for (let c = 0; c < 3; c++) {
          const idx = r * 3 + c;
          const isDone = !!this.solvedCells[idx];
          const isSel = idx === this.selectedIdx;
          tableHtml += `
            <button onclick="window.GM_GAMES.grid3x3.selectCell(${idx})"
              style="min-height:66px; border-radius:10px; padding:6px 4px; cursor:pointer; color:#fff; font-weight:800; font-size:0.74rem; border:2px solid ${isDone ? "var(--accent)" : isSel ? "var(--gold)" : "var(--border)"}; background:${isDone ? "rgba(16,185,129,0.22)" : isSel ? "rgba(245,185,66,0.16)" : "var(--bg-card)"};">
              ${isDone ? `✅<br>${this.solvedCells[idx]}` : isSel ? "🎯<br>Vybrané" : "+"}
            </button>`;
        }
      }
      tableHtml += `</div>`;

      host.innerHTML = `
        <div class="panel">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
            <strong>🧩 Mriežka 3×3 (${done}/9)</strong>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <button class="chip ${this.mode === "country_club" ? "active" : ""}" onclick="window.GM_GAMES.grid3x3.start(window.GM_GAMES.grid3x3.onCellWin,'country_club')">🌍 Krajiny × Kluby</button>
              <button class="chip ${this.mode === "club_club" ? "active" : ""}" onclick="window.GM_GAMES.grid3x3.start(window.GM_GAMES.grid3x3.onCellWin,'club_club')">🔥 Kluby × Kluby</button>
              <button class="chip" onclick="window.GM_GAMES.grid3x3.start(window.GM_GAMES.grid3x3.onCellWin,'${this.mode}')">🔄 Nová</button>
            </div>
          </div>

          ${tableHtml}

          <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.78rem; margin-bottom:8px; flex-wrap:wrap; gap:6px;">
            <span>Políčko: <strong style="color:var(--gold)">${activeCell.row}</strong> + <strong style="color:var(--accent)">${activeCell.col}</strong></span>
            <span style="color:var(--text-muted);">Voľných riešení v DB: <strong>${validLeft}</strong></span>
          </div>

          <div class="input-row">
            <input type="text" id="gmGridInput" class="text-input" placeholder="Začni písať meno hráča (napr. Messi, Kroos)..."
              oninput="window.GM_GAMES.grid3x3.onType(this.value)"
              onkeydown="if(event.key==='Enter') window.GM_GAMES.grid3x3.submitGuess()" />
            <button class="btn btn-primary" onclick="window.GM_GAMES.grid3x3.submitGuess()">Overiť</button>
            <button class="btn btn-ghost" onclick="window.GM_GAMES.grid3x3.giveHint()">💡 Tip</button>
          </div>
          <div class="gm-suggest-box" id="gmGridSuggest"></div>
          <div class="feedback" id="gmGridFb"></div>
        </div>
      `;
    }
  };

  // ===========================================================================
  // 3. MANAŽÉR & PREZIDENT KLUBU 2.0 (45 DILEM BEZ OPAKOVANIA + LIGA + PRESTUPY + ŠTADIÓN)
  // ===========================================================================
  const MANAGER_DILEMMAS_45 = [
    { role: "Športový riaditeľ", text: "Klub zo Saudskej Arábie ponúka 95M € za nášho 31-ročného kapitána. Predáme ho?", yes: { m:18, f:-16, s:-12, b:14, cash:35, ovr:-2 }, no: { m:-8, f:14, s:12, b:-6 } },
    { role: "Hlavný tréner", text: "17-ročný talent z akadémie žiari na tréningu. Dáme ho rovno do základu namiesto drahej hviezdy?", yes: { m:8, f:12, s:-8, b:6, ovr:1 }, no: { m:-4, f:-6, s:10, b:-4 } },
    { role: "Finančný riaditeľ", text: "Energetický nápoj ponúka 22M € za premenovanie nášho historického štadióna. Súhlasíš?", yes: { m:20, f:-20, s:0, b:12, cash:22 }, no: { m:-10, f:16, s:4, b:-6 } },
    { role: "Zástupca fanúšikov", text: "Ultras žiadajú lacnejšie permanentky pre mládež a rodiny o 20 %. Vyhovieme im?", yes: { m:-12, f:20, s:6, b:-6, cash:-6 }, no: { m:10, f:-16, s:0, b:8, cash:5 } },
    { role: "Agent útočníka", text: "Náš najlepší strelec žiada dvojnásobný plat, inak pôjde ku konkurentovi. Pridáme mu?", yes: { m:-14, f:12, s:10, b:-8, cash:-10 }, no: { m:10, f:-12, s:-12, b:6, ovr:-1 } },
    { role: "Marketing", text: "Letné komerčné turné v USA a Ázii prinesie 18M €, ale hráči budú unavení pred ligou.", yes: { m:15, f:6, s:-14, b:10, cash:18 }, no: { m:-8, f:-4, s:12, b:-4 } },
    { role: "Klubový lekár", text: "Hviezdny tvorca hry nie je 100 % fit pred derby, no chce hrať pod injekciami. Dovolíš?", yes: { m:0, f:12, s:-12, b:4, ovr:1 }, no: { m:0, f:-6, s:12, b:-2 } },
    { role: "Vedenie ligy", text: "VAR nás poškodil v kľúčovom zápase. Zverejníme ostré vyhlásenie proti rozhodcom?", yes: { m:-6, f:18, s:12, b:-14, cash:-4 }, no: { m:4, f:-10, s:-6, b:10 } },
    { role: "Hlavný skaut", text: "Našli sme 18-ročného Brazílčana za 14M €. Je to risk, ale môže mať hodnotu 90M €. Kúpime ho?", yes: { m:-10, f:10, s:6, b:6, cash:-14, ovr:2 }, no: { m:8, f:-4, s:0, b:-4 } },
    { role: "Architekt", text: "Zmodernizujeme tréningové plochy a regeneráciu za 12M €?", yes: { m:-10, f:8, s:16, b:8, cash:-12, ovr:1 }, no: { m:6, f:-4, s:-10, b:-4 } },
    { role: "Hovorca klubu", text: "Mladý obranca bol odfotený na nočnej párty 2 dni pred zápasom. Dáme mu tvrdú pokutu a lavičku?", yes: { m:4, f:10, s:-10, b:12 }, no: { m:-2, f:-12, s:10, b:-10 } },
    { role: "Televízna stanica", text: "Netflix chce natáčať dokument z našej šatne počas celej sezóny za 15M €. Prijmeme?", yes: { m:14, f:10, s:-12, b:10, cash:15 }, no: { m:-6, f:-4, s:10, b:-4 } },
    { role: "Asistent trénera", text: "Zavedieme prísny dvojfázový kondičný tréning, aby sme súperov ubehali v závere?", yes: { m:0, f:6, s:-10, b:8, ovr:1 }, no: { m:0, f:-4, s:10, b:-4 } },
    { role: "Výrobca dresov", text: "Navrhli extrémny neónový tretí dres, ktorý rozdeľuje fanúšikov, ale prinesie 10M € z predaja.", yes: { m:12, f:-10, s:2, b:8, cash:10 }, no: { m:-6, f:10, s:0, b:-4 } },
    { role: "Brankárska jednotka", text: "35-ročný brankár žiada novú 3-ročnú zmluvu. Podpíšeme ho alebo dáme šancu mladému?", yes: { m:-6, f:10, s:10, b:-6 }, no: { m:8, f:-8, s:-8, b:8 } },
    { role: "Mestský úrad", text: "Mesto žiada, aby klub bezplatne prispel 6M € na opravu mestských mládežníckych ihrísk.", yes: { m:-8, f:18, s:6, b:6, cash:-6 }, no: { m:8, f:-16, s:-4, b:-4 } },
    { role: "Prezident súpera", text: "Rival ponúka výmenu: ich skúsený záložník za nášho nádejného krídelníka + 8M €.", yes: { m:8, f:-8, s:-6, b:6, cash:8 }, no: { m:-4, f:8, s:8, b:-2 } },
    { role: "Dátový analytik", text: "Kúpime špičkový AI analytický softvér na štandardky za 7M €?", yes: { m:-6, f:4, s:6, b:10, cash:-7, ovr:1 }, no: { m:6, f:0, s:-2, b:-6 } },
    { role: "Kapitán tímu", text: "Kabína žiada sľúbiť tučné prémie (10M €), ak tento mesiac vyhráme všetky zápasy.", yes: { m:-10, f:6, s:18, b:-4, cash:-10, ovr:1 }, no: { m:8, f:-2, s:-12, b:6 } },
    { role: "Kryptosponzor", text: "Podozrivá kryptofirma ponúka 25M € na prednú stranu dresov, ale fanúšikovia protestujú.", yes: { m:22, f:-22, s:-4, b:10, cash:25 }, no: { m:-8, f:16, s:4, b:-4 } },
    { role: "Tréner brankárov", text: "Kúpime špecialistu na pokutové kopy a mentálneho kouča pre celý tím (5M €)?", yes: { m:-5, f:6, s:12, b:6, cash:-5, ovr:1 }, no: { m:4, f:-2, s:-6, b:-2 } },
    { role: "Bývalá legenda", text: "Klubová ikona chce miesto v predstavenstve. Fanúšikovia ju milujú, ale nemá manažérske skúsenosti.", yes: { m:-4, f:18, s:8, b:-10 }, no: { m:4, f:-14, s:-4, b:10 } },
    { role: "Bezpečnostný manažér", text: "Ultras chcú povoliť choreo s pyrotechnikou na veľké derby. Hrozí pokuta od zväzu.", yes: { m:-8, f:20, s:10, b:-14, cash:-5 }, no: { m:6, f:-16, s:-4, b:12 } },
    { role: "Klubový šéfkuchár", text: "Zavedieme prísnu bezcukrovú diétu a zákaz mobilov pri spoločných obedoch?", yes: { m:0, f:4, s:-8, b:8, ovr:1 }, no: { m:0, f:-2, s:8, b:-4 } },
    { role: "Organizátor Superligy", text: "Tajne nás oslovili s pozvánkou do novej lukratívnej Superligy. Pridáme sa?", yes: { m:24, f:-25, s:-6, b:12, cash:30 }, no: { m:-10, f:22, s:8, b:-6 } },
    { role: "Tlačová konferencia", text: "Novinári tvrdo kritizujú nášho drahého útočníka po 5 zápasoch bez gólu. Zastaneš sa ho?", yes: { m:0, f:6, s:16, b:-4 }, no: { m:0, f:4, s:-14, b:6 } },
    { role: "Sponzor auta", text: "Každý hráč dostane luxusné športové auto výmenou za 3 dni natáčania reklám.", yes: { m:10, f:4, s:8, b:8, cash:9 }, no: { m:-6, f:0, s:-4, b:-4 } },
    { role: "Správca trávnika", text: "Pred dôležitým zápasom s technickým súperom môžeme nechať vyššiu trávu, aby sme spomalili hru.", yes: { m:0, f:-6, s:6, b:-4 }, no: { m:0, f:8, s:4, b:6 } },
    { role: "Šéf mládeže", text: "Máme možnosť podpísať 3 talentovaných 16-ročných hráčov z Južnej Ameriky za 9M €.", yes: { m:-8, f:10, s:4, b:10, cash:-9, ovr:1 }, no: { m:6, f:-4, s:0, b:-6 } },
    { role: "Cestovná kancelária", text: "Na vonkajšie zápasy môžeme lietať súkromným lietadlom (drahšie o 6M €), ale hráči budú oddýchnutí.", yes: { m:-8, f:2, s:14, b:-4, cash:-6 }, no: { m:8, f:4, s:-10, b:6 } },
    { role: "Manažér e-športu", text: "Založíme oficiálny e-športový tím klubu pre mladých fanúšikov za 4M €?", yes: { m:-4, f:12, s:2, b:6, cash:-4 }, no: { m:4, f:-6, s:0, b:-2 } },
    { role: "Právnik klubu", text: "Iný veľkoklub tajne kontaktoval našu hviezdu bez nášho dovolenia. Podáme žalobu na FIFA?", yes: { m:-4, f:12, s:6, b:10 }, no: { m:4, f:-10, s:-6, b:-6 } },
    { role: "Fanclub", text: "Zorganizujeme otvorený tréning s autogramiádou na štadióne pred víkendovým zápasom?", yes: { m:2, f:16, s:6, b:4 }, no: { m:0, f:-10, s:2, b:-2 } },
    { role: "Riaditeľ akadémie", text: "Druholigový klub chce na hosťovanie nášho náhradného stopéra a zaplatí 100 % jeho platu.", yes: { m:8, f:0, s:6, b:6, cash:4 }, no: { m:-4, f:0, s:-6, b:-2 } },
    { role: "Športový psychológ", text: "Po dvoch slabších zápasoch navrhuje tímový teambuilding na horách namiesto klasického tréningu.", yes: { m:-3, f:4, s:16, b:-2 }, no: { m:2, f:-2, s:-8, b:4 } },
    { role: "Hlavný sponzor", text: "Chce, aby sme kúpili populárneho ázijského hráča kvôli marketingu (stojí 12M €).", yes: { m:14, f:6, s:-4, b:12, cash:6 }, no: { m:-8, f:2, s:4, b:-8 } },
    { role: "Tréner štandardiek", text: "Objavil geniálny signál z rohového kopu, no vyžaduje stiahnuť z brány takmer celú obranu.", yes: { m:0, f:10, s:8, b:2, ovr:1 }, no: { m:0, f:-2, s:2, b:4 } },
    { role: "Finančná kontrola UEFA", text: "Blížime sa k limitu Financial Fair Play. Predáme lavičkového hráča za 16M € pre pokoj účtovníctva?", yes: { m:18, f:-6, s:-8, b:16, cash:16, ovr:-1 }, no: { m:-14, f:8, s:8, b:-14 } },
    { role: "VIP Lóža", text: "Rozšírime VIP lóže na úkor 800 miest v kotli fanúšikov? Prinesie to +14M €.", yes: { m:16, f:-18, s:0, b:12, cash:14 }, no: { m:-8, f:16, s:4, b:-6 } },
    { role: "Klubové múzeum", text: "Otvoríme interaktívne múzeum trofejí s prehliadkami štadióna (investícia 8M €)?", yes: { m:-6, f:14, s:4, b:10, cash:-8 }, no: { m:6, f:-8, s:0, b:-4 } },
    { role: "Reprezentačný tréner", text: "Žiada, aby sme našu unavenú hviezdu šetrili v ligovom zápase pred kvalifikáciou.", yes: { m:0, f:-10, s:10, b:-4 }, no: { m:0, f:10, s:-8, b:6 } },
    { role: "Skaut brankárov", text: "Voľný agent — skúsený 33-ročný brankár s titulom z LM — chce prísť ako mentor za 3M €.", yes: { m:-4, f:8, s:10, b:4, cash:-3, ovr:1 }, no: { m:4, f:-2, s:-4, b:0 } },
    { role: "Miestna charita", text: "Odohráme benefičný zápas proti výberu legiend? Prinesie to skvelú atmosféru.", yes: { m:-2, f:18, s:10, b:8 }, no: { m:4, f:-12, s:-4, b:-6 } },
    { role: "Technický riaditeľ", text: "Zavedieme na štadióne bezhotovostné platby a rýchlejšie stánky (stojí 5M €, zvyšuje tržby)?", yes: { m:8, f:10, s:0, b:10, cash:-5 }, no: { m:-4, f:-6, s:0, b:-4 } },
    { role: "Dres s číslom 10", text: "Mladá hviezda žiada legendárnu desiatku po klubovej ikone. Dovolíš jej nosiť toto číslo?", yes: { m:6, f:6, s:8, b:4 }, no: { m:-2, f:6, s:-8, b:2 } }
  ];

  const OPPONENTS = [
    "FC Metro", "AC Nord", "Real Valia", "Sporting Východ", "Dynamo Sever", "Atletico Juh",
    "Olympique Modrá", "United Hory", "Inter Lúka", "Bayern Les", "Arsenal Hrad", "Chelsea Prístav",
    "Benfica Záliv", "Ajax Veterník", "Napoli Sopka", "Sevilla Slnko", "Borussia Žltá", "Celtic Zelená", "Lyon Lev"
  ];

  const CLUB_PRESETS = [
    { id: "giant", name: "⚪ Kráľovský Gigant", desc: "Bohatý veľkoklub • Cieľ: 1. miesto", cash: 110, ovr: 86, m: 60, f: 55, s: 55, b: 48 },
    { id: "mid",   name: "🔵 Európsky Vyzývateľ", desc: "Ambiciózny tím • Cieľ: Top 4", cash: 62, ovr: 80, m: 55, f: 58, s: 58, b: 55 },
    { id: "under", name: "🟢 Klub z predmestia", desc: "Ťažká výzva • Cieľ: Senzácia v lige", cash: 28, ovr: 74, m: 50, f: 68, s: 65, b: 64 }
  ];

  const manager = {
    started: false,
    tab: "office", // "office" | "transfers" | "club"
    season: 1,
    week: 1,
    clubName: "",
    tactic: "balanced", // "attack" | "balanced" | "defense"
    cash: 60,
    ovr: 80,
    pts: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    form: [],
    money: 55,
    fans: 55,
    squad: 55,
    board: 55,
    stadiumLvl: 1,
    academyLvl: 1,
    medLvl: 1,
    mktLvl: 1,
    deck: [],
    currDilemma: null,
    market: [],
    signedIds: [],
    lastMatchText: "Priprav sa na 1. kolo novej sezóny!",
    gameOver: false,
    overReason: "",

    start() {
      this.started = false;
      this.renderClubSelect();
    },

    pickClub(presetId) {
      sClick();
      const pr = CLUB_PRESETS.find(c => c.id === presetId) || CLUB_PRESETS[1];
      this.started = true;
      this.tab = "office";
      this.season = 1;
      this.week = 1;
      this.clubName = pr.name;
      this.tactic = "balanced";
      this.cash = pr.cash;
      this.ovr = pr.ovr;
      this.pts = 0; this.wins = 0; this.draws = 0; this.losses = 0; this.form = [];
      this.money = pr.m; this.fans = pr.f; this.squad = pr.s; this.board = pr.b;
      this.stadiumLvl = 1; this.academyLvl = 1; this.medLvl = 1; this.mktLvl = 1;
      this.signedIds = [];
      this.gameOver = false;
      this.overReason = "";
      this.lastMatchText = `Vitaj na lavičke ${pr.name}! Prvé rozhodnutie spustí 1. kolo ligy.`;
      this.refillDeck();
      this.nextDilemma();
      this.refreshMarket(true);
      this.render();
    },

    refillDeck() {
      this.deck = shuffle(MANAGER_DILEMMAS_45.map((_, idx) => idx));
    },

    nextDilemma() {
      if (!this.deck.length) this.refillDeck();
      const idx = this.deck.pop();
      this.currDilemma = MANAGER_DILEMMAS_45[idx];
    },

    refreshMarket(free = false) {
      if (!free) {
        if (this.cash < 5) {
          if (typeof window.toast === "function") window.toast("💶", "Málo financií", "Nový skauting stojí 5M €.");
          return;
        }
        this.cash -= 5;
        sClick();
      }
      const pool = shuffle(getPlayers().filter(p => !this.signedIds.includes(p.id)));
      this.market = pool.slice(0, 4).map(p => {
        const price = Math.max(8, Math.round((p.peakVal || (p.ovr - 65) * 3) * 0.55));
        return { id: p.id, name: p.name, nat: p.nat, pos: p.pos, ovr: p.ovr || 84, price };
      });
      if (!free) this.render();
    },

    buyPlayer(id) {
      const item = this.market.find(m => m.id === id);
      if (!item) return;
      if (this.cash < item.price) {
        sMiss();
        if (typeof window.toast === "function") window.toast("💶", "Nedostatok rozpočtu", `Potrebuješ ${item.price}M € (máš ${this.cash}M €).`);
        return;
      }
      this.cash -= item.price;
      this.signedIds.push(item.id);
      const ovrGain = item.ovr >= 91 ? 3 : item.ovr >= 86 ? 2 : 1;
      this.ovr = Math.min(99, this.ovr + ovrGain);
      this.fans = Math.min(100, this.fans + 8);
      this.squad = Math.min(100, this.squad + 4);
      this.market = this.market.filter(m => m.id !== id);
      sGoal();
      if (typeof window.toast === "function") window.toast("✍️ POSILA PODPÍSANÁ!", `${item.name} (${item.ovr} OVR)`, `Sila tímu +${ovrGain} OVR!`);
      this.render();
    },

    sellReserve() {
      if (this.ovr <= 68) {
        if (typeof window.toast === "function") window.toast("⚠️", "Slabý káder", "Už nemôžeš predávať ďalších hráčov.");
        return;
      }
      this.cash += 14;
      this.ovr -= 1;
      this.money = Math.min(100, this.money + 8);
      this.fans = Math.max(5, this.fans - 5);
      sClick();
      if (typeof window.toast === "function") window.toast("💰 Predaj hráča", "Získal si +14M € do rozpočtu (-1 OVR).");
      this.render();
    },

    upgradeFacility(kind) {
      const map = {
        stadium: { key: "stadiumLvl", name: "Štadión", base: 14 },
        academy: { key: "academyLvl", name: "Akadémia", base: 12 },
        med:     { key: "medLvl",     name: "Zdravotné centrum", base: 10 },
        mkt:     { key: "mktLvl",     name: "Marketing", base: 10 }
      };
      const cfg = map[kind];
      const cur = this[cfg.key];
      if (cur >= 5) return;
      const cost = cfg.base * cur;
      if (this.cash < cost) {
        sMiss();
        if (typeof window.toast === "function") window.toast("💶", "Málo financií", `Vylepšenie stojí ${cost}M €.`);
        return;
      }
      this.cash -= cost;
      this[cfg.key] = cur + 1;
      this.board = Math.min(100, this.board + 6);
      if (kind === "academy") this.ovr = Math.min(99, this.ovr + 1);
      if (kind === "med") this.squad = Math.min(100, this.squad + 8);
      if (kind === "mkt") this.fans = Math.min(100, this.fans + 8);
      sGoal();
      if (typeof window.toast === "function") window.toast("🏗️ Vylepšené!", `${cfg.name} je teraz na úrovni ${cur + 1}/5.`);
      this.render();
    },

    setTactic(t) { sClick(); this.tactic = t; this.render(); },
    setTab(t) { sClick(); this.tab = t; this.render(); },

    isUnlockedFull() {
      const st = getSavedState();
      return !!(st.isVip || st.dlcPresident || document.body.classList.contains("is-vip"));
    },

    estimatedRank() {
      const maxPts = Math.max(1, (this.week - 1) * 3);
      const ratio = this.pts / maxPts;
      return Math.max(1, Math.min(20, Math.round(20 - ratio * 19)));
    },

    decide(yes) {
      if (this.gameOver || !this.currDilemma) return;
      if (this.week > 8 && !this.isUnlockedFull()) return;

      const eff = yes ? this.currDilemma.yes : this.currDilemma.no;
      this.money = Math.max(0, Math.min(100, this.money + (eff.m || 0)));
      this.fans  = Math.max(0, Math.min(100, this.fans + (eff.f || 0)));
      this.squad = Math.max(0, Math.min(100, this.squad + (eff.s || 0) + (this.medLvl > 1 ? 1 : 0)));
      this.board = Math.max(0, Math.min(100, this.board + (eff.b || 0)));
      this.cash  = Math.max(0, this.cash + (eff.cash || 0));
      if (eff.ovr) this.ovr = Math.max(65, Math.min(99, this.ovr + eff.ovr));

      // Simulácia ligového zápasu kola
      const opp = OPPONENTS[Math.floor(Math.random() * OPPONENTS.length)];
      const oppOvr = 72 + Math.floor(Math.random() * 17);
      const moraleBonus = (this.squad - 50) * 0.12;
      const powerDiff = (this.ovr + moraleBonus) - oppOvr;

      let gFor = 0, gAg = 0;
      if (this.tactic === "attack") {
        gFor = Math.max(0, Math.round(1.6 + powerDiff * 0.08 + (Math.random() * 2.4 - 0.8)));
        gAg  = Math.max(0, Math.round(1.3 - powerDiff * 0.05 + (Math.random() * 2.2 - 0.7)));
      } else if (this.tactic === "defense") {
        gFor = Math.max(0, Math.round(0.9 + powerDiff * 0.06 + (Math.random() * 1.5 - 0.5)));
        gAg  = Math.max(0, Math.round(0.6 - powerDiff * 0.06 + (Math.random() * 1.3 - 0.4)));
      } else {
        gFor = Math.max(0, Math.round(1.25 + powerDiff * 0.07 + (Math.random() * 1.9 - 0.6)));
        gAg  = Math.max(0, Math.round(1.0 - powerDiff * 0.06 + (Math.random() * 1.7 - 0.6)));
      }

      let outcome = "D";
      if (gFor > gAg) {
        outcome = "W"; this.wins++; this.pts += 3;
        this.fans = Math.min(100, this.fans + 3);
        this.board = Math.min(100, this.board + 2);
      } else if (gFor < gAg) {
        outcome = "L"; this.losses++;
        this.fans = Math.max(0, this.fans - 3);
        this.board = Math.max(0, this.board - 2);
      } else {
        this.draws++; this.pts += 1;
      }
      this.form.push(outcome);
      if (this.form.length > 5) this.form.shift();

      // Týždenný príjem zo štadióna & marketingu + šanca na talent z akadémie
      const weeklyCash = 2 + this.stadiumLvl * 2 + this.mktLvl;
      this.cash += weeklyCash;
      let extraNote = `+${weeklyCash}M € z tržieb`;
      if (Math.random() < this.academyLvl * 0.04) {
        this.ovr = Math.min(99, this.ovr + 1);
        extraNote += " • 🌟 Akadémia vychovala talent (+1 OVR)!";
      }

      this.lastMatchText = `Kolo ${this.week}: ${this.clubName} ${gFor}:${gAg} ${opp} (${outcome === "W" ? "✅ Výhra +3b" : outcome === "D" ? "⚖️ Remíza +1b" : "❌ Prehra"}) • ${extraNote}`;

      // Kontrola vyhadzovu
      if (this.money <= 0 || this.fans <= 0 || this.squad <= 0 || this.board <= 0) {
        this.gameOver = true;
        this.overReason = this.money <= 0 ? "Klub skrachoval (Financie 0 %)!"
          : this.fans <= 0 ? "Fanúšikovia bojkotujú štadión (0 %)!"
          : this.squad <= 0 ? "Vzbura v kabíne (0 %)!"
          : "Predstavenstvo ťa odvolalo (Dôvera 0 %)!";
        sMiss();
        this.render();
        return;
      }

      if (typeof window.addReward === "function") window.addReward(outcome === "W" ? 35 : 20, 30);
      if (outcome === "W") sGoal(); else sClick();

      // Koniec 38-kolovej sezóny
      if (this.week >= 38) {
        const rank = this.estimatedRank();
        const bonusCoins = rank === 1 ? 500 : rank <= 4 ? 280 : 120;
        const bonusGems = rank === 1 ? 30 : rank <= 4 ? 12 : 4;
        if (typeof window.addReward === "function") window.addReward(bonusCoins, 250, bonusGems);
        if (window.GM_EASTER) window.GM_EASTER.spawnConfetti(50);
        this.season++;
        this.week = 1;
        this.pts = 0; this.wins = 0; this.draws = 0; this.losses = 0; this.form = [];
        this.cash += rank === 1 ? 45 : 25;
        if (typeof window.toast === "function") {
          window.toast("🏆 KONIEC SEZÓNY!", `Skončil si na ${rank}. mieste!`, `Odmena: +${bonusCoins} 🪙 & +${bonusGems} 💎 • Začína Sezóna ${this.season}!`);
        }
      } else {
        this.week++;
        if (this.week % 4 === 0) this.refreshMarket(true);
      }

      this.nextDilemma();
      this.render();
    },

    renderClubSelect() {
      const host = document.getElementById("gmActionMount");
      if (!host) return;
      host.innerHTML = `
        <div class="panel">
          <h3 style="color:var(--gold); margin-bottom:4px;">👔 Manažér & Prezident Klubu 2.0</h3>
          <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:14px;">
            Vyber si klub! Čaká ťa 38-kolová liga, 45 unikátnych dilem bez opakovania, reálny prestupový trh, taktiky a vylepšovanie štadióna.
          </p>
          ${CLUB_PRESETS.map(c => `
            <button class="gm-club-card" onclick="window.GM_GAMES.manager.pickClub('${c.id}')">
              <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
                <strong style="font-size:1rem;">${c.name}</strong>
                <span class="pill" style="color:var(--gold);">⭐ ${c.ovr} OVR • 💶 ${c.cash}M €</span>
              </div>
              <div style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">${c.desc}</div>
            </button>
          `).join("")}
        </div>
      `;
    },

    render() {
      const host = document.getElementById("gmActionMount");
      if (!host) return;
      const lockedPaywall = this.week > 8 && !this.isUnlockedFull();
      const meterBar = (lbl, val) => `
        <div class="meter">
          <div class="meter-lbl">${lbl}</div>
          <div class="bar-bg"><div class="bar-fill" style="width:${val}%; background:${val <= 20 ? "var(--red)" : val >= 80 ? "var(--gold)" : "var(--accent)"};"></div></div>
          <strong>${val}%</strong>
        </div>`;

      let tabBody = "";
      if (this.gameOver) {
        tabBody = `
          <div style="text-align:center; padding:12px 0;">
            <div style="font-size:2.4rem;">📰❌</div>
            <h3 style="color:#fca5a5; margin:6px 0;">VYHADZOV!</h3>
            <p style="font-size:0.86rem; color:var(--text-muted); margin-bottom:14px;">${this.overReason} Vydržal si do ${this.week}. kola (Sezóna ${this.season}).</p>
            <button class="btn btn-gold" onclick="window.GM_GAMES.manager.start()">🔄 Vybrať nový klub</button>
          </div>`;
      } else if (lockedPaywall) {
        tabBody = `
          <div style="text-align:center; padding:14px 0;">
            <div style="font-size:2.2rem;">👑</div>
            <h3 style="color:var(--gold); margin:6px 0;">Koniec 8-týždňovej skúšobnej verzie</h3>
            <p style="font-size:0.84rem; color:var(--text-muted); margin-bottom:14px;">
              Zvládol si 8 kôl! Pre pokračovanie v celej 38-kolovej sezóne si aktivuj <strong>VIP</strong> alebo <strong>Prezident PRO</strong> v Obchode (v Demo režime zdarma na otestovanie).
            </p>
            <button class="btn btn-gold" onclick="window.openTab('shop')">👑 Odomknúť v Obchode</button>
          </div>`;
      } else if (this.tab === "office") {
        tabBody = `
          <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:10px; padding:9px 11px; font-size:0.78rem; margin-bottom:12px;">
            🏟️ <strong>Posledný zápas:</strong> ${this.lastMatchText}
          </div>
          <div style="display:flex; gap:6px; justify-content:center; margin-bottom:12px; flex-wrap:wrap;">
            <button class="chip ${this.tactic === "attack" ? "active" : ""}" onclick="window.GM_GAMES.manager.setTactic('attack')">⚔️ Útok</button>
            <button class="chip ${this.tactic === "balanced" ? "active" : ""}" onclick="window.GM_GAMES.manager.setTactic('balanced')">⚖️ Balans</button>
            <button class="chip ${this.tactic === "defense" ? "active" : ""}" onclick="window.GM_GAMES.manager.setTactic('defense')">🛡️ Betón</button>
          </div>
          <div style="text-align:center; padding:8px 0;">
            <span class="badge gold" style="position:static; display:inline-block; margin-bottom:8px;">${this.currDilemma.role}</span>
            <div class="q-text" style="font-size:1.02rem; margin-bottom:14px;">${this.currDilemma.text}</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
              <button class="btn btn-danger" style="padding:12px;" onclick="window.GM_GAMES.manager.decide(false)">❌ NIE</button>
              <button class="btn btn-success" style="padding:12px;" onclick="window.GM_GAMES.manager.decide(true)">✅ ÁNO</button>
            </div>
          </div>`;
      } else if (this.tab === "transfers") {
        tabBody = `
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
            <strong style="font-size:0.9rem;">🛒 Dostupné posily (Rozpočet: ${this.cash}M €)</strong>
            <div style="display:flex; gap:6px;">
              <button class="btn btn-ghost" style="padding:6px 10px; font-size:0.75rem;" onclick="window.GM_GAMES.manager.refreshMarket(false)">🔄 Skauting (5M €)</button>
              <button class="btn btn-danger" style="padding:6px 10px; font-size:0.75rem;" onclick="window.GM_GAMES.manager.sellReserve()">💰 Predať hráča (+14M €)</button>
            </div>
          </div>
          <div style="display:grid; gap:8px;">
            ${this.market.length ? this.market.map(p => `
              <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:11px; padding:10px 12px; display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">
                <div>
                  <strong>${p.name}</strong> <span style="font-size:0.75rem; color:var(--gold);">(${p.ovr} OVR • ${p.pos})</span>
                  <div style="font-size:0.74rem; color:var(--text-muted);">${p.nat}</div>
                </div>
                <button class="btn btn-primary" style="padding:7px 12px; font-size:0.78rem;" onclick="window.GM_GAMES.manager.buyPlayer('${p.id}')">Kúpiť • ${p.price}M €</button>
              </div>
            `).join("") : `<p style="font-size:0.82rem; color:var(--text-muted);">Kúpil si všetkých hráčov z tejto ponuky! Klikni na Skauting pre nových.</p>`}
          </div>`;
      } else {
        const facRow = (kind, icon, title, lvl, base, desc) => `
          <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:11px; padding:10px 12px; display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">
            <div>
              <strong>${icon} ${title} (Úroveň ${lvl}/5)</strong>
              <div style="font-size:0.74rem; color:var(--text-muted);">${desc}</div>
            </div>
            ${lvl >= 5 ? `<span class="pill" style="color:var(--accent);">MAX</span>`
              : `<button class="btn btn-gold" style="padding:7px 12px; font-size:0.78rem;" onclick="window.GM_GAMES.manager.upgradeFacility('${kind}')">Vylepšiť • ${base * lvl}M €</button>`}
          </div>`;
        tabBody = `
          <div style="display:grid; gap:8px;">
            ${facRow("stadium", "🏟️", "Štadión", this.stadiumLvl, 14, "+2M € príjem zo vstupeniek každý týždeň")}
            ${facRow("academy", "🎓", "Akadémia", this.academyLvl, 12, "+1 OVR ihneď + vyššia šanca na mladý supertalent")}
            ${facRow("med", "🏥", "Zdravotné centrum", this.medLvl, 10, "Lepšia regenerácia a spokojnejšia kabína")}
            ${facRow("mkt", "📺", "Marketing & Sponzori", this.mktLvl, 10, "Vyšší príjem a podpora fanúšikov")}
          </div>`;
      }

      host.innerHTML = `
        <div class="panel">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:10px;">
            <strong>${this.clubName} • Sezóna ${this.season}</strong>
            <span class="pill">Kolo ${this.week}/38 • Forma: ${this.form.length ? this.form.map(x => x==="W"?"🟢":x==="D"?"🟡":"🔴").join("") : "—"}</span>
          </div>

          <div class="gm-mgr-kpi">
            <div class="gm-kpi-box"><small>💶 Rozpočet</small><strong style="color:var(--gold);">${this.cash}M €</strong></div>
            <div class="gm-kpi-box"><small>⭐ Sila tímu</small><strong style="color:var(--accent);">${this.ovr} OVR</strong></div>
            <div class="gm-kpi-box"><small>📊 Tabuľka</small><strong style="color:var(--gem);">${this.estimatedRank()}. miesto</strong></div>
            <div class="gm-kpi-box"><small>🏆 Body (V-R-P)</small><strong>${this.pts}b (${this.wins}-${this.draws}-${this.losses})</strong></div>
          </div>

          <div class="meters">
            ${meterBar("💰 Financie", this.money)}
            ${meterBar("📣 Fanúšikovia", this.fans)}
            ${meterBar("⚽ Kabína", this.squad)}
            ${meterBar("👔 Vedenie", this.board)}
          </div>

          <div class="gm-mgr-tabs">
            <button class="gm-mgr-tab ${this.tab === "office" ? "active" : ""}" onclick="window.GM_GAMES.manager.setTab('office')">📋 Kancelária</button>
            <button class="gm-mgr-tab ${this.tab === "transfers" ? "active" : ""}" onclick="window.GM_GAMES.manager.setTab('transfers')">🛒 Prestupy</button>
            <button class="gm-mgr-tab ${this.tab === "club" ? "active" : ""}" onclick="window.GM_GAMES.manager.setTab('club')">🏟️ Štadión</button>
          </div>

          ${tabBody}
        </div>
      `;
    }
  };

  // ===========================================================================
  // 4. CHÝBAJÚCA JEDENÁSTKA (MISSING XI) – ZACHOVANÉ A FUNKČNÉ
  // ===========================================================================
  const missingXI = {
    xiIndex: 0,
    selectedSlot: null,
    foundSet: new Set(),
    onWin: null,

    start(onWin) {
      this.onWin = onWin;
      this.xiIndex = 0;
      this.loadSquad(0);
    },

    loadSquad(idx) {
      const list = getHistoricXI();
      if (!list.length) return;
      this.xiIndex = ((idx % list.length) + list.length) % list.length;
      this.foundSet = new Set();
      this.selectedSlot = null;
      this.render();
    },

    pickSlot(key) {
      this.selectedSlot = key;
      this.render();
      const inp = document.getElementById("gmXiInput");
      if (inp) inp.focus();
    },

    submitName() {
      const list = getHistoricXI();
      const sq = list[this.xiIndex];
      const inp = document.getElementById("gmXiInput");
      const fb = document.getElementById("gmXiFb");
      if (!sq || !inp) return;
      const g = norm(inp.value);
      if (!g) return;

      let matched = null;
      sq.rows.forEach((row, rIdx) => {
        row.forEach((slot, sIdx) => {
          const key = `${rIdx}_${sIdx}`;
          if (this.foundSet.has(key)) return;
          const full = norm(slot.name);
          const last = norm(slot.name.split(" ").pop());
          if (g === full || (g.length >= 3 && (full.includes(g) || last === g))) matched = { key, slot };
        });
      });

      if (matched) {
        sGoal();
        this.foundSet.add(matched.key);
        inp.value = "";
        if (this.foundSet.size === 11 && typeof this.onWin === "function") this.onWin(sq.title);
        this.render();
        const fb2 = document.getElementById("gmXiFb");
        if (fb2) { fb2.className = "feedback show ok"; fb2.textContent = `✅ #${matched.slot.num} ${matched.slot.name} doplnený!`; }
      } else {
        sMiss();
        if (fb) { fb.className = "feedback show err"; fb.textContent = "❌ Toto meno v zostave nie je (alebo už bolo doplnené)."; }
      }
    },

    revealOne() {
      const list = getHistoricXI();
      const sq = list[this.xiIndex];
      if (!sq) return;
      for (let rIdx = 0; rIdx < sq.rows.length; rIdx++) {
        for (let sIdx = 0; sIdx < sq.rows[rIdx].length; sIdx++) {
          const key = `${rIdx}_${sIdx}`;
          if (!this.foundSet.has(key)) { this.foundSet.add(key); sClick(); this.render(); return; }
        }
      }
    },

    render() {
      const host = document.getElementById("gmActionMount");
      const list = getHistoricXI();
      if (!host || !list.length) return;
      const sq = list[this.xiIndex];

      const pitchRowsHtml = sq.rows.map((row, rIdx) => {
        const slotsHtml = row.map((slot, sIdx) => {
          const key = `${rIdx}_${sIdx}`;
          const open = this.foundSet.has(key);
          const sel = this.selectedSlot === key;
          return `
            <button onclick="window.GM_GAMES.missingXI.pickSlot('${key}')" style="background:${open ? "rgba(16,185,129,0.28)" : sel ? "rgba(245,185,66,0.28)" : "rgba(10,20,14,0.78)"}; border:1.5px solid ${open ? "var(--accent)" : sel ? "var(--gold)" : "rgba(255,255,255,0.25)"}; color:#fff; border-radius:10px; padding:6px 8px; min-width:84px; cursor:pointer; text-align:center;">
              <div style="font-size:0.7rem; font-weight:800; color:var(--gold);">#${slot.num} • ${slot.pos} ${slot.flag}</div>
              <div style="font-size:0.76rem; font-weight:900; margin-top:2px;">${open ? slot.name : "???"}</div>
            </button>`;
        }).join("");
        return `<div style="display:flex; justify-content:center; gap:8px; flex-wrap:wrap; margin:8px 0;">${slotsHtml}</div>`;
      }).join("");

      host.innerHTML = `
        <div class="panel">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:8px;">
            <div>
              <strong>🏟️ Chýbajúca XI: ${sq.title}</strong>
              <div style="font-size:0.76rem; color:var(--text-muted);">Rozostavenie ${sq.formation} • Doplnené: <strong>${this.foundSet.size}/11</strong></div>
            </div>
            <div style="display:flex; gap:6px;">
              <button class="btn btn-ghost" style="padding:5px 10px; font-size:0.76rem;" onclick="window.GM_GAMES.missingXI.loadSquad(window.GM_GAMES.missingXI.xiIndex - 1)">◀</button>
              <button class="btn btn-ghost" style="padding:5px 10px; font-size:0.76rem;" onclick="window.GM_GAMES.missingXI.loadSquad(window.GM_GAMES.missingXI.xiIndex + 1)">▶</button>
            </div>
          </div>
          <div style="background:repeating-linear-gradient(180deg, rgba(16,185,129,0.16) 0px, rgba(16,185,129,0.16) 44px, rgba(10,35,20,0.35) 44px, rgba(10,35,20,0.35) 88px); border:2px solid rgba(255,255,255,0.22); border-radius:14px; padding:12px 6px; margin:10px 0;">
            ${pitchRowsHtml}
          </div>
          <div class="input-row">
            <input type="text" id="gmXiInput" class="text-input" placeholder="Napíš meno hráča zo zostavy..." onkeydown="if(event.key==='Enter') window.GM_GAMES.missingXI.submitName()" />
            <button class="btn btn-primary" onclick="window.GM_GAMES.missingXI.submitName()">Doplniť</button>
            <button class="btn btn-ghost" onclick="window.GM_GAMES.missingXI.revealOne()">💡 1 meno</button>
          </div>
          <div class="feedback" id="gmXiFb"></div>
        </div>
      `;
    }
  };

  // Automaticky presmeruje kliknutie na "Prezident Klubu" v index.html rovno na Manažéra 2.0
  function hookManagerIntoApp() {
    window.startPresident = function () {
      sClick();
      if (typeof window.showView === "function") window.showView("action");
      const pill = document.getElementById("actionTitlePill");
      if (pill) pill.textContent = "👔 Manažér & Prezident 2.0";
      manager.start();
    };
  }
  window.addEventListener("DOMContentLoaded", hookManagerIntoApp);
  window.addEventListener("load", hookManagerIntoApp);

  return { penalty, grid3x3, missingXI, manager };
})();
