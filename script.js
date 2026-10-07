'use strict';

// CONFIG: tiempos y límites para mantener ligera la celebración en móvil.
const CONFIG = {
  openingDuration: 1800,
  colors: ['#4268cf', '#233f93', '#ecc875', '#ffffff'],
  burstTimes: [0, 550, 1150, 1800, 2500],
  maxDpr: 2,
};
const experience = document.querySelector('#experience');
const envelope = document.querySelector('#envelope');
const invitation = document.querySelector('#invitation');
const accept = document.querySelector('#accept');
const celebration = document.querySelector('#celebration');
const music = document.querySelector('#music');
const canvas = document.querySelector('#fireworks');
const context = canvas.getContext('2d');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let particles = [];
let animationFrame = null;
let lastTimestamp = null;
let viewport = { width: 0, height: 0 };

function init() {
  resizeCanvas();
  envelope.addEventListener('click', openEnvelope);
  accept.addEventListener('click', acceptInvitation);
  window.addEventListener('resize', resizeCanvas);
  music.volume = 0.55;
  startMusic();
}

function startMusic() {
  if (!music.paused || music.ended) return;
  const attempt = music.play();
  if (attempt) attempt.then(() => {
    document.querySelector('#audio-status').textContent = '';
  }).catch((error) => {
    document.querySelector('#audio-status').textContent = error.name === 'NotAllowedError'
      ? 'La música comienza al abrir tu carta.' : 'No se pudo reproducir la música.';
  });
}

function openEnvelope() {
  if (experience.dataset.state !== 'closed') return;
  startMusic(); // Una interacción permite el audio cuando el navegador bloquea autoplay.
  experience.dataset.state = 'opening';
  envelope.disabled = true;
  window.setTimeout(revealInvitation, motionPreference.matches ? 0 : CONFIG.openingDuration);
}

function revealInvitation() {
  document.querySelector('.envelope-scene').hidden = true;
  invitation.hidden = false;
  experience.dataset.state = 'invitation';
  document.querySelector('#invitation-title').focus({ preventScroll: true });
}

function acceptInvitation() {
  if (experience.dataset.state !== 'invitation') return;
  accept.disabled = true;
  experience.dataset.state = 'accepted';
  invitation.hidden = true;
  celebration.hidden = false;
  window.scrollTo(0, 0);
  document.querySelector('#celebration-title').focus({ preventScroll: true });
  launchHeartFireworks();
}

function launchHeartFireworks() {
  if (!context) return;
  const times = motionPreference.matches ? [0] : CONFIG.burstTimes;
  const positions = [[.5,.32],[.22,.5],[.77,.4],[.32,.23],[.7,.66]];
  times.forEach((delay, index) => window.setTimeout(() => {
    const [x, y] = positions[index];
    createHeartBurst(x * viewport.width, y * viewport.height, Math.min(viewport.width * .015, 7));
    if (animationFrame === null) {
      lastTimestamp = null;
      animationFrame = requestAnimationFrame(updateParticles);
    }
  }, delay));
}

function createHeartBurst(x, y, scale) {
  const reduced = motionPreference.matches;
  const count = reduced ? 28 : viewport.width < 500 ? 95 : 150;
  const color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
  for (let i = 0; i < count; i++) {
    const t = i / count * Math.PI * 2;
    // Ecuación paramétrica del corazón; invertir Y adapta la curva al Canvas.
    const heartX = 16 * Math.sin(t) ** 3;
    const heartY = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
    const variation = .85 + Math.random() * .3;
    const life = reduced ? .8 : 1.8 + Math.random() * .9;
    particles.push({x:x + heartX * scale * .2, y:y + heartY * scale * .2,
      vx:heartX * scale * variation * (reduced ? .12 : .65) + (Math.random()-.5)*8,
      vy:heartY * scale * variation * (reduced ? .12 : .65) + (Math.random()-.5)*8,
      life, maxLife:life, alpha:1, size:1.4 + Math.random()*1.7, color, confetti:false});
  }
  if (!reduced) for (let i = 0; i < 22; i++) {
    const life = 2 + Math.random();
    particles.push({x, y, vx:(Math.random()-.5)*180, vy:-40-Math.random()*120,
      life, maxLife:life, alpha:1, size:3+Math.random()*3,
      color:CONFIG.colors[i % CONFIG.colors.length], confetti:true});
  }
}

function updateParticles(timestamp) {
  const delta = lastTimestamp === null ? 0 : Math.min((timestamp-lastTimestamp)/1000,.04);
  lastTimestamp = timestamp;
  context.clearRect(0, 0, viewport.width, viewport.height);
  particles = particles.filter(particle => particle.life > 0);
  for (const particle of particles) {
    particle.life -= delta;
    particle.x += particle.vx * delta;
    particle.y += particle.vy * delta;
    particle.vy += (particle.confetti ? 85 : 22) * delta;
    particle.alpha = Math.max(0, particle.life / particle.maxLife);
    context.globalAlpha = particle.alpha;
    context.fillStyle = particle.color;
    if (particle.confetti) context.fillRect(particle.x, particle.y, particle.size, particle.size * .5);
    else {
      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI*2);
      context.fill();
    }
  }
  context.globalAlpha = 1;
  if (particles.length) animationFrame = requestAnimationFrame(updateParticles);
  else {
    context.clearRect(0, 0, viewport.width, viewport.height);
    animationFrame = null;
    lastTimestamp = null;
  }
}

function resizeCanvas() {
  viewport = { width: window.innerWidth, height: window.innerHeight };
  const dpr = Math.min(window.devicePixelRatio || 1, CONFIG.maxDpr);
  canvas.width = Math.round(viewport.width * dpr);
  canvas.height = Math.round(viewport.height * dpr);
  if (context) context.setTransform(dpr, 0, 0, dpr, 0, 0);
}

init();
