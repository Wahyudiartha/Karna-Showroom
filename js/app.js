const Karna = {
  rupiah: new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }),
  page: document.body.dataset.page,
  category: document.body.dataset.category,
  params: new URLSearchParams(location.search),
  wishlist: new Set(JSON.parse(localStorage.getItem("karnaWishlist") || "[]").map(Number)),
  transactions: JSON.parse(localStorage.getItem("karnaTransactions") || "[]"),
  selectedVehicle: localStorage.getItem("karnaSelectedVehicle") || "",
  getVehicle(id) {
    return vehicles.find((vehicle) => Number(vehicle.id) === Number(id));
  },
  byCategory(category) {
    return vehicles.filter((vehicle) => vehicle.category === category);
  },
  saveWishlist() {
    localStorage.setItem("karnaWishlist", JSON.stringify([...this.wishlist]));
  },
  saveTransactions() {
    localStorage.setItem("karnaTransactions", JSON.stringify(this.transactions));
  }
};

window.Karna = Karna;

document.addEventListener("DOMContentLoaded", () => {
  renderShell();
  renderPage();
  bindGlobalEvents();
  startProgress();
});

function renderShell() {
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelector("#siteHeader").className = "site-header";
  document.querySelector("#siteHeader").innerHTML = `
    <nav class="nav-wrap">
      <a class="brand" href="index.html" aria-label="Kembali ke Home">
        <img src="karna-logo.png" alt="">
        <span>KARNA SHOWROOM</span>
      </a>
      <div class="nav-menu" id="navMenu">
        <a href="index.html" class="${current === "index.html" || current === "" ? "active" : ""}">Home</a>
        <a href="mobil.html" class="${current === "mobil.html" ? "active" : ""}">Mobil</a>
        <a href="motor.html" class="${current === "motor.html" ? "active" : ""}">Motor</a>
        <a href="transaksi.html" class="${current === "transaksi.html" ? "active" : ""}">Transaksi</a>
        <a href="wishlist.html" class="${current === "wishlist.html" ? "active" : ""}">Wishlist</a>
      </div>
      <div class="search-box">
        <i class="fa-solid fa-bars"></i>
        <input id="globalSearch" type="search" placeholder="Search Motorcycle" autocomplete="off" aria-label="Cari kendaraan">
        <i class="fa-solid fa-magnifying-glass"></i>
        <div class="search-results" id="searchResults"></div>
      </div>
      <button class="hamburger" id="hamburger" type="button" aria-label="Menu"><i class="fa-solid fa-grip"></i></button>
    </nav>
  `;

  document.querySelector("#siteFooter").className = "site-footer";
  document.querySelector("#siteFooter").innerHTML = `
    <div class="footer-inner">
      <div class="help-center">
        <strong>HELP CENTER</strong>
        <div class="help-box">
          <a href="tel:+6281237073091"><i class="fa-solid fa-phone"></i> +62 812-3707-3091</a>
          <a href="mailto:Contact@karna.co.id"><i class="fa-solid fa-envelope"></i> Contact@karna.co.id</a>
        </div>
      </div>
      <div class="social-links">
        <a href="https://wa.me/6281237073091" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
        <a href="https://facebook.com/karna-showroom" target="_blank" rel="noopener" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
        <a href="https://instagram.com/karna.showroom" target="_blank" rel="noopener" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
        <a href="https://x.com/karna_showroom" target="_blank" rel="noopener" aria-label="X"><i class="fa-brands fa-x-twitter"></i></a>
        <a href="https://youtube.com/@karna-showroom" target="_blank" rel="noopener" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
        <a href="https://tiktok.com/@karna.showroom" target="_blank" rel="noopener" aria-label="TikTok"><i class="fa-brands fa-tiktok"></i></a>
      </div>
    </div>
    <div class="footer-copy">
      <strong>&copy;2026 Karna Showroom</strong>
      <span>All information applies to Indonesia vehicles only</span>
    </div>
  `;

  document.querySelector("#modalRoot").innerHTML = `
    <div class="modal fade" id="quickViewModal" tabindex="-1" aria-hidden="true"><div class="modal-dialog modal-dialog-centered modal-lg"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">Quick View</h5></div><div class="modal-body" id="quickViewBody"></div></div></div></div>
    <div class="modal fade" id="lightboxModal" tabindex="-1" aria-hidden="true"><div class="modal-dialog modal-dialog-centered modal-xl"><div class="modal-content lightbox-content"><div class="modal-body"><img class="lightbox-img" id="lightboxImage" src="" alt="Galeri kendaraan"></div></div></div></div>
    <div class="modal fade" id="successModal" tabindex="-1" aria-hidden="true"><div class="modal-dialog modal-dialog-centered"><div class="modal-content text-center p-4"><div class="display-3 text-success mb-3"><i class="fa-solid fa-circle-check"></i></div><h3>Terima kasih.</h3><p>Pesanan berhasil dikirim.</p><button class="btn-solid" data-bs-dismiss="modal">Selesai</button></div></div></div>
  `;
}

