// ============================
// Background Particle Canvas
// ============================
const bgCanvas = document.getElementById('bgCanvas');
const bgCtx = bgCanvas.getContext('2d');

function resizeBg() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}
resizeBg();
window.addEventListener('resize', resizeBg);

const particles = [];
const PARTICLE_COUNT = 80;

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push({
    x: Math.random() * bgCanvas.width,
    y: Math.random() * bgCanvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    size: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.4 + 0.1,
  });
}

function drawBg() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        const alpha = (1 - dist / 150) * 0.12;
        bgCtx.strokeStyle = `rgba(30, 144, 255, ${alpha})`;
        bgCtx.lineWidth = 0.5;
        bgCtx.beginPath();
        bgCtx.moveTo(particles[i].x, particles[i].y);
        bgCtx.lineTo(particles[j].x, particles[j].y);
        bgCtx.stroke();
      }
    }
  }

  // Draw particles
  for (const p of particles) {
    bgCtx.fillStyle = `rgba(30, 144, 255, ${p.opacity})`;
    bgCtx.beginPath();
    bgCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    bgCtx.fill();

    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > bgCanvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > bgCanvas.height) p.vy *= -1;
  }

  requestAnimationFrame(drawBg);
}
drawBg();

// ============================
// Navbar Scroll Effect
// ============================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ============================
// Mobile Nav Toggle
// ============================
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
  navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
  navLinks.style.flexDirection = 'column';
  navLinks.style.position = 'absolute';
  navLinks.style.top = '60px';
  navLinks.style.right = '24px';
  navLinks.style.background = 'rgba(5, 8, 15, 0.95)';
  navLinks.style.padding = '20px';
  navLinks.style.border = '1px solid rgba(30, 144, 255, 0.2)';
  navLinks.style.backdropFilter = 'blur(20px)';
  navLinks.style.gap = '16px';
});

// ============================
// Scroll Reveal Animations
// ============================
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.feature-card, .security-card, .mesh-step').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// Stagger feature cards
document.querySelectorAll('.feature-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 100}ms`;
});

// ============================
// Terminal Animation
// ============================
const terminalLines = [
  { text: 'checking bluetooth_adapter...', cls: 'term-cmd', delay: 800 },
  { text: '✓ BLE module ONLINE', cls: 'term-success', delay: 600 },
  { text: 'scanning for nearby nodes...', cls: 'term-cmd', delay: 1000 },
  { text: '◆ node_01 found (12m)', cls: 'term-info', delay: 500 },
  { text: '◆ node_02 found (24m)', cls: 'term-info', delay: 400 },
  { text: '◆ node_03 found (8m)', cls: 'term-info', delay: 400 },
  { text: '✓ mesh_network ESTABLISHED', cls: 'term-success', delay: 800 },
  { text: 'loading encryption_keys...', cls: 'term-cmd', delay: 600 },
  { text: '✓ e2e_encryption ACTIVE', cls: 'term-success', delay: 500 },
  { text: '> BLUECHAT READY. 3 ALLIES ONLINE.', cls: 'term-success', delay: 0 },
];

const terminalEl = document.getElementById('terminal');
let terminalStarted = false;

const terminalObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !terminalStarted) {
      terminalStarted = true;
      runTerminal();
    }
  });
}, { threshold: 0.3 });

terminalObserver.observe(terminalEl);

async function runTerminal() {
  for (let i = 0; i < terminalLines.length; i++) {
    const line = terminalLines[i];
    await new Promise(r => setTimeout(r, line.delay));
    const div = document.createElement('div');
    div.className = 'term-line';
    div.innerHTML = `<span class="term-prompt">$</span> <span class="${line.cls}">${line.text}</span>`;
    div.style.animationDelay = '0s';
    terminalEl.appendChild(div);
    terminalEl.scrollTop = terminalEl.scrollHeight;
  }
}

