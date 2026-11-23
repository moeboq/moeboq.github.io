/* MOE BOQ page effects: word reveal, plan drawing + floating house, count-up, button shine/ripple,
   scroll reveal + progress bar, flip cards, before/after slider, scroll-built house, lightbox */
(function(){
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $$ = function(s, r){ return [].slice.call((r || document).querySelectorAll(s)); };
  document.documentElement.classList.add('fx-on');

  // ---- 1. headline words rise in
  $$('.hero h1, header > h1').forEach(function(h){
    if (reduce || h.dataset.split || h.children.length) return; h.dataset.split = 1;
    var parts = h.textContent.trim().split(/\s+/);
    h.setAttribute('aria-label', h.textContent.trim());
    h.innerHTML = parts.map(function(w, i){ return '<span class="w" aria-hidden="true" style="animation-delay:' + (0.1 + i * 0.1).toFixed(2) + 's">' + w + '</span>'; }).join(' ');
  });

  // ---- shared plan drawing (simple 3-bay house plan with dimension chain)
  function planSVG(animated){
    var L = function(x1, y1, x2, y2, c, d){ var len = Math.hypot(x2 - x1, y2 - y1) + 1; return '<line class="ln ' + c + '" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" style="--len:' + len + ';animation-delay:' + d + 's"/>'; };
    var s = '';
    s += L(60, 40, 400, 40, 'wl', .2) + L(400, 40, 400, 250, 'wl', .45) + L(400, 250, 60, 250, 'wl', .7) + L(60, 250, 60, 40, 'wl', .95);
    s += L(178, 40, 178, 250, 'wl', 1.15) + L(296, 145, 400, 145, 'wl', 1.3);
    [60, 178, 296, 400].forEach(function(x, i){ s += '<rect class="cl" x="' + (x - 6) + '" y="34" width="12" height="12" style="animation-delay:' + (1.4 + i * .05) + 's"/><rect class="cl" x="' + (x - 6) + '" y="244" width="12" height="12" style="animation-delay:' + (1.45 + i * .05) + 's"/>'; });
    s += '<rect class="op win" x="96" y="36" width="50" height="8" style="animation-delay:1.6s"/><rect class="op win" x="216" y="36" width="50" height="8" style="animation-delay:1.65s"/><rect class="op door" x="200" y="246" width="40" height="8" style="animation-delay:1.7s"/>';
    [60, 178, 296, 400].forEach(function(x, i){ s += L(x, 268, x, 280, 'dm', 1.5 + i * .04); });
    s += L(60, 274, 400, 274, 'dm', 1.5);
    [['4,000', 119], ['4,000', 237], ['3,500', 348]].forEach(function(t, i){ s += '<text x="' + t[1] + '" y="268" text-anchor="middle" style="animation-delay:' + (1.9 + i * .1) + 's">' + t[0] + '</text>'; });
    return '<svg viewBox="0 0 460 300" class="' + (animated ? 'anim' : '') + '" aria-hidden="true">' + s + '</svg>';
  }

  // ---- 1 + 8. plan draws itself, then the 3D house floats up
  $$('[data-fx="plan"]').forEach(function(el){
    el.insertAdjacentHTML('afterbegin', planSVG(!reduce));
    var btn = el.querySelector('.replay');
    if (btn) btn.addEventListener('click', function(){
      var svg = el.querySelector('svg'), house = el.querySelector('.house');
      svg.remove(); el.insertAdjacentHTML('afterbegin', planSVG(true));
      house.style.animation = 'none'; void house.offsetWidth; house.style.animation = '';
    });
  });

  // ---- 11. before / after slider
  $$('[data-fx="ba"]').forEach(function(el){
    var before = el.querySelector('.before'); before.insertAdjacentHTML('afterbegin', planSVG(false));
    var r = el.querySelector('input[type=range]');
    r.addEventListener('input', function(){ el.style.setProperty('--p', r.value + '%'); });
  });

  // ---- 4. button ripple (shine is CSS)
  document.addEventListener('pointerdown', function(e){
    var b = e.target.closest && e.target.closest('.btn'); if (!b || reduce) return;
    var r = b.getBoundingClientRect(), d = Math.max(r.width, r.height), sp = document.createElement('span');
    sp.className = 'ripple'; sp.style.width = sp.style.height = d + 'px';
    sp.style.left = (e.clientX - r.left - d / 2) + 'px'; sp.style.top = (e.clientY - r.top - d / 2) + 'px';
    b.appendChild(sp); setTimeout(function(){ sp.remove(); }, 650);
  });

  // ---- 5. scroll progress bar
  var prog = document.createElement('div'); prog.className = 'fx-prog'; prog.setAttribute('aria-hidden', 'true'); document.body.appendChild(prog);
  var onScroll = function(){ var h = document.documentElement, p = h.scrollTop / ((h.scrollHeight - h.clientHeight) || 1); prog.style.transform = 'scaleX(' + p + ')'; };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // ---- 2 + 5. count-up numbers and reveal-on-scroll
  var fmt = function(n){ return Math.round(n).toLocaleString('en-US'); };
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function(es){
    es.forEach(function(en){
      if (!en.isIntersecting) return; var t = en.target; io.unobserve(t);
      if (t.dataset.count){
        var to = +t.dataset.count, t0 = performance.now(), dur = 1200;
        (function tick(now){ var k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3); t.textContent = fmt(to * e); if (k < 1) requestAnimationFrame(tick); })(t0);
      } else t.classList.add('in');
    });
  }, { threshold: 0.15 }) : null;
  $$('[data-count]').forEach(function(el){ if (io && !reduce){ el.textContent = '0'; io.observe(el); } });
  var reveal = '.card, .flip, .steps li, .shot, .wrap > .panel, .two > .panel, .cta, .addon, .toc li, .section > header, .ba';
  if (!document.getElementById('plan')) $$(reveal).forEach(function(el, i){
    if (!io || reduce || el.closest('.hero')) return;
    el.classList.add('reveal'); el.style.transitionDelay = ((i % 3) * 0.08) + 's'; io.observe(el);
  });

  // ---- 12. flip cards
  $$('.flip').forEach(function(c){
    var set = function(on){ c.classList.toggle('on', on); $$('.flip-btn', c).forEach(function(b){ b.setAttribute('aria-expanded', on); }); };
    $$('.flip-btn', c).forEach(function(b){ b.addEventListener('click', function(e){ e.stopPropagation(); set(!c.classList.contains('on')); }); });
    c.addEventListener('click', function(e){ if (e.target.closest('a,button')) return; set(!c.classList.contains('on')); });
  });

  // ---- 13. house builds itself as you scroll
  $$('[data-fx="build"]').forEach(function(sec){
    var svg = sec.querySelector('svg'), stages = $$('li', sec), pct = sec.querySelector('.pct'), x = [90, 200, 310, 420];
    var g = function(inner){ return '<g class="part">' + inner + '</g>'; };
    svg.innerHTML = [
      g('<line x1="20" y1="300" x2="500" y2="300" stroke="#5D5F68" stroke-width="2"/>' + x.map(function(v){ return '<rect x="' + (v - 22) + '" y="300" width="44" height="16" fill="#8B5E3C" opacity=".6"/><rect x="' + (v - 4) + '" y="316" width="8" height="34" fill="#8a8a92"/>'; }).join('')),
      g(x.map(function(v){ return '<rect x="' + (v - 7) + '" y="150" width="14" height="150" fill="#8B1E16"/>'; }).join('') + '<rect x="83" y="150" width="344" height="14" fill="#A8322A"/>'),
      g('<rect x="83" y="290" width="344" height="10" fill="#b9b9bf"/>'),
      g('<rect x="97" y="164" width="96" height="126" fill="#d9d1c8"/><rect x="207" y="164" width="96" height="126" fill="#d9d1c8"/><rect x="317" y="164" width="96" height="126" fill="#d9d1c8"/><rect x="125" y="190" width="40" height="36" fill="#9ec3d6"/><rect x="345" y="190" width="40" height="36" fill="#9ec3d6"/><rect x="235" y="220" width="40" height="70" fill="#8B5E3C"/>'),
      g('<polyline points="60,150 255,60 450,150" fill="none" stroke="#3f5b78" stroke-width="4"/><line x1="255" y1="60" x2="255" y2="150" stroke="#2f6b5a" stroke-width="3"/><line x1="160" y1="105" x2="160" y2="150" stroke="#2f6b5a" stroke-width="3"/><line x1="350" y1="105" x2="350" y2="150" stroke="#2f6b5a" stroke-width="3"/>'),
      g('<polygon points="50,154 255,56 460,154" fill="#7a3b2e" stroke="#5a2a20" stroke-width="2"/>'),
      g('<path d="M140 296 V312 H68" fill="none" stroke="#0E7C55" stroke-width="4"/><rect x="26" y="304" width="44" height="30" rx="5" fill="#6A3FA0" opacity=".85"/><path d="M400 164 V120 H470 V300" fill="none" stroke="#6A3FA0" stroke-width="3" stroke-dasharray="6 4"/><rect x="460" y="240" width="20" height="28" rx="3" fill="#1D1D22"/>')
    ].join('');
    var parts = $$('.part', svg), n = parts.length;
    var upd = function(){
      var r = sec.getBoundingClientRect(), tot = r.height - innerHeight * 0.8, p = Math.min(1, Math.max(0, (-r.top + innerHeight * 0.3) / (tot || 1))), k = reduce ? n : Math.floor(p * (n + 0.01));
      parts.forEach(function(e, i){ e.classList.toggle('on', i < k); });
      stages.forEach(function(e, i){ e.classList.toggle('on', i < k); });
      if (pct) pct.textContent = Math.round((reduce ? 1 : p) * 100) + '%';
    };
    addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
  });

  // ---- 15. lightbox for portfolio images
  var shots = $$('.shot a');
  if (shots.length){
    var lb = document.createElement('div'); lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-hidden', 'true');
    lb.innerHTML = '<button type="button" class="lb-x">' + (document.documentElement.lang === 'en' ? 'Close ✕' : 'ปิด ✕') + '</button><img alt="">';
    document.body.appendChild(lb);
    var img = lb.querySelector('img'), x = lb.querySelector('.lb-x'), last = null;
    var close = function(){ lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); if (last) last.focus(); };
    shots.forEach(function(a){ a.addEventListener('click', function(e){ e.preventDefault(); last = a; var im = a.querySelector('img'); img.src = a.href; img.alt = im ? im.alt : ''; lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); x.focus(); }); });
    x.addEventListener('click', close); lb.addEventListener('click', function(e){ if (e.target === lb) close(); });
    addEventListener('keydown', function(e){ if (e.key === 'Escape' && lb.classList.contains('open')) close(); });
  }

  // ---- 9. typewriter line
  $$('.tw[data-words]').forEach(function(tw){
    if (reduce) return;
    var words = JSON.parse(tw.dataset.words), wi = 0, ci = tw.textContent.length, del = true;
    (function tick(){ var w = words[wi];
      if (del){ ci--; tw.textContent = w.slice(0, ci); if (ci <= 0){ del = false; wi = (wi + 1) % words.length; } setTimeout(tick, ci <= 0 ? 260 : 40); }
      else { var nw = words[wi]; ci++; tw.textContent = nw.slice(0, ci); if (ci >= nw.length){ del = true; setTimeout(tick, 1700); } else setTimeout(tick, 80); } })();
  });

  // ---- 10. magnetic primary buttons (mouse only)
  if (!reduce && matchMedia('(pointer: fine)').matches) $$('.hero .btn:not(.ghost), .cta .btn').forEach(function(b){
    b.classList.add('mag');
    var zone = b.parentElement;
    zone.addEventListener('pointermove', function(e){ var r = b.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2), d = Math.hypot(dx, dy);
      if (d < 140) b.style.transform = 'translate(' + dx * .22 + 'px,' + dy * .3 + 'px)'; else b.style.transform = ''; });
    zone.addEventListener('pointerleave', function(){ b.style.transform = ''; });
  });

  // ---- 14. marquee: duplicate content for a seamless loop
  $$('.marq > div').forEach(function(m){ m.innerHTML += m.innerHTML; });
})();
