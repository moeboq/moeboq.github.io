/* MOE BOQ app shell — layout ค (full-screen model + floating panels).
   Re-arranges the plan tool's existing DOM; all drawing logic stays in the page script. */
(function(){
  var $ = function(id){ return document.getElementById(id); };
  if (!$('plan') || !$('three')) return;
  var PRO_URL = '../pro/#waitlist';
  var P = {
    grid: '<path d="M7 3v18M17 3v18M3 8h18M3 16h18"/>', level: '<path d="M3 8h14M3 16h14"/><path d="M19 6l2 2-2 2M19 14l2 2-2 2"/>',
    wall: '<rect x="3" y="8" width="18" height="8"/><path d="M3 12h18M9 8v4M15 12v4"/>', door: '<path d="M5 21V4h9v17M5 21h14"/><circle cx="11.5" cy="13" r=".8"/>',
    win: '<rect x="4" y="5" width="16" height="14"/><path d="M12 5v14M4 12h16"/>', bath: '<path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M6 12V6a2 2 0 0 1 4 0"/><path d="M7 19l-1 2M17 19l1 2"/>',
    col: '<rect x="9" y="3" width="6" height="18"/><path d="M7 3h10M7 21h10"/>', beam: '<rect x="2" y="9" width="20" height="6"/><path d="M6 9v6M18 9v6"/>',
    fnd: '<rect x="4" y="14" width="16" height="5"/><rect x="10" y="5" width="4" height="9"/>', gb: '<rect x="2" y="13" width="20" height="5"/><path d="M5 13V9M19 13V9"/>',
    wc: '<path d="M7 4h7v6H7zM5 10h12a5 5 0 0 1-5 5H9l1 5H7l-1-5"/>', lav: '<path d="M4 10h16a8 6 0 0 1-16 0z"/><path d="M12 4v4M10 4h4"/>',
    shw: '<path d="M6 21V8a4 4 0 0 1 8 0"/><path d="M11 12h6M12 15v1M15 15v1M18 15v1M13 18v1M16 18v1"/>', fd: '<circle cx="12" cy="12" r="8"/><path d="M8 10h8M8 14h8"/>',
    sink: '<rect x="3" y="10" width="18" height="6"/><path d="M12 10V5h4"/>', meter: '<circle cx="12" cy="13" r="7"/><path d="M12 13l3-3M9 3h6"/>',
    sep: '<rect x="4" y="7" width="16" height="12" rx="3"/><path d="M8 7V4h8v3M4 12h16"/>', lt: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3 11v2h6v-2a6 6 0 0 0-3-11z"/>',
    sw: '<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M12 8v5"/>', so: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 10v3M15 10v3M10 16h4"/>',
    ac: '<rect x="3" y="6" width="18" height="7" rx="2"/><path d="M7 17l-1 3M12 17v3M17 17l1 3"/>', wh: '<rect x="7" y="3" width="10" height="16" rx="3"/><path d="M12 7v5M10 21h4"/>',
    db: '<rect x="5" y="3" width="14" height="18"/><path d="M13 7l-3 5h4l-3 5"/>', erase: '<path d="M4 16l8-8 6 6-6 6H8z"/><path d="M14 20h6"/>',
    plan: '<rect x="3" y="3" width="18" height="18"/><path d="M3 12h9V3M12 12v9"/>', cube: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/>',
    elev: '<path d="M3 20h18M5 20V10l7-6 7 6v10M10 20v-5h4v5"/>', table: '<rect x="3" y="4" width="18" height="16"/><path d="M3 9h18M3 14h18M9 4v16"/>',
    excel: '<rect x="4" y="3" width="16" height="18"/><path d="M8 8l8 8M16 8l-8 8"/>', copy: '<rect x="8" y="8" width="12" height="12"/><path d="M4 16V4h12"/>',
    print: '<path d="M7 9V3h10v6M7 17H4v-8h16v8h-3"/><rect x="7" y="14" width="10" height="7"/>', swap: '<path d="M4 8h13l-3-3M20 16H7l3 3"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h1M3 12h1M3 18h1"/>', sliders: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>'
  };
  var ic = function(n, s){ s = s || 20; return '<svg class="ic" viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[n] || '<circle cx="12" cy="12" r="5"/>') + '</svg>'; };
  var proTag = '<span class="pro-tag">PRO</span>';

  document.documentElement.classList.add('app-mode'); document.body.classList.add('app-mode');
  var h1 = document.querySelector('.wrap > header'); if (h1) h1.classList.add('sr');

  // ---------- shell ----------
  var app = document.createElement('div'); app.id = 'app';
  app.innerHTML =
    '<div class="a-top">' +
      '<a class="a-logo" href="../" aria-label="MOE BOQ หน้าแรก"><i></i>MOE BOQ</a><span class="a-sep"></span>' +
      '<div class="a-proj">วาดแปลนออก BOQ <small>· โปรเจกต์ตัวอย่าง</small></div><span class="a-sp"></span>' +
      '<button type="button" class="a-btn a-tog" data-tog="fl-l">' + ic('list', 16) + '<span class="lbl">โปรเจกต์</span></button>' +
      '<button type="button" class="a-btn a-tog" data-tog="fl-r">' + ic('sliders', 16) + '<span class="lbl">คุณสมบัติ</span></button>' +
      '<button type="button" class="a-btn pri" data-pro="export">' + ic('excel', 16) + '<span class="lbl">ส่งออก</span> ' + proTag + '</button>' +
      '<span class="a-slot"></span>' +
    '</div>' +
    '<div class="a-stage">' +
      '<div class="a-main"><div class="vw vw-plan"></div><div class="vw vw-3d" hidden></div><div class="vw vw-elev" hidden></div><div class="vw vw-boq" hidden></div></div>' +
      '<div class="a-pip"><header><span class="pt">3 มิติ</span><button type="button" class="swap">' + ic('swap', 14) + 'สลับ</button></header><div class="pb"></div></div>' +
      '<section class="fl fl-l" aria-label="ผังโปรเจกต์"><h2>' + ic('list', 14) + 'ผังโปรเจกต์<button type="button" aria-label="ปิด">×</button></h2><div class="fb"></div></section>' +
      '<section class="fl fl-r" aria-label="คุณสมบัติ"><h2>' + ic('sliders', 14) + 'คุณสมบัติ<button type="button" aria-label="ปิด">×</button></h2><div class="fb"></div></section>' +
      '<div class="a-vt" role="group" aria-label="เลือกมุมมอง">' +
        '<button type="button" data-v="plan" aria-pressed="true">' + ic('plan', 16) + 'แปลน</button>' +
        '<button type="button" data-v="3d" aria-pressed="false">' + ic('cube', 16) + '3D</button>' +
        '<button type="button" data-v="elev" aria-pressed="false">' + ic('elev', 16) + 'รูปด้าน/ตัด ' + proTag + '</button>' +
        '<button type="button" data-v="boq" aria-pressed="false">' + ic('table', 16) + 'BOQ</button>' +
      '</div>' +
      '<div class="a-dock"><div class="dg"></div></div>' +
      '<div class="a-bq" aria-live="polite"><small>รวม BOQ (รวมกำไรและ VAT)</small><b class="t">-</b><span class="s"></span><br><button type="button" data-v="boq">ดูตาราง BOQ</button></div>' +
    '</div>';
  document.body.insertBefore(app, document.body.firstChild);
  var q = function(s){ return app.querySelector(s); };

  // move site menu + theme buttons (listeners already bound by site.js)
  var slot = q('.a-slot');
  var tb = document.querySelector('.sitebar .theme-btn'), mb = document.querySelector('.sitebar .menu-btn');
  if (tb) slot.parentNode.insertBefore(tb, slot); if (mb) slot.parentNode.insertBefore(mb, slot);

  // ---------- move the tool's parts ----------
  var planSec = $('plan').closest('section'), threeSec = $('three').closest('section'), elevSec = $('elev').closest('section');
  var boqSec = document.querySelector('section[aria-labelledby="b-h"]');
  var main = { plan: q('.vw-plan'), '3d': q('.vw-3d'), elev: q('.vw-elev'), boq: q('.vw-boq') };
  var pipBody = q('.a-pip .pb');
  var planBox = document.createElement('div'); planBox.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px';
  planBox.appendChild($('plan')); if ($('plegend')) planBox.appendChild($('plegend'));
  var threeBox = $('three');

  // left: project browser = every input section
  var L = q('.fl-l .fb'); document.querySelectorAll('.main details.sec').forEach(function(d){ d.open = false; L.appendChild(d); });
  var first = L.querySelector('details.sec'); if (first) first.open = true;

  // dock: discipline + level + tools
  var dg = q('.a-dock .dg'); dg.appendChild($('disc')); dg.appendChild($('levels')); q('.a-dock').appendChild($('modes'));

  // right: properties
  var R = q('.fl-r .fb');
  R.insertAdjacentHTML('beforeend', '<div class="pk-h"><span class="mi"></span><span class="mn"></span></div>');
  R.appendChild($('pickWrap')); R.appendChild($('mhint'));
  R.insertAdjacentHTML('beforeend', '<div class="sub">แสดงใน 3 มิติ</div>'); var lay = threeSec.querySelector('.layers'); if (lay) R.appendChild(lay);
  R.insertAdjacentHTML('beforeend', '<div class="sub">สรุป</div>'); var kp = boqSec.querySelector('.kpis'); if (kp) R.appendChild(kp);
  R.appendChild($('dtot')); R.appendChild($('warn'));

  // views
  var ev = elevSec.querySelector('.evbar'), etw = elevSec.querySelector('.tablewrap');
  main.boq.appendChild(boqSec); var note = document.querySelector('.main .note'); if (note) main.boq.appendChild(note);
  var cta = document.querySelector('.main .cta'); if (cta) cta.remove();
  // elevation is PRO: keep the drawing hidden behind a lock card
  var lock = document.createElement('div'); lock.className = 'locked';
  lock.innerHTML = proTag + '<b>รูปด้าน 4 ด้านและรูปตัดอยู่ใน PRO</b><span>PRO เปิดเร็วๆ นี้ ลงชื่อรอไว้ แล้วจะแจ้งเมื่อเปิด</span><div><a class="a-btn pri" href="' + PRO_URL + '">ลงชื่อรอ PRO</a></div>';
  main.elev.appendChild(lock); if (ev) { ev.style.display = 'none'; main.elev.appendChild(ev); } if (etw) { etw.style.display = 'none'; main.elev.appendChild(etw); }

  var cur = 'plan', pip = q('.a-pip'), pipT = q('.a-pip .pt');
  function show(v){
    cur = v;
    Object.keys(main).forEach(function(k){ main[k].hidden = k !== v; });
    app.querySelectorAll('.a-vt button').forEach(function(b){ b.setAttribute('aria-pressed', String(b.dataset.v === v)); });
    if (v === 'plan'){ main.plan.appendChild(planBox); pipBody.appendChild(threeBox); pipT.textContent = '3 มิติ'; pip.hidden = false; }
    else if (v === '3d'){ main['3d'].appendChild(threeBox); pipBody.appendChild(planBox); pipT.textContent = 'แปลน · คลิกเพื่อวาด'; pip.hidden = false; }
    else { pip.hidden = true; }
    q('.a-stage').classList.toggle('has-pip', !pip.hidden);
    try { localStorage.setItem('moe-app-view', v); } catch (e) {}
  }
  app.addEventListener('click', function(e){
    var b = e.target.closest('[data-v]'); if (b && app.contains(b)) { show(b.dataset.v); return; }
    if (e.target.closest('.a-pip .swap')) { show(cur === 'plan' ? '3d' : 'plan'); return; }
    var t = e.target.closest('[data-tog]'); if (t) { var p = q('.' + t.dataset.tog); var o = !p.classList.contains('open'); app.querySelectorAll('.fl').forEach(function(x){ x.classList.remove('open'); }); p.classList.toggle('open', o); return; }
    if (e.target.closest('.fl > h2 button')) e.target.closest('.fl').classList.remove('open');
  });
  var saved = 'plan'; try { saved = localStorage.getItem('moe-app-view') || 'plan'; } catch (e) {}
  show(saved === 'elev' ? 'plan' : saved);

  // ---------- tool icons + current-tool header ----------
  var modes = $('modes');
  function deco(){
    modes.querySelectorAll('label').forEach(function(l){ if (l.querySelector('.ic')) return; var v = (l.getAttribute('for') || '').replace('md_', ''); l.insertAdjacentHTML('afterbegin', ic(v, 22)); });
    var c = modes.querySelector('input:checked'); if (!c) return;
    var lab = modes.querySelector('label[for="' + c.id + '"]');
    q('.pk-h .mi').innerHTML = ic(c.value, 18); q('.pk-h .mn').textContent = lab ? lab.textContent.trim() : '';
  }
  new MutationObserver(deco).observe(modes, { childList: true }); modes.addEventListener('change', function(){ deco(); if (cur !== 'plan' && cur !== '3d') show('plan'); }); deco();
  // picking a tool while looking at BOQ / elevations brings the plan back
  modes.addEventListener('click', function(){ if (cur === 'boq' || cur === 'elev') show('plan'); });

  // ---------- totals card ----------
  var tot = $('kTot'), area = $('kArea'), psm = $('kPsm');
  function card(){ q('.a-bq .t').textContent = tot.textContent; q('.a-bq .s').textContent = (area ? area.textContent : '') + (psm ? ' · ' + psm.textContent : ''); }
  [tot, area, psm].forEach(function(el){ if (el) new MutationObserver(card).observe(el, { childList: true, characterData: true, subtree: true }); }); card();

  // ---------- PRO locks: elevations, copy / export ----------
  var modal = document.createElement('div'); modal.className = 'pro-modal'; modal.hidden = true;
  modal.innerHTML = '<div class="box" role="dialog" aria-modal="true" aria-labelledby="pm-h">' + proTag + '<h2 id="pm-h">ฟีเจอร์นี้อยู่ใน PRO · เปิดเร็วๆ นี้</h2><p>PRO จะปลดล็อกรูปด้าน 4 ด้าน รูปตัด และส่งออก BOQ เป็น Excel / PDF ลงชื่อรอไว้ แล้วจะแจ้งเมื่อเปิด</p><div class="actions"><a class="a-btn pri" href="' + PRO_URL + '">ลงชื่อรอ PRO</a><button type="button" class="a-btn">ปิด</button></div></div>';
  document.body.appendChild(modal);
  var openPro = function(){ modal.hidden = false; modal.querySelector('a').focus(); };
  modal.addEventListener('click', function(e){ if (e.target === modal || e.target.matches('button')) modal.hidden = true; });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') { modal.hidden = true; app.querySelectorAll('.fl').forEach(function(x){ x.classList.remove('open'); }); } });
  var copy = $('copy'); if (copy) copy.insertAdjacentHTML('beforeend', ' ' + proTag);
  document.addEventListener('click', function(e){
    if (!e.target.closest) return;
    var t = e.target.closest('#copy, [data-pro]');
    if (!t) return; e.preventDefault(); e.stopImmediatePropagation(); openPro();
  }, true);

  // first-visit tip
  var tip = 0; try { tip = +localStorage.getItem('moe-app-tip'); } catch (e) {}
  if (!tip) { var hint = $('mhint'); if (hint) hint.insertAdjacentHTML('beforebegin', '<p class="tipx" style="margin:0;padding:8px 10px;border-radius:8px;background:rgba(120,1,1,.12);color:var(--a);font-size:12.5px;font-weight:600">เลือกเครื่องมือจากแถบล่าง แล้วคลิกในแปลนเพื่อวาด · ดูผลใน 3D มุมซ้ายล่าง</p>'); try { localStorage.setItem('moe-app-tip', '1'); } catch (e) {} }
})();
