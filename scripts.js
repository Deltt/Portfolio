// Content
const projects = [
	{
		title: "Procedural Terrain in Browsers",
		description: "Another project showing my skills.",
		link: "#",
		preview_img: "img/terrain.jpg",
		preview_vid: "vid/terrain.mp4",
		category: "3d",
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
		category: "3d",
		content: [
			{ type: "p", text: "A deeper explanation of Project One." },
		]
	},
	{
		title: "Oven Control Display",
		description: "An interesting app I built.",
		link: "#",
		preview_img: "img/oven.jpg",
		category: "design",
		content: [
			{ type: "p", text: "A deeper explanation of Project One." },
		]
	},
	{
		title: "PSX Horror Game",
		description: "An interesting app I built.",
		link: "#",
		preview_img: "img/horror.jpg",
		category: "misc",
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
	card.setAttribute("x-show", `selectedCategory==='all' || selectedCategory==='${project.category}'`);

	card.innerHTML = `
        <img src="${project.preview_img}" alt="${project.title} preview" class="rounded-lg w-full h-48 object-cover mb-4">
        <div class="p-6 flex flex-col flex-grow">
            <h4 class="text-2xl font-bold mb-3 text-white">${project.title}</h4>
            <p class="text-gray-400 mb-6 flex-grow">${project.description}</p>
        </div>
    `;

	card.addEventListener("click", () => {
		lastClickedCard = card;
		expandedCard.className = "bg-neutral-900 rounded-lg shadow-lg p-8 cursor-pointer transition-transform";

		let additionalContent = "";
		if (project.content && project.content.length > 0) {
			additionalContent = project.content.map(item => {
				switch (item.type) {
					case "p":
						return `<p class="text-gray-300 mb-4">${item.text}</p>`;
					case "img":
						return `<img src="${item.src}" alt="${item.alt || ''}" class="rounded-lg w-full mb-4">`;
					case "video":
						return `<video data-src="${item.src}" autoplay muted loop class="w-full mb-4 rounded-lg"></video>`;
					default:
						return "";
				}
			}).join("");
		}

		const previewElement = project.preview_vid
			? `<video data-src="${project.preview_vid}" autoplay muted loop class="w-full h-96 object-cover mb-6 rounded-lg"></video>`
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

		expandedCard.querySelectorAll('video').forEach(video => {
			if (!video.src) {
				video.src = video.dataset.src;
				video.load();
			}
		});

		expandedSection.classList.remove("hidden");
		window.scrollTo({ top: expandedSection.offsetTop, behavior: "smooth" });
	});

	projectsContainer.appendChild(card);
});


