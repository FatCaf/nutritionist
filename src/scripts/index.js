import '../styles/styles.css';
import { gsap } from 'gsap';
import L from 'leaflet';

document.addEventListener('DOMContentLoaded', () => {
	initTestimonialsCarousel();
	initBurgerMenu();
	initFAQ();
	initPricingSwitch();
	initMap();
	initContactForm();
});

function initMap() {
	const mapElement = document.getElementById('map');
	if (!mapElement) return;

	const lat = 28.6139;
	const lng = 77.209;

	const map = L.map('map').setView([lat, lng], 13);

	// L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
	// 	attribution:
	// 		'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	// 	subdomains: 'abcd',
	// 	maxZoom: 20,
	// 	vectorTileLayerStyles: {
	// 		road: {
	// 			weight: 1.5,
	// 			color: 'red',
	// 		},
	// 		landuse: {
	// 			fill: true,
	// 			fillColor: '#2b2b2b',
	// 		},
	// 		water: {
	// 			fill: true,
	// 			fillColor: '#1e90ff',
	// 		},
	// 	},
	// }).addTo(map);

	L.vectorGrid
		.protobuf(
			`https://api.maptiler.com/tiles/v3/{z}/{x}/{y}.pbf?key=${process.env.MAP_LITER_KEY}`,
			{
				maxZoom: 20,
				vectorTileLayerStyles: {
					transportation: (p) => ({
						color: '#ff3b3b',
						weight: 2,
					}),
					landcover: (p) => ({
						fill: true,
						fillColor: '#1b1b1b',
					}),
					water: (p) => ({
						fill: true,
						fillColor: '#3c8bff',
					}),
				},
			}
		)
		.addTo(map);

	const greenIcon = L.icon({
		iconUrl: '/images/pin.svg',
		iconSize: [38, 95],
		iconAnchor: [22, 94],
		popupAnchor: [-3, -76],
	});

	L.marker([lat, lng])
		.addTo(map)
		.bindPopup('Nutritionist HQ<br> Some Where in the World')
		.openPopup();
}

function initContactForm() {
	const form = document.getElementById('contactForm');
	if (!form) return;

	form.addEventListener('submit', (e) => {
		e.preventDefault();

		const formData = new FormData(form);
		const data = {};

		formData.forEach((value, key) => {
			data[key] = escapeHtml(value);
		});

		console.log('Form Data Submitted:', data);
		alert('Thank you for your message! We will get back to you soon.');
		form.reset();
	});
}

function escapeHtml(text) {
	if (!text) return text;
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

function initPricingSwitch() {
	const toggle = document.querySelector('.pricing__switch input');
	const amounts = document.querySelectorAll('.pricing-card__amount');
	const periods = document.querySelectorAll('.pricing-card__period');

	if (!toggle) return;

	const monthlyPrices = [];
	amounts.forEach((amount) => monthlyPrices.push(amount.textContent));

	toggle.addEventListener('change', () => {
		const isYearly = toggle.checked;

		amounts.forEach((amount, index) => {
			if (isYearly) {
				const monthlyPrice = parseInt(monthlyPrices[index]);
				const yearlyPrice = Math.round(monthlyPrice * 0.5);
				amount.textContent = yearlyPrice;
			} else {
				amount.textContent = monthlyPrices[index];
			}
		});

		periods.forEach((period) => {
			period.textContent = isYearly ? '/month' : '/month';
		});
	});
}

function initFAQ() {
	const faqItems = document.querySelectorAll('.faq__item');

	if (faqItems.length === 0) return;

	faqItems.forEach((item) => {
		const header = item.querySelector('.faq__question');

		header.addEventListener('click', () => {
			faqItems.forEach((otherItem) => {
				if (otherItem !== item && otherItem.classList.contains('active')) {
					otherItem.classList.remove('active');
				}
			});

			item.classList.toggle('active');
		});
	});
}

function initBurgerMenu() {
	const burgerMenu = document.querySelector('.burger-menu');
	const nav = document.querySelector('.nav');

	if (!burgerMenu || !nav) return;

	burgerMenu.addEventListener('click', () => {
		burgerMenu.classList.toggle('active');
		nav.classList.toggle('active');
		document.body.style.overflow = nav.classList.contains('active')
			? 'hidden'
			: '';
	});

	const navLinks = nav.querySelectorAll('.nav__link');
	navLinks.forEach((link) => {
		link.addEventListener('click', () => {
			burgerMenu.classList.remove('active');
			nav.classList.remove('active');
			document.body.style.overflow = '';
		});
	});
}

function initTestimonialsCarousel() {
	const carousel = document.querySelector('.testimonials__carousel');
	const track = document.querySelector('.testimonials__track');
	const cards = document.querySelectorAll('.testimonial-card');
	const dotsContainer = document.querySelector('.testimonials__dots');
	const prevBtn = document.querySelector('.testimonials__arrow--prev');
	const nextBtn = document.querySelector('.testimonials__arrow--next');

	if (!carousel || !track || cards.length === 0) return;

	let currentIndex = 0;
	let cardsPerView = getCardsPerView();
	let totalPages = Math.ceil(cards.length / cardsPerView);

	function getCardsPerView() {
		if (window.innerWidth <= 768) return 1;
		if (window.innerWidth <= 1024) return 2;
		return 3;
	}

	function createDots() {
		dotsContainer.innerHTML = '';
		totalPages = Math.ceil(cards.length / cardsPerView);

		for (let i = 0; i < totalPages; i++) {
			const dot = document.createElement('button');
			dot.classList.add('testimonials__dot');
			dot.setAttribute('type', 'button');
			dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
			if (i === currentIndex) {
				dot.classList.add('testimonials__dot--active');
			}
			dot.addEventListener('click', () => goToSlide(i));
			dotsContainer.appendChild(dot);
		}
	}

	function updateDots() {
		const dots = dotsContainer.querySelectorAll('.testimonials__dot');
		dots.forEach((dot, index) => {
			dot.classList.toggle('testimonials__dot--active', index === currentIndex);
		});
	}

	function updateButtons() {
		prevBtn.disabled = currentIndex === 0;
		nextBtn.disabled = currentIndex >= totalPages - 1;
	}

	function getSlideOffset() {
		const card = cards[0];
		const cardStyle = window.getComputedStyle(card);
		const cardWidth = card.offsetWidth;
		const gap = parseFloat(getComputedStyle(track).gap) || 32;
		return (cardWidth + gap) * cardsPerView * currentIndex;
	}

	function goToSlide(index) {
		currentIndex = Math.max(0, Math.min(index, totalPages - 1));
		const offset = getSlideOffset();

		gsap.to(track, {
			x: -offset,
			duration: 0.5,
			ease: 'none',
		});

		updateDots();
		updateButtons();
	}

	function nextSlide() {
		if (currentIndex < totalPages - 1) {
			goToSlide(currentIndex + 1);
		}
	}

	function prevSlide() {
		if (currentIndex > 0) {
			goToSlide(currentIndex - 1);
		}
	}

	function handleResize() {
		const newCardsPerView = getCardsPerView();
		if (newCardsPerView !== cardsPerView) {
			cardsPerView = newCardsPerView;
			currentIndex = 0;
			createDots();
			gsap.set(track, { x: 0 });
			updateButtons();
		}
	}

	prevBtn.addEventListener('click', prevSlide);
	nextBtn.addEventListener('click', nextSlide);
	window.addEventListener('resize', handleResize);

	createDots();
	updateButtons();
}
