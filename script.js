/* ========== Shark Shop — Main Script ========== */

// ---------- Preloader ----------
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
  }, 1200);
});

// ---------- Cursor Glow ----------
const cursorGlow = document.getElementById('cursorGlow');
let cursorX = 0, cursorY = 0;
document.addEventListener('mousemove', (e) => {
  cursorX = e.clientX;
  cursorY = e.clientY;
  cursorGlow.style.left = cursorX + 'px';
  cursorGlow.style.top = cursorY + 'px';
  if (!cursorGlow.classList.contains('active')) {
    cursorGlow.classList.add('active');
  }
});

// ---------- Navigation ----------
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ---------- Counter Animation ----------
function animateCounters() {
  document.querySelectorAll('.stat-number[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const duration = 2000;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(target * eased);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

// ---------- Intersection Observer ----------
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      if (entry.target.classList.contains('hero-stats')) {
        animateCounters();
      }
    }
  });
}, observerOptions);

document.querySelectorAll('.product-card, .advantage-card, .contact-card, .about-content, .about-visual, .contact-form-wrap, .hero-stats').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

// ---------- Form Handling ----------
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.innerHTML = '<span>Отправлено!</span>';
  btn.style.background = 'linear-gradient(135deg, #00c853, #00e676)';
  setTimeout(() => {
    btn.innerHTML = '<span>Отправить</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>';
    btn.style.background = '';
    e.target.reset();
  }, 2500);
});

