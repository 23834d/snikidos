const STORAGE_KEY = "snikidos_registrations";

const form = document.getElementById("registrationForm");
const message = document.getElementById("formMessage");
const tableBody = document.getElementById("registrationTable");
const downloadButton = document.getElementById("downloadCsv");

function readRegistrations() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveRegistrations(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function renderRows() {
  const rows = readRegistrations();
  tableBody.innerHTML = "";

  rows.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.name}</td>
      <td>${row.phone}</td>
      <td>${row.email || "-"}</td>
      <td>${row.city}</td>
      <td>${row.time}</td>
    `;
    tableBody.appendChild(tr);
  });
}

function toCsv(rows) {
  const header = ["Name", "Phone", "Email", "City", "Time"];
  const lines = rows.map((row) => [row.name, row.phone, row.email, row.city, row.time]);
  return [header, ...lines]
    .map((line) => line.map((cell) => `"${String(cell || "").replaceAll('"', '""')}"`).join(","))
    .join("\n");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);

  const record = {
    name: data.get("name")?.toString().trim(),
    phone: data.get("phone")?.toString().trim(),
    email: data.get("email")?.toString().trim(),
    city: data.get("city")?.toString().trim(),
    time: new Date().toLocaleString(),
  };

  if (!record.name || !record.phone || !record.city) {
    message.textContent = "Please fill all required fields.";
    return;
  }

  const rows = readRegistrations();
  rows.unshift(record);
  saveRegistrations(rows);
  renderRows();
  form.reset();
  message.textContent = "Saved! Now complete payment using Razorpay.";
});

downloadButton.addEventListener("click", () => {
  const rows = readRegistrations();
  if (!rows.length) {
    message.textContent = "No registrations found to export yet.";
    return;
  }

  const csv = toCsv(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "snikidos-registrations.csv";
  anchor.click();
  URL.revokeObjectURL(url);
});

document.getElementById("year").textContent = new Date().getFullYear();
renderRows();
