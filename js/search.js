document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector("#globalSearch");
  const box = document.querySelector("#searchResults");
  if (!input || !box) return;

  const render = () => {
    const keyword = input.value.trim().toLowerCase();
    if (!keyword) {
      box.classList.remove("show");
      box.innerHTML = "";
      return;
    }
    const result = vehicles.filter(v => `${v.name} ${v.brand} ${v.category} ${v.year} ${v.type}`.toLowerCase().includes(keyword)).slice(0, 8);
    if (!result.length) {
      box.innerHTML = `<div class="search-item"><i class="fa-solid fa-magnifying-glass"></i><strong>Pencarian tidak ditemukan</strong><span></span></div>`;
      box.classList.add("show");
      if (window.showToast) window.showToast("Pencarian tidak ditemukan.", "info");
      return;
    }
    box.innerHTML = result.map(v => `
      <button class="search-item" data-search="${v.id}">
        <img src="${v.image}" alt="${v.name}">
        <span><strong>${v.name}</strong><small>${v.brand} / ${v.category} / ${v.year}</small></span>
        <i class="fa-solid fa-arrow-right"></i>
      </button>
    `).join("");
    box.classList.add("show");
  };

  input.addEventListener("input", render);
  input.addEventListener("focus", render);
  document.addEventListener("click", e => {
    if (e.target.closest("[data-search]")) {
      location.href = `detail.html?id=${e.target.closest("[data-search]").dataset.search}`;
    }
    if (!e.target.closest(".search-box")) box.classList.remove("show");
  });
});
