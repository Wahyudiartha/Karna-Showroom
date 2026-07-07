document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".hero-slider").forEach(initKarnaSlider);
});

function initKarnaSlider(root) {
  const track = root.querySelector(".slider-track");
  const originalSlides = [...root.querySelectorAll(".slide")];
  const dots = [...root.querySelectorAll(".slider-dot")];
  if (!track || originalSlides.length === 0) return;

  const visibleSlides = Math.min(2, originalSlides.length);
  const leadingClones = originalSlides.slice(-visibleSlides).map((slide) => slide.cloneNode(true));
  const trailingClones = originalSlides.slice(0, visibleSlides).map((slide) => slide.cloneNode(true));
  leadingClones.reverse().forEach((slide) => {
    slide.dataset.clone = "leading";
    track.insertBefore(slide, track.firstElementChild);
  });
  trailingClones.forEach((slide) => {
    slide.dataset.clone = "trailing";
    track.appendChild(slide);
  });

  const slides = [...track.querySelectorAll(".slide")];
  let index = visibleSlides;
  let startX = 0;
  let isMoving = false;

  const gap = () => Number.parseFloat(getComputedStyle(track).gap || "0");
  const slideWidth = () => slides[0].getBoundingClientRect().width + gap();
  const offset = () => -index * slideWidth();

  const setPosition = (withTransition = true) => {
    track.style.transition = withTransition ? "transform 480ms ease-in-out" : "none";
    track.style.transform = `translate3d(${offset()}px,0,0)`;
    updateActiveState();
  };

  const realIndex = () => {
    return ((index - visibleSlides) % originalSlides.length + originalSlides.length) % originalSlides.length;
  };

  const updateActiveState = () => {
    const active = realIndex();
    slides.forEach((slide, slideIndex) => {
      const normalized = ((slideIndex - visibleSlides) % originalSlides.length + originalSlides.length) % originalSlides.length;
      slide.classList.toggle("active", normalized === active);
    });
    dots.forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === active));
  };

  const moveTo = (nextIndex) => {
    if (isMoving) return;
    isMoving = true;
    index = nextIndex;
    requestAnimationFrame(() => setPosition(true));
  };

  track.addEventListener("transitionend", () => {
    if (index < visibleSlides) {
      index = originalSlides.length + index;
      setPosition(false);
    }
    if (index >= originalSlides.length + visibleSlides) {
      index = index - originalSlides.length;
      setPosition(false);
    }
    requestAnimationFrame(() => {
      isMoving = false;
      updateActiveState();
    });
  });

  const nextBtn = root.querySelector(".slider-next");
  if (nextBtn) nextBtn.addEventListener("click", () => moveTo(index + 1));
  const prevBtn = root.querySelector(".slider-prev");
  if (prevBtn) prevBtn.addEventListener("click", () => moveTo(index - 1));
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const target = Number(dot.dataset.slide) + visibleSlides;
      if (target !== index) moveTo(target);
    });
  });

  root.addEventListener("touchstart", (event) => {
    startX = event.touches[0].clientX;
  }, { passive: true });

  root.addEventListener("touchend", (event) => {
    const delta = event.changedTouches[0].clientX - startX;
    if (Math.abs(delta) > 42) moveTo(index + (delta < 0 ? 1 : -1));
  }, { passive: true });

  window.addEventListener("resize", () => setPosition(false), { passive: true });
  setPosition(false);
}
