document.addEventListener("DOMContentLoaded", () => {
  revealOnScroll();
  initTilt();
  bindGallery();
});

function revealOnScroll() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .15 });
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

function initTilt() {
  if (!matchMedia("(pointer: fine)").matches) return;
  document.querySelectorAll(".tilt").forEach(card => {
    card.addEventListener("mousemove", event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.transform = `perspective(900px) rotateX(${y * -5}deg) rotateY(${x * 5}deg) translateY(-8px)`;
    });
    card.addEventListener("mouseleave", () => card.style.transform = "");
  });
}

function bindGallery() {
  document.querySelectorAll(".thumb").forEach(thumb => {
    thumb.addEventListener("click", () => {
      const main = document.querySelector("#mainPhoto");
      document.querySelectorAll(".thumb").forEach(item => item.classList.remove("active"));
      thumb.classList.add("active");
      main.style.opacity = "0";
      setTimeout(() => {
        main.src = thumb.dataset.thumb;
        main.closest("[data-lightbox]").dataset.lightbox = thumb.dataset.thumb;
        main.style.opacity = "1";
      }, 160);
    });
  });
}
