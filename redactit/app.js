
/* ===== Helpers ===== */
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

/* Elements */
const fileInput = $('#file');
const openBtn = $('#openBtn');
const fitBtn = $('#fitBtn');
const undoBtn = $('#undoBtn');
const redoBtn = $('#redoBtn');
const resetBtn = $('#resetBtn');
const panicBtn = $('#panicBtn');
const saveBtn = $('#saveBtn');
const fmt = $('#format');
const qlt = $('#quality');

const mosaicSize = $('#mosaicSize');
const blurRadius = $('#blurRadius');
const brush = $('#brush');

const stage = $('#stage');
const wrap = $('#canWrap');
const hint = $('#hint');
const base = $('#base');
const overlay = $('#overlay');
const bctx = base.getContext('2d', { willReadFrequently:true });
const octx = overlay.getContext('2d');

const imgInfo = $('#imgInfo');

const expand = $('#expand');
const expandVal = $('#expandVal');
const scale = $('#scale');
const scaleVal = $('#scaleVal');
const autoFit = $('#autoFit');
const confirmPanic = $('#confirmPanic');
const highAssurance = $('#highAssurance');

const liveURLs = new Set();

/* ===== State ===== */
const POLY_DOT_R = 6;    // visual radius
const POLY_SNAP_R = 18;  // hitbox to close polygon
let state = {
  tool:'rect', style:'black', drawing:false,
  start:null, points:[], poly:[],
  history:[], future:[], maxHistory:25,
  rafPending:false, imageLoaded:false, filenameBase:'image'
};

/* ===== UI wiring ===== */
function setActive(list, attr, val){ list.forEach(b => b.classList.toggle('active', b.dataset[attr] === val)); }
function setTool(val){ state.tool = val; setActive($$('[data-tool]'), 'tool', val); }
function setStyle(val){ state.style = val; setActive($$('[data-style]'), 'style', val); }
setTool('rect'); setStyle('black');

openBtn.addEventListener('click', ()=>fileInput.click());
fileInput.addEventListener('change', e=>{
  const f = e.target.files && e.target.files[0];
  if (!f || !f.type.startsWith('image/')) return;
  const url = URL.createObjectURL(f); liveURLs.add(url);
  const img = new Image();
  img.onload = ()=>{
    try{ URL.revokeObjectURL(url); liveURLs.delete(url);}catch{}
    initCanvas(img);
    state.filenameBase = (f.name || 'image').replace(/\.[^.]+$/, '');
  };
  img.onerror = ()=>{ try{ URL.revokeObjectURL(url); liveURLs.delete(url);}catch{} };
  img.src = url;
});

$$('[data-tool]').forEach(b=> b.addEventListener('click', ()=> setTool(b.dataset.tool)));
$$('[data-style]').forEach(b=> b.addEventListener('click', ()=> setStyle(b.dataset.style)));
fitBtn.addEventListener('click', fitToStage);
undoBtn.addEventListener('click', undo);
redoBtn.addEventListener('click', redo);
resetBtn.addEventListener('click', resetImage);
panicBtn.addEventListener('click', ()=>{ if (confirmPanic.checked && !confirm('Wipe the current image, history, and links?')) return; selfDestruct(); });
saveBtn.addEventListener('click', saveOut);

expand.addEventListener('input', ()=> expandVal.textContent = `${expand.value} px`);
scale.addEventListener('input', ()=> scaleVal.textContent = `${scale.value}%`);
expandVal.textContent = `${expand.value} px`;
scaleVal.textContent = `${scale.value}%`;

/* ===== Stage & drag/drop hardening ===== */
['dragenter','dragover'].forEach(ev => stage.addEventListener(ev, e=>{ e.preventDefault(); stage.style.outline='2px solid var(--accent)'; }));
['dragleave','drop'].forEach(ev => stage.addEventListener(ev, e=>{ e.preventDefault(); stage.style.outline=''; }));
stage.addEventListener('drop', e=>{
  const f = e.dataTransfer.files && e.dataTransfer.files[0];
  if (f && f.type.startsWith('image/')) { fileInput.files = e.dataTransfer.files; fileInput.dispatchEvent(new Event('change')); }
});
document.addEventListener('dragover', e=>e.preventDefault());
document.addEventListener('drop', e=>{ if (e.target===document || e.target===document.body) e.preventDefault(); });

