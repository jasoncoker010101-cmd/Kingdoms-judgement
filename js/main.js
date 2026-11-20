(() => {
  "use strict";

  const SAVE_KEY = "kingdomsJudgment.save.v1";
  const characters = window.GAME_CONTENT.characters;
  const $ = (selector) => document.querySelector(selector);
  const canvas = $("#scene");
  const state = {
    day: 1, gold: 100, food: 80, approval: 52, stability: 45,
    player: { x: 0.40, y: 0.80 }, moving: {}, started: false,
    decisions: [], met: [], affinities: {}, completed: [], rulerName: "Your Grace",
    activeCharacter: null, activeView: "throne"
  };
  let lastFrame = 0;
  let saveNoticeTimer = null;

  function loadSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const saved = JSON.parse(raw);
      if (saved?.version !== 1 || !saved.state || !saved.state.started) return null;
      return saved.state;
    } catch (error) {
      console.warn("Saved reign could not be read.", error);
      return null;
    }
  }

  function applySave(saved) {
    const safe = {
      day: bounded(saved.day, 1, 9999, 1), gold: bounded(saved.gold, 0, 999999, 100),
      food: bounded(saved.food, 0, 999999, 80), approval: bounded(saved.approval, 0, 100, 52),
      stability: bounded(saved.stability, 0, 100, 45),
      player: { x: bounded(saved.player?.x, 0.04, 0.96, 0.4), y: bounded(saved.player?.y, 0.72, 0.88, 0.8) },
      started: true, decisions: Array.isArray(saved.decisions) ? saved.decisions.slice(-40) : [],
      met: Array.isArray(saved.met) ? saved.met.filter((id) => characters[id]) : [],
      affinities: saved.affinities && typeof saved.affinities === "object" ? saved.affinities : {},
      completed: Array.isArray(saved.completed) ? saved.completed : [],
      rulerName: typeof saved.rulerName === "string" ? saved.rulerName.slice(0, 24) || "Your Grace" : "Your Grace"
    };
    Object.assign(state, safe);
  }

  function bounded(value, min, max, fallback) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.max(min, Math.min(max, number)) : fallback;
  }

  function saveGame(showMessage = true) {
    if (!state.started) return false;
    try {
      const snapshot = {
        day: state.day, gold: state.gold, food: state.food, approval: state.approval,
        stability: state.stability, player: state.player, started: true, decisions: state.decisions,
        met: state.met, affinities: state.affinities, completed: state.completed, rulerName: state.rulerName
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify({ version: 1, state: snapshot }));
      updateSaveStatus(showMessage ? "Reign saved" : "Progress saves in this browser");
      updateTitleSavePreview();
      return true;
    } catch (error) {
      updateSaveStatus("Save unavailable in this browser");
      console.warn("Could not save the current reign.", error);
      return false;
    }
  }

  function updateSaveStatus(text) {
    const node = $("#save-status");
    if (!node) return;
    node.textContent = text;
    if (saveNoticeTimer) clearTimeout(saveNoticeTimer);
    if (text === "Reign saved") saveNoticeTimer = setTimeout(() => { node.textContent = "Progress saves in this browser"; }, 2400);
  }

  function updateTitleSavePreview() {
    const saved = loadSave();
    const continueButton = $("#continue-game");
    const preview = $("#save-preview");
    continueButton.disabled = !saved;
    preview.textContent = saved ? `${saved.rulerName || "Your Grace"} · Day ${saved.day} · Saved in this browser` : "Avelorn's throne awaits.";
  }

  function startNewGame() {
    const existing = loadSave();
    if (existing && !window.confirm("Begin a new reign? This will replace the saved reign in this browser.")) return;
    state.day = 1; state.gold = 100; state.food = 80; state.approval = 52; state.stability = 45;
    state.player = { x: 0.40, y: 0.80 }; state.moving = {}; state.started = true;
    state.decisions = []; state.met = []; state.affinities = {}; state.completed = [];
    state.rulerName = $("#ruler-name").value.trim().slice(0, 24) || "Your Grace";
    state.activeCharacter = null; state.activeView = "throne";
    enterGame();
    setNotice("A new reign begins. A petition from Eastmere is waiting in the hall.");
    saveGame(false);
    drawScene();
  }

  function continueGame() {
    const saved = loadSave();
    if (!saved) { updateTitleSavePreview(); return; }
    applySave(saved);
    enterGame();
    setNotice(`${state.rulerName} returns to the throne. The court is waiting.`);
    drawScene();
  }

  function enterGame() {
    $("#title-screen").classList.add("hidden");
    $("#play-screen").classList.remove("hidden");
    closeDialogue(false);
    setView("throne");
    updateUI();
    canvas.focus({ preventScroll: true });
  }

  function setView(view) {
    state.activeView = view;
    const isThrone = view === "throne";
    $("#throne-view").classList.toggle("hidden", !isThrone);
    $("#panel-view").classList.toggle("hidden", isThrone);
    document.querySelectorAll("[data-view]").forEach((button) => {
      const active = button.dataset.view === view;
      button.classList.toggle("active", active);
      if (active) button.setAttribute("aria-current", "page"); else button.removeAttribute("aria-current");
    });
    if (!isThrone) renderPanel(view);
    else drawScene();
  }

  function renderPanel(view) {
    const panel = $("#panel-view");
    if (view === "capital") {
      panel.innerHTML = `
        <p class="panel-eyebrow">THE CROWN'S SEAT</p><h2>Avelorn, the Capital</h2>
        <p class="panel-intro">A stone city gathered around the royal hill. Its gates are open, its markets are waking, and the eastern road carries more worry than trade.</p>
        <div class="dashboard-grid">
          <article class="record-card"><span class="card-icon">⌂</span><h3>Market Quarter</h3><p>Three guild stalls trade beneath the old bell tower. Merchants are watching the eastern road before committing new stock.</p></article>
          <article class="record-card"><span class="card-icon">❋</span><h3>Eastmere Fields</h3><p>Late frost has damaged the barley. <strong>${state.completed.includes("eastmere-harvest") ? "The crown has answered their petition." : "Mara Fen is waiting to petition the crown."}</strong></p></article>
          <article class="record-card"><span class="card-icon">♜</span><h3>Royal Keep</h3><p>The throne room hosts the council and all formal audiences. The guard reports no immediate threat within the walls.</p></article>
        </div>
        <div class="panel-bottom"><span>Capital records · Day ${state.day}</span><span>Walk the hall to meet the people behind these reports.</span></div>`;
    } else if (view === "kingdom") {
      const outcomes = state.decisions.length ? state.decisions.slice(-3).reverse().map((item) => `<div class="decision-entry"><time>DAY ${item.day}</time><span>${escapeHTML(item.text)}</span></div>`).join("") : `<div class="record-card"><h3>No royal judgments yet</h3><p>The first petition awaits in the throne room. Every decision will be recorded here.</p></div>`;
      panel.innerHTML = `
        <p class="panel-eyebrow">REALM OVERVIEW</p><h2>The Kingdom of Avelorn</h2>
        <p class="panel-intro">A compact realm with a strong capital and a long eastern frontier. The crown begins with enough reserves to help—but not enough to answer every need.</p>
        <div class="dashboard-grid">
          <article class="record-card"><span class="card-icon">◈</span><h3>Treasury</h3><p><strong>${state.gold} gold</strong> in reserve. Coin supports patrols, relief, and the daily work of government.</p></article>
          <article class="record-card"><span class="card-icon">❋</span><h3>Royal Stores</h3><p><strong>${state.food} rations</strong> held for the court and emergency relief.</p></article>
          <article class="record-card"><span class="card-icon">♡</span><h3>People &amp; Stability</h3><p>Public mood: <strong>${state.approval}/100</strong>. Realm stability: <strong>${state.stability}/100</strong>. These measures respond to the crown's choices.</p></article>
        </div>
        <div class="panel-bottom"><span>Royal ledger · ${state.decisions.length} judgment${state.decisions.length === 1 ? "" : "s"} recorded</span><span>Consequences begin with the people in the hall.</span></div>
        <div class="decision-list">${outcomes}</div>`;
    } else {
      const roster = Object.entries(characters).map(([id, character]) => `
        <div class="roster-row"><span class="roster-mark" aria-hidden="true">${character.mark}</span><div class="roster-copy"><strong>${escapeHTML(character.name)}</strong><small>${escapeHTML(character.title)}</small></div><span class="roster-affinity">${state.met.includes(id) ? `Trust ${state.affinities[id] || 0}` : "Unmet"}</span></div>`).join("");
      panel.innerHTML = `
        <p class="panel-eyebrow">THE ROYAL COURT</p><h2>Voices of the Realm</h2>
        <p class="panel-intro">Your court brings different loyalties, skills, and worries before the crown. Meet them in person; their advice comes from what they have seen.</p>
        <div class="court-roster">${roster}</div>
        <div class="panel-bottom"><span>${state.met.length} of ${Object.keys(characters).length} people met</span><button class="button button-secondary" data-return-throne>Return to the throne room</button></div>`;
      panel.querySelector("[data-return-throne]").addEventListener("click", () => setView("throne"));
    }
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  }

  function updateUI() {
    $("#gold").textContent = state.gold;
    $("#food").textContent = state.food;
    $("#approval").textContent = state.approval;
    $("#stability").textContent = state.stability;
    $("#day-label").textContent = `Day ${state.day} · Morning`;
    if (state.activeView !== "throne") renderPanel(state.activeView);
  }

  function setNotice(message) { $("#footer-note").textContent = message; $("#scene-caption span:last-child").textContent = message; }

  function closestCharacter() {
    const rect = canvas.getBoundingClientRect();
    return window.GAME_SCENE.closestCharacter(state.player, characters, rect.width, rect.height, 0.105);
  }

  function interact() {
    if (!state.started || !$("#dialogue").classList.contains("hidden")) return;
    const nearby = closestCharacter();
    if (!nearby) {
      setNotice("Walk closer to a courtier to speak. The gold marker shows who is within reach.");
      return;
    }
    meetCharacter(nearby.id);
  }

  function meetCharacter(id) {
    const character = characters[id];
    if (!character) return;
    if (!state.met.includes(id)) state.met.push(id);
    state.activeCharacter = id;
    saveGame(false);

    const hasPetition = character.petition && !state.completed.includes(character.petition.id);
    if (hasPetition) {
      const introduction = id === "mara"
        ? `${character.greeting}\n\n${character.petition.text}`
        : `${character.greeting}\n\n${character.petition.text}`;
      openDialogue(id, introduction, character.petition.choices.map((choice) => ({
        label: choice.label, primary: true, action: () => resolvePetition(id, character, choice)
      })));
    } else {
      const opening = state.completed.includes(character.petition?.id)
        ? (id === "mara" ? "Your Grace. Eastmere is already sowing again. I wanted to tell you while the news was still good." : "The eastern road has an answer, at least for today. What would you have me do next?")
        : character.greeting;
      const options = character.topics.map((topic) => ({
        label: topic.label,
        action: () => {
          if (topic.affinity) state.affinities[id] = (state.affinities[id] || 0) + topic.affinity;
          if (topic.affinity) saveGame(false);
          openDialogue(id, topic.line, [{ label: "Return to the hall", primary: true, action: () => { closeDialogue(); } }]);
        }
      }));
      options.push({ label: "End audience", action: () => closeDialogue() });
      openDialogue(id, opening, options);
    }
    drawScene();
  }

  function resolvePetition(id, character, choice) {
    const effects = choice.effects;
    state.gold = Math.max(0, state.gold + (effects.gold || 0));
    state.food = Math.max(0, state.food + (effects.food || 0));
    state.approval = bounded(state.approval + (effects.approval || 0), 0, 100, state.approval);
    state.stability = bounded(state.stability + (effects.stability || 0), 0, 100, state.stability);
    state.completed.push(character.petition.id);
    const decision = { day: state.day, text: `${character.name}: ${choice.label.replace(/\s*·.*/, "")}. ${choice.reply}` };
    state.decisions.push(decision);
    state.affinities[id] = (state.affinities[id] || 0) + ((effects.approval || 0) > 0 ? 1 : 0);
    updateUI(); saveGame(false);
    setNotice(`Judgment recorded: ${character.name}'s petition has been answered.`);
    openDialogue(id, choice.reply, [{ label: "Return to the hall", primary: true, action: () => closeDialogue() }], "JUDGMENT RECORDED");
  }

  function openDialogue(id, text, options, kicker = "AN AUDIENCE") {
    const character = characters[id];
    const panel = $("#dialogue");
    $("#speaker").textContent = character.name;
    $("#dialogue-kicker").textContent = kicker;
    $("#dialogue-text").textContent = text;
    $("#portrait-role").textContent = character.role;
    $("#portrait-mark").textContent = character.mark;
    const portrait = $("#portrait-art");
    portrait.style.setProperty("--portrait-cloak", character.sprite);
    portrait.style.setProperty("--portrait-hair", character.hair);
    portrait.style.setProperty("--portrait-skin", character.skin);
    const choices = $("#choices");
    choices.replaceChildren();
    options.forEach((option) => {
      const button = document.createElement("button");
      button.className = `choice-button${option.primary ? " choice-primary" : ""}`;
      button.type = "button";
      button.textContent = option.label;
      button.addEventListener("click", option.action);
      choices.append(button);
    });
    panel.classList.remove("hidden");
    $("#interact").disabled = true;
    const firstChoice = choices.querySelector("button");
    if (firstChoice) firstChoice.focus({ preventScroll: true });
  }

  function closeDialogue(returnFocus = true) {
    $("#dialogue").classList.add("hidden");
    $("#interact").disabled = false;
    if (returnFocus && state.started) $("#interact").focus({ preventScroll: true });
    drawScene();
  }

  function drawScene(now = performance.now()) {
    if (!state.started || state.activeView !== "throne") return;
    window.GAME_SCENE.drawScene(canvas, state, now);
    updateInteractionHint();
  }

  function updateInteractionHint() {
    const nearby = closestCharacter();
    const hint = $("#hint");
    const interactButton = $("#interact");
    if (nearby) {
      const person = nearby.person;
      hint.innerHTML = `<span class="hint-key">E</span> to speak with ${escapeHTML(person.name)} <span class="hint-separator">·</span> <span class="hint-key">Space</span> also works`;
      interactButton.innerHTML = `<span aria-hidden="true">✧</span> Speak with ${escapeHTML(person.name.split(" ")[0])}`;
    } else {
      hint.innerHTML = `<span class="hint-key">WASD</span> or arrows to walk <span class="hint-separator">·</span> <span class="hint-key">E</span> to speak`;
      interactButton.innerHTML = `<span aria-hidden="true">✧</span> Speak`;
    }
  }

  function move(dt) {
    if (!state.started || state.activeView !== "throne" || !$("#dialogue").classList.contains("hidden")) return;
    let dx = 0, dy = 0;
    if (state.moving.left) dx -= 1;
    if (state.moving.right) dx += 1;
    if (state.moving.up) dy -= 1;
    if (state.moving.down) dy += 1;
    const length = Math.hypot(dx, dy) || 1;
    const speed = 0.00022;
    state.player.x = bounded(state.player.x + dx / length * dt * speed, 0.045, 0.955, state.player.x);
    state.player.y = bounded(state.player.y + dy / length * dt * speed, 0.71, 0.87, state.player.y);
  }

  function loop(now) {
    const dt = Math.min(40, now - (lastFrame || now));
    lastFrame = now;
    move(dt);
    drawScene(now);
    requestAnimationFrame(loop);
  }

  const keyMap = { ArrowUp: "up", w: "up", W: "up", ArrowDown: "down", s: "down", S: "down", ArrowLeft: "left", a: "left", A: "left", ArrowRight: "right", d: "right", D: "right" };
  window.addEventListener("keydown", (event) => {
    if (keyMap[event.key] && state.started && state.activeView === "throne" && $("#dialogue").classList.contains("hidden")) {
      event.preventDefault(); state.moving[keyMap[event.key]] = true;
    }
    if ((event.key === "e" || event.key === "E" || event.key === " " || event.key === "Enter") && state.started && state.activeView === "throne" && $("#dialogue").classList.contains("hidden")) {
      event.preventDefault(); interact();
    }
    if (event.key === "Escape" && !$("#dialogue").classList.contains("hidden")) closeDialogue();
  });
  window.addEventListener("keyup", (event) => { if (keyMap[event.key]) state.moving[keyMap[event.key]] = false; });
  window.addEventListener("blur", () => { state.moving = {}; });
  document.querySelectorAll("[data-move]").forEach((button) => {
    const direction = button.dataset.move;
    const start = (event) => { event.preventDefault(); button.setPointerCapture?.(event.pointerId); state.moving[direction] = true; };
    const stop = (event) => { event.preventDefault(); state.moving[direction] = false; };
    button.addEventListener("pointerdown", start);
    button.addEventListener("pointerup", stop);
    button.addEventListener("pointercancel", stop);
    button.addEventListener("lostpointercapture", stop);
    button.addEventListener("contextmenu", (event) => event.preventDefault());
  });
  $("#interact").addEventListener("click", interact);
  $("#dialogue-close").addEventListener("click", () => closeDialogue());
  document.querySelectorAll("[data-view]").forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
  $("#new-game").addEventListener("click", startNewGame);
  $("#continue-game").addEventListener("click", continueGame);
  $("#save-button").addEventListener("click", () => saveGame(true));
  canvas.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && state.started && state.activeView === "throne") {
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const clicked = Object.entries(characters).find(([, person]) => Math.hypot((x - person.x) * rect.width, (y - person.y) * rect.height) < 50);
      if (clicked) {
        state.player.x = bounded(clicked[1].x - 0.065, 0.045, 0.955, state.player.x);
        state.player.y = clicked[1].y;
        drawScene();
        meetCharacter(clicked[0]);
      }
    }
  });
  window.addEventListener("resize", () => drawScene());
  window.addEventListener("pagehide", () => saveGame(false));
  document.addEventListener("visibilitychange", () => { if (document.hidden) saveGame(false); });
  setInterval(() => { if (state.started) saveGame(false); }, 12000);

  updateTitleSavePreview();
  requestAnimationFrame(loop);
})();