// ---------- Smooth reveal on nav link click ----------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ========== THREE.JS — 3D SHARK (Hero) ==========
(function initHeroShark() {
  const canvas = document.getElementById('sharkCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 6);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  // Lights
  const ambientLight = new THREE.AmbientLight(0x4488cc, 0.4);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0x00d4ff, 1.2);
  mainLight.position.set(5, 5, 5);
  scene.add(mainLight);

  const rimLight = new THREE.DirectionalLight(0x0066ff, 0.6);
  rimLight.position.set(-5, -2, -3);
  scene.add(rimLight);

  const pointLight = new THREE.PointLight(0xff2d55, 0.4, 15);
  pointLight.position.set(-3, 2, 4);
  scene.add(pointLight);

  // Create shark group
  const shark = new THREE.Group();

  // Shark material
  const sharkMaterial = new THREE.MeshPhongMaterial({
    color: 0x1a3a5c,
    specular: 0x00d4ff,
    shininess: 80,
    transparent: true,
    opacity: 0.9,
  });

  const bellyMaterial = new THREE.MeshPhongMaterial({
    color: 0x4a6a8c,
    specular: 0x88ccff,
    shininess: 60,
    transparent: true,
    opacity: 0.85,
  });

  // Body — elongated sphere
  const bodyGeom = new THREE.SphereGeometry(1, 32, 24);
  bodyGeom.scale(2.2, 0.7, 0.8);
  const body = new THREE.Mesh(bodyGeom, sharkMaterial);
  shark.add(body);

  // Belly
  const bellyGeom = new THREE.SphereGeometry(1, 32, 24);
  bellyGeom.scale(1.8, 0.5, 0.65);
  const belly = new THREE.Mesh(bellyGeom, bellyMaterial);
  belly.position.y = -0.15;
  shark.add(belly);

  // Head / Nose cone
  const noseGeom = new THREE.ConeGeometry(0.55, 1.4, 16);
  noseGeom.rotateZ(Math.PI / 2);
  const nose = new THREE.Mesh(noseGeom, sharkMaterial);
  nose.position.x = 2.2;
  nose.position.y = 0.05;
  shark.add(nose);

  // Tail fin
  const tailShape = new THREE.Shape();
  tailShape.moveTo(0, 0);
  tailShape.quadraticCurveTo(-0.3, 1.0, -0.8, 1.4);
  tailShape.quadraticCurveTo(-0.4, 0.5, -0.2, 0);
  tailShape.quadraticCurveTo(-0.4, -0.4, -0.7, -0.8);
  tailShape.quadraticCurveTo(-0.3, -0.6, 0, 0);

  const tailGeom = new THREE.ExtrudeGeometry(tailShape, {
    depth: 0.08,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.03,
    bevelSegments: 4,
  });
  const tail = new THREE.Mesh(tailGeom, sharkMaterial);
  tail.position.set(-2.3, 0, -0.04);
  tail.rotation.z = -0.05;
  shark.add(tail);

  // Dorsal fin
  const dorsalShape = new THREE.Shape();
  dorsalShape.moveTo(0, 0);
  dorsalShape.quadraticCurveTo(0.3, 1.2, -0.2, 1.1);
  dorsalShape.quadraticCurveTo(-0.1, 0.5, -0.5, 0);
  dorsalShape.lineTo(0, 0);

  const dorsalGeom = new THREE.ExtrudeGeometry(dorsalShape, {
    depth: 0.06,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 3,
  });
  const dorsal = new THREE.Mesh(dorsalGeom, sharkMaterial);
  dorsal.position.set(0.2, 0.55, -0.03);
  shark.add(dorsal);

  // Pectoral fins
  const pectoralShape = new THREE.Shape();
  pectoralShape.moveTo(0, 0);
  pectoralShape.quadraticCurveTo(0.6, -0.2, 1.0, -0.6);
  pectoralShape.quadraticCurveTo(0.4, -0.3, 0, -0.1);
  pectoralShape.lineTo(0, 0);

  const pectoralGeom = new THREE.ExtrudeGeometry(pectoralShape, {
    depth: 0.04,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.015,
    bevelSegments: 2,
  });

  const finRight = new THREE.Mesh(pectoralGeom, sharkMaterial);
  finRight.position.set(0.8, -0.45, 0.6);
  finRight.rotation.set(0.3, 0.4, -0.2);
  shark.add(finRight);

  const finLeft = new THREE.Mesh(pectoralGeom, sharkMaterial);
  finLeft.position.set(0.8, -0.45, -0.7);
  finLeft.rotation.set(-0.3, -0.4, -0.2);
  shark.add(finLeft);

  // Eyes
  const eyeMaterial = new THREE.MeshPhongMaterial({
    color: 0x00d4ff,
    emissive: 0x00aaff,
    emissiveIntensity: 0.5,
  });

  const eyeGeom = new THREE.SphereGeometry(0.08, 16, 16);
  const eyeR = new THREE.Mesh(eyeGeom, eyeMaterial);
  eyeR.position.set(1.6, 0.2, 0.5);
  shark.add(eyeR);

  const eyeL = new THREE.Mesh(eyeGeom, eyeMaterial);
  eyeL.position.set(1.6, 0.2, -0.5);
  shark.add(eyeL);

  // Gills
  const gillMaterial = new THREE.MeshPhongMaterial({
    color: 0x0a2040,
    transparent: true,
    opacity: 0.6,
  });
  for (let i = 0; i < 3; i++) {
    const gillGeom = new THREE.BoxGeometry(0.02, 0.2, 0.04);
    const gillR = new THREE.Mesh(gillGeom, gillMaterial);
    gillR.position.set(1.2 - i * 0.15, -0.05, 0.7);
    shark.add(gillR);
    const gillL = new THREE.Mesh(gillGeom, gillMaterial);
    gillL.position.set(1.2 - i * 0.15, -0.05, -0.7);
    shark.add(gillL);
  }

  shark.position.set(1.5, 0, 0);
  shark.rotation.y = -0.4;
  scene.add(shark);

  // Particles — bubbles
  const particlesCount = 120;
  const particlesGeom = new THREE.BufferGeometry();
  const positions = new Float32Array(particlesCount * 3);
  for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }
  particlesGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    color: 0x00d4ff,
    size: 0.04,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
  });
  const particles = new THREE.Points(particlesGeom, particlesMaterial);
  scene.add(particles);

  // Mouse interaction
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // Animation
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // Shark swimming motion
    shark.position.y = Math.sin(elapsed * 0.8) * 0.3;
    shark.position.x = 1.5 + Math.sin(elapsed * 0.5) * 0.4;
    shark.rotation.z = Math.sin(elapsed * 0.8) * 0.05;
    shark.rotation.y = -0.4 + Math.sin(elapsed * 0.3) * 0.1;

    // Tail wiggle
    if (tail) {
      tail.rotation.y = Math.sin(elapsed * 2.5) * 0.2;
    }

    // Mouse follow
    shark.rotation.y += (mouseX * 0.3 - shark.rotation.y) * 0.02;
    shark.rotation.x += (mouseY * 0.15 - shark.rotation.x) * 0.02;

    // Particles drift
    const posArr = particles.geometry.attributes.position.array;
    for (let i = 0; i < particlesCount; i++) {
      posArr[i * 3 + 1] += 0.003;
      if (posArr[i * 3 + 1] > 5) posArr[i * 3 + 1] = -5;
    }
    particles.geometry.attributes.position.needsUpdate = true;
    particles.rotation.y = elapsed * 0.02;

    // Eye glow pulsation
    eyeMaterial.emissiveIntensity = 0.5 + Math.sin(elapsed * 2) * 0.2;

    renderer.render(scene, camera);
  }
  animate();

  // Resize
  function onResize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);
})();