/* ===== Canvas init ===== */
function initCanvas(img){
  base.width = img.naturalWidth || img.width;
  base.height = img.naturalHeight || img.height;
  overlay.width = base.width;
  overlay.height = base.height;
  bctx.clearRect(0,0,base.width,base.height);
  bctx.drawImage(img, 0, 0, base.width, base.height);
  octx.clearRect(0,0,overlay.width,overlay.height);
  wrap.style.display = '';
  hint.style.display = 'none';
  if (autoFit.checked) fitToStage();
  clearHistory(); pushHistory(); // original snapshot
  state.imageLoaded = true;
  updateInfo();
}
function updateInfo(){
  if (!base.width) { imgInfo.textContent = 'No image'; return; }
  const mb = (base.width * base.height * 4 / 1048576).toFixed(1);
  imgInfo.textContent = `${state.filenameBase} — ${base.width}×${base.height}px · ~${mb}MB`;
}
function fitToStage(){
  if (!base.width) return;
  const w = stage.clientWidth - 24;
  const s = Math.min(1, w / base.width);
  base.style.width = Math.round(base.width*s)+'px';
  overlay.style.width = base.style.width;
  overlay.style.height = base.style.height;
}
new ResizeObserver(()=>{ overlay.style.width = base.style.width; overlay.style.height = base.style.height; }).observe(base);

/* ===== Pointer mapping ===== */
function getPointer(e){
  const r = base.getBoundingClientRect();
  const cx = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
  const cy = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
  const sx = base.width / r.width, sy = base.height / r.height;
  return { x: Math.max(0, Math.min(base.width,  cx*sx)), y: Math.max(0, Math.min(base.height, cy*sy)) };
}

/* ===== Overlay rendering (separate canvas) ===== */
function scheduleOverlay(){ if (state.rafPending) return; state.rafPending = true; requestAnimationFrame(()=>{ state.rafPending=false; drawOverlay(); }); }
function drawOverlay(){
  octx.clearRect(0,0,overlay.width,overlay.height);
  const a = state.start, z = state.points[state.points.length-1];
  octx.save();
  octx.strokeStyle = 'rgba(96,165,250,0.95)';
  octx.fillStyle = 'rgba(96,165,250,0.18)';
  octx.lineWidth = 2;

  if (state.tool === 'rect' && a && z) {
    const {x,y,w,h} = rectFrom(a,z); roundRect(octx,x,y,w,h,2,true,true);
  } else if (state.tool === 'ellipse' && a && z) {
    const {x,y,w,h} = rectFrom(a,z); octx.beginPath(); octx.ellipse(x+w/2,y+h/2,Math.max(1,w/2),Math.max(1,h/2),0,0,Math.PI*2); octx.fill(); octx.stroke();
  } else if (state.tool === 'free' && state.points.length) {
    octx.beginPath(); octx.moveTo(state.points[0].x, state.points[0].y); for (let i=1;i<state.points.length;i++) octx.lineTo(state.points[i].x, state.points[i].y); octx.stroke();
  } else if (state.tool === 'poly') {
    if (state.poly.length) {
      // edges
      octx.beginPath(); octx.moveTo(state.poly[0].x, state.poly[0].y);
      for (let i=1;i<state.poly.length;i++) octx.lineTo(state.poly[i].x, state.poly[i].y);
      octx.stroke();
      // live segment
      if (state.points.length) {
        const p = state.points[state.points.length-1];
        const last = state.poly[state.poly.length-1];
        if (last) { octx.beginPath(); octx.moveTo(last.x,last.y); octx.lineTo(p.x,p.y); octx.stroke(); }
        // snap ring if near start
        if (state.poly.length >= 3 && dist(p, state.poly[0]) <= POLY_SNAP_R) {
          octx.beginPath(); octx.strokeStyle = '#22c55e'; octx.lineWidth = 2;
          octx.arc(state.poly[0].x, state.poly[0].y, POLY_SNAP_R, 0, Math.PI*2); octx.stroke();
        }
      }
      // vertices
      drawPolyDot(state.poly[0], true);
      for (let i=1;i<state.poly.length;i++) drawPolyDot(state.poly[i], false);
    }
  }
  octx.restore();
}
function drawPolyDot(pt, isStart){
  if (!pt) return;
  octx.save();
  octx.beginPath();
  octx.fillStyle = isStart ? '#22c55e' : '#60a5fa';
  octx.strokeStyle = '#0b0d10';
  octx.lineWidth = 2;
  octx.arc(pt.x, pt.y, POLY_DOT_R, 0, Math.PI*2);
  octx.fill(); octx.stroke();
  octx.restore();
}
function rectFrom(a,b){ const x=Math.min(a.x,b.x), y=Math.min(a.y,b.y), w=Math.abs(b.x-a.x), h=Math.abs(b.y-a.y); return {x,y,w,h}; }
function roundRect(c,x,y,w,h,r=0,fill=false,stroke=true){
  const rr=Math.min(r,Math.min(w,h)/2);
  c.beginPath();
  c.moveTo(x+rr,y);
  c.lineTo(x+w-rr,y); c.quadraticCurveTo(x+w,y,x+w,y+rr);
  c.lineTo(x+w,y+h-rr); c.quadraticCurveTo(x+w,y+h,x+w-rr,y+h);
  c.lineTo(x+rr,y+h); c.quadraticCurveTo(x,y+h,x,y+h-rr);
  c.lineTo(x,y+rr); c.quadraticCurveTo(x,y,x+rr,y);
  if (fill) c.fill(); if (stroke) c.stroke();
}
function dist(a,b){ const dx=a.x-b.x, dy=a.y-b.y; return Math.hypot(dx,dy); }

