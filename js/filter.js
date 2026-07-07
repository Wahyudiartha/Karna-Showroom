document.addEventListener("DOMContentLoaded", () => {
  const panel = document.querySelector("#filterPanel");
  if (!panel) return;
  panel.querySelectorAll("input, select").forEach(control => {
    control.addEventListener("input", () => renderFilteredVehicles(panel.dataset.category));
    control.addEventListener("change", () => renderFilteredVehicles(panel.dataset.category));
  });
});

function renderFilteredVehicles(category) {
  const grid = document.querySelector("#vehicleGrid");
  if (!grid) return;
  let list = Karna.byCategory(category);
  const textEl = document.querySelector("#filterText");
  const brandEl = document.querySelector("#filterBrand");
  const priceEl = document.querySelector("#filterPrice");
  const yearEl = document.querySelector("#filterYear");
  const typeEl = document.querySelector("#filterType");
  const sortEl = document.querySelector("#filterSort");
  const text = textEl ? textEl.value.trim().toLowerCase() : "";
  const brand = brandEl ? brandEl.value : "";
  const price = priceEl ? priceEl.value : "";
  const year = yearEl ? yearEl.value : "";
  const type = typeEl ? typeEl.value : "";
  const sort = sortEl ? sortEl.value : "newest";

  if (text) list = list.filter(v => `${v.name} ${v.brand} ${v.year} ${v.type}`.toLowerCase().includes(text));
  if (brand) list = list.filter(v => v.brand === brand);
  if (year) list = list.filter(v => String(v.year) === year);
  if (type) list = list.filter(v => v.type === type);
  if (price) {
    const [min, max] = price.split("-").map(Number);
    list = list.filter(v => v.price >= min && v.price <= max);
  }
  if (sort === "low") list.sort((a, b) => a.price - b.price);
  if (sort === "high") list.sort((a, b) => b.price - a.price);
  if (sort === "az") list.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "newest") list.sort((a, b) => b.year - a.year || b.price - a.price);

  if (!list.length) {
    grid.innerHTML = `<div class="empty-state"><div><i class="fa-solid fa-magnifying-glass fs-1 mb-3"></i><p>Pencarian tidak ditemukan.</p></div></div>`;
    if (window.showToast) window.showToast("Pencarian tidak ditemukan.", "info");
    return;
  }
  const displayLimit = category === "mobil" ? 8 : category === "motor" ? 6 : list.length;
  list = list.slice(0, displayLimit);
  grid.innerHTML = list.map((v, i) => vehicleCard(v, i)).join("");
}
window.renderFilteredVehicles = renderFilteredVehicles;
