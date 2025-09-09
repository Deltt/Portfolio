// Content
const projects = [
	{
		title: "Procedural Terrain in Browsers",
		description: "Another project showing my skills.",
		link: "#",
		preview_img: "img/terrain.jpg",
		preview_vid: "vid/terrain.mp4",
		content: [
			{ type: "p", text: "A deeper explanation of Project One." },
			{ type: "video", src: "vid/terrain_chunks.mp4", controls: false },
		]
	},
	{
		title: "Planet Generator",
		description: "An interesting web app I built.",
		link: "#",
		preview_img: "img/planet.jpg",
		preview_vid: "vid/planet.mp4",
		content: [
			{ type: "p", text: "A deeper explanation of Project One." },
		]
	},
	{
		title: "Oven Control Display",
		description: "An interesting app I built.",
		link: "#",
		preview_img: "img/oven.jpg",
		content: [
			{ type: "p", text: "A deeper explanation of Project One." },
		]
	},
	{
		title: "PSX Horror Game",
		description: "An interesting app I built.",
		link: "#",
		preview_img: "img/horror.jpg",
		content: [
			{ type: "p", text: "A deeper explanation of Project One." },
			{ type: "video", src: "vid/horror.mp4", controls: false },
		]
	},
];

const projectsContainer = document.getElementById("projects-container");
const expandedSection = document.getElementById("expanded-project");
const expandedCard = document.getElementById("expanded-card");
let lastClickedCard = null;

projects.forEach(project => {
	const card = document.createElement("div");
	card.className = "fade-in bg-neutral-900 rounded-lg shadow-lg p-6 flex flex-col justify-between hover:scale-105 transition-transform cursor-pointer";

	card.innerHTML = `
        <img src="${project.preview_img}" alt="${project.title} preview" class="rounded-lg w-full h-48 object-cover mb-4">
        <div class="p-6 flex flex-col flex-grow">
            <h4 class="text-2xl font-bold mb-3 text-white">${project.title}</h4>
            <p class="text-gray-400 mb-6 flex-grow">${project.description}</p>
        </div>
    `;

	card.addEventListener("click", () => {
		lastClickedCard = card;
		expandedCard.className = "bg-neutral-900 rounded-lg shadow-lg p-8 cursor-pointer transition-transform"; // no hover:scale-105

		// Render flexible content
		let additionalContent = "";
		if (project.content && project.content.length > 0) {
			additionalContent = project.content.map(item => {
				switch (item.type) {
					case "p":
						return `<p class="text-gray-300 mb-4">${item.text}</p>`;
					case "img":
						return `<img src="${item.src}" alt="${item.alt || ''}" class="rounded-lg w-full mb-4">`;
					case "video":
						return `<video src="${item.src}" autoplay muted loop class="w-full mb-4 rounded-lg"></video>`;
					default:
						return ""; // ignore unknown types
				}
			}).join("");
		}

		// Show preview_vid if available, otherwise preview_img
		const previewElement = project.preview_vid
			? `<video src="${project.preview_vid}" autoplay muted loop class="w-full h-96 object-cover mb-6 rounded-lg"></video>`
			: `<img src="${project.preview_img}" alt="${project.title} preview" class="rounded-lg w-full h-96 object-cover mb-6">`;

		expandedCard.innerHTML = `
			${previewElement}
			<div class="flex flex-col">
				<h2 class="text-3xl font-bold mb-4 text-white">${project.title}</h2>
				<p class="text-gray-400 mb-6">${project.description}</p>
				${additionalContent}
				<a href="${project.link}" class="text-blue-500 hover:underline">View Project</a>
			</div>
		`;

		expandedSection.classList.remove("hidden");
		window.scrollTo({ top: expandedSection.offsetTop, behavior: "smooth" });
	});

	projectsContainer.appendChild(card);
});


// Clicking the expanded card closes it
expandedCard.addEventListener("click", () => {
	expandedSection.classList.add("hidden");

	if (lastClickedCard) {
		lastClickedCard.scrollIntoView({ behavior: "smooth", block: "center" });
	}
});

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