/* ===== Pointer events ===== */
stage.addEventListener('mousedown', e=>{
  if (!state.imageLoaded) return;
  if (state.tool === 'poly') {
    const p = getPointer(e);
    // close if clicking near start and >=3 points
    if (state.poly.length >= 3 && dist(p, state.poly[0]) <= POLY_SNAP_R) {
      commitPolygon(); return;
    }
    // add vertex
    state.poly.push(p);
    state.points = [p];
    scheduleOverlay();
    return;
  }
  state.drawing = true; state.start = getPointer(e); state.points = [state.start]; scheduleOverlay();
});
stage.addEventListener('mousemove', e=>{
  if (state.tool === 'poly') {
    if (!state.poly.length) return;
    state.points = [getPointer(e)];
    scheduleOverlay(); return;
  }
  if (!state.drawing) return;
  const p = getPointer(e);
  const last = state.points[state.points.length-1];
  if (!last || Math.hypot(p.x-last.x, p.y-last.y) > 2) state.points.push(p);
  scheduleOverlay();
});
window.addEventListener('mouseup', ()=>{
  if (state.tool !== 'poly' && state.drawing) {
    state.drawing = false;
    commitShape();
    octx.clearRect(0,0,overlay.width,overlay.height);
    state.points = [];
  }
});
stage.addEventListener('dblclick', ()=>{ if (state.tool==='poly' && state.poly.length>=3) { commitPolygon(); }});
window.addEventListener('keydown', e=>{
  if (e.key==='Enter' && state.tool==='poly' && state.poly.length>=3) commitPolygon();
  if (e.key==='Escape' && state.tool==='poly') { state.poly=[]; octx.clearRect(0,0,overlay.width,overlay.height); }
});