function renderPage() {
  if (Karna.page === "home") return renderHome();
  if (Karna.page === "catalog") return renderCatalog(Karna.category);
  if (Karna.page === "detail") return renderDetail();
  if (Karna.page === "transaksi") return renderTransaction();
  if (Karna.page === "wishlist") return renderWishlist();
  return renderNotFound();
}

function renderHome() {
  const featured = vehicles.filter((vehicle) => vehicle.featured).slice(0, 10);
  pageRoot().innerHTML = `
    <section class="page">
      ${sliderMarkup("homeSlider")}
      <div class="container-wide reveal">
        <div class="section-title"><h2>Produk Unggulan</h2></div>
        <div class="featured-row">${featured.map(miniCard).join("")}</div>
      </div>
      <section class="bmw-banner reveal fade-down"><span></span></section>
      <section class="shopping reveal zoom-in">
        <h2>Shopping Tools</h2>
        <div class="tool-box">
          <a class="tool-link" href="mobil.html"><i class="fa-solid fa-car-side"></i>MOBIL</a>
          <a class="tool-link" href="motor.html"><i class="fa-solid fa-motorcycle"></i>MOTOR</a>
        </div>
      </section>
      <section class="promo-wide reveal slide-left">
        <div>
          <h2>Temukan Kendaraan Impian Mu di KARNA</h2>
          <a class="btn-solid" href="mobil.html">Jelajahi Sekarang</a>
        </div>
      </section>
    </section>
  `;
}

function renderCatalog(category) {
  pageRoot().innerHTML = `
    <section class="page">
      <div class="container-wide breadcrumb-wrap"><a href="index.html">Home</a> / <strong>${label(category)}</strong></div>
      ${sliderMarkup("catalogSlider")}
      <div class="container-wide">
        <div class="explore-head reveal">
          <h1>Explore Vehicles</h1>
          <p>OTR Denpasar Price</p>
          <div class="tabs-line">
            <a href="mobil.html" class="${category === "mobil" ? "active" : ""}">MOBIL</a>
            <a href="motor.html" class="${category === "motor" ? "active" : ""}">MOTOR</a>
            <span class="tab-indicator ${category === "motor" ? "motor" : ""}"></span>
          </div>
        </div>
        ${filterPanel(category)}
        <div class="vehicle-grid" id="vehicleGrid"></div>
      </div>
    </section>
  `;
  if (window.renderFilteredVehicles) window.renderFilteredVehicles(category);
}