// Clicking the expanded card closes it
expandedCard.addEventListener("click", () => {
	expandedSection.classList.add("hidden");

	if (lastClickedCard) {
		// lastClickedCard.scrollIntoView({ behavior: "smooth", block: "start" });
		const top = lastClickedCard.getBoundingClientRect().top + window.scrollY - 240;
		window.scrollTo({ top, behavior: "smooth" });
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

// Smooth scroll with offset
document.querySelectorAll('a[href^="#"]').forEach(link => {
	link.addEventListener('click', e => {
		e.preventDefault();
		const target = document.querySelector(link.getAttribute('href'));
		const offset = 40;
		const topPos = target.getBoundingClientRect().top + window.scrollY - offset;
		window.scrollTo({ top: topPos, behavior: 'smooth' });
	});
});

// Hero particles
const canvas = document.getElementById("hero-canvas");
const ctx = canvas.getContext("2d");
let particles = [];
const mouse = { x: null, y: null, radius: 40 }; // trigger radius

function resizeCanvas() {
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// utility: generate dark purple or rare bright orange
function randomColor() {
	if (Math.random() < 0.1) return "#ffd38e"; // 5% chance bright orange
	const white = 8 + Math.floor(Math.random() * 22);
	return `rgb(${white},${white},${white})`;
}

// simple easing function for bounce effect
function easeOutBounce(t) {
	const n1 = 7.5625;
	const d1 = 2.75;
	if (t < 1 / d1) {
		return n1 * t * t;
	} else if (t < 2 / d1) {
		t -= 1.5 / d1;
		return n1 * t * t + 0.75;
	} else if (t < 2.5 / d1) {
		t -= 2.25 / d1;
		return n1 * t * t + 0.9375;
	} else {
		t -= 2.625 / d1;
		return n1 * t * t + 0.984375;
	}
}

class Snowflake {
	constructor() {
		this.reset();
	}
	reset() {
		this.x = Math.random() * canvas.width;
		this.y = Math.random() * -canvas.height;
		this.size = Math.random() * 3 + 2;
		this.originalSize = this.size;
		this.targetSize = this.size;
		this.speedY = Math.random() * 1 + 0.5;
		this.speedX = (Math.random() - 0.5) * 0.5;
		this.alpha = Math.random() * 0.5 + 0.5;
		this.color = randomColor();
		this.glow = 6;
		this.isFrozen = false;
		this.growthProgress = 0; // for initial bounce growth
		this.oscillationOffset = Math.random() * Math.PI * 2; // random start phase
	}
	update() {
		if (!this.isFrozen) {
			this.x += this.speedX;
			this.y += this.speedY;

			if (mouse.x !== null && mouse.y !== null) {
				const dx = this.x - mouse.x;
				const dy = this.y - mouse.y;
				const dist = Math.sqrt(dx * dx + dy * dy);
				if (dist < mouse.radius) {
					this.isFrozen = true;
					//this.color = randomColor();
					this.glow = 15;
					this.targetSize = 50 + Math.floor(Math.random() * 80);
					this.growthProgress = 0;
				}
			}
		} else {
			// animate size growth with bounce easing
			if (this.growthProgress < 1) {
				this.growthProgress += 0.02;
				const eased = easeOutBounce(this.growthProgress);
				this.size = this.originalSize + (this.targetSize - this.originalSize) * eased;
			} else {
				// minor oscillation for frozen particles
				const oscillation = Math.sin(Date.now() * 0.003 + this.oscillationOffset) * 2.8; 
				this.size = this.targetSize + oscillation; 
			}
		}

		// reset if out of canvas (keep frozen state)
		if (this.y > canvas.height || this.x < 0 || this.x > canvas.width) {
			const frozen = this.isFrozen;
			const oldColor = this.color;
			const oldGlow = this.glow;
			const oldSize = this.size;
			const oldOriginalSize = this.originalSize;
			const oldTargetSize = this.targetSize;
			const oldProgress = this.growthProgress;
			this.reset();
			this.y = -this.size;
			if (frozen) {
				this.isFrozen = true;
				this.color = oldColor;
				this.glow = oldGlow;
				this.size = oldSize;
				this.originalSize = oldOriginalSize;
				this.targetSize = oldTargetSize;
				this.growthProgress = oldProgress;
			}
		}
	}
	draw() {
		ctx.fillStyle = this.color;
		ctx.shadowColor = this.color;
		ctx.shadowBlur = this.glow;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		ctx.fill();
	}
}

// initialize particles
const snowflakeCount = 40;
for (let i = 0; i < snowflakeCount; i++) {
	particles.push(new Snowflake());
}

function animate() {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	particles.forEach(p => {
		p.update();
		p.draw();
	});

	requestAnimationFrame(animate);
}
animate();

// mouse tracking
document.getElementById("hero").addEventListener("mousemove", (e) => {
	const rect = canvas.getBoundingClientRect();
	mouse.x = e.clientX - rect.left;
	mouse.y = e.clientY - rect.top;
});
document.getElementById("hero").addEventListener("mouseleave", () => {
	mouse.x = null;
	mouse.y = null;
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
	animateLetters(hi, 3000, 100); // 1s initial delay, 100ms stagger

	// Animate rest after "Hi," + 0.5s pause
	const hiDuration = 3000 + 3 * 100; // 1s initial + 3 letters * 100ms
	const pause = 1500;
	animateLetters(rest, hiDuration + pause, 60);
});