/* ===== Commit redactions ===== */
function commitShape(){
  pushHistory();
  const mask = makeMask(); const mx = mask.getContext('2d');
  mx.fillStyle = '#fff'; mx.strokeStyle = '#fff'; mx.lineJoin='round'; mx.lineCap='round';
  const a = state.start, z = state.points[state.points.length-1];
  if (!a || !z) return;
  if (state.tool === 'rect') {
    const {x,y,w,h} = rectFrom(a,z); roundRect(mx, x,y,w,h, 0, true, false);
  } else if (state.tool === 'ellipse') {
    const {x,y,w,h} = rectFrom(a,z); mx.beginPath(); mx.ellipse(x+w/2,y+h/2, Math.max(1,w/2), Math.max(1,h/2), 0,0,Math.PI*2); mx.fill();
  } else if (state.tool === 'free') {
    const size = +brush.value; mx.lineWidth = size; mx.beginPath(); mx.moveTo(state.points[0].x, state.points[0].y); for (let i=1;i<state.points.length;i++) mx.lineTo(state.points[i].x, state.points[i].y); mx.stroke();
  }
  applyMaskedEffect(mask);
}
function commitPolygon(){
  pushHistory();
  const mask = makeMask(); const mx = mask.getContext('2d');
  mx.fillStyle = '#fff';
  mx.beginPath(); mx.moveTo(state.poly[0].x, state.poly[0].y); for (let i=1;i<state.poly.length;i++) mx.lineTo(state.poly[i].x, state.poly[i].y);
  mx.closePath(); mx.fill();
  applyMaskedEffect(mask);
  state.poly = [];
  octx.clearRect(0,0,overlay.width,overlay.height);
}

/* ===== Mask + Effects ===== */
function makeMask(){ const c = document.createElement('canvas'); c.width = base.width; c.height = base.height; c.getContext('2d').clearRect(0,0,c.width,c.height); return c; }
function dilateMask(mask, r){ if (!r) return mask; const out = document.createElement('canvas'); out.width = mask.width; out.height = mask.height; const ctx = out.getContext('2d'); for (let dy=-r; dy<=r; dy++){ for (let dx=-r; dx<=r; dx++){ if (dx*dx + dy*dy <= r*r) ctx.drawImage(mask, dx, dy); } } return out; }

function applyMaskedEffect(mask){
  // Optional expansion & minimums for high-assurance blur
  const epx = Math.max(+expand.value || 0, (highAssurance.checked && state.style==='blur') ? 2 : 0);
  const m = epx ? dilateMask(mask, epx) : mask;

  if (state.style === 'black') {
    // Guaranteed opaque fill (no outline residue)
    const paint = document.createElement('canvas'); paint.width = base.width; paint.height = base.height; const px = paint.getContext('2d');
    px.globalAlpha = 1; px.fillStyle = '#000'; px.fillRect(0,0,paint.width,paint.height);
    px.globalCompositeOperation = 'destination-in'; px.drawImage(m,0,0);
    bctx.save(); bctx.globalCompositeOperation = 'source-over'; bctx.drawImage(paint,0,0); bctx.restore();
    return;
  }

  if (state.style === 'mosaic') {
    const block = +mosaicSize.value;
    const pixels = pixelateCanvas(base, block);
    const x = pixels.getContext('2d'); x.globalCompositeOperation = 'destination-in'; x.drawImage(m,0,0);
    bctx.drawImage(pixels, 0, 0);
    return;
  }

  // blur
  const radiusPx = Math.max(+blurRadius.value, (highAssurance.checked ? 18 : 0));
  const blur = document.createElement('canvas'); blur.width = base.width; blur.height = base.height; const bx = blur.getContext('2d');
  bx.filter = `blur(${radiusPx}px)`; bx.drawImage(base, 0, 0);
  bx.globalCompositeOperation = 'destination-in'; bx.drawImage(m,0,0);
  bctx.drawImage(blur, 0, 0);
}

function pixelateCanvas(source, blockSize){
  const w = source.width, h = source.height;
  const small = document.createElement('canvas'); small.width = Math.max(1, Math.floor(w / blockSize)); small.height = Math.max(1, Math.floor(h / blockSize));
  const sctx = small.getContext('2d'); sctx.imageSmoothingEnabled = false; sctx.drawImage(source, 0, 0, w, h, 0, 0, small.width, small.height);
  const big = document.createElement('canvas'); big.width = w; big.height = h; const b = big.getContext('2d'); b.imageSmoothingEnabled = false; b.drawImage(small,0,0,small.width,small.height,0,0,w,h);
  return big;
}

