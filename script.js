const phases = {
  awakening: {
    label: "Phase 1",
    title: "Digital Awakening & AI Literacy",
    copy:
      "Demystify neural networks, compare search with conversational AI, and practice prompt engineering as clear thinking made visible.",
    modules: [
      "AI myths, model behavior, and everyday safety",
      "Prompt craft for questions, stories, and study",
      "Tablet-first exploration with local examples",
    ],
  },
  creation: {
    label: "Phase 2",
    title: "Generative Creativity",
    copy:
      "Use image, video, and sound models to preserve local memory, remix folklore, and make multi-sensory stories rooted in place.",
    modules: [
      "Text-to-image and image-to-image cultural remixing",
      "AI video for landscape, craft, and oral history",
      "Atmospheric soundscapes for village stories",
    ],
  },
  agents: {
    label: "Phase 3",
    title: "Autonomous Agents & Sovereignty",
    copy:
      "Build small, understandable agents for local needs: translation, farm tracking, archives, learning support, and entrepreneurship.",
    modules: [
      "Agent loops, tools, memory, and safeguards",
      "Localized prototypes for agriculture and language",
      "Open-source habits for community ownership",
    ],
  },
};

const tabs = document.querySelectorAll(".phase-tab");
const phaseLabel = document.querySelector("#phase-label");
const phaseTitle = document.querySelector("#phase-title");
const phaseCopy = document.querySelector("#phase-copy");
const phaseModules = document.querySelector("#phase-modules");

function setPhase(key) {
  const phase = phases[key];
  if (!phase) return;

  tabs.forEach((tab) => {
    const isActive = tab.dataset.phase === key;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  phaseLabel.textContent = phase.label;
  phaseTitle.textContent = phase.title;
  phaseCopy.textContent = phase.copy;
  phaseModules.replaceChildren(
    ...phase.modules.map((module) => {
      const item = document.createElement("li");
      item.textContent = module;
      return item;
    }),
  );
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => setPhase(tab.dataset.phase));
});

const canvas = document.querySelector("#signal-canvas");
const context = canvas?.getContext("2d");
let width = 0;
let height = 0;
let points = [];
let rafId = null;
let pointer = { x: 0, y: 0, active: false };

function resizeCanvas() {
  if (!canvas || !context) return;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  width = rect.width;
  height = rect.height;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);

  const density = width < 760 ? 26 : 42;
  points = Array.from({ length: density }, (_, index) => ({
    x: width * (0.48 + Math.random() * 0.48),
    y: height * (0.12 + Math.random() * 0.74),
    baseX: width * (0.48 + Math.random() * 0.48),
    baseY: height * (0.12 + Math.random() * 0.74),
    phase: index * 0.62,
    speed: 0.35 + Math.random() * 0.45,
  }));
}

function drawSignals(time) {
  if (!canvas || !context) return;
  context.clearRect(0, 0, width, height);

  points.forEach((point) => {
    point.x = point.baseX + Math.sin(time * 0.00045 * point.speed + point.phase) * 22;
    point.y = point.baseY + Math.cos(time * 0.00038 * point.speed + point.phase) * 18;

    if (pointer.active) {
      const dx = pointer.x - point.x;
      const dy = pointer.y - point.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 180) {
        point.x -= dx * 0.018;
        point.y -= dy * 0.018;
      }
    }
  });

  for (let a = 0; a < points.length; a += 1) {
    for (let b = a + 1; b < points.length; b += 1) {
      const from = points[a];
      const to = points[b];
      const distance = Math.hypot(from.x - to.x, from.y - to.y);
      if (distance > 145) continue;

      const alpha = 1 - distance / 145;
      context.strokeStyle = `rgba(77, 201, 184, ${alpha * 0.35})`;
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(from.x, from.y);
      context.lineTo(to.x, to.y);
      context.stroke();
    }
  }

  points.forEach((point, index) => {
    const flicker = 0.45 + Math.sin(time * 0.002 + index) * 0.3;
    context.fillStyle = `rgba(244, 235, 215, ${0.38 + flicker * 0.32})`;
    context.beginPath();
    context.arc(point.x, point.y, 1.8 + flicker, 0, Math.PI * 2);
    context.fill();
  });

  rafId = requestAnimationFrame(drawSignals);
}

if (canvas && context && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  resizeCanvas();
  rafId = requestAnimationFrame(drawSignals);

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("pointermove", (event) => {
    pointer = { x: event.clientX, y: event.clientY, active: true };
  });
  window.addEventListener("pointerleave", () => {
    pointer.active = false;
  });
}

window.addEventListener("beforeunload", () => {
  if (rafId) cancelAnimationFrame(rafId);
});
