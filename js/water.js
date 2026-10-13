/* ============================================================
   water.js — Hero WebGL surface (Three.js, fullscreen shader)
   A slow mineral-water surface: fbm swell + caustic bands,
   pointer ripples, scroll-linked depth.
   Degrades gracefully: if WebGL or Three is unavailable the
   CSS gradient behind the canvas carries the hero.
   ============================================================ */
(function () {
  'use strict';

  const canvas = document.getElementById('water');
  if (!canvas) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (typeof THREE === 'undefined') { canvas.style.display = 'none'; return; }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
  } catch (e) {
    canvas.style.display = 'none';
    return;
  }

  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const maxDPR = isTouch ? 1.25 : 1.6;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const uniforms = {
    uTime:     { value: 0 },
    uRes:      { value: new THREE.Vector2(1, 1) },
    uPointer:  { value: new THREE.Vector2(0.5, 0.55) },
    uRipple:   { value: 0 },
    uScroll:   { value: 0 },
    uQuality:  { value: isTouch ? 0.0 : 1.0 },
    uDeep:     { value: new THREE.Color('#1C2026') },
    uMid:      { value: new THREE.Color('#3B4654') },
    uLight:    { value: new THREE.Color('#B9A590') },
    uCream:    { value: new THREE.Color('#F6F3EC') }
  };

  const vert = `
    varying vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `;

  const frag = `
    precision highp float;

    varying vec2 vUv;
    uniform float uTime;
    uniform vec2  uRes;
    uniform vec2  uPointer;
    uniform float uRipple;
    uniform float uScroll;
    uniform float uQuality;
    uniform vec3  uDeep;
    uniform vec3  uMid;
    uniform vec3  uLight;
    uniform vec3  uCream;

    // --- value noise ---------------------------------------
    float hash(vec2 p){
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }
    float noise(vec2 p){
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }
    float fbm(vec2 p){
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 5; i++){
        v += a * noise(p);
        p = p * 2.02 + vec2(17.3, 9.1);
        a *= 0.5;
      }
      return v;
    }

    // --- surface height field -------------------------------
    float surface(vec2 p, float t){
      float h = 0.0;
      h += sin(p.x * 2.1 + t * 0.32) * 0.35;
      h += sin(p.y * 1.6 - t * 0.24) * 0.28;
      h += sin((p.x + p.y) * 1.15 + t * 0.19) * 0.22;
      h += fbm(p * 1.35 + vec2(t * 0.045, -t * 0.035)) * 1.05;
      h += fbm(p * 3.10 - vec2(t * 0.08, t * 0.05)) * 0.38 * uQuality;
      return h;
    }

    void main(){
      vec2 uv = vUv;
      float aspect = uRes.x / max(uRes.y, 1.0);
      vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);

      // perspective squash: the surface lies away from the viewer
      float horizon = 0.62 - uScroll * 0.10;
      float depth = clamp((horizon - uv.y) * 2.4, -1.0, 1.4);
      vec2 sp = vec2(p.x * (1.0 + depth * 1.6), p.y * (1.0 + depth * 2.6));
      sp *= 3.0;

      float t = uTime;

      // pointer ripple
      vec2 pointer = vec2((uPointer.x - 0.5) * aspect, (uPointer.y - 0.5));
      float pd = length(p - pointer);
      float ripple = sin(pd * 26.0 - t * 3.4) * exp(-pd * 6.5) * uRipple * 0.55;

      float h  = surface(sp, t) + ripple;
      float hx = surface(sp + vec2(0.035, 0.0), t) + ripple;
      float hy = surface(sp + vec2(0.0, 0.035), t) + ripple;
      vec2 grad = vec2(hx - h, hy - h) / 0.035;

      // caustic bands riding the slope
      float bands = sin(h * 5.4 + t * 0.42);
      bands = pow(abs(bands), 6.0);

      // fake specular from a low, warm light
      vec3 n = normalize(vec3(-grad.x * 0.55, 1.0, -grad.y * 0.55));
      vec3 lightDir = normalize(vec3(0.35, 0.72, 0.58));
      float spec = pow(max(dot(n, lightDir), 0.0), 22.0);

      float depthMix = smoothstep(-0.15, 1.0, uv.y * 1.15 + h * 0.06);
      vec3 col = mix(uDeep, uMid, depthMix);
      col = mix(col, uLight, bands * 0.30 * (0.45 + depthMix * 0.55));
      col += uCream * spec * 0.55;
      col += uLight * max(grad.x, 0.0) * 0.035;

      // soft horizon glow
      float glow = exp(-abs(uv.y - horizon) * 7.0);
      col += mix(uLight, uCream, 0.35) * glow * 0.13;

      // vignette + bottom settle
      float vig = smoothstep(1.25, 0.25, length(vec2((uv.x - 0.5) * 1.25, (uv.y - 0.5) * 1.1)) * 1.35);
      col *= 0.55 + vig * 0.6;
      col = mix(col, uDeep, smoothstep(0.42, -0.05, uv.y) * 0.75);

      // grain
      float g = hash(uv * uRes.xy * 0.5 + t) - 0.5;
      col += g * 0.018;

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  const material = new THREE.ShaderMaterial({ uniforms: uniforms, vertexShader: vert, fragmentShader: frag });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(quad);

  function resize() {
    const hero = canvas.parentElement;
    const w = hero.clientWidth;
    const h = hero.clientHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDPR));
    renderer.setSize(w, h, false);
    uniforms.uRes.value.set(w, h);
  }
  resize();

  let resizeRAF;
  window.addEventListener('resize', function () {
    cancelAnimationFrame(resizeRAF);
    resizeRAF = requestAnimationFrame(resize);
  });

  // pointer
  const target = { x: 0.5, y: 0.55 };
  if (!isTouch) {
    window.addEventListener('pointermove', function (e) {
      const r = canvas.getBoundingClientRect();
      if (e.clientY > r.bottom) return;
      target.x = (e.clientX - r.left) / r.width;
      target.y = 1.0 - (e.clientY - r.top) / r.height;
      uniforms.uRipple.value = 1.0;
    }, { passive: true });
  }

  // scroll depth
  let scrollTargetVal = 0;
  window.addEventListener('scroll', function () {
    const h = window.innerHeight || 1;
    scrollTargetVal = Math.min(window.scrollY / h, 1);
  }, { passive: true });

  // pause offscreen
  let visible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
    }, { threshold: 0.01 }).observe(canvas);
  }

  const clock = new THREE.Clock();
  let acc = 0;
  const frameCap = isTouch ? 1 / 34 : 1 / 60;

  function tick() {
    requestAnimationFrame(tick);
    const dt = clock.getDelta();
    if (!visible || document.hidden) return;
    acc += dt;
    if (acc < frameCap) return;
    acc = 0;

    uniforms.uTime.value += reduced ? 0 : dt * 0.9;
    uniforms.uPointer.value.x += (target.x - uniforms.uPointer.value.x) * 0.045;
    uniforms.uPointer.value.y += (target.y - uniforms.uPointer.value.y) * 0.045;
    uniforms.uRipple.value *= 0.965;
    uniforms.uScroll.value += (scrollTargetVal - uniforms.uScroll.value) * 0.06;

    renderer.render(scene, camera);
  }

  renderer.render(scene, camera);
  tick();

  // expose for debugging
  window.__water = { uniforms: uniforms, renderer: renderer };
})();