function renderDetail() {
  const vehicle = Karna.getVehicle(Karna.params.get("id"));
  if (!vehicle) return renderNotFound();
  pageRoot().innerHTML = `
    <section class="page">
      <div class="container-wide breadcrumb-wrap"><a href="index.html">Home</a> / <a href="${vehicle.category}.html">${label(vehicle.category)}</a> / <strong>${vehicle.name}</strong></div>
      <div class="container-wide detail-layout">
        <div class="detail-gallery reveal zoom-in">
          <button class="main-photo" type="button" data-lightbox="${vehicle.image}"><img id="mainPhoto" src="${vehicle.image}" alt="${vehicle.name}" loading="lazy"></button>
          <div class="thumb-row">${vehicle.gallery.map((image, i) => `<button class="thumb ${i === 0 ? "active" : ""}" data-thumb="${image}"><img src="${image}" alt="${vehicle.name} ${i + 1}"></button>`).join("")}</div>
        </div>
        <article class="detail-copy reveal">
          <small class="text-muted">${vehicle.brand} / ${vehicle.type} / ${vehicle.year}</small>
          <h1>${vehicle.name}</h1>
          <div class="price-lg" data-count="${vehicle.price}">${Karna.rupiah.format(0)}</div>
          <p class="detail-desc">${vehicle.description}</p>
          <div class="d-flex flex-wrap gap-2 my-4">
            <button class="btn-solid btn-gradient pulse" data-buy="${vehicle.id}"><i class="fa-solid fa-bag-shopping"></i> Beli Sekarang</button>
            <button class="btn-soft ${Karna.wishlist.has(vehicle.id) ? "active" : ""}" data-wishlist="${vehicle.id}"><i class="${Karna.wishlist.has(vehicle.id) ? "fa-solid" : "fa-regular"} fa-heart"></i> Wishlist</button>
          </div>
          <div class="spec-grid">
            ${specRows(vehicle).map(([k, v], i) => `<div class="spec-item stagger" style="animation-delay:${i * 55}ms"><small>${k}</small><strong>${v}</strong></div>`).join("")}
          </div>
          <h3>Keunggulan & Fitur</h3>
          <div class="feature-list">${vehicle.features.map(item => `<span>${item}</span>`).join("")}</div>
          <div class="credit-box">
            <h3>Promo & Simulasi Kredit</h3>
            <div class="credit-row"><span>Promo</span><strong>${vehicle.promo}</strong></div>
            <div class="credit-row"><span>DP</span><strong>${Karna.rupiah.format(vehicle.dp)}</strong></div>
            <div class="credit-row"><span>Estimasi Cicilan</span><strong data-count="${vehicle.installment}">${Karna.rupiah.format(0)}</strong></div>
          </div>
        </article>
      </div>
    </section>
  `;
  countUp();
}

function renderTransaction() {
  const selectedId = Number(Karna.params.get("id") || Karna.selectedVehicle || 0);
  const selected = Karna.getVehicle(selectedId);
  pageRoot().innerHTML = `
    <section class="page transaction-page">
      <div class="container-wide">
        <div class="transaction-head reveal fade-down">
          <h1>Pesan Sekarang<br>Kendaraan Favoritmu Disini</h1>
          <p>Nikmati Kemudahan dan Berbagai Penawaran Spesial dari KARNA</p>
        </div>
        <div class="transaction-layout">
          <div class="mechanic-art reveal slide-right"><img src="mekanik.png" alt="Mekanik KARNA"></div>
          <form class="form-grid reveal slide-left" id="transactionForm" novalidate>
            ${field("nama", "Nama", "text")}
            ${field("email", "Alamat Email", "email")}
            ${field("hp", "No. Handphone", "tel")}
            ${field("alamat", "Alamat Rumah", "text", false)}
            ${field("kota", "Kota", "text", false)}
            <div class="field full">
              <select name="kendaraan" id="kendaraan" required>
                <option value="">Pilih Kendaraan</option>
                ${vehicles.map(v => `<option value="${v.name}" ${selected && selected.name === v.name ? "selected" : ""}>${v.name}</option>`).join("")}
              </select>
              <small class="field-error"></small>
            </div>
            <div class="field full">
              <select name="metode" id="metode" required>
                <option value="">Metode Pembayaran</option>
                <option>Cash</option>
                <option>Kredit</option>
                <option>Transfer Bank</option>
                <option>Leasing Partner</option>
              </select>
              <small class="field-error"></small>
            </div>
            <div class="field full">
              <textarea name="catatan" id="catatan" placeholder="Catatan Tambahan"></textarea>
              <small class="field-error"></small>
            </div>
            <div class="submit-field"><button class="btn-solid" type="submit">SUBMIT</button></div>
          </form>
        </div>
      </div>
    </section>
  `;
}

function renderWishlist() {
  const list = vehicles.filter(v => Karna.wishlist.has(v.id));
  pageRoot().innerHTML = `
    <section class="page">
      <div class="container-wide breadcrumb-wrap"><a href="index.html">Home</a> / <strong>Wishlist</strong></div>
      <div class="container-wide">
        <div class="section-title"><h2>Wishlist Kendaraan</h2><p>Semua kendaraan favorit tersimpan di LocalStorage.</p></div>
        <div class="vehicle-grid">${list.length ? list.map((v, i) => vehicleCard(v, i)).join("") : empty("Belum ada kendaraan favorit.")}</div>
      </div>
    </section>
  `;
}

