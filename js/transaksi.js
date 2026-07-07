document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#transactionForm");
  if (!form) return;
  form.querySelectorAll("input, select, textarea").forEach(input => {
    input.addEventListener("input", () => validateInput(input));
    input.addEventListener("change", () => validateInput(input));
  });
  form.addEventListener("submit", event => {
    event.preventDefault();
    const inputs = [...form.querySelectorAll("input, select, textarea")];
    const ok = inputs.every(validateInput);
    if (!ok) {
      if (window.showToast) window.showToast("Mohon periksa kembali form transaksi.", "error");
      return;
    }
    const data = Object.fromEntries(new FormData(form).entries());
    data.id = Date.now();
    data.tanggal = new Date().toLocaleDateString("id-ID");
    data.jam = new Date().toLocaleTimeString("id-ID");
    data.status = "Menunggu Konfirmasi";
    Karna.transactions.push(data);
    Karna.saveTransactions();
    localStorage.removeItem("karnaSelectedVehicle");
    if (window.showToast) window.showToast("Berhasil submit transaksi.", "success");
    bootstrap.Modal.getOrCreateInstance(document.querySelector("#successModal")).show();
    launchConfetti();
    form.reset();
  });
});

function validateInput(input) {
  const field = input.closest(".field");
  const error = field ? field.querySelector(".field-error") : null;
  let message = "";
  const value = input.value.trim();
  if (!value) message = "Field ini wajib diisi.";
  if (!message && input.name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) message = "Email tidak valid.";
  if (!message && input.name === "hp" && !/^[0-9]{8,16}$/.test(value)) message = "Nomor HP hanya angka, 8-16 digit.";
  if (field) field.classList.toggle("invalid", Boolean(message));
  if (field) field.classList.toggle("valid", !message && Boolean(value));
  if (error) error.textContent = message;
  return !message;
}

function launchConfetti() {
  const colors = ["#ff1515", "#125dff", "#111", "#16a34a", "#fff"];
  for (let i = 0; i < 34; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[i % colors.length];
    piece.style.animationDelay = `${Math.random() * 220}ms`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 1300);
  }
}