/* ===== History (undo/redo) ===== */
function pushHistory(){
  try{
    const px = base.width * base.height; if (px > 40_000_000) state.maxHistory = 5;
    const snap = bctx.getImageData(0,0,base.width,base.height);
    state.history.push(snap);
    if (state.history.length > state.maxHistory) { const gone = state.history.shift(); try{ gone.data.fill(0);}catch{} }
    state.future.forEach(im=>{ try{ im.data.fill(0);}catch{} }); state.future = [];
    updateUndoRedo();
  } catch(e){ console.warn('History snapshot failed', e); state.future=[]; updateUndoRedo(); }
}
function undo(){ if (state.history.length <= 1) return; const cur = state.history.pop(); state.future.push(cur); const prev = state.history[state.history.length-1]; if (prev) bctx.putImageData(prev,0,0); updateUndoRedo(); }
function redo(){ if (!state.future.length) return; const next = state.future.pop(); state.history.push(next); bctx.putImageData(next,0,0); updateUndoRedo(); }
function updateUndoRedo(){ undoBtn.disabled = state.history.length <= 1; redoBtn.disabled = state.future.length === 0; }
function clearHistory(){ state.history.forEach(im=>{ try{ im.data.fill(0);}catch{} }); state.future.forEach(im=>{ try{ im.data.fill(0);}catch{} }); state.history=[]; state.future=[]; updateUndoRedo(); }
function resetImage(){ if (!state.history[0]) return; bctx.putImageData(state.history[0],0,0); clearHistory(); pushHistory(); }

/* ===== Save / Panic ===== */
function saveOut(){
  if (!base.width) return;
  const type = fmt.value, quality = +qlt.value;
  const scl = (parseInt(scale.value,10) || 100) / 100;
  const out = (scl===1) ? base : (()=>{ const c=document.createElement('canvas'); c.width=Math.max(1,Math.round(base.width*scl)); c.height=Math.max(1,Math.round(base.height*scl)); const cx=c.getContext('2d'); cx.imageSmoothingEnabled=false; cx.drawImage(base,0,0,base.width,base.height,0,0,c.width,c.height); return c; })();
  const safeName = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())) + '.' + type.split('/')[1].replace('jpeg','jpg');
  out.toBlob((blob)=>{ if (!blob) return; const href = URL.createObjectURL(blob); liveURLs.add(href); const a = document.createElement('a'); a.href = href; a.download = safeName; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>{ try{ URL.revokeObjectURL(href); liveURLs.delete(href);}catch{} }, 1500); }, type, (type==='image/png')? undefined : quality);
}
function selfDestruct(){
  try{ if (base.width && base.height){ const id=bctx.getImageData(0,0,base.width,base.height); id.data.fill(0); bctx.putImageData(id,0,0);} }catch{}
  base.width = base.height = 1; overlay.width = overlay.height = 1;
  clearHistory();
  for (const u of Array.from(liveURLs)){ try{ URL.revokeObjectURL(u);}catch{} liveURLs.delete(u); }
  fileInput.value=''; state = { ...state, imageLoaded:false, poly:[], points:[] };
  wrap.style.display='none'; hint.style.display=''; imgInfo.textContent='No image';
}

/* ===== Keyboard ===== */
window.addEventListener('keydown', e=>{
  if (e.target && ['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName)) return;
  const k = e.key.toLowerCase();
  if (e.shiftKey && k==='escape') { e.preventDefault(); selfDestruct(); return; }
  if (k==='o') { e.preventDefault(); openBtn.click(); }
  else if (k==='r') setTool('rect');
  else if (k==='e') setTool('ellipse');
  else if (k==='f') setTool('free');
  else if (k==='p') setTool('poly');
  else if (k==='b') setStyle('black');
  else if (k==='m') setStyle('mosaic');
  else if (k==='g') setStyle('blur');
  else if ((e.metaKey||e.ctrlKey) && k==='z') { e.preventDefault(); if (e.shiftKey) redo(); else undo(); }
  else if ((e.metaKey||e.ctrlKey) && k==='y') { e.preventDefault(); redo(); }
  else if (k==='s') { e.preventDefault(); saveOut(); }
});
