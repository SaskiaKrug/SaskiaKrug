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

  // Welche Pandas auf welcher Seite auftauchen können.
  const PAGE_PANDAS = {
    home: ["panda-1", "panda-2", "panda-5"],
    kniffel: ["panda-3"],
    blog: ["panda-4"]
  };

  // Fest verankerte Bereiche, in denen Pandas landen dürfen — hält sie von den Arbeiten-Kacheln fern.
  const SAFE_ZONE_SELECTORS = {
    home: ["#top", "#playground", "#contact"]
  };

  // Zusätzliche Verstecke, die nur existieren, wenn gerade eine Case Study offen ist.
  function dynamicZoneElements(page){
    if(page !== "home") return [];
    return Array.from(document.querySelectorAll(
      "#galleryOverlay.is-open .case__media-item--video"
    ));
  }

  const activeCritters = {};

  // Ein Tag nach dem letzten Fund werden alle Pandas wieder freigegeben,
  // damit man die Jagd bei einem späteren Besuch nochmal spielen kann.
  const RESET_AFTER_MS = 24 * 60 * 60 * 1000;

  function loadFound(){
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if(!data || !Array.isArray(data.found)) return [];
      if(Date.now() - data.updatedAt > RESET_AFTER_MS) return [];
      return data.found;
    } catch(e){
      return [];
    }
  }
  function saveFound(list){
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ found: list, updatedAt: Date.now() }));
  }

  function randomSpotInZones(page){
    const selectors = SAFE_ZONE_SELECTORS[page] || [];
    const elements = selectors.map(sel => document.querySelector(sel)).filter(Boolean)
      .concat(dynamicZoneElements(page));
    const zones = elements
      .map(zone => {
        const rect = zone.getBoundingClientRect();
        return { top: rect.top + window.scrollY, height: rect.height };
      })
      .filter(zone => zone.height > 90);
    if(zones.length === 0) return null;
    const zone = zones[Math.floor(Math.random() * zones.length)];
    const pad = 50;
    const usable = Math.max(zone.height - pad * 2, 30);
    return zone.top + pad + Math.random() * usable;
  }

  function spawnPanda(id, page){
    const el = document.createElement("button");
    el.type = "button";
    el.className = "panda-hunt-critter";
    el.setAttribute("aria-label", "Panda einsammeln");

    const img = document.createElement("img");
    img.src = `${BASE}pandas/${id}.png`;
    img.alt = "";
    el.appendChild(img);

    const zoneTop = SAFE_ZONE_SELECTORS[page] ? randomSpotInZones(page) : null;

    let top;
    if(zoneTop !== null){
      top = zoneTop;
    } else {
      const docHeight = Math.max(document.body.scrollHeight, window.innerHeight);
      top = 260 + Math.random() * Math.max(200, docHeight - 700);
    }
    const leftPct = 6 + Math.random() * 78;
    el.style.top = `${Math.round(top)}px`;
    el.style.left = `${leftPct}%`;

    el.addEventListener("click", ()=> collect(id, el));
    document.body.appendChild(el);
    activeCritters[id] = el;
  }

  // Wird aufgerufen, wenn sich eine Case Study öffnet: noch nicht gefundene
  // Pandas dürfen sich neu positionieren, jetzt evtl. neben einem Video.
  function refreshSpawns(){
    const page = document.body.dataset.pandaPage;
    if(page !== "home") return;
    const found = loadFound();
    (PAGE_PANDAS[page] || []).forEach(id => {
      if(found.includes(id)){
        if(activeCritters[id]){ activeCritters[id].remove(); delete activeCritters[id]; }
        return;
      }
      if(activeCritters[id]) activeCritters[id].remove();
      spawnPanda(id, page);
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

  let badgeEl = null;
  function renderBadge(count){
    if(!badgeEl){
      badgeEl = document.createElement("div");
      badgeEl.className = "panda-hunt-badge";
      badgeEl.innerHTML = `
        <span class="panda-hunt-badge__count">🐼 <span data-count>0</span>/${TOTAL}</span>
        <span class="panda-hunt-badge__hint">Finde die 5 Pandas!</span>
      `;
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