// ============================
// Mesh Network Canvas
// ============================
const meshCanvas = document.getElementById('meshCanvas');
if (meshCanvas) {
  const mCtx = meshCanvas.getContext('2d');

  function resizeMesh() {
    const rect = meshCanvas.getBoundingClientRect();
    meshCanvas.width = rect.width;
    meshCanvas.height = rect.height;
  }
  resizeMesh();
  window.addEventListener('resize', resizeMesh);

  const nodes = [];
  const NODE_COUNT = 12;

  for (let i = 0; i < NODE_COUNT; i++) {
    nodes.push({
      x: 60 + Math.random() * (meshCanvas.width - 120),
      y: 60 + Math.random() * (meshCanvas.height - 120),
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: 6 + Math.random() * 4,
      pulsePhase: Math.random() * Math.PI * 2,
    });
  }

  let meshFrame = 0;

  function drawMesh() {
    mCtx.clearRect(0, 0, meshCanvas.width, meshCanvas.height);
    meshFrame += 0.02;

    // Draw grid lines
    mCtx.strokeStyle = 'rgba(226, 54, 54, 0.04)';
    mCtx.lineWidth = 0.5;
    for (let x = 0; x < meshCanvas.width; x += 40) {
      mCtx.beginPath();
      mCtx.moveTo(x, 0);
      mCtx.lineTo(x, meshCanvas.height);
      mCtx.stroke();
    }
    for (let y = 0; y < meshCanvas.height; y += 40) {
      mCtx.beginPath();
      mCtx.moveTo(0, y);
      mCtx.lineTo(meshCanvas.width, y);
      mCtx.stroke();
    }

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          const alpha = (1 - dist / 180) * 0.5;
          mCtx.strokeStyle = `rgba(226, 54, 54, ${alpha})`;
          mCtx.lineWidth = 1;
          mCtx.beginPath();
          mCtx.moveTo(nodes[i].x, nodes[i].y);
          mCtx.lineTo(nodes[j].x, nodes[j].y);
          mCtx.stroke();

          // Data packet animation
          const t = (Math.sin(meshFrame * 2 + i + j) + 1) / 2;
          const px = nodes[i].x + (nodes[j].x - nodes[i].x) * t;
          const py = nodes[i].y + (nodes[j].y - nodes[i].y) * t;
          mCtx.fillStyle = `rgba(226, 54, 54, ${alpha * 0.8})`;
          mCtx.beginPath();
          mCtx.arc(px, py, 2, 0, Math.PI * 2);
          mCtx.fill();
        }
      }
    }

    // Draw nodes
    for (const node of nodes) {
      const pulse = Math.sin(meshFrame * 2 + node.pulsePhase) * 0.3 + 0.7;

      // Glow
      const gradient = mCtx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 3);
      gradient.addColorStop(0, `rgba(226, 54, 54, ${0.3 * pulse})`);
      gradient.addColorStop(1, 'transparent');
      mCtx.fillStyle = gradient;
      mCtx.beginPath();
      mCtx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
      mCtx.fill();

      // Core
      mCtx.fillStyle = `rgba(226, 54, 54, ${0.8 * pulse})`;
      mCtx.beginPath();
      mCtx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      mCtx.fill();

      // Inner dot
      mCtx.fillStyle = `rgba(255, 255, 255, ${0.6 * pulse})`;
      mCtx.beginPath();
      mCtx.arc(node.x, node.y, node.radius * 0.4, 0, Math.PI * 2);
      mCtx.fill();

      // Movement
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 30 || node.x > meshCanvas.width - 30) node.vx *= -1;
      if (node.y < 30 || node.y > meshCanvas.height - 30) node.vy *= -1;
    }

    requestAnimationFrame(drawMesh);
  }
  drawMesh();
}

// ============================
// Smooth Scroll for Anchor Links
// ============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Close mobile nav if open
      if (window.innerWidth <= 768) {
        navLinks.style.display = 'none';
      }
    }
  });
});