// ========== THREE.JS — 3D SHARK (About section — spinning) ==========
(function initAboutShark() {
  const canvas = document.getElementById('aboutSharkCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 0.5, 5);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  // Lights
  scene.add(new THREE.AmbientLight(0x4488cc, 0.5));
  const dirLight = new THREE.DirectionalLight(0x00d4ff, 1.0);
  dirLight.position.set(3, 4, 5);
  scene.add(dirLight);
  const backLight = new THREE.DirectionalLight(0x0044aa, 0.4);
  backLight.position.set(-3, -2, -5);
  scene.add(backLight);

  // Wireframe shark — stylized
  const sharkGroup = new THREE.Group();

  const wireMaterial = new THREE.MeshPhongMaterial({
    color: 0x00d4ff,
    wireframe: true,
    transparent: true,
    opacity: 0.6,
  });

  const solidMaterial = new THREE.MeshPhongMaterial({
    color: 0x0a1e3c,
    transparent: true,
    opacity: 0.3,
    specular: 0x00d4ff,
    shininess: 100,
  });

  // Body
  const bGeom = new THREE.SphereGeometry(1, 20, 16);
  bGeom.scale(2.0, 0.6, 0.7);
  sharkGroup.add(new THREE.Mesh(bGeom, wireMaterial));
  sharkGroup.add(new THREE.Mesh(bGeom.clone(), solidMaterial));

  // Nose
  const nGeom = new THREE.ConeGeometry(0.45, 1.2, 12);
  nGeom.rotateZ(Math.PI / 2);
  const noseMesh = new THREE.Mesh(nGeom, wireMaterial);
  noseMesh.position.x = 2.0;
  sharkGroup.add(noseMesh);

  // Dorsal
  const dShape = new THREE.Shape();
  dShape.moveTo(0, 0);
  dShape.quadraticCurveTo(0.25, 1.0, -0.15, 0.9);
  dShape.quadraticCurveTo(-0.05, 0.4, -0.4, 0);
  dShape.lineTo(0, 0);
  const dGeom = new THREE.ExtrudeGeometry(dShape, { depth: 0.04, bevelEnabled: false });
  const dorsalMesh = new THREE.Mesh(dGeom, wireMaterial);
  dorsalMesh.position.set(0.2, 0.48, -0.02);
  sharkGroup.add(dorsalMesh);

  // Tail
  const tShape = new THREE.Shape();
  tShape.moveTo(0, 0);
  tShape.quadraticCurveTo(-0.25, 0.9, -0.7, 1.2);
  tShape.quadraticCurveTo(-0.3, 0.4, -0.15, 0);
  tShape.quadraticCurveTo(-0.3, -0.35, -0.6, -0.7);
  tShape.quadraticCurveTo(-0.25, -0.5, 0, 0);
  const tGeom = new THREE.ExtrudeGeometry(tShape, { depth: 0.06, bevelEnabled: false });
  const tailMesh = new THREE.Mesh(tGeom, wireMaterial);
  tailMesh.position.set(-2.1, 0, -0.03);
  sharkGroup.add(tailMesh);

  // Glowing ring
  const ringGeom = new THREE.TorusGeometry(2.5, 0.015, 16, 64);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x00d4ff,
    transparent: true,
    opacity: 0.2,
  });
  const ring = new THREE.Mesh(ringGeom, ringMaterial);
  ring.rotation.x = Math.PI / 2;
  sharkGroup.add(ring);

  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(3.0, 0.01, 16, 64),
    new THREE.MeshBasicMaterial({ color: 0x0066ff, transparent: true, opacity: 0.1 })
  );
  ring2.rotation.x = Math.PI / 2;
  ring2.rotation.z = 0.5;
  sharkGroup.add(ring2);

  scene.add(sharkGroup);

  // Particles
  const pCount = 60;
  const pGeom = new THREE.BufferGeometry();
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 2 + Math.random() * 2;
    pPos[i * 3] = Math.cos(angle) * radius;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 3;
    pPos[i * 3 + 2] = Math.sin(angle) * radius;
  }
  pGeom.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0x00d4ff,
    size: 0.05,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
  });
  const aboutParticles = new THREE.Points(pGeom, pMat);
  scene.add(aboutParticles);

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    sharkGroup.rotation.y = t * 0.3;
    sharkGroup.position.y = Math.sin(t * 0.6) * 0.15;
    ring.rotation.z = t * 0.1;
    ring2.rotation.z = 0.5 - t * 0.08;
    aboutParticles.rotation.y = t * 0.05;
    renderer.render(scene, camera);
  }
  animate();

  function onResize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);
})();
