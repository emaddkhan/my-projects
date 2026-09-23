/**
 * EMAD KHAN — PORTFOLIO 2026
 * Skills Globe — 3D rotating icon sphere
 * Pure vanilla JS — no Three.js or extra libs needed
 */
(function () {
  'use strict';

  /* ════════════════════════════════════════
     SKILL DATA — SVG icons (stroke-based for consistency)
  ════════════════════════════════════════ */
  var SKILLS = [
    {
      name: 'HTML',
      svg: '<polygon points="3,2 21,2 19,22 12,24 5,22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><text x="12" y="15" text-anchor="middle" font-size="6" font-weight="700" fill="currentColor" font-family="monospace">HTML</text>'
    },
    {
      name: 'CSS',
      svg: '<polygon points="3,2 21,2 19,22 12,24 5,22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><text x="12" y="15" text-anchor="middle" font-size="7" font-weight="700" fill="currentColor" font-family="monospace">CSS</text>'
    },
    {
      name: 'JavaScript',
      svg: '<rect x="2" y="2" width="20" height="20" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><text x="12" y="15.5" text-anchor="middle" font-size="8" font-weight="700" fill="currentColor" font-family="monospace">JS</text>'
    },
    {
      name: 'React',
      svg: '<circle cx="12" cy="12" r="2" fill="currentColor"/><ellipse cx="12" cy="12" rx="10" ry="3.5" fill="none" stroke="currentColor" stroke-width="1.5"/><ellipse cx="12" cy="12" rx="10" ry="3.5" fill="none" stroke="currentColor" stroke-width="1.5" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="3.5" fill="none" stroke="currentColor" stroke-width="1.5" transform="rotate(-60 12 12)"/>'
    },
    {
      name: 'Tailwind',
      svg: '<path d="M3 8c1.5-3.5 3.5-5.2 5.5-5.2 2.8 0 3.8 2.8 6.3 2.8 2.5 0 4-2.5 6.7-2.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M3 14.5c1.5-3.5 3.5-5.2 5.5-5.2 2.8 0 3.8 2.8 6.3 2.8 2.5 0 4-2.5 6.7-2.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'
    },
    {
      name: 'GSAP',
      svg: '<rect x="2" y="2" width="20" height="20" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M14 8.5 C14 8.5 11 8.5 10 10 C9 11.5 9.5 13 11 13.5 L13 14 C14.5 14.5 15 16 14 17 C13 18 10 18 10 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="12" y1="6.5" x2="12" y2="8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="12" y1="18" x2="12" y2="20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'
    },
    {
      name: 'Framer',
      svg: '<path fill="currentColor" d="M5 2h14v8h-7zM5 10h7l7 7H5zM5 17h7v7z"/>'
    },
    {
      name: 'Node.js',
      svg: '<polygon points="12,2 21,7 21,17 12,22 3,17 3,7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><text x="12" y="15.5" text-anchor="middle" font-size="7.5" font-weight="700" fill="currentColor" font-family="monospace">N</text>'
    },
    {
      name: 'Express',
      svg: '<line x1="3" y1="8" x2="21" y2="8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="3" y1="12" x2="17" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="3" y1="16" x2="12" y2="16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'
    },
    {
      name: 'MongoDB',
      svg: '<path d="M12 2c-3.5 0-6.5 3.5-6.5 8 0 5 5 10.5 6.5 12 1.5-1.5 6.5-7 6.5-12 0-4.5-3-8-6.5-8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><line x1="12" y1="4" x2="12" y2="22" stroke="currentColor" stroke-width="1" stroke-dasharray="2,2.5" opacity="0.5"/>'
    },
    {
      name: 'REST API',
      svg: '<polyline points="8 7 3 12 8 17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><polyline points="16 7 21 12 16 17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><line x1="14.5" y1="4" x2="9.5" y2="20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'
    },
    {
      name: 'React Native',
      svg: '<rect x="9.5" y="9.5" width="5" height="5" rx="1" fill="none" stroke="currentColor" stroke-width="1.4"/><ellipse cx="12" cy="12" rx="10" ry="3.5" fill="none" stroke="currentColor" stroke-width="1.4"/><ellipse cx="12" cy="12" rx="10" ry="3.5" fill="none" stroke="currentColor" stroke-width="1.4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="3.5" fill="none" stroke="currentColor" stroke-width="1.4" transform="rotate(120 12 12)"/>'
    },
    {
      name: 'Git',
      svg: '<circle cx="12" cy="4" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="5" cy="20" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="19" cy="20" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/><line x1="12" y1="6" x2="12" y2="13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="12" y1="13" x2="5" y2="18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="12" y1="13" x2="19" y2="18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'
    },
    {
      name: 'GitHub',
      svg: '<path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48v-1.69c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.57.69.48A10.01 10.01 0 0 0 22 12C22 6.48 17.52 2 12 2z"/>'
    },
    {
      name: 'Java',
      svg: '<path d="M8 20s-.9.5.6.7c1.9.2 2.9.2 5-.2 0 0 .6.3 1.3.6-4.7 2-10.6-.1-6.9-1.1zM7.5 17.3s-1 .8.6.9c2 .2 3.6.2 6.4-.3 0 0 .4.4 1 .6-5.7 1.7-12 .1-8-1.2zM13 11.5c1.2 1.3-.3 2.5-.3 2.5s3-1.5 1.6-3.4C13 8.9 12 8.1 17 5c0 0-8.2 2-4 6.5z" fill="currentColor"/><path d="M14.7 18.8c4.5-2.3 2.4-4.6 1-4.3-.4.1-.5.1-.5.1s.1-.2.4-.3c2.9-1 5.1 3-.9 4.6l.3-.1zM12 22c4.3.3 11-.2 11.1-2.2 0 0-.3.8-3.6 1.4-3.7.7-8.2.6-10.9.2 0 0 .6.5 3.4.6zM9 13.4s-4.4 1-1.5 1.4c1.2.1 3.6.1 5.8-.1 1.8-.2 3.6-.5 3.6-.5s-.6.3-1.1.6c-4.4 1.2-13 .6-10.5-.6 2.1-1 3.7-.8 3.7-.8zM8 2s2.5 2.5-2.4 6.3C2 11.4 5 13 3.6 15c2.3-2 3.9-3.9 2.8-5.5C5 7.5 9.3 5.4 8 2z" fill="currentColor"/>'
    }
  ];

  /* ════════════════════════════════════════
     CONFIG
  ════════════════════════════════════════ */
  var R         = 150;     // sphere radius (px)
  var FOV       = 460;     // perspective focal length
  var AUTO_Y    = 0.003;   // auto-rotation speed (rad/frame)
  var MOUSE_SEN = 0.0004;  // mouse-to-rotation sensitivity
  var MIN_OP    = 0.07;    // back-icon minimum opacity
  var BASE_SIZE = 34;      // front-icon base size (px)

  /* ════════════════════════════════════════
     STATE
  ════════════════════════════════════════ */
  var angleY     = 0;
  var angleX     = 0.3;
  var mouseNX    = 0;
  var mouseNY    = 0;
  var hoveredIdx = -1;
  var isActive   = false;
  var rafId      = null;
  var basePoints = [];
  var iconEls    = [];
  var PRM        = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ════════════════════════════════════════
     FIBONACCI SPHERE — even distribution
  ════════════════════════════════════════ */
  function fibSphere(n, r) {
    var pts    = [];
    var golden = Math.PI * (3 - Math.sqrt(5));
    for (var i = 0; i < n; i++) {
      var y   = 1 - (i / (n - 1)) * 2;
      var rad = Math.sqrt(Math.max(0, 1 - y * y));
      var t   = golden * i;
      pts.push([Math.cos(t) * rad * r, y * r, Math.sin(t) * rad * r]);
    }
    return pts;
  }

  /* ════════════════════════════════════════
     ROTATION MATRICES
  ════════════════════════════════════════ */
  function rotY(p, a) {
    var c = Math.cos(a), s = Math.sin(a);
    return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c];
  }
  function rotX(p, a) {
    var c = Math.cos(a), s = Math.sin(a);
    return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c];
  }

  /* ════════════════════════════════════════
     DOM SETUP
  ════════════════════════════════════════ */
  function init() {
    var globe = document.getElementById('skillsGlobe');
    if (!globe) return;

    basePoints = fibSphere(SKILLS.length, R);

    SKILLS.forEach(function (sk, i) {
      var el  = document.createElement('div');
      el.className = 'sk-icon';
      el.setAttribute('aria-label', sk.name);
      el.setAttribute('role', 'img');
      el.innerHTML =
        '<div class="sk-icon-svg">' +
          '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
            sk.svg +
          '</svg>' +
        '</div>' +
        '<span class="sk-icon-name">' + sk.name + '</span>';

      el.addEventListener('mouseenter', function () { hoveredIdx = i; });
      el.addEventListener('mouseleave', function () { hoveredIdx = -1; });
      globe.appendChild(el);
      iconEls.push(el);
    });

    /* Mouse tracking — relative to globe container */
    globe.addEventListener('mousemove', function (e) {
      var rect = globe.getBoundingClientRect();
      mouseNX  = (e.clientX - rect.left)  / rect.width  * 2 - 1;
      mouseNY  = (e.clientY - rect.top)   / rect.height * 2 - 1;
    });
    globe.addEventListener('mouseleave', function () {
      mouseNX = 0;
      mouseNY = 0;
    });

    /* IntersectionObserver — pause when off-screen */
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        isActive = e.isIntersecting;
        if (isActive && !rafId) tick();
      });
    }, { threshold: 0.05 });
    io.observe(globe);

    /* Scroll entrance reveal */
    var section = document.getElementById('skillsSection');
    if (section) {
      var revObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            section.classList.add('sk-revealed');
            revObs.disconnect();
          }
        });
      }, { threshold: 0.04 });
      revObs.observe(section);
    }
  }

  /* ════════════════════════════════════════
     RENDER LOOP
  ════════════════════════════════════════ */
  function tick() {
    if (!isActive) { rafId = null; return; }
    rafId = requestAnimationFrame(tick);

    if (!PRM) {
      /* Auto-rotate Y + subtle mouse influence */
      angleY += AUTO_Y + mouseNX * MOUSE_SEN * 20;
      /* Mouse Y gently tilts globe on X-axis — springs back */
      var targetX = 0.3 + mouseNY * 0.18;
      angleX += (targetX - angleX) * 0.05;
    }

    var globe = document.getElementById('skillsGlobe');
    if (!globe) return;
    var cx = globe.offsetWidth  / 2;
    var cy = globe.offsetHeight / 2;

    /* Transform all base positions */
    var transformed = basePoints.map(function (bp) {
      var p = rotY(bp, angleY);
      return rotX(p, angleX);
    });

    /* Sort back→front so front icons paint on top */
    var order = transformed
      .map(function (p, i) { return { i: i, z: p[2] }; })
      .sort(function (a, b) { return a.z - b.z; });

    order.forEach(function (item, rank) {
      var p     = transformed[item.i];
      var scl   = FOV / (FOV + p[2]);           // perspective scale
      var sx    = cx + p[0] * scl;              // screen X
      var sy    = cy + p[1] * scl;              // screen Y
      var depth = (p[2] + R) / (2 * R);         // 0=back → 1=front
      var op    = MIN_OP + depth * (1 - MIN_OP); // opacity
      var size  = BASE_SIZE * (0.38 + depth * 0.62); // icon size
      var isHov = (item.i === hoveredIdx);
      var hidden = p[2] < -R * 0.88;            // clip deepest back icons

      var el = iconEls[item.i];
      el.style.left          = sx + 'px';
      el.style.top           = sy + 'px';
      el.style.width         = (isHov ? size * 1.35 : size) + 'px';
      el.style.height        = (isHov ? size * 1.35 : size) + 'px';
      el.style.opacity       = isHov ? '1' : op.toFixed(3);
      el.style.zIndex        = rank;
      el.style.pointerEvents = (hidden || depth < 0.25) ? 'none' : 'auto';
      el.style.visibility    = hidden ? 'hidden' : 'visible';

      if (isHov) el.classList.add('is-hovered');
      else       el.classList.remove('is-hovered');
    });
  }

  /* ════════════════════════════════════════
     BOOT
  ════════════════════════════════════════ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
