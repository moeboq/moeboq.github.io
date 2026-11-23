(function(){
  // full-screen menu with fade in / out
  var btn = document.querySelector('.menu-btn'), menu = document.getElementById('menu');
  if (btn && menu){
    var close = menu.querySelector('.menu-close');
    var open = function(){ menu.classList.add('open'); menu.setAttribute('aria-hidden', 'false'); btn.setAttribute('aria-expanded', 'true'); document.body.classList.add('menu-open');
      var f = menu.querySelector('a[aria-current="page"]') || menu.querySelector('a'); setTimeout(function(){ f && f.focus(); }, 60); };
    var shut = function(){ menu.classList.remove('open'); menu.setAttribute('aria-hidden', 'true'); btn.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open'); btn.focus(); };
    btn.addEventListener('click', open);
    close.addEventListener('click', shut);
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && menu.classList.contains('open')) shut(); });
    menu.addEventListener('keydown', function(e){
      if (e.key !== 'Tab') return;
      var f = menu.querySelectorAll('a,button'), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    });
  }
  // copy buttons
  document.querySelectorAll('[data-copy]').forEach(function(b){
    b.addEventListener('click', function(){
      var src = document.getElementById(b.getAttribute('data-copy')), out = document.getElementById(b.getAttribute('data-toast'));
      var text = src ? src.innerText : '';
      var done = function(){ if (out){ out.textContent = 'คัดลอกแล้ว นำไปวางในแชต Fastwork ได้เลย'; setTimeout(function(){ out.textContent = ''; }, 2500); } };
      try { navigator.clipboard.writeText(text).then(done, function(){ if (out) out.textContent = 'คัดลอกไม่ได้ ลองเลือกข้อความแล้วกด Ctrl+C'; }); }
      catch (e){ if (out) out.textContent = 'คัดลอกไม่ได้ ลองเลือกข้อความแล้วกด Ctrl+C'; }
    });
  });
  // dark / light toggle (remembered per browser)
  var tb = document.querySelector('.theme-btn');
  if (tb){
    var root = document.documentElement;
    var isDark = function(){ return root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches; };
    var sync = function(){ tb.setAttribute('aria-pressed', isDark()); };
    sync();
    tb.addEventListener('click', function(){ var next = isDark() ? 'light' : 'dark'; root.dataset.theme = next; try { localStorage.setItem('moe-theme', next); } catch (e) {} sync(); });
  }
})();
