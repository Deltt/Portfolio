// Fade in
const observer = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			entry.target.classList.add("visible");   // fade in
		} else {
			entry.target.classList.remove("visible"); // fade out
		}
	});
}, { threshold: 0.1 });

document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));

// Smooth scroll-to
const offset = 20;
document.querySelectorAll('nav a').forEach(link => {
	link.addEventListener('click', e => {
		e.preventDefault();
		const target = document.querySelector(link.getAttribute('href'));
		const topPos = target.getBoundingClientRect().top + window.scrollY - offset;
		window.scrollTo({ top: topPos, behavior: 'smooth' });
	});
});

// Hero particles
const canvas = document.getElementById("hero-canvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class Particle {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.size = Math.random() * 3 + 4;  // smaller
		this.speedX = (Math.random() - 0.5) * 1; // slower
		this.speedY = (Math.random() - 0.5) * 1;
		this.alpha = 1;
	}
	update() {
		this.x += this.speedX;
		this.y += this.speedY;
		this.alpha -= 0.015; // fadeout time
	}
	draw() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		ctx.fillStyle = "rgba(255,255,255," + this.alpha + ")";
		ctx.shadowColor = "white";
		ctx.shadowBlur = 12;
		ctx.fill();
	}
}

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	particles = particles.filter(p => p.alpha > 0);
	particles.forEach(p => {
		p.update();
		p.draw();
	});
	requestAnimationFrame(animate);
}
animate();

document.getElementById("hero").addEventListener("mousemove", (e) => {
	const rect = canvas.getBoundingClientRect();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;
	particles.push(new Particle(x, y));
});

// Fixed scroll bar (save)
window.addEventListener('beforeunload', () => {
	sessionStorage.setItem('scrollPos', window.scrollY);
});

// Fixed scroll bar (restore)
window.addEventListener('load', () => {
	const scrollPos = sessionStorage.getItem('scrollPos');
	if (scrollPos) window.scrollTo(0, parseInt(scrollPos));
});

// Fly in hero
document.addEventListener("DOMContentLoaded", () => {
  function animateLetters(container, delayStart = 0, stagger = 50) {
    const text = container.textContent;
    container.textContent = "";

    [...text].forEach((ch, i) => {
      const span = document.createElement("span");
      span.textContent = ch === " " ? "\u00A0" : ch;
      container.appendChild(span);

      span.style.animation = `flyUp 0.5s ease-out forwards`;
      span.style.animationDelay = `${delayStart + i * stagger}ms`;
    });
  }

  const hi = document.querySelector(".hero-title .hi");
  const rest = document.querySelector(".hero-title .rest");

  // Animate "Hi," first
  animateLetters(hi, 4000, 100); // 1s initial delay, 100ms stagger

  // Animate rest after "Hi," + 0.5s pause
  const hiDuration = 4000 + 3 * 100; // 1s initial + 3 letters * 100ms
  const pause = 1500;
  animateLetters(rest, hiDuration + pause, 60);
});