function renderNotFound() {
  pageRoot().innerHTML = `<section class="notfound"><div><h1>404</h1><p>Halaman yang Anda buka tidak tersedia.</p><a class="btn-solid" href="index.html">Kembali ke Home</a></div></section>`;
}

function sliderMarkup(id) {
  return `
    <div class="container-wide reveal fade-down">
      <section class="hero-slider" id="${id}">
        <div class="slider-window"><div class="slider-track">
          ${promoBanners.map((b, i) => `<article class="slide ${i === 0 ? "active" : ""}"><img src="${b.image}" alt="${b.alt}" loading="${i === 0 ? "eager" : "lazy"}"></article>`).join("")}
        </div></div>
        <button class="slider-btn slider-prev" type="button"><i class="fa-solid fa-chevron-left"></i></button>
        <button class="slider-btn slider-next" type="button"><i class="fa-solid fa-chevron-right"></i></button>
        <div class="slider-dots">${promoBanners.map((_, i) => `<button class="slider-dot ${i === 0 ? "active" : ""}" data-slide="${i}"></button>`).join("")}</div>
      </section>
    </div>`;
}

function miniCard(vehicle) {
  return `
    <article class="mini-card shine tilt">
      ${floatingActions(vehicle)}
      <a href="detail.html?id=${vehicle.id}"><img src="${vehicle.image}" alt="${vehicle.name}" loading="lazy"></a>
      <div><h3>${vehicle.name}</h3><div class="price">${Karna.rupiah.format(vehicle.price)}</div><a class="btn-detail" href="detail.html?id=${vehicle.id}">Lihat Detail</a></div>
    </article>`;
}

function vehicleCard(vehicle, index = 0) {
  return `
    <article class="vehicle-card shine tilt stagger" style="animation-delay:${index * 45}ms">
      ${floatingActions(vehicle)}
      <div>
        <h3>${vehicle.name}</h3>
        <div class="meta">Starting from <strong>${Karna.rupiah.format(vehicle.price)}</strong></div>
        <div class="btn-row">
          <button class="btn-buy" data-buy="${vehicle.id}">Beli Sekarang</button>
          <a class="btn-soft" href="detail.html?id=${vehicle.id}" title="Detail"><i class="fa-solid fa-circle-info"></i></a>
        </div>
      </div>
      <a class="vehicle-img" href="detail.html?id=${vehicle.id}"><img src="${vehicle.image}" alt="${vehicle.name}" loading="lazy"></a>
    </article>`;
}

function floatingActions(vehicle) {
  const loved = Karna.wishlist.has(vehicle.id);
  return `
    <div class="card-actions-floating">
      <button class="circle-btn ${loved ? "active" : ""}" data-wishlist="${vehicle.id}" title="Wishlist"><i class="${loved ? "fa-solid" : "fa-regular"} fa-heart"></i></button>
      <button class="circle-btn" data-quick="${vehicle.id}" title="Quick View"><i class="fa-regular fa-eye"></i></button>
    </div>`;
}

function filterPanel(category) {
  const brands = [...new Set(Karna.byCategory(category).map(v => v.brand))].sort();
  const types = [...new Set(Karna.byCategory(category).map(v => v.type))].sort();
  return `
    <div class="filter-panel reveal" id="filterPanel" data-category="${category}">
      <div class="filter-field"><label>Cari</label><input id="filterText" type="search" placeholder="Nama, merek, tahun"></div>
      <div class="filter-field"><label>Merek</label><select id="filterBrand"><option value="">Semua</option>${brands.map(b => `<option>${b}</option>`).join("")}</select></div>
      <div class="filter-field"><label>Harga</label><select id="filterPrice"><option value="">Semua</option><option value="0-50000000">&lt; Rp50 juta</option><option value="50000000-500000000">Rp50-500 juta</option><option value="500000000-2000000000">Rp500 juta-2 M</option><option value="2000000000-99999999999">&gt; Rp2 M</option></select></div>
      <div class="filter-field"><label>Tahun</label><select id="filterYear"><option value="">Semua</option><option>2026</option><option>2025</option></select></div>
      <div class="filter-field"><label>Jenis</label><select id="filterType"><option value="">Semua</option>${types.map(t => `<option>${t}</option>`).join("")}</select></div>
      <div class="filter-field"><label>Sorting</label><select id="filterSort"><option value="newest">Terbaru</option><option value="low">Termurah</option><option value="high">Termahal</option><option value="az">Nama A-Z</option></select></div>
    </div>`;
}

