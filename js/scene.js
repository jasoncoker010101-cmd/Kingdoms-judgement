(() => {
  const clamp = (n, low, high) => Math.max(low, Math.min(high, n));

  function drawScene(canvas, state, now) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
    const w = width, h = height, floorY = h * 0.73;
    const pulse = Math.sin(now / 340) * 0.12;

    // Deep stone wall and dusky light from the high windows.
    const wall = ctx.createLinearGradient(0, 0, 0, h);
    wall.addColorStop(0, "#302a29"); wall.addColorStop(0.72, "#211c1c"); wall.addColorStop(1, "#161311");
    ctx.fillStyle = wall; ctx.fillRect(0, 0, w, h);
    const windowY = h * 0.13;
    for (let i = 0; i < 3; i++) {
      const wx = w * (0.18 + i * 0.32), ww = w * 0.105, wh = h * 0.28;
      ctx.fillStyle = "#151312"; ctx.fillRect(wx - 5, windowY - 5, ww + 10, wh + 13);
      ctx.fillStyle = "#4c4050"; ctx.fillRect(wx, windowY, ww, wh);
      ctx.fillStyle = "#726174"; ctx.fillRect(wx + ww * 0.10, windowY + wh * 0.08, ww * 0.80, wh * 0.65);
      ctx.fillStyle = "#d9ad72"; ctx.fillRect(wx + ww * 0.46, windowY, 2, wh);
      ctx.fillRect(wx, windowY + wh * 0.49, ww, 2);
      ctx.fillStyle = "rgba(228,174,106,.08)";
      ctx.beginPath(); ctx.moveTo(wx, windowY + wh); ctx.lineTo(wx + ww, windowY + wh); ctx.lineTo(wx + ww * 1.7, floorY); ctx.lineTo(wx - ww * .6, floorY); ctx.fill();
    }

    // Masonry courses, inset panels and carved arches.
    ctx.strokeStyle = "rgba(205,177,135,.08)"; ctx.lineWidth = 1;
    for (let y = h * 0.08; y < floorY; y += h * 0.085) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      const offset = (Math.floor(y / (h * 0.085)) % 2) * w * 0.09;
      for (let x = -offset; x < w; x += w * 0.18) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + h * .085); ctx.stroke(); }
    }
    const pillars = [0.06, 0.31, 0.69, 0.94];
    for (const p of pillars) {
      const x = w * p, pw = Math.max(16, w * 0.036), top = h * 0.08;
      ctx.fillStyle = "#403630"; ctx.fillRect(x - pw / 2, top, pw, floorY - top);
      ctx.fillStyle = "#645447"; ctx.fillRect(x - pw / 2, top, Math.max(3, pw * .20), floorY - top);
      ctx.fillStyle = "#302722"; ctx.fillRect(x - pw * .78, top - 5, pw * 1.56, 8);
      ctx.fillStyle = "#5f4b3c"; ctx.fillRect(x - pw * .75, floorY - 9, pw * 1.5, 10);
    }

    // House banners and their stitched crown marks.
    for (let i = 0; i < 3; i++) {
      const bx = w * (0.22 + i * 0.28), by = h * 0.23, bw = w * 0.07, bh = h * 0.21;
      ctx.fillStyle = "#6c2631"; ctx.fillRect(bx, by, bw, bh);
      ctx.fillStyle = "#9a3a3d"; ctx.fillRect(bx + 3, by + 2, Math.max(2, bw * .12), bh - 4);
      ctx.fillStyle = "#dbbf7c"; ctx.fillRect(bx + bw * .40, by + bh * .28, bw * .20, bh * .40);
      ctx.fillRect(bx + bw * .24, by + bh * .52, bw * .52, Math.max(2, bh * .06));
    }

    // Throne alcove and stepped dais.
    const tx = w * .5, ty = h * .42;
    ctx.fillStyle = "#171311"; ctx.fillRect(tx - w * .13, ty - h * .12, w * .26, h * .37);
    ctx.fillStyle = "#554237"; ctx.fillRect(tx - w * .115, ty - h * .10, w * .23, h * .35);
    ctx.fillStyle = "#211916"; ctx.fillRect(tx - w * .086, ty - h * .06, w * .172, h * .28);
    ctx.fillStyle = "#755b43"; ctx.fillRect(tx - w * .16, h * .63, w * .32, h * .04);
    ctx.fillStyle = "#4a382d"; ctx.fillRect(tx - w * .135, h * .67, w * .27, h * .06);
    ctx.fillStyle = "#735238"; ctx.fillRect(tx - w * .105, h * .51, w * .21, h * .16);
    ctx.fillStyle = "#c2a365"; ctx.fillRect(tx - w * .11, h * .50, w * .22, h * .016);
    ctx.fillStyle = "#9d7844"; ctx.fillRect(tx - w * .060, h * .39, w * .12, h * .15);
    ctx.fillStyle = "#d4b56e"; ctx.fillRect(tx - w * .074, h * .38, w * .148, h * .025);
    ctx.fillRect(tx - w * .055, h * .34, w * .11, h * .06);
    ctx.fillStyle = "#e3ca8c"; ctx.fillRect(tx - w * .012, h * .31, w * .024, h * .09);
    ctx.fillStyle = "#d3b872"; ctx.font = `bold ${Math.max(10, w * .016)}px Georgia`; ctx.textAlign = "center";
    ctx.fillText("THE THRONE OF AVELORN", tx, h * .10);

    // Wall sconces with small, warm animated flame pixels.
    for (const fx of [w * .11, w * .89]) {
      const fy = h * .39, flicker = Math.sin(now / 105 + fx) * 2;
      ctx.fillStyle = "#8c663f"; ctx.fillRect(fx - 3, fy + 5, 6, h * .08);
      ctx.fillStyle = "#d19348"; ctx.fillRect(fx - 4, fy - 3 + flicker, 8, 10);
      ctx.fillStyle = "#f2d28a"; ctx.fillRect(fx - 1, fy + flicker, 3, 6);
      ctx.fillStyle = `rgba(217,153,75,${0.045 + pulse * .12})`;
      ctx.beginPath(); ctx.arc(fx, fy + 3, w * .055, 0, Math.PI * 2); ctx.fill();
    }

    // Tile floor, long perspective seams, and a worn central runner.
    const floor = ctx.createLinearGradient(0, floorY, 0, h);
    floor.addColorStop(0, "#514035"); floor.addColorStop(1, "#2b221d");
    ctx.fillStyle = floor; ctx.fillRect(0, floorY, w, h - floorY);
    ctx.strokeStyle = "rgba(193,158,113,.19)"; ctx.lineWidth = 1;
    for (let i = 0; i <= 8; i++) {
      const x = w * i / 8; ctx.beginPath(); ctx.moveTo(x, floorY); ctx.lineTo(w / 2 + (x - w / 2) * 1.45, h); ctx.stroke();
    }
    for (let i = 1; i <= 3; i++) { const y = floorY + (h - floorY) * i / 4; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    ctx.fillStyle = "rgba(139,41,46,.48)"; ctx.fillRect(w * .405, floorY + 2, w * .19, h - floorY - 2);
    ctx.fillStyle = "rgba(218,184,113,.44)"; ctx.fillRect(w * .405, floorY + 2, 2, h - floorY - 2); ctx.fillRect(w * .593, floorY + 2, 2, h - floorY - 2);
    for (let y = floorY + h * .035; y < h; y += h * .05) { ctx.fillRect(w * .405, y, w * .19, 1); }

    // A carved writing table and a potted laurel keep the hall inhabited.
    ctx.fillStyle = "#35251c"; ctx.fillRect(w * .78, h * .61, w * .09, h * .07);
    ctx.fillStyle = "#a17d4a"; ctx.fillRect(w * .775, h * .60, w * .10, h * .018);
    ctx.fillStyle = "#57402d"; ctx.fillRect(w * .79, h * .67, w * .012, h * .08); ctx.fillRect(w * .85, h * .67, w * .012, h * .08);
    ctx.fillStyle = "#674d34"; ctx.fillRect(w * .12, h * .62, w * .025, h * .10);
    ctx.fillStyle = "#456047"; ctx.fillRect(w * .095, h * .48, w * .075, h * .15);
    ctx.fillStyle = "#5e7651"; ctx.fillRect(w * .11, h * .44, w * .045, h * .08);
    ctx.fillStyle = "#8d713f"; ctx.fillRect(w * .09, h * .61, w * .085, h * .025);

    const nearby = closestCharacter(state.player, window.GAME_CONTENT.characters, w, h, 0.095);
    for (const [id, person] of Object.entries(window.GAME_CONTENT.characters)) {
      drawPerson(ctx, person.x * w, person.y * h, person, id === nearby?.id, id === "ruler", now);
    }
    drawPerson(ctx, state.player.x * w, state.player.y * h, {
      sprite: "#8c3038", hair: "#3d2722", skin: "#dfb38a", accent: "#e1c477", mark: "♛"
    }, false, true, now);

    if (nearby) {
      ctx.fillStyle = "#f2d99f"; ctx.font = `bold ${Math.max(11, w * .016)}px Arial`; ctx.textAlign = "center";
      ctx.fillText(nearby.person.name, nearby.person.x * w, nearby.person.y * h - h * .13);
      const bob = Math.sin(now / 170) * 2;
      ctx.fillStyle = "#f4d48c"; ctx.fillRect(nearby.person.x * w - 4, nearby.person.y * h - h * .105 + bob, 8, 8);
    }

    // Soft top and edge shading frames the miniature set without hiding it.
    const shade = ctx.createLinearGradient(0, 0, 0, h * .19);
    shade.addColorStop(0, "rgba(0,0,0,.32)"); shade.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = shade; ctx.fillRect(0, 0, w, h * .19);
  }

  function closestCharacter(player, characters, w, h, maxDistance) {
    let winner = null, best = maxDistance * Math.max(w, h);
    for (const [id, person] of Object.entries(characters)) {
      const d = Math.hypot((player.x - person.x) * w, (player.y - person.y) * h);
      if (d < best) { best = d; winner = { id, person, distance: d }; }
    }
    return winner;
  }

  function drawPerson(ctx, x, y, person, highlighted, isPlayer, now) {
    const scale = Math.max(0.72, Math.min(1.35, ctx.canvas.clientWidth / 720));
    const unit = Math.max(2, Math.round(3 * scale));
    const bob = isPlayer ? Math.sin(now / 150) * 1.5 * scale : Math.sin(now / 260 + x) * 0.7 * scale;
    y += bob;
    ctx.fillStyle = "rgba(0,0,0,.34)"; ctx.beginPath(); ctx.ellipse(x, y + 1, 14 * scale, 4 * scale, 0, 0, Math.PI * 2); ctx.fill();
    if (highlighted) {
      ctx.strokeStyle = "rgba(239,204,126,.70)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(x, y - 16 * scale, 18 * scale, 32 * scale, 0, 0, Math.PI * 2); ctx.stroke();
    }
    // Shadow, boots, robe, shoulders, neck and face are drawn in crisp pixel blocks.
    ctx.fillStyle = "#211916"; ctx.fillRect(x - 10 * scale, y - 8 * scale, 7 * scale, 10 * scale); ctx.fillRect(x + 3 * scale, y - 8 * scale, 7 * scale, 10 * scale);
    ctx.fillStyle = person.accent || "#c5a468"; ctx.fillRect(x - 11 * scale, y - 38 * scale, 22 * scale, 7 * scale);
    ctx.fillStyle = person.sprite || "#68715d"; ctx.fillRect(x - 12 * scale, y - 34 * scale, 24 * scale, 23 * scale);
    ctx.fillRect(x - 16 * scale, y - 32 * scale, 7 * scale, 12 * scale); ctx.fillRect(x + 9 * scale, y - 32 * scale, 7 * scale, 12 * scale);
    ctx.fillStyle = person.accent || "#c5a468"; ctx.fillRect(x - 2 * scale, y - 32 * scale, 4 * scale, 20 * scale);
    ctx.fillStyle = person.skin || "#d9b08c"; ctx.fillRect(x - 7 * scale, y - 52 * scale, 14 * scale, 15 * scale);
    ctx.fillStyle = person.hair || "#342821"; ctx.fillRect(x - 8 * scale, y - 54 * scale, 16 * scale, 6 * scale); ctx.fillRect(x - 8 * scale, y - 49 * scale, 3 * scale, 8 * scale);
    ctx.fillStyle = "#30251f"; ctx.fillRect(x + 3 * scale, y - 47 * scale, unit, unit);
    if (isPlayer) {
      ctx.fillStyle = "#e0c47c"; ctx.fillRect(x - 8 * scale, y - 60 * scale, 16 * scale, 3 * scale);
      ctx.fillRect(x - 5 * scale, y - 65 * scale, 3 * scale, 6 * scale); ctx.fillRect(x + 2 * scale, y - 65 * scale, 3 * scale, 6 * scale);
    }
  }

  window.GAME_SCENE = { drawScene, closestCharacter };
})();
