/* ============================================================
   PANDA HUNT
   Kleines Oster-Ei-Sammelspiel: 5 Pandas verstecken sich zufällig
   auf der Seite (Startseite, Kniffel, Blog). Fortschritt wird
   lokal im Browser gespeichert (kein Server).

   Einbindung pro Seite:
   <script>window.PANDA_ASSET_BASE = "assets/";</script>  <!-- Pfad zu /assets von dieser Seite aus -->
   <script src="js/panda-hunt.js"></script>
   <body data-panda-page="home">                          <!-- "home" | "kniffel" | "blog" -->
   ============================================================ */

(function(){
  const BASE = window.PANDA_ASSET_BASE || "assets/";
  const STORAGE_KEY = "panda_hunt_found";
  const TOTAL = 5;

  // Welche Pandas auf welcher Seite auftauchen können. Blog ist aktuell nicht
  // mehr verlinkt, deshalb kein Panda mehr dort — sonst wäre die Jagd nicht
  // mehr vollständig lösbar.
  const PAGE_PANDAS = {
    home: ["panda-1", "panda-2", "panda-4", "panda-5"],
    kniffel: ["panda-3"],
    blog: []
  };

  // Jeder Panda auf der Startseite hat sein eigenes, festes Versteck —
  // dadurch bleiben schon entdeckte Pandas an ihrem Platz, statt bei jedem
  // Refresh woanders neu aufzutauchen.
  function zoneFromSelector(selector){
    return function(){
      const el = document.querySelector(selector);
      if(!el) return null;
      const r = el.getBoundingClientRect();
      return { top: r.top + window.scrollY, height: r.height };
    };
  }
  function zoneFromWorkTile(){
    const tiles = Array.from(document.querySelectorAll(".work__tile:not([data-protected])"));
    if(!tiles.length) return null;
    const tile = tiles[Math.floor(Math.random() * tiles.length)];
    const r = tile.getBoundingClientRect();
    return { top: r.top + window.scrollY, height: r.height };
  }
  // Nur verfügbar, solange die About-Me-Ansicht gerade offen ist.
  function zoneFromAbout(){
    const about = document.querySelector("#aboutOverlay.is-open .about");
    if(!about) return null;
    const r = about.getBoundingClientRect();
    return { top: r.top + window.scrollY, height: r.height };
  }

  const HOME_ZONE_BY_ID = {
    "panda-1": zoneFromSelector("#contact"),
    "panda-2": zoneFromSelector("#playground"),
    "panda-4": zoneFromWorkTile,
    "panda-5": zoneFromAbout
  };

  const activeCritters = {};

  // Ein Tag nach dem letzten Fund werden alle Pandas wieder freigegeben,
  // damit man die Jagd bei einem späteren Besuch nochmal spielen kann.
  const RESET_AFTER_MS = 24 * 60 * 60 * 1000;

  function loadFound(){
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if(!data || !Array.isArray(data.found)) return [];
      // Nur eine ABGESCHLOSSENE Jagd (alle 5 gefunden) wird nach 24h zurückgesetzt.
      // Eine noch laufende Jagd darf nicht verfallen, nur weil zwischen zwei
      // einzelnen Funden mehr als 24h liegen (z. B. an verschiedenen Tagen).
      if(data.found.length >= TOTAL && data.completedAt && Date.now() - data.completedAt > RESET_AFTER_MS){
        return [];
      }
      return data.found;
    } catch(e){
      return [];
    }
  }
  function saveFound(list){
    let prev = null;
    try { prev = JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch(e){}
    const completedAt = list.length >= TOTAL ? ((prev && prev.completedAt) || Date.now()) : null;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ found: list, completedAt }));
  }

  // Mindestabstand zu bereits platzierten Pandas, damit sich nie zwei so
  // überlappen, dass man beim Klicken nur den einen von beiden erwischt.
  const MIN_DISTANCE = 130;

  function rollPosition(id, page){
    let zone = null;
    if(page === "home"){
      const zoneFn = HOME_ZONE_BY_ID[id];
      zone = zoneFn ? zoneFn() : null;
      if(!zone) return null; // Versteck gerade nicht verfügbar (z. B. About zu)
    }
    let top;
    if(zone){
      const pad = 50;
      const usable = Math.max(zone.height - pad * 2, 30);
      top = zone.top + pad + Math.random() * usable;
    } else {
      const docHeight = Math.max(document.body.scrollHeight, window.innerHeight);
      top = 260 + Math.random() * Math.max(200, docHeight - 700);
    }
    const leftPct = 6 + Math.random() * 78;
    return { top, leftPct };
  }

  function distanceToNearestCritter(top, leftPct){
    const leftPx = (leftPct / 100) * window.innerWidth;
    let nearest = Infinity;
    Object.values(activeCritters).forEach(el => {
      const elTop = parseFloat(el.style.top);
      const elLeftPx = (parseFloat(el.style.left) / 100) * window.innerWidth;
      const dist = Math.hypot(leftPx - elLeftPx, top - elTop);
      if(dist < nearest) nearest = dist;
    });
    return nearest;
  }

  function pickPosition(id, page){
    let best = rollPosition(id, page);
    if(!best) return null;
    let bestDistance = distanceToNearestCritter(best.top, best.leftPct);
    for(let attempt = 0; attempt < 24 && bestDistance < MIN_DISTANCE; attempt++){
      const candidate = rollPosition(id, page);
      if(!candidate) break;
      const dist = distanceToNearestCritter(candidate.top, candidate.leftPct);
      if(dist > bestDistance){
        best = candidate;
        bestDistance = dist;
      }
    }
    return best;
  }

  function spawnPanda(id, page){
    const position = pickPosition(id, page);
    if(!position) return; // Versteck gerade nicht verfügbar, später per Refresh erneut versuchen

    const el = document.createElement("button");
    el.type = "button";
    el.className = "panda-hunt-critter";
    el.setAttribute("aria-label", "Panda einsammeln");
    el.textContent = "🐼";
    el.style.top = `${Math.round(position.top)}px`;
    el.style.left = `${position.leftPct}%`;

    el.addEventListener("click", ()=> collect(id, el));
    document.body.appendChild(el);
    activeCritters[id] = el;
  }

  // Wird aufgerufen, wenn sich die About-Me-Ansicht öffnet oder schließt:
  // Pandas mit einem an sie gebundenen Versteck (z. B. About) tauchen auf
  // bzw. verschwinden wieder, alle anderen bleiben unangetastet an ihrem Platz.
  function refreshSpawns(){
    const page = document.body.dataset.pandaPage;
    if(page !== "home") return;
    const found = loadFound();
    (PAGE_PANDAS[page] || []).forEach(id => {
      if(found.includes(id)){
        if(activeCritters[id]){ activeCritters[id].remove(); delete activeCritters[id]; }
        return;
      }
      const zoneFn = HOME_ZONE_BY_ID[id];
      const available = zoneFn ? !!zoneFn() : true;
      if(!available){
        if(activeCritters[id]){ activeCritters[id].remove(); delete activeCritters[id]; }
        return;
      }
      if(!activeCritters[id]) spawnPanda(id, page);
    });
  }
  window.addEventListener("panda-hunt:refresh", refreshSpawns);

  function collect(id, el){
    el.classList.add("is-collected");
    setTimeout(()=> el.remove(), 350);

    const found = loadFound();
    if(!found.includes(id)) found.push(id);
    saveFound(found);

    renderBadge(found.length);
    showToast(found.length);

    if(found.length >= TOTAL) setTimeout(showCelebration, 600);
  }

  function resetHunt(){
    localStorage.removeItem(STORAGE_KEY);
    Object.keys(activeCritters).forEach(id => {
      activeCritters[id].remove();
      delete activeCritters[id];
    });
    renderBadge(0);
    const page = document.body.dataset.pandaPage;
    (PAGE_PANDAS[page] || []).forEach(id => spawnPanda(id, page));
  }

  let badgeEl = null;
  function renderBadge(count){
    if(!badgeEl){
      badgeEl = document.createElement("div");
      badgeEl.className = "panda-hunt-badge";
      badgeEl.innerHTML = `
        <span class="panda-hunt-badge__count">🐼 <span data-count>0</span>/${TOTAL}</span>
        <span class="panda-hunt-badge__hint">Finde die 5 Pandas!</span>
        <button type="button" class="panda-hunt-badge__reset" title="Suche neu starten">↺ Neu starten</button>
      `;
      badgeEl.querySelector(".panda-hunt-badge__reset").addEventListener("click", resetHunt);
      document.body.appendChild(badgeEl);
    }
    badgeEl.querySelector("[data-count]").textContent = count;
  }

  function showToast(count){
    const toast = document.createElement("div");
    toast.className = "panda-hunt-toast";
    toast.textContent = count >= TOTAL
      ? "🐼 Letzter Panda gefunden!"
      : `🐼 Panda gefunden! ${count}/${TOTAL}`;
    document.body.appendChild(toast);
    requestAnimationFrame(()=> toast.classList.add("is-visible"));
    setTimeout(()=>{
      toast.classList.remove("is-visible");
      setTimeout(()=> toast.remove(), 300);
    }, 2200);
  }

  const BOOKING_URL = "https://calendly.com/lydiaswelt";

  function showCelebration(){
    const overlay = document.createElement("div");
    overlay.className = "panda-hunt-celebration";
    overlay.innerHTML = `
      <div class="panda-hunt-celebration__card">
        <img src="${BASE}pandas/panda-5.png" class="panda-hunt-celebration__panda" alt="">
        <h2>Wow!!</h2>
        <p class="panda-hunt-celebration__text">Niemand hat vor dir alle 5 Pandas gefunden! Das müssen wir feiern: Vereinbare direkt einen Call mit mir!</p>
        <a href="${BOOKING_URL}" rel="noopener" class="panda-hunt-celebration__cta">Termin buchen</a>
        <button type="button" class="panda-hunt-celebration__close">Schließen</button>
      </div>
    `;
    overlay.querySelector(".panda-hunt-celebration__close").addEventListener("click", ()=> overlay.remove());
    overlay.addEventListener("click", (e)=>{ if(e.target === overlay) overlay.remove(); });
    overlay.querySelector(".panda-hunt-celebration__cta").addEventListener("click", (e)=>{
      if(window.Calendly){
        e.preventDefault();
        Calendly.initPopupWidget({ url: BOOKING_URL });
      }
    });
    document.body.appendChild(overlay);
  }

  function init(){
    const page = document.body.dataset.pandaPage;
    const pandaIds = PAGE_PANDAS[page] || [];
    const found = loadFound();

    renderBadge(found.length);
    pandaIds.forEach(id => {
      if(!found.includes(id)) spawnPanda(id, page);
    });
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