function specRows(v) {
  return [
    ["Mesin", v.engine],
    ["Tenaga", v.power],
    ["Torsi", v.torque],
    ["Transmisi", v.transmission],
    ["Warna", v.color],
    ["Kapasitas", v.capacity],
    ["Tahun", v.year],
    ["Bahan Bakar", v.fuel]
  ];
}

function field(name, placeholder, type, full = true) {
  return `<div class="field ${full ? "full" : ""}"><input name="${name}" id="${name}" type="${type}" placeholder="${placeholder}"><small class="field-error"></small></div>`;
}

function empty(message) {
  return `<div class="empty-state"><div><i class="fa-regular fa-face-smile mb-3 fs-1"></i><p>${message}</p></div></div>`;
}

function pageRoot() {
  return document.querySelector("#pageRoot");
}

function label(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast-msg ${type}`;
  const icon = type === "success" ? "fa-circle-check" : type === "error" ? "fa-triangle-exclamation" : "fa-circle-info";
  toast.innerHTML = `<i class="fa-solid ${icon}"></i><strong>${message}</strong>`;
  document.querySelector("#toastRoot").appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(24px)";
    setTimeout(() => toast.remove(), 260);
  }, 3200);
}
window.showToast = showToast;

function bindGlobalEvents() {
  window.addEventListener("scroll", () => {
    const header = document.querySelector("#siteHeader");
    if (header) header.classList.toggle("scrolled", scrollY > 20);
    const scrollTopBtn = document.querySelector("#scrollTop");
    if (scrollTopBtn) scrollTopBtn.classList.toggle("show", scrollY > 520);
  });

  const scrollTopBtn = document.querySelector("#scrollTop");
  if (scrollTopBtn) scrollTopBtn.addEventListener("click", () => scrollTo({
    top: 0,
    behavior: "smooth"
  }));
  const hamburgerBtn = document.querySelector("#hamburger");
  if (hamburgerBtn) hamburgerBtn.addEventListener("click", () => document.querySelector("#navMenu").classList.toggle("open"));

  document.addEventListener("click", (event) => {
    const buy = event.target.closest("[data-buy]");
    if (buy) {
      Karna.selectedVehicle = buy.dataset.buy;
      localStorage.setItem("karnaSelectedVehicle", Karna.selectedVehicle);
      const vehicle = Karna.getVehicle(Karna.selectedVehicle);
      showToast(`${vehicle.name} dipilih untuk transaksi.`, "success");
      location.href = `transaksi.html?id=${vehicle.id}`;
    }
    const lightbox = event.target.closest("[data-lightbox]");
    if (lightbox) {
      document.querySelector("#lightboxImage").src = lightbox.dataset.lightbox;
      bootstrap.Modal.getOrCreateInstance(document.querySelector("#lightboxModal")).show();
    }
    createRipple(event);
  });
}

function countUp() {
  document.querySelectorAll("[data-count]").forEach(el => {
    const target = Number(el.dataset.count);
    const start = performance.now();
    const run = now => {
      const p = Math.min((now - start) / 950, 1);
      el.textContent = Karna.rupiah.format(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  });
}
window.countUp = countUp;

function startProgress() {
  const bar = document.querySelector("#progressBar");
  bar.style.width = "100%";
  setTimeout(() => {
    bar.style.opacity = "0";
  }, 500);
}

function createRipple(event) {
  const target = event.target.closest("button, .btn-detail, .btn-buy, .btn-solid, .btn-soft, .tool-link, .nav-menu a");
  if (!target) return;
  const rect = target.getBoundingClientRect();
  const ripple = document.createElement("span");
  const size = Math.max(rect.width, rect.height);
  ripple.className = "ripple";
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
  target.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove());
}
