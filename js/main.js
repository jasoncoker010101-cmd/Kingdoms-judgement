(() => {
  const canvas = document.getElementById("scene");
  const ctx = canvas.getContext("2d");
  const state = { day: 1, gold: 100, food: 80, stability: 45, x: 0.22, y: 0.78, moving: {}, dialogue: false, captainMet: false };
  const captain = { x: 0.73, y: 0.78 };
  let width = 800, height = 440, last = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width; height = rect.height;
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }
  function drawPerson(x, y, color, isCaptain) {
    const px = x * width, py = y * height;
    ctx.fillStyle = "#17100c"; ctx.fillRect(px - 12, py - 42, 25, 45);
    ctx.fillStyle = "#d9b58b"; ctx.beginPath(); ctx.arc(px, py - 48, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = color; ctx.fillRect(px - 12, py - 38, 24, 29);
    ctx.fillStyle = "#2b2119"; ctx.fillRect(px - 11, py - 9, 8, 12); ctx.fillRect(px + 3, py - 9, 8, 12);
    if (isCaptain) { ctx.fillStyle = "#e5c47e"; ctx.fillRect(px - 14, py - 39, 28, 5); }
  }
  function draw() {
    ctx.clearRect(0, 0, width, height);
    const g = ctx.createLinearGradient(0,0,0,height); g.addColorStop(0,"#29221e"); g.addColorStop(1,"#100e0d"); ctx.fillStyle=g;ctx.fillRect(0,0,width,height);
    ctx.fillStyle="#49392b";ctx.fillRect(0,height*.82,width,height*.18);
    ctx.fillStyle="#766044";ctx.fillRect(0,height*.79,width,height*.025);
    // Tall stone pillars and banners
    for(let i=0;i<5;i++){const x=width*(.08+i*.21);ctx.fillStyle="#5b4939";ctx.fillRect(x,height*.12,width*.045,height*.68);ctx.fillStyle="#887158";ctx.fillRect(x+5,height*.12,5,height*.68);ctx.fillStyle="#7a2630";ctx.fillRect(x+width*.045,height*.18,16,65);ctx.fillStyle="#d7b36e";ctx.fillRect(x+width*.045+6,height*.25,4,28);}
    // Throne dais
    ctx.fillStyle="#685039";ctx.fillRect(width*.39,height*.56,width*.23,height*.25);ctx.fillStyle="#a48657";ctx.fillRect(width*.37,height*.53,width*.27,12);
    ctx.fillStyle="#b58c4c";ctx.fillRect(width*.455,height*.30,width*.11,height*.23);ctx.fillStyle="#d7b56f";ctx.fillRect(width*.47,height*.25,width*.08,height*.07);
    ctx.fillStyle="#d4b77f";ctx.font="bold 15px Georgia";ctx.textAlign="center";ctx.fillText("THE THRONE OF AVELORN",width/2,height*.09);
    drawPerson(captain.x,captain.y,"#526071",true);drawPerson(state.x,state.y,"#6e2730",false);
    if(Math.hypot((state.x-captain.x)*width,(state.y-captain.y)*height)<75){ctx.fillStyle="#f1d28f";ctx.font="13px Arial";ctx.fillText("Interact",captain.x*width,captain.y*height-65);}
  }
  function updateUI(){document.getElementById("gold").textContent=state.gold;document.getElementById("food").textContent=state.food;document.getElementById("stability").textContent=state.stability;document.getElementById("day-label").textContent="Day "+state.day+" · Morning";}
  function showDialogue(text, choices){document.getElementById("dialogue-text").textContent=text;const box=document.getElementById("choices");box.replaceChildren();choices.forEach(c=>{const b=document.createElement("button");b.textContent=c.label;b.addEventListener("click",()=>{c.action();document.getElementById("dialogue").classList.add("hidden");state.dialogue=false;updateUI();draw();});box.appendChild(b);});document.getElementById("dialogue").classList.remove("hidden");state.dialogue=true;}
  function meetCaptain(){if(Math.hypot((state.x-captain.x)*width,(state.y-captain.y)*height)>82){document.getElementById("hint").textContent="Move closer to Captain Aldric to speak.";return;}showDialogue("Your Majesty. Three caravans have failed to arrive from the eastern road. I need permission to respond before the merchants abandon the route.",[
    {label:"Send a full patrol (−25 gold)",action:()=>{state.gold-=25;state.stability+=5;document.getElementById("footer-note").textContent="Aldric gathers a full patrol. The merchants are cautiously relieved.";}},
    {label:"Send a small team (−10 gold)",action:()=>{state.gold-=10;state.stability+=2;document.getElementById("footer-note").textContent="A smaller patrol rides east. It may not be enough.";}},
    {label:"Investigate first",action:()=>{state.stability+=1;document.getElementById("footer-note").textContent="Aldric agrees to gather reports before committing soldiers.";}},
    {label:"Refuse for now",action:()=>{state.stability-=3;document.getElementById("footer-note").textContent="Aldric leaves disappointed. The eastern road remains uncertain.";}}
  ]);}
  function interact(){if(state.dialogue)return;meetCaptain();}
  function move(dt){if(state.dialogue)return;let dx=0,dy=0;if(state.moving.left)dx--;if(state.moving.right)dx++;if(state.moving.up)dy--;if(state.moving.down)dy++;const len=Math.hypot(dx,dy)||1;state.x=Math.max(.04,Math.min(.96,state.x+dx/len*dt*.00022));state.y=Math.max(.48,Math.min(.82,state.y+dy/len*dt*.00022));}
  function loop(t){const dt=Math.min(32,t-last||16);last=t;move(dt);draw();requestAnimationFrame(loop);}
  const keyMap={ArrowUp:"up",w:"up",ArrowDown:"down",s:"down",ArrowLeft:"left",a:"left",ArrowRight:"right",d:"right"};
  window.addEventListener("keydown",e=>{if(keyMap[e.key]){e.preventDefault();state.moving[keyMap[e.key]]=true;}if(e.key===" "||e.key==="Enter"){e.preventDefault();interact();}});
  window.addEventListener("keyup",e=>{if(keyMap[e.key])state.moving[keyMap[e.key]]=false;});
  document.querySelectorAll("[data-move]").forEach(b=>{const dir=b.dataset.move;const start=e=>{e.preventDefault();state.moving[dir]=true;};const stop=e=>{e.preventDefault();state.moving[dir]=false;};b.addEventListener("pointerdown",start);b.addEventListener("pointerup",stop);b.addEventListener("pointercancel",stop);b.addEventListener("pointerleave",stop);});
  document.getElementById("interact").addEventListener("click",interact);
  document.querySelectorAll("[data-tab]").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("[data-tab]").forEach(x=>x.classList.remove("active"));b.classList.add("active");const tab=b.dataset.tab;document.getElementById("footer-note").textContent=tab==="Throne Room"?"Avelorn is waiting for its new ruler.":tab+" systems will be added in a later development milestone."; }));
  window.addEventListener("resize",resize);
  updateUI();resize();requestAnimationFrame(loop);
})();