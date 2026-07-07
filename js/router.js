document.addEventListener("DOMContentLoaded", () => {
  const knownPages = ["index.html", "mobil.html", "motor.html", "detail.html", "transaksi.html", "wishlist.html", "404.html", ""];
  const current = location.pathname.split("/").pop();
  if (!knownPages.includes(current)) location.href = "404.html";
});
