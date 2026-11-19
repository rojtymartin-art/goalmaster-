// =============================================================================
// GOALMASTER PRO – TAJNÉ EASTER EGGY & BOSS REŽIM (easter-eggs.js)
// Tajné kódy, 7 exkluzívnych 99 OVR kariet, 10-klik Boss mód, mená legiend, VAR
// =============================================================================

window.GM_EASTER = (function () {
  // 7 exkluzívnych 99 OVR kariet (nedajú sa vytiahnuť z bežných balíčkov!)
  const SECRET_CARDS = {
    ramos9248:   { id: "ramos9248",   name: "Sergio Ramos",    nat: "🇪🇸 Španielsko", country: "Španielsko", pos: "CB",  club: "🔥 LISABON 92:48",   ovr: 99, r: "icon" },
    gerrard2005: { id: "gerrard2005", name: "Steven Gerrard",  nat: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Anglicko",   country: "Anglicko",   pos: "CM",  club: "⚡ ISTANBUL 2005",   ovr: 99, r: "icon" },
    panenka1976: { id: "panenka1976", name: "Antonín Panenka", nat: "🇨🇿 Česko",      country: "Česko",      pos: "CAM", club: "🏆 BELEHRAD 1976",   ovr: 99, r: "icon" },
    yashin1963:  { id: "yashin1963",  name: "Lev Jašin",       nat: "🇷🇺 Rusko",      country: "Rusko",      pos: "GK",  club: "🕷️ ČIERNY PAVÚK",   ovr: 99, r: "icon" },
    cruyff14:    { id: "cruyff14",    name: "Johan Cruyff",    nat: "🇳🇱 Holandsko",  country: "Holandsko",  pos: "CF",  club: "👑 TOTÁLNY FUTBAL",  ovr: 99, r: "icon" },
    aguero9320:  { id: "aguero9320",  name: "Sergio Agüero",   nat: "🇦🇷 Argentína",  country: "Argentína",  pos: "ST",  club: "⏱️ ETIHAD 93:20",    ovr: 99, r: "icon" },
    maradona86:  { id: "maradona86",  name: "Diego Maradona",  nat: "🇦🇷 Argentína",  country: "Argentína",  pos: "CAM", club: "✋ MEXIKO 1986",     ovr: 99, r: "icon" }
  };

  // Zoznam všetkých 10 tajomstiev (nápovedy pre Tajný denník bez prezradenia kódu)
  const SECRETS_META = [
    { id: "egg_9248",     title: "Hlavička v nadstavení", hint: "Čas legendárneho gólu z finále LM 2014 v Lisabone (XX:XX) zadaj v Obchode." },
    { id: "egg_istanbul", title: "Zázrak z 0:3",          hint: "Mesto najväčšieho obratu vo finále Ligy majstrov 2005 zadaj ako kód." },
    { id: "egg_panenka",  title: "Jemný dloubák",         hint: "Priezvisko majstra pokutových kopov z roku 1976 zadaj ako kód." },
    { id: "egg_yashin",   title: "Jediný brankár",        hint: "Priezvisko jediného brankára so Zlatou loptou (alebo SPIDER) zadaj v Obchode." },
    { id: "egg_cruyff",   title: "Číslo 14",              hint: "Holandský tvorca Totálneho futbalu (alebo jeho číslo dresu) v Obchode." },
    { id: "egg_9320",     title: "Titul v poslednej sekunde", hint: "Presný čas Agüerovho gólu proti QPR (XX:XX) zadaj ako kód." },
    { id: "egg_1986",     title: "Božia ruka",            hint: "Rok slávnych MS v Mexiku (alebo HANDOFGOD) zadaj v Obchode." },
    { id: "egg_siuuu",    title: "Ikonický výkrik",       hint: "Zadaj slávny gólový pokrik CR7 do poľa pre kódy." },
    { id: "egg_boss",     title: "Tajný Boss Režim",      hint: "Skús 10-krát rýchlo po sebe ťuknúť na futbalovú loptu v hornej lište..." },
    { id: "egg_manager",  title: "Špeciálne meno",        hint: "Pomenuj svojho manažéra v Profile po jednej z najväčších legiend (napr. Mourinho, Pelé, Ferguson)." }
  ];

  // Mapovanie tajných kódov na odmeny
  const CODE_MAP = {
    "92:48":     { eggId: "egg_9248",     card: "ramos9248",   coins: 150, gems: 10, msg: "🔥 92:48! Sergio Ramos 99 OVR pridaný do klubu!" },
    "9248":      { eggId: "egg_9248",     card: "ramos9248",   coins: 150, gems: 10, msg: "🔥 92:48! Sergio Ramos 99 OVR pridaný do klubu!" },
    "ISTANBUL":  { eggId: "egg_istanbul", card: "gerrard2005", coins: 200, gems: 15, msg: "⚡ ZÁZRAK V ISTANBULE! Steven Gerrard 99 OVR odomknutý!" },
    "2005":      { eggId: "egg_istanbul", card: "gerrard2005", coins: 200, gems: 15, msg: "⚡ ZÁZRAK V ISTANBULE! Steven Gerrard 99 OVR odomknutý!" },
    "PANENKA":   { eggId: "egg_panenka",  card: "panenka1976", coins: 150, gems: 10, msg: "🏆 BELEHRAD 1976! Antonín Panenka 99 OVR odomknutý!" },
    "1976":      { eggId: "egg_panenka",  card: "panenka1976", coins: 150, gems: 10, msg: "🏆 BELEHRAD 1976! Antonín Panenka 99 OVR odomknutý!" },
    "YASHIN":    { eggId: "egg_yashin",   card: "yashin1963",  coins: 150, gems: 10, msg: "🕷️ ČIERNY PAVÚK! Lev Jašin 99 OVR pridaný do brány!" },
    "SPIDER":    { eggId: "egg_yashin",   card: "yashin1963",  coins: 150, gems: 10, msg: "🕷️ ČIERNY PAVÚK! Lev Jašin 99 OVR pridaný do brány!" },
    "CRUYFF":    { eggId: "egg_cruyff",   card: "cruyff14",    coins: 150, gems: 10, msg: "👑 TOTÁLNY FUTBAL! Johan Cruyff 99 OVR odomknutý!" },
    "14":        { eggId: "egg_cruyff",   card: "cruyff14",    coins: 150, gems: 10, msg: "👑 TOTÁLNY FUTBAL! Johan Cruyff 99 OVR odomknutý!" },
    "93:20":     { eggId: "egg_9320",     card: "aguero9320",  coins: 150, gems: 10, msg: "⏱️ AGÜEROOOO! Karta 99 OVR (93:20) je tvoja!" },
    "AGUERO":    { eggId: "egg_9320",     card: "aguero9320",  coins: 150, gems: 10, msg: "⏱️ AGÜEROOOO! Karta 99 OVR (93:20) je tvoja!" },
    "1986":      { eggId: "egg_1986",     card: "maradona86",  coins: 200, gems: 15, msg: "✋ MEXIKO 1986! Diego Maradona 99 OVR odomknutý!" },
    "HANDOFGOD": { eggId: "egg_1986",     card: "maradona86",  coins: 200, gems: 15, msg: "✋ MEXIKO 1986! Diego Maradona 99 OVR odomknutý!" },
    "SIUUU":     { eggId: "egg_siuuu",    card: null,          coins: 100, gems: 50, msg: "🚀 SIUUUUU! Tajný pokrik prijatý: +50 💎 a +100 🪙!" }
  };

  // Legendárne mená manažérov
  const LEGEND_NAMES = {
    "mourinho":  "🗣️ 'I prefer really not to speak. If I speak, I am in big trouble.'",
    "ferguson":  "⏱️ 'Fergie Time aktivovaný! Zápas sa hrá, kým nedáš gól.'",
    "ancelotti": "🤨 *Zdvihnuté ľavé obočie* – 'Ďalšia Liga majstrov je na ceste.'",
    "guardiola": "🧠 'Tiki-taka režim! Držanie lopty 84 % zaručené.'",
    "pele":      "👑 'O Rei' vstúpil na štadión! Zlatá aura kariet aktivovaná.",
    "maradona":  "🇦🇷 'El Pibe de Oro' je späť na ihrisku!"
  };

  let logoClicks = 0;
  let lastClickTs = 0;
  let bossModeActive = false;
  let varOverlayOpen = false;
  let stylesInjected = false;

  // Vloží vlastné animácie (konfety, zlatý záblesk, Boss banner, VAR okno)
  function injectStyles() {
    if (stylesInjected) return;
    stylesInjected = true;
    const style = document.createElement("style");
    style.textContent = `
      .gm-confetti {
        position: fixed; top: -12px; width: 10px; height: 14px; border-radius: 3px;
        z-index: 9999; pointer-events: none; animation: gmFall 2.2s linear forwards;
      }
      @keyframes gmFall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
      }
      .gm-flash {
        position: fixed; inset: 0; background: radial-gradient(circle, rgba(245,185,66,0.45), transparent 70%);
        pointer-events: none; z-index: 9990; animation: gmFlashFade 0.9s ease-out forwards;
      }
      @keyframes gmFlashFade { from { opacity: 1; } to { opacity: 0; } }
      body.boss-mode header { border-bottom-color: #ef4444 !important; box-shadow: 0 0 20px rgba(239,68,68,0.45); }
      body.gold-aura .fut-card.icon { box-shadow: 0 0 22px rgba(245,185,66,0.75) !important; border-color: #fde047 !important; }
      .gm-var-backdrop {
        position: fixed; inset: 0; background: rgba(5, 8, 12, 0.88); backdrop-filter: blur(6px);
        z-index: 9500; display: flex; align-items: center; justify-content: center; padding: 16px;
      }
      .gm-var-box {
        background: #111827; border: 2px solid #ef4444; border-radius: 18px;
        max-width: 420px; width: 100%; padding: 20px; text-align: center;
        box-shadow: 0 0 35px rgba(239, 68, 68, 0.45);
      }
      .gm-var-arena {
        position: relative; height: 140px; margin: 14px 0; border-radius: 12px;
        background: repeating-linear-gradient(45deg, #0b1320, #0b1320 12px, #111d30 12px, #111d30 24px);
        border: 1px solid #374151; overflow: hidden;
      }
      .gm-whistle-btn {
        position: absolute; padding: 10px 14px; border-radius: 99px; border: 2px solid #fde047;
        background: linear-gradient(135deg, #10b981, #059669); color: #fff; font-weight: 900;
        font-size: 0.85rem; cursor: pointer; transition: top 0.25s ease, left 0.25s ease;
        box-shadow: 0 0 18px rgba(16, 185, 129, 0.7);
      }
    `;
    document.head.appendChild(style);
  }

  function spawnConfetti(count = 45) {
    injectStyles();
    const colors = ["#f5b942", "#10b981", "#38bdf8", "#ef4444", "#a855f7", "#ffffff"];
    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.className = "gm-confetti";
      el.style.left = Math.random() * 100 + "vw";
      el.style.background = colors[i % colors.length];
      el.style.animationDuration = (1.6 + Math.random() * 1.4) + "s";
      el.style.animationDelay = (Math.random() * 0.35) + "s";
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 3400);
    }
  }

  function flashScreen() {
    injectStyles();
    const fl = document.createElement("div");
    fl.className = "gm-flash";
    document.body.appendChild(fl);
    setTimeout(() => fl.remove(), 950);
  }

  function ensureEggState(state) {
    if (!Array.isArray(state.eggs)) state.eggs = [];
    if (typeof state.goldAura !== "boolean") state.goldAura = false;
  }

  function markEgg(state, eggId) {
    ensureEggState(state);
    if (!state.eggs.includes(eggId)) {
      state.eggs.push(eggId);
      return true;
    }
    return false;
  }

  // 1. Overenie tajného kódu v Obchode
  function tryCode(rawInput, api) {
    injectStyles();
    const code = String(rawInput || "").trim().toUpperCase();
    const entry = CODE_MAP[code];
    if (!entry) return { matched: false };

    const { state, save, toast, sfxVip } = api;
    ensureEggState(state);

    const isNew = markEgg(state, entry.eggId);
    if (!isNew) {
      toast("🥚", "Už objavené!", "Tento tajný kód si už predtým aktivoval.");
      return { matched: true, alreadyFound: true };
    }

    state.coins += entry.coins;
    state.gems += entry.gems;
    if (entry.card && SECRET_CARDS[entry.card]) {
      state.cards[entry.card] = (state.cards[entry.card] || 0) + 1;
    }

    flashScreen();
    spawnConfetti(55);
    if (sfxVip) sfxVip();
    toast("🥚 TAJNÝ EASTER EGG!", entry.msg, `+${entry.coins} 🪙 • +${entry.gems} 💎`);
    if (save) save();
    return { matched: true, alreadyFound: false };
  }

  // 2. Kliknutie na logo lopty (10× za sebou -> BOSS REŽIM)
  function onLogoClick(api) {
    injectStyles();
    const now = Date.now();
    if (now - lastClickTs > 3200) logoClicks = 0;
    lastClickTs = now;
    logoClicks++;

    const { state, save, toast, sfxVip, sfxClick } = api;
    ensureEggState(state);

    if (logoClicks === 5) toast("👀", "Hmm...", "Lopta v rohu sa začína podozrivo triasť...");
    if (logoClicks === 8) toast("🔥", "Už len 2 kliky!", "Niečo veľké sa chystá odomknúť...");
    if (logoClicks === 9) toast("💀", "Ešte jeden klik!", "Priprav sa na extrémnu výzvu...");

    if (logoClicks >= 10) {
      logoClicks = 0;
      bossModeActive = !bossModeActive;
      document.body.classList.toggle("boss-mode", bossModeActive);

      const firstTime = markEgg(state, "egg_boss");
      if (firstTime) {
        state.gems += 25;
        spawnConfetti(50);
      }

      if (bossModeActive) {
        flashScreen();
        if (sfxVip) sfxVip();
        toast("💀 BOSS REŽIM ZAPNUTÝ!", "V kvíze máš len 5 sekúnd na odpoveď, ale berieš 3× MINCE a XP!", firstTime ? "Bonus za objavenie: +25 💎" : "Klikni 10× na loptu pre vypnutie.");
      } else {
        if (sfxClick) sfxClick();
        toast("⚽", "Boss Režim vypnutý", "Vrátil si sa do klasickej rýchlosti hry.");
      }
      if (save) save();
    }
  }

  // 3. Legendárne meno manažéra v Profile
  function onNameChange(name, api) {
    injectStyles();
    const clean = String(name || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

    const quote = LEGEND_NAMES[clean];
    if (!quote) return false;

    const { state, save, toast, sfxVip } = api;
    const isNew = markEgg(state, "egg_manager");
    state.goldAura = true;
    document.body.classList.add("gold-aura");

    if (isNew) {
      state.coins += 120;
      state.gems += 15;
      spawnConfetti(40);
      if (sfxVip) sfxVip();
      toast("👑 TAJNÉ MENO LEGENDY!", quote, "Odomknutá zlatá aura kariet + 120 🪙 + 15 💎!");
      if (save) save();
    } else {
      toast("👑 Legenda", quote, "Zlatá aura kariet je aktívna!");
    }
    return true;
  }

  // 4. Náhodný VAR ŠKANDÁL (cca 8 % šanca po otázke v kvíze)
  function maybeTriggerVar(api) {
    if (varOverlayOpen || bossModeActive) return false;
    if (Math.random() > 0.085) return false;

    injectStyles();
    varOverlayOpen = true;
    const { state, save, toast, sfxOk, sfxErr } = api;

    const backdrop = document.createElement("div");
    backdrop.className = "gm-var-backdrop";
    backdrop.innerHTML = `
      <div class="gm-var-box">
        <div style="font-size:2rem; margin-bottom:4px;">📺🚨</div>
        <h3 style="color:#f87171; margin-bottom:4px;">VAR INTERVENCIA!</h3>
        <p style="font-size:0.84rem; color:#d1d5db;">Rozhodca skúma možný 2-milimetrový ofsajd! Chyť zelenú píšťalku do <strong id="gmVarSec">4</strong> s, aby gól platil!</p>
        <div class="gm-var-arena" id="gmVarArena">
          <button class="gm-whistle-btn" id="gmWhistleBtn" style="top:45px; left:35%;">📣 GÓL PLATÍ!</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);

    const btn = backdrop.querySelector("#gmWhistleBtn");
    const secEl = backdrop.querySelector("#gmVarSec");
    let leftSec = 4;
    let resolved = false;

    const moveBtn = () => {
      if (!btn || resolved) return;
      btn.style.top = (10 + Math.random() * 80) + "px";
      btn.style.left = (5 + Math.random() * 58) + "%";
    };

    const moveInt = setInterval(moveBtn, 720);
    const cdInt = setInterval(() => {
      leftSec--;
      if (secEl) secEl.textContent = leftSec;
      if (leftSec <= 0 && !resolved) {
        resolved = true;
        clearInterval(moveInt);
        clearInterval(cdInt);
        backdrop.remove();
        varOverlayOpen = false;
        if (sfxErr) sfxErr();
        toast("📺 VAR: OFSAJD!", "Rozhodca ti neuznal bonusový gól o 2 milimetre!", "Skús byť nabudúce rýchlejší.");
      }
    }, 1000);

    btn.onclick = () => {
      if (resolved) return;
      resolved = true;
      clearInterval(moveInt);
      clearInterval(cdInt);
      backdrop.remove();
      varOverlayOpen = false;
      state.coins += 75;
      state.gems += 5;
      spawnConfetti(30);
      if (sfxOk) sfxOk();
      if (save) save();
      toast("✅ VAR: GÓL PLATÍ!", "Rýchly reflex zachránil situáciu!", "+75 🪙 a +5 💎 pripísané!");
    };

    return true;
  }

  // Vykreslenie Tajného denníka (pre záložku Pas / Profil)
  function renderSecretsHTML(state) {
    ensureEggState(state);
    const found = state.eggs.length;
    const total = SECRETS_META.length;
    const rows = SECRETS_META.map(item => {
      const done = state.eggs.includes(item.id);
      return `
        <div class="ach-card ${done ? "done" : ""}" style="opacity:${done ? 1 : 0.72}; filter:none;">
          <div style="font-size:1.5rem;">${done ? "🥚✨" : "🔒"}</div>
          <div>
            <h4 style="font-size:0.86rem; color:${done ? "var(--gold)" : "var(--text)"};">${done ? item.title : "Neobjavené tajomstvo"}</h4>
            <p style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">${item.hint}</p>
          </div>
        </div>
      `;
    }).join("");

    return `
      <div class="section-h" style="margin-top:18px;">
        <span>🥚 Tajný denník (Easter Eggy)</span>
        <span style="font-size:0.82rem; color:var(--gem);">${found} / ${total}</span>
      </div>
      <div class="ach-grid">${rows}</div>
    `;
  }

  function applyAura(state) {
    if (state && state.goldAura) document.body.classList.add("gold-aura");
  }

  function isBossMode() {
    return bossModeActive;
  }

  return {
    SECRET_CARDS,
    SECRETS_META,
    tryCode,
    onLogoClick,
    onNameChange,
    maybeTriggerVar,
    renderSecretsHTML,
    spawnConfetti,
    flashScreen,
    applyAura,
    isBossMode
  };
})();
