document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", event => {
    const btn = event.target.closest("[data-wishlist]");
    if (!btn) return;
    event.preventDefault();
    event.stopPropagation();
    const id = Number(btn.dataset.wishlist);
    const vehicle = Karna.getVehicle(id);
    if (Karna.wishlist.has(id)) {
      Karna.wishlist.delete(id);
      if (window.showToast) window.showToast(`${vehicle.name} dihapus dari wishlist.`, "info");
    } else {
      Karna.wishlist.add(id);
      if (window.showToast) window.showToast(`${vehicle.name} masuk wishlist.`, "success");
    }
    Karna.saveWishlist();
    setTimeout(() => location.reload(), 250);
  });
});
