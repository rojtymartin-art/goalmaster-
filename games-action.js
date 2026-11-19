// =============================================================================
// GOALMASTER PRO – AKČNÉ A TAKTICKÉ REŽIMY (games-action.js)
// 1. Penalty (streľba + chytanie + let lopty)
// 2. Futbalová mriežka 3x3
// 3. Chýbajúca jedenástka (Missing XI)
// 4. Vyjednávací stôl (Deal Table)
// =============================================================================

window.GM_GAMES = (function () {
  function norm(s) {
    return String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function getPlayers() {
    return Array.isArray(window.GM_PLAYERS) ? window.GM_PLAYERS : [];
  }

  function getHistoricXI() {
    if (window.GM_DATA && Array.isArray(window.GM_DATA.HISTORIC_XI)) {
      return window.GM_DATA.HISTORIC_XI;
    }
    return [];
  }

  // ---------------------------------------------------------------------------
  // 1. PENALTOVÝ ROZSTREL (STREĽBA + CHYTANIE + ANIMÁCIA LOPTY)
  // ---------------------------------------------------------------------------
  const penalty = {
    zone: 0,
    diveZone: 0,
    pos: 0,
    dir: 2.1,
    rafId: null,
    you: 0,
    ai: 0,
    round: 1,
    locked: false,
    onFinish: null,

    start(onFinish) {
      this.stop();
      this.onFinish = onFinish;
      this.zone = 0;
      this.diveZone = 0;
      this.pos = 8;
      this.dir = 2.1;
      this.you = 0;
      this.ai = 0;
      this.round = 1;
      this.locked = false;
      this.renderArena();
      this.loop();
    },

    stop() {
      if (this.rafId) cancelAnimationFrame(this.rafId);
      this.rafId = null;
    },

    selectZone(z) {
      if (this.locked) return;
      this.zone = z;
      document.querySelectorAll(".gm-pen-zone").forEach((el, idx) => {
        el.classList.toggle("selected", idx === z);
      });
    },

    selectDive(z) {
      this.diveZone = z;
      document.querySelectorAll(".gm-dive-btn").forEach((el, idx) => {
        el.classList.toggle("selected", idx === z);
      });
    },

    renderArena() {
      const host = document.getElementById("gmActionMount");
      if (!host) return;

      const zones = [
        "↖️ Ľavý vinkel", "⬆️ Hore stred", "↗️ Pravý vinkel",
        "↙️ Ľavo dole",  "🎯 Stred",     "↘️ Pravo dole"
      ];

      host.innerHTML = `
        <div class="panel">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
            <strong>🥅 Penaltový rozstrel (Kop + Chytanie)</strong>
            <span class="pill">Skóre: <strong id="gmPenScore">Ty 0 : 0 AI</strong> • Kolo <strong id="gmPenRound">1</strong></span>
          </div>
          <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:10px;">
            1. Vyber cieľ strely • 2. Nastav smer skoku brankára • 3. Zastav kurzor v <strong>ZELENEJ ZÓNE</strong> a vystreľ!
          </p>

          <div style="font-size:0.75rem; font-weight:800; color:var(--accent); margin-bottom:4px;">KAM KOPNEŠ TY:</div>
          <div class="goal-zones" style="position:relative; background:linear-gradient(180deg,#0b2416,#14532d); border:4px solid #e5e7eb; border-radius:12px; padding:12px;">
            ${zones.map((label, i) => `
              <button class="zone-btn gm-pen-zone ${i === this.zone ? "selected" : ""}" onclick="window.GM_GAMES.penalty.selectZone(${i})">${label}</button>
            `).join("")}
            <div id="gmPenBall" style="position:absolute; left:50%; bottom:6px; transform:translate(-50%,0); font-size:1.6rem; transition:all 0.35s cubic-bezier(0.22,1,0.36,1); z-index:5; pointer-events:none;">⚽</div>
          </div>

          <div style="margin-top:10px;">
            <div style="font-size:0.75rem; font-weight:800; color:var(--gem); margin-bottom:4px;">KAM SKOČÍ TVOJ BRANKÁR PRI STRELE SÚPERA:</div>
            <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:6px;">
              ${zones.map((label, i) => `
                <button class="chip gm-dive-btn ${i === this.diveZone ? "active" : ""}" style="text-align:center;" onclick="window.GM_GAMES.penalty.selectDive(${i})">${label}</button>
              `).join("")}
            </div>
          </div>

          <div class="timing-track" style="margin-top:12px;">
            <div class="timing-green" style="left:35%; width:30%;"></div>
            <div class="timing-cursor" id="gmPenCursor"></div>
          </div>

          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button class="btn btn-gold" id="gmPenShoot" style="flex:1; padding:12px;" onclick="window.GM_GAMES.penalty.shoot()">⚽ VYSTRELIŤ & CHYTAŤ</button>
            <button class="btn btn-primary" id="gmPenAgain" style="display:none; flex:1; padding:12px;" onclick="window.GM_GAMES.penalty.start(window.GM_GAMES.penalty.onFinish)">🔄 Nový rozstrel</button>
          </div>

          <div class="feedback" id="gmPenFb"></div>
        </div>
      `;
    },

    loop() {
      this.pos += this.dir;
      if (this.pos >= 95 || this.pos <= 0) this.dir *= -1;
      const cur = document.getElementById("gmPenCursor");
      if (cur) cur.style.left = this.pos + "%";
      this.rafId = requestAnimationFrame(() => this.loop());
    },

    shoot() {
      if (this.locked) return;
      this.locked = true;
      this.stop();

      const coords = [
        { x: "18%", y: "22%" }, { x: "50%", y: "22%" }, { x: "82%", y: "22%" },
        { x: "18%", y: "66%" }, { x: "50%", y: "66%" }, { x: "82%", y: "66%" }
      ];
      const ball = document.getElementById("gmPenBall");
      const target = coords[this.zone] || coords[0];

      const inGreen = this.pos >= 35 && this.pos <= 65;
      const keeperGuess = Math.floor(Math.random() * 6);
      const wideMiss = !inGreen && Math.random() < 0.35;

      if (ball) {
        if (wideMiss) {
          ball.style.left = "96%";
          ball.style.top = "8%";
        } else {
          ball.style.left = target.x;
          ball.style.top = target.y;
        }
      }

      let yourGoal = false;
      let log = "";
      if (wideMiss) {
        log = "❌ Prestrelil si bránku! ";
      } else if (!inGreen && keeperGuess === this.zone) {
        log = "🧤 Slabá strela mimo zelenú zónu, brankár ju chytil! ";
      } else if (keeperGuess === this.zone && inGreen) {
        // Tvrdá strela v zelenej zóne má 35% šancu prestreliť aj brankára
        if (Math.random() < 0.35) {
          yourGoal = true;
          log = "🔥 Nechytateľná bomba do šibenice napriek odhadu brankára! ";
        } else {
          log = "🧤 Brankár vystihol smer a vyrazil! ";
        }
      } else {
        yourGoal = true;
        log = "⚽ GÓÓÓL! Presná strela do siete! ";
      }
      if (yourGoal) this.you++;

      // Súperov kop a tvoj brankár
      const aiZone = Math.floor(Math.random() * 6);
      let aiGoal = true;
      if (aiZone === this.diveZone) {
        aiGoal = false;
        log += "🦸 TVOJ BRANKÁR CHYTIL PENALTU SÚPERA!";
      } else {
        this.ai++;
        log += "Súper premenil.";
      }

      const scEl = document.getElementById("gmPenScore");
      if (scEl) scEl.textContent = `Ty ${this.you} : ${this.ai} AI`;

      const fb = document.getElementById("gmPenFb");
      if (fb) {
        fb.className = `feedback show ${yourGoal ? "ok" : "err"}`;
        fb.textContent = log;
      }

      const finished = this.round >= 5 && this.you !== this.ai;
      if (finished) {
        const won = this.you > this.ai;
        const shootBtn = document.getElementById("gmPenShoot");
        const againBtn = document.getElementById("gmPenAgain");
        if (shootBtn) shootBtn.style.display = "none";
        if (againBtn) againBtn.style.display = "inline-flex";
        if (typeof this.onFinish === "function") this.onFinish(won, this.you, this.ai);
      } else {
        this.round++;
        const rEl = document.getElementById("gmPenRound");
        if (rEl) rEl.textContent = this.round;
        setTimeout(() => {
          const b = document.getElementById("gmPenBall");
          if (b) { b.style.left = "50%"; b.style.top = "auto"; b.style.bottom = "6px"; }
          this.locked = false;
          this.pos = 5;
          this.dir = Math.min(3.6, Math.abs(this.dir) + 0.18) * (Math.random() < 0.5 ? 1 : -1);
          this.loop();
        }, 1250);
      }
    }
  };

  // ---------------------------------------------------------------------------
  // 2. FUTBALOVÁ MRIEŽKA 3x3 (KRAJINY × KLUBY)
  // ---------------------------------------------------------------------------
  const grid3x3 = {
    data: null,
    solvedCells: {},
    selectedIdx: 0,
    onCellWin: null,

    start(onCellWin) {
      this.onCellWin = onCellWin;
      this.solvedCells = {};
      this.selectedIdx = 0;
      this.data = window.GM_ENGINE && typeof window.GM_ENGINE.generateGrid3x3 === "function"
        ? window.GM_ENGINE.generateGrid3x3()
        : null;
      this.render();
    },

    selectCell(idx) {
      this.selectedIdx = idx;
      this.render();
    },

    submitGuess() {
      if (!this.data) return;
      const input = document.getElementById("gmGridInput");
      const fb = document.getElementById("gmGridFb");
      if (!input) return;

      const guessNorm = norm(input.value);
      if (!guessNorm) return;

      const cell = this.data.cells[this.selectedIdx];
      const allPlayers = getPlayers();

      const matchedPlayer = allPlayers.find(p => {
        const n = norm(p.name);
        const last = norm(p.name.split(" ").pop());
        return n === guessNorm || (guessNorm.length >= 4 && (n.includes(guessNorm) || last === guessNorm));
      });

      const validNamesNorm = cell.matches.map(norm);
      if (matchedPlayer && (validNamesNorm.includes(norm(matchedPlayer.name)) || (matchedPlayer.country === cell.row && (matchedPlayer.clubs || []).includes(cell.col)))) {
        if (!this.solvedCells[this.selectedIdx]) {
          this.solvedCells[this.selectedIdx] = matchedPlayer.name;
          input.value = "";
          if (fb) {
            fb.className = "feedback show ok";
            fb.textContent = `✅ Správne! ${matchedPlayer.name} spĺňa ${cell.row} + ${cell.col}!`;
          }
          if (typeof this.onCellWin === "function") this.onCellWin(matchedPlayer.name, Object.keys(this.solvedCells).length === 9);
          this.render();
        }
      } else {
        if (fb) {
          fb.className = "feedback show err";
          fb.textContent = `❌ Tento hráč nesplnil kombináciu (${cell.row} + ${cell.col}). Skús iného!`;
        }
      }
    },

    render() {
      const host = document.getElementById("gmActionMount");
      if (!host) return;
      if (!this.data) {
        host.innerHTML = `<div class="panel"><p>Načítaj viac súborov hráčov na vygenerovanie mriežky 3×3.</p></div>`;
        return;
      }

      const { rows, cols, cells } = this.data;
      const activeCell = cells[this.selectedIdx];
      const countDone = Object.keys(this.solvedCells).length;

      let cellsHtml = "";
      for (let i = 0; i < 9; i++) {
        const isDone = !!this.solvedCells[i];
        const isSel = i === this.selectedIdx;
        cellsHtml += `
          <button class="opt-btn" style="text-align:center; min-height:68px; border-width:2px; border-color:${isDone ? "var(--accent)" : isSel ? "var(--gold)" : "var(--border)"}; background:${isDone ? "rgba(16,185,129,0.18)" : isSel ? "rgba(245,185,66,0.12)" : "var(--bg-card)"};" onclick="window.GM_GAMES.grid3x3.selectCell(${i})">
            <div style="font-size:0.68rem; color:var(--text-muted);">${cells[i].row} × ${cells[i].col}</div>
            <div style="font-size:0.84rem; font-weight:900; margin-top:3px; color:${isDone ? "#6ee7b7" : "var(--text)"};">
              ${isDone ? `✅ ${this.solvedCells[i]}` : "+ Vyplniť"}
            </div>
          </button>
        `;
      }

      host.innerHTML = `
        <div class="panel">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
            <strong>🧩 Futbalová mriežka 3×3</strong>
            <div style="display:flex; gap:6px; align-items:center;">
              <span class="pill">Splnené: <strong>${countDone}/9</strong></span>
              <button class="btn btn-ghost" style="padding:5px 10px; font-size:0.76rem;" onclick="window.GM_GAMES.grid3x3.start(window.GM_GAMES.grid3x3.onCellWin)">🔄 Nová mriežka</button>
            </div>
          </div>

          <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:6px;">
            Stĺpce (kluby): <strong>${cols.join(" • ")}</strong><br/>
            Riadky (krajiny): <strong>${rows.join(" • ")}</strong>
          </div>

          <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin:10px 0;">
            ${cellsHtml}
          </div>

          <div style="font-size:0.82rem; margin-bottom:8px; color:var(--gold);">
            Aktívne políčko: <strong>${activeCell.row}</strong> + <strong>${activeCell.col}</strong>
          </div>

          <div class="input-row">
            <input type="text" id="gmGridInput" class="text-input" placeholder="Napíš meno hráča..." onkeydown="if(event.key==='Enter') window.GM_GAMES.grid3x3.submitGuess()" />
            <button class="btn btn-primary" onclick="window.GM_GAMES.grid3x3.submitGuess()">Overiť</button>
          </div>
          <div class="feedback" id="gmGridFb"></div>
        </div>
      `;
    }
  };

  // ---------------------------------------------------------------------------
  // 3. CHÝBAJÚCA JEDENÁSTKA (HISTORIC XI)
  // ---------------------------------------------------------------------------
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
          if (g === full || (g.length >= 3 && (full.includes(g) || last === g))) {
            matched = { key, slot };
          }
        });
      });

      if (matched) {
        this.foundSet.add(matched.key);
        inp.value = "";
        if (fb) {
          fb.className = "feedback show ok";
          fb.textContent = `✅ #${matched.slot.num} ${matched.slot.name} (${matched.slot.pos}) doplnený!`;
        }
        if (this.foundSet.size === 11 && typeof this.onWin === "function") {
          this.onWin(sq.title);
        }
        this.render();
      } else if (fb) {
        fb.className = "feedback show err";
        fb.textContent = "❌ Toto meno v tejto zostave nie je (alebo už bolo doplnené).";
      }
    },

    revealOne() {
      const list = getHistoricXI();
      const sq = list[this.xiIndex];
      if (!sq) return;
      for (let rIdx = 0; rIdx < sq.rows.length; rIdx++) {
        for (let sIdx = 0; sIdx < sq.rows[rIdx].length; sIdx++) {
          const key = `${rIdx}_${sIdx}`;
          if (!this.foundSet.has(key)) {
            this.foundSet.add(key);
            this.render();
            return;
          }
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
            </button>
          `;
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

  return { penalty, grid3x3, missingXI };
})();
