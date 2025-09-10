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
						return `<img src="${item.src}" alt="${item.alt || ''}" class="rounded-lg w-full max-h-100 object-cover mb-6">`;
					case "video":
						return `<video data-src="${item.src}" autoplay muted loop class="rounded-lg w-full max-h-100 object-cover mb-6"></video>`;
					default:
						return "";
				}
			}).join("");
		}

		const previewElement = project.preview_vid
			? `<video data-src="${project.preview_vid}" autoplay muted loop class="rounded-lg w-full max-h-96 object-cover mb-6"></video>`
			: `<img src="${project.preview_img}" alt="${project.title} preview" class="rounded-lg w-full max-h-96 object-cover mb-6">`;

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
const canvasContext = canvas.getContext("2d");
let particles = [];
let bright = true
let isVisible = true;

const canvasObserver = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		isVisible = entry.isIntersecting;
	});
}, { threshold: 0.1 });
canvasObserver.observe(canvas);

function resizeCanvas() {
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function randomColor() {
	if (Math.random() < 0.2) return "#ffd38e";
	const white = 10 + Math.floor(Math.random() * 26);
	return `rgb(${white},${white},${white})`;
}

function nextColor() {
	if (bright) {
		bright = false
		return "#ffd38e";
	}
	const white = 8 + Math.floor(Math.random() * 22);
	bright = true
	return `rgb(${white},${white},${white})`;
}

// easing method (taken from godot source code: https://github.com/godotengine/godot/blob/master/scene/animation/easing_equations.h )
function easeOutBounce(t) {
	const overshoot = 1.2;
	const peakTime = 0.7;

	if (t < peakTime) {
		const t1 = t / peakTime;
		return overshoot * (1 - Math.pow(1 - t1, 3));
	} else {
		const t2 = (t - peakTime) / (1 - peakTime);
		const smooth = t2 * t2 * (3 - 2 * t2);
		return overshoot - (overshoot - 1) * smooth;
	}
}

class Snowflake {
	constructor(id) {
		this.id = id;
		this.reset();
	}
	reset() {
		this.x = Math.random() * canvas.width;
		this.y = Math.random() * -canvas.height;
		this.size = Math.random() * 3 + 2;
		this.triggerHeight = 50 + Math.random() * (canvas.height - 140)
		this.originalSize = this.size;
		this.targetSize = this.size;
		this.speedY = Math.random() * 1 + 1.5;
		this.speedX = (Math.random() - 0.5) * 0.5;
		this.alpha = Math.random() * 0.5 + 0.5;
		//this.color = "#ffd38e";
		this.color = randomColor();
		this.glow = 6;
		this.isFrozen = false;
		this.growthProgress = 0;
		this.oscillationOffset = Math.random() * Math.PI * 2;
	}
	update() {
		if (!this.isFrozen) {
			this.x += this.speedX;
			this.y += this.speedY;

			if (this.y >= this.triggerHeight) {
				//this.color = nextColor();
				this.isFrozen = true;
				this.glow = 15;
				this.targetSize = 50 + Math.floor(Math.random() * 80);
				this.growthProgress = 0;
				if (this.color === "#ffd38e") {
					this.targetSize = 40 + Math.floor(Math.random() * 60);
				}

				window.dispatchEvent(new CustomEvent("particleFrozen"));
			}
		} else {
			if (this.growthProgress < 1) {
				this.growthProgress += 0.01;
				const eased = easeOutBounce(this.growthProgress);
				this.size = this.originalSize + (this.targetSize - this.originalSize) * eased;
			} else {
				const oscillation = Math.sin(Date.now() * 0.003 + this.oscillationOffset) * 2.8;
				this.size = this.targetSize + oscillation;
			}
		}
	}
	draw() {
		canvasContext.fillStyle = this.color;
		canvasContext.shadowColor = this.color;
		canvasContext.shadowBlur = this.glow;
		canvasContext.beginPath();
		canvasContext.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		canvasContext.fill();
	}
}

const snowflakeCount = 30;
for (let i = 0; i < snowflakeCount; i++) {
	particles.push(new Snowflake(i));
}

function animate() {
	if (isVisible) {
		canvasContext.fillStyle = "black";
		canvasContext.fillRect(0, 0, canvas.width, canvas.height);
		particles.forEach(p => {
			p.update();
			p.draw();
		});
	}

	requestAnimationFrame(animate);
}
animate();

// Alpine.js data
function heroProgress() {
	return {
		total: snowflakeCount,
		progress: 0,
		completed: false,
		init() {
			window.addEventListener("particleFrozen", () => {
				if (this.progress < this.total) {
					this.progress++;
				}
				if (this.progress >= this.total) {
					this.completed = true;
				}
			});
		}
	}
}

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

	animateLetters(hi, 1000, 100);
	const hiDuration = 1000 + 3 * 100;
	const pause = 1500;
	animateLetters(rest, hiDuration + pause, 60);
});