document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", event => {
    const btn = event.target.closest("[data-quick]");
    if (!btn) return;
    event.preventDefault();
    event.stopPropagation();
    const v = Karna.getVehicle(btn.dataset.quick);
    document.querySelector("#quickViewBody").innerHTML = `
      <div class="quick-view-grid">
        <img src="${v.image}" alt="${v.name}">
        <div>
          <small class="text-muted">${v.brand} / ${v.type}</small>
          <h3 class="fw-black display-6">${v.name}</h3>
          <div class="price-lg">${Karna.rupiah.format(v.price)}</div>
          <p>${v.description}</p>
          <div class="feature-list">${v.features.slice(0, 4).map(f => `<span>${f}</span>`).join("")}</div>
          <a class="btn-solid btn-gradient mt-3" href="detail.html?id=${v.id}">Lihat Detail</a>
        </div>
      </div>`;
    bootstrap.Modal.getOrCreateInstance(document.querySelector("#quickViewModal")).show();
  });
});
