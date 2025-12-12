import '../styles/styles.css';
import { gsap } from 'gsap';

document.addEventListener('DOMContentLoaded', () => {
	initTestimonialsCarousel();
	initBurgerMenu();
});

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
