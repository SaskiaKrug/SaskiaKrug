/* ============================================================
   KNIFFEL — teilbares Spiel-Modul
   Klassisches Würfelspiel: 5 Würfel, 3 Würfe pro Zug, Zettel mit
   13 Kategorien. Lokales Pass-and-play für 1–6 Spieler:innen.

   window.KniffelGame.mount(rootEl) baut das komplette Spiel in
   rootEl auf. Wird sowohl von der eigenständigen Seite
   (apps/kniffel/index.html) als auch eingebettet direkt in der
   Case Study "Fun Projects" verwendet.
   ============================================================ */

window.KniffelGame = (function(){

  const CATEGORIES = [
    { id: "ones",     label: "Einser",       section: "upper", score: d => sumOf(d, 1) },
    { id: "twos",     label: "Zweier",       section: "upper", score: d => sumOf(d, 2) },
    { id: "threes",   label: "Dreier",       section: "upper", score: d => sumOf(d, 3) },
    { id: "fours",    label: "Vierer",       section: "upper", score: d => sumOf(d, 4) },
    { id: "fives",    label: "Fünfer",       section: "upper", score: d => sumOf(d, 5) },
    { id: "sixes",    label: "Sechser",      section: "upper", score: d => sumOf(d, 6) },
    { id: "threeKind",label: "Dreierpasch",  section: "lower", score: d => hasCount(d, 3) ? total(d) : 0 },
    { id: "fourKind", label: "Viererpasch",  section: "lower", score: d => hasCount(d, 4) ? total(d) : 0 },
    { id: "fullHouse",label: "Full House",   section: "lower", score: d => isFullHouse(d) ? 25 : 0 },
    { id: "smallStr", label: "Kleine Straße",section: "lower", score: d => isSmallStraight(d) ? 30 : 0 },
    { id: "largeStr", label: "Große Straße", section: "lower", score: d => isLargeStraight(d) ? 40 : 0 },
    { id: "kniffel",  label: "Kniffel",      section: "lower", score: d => hasCount(d, 5) ? 50 : 0 },
    { id: "chance",   label: "Chance",       section: "lower", score: d => total(d) },
  ];

  const BONUS_THRESHOLD = 63;
  const BONUS_POINTS = 35;
  const LOGO_SRC = "/assets/header/SK_Logo.png";

  function counts(dice){
    const c = {};
    dice.forEach(v => c[v] = (c[v] || 0) + 1);
    return c;
  }
  function total(dice){ return dice.reduce((a,b) => a+b, 0); }
  function sumOf(dice, face){ return dice.filter(v => v === face).length * face; }
  function hasCount(dice, n){ return Object.values(counts(dice)).some(c => c >= n); }
  function isFullHouse(dice){
    const vals = Object.values(counts(dice)).sort();
    return vals.length === 2 && vals[0] === 2 && vals[1] === 3;
  }
  function isSmallStraight(dice){
    const set = new Set(dice);
    const runs = [[1,2,3,4],[2,3,4,5],[3,4,5,6]];
    return runs.some(run => run.every(v => set.has(v)));
  }
  function isLargeStraight(dice){
    const sorted = [...new Set(dice)].sort((a,b)=>a-b);
    if(sorted.length !== 5) return false;
    return JSON.stringify(sorted) === JSON.stringify([1,2,3,4,5]) ||
           JSON.stringify(sorted) === JSON.stringify([2,3,4,5,6]);
  }

  const PIP_LAYOUT = {
    1: [4],
    2: [0,8],
    3: [0,4,8],
    4: [0,2,6,8],
    5: [0,2,4,6,8],
    6: [0,2,3,5,6,8],
  };

  const MARKUP = `
    <section class="setup" data-el="setup">
      <p class="setup__label">I want to play a game</p>
      <div class="setup__players" data-el="setupPlayers">
        <input type="text" class="setup__input" placeholder="Spieler 1" maxlength="16">
      </div>
      <button type="button" class="setup__add" data-el="addPlayerBtn">+ Spieler hinzufügen</button>
      <button type="button" class="setup__start" data-el="startBtn">Go go go</button>
    </section>

    <section class="game" data-el="game" hidden>
      <a href="../../index.html#fun-projects" class="game__back">← Zurück zu Fun Projects</a>
      <div class="dice-tray">
        <p class="dice-tray__status" data-el="turnStatus"></p>
        <div class="dice-tray__dice" data-el="diceRow"></div>
        <button type="button" class="dice-tray__roll" data-el="rollBtn">Würfeln</button>
        <p class="dice-tray__hint" data-el="rollHint">Let’s roll!</p>
        <div class="confirm-bar" data-el="confirmBar" hidden>
          <p data-el="confirmText"></p>
          <div class="confirm-bar__actions">
            <button type="button" class="confirm-bar__cancel" data-el="confirmCancel">Nee, sorry</button>
            <button type="button" class="confirm-bar__ok" data-el="confirmOk">Go, girl!</button>
          </div>
        </div>
      </div>

      <div class="sheet-wrap">
        <div class="sheet" data-el="sheet"></div>
      </div>
    </section>

    <div class="result" data-el="result" hidden>
      <div class="result__card">
        <img src="${LOGO_SRC}" class="result__logo" alt="SK">
        <p class="result__label">Spiel beendet</p>
        <h2 class="result__winner" data-el="resultWinner"></h2>
        <div class="result__scores" data-el="resultScores"></div>

        <div class="result__highscore">
          <p class="result__highscore-label">Bestenliste</p>
          <div class="result__highscore-list" data-el="highscoreList"></div>
        </div>

        <button type="button" class="result__again" data-el="playAgainBtn">Nochmal spielen</button>
        <a href="../../index.html#fun-projects" class="result__back">← Zurück zu Fun Projects</a>
      </div>
    </div>
  `;

  const CONFETTI_COLORS = ["#ff2f9e", "#39ff8f", "#ffe066", "#5ec8ff", "#ffffff"];

  // Konfetti über den kompletten Bildschirm, wenn ein Kniffel fällt (5 gleiche Würfel).
  function launchConfetti(){
    const layer = document.createElement("div");
    layer.className = "kniffel-confetti";
    document.body.appendChild(layer);

    const pieceCount = 140;
    for(let i = 0; i < pieceCount; i++){
      const piece = document.createElement("span");
      piece.className = "kniffel-confetti__piece";
      const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      const size = 6 + Math.random() * 6;
      const duration = 2.2 + Math.random() * 1.3;
      const drift = (Math.random() * 2 - 1) * 100;
      const rotate = 360 + Math.random() * 360;
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.width = `${size}px`;
      piece.style.height = `${size * 0.4}px`;
      piece.style.background = color;
      piece.style.animationDuration = `${duration}s`;
      piece.style.animationDelay = `${Math.random() * 0.4}s`;
      piece.style.setProperty("--drift", `${drift}px`);
      piece.style.setProperty("--rotate", `${rotate}deg`);
      layer.appendChild(piece);
    }

    setTimeout(()=> layer.remove(), 3800);
  }

  // Bestenliste: lokal im Browser gespeichert (kein Server), Top 10, absteigend sortiert.
  const HIGHSCORE_KEY = "kniffel_highscores";
  const LEGEND_ENTRY = { name: "Saskia K. Superstar", score: 1500, tag: "Kniffel-Legende" };
  function loadHighscores(){
    try {
      const list = JSON.parse(localStorage.getItem(HIGHSCORE_KEY));
      return Array.isArray(list) ? list : [];
    } catch(e){
      return [];
    }
  }
  function saveHighscore(name, score){
    const list = loadHighscores();
    list.push({ name, score });
    list.sort((a, b) => b.score - a.score);
    localStorage.setItem(HIGHSCORE_KEY, JSON.stringify(list.slice(0, 10)));
  }

  function mount(root){
    root.classList.add("kniffel-game");
    root.innerHTML = MARKUP;
    const el = {};
    root.querySelectorAll("[data-el]").forEach(node => { el[node.dataset.el] = node; });

    /* ---------------- State ---------------- */
    let players = [];
    let currentPlayerIndex = 0;
    let dice = [1,1,1,1,1];
    let held = [false,false,false,false,false];
    let rollsLeft = 3;
    let rolled = false;
    let isRolling = false;
    let pendingCategory = null; // Kategorie, die auf Bestätigung wartet

    /* ---------------- Setup ---------------- */
    el.addPlayerBtn.addEventListener("click", ()=>{
      const inputs = el.setupPlayers.querySelectorAll(".setup__input");
      if(inputs.length >= 6) return;
      const input = document.createElement("input");
      input.type = "text";
      input.className = "setup__input";
      input.maxLength = 16;
      input.placeholder = `Spieler ${inputs.length + 1}`;
      el.setupPlayers.appendChild(input);
      input.focus();
    });

    el.startBtn.addEventListener("click", ()=>{
      const inputs = Array.from(el.setupPlayers.querySelectorAll(".setup__input"));
      players = inputs.map((input, i) => ({
        name: input.value.trim() || `Spieler ${i + 1}`,
        scores: Object.fromEntries(CATEGORIES.map(c => [c.id, null])),
      }));
      currentPlayerIndex = 0;
      resetTurn();
      el.setup.hidden = true;
      el.game.hidden = false;
      renderAll();
    });

    /* ---------------- Dice tray ---------------- */
    function resetTurn(){
      dice = [1,1,1,1,1];
      held = [false,false,false,false,false];
      rollsLeft = 3;
      rolled = false;
      pendingCategory = null;
    }

    function renderDieFace(faceEl, value){
      faceEl.innerHTML = "";
      const active = new Set(PIP_LAYOUT[value]);
      for(let i = 0; i < 9; i++){
        const pip = document.createElement("span");
        pip.className = "die__pip" + (active.has(i) ? " is-on" : "");
        faceEl.appendChild(pip);
      }
    }

    function renderDice(){
      el.diceRow.innerHTML = "";
      dice.forEach((value, i) => {
        const die = document.createElement("button");
        die.type = "button";
        die.className = "die" + (held[i] ? " is-held" : "");
        die.disabled = !rolled || isRolling;
        die.setAttribute("aria-label", `Würfel ${i + 1}: ${value}${held[i] ? " (gehalten)" : ""}`);
        const face = document.createElement("div");
        face.className = "die__face";
        renderDieFace(face, value);
        die.appendChild(face);
        die.addEventListener("click", ()=>{
          if(!rolled || isRolling) return;
          held[i] = !held[i];
          setPending(null);
          renderDice();
        });
        el.diceRow.appendChild(die);
      });
    }

    function rollDice(){
      if(rollsLeft <= 0 || isRolling) return;
      setPending(null);
      isRolling = true;
      el.rollBtn.disabled = true;
      renderTray();

      const finalValues = dice.map((v, i) => held[i] ? v : (1 + Math.floor(Math.random() * 6)));
      const dieEls = Array.from(el.diceRow.children);
      const activeIndices = [];
      dieEls.forEach((dieEl, i) => { if(!held[i]) activeIndices.push(i); });

      if(activeIndices.length === 0){
        finishRoll(finalValues);
        return;
      }

      let doneCount = 0;
      activeIndices.forEach((i, order) => {
        const dieEl = dieEls[i];
        const face = dieEl.querySelector(".die__face");
        dieEl.classList.remove("is-rolling");
        void dieEl.offsetWidth;
        dieEl.classList.add("is-rolling");
        const duration = 480 + order * 70;
        const flicker = setInterval(()=>{
          renderDieFace(face, 1 + Math.floor(Math.random() * 6));
        }, 60);
        setTimeout(()=>{
          clearInterval(flicker);
          renderDieFace(face, finalValues[i]);
          dieEl.classList.remove("is-rolling");
          dieEl.classList.add("is-settled");
          setTimeout(()=> dieEl.classList.remove("is-settled"), 220);
          doneCount++;
          if(doneCount === activeIndices.length) finishRoll(finalValues);
        }, duration);
      });
    }

    function finishRoll(finalValues){
      dice = finalValues;
      rollsLeft--;
      rolled = true;
      isRolling = false;
      renderDice();
      renderTray();
      renderSheet();
      if(dice.every(v => v === dice[0])) launchConfetti();
    }

    el.rollBtn.addEventListener("click", rollDice);

    function renderTray(){
      const player = players[currentPlayerIndex];
      el.turnStatus.textContent = `${player.name} ist dran`;
      el.rollBtn.disabled = rollsLeft <= 0 || isRolling;
      if(isRolling){
        el.rollHint.textContent = "Die Würfel rollen …";
      } else if(rollsLeft <= 0){
        el.rollHint.textContent = "Keine Würfe mehr — wähle ein Feld auf dem Zettel.";
      } else if(!rolled){
        el.rollHint.textContent = "Let’s roll!";
      } else {
        el.rollHint.textContent = `Noch ${rollsLeft} ${rollsLeft === 1 ? "Wurf" : "Würfe"} übrig — gehaltene Würfel antippen, um sie zu behalten.`;
      }
    }

    /* ---------------- Scoresheet ---------------- */
    function upperSubtotal(player){
      return CATEGORIES.filter(c => c.section === "upper")
        .reduce((sum, c) => sum + (player.scores[c.id] || 0), 0);
    }
    function upperBonus(player){
      return upperSubtotal(player) >= BONUS_THRESHOLD ? BONUS_POINTS : 0;
    }
    function lowerSubtotal(player){
      return CATEGORIES.filter(c => c.section === "lower")
        .reduce((sum, c) => sum + (player.scores[c.id] || 0), 0);
    }
    function grandTotal(player){
      return upperSubtotal(player) + upperBonus(player) + lowerSubtotal(player);
    }

    function setPending(catId){
      pendingCategory = catId;
      const cat = catId ? CATEGORIES.find(c => c.id === catId) : null;
      if(cat){
        el.confirmBar.hidden = false;
        el.confirmText.textContent = `„${cat.label}“ mit ${cat.score(dice)} Punkten eintragen?`;
      } else {
        el.confirmBar.hidden = true;
      }
      renderSheet();
    }

    el.confirmCancel.addEventListener("click", ()=> setPending(null));
    el.confirmOk.addEventListener("click", ()=>{
      if(!pendingCategory) return;
      const player = players[currentPlayerIndex];
      const cat = CATEGORIES.find(c => c.id === pendingCategory);
      player.scores[cat.id] = cat.score(dice);
      pendingCategory = null;
      el.confirmBar.hidden = true;
      nextTurn();
    });

    function nextTurn(){
      const allDone = players.every(p => CATEGORIES.every(c => p.scores[c.id] !== null));
      if(allDone){
        showResult();
        return;
      }
      currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
      resetTurn();
      el.confirmBar.hidden = true;
      renderAll();
    }

    function makeRow(className, cells){
      const row = document.createElement("div");
      row.className = "sheet__row " + className;
      cells.forEach(cell => row.appendChild(cell));
      return row;
    }
    function labelCell(text, extraClass){
      const cellEl = document.createElement("div");
      cellEl.className = "sheet__label" + (extraClass ? " " + extraClass : "");
      cellEl.textContent = text;
      return cellEl;
    }

    function renderSheet(){
      el.sheet.style.setProperty("--players", players.length);
      el.sheet.innerHTML = "";

      const logo = document.createElement("img");
      logo.src = LOGO_SRC;
      logo.alt = "SK";
      logo.className = "sheet__logo";
      el.sheet.appendChild(logo);

      const title = document.createElement("p");
      title.className = "sheet__title";
      title.textContent = "Kniffelblock";
      el.sheet.appendChild(title);

      const headCells = [labelCell("")];
      players.forEach((p, i) => {
        const cell = document.createElement("div");
        cell.className = "sheet__player" + (i === currentPlayerIndex ? " sheet__player--current" : "");
        cell.textContent = p.name;
        headCells.push(cell);
      });
      el.sheet.appendChild(makeRow("sheet__row--head", headCells));

      const columnsWrap = document.createElement("div");
      columnsWrap.className = "sheet__columns";
      el.sheet.appendChild(columnsWrap);

      const upperCol = document.createElement("div");
      upperCol.className = "sheet__col";
      const lowerCol = document.createElement("div");
      lowerCol.className = "sheet__col";
      columnsWrap.appendChild(upperCol);
      columnsWrap.appendChild(lowerCol);

      function sectionLabelRow(text, target){
        const label = document.createElement("div");
        label.className = "sheet__section-label";
        label.textContent = text;
        const cells = [label];
        players.forEach(()=> cells.push(document.createElement("div")));
        target.appendChild(makeRow("sheet__row--section", cells));
      }

      function categoryRow(cat, target){
        const cells = [labelCell(cat.label)];
        players.forEach((p, pi) => {
          const cell = document.createElement("div");
          const filled = p.scores[cat.id];
          const isCurrent = pi === currentPlayerIndex;
          const isPending = isCurrent && pendingCategory === cat.id;
          if(filled !== null){
            cell.className = "sheet__cell sheet__cell--filled";
            cell.textContent = filled;
          } else if(isPending){
            cell.className = "sheet__cell sheet__cell--pending";
            cell.textContent = cat.score(dice);
          } else if(isCurrent && rolled && !pendingCategory){
            cell.className = "sheet__cell sheet__cell--pickable sheet__cell--current";
            cell.textContent = cat.score(dice);
            cell.addEventListener("click", ()=> setPending(cat.id));
          } else if(isCurrent){
            cell.className = "sheet__cell sheet__cell--empty sheet__cell--current";
            cell.textContent = "–";
          } else {
            cell.className = "sheet__cell sheet__cell--empty";
            cell.textContent = "–";
          }
          cells.push(cell);
        });
        target.appendChild(makeRow("sheet__row", cells));
      }

      function subtotalRow(label, valueFn, target){
        const cells = [labelCell(label)];
        players.forEach(p => {
          const cell = document.createElement("div");
          cell.className = "sheet__cell";
          cell.textContent = valueFn(p);
          cells.push(cell);
        });
        target.appendChild(makeRow("sheet__row--sub", cells));
      }

      sectionLabelRow("Oben", upperCol);
      CATEGORIES.filter(c => c.section === "upper").forEach(cat => categoryRow(cat, upperCol));
      subtotalRow("Summe", p => upperSubtotal(p), upperCol);
      subtotalRow(`Bonus (ab ${BONUS_THRESHOLD})`, p => upperBonus(p), upperCol);

      sectionLabelRow("Unten", lowerCol);
      CATEGORIES.filter(c => c.section === "lower").forEach(cat => categoryRow(cat, lowerCol));

      const totalCells = [labelCell("Gesamt")];
      players.forEach(p => {
        const cell = document.createElement("div");
        cell.className = "sheet__cell";
        cell.textContent = grandTotal(p);
        totalCells.push(cell);
      });
      lowerCol.appendChild(makeRow("sheet__row--total", totalCells));
    }

    function renderAll(){
      renderDice();
      renderTray();
      renderSheet();
    }

    /* ---------------- Result ---------------- */
    function renderHighscoreList(){
      const list = [LEGEND_ENTRY]
        .sort((a, b) => b.score - a.score)
        .slice(0, 1);
      el.highscoreList.innerHTML = "";
      list.forEach((entry, i) => {
        const row = document.createElement("div");
        row.className = "result__highscore-row";
        row.innerHTML = `
          <span>${i + 1}. ${entry.name}${entry.tag ? ` <span class="result__highscore-tag">${entry.tag}</span>` : ""}</span>
          <span>${entry.score}</span>
        `;
        el.highscoreList.appendChild(row);
      });
    }

    function showResult(){
      const ranked = [...players].sort((a,b) => grandTotal(b) - grandTotal(a));
      const topScore = grandTotal(ranked[0]);
      const winners = ranked.filter(p => grandTotal(p) === topScore);
      el.resultWinner.textContent = winners.length > 1
        ? `${winners.map(p => p.name).join(" & ")} — Unentschieden!`
        : `${winners[0].name} gewinnt! 🎉`;

      el.resultScores.innerHTML = "";
      ranked.forEach(p => {
        const row = document.createElement("div");
        row.className = "result__score-row";
        row.innerHTML = `
          <span>${p.name}</span>
          <span>${grandTotal(p)}</span>
          <button type="button" class="result__enter-btn">In die Bestenliste</button>
        `;
        row.querySelector(".result__enter-btn").addEventListener("click", (e)=>{
          saveHighscore(p.name, grandTotal(p));
          e.target.disabled = true;
          e.target.textContent = "✓ Eingetragen";
          renderHighscoreList();
        });
        el.resultScores.appendChild(row);
      });

      renderHighscoreList();
      el.result.hidden = false;
      launchConfetti();
    }

    el.playAgainBtn.addEventListener("click", ()=>{
      el.result.hidden = true;
      el.game.hidden = true;
      el.setup.hidden = false;
    });
  }

  return { mount };
})();
