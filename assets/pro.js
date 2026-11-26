/* MOE BOQ — Free / PRO features on the plan tool.
   LAUNCH_FREE = true  : PRO features open to everyone (launch period), marked with a PRO tag.
   LAUNCH_FREE = false : PRO features are locked and point to the PRO page. */
(function(){
  var LAUNCH_FREE = false;
  var PRO_URL = '../pro/';
  var $ = function(id){ return document.getElementById(id); };
  if (!$('plan') || !$('tb')) return;

  var tag = function(){ var s = document.createElement('span'); s.className = 'pro-tag'; s.textContent = 'PRO'; return s; };

  // banner under the site bar
  var bar = document.querySelector('.sitebar');
  var bn = document.createElement('div'); bn.className = 'pro-banner';
  bn.innerHTML = LAUNCH_FREE
    ? '<span class="pro-tag">PRO</span><span><b>ช่วงเปิดตัว</b> ฟีเจอร์ PRO ใช้ได้ฟรีทั้งหมด ไม่ต้องสมัคร</span><a href="' + PRO_URL + '">ฟรีกับ PRO ต่างกันยังไง →</a>'
    : '<span class="pro-tag">FREE</span><span>ใช้ฟรี: วาดงานโครงสร้างและดู BOQ บนหน้าจอ · <b>PRO เร็วๆ นี้</b> งานสถาปัตย์ ระบบ รูปด้าน รูปตัด 3 มิติ และดาวน์โหลด Excel / PDF</span><a href="' + PRO_URL + '#waitlist">ลงชื่อรอ PRO →</a>';
  if (bar) bar.insertAdjacentElement('afterend', bn);

  // PRO tags: discipline tabs (re-rendered by the app), 3D and elevation panels
  var disc = $('disc');
  var badge = function(){ disc.querySelectorAll('button[data-d]').forEach(function(b){ if (b.dataset.d !== 'str' && !b.querySelector('.pro-tag')) b.appendChild(tag()); }); };
  badge(); new MutationObserver(badge).observe(disc, { childList: true });
  ['t-h', 'e-h'].forEach(function(id){ var h = $(id); if (h) h.appendChild(tag()); });

  // export buttons next to "copy to Excel"
  var copy = $('copy'); copy.appendChild(tag());
  var mk = function(label){ var b = document.createElement('button'); b.type = 'button'; b.className = 'btn ghost'; b.textContent = label; b.appendChild(tag()); return b; };
  var bx = mk('ดาวน์โหลด Excel '), bp = mk('พิมพ์ / PDF ');
  copy.insertAdjacentElement('afterend', bp); copy.insertAdjacentElement('afterend', bx);

  bx.addEventListener('click', function(){
    var head = document.querySelector('section[aria-labelledby="b-h"] thead'), tb = $('tb');
    var tot = ($('kTot') || {}).textContent || '', area = ($('kArea') || {}).textContent || '';
    var d = new Date(), ds = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    var html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"></head><body>' +
      '<table><tr><td colspan="4"><b>BOQ จาก MOE BOQ · วาดแปลนออก BOQ</b></td></tr><tr><td>วันที่</td><td>' + ds + '</td></tr><tr><td>พื้นที่ใช้สอย</td><td>' + area + '</td></tr><tr><td>ราคารวม</td><td>' + tot + '</td></tr><tr><td></td></tr></table>' +
      '<table border="1">' + (head ? head.outerHTML : '') + '<tbody>' + tb.innerHTML + '</tbody></table>' +
      '<p>ราคาวัสดุอ้างอิง สนค. กทม. ก.ย. 2569 และค่าแรง ว480 · เป็นงบประมาณเบื้องต้น ไม่ใช่ใบเสนอราคา · moeboq.github.io</p></body></html>';
    var url = URL.createObjectURL(new Blob(['﻿' + html], { type: 'application/vnd.ms-excel' }));
    var a = document.createElement('a'); a.href = url; a.download = 'BOQ-MOEBOQ-' + ds + '.xls'; document.body.appendChild(a); a.click();
    setTimeout(function(){ URL.revokeObjectURL(url); a.remove(); }, 500);
  });
  bp.addEventListener('click', function(){ window.print(); });

  if (LAUNCH_FREE) return;

  // ---- locked mode ----
  var sb = disc.querySelector('button[data-d="str"]'); if (sb && sb.getAttribute('aria-selected') !== 'true') sb.click();
  var modal = document.createElement('div'); modal.className = 'pro-modal'; modal.hidden = true;
  modal.innerHTML = '<div class="box" role="dialog" aria-modal="true" aria-labelledby="pm-h"><span class="pro-tag">PRO</span><h2 id="pm-h">ฟีเจอร์นี้อยู่ใน PRO · เปิดเร็วๆ นี้</h2><p>PRO จะปลดล็อกงานสถาปัตย์ ประปา ไฟฟ้า รูปด้าน รูปตัด โมเดล 3 มิติ และดาวน์โหลด BOQ เป็น Excel / PDF ลงชื่อรอไว้ แล้วจะแจ้งเมื่อเปิด</p><div class="actions"><a class="btn" href="' + PRO_URL + '#waitlist">ลงชื่อรอ PRO</a><button type="button" class="btn ghost">ปิด</button></div></div>';
  document.body.appendChild(modal);
  var open = function(){ modal.hidden = false; modal.querySelector('a').focus(); };
  modal.addEventListener('click', function(e){ if (e.target === modal || e.target.matches('button')) modal.hidden = true; });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') modal.hidden = true; });
  document.addEventListener('click', function(e){
    var t = e.target.closest && e.target.closest('#disc button[data-d], #copy, .pro-lock');
    if (!t && e.target.closest) t = (e.target.closest('button') === bx || e.target.closest('button') === bp) ? bx : null;
    if (!t || (t.dataset && t.dataset.d === 'str')) return;
    e.preventDefault(); e.stopImmediatePropagation(); open();
  }, true);
  ['t-h', 'e-h'].forEach(function(id){ var p = $(id) && $(id).closest('section'); if (!p) return; p.style.position = 'relative';
    var l = document.createElement('button'); l.type = 'button'; l.className = 'pro-lock'; l.innerHTML = '<span class="pro-tag">PRO</span><b>PRO · เปิดเร็วๆ นี้</b>'; p.appendChild(l); });
})();
