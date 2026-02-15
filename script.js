const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.main-nav');
menuBtn?.addEventListener('click', () => nav.classList.toggle('open'));

const tiltCard = document.getElementById('tilt-card');
if (tiltCard) {
  tiltCard.addEventListener('mousemove', (e) => {
    const rect = tiltCard.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    tiltCard.style.transform = `rotateY(${x * 12}deg) rotateX(${y * -12}deg)`;
  });
  tiltCard.addEventListener('mouseleave', () => {
    tiltCard.style.transform = 'rotateY(0deg) rotateX(0deg)';
  });
}

const form = document.getElementById('reg-form');
const tableBody = document.getElementById('reg-table-body');
const KEY = 'snikidos_registrations';

function getRows() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
}

function setRows(rows) {
  localStorage.setItem(KEY, JSON.stringify(rows));
}

function renderRows() {
  const rows = getRows();
  tableBody.innerHTML = rows.length
    ? rows.map(row => `<tr><td>${row.name}</td><td>${row.phone}</td><td>${row.email || '-'}</td><td>${row.city || '-'}</td><td>${row.time}</td></tr>`).join('')
    : '<tr><td colspan="5">No registrations yet.</td></tr>';
}

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());

  const rows = getRows();
  rows.unshift({
    ...data,
    time: new Date().toLocaleString('en-IN')
  });

  setRows(rows);
  renderRows();
  form.reset();
  alert('Registration saved. Now complete payment below.');
});

function downloadCsv() {
  const rows = getRows();
  if (!rows.length) return alert('No data to export.');
  const header = ['Name', 'Phone', 'Email', 'City', 'Time'];
  const lines = rows.map(r => [r.name, r.phone, r.email || '', r.city || '', r.time]
    .map(v => `"${String(v).replaceAll('"', '""')}"`).join(','));

  const csv = [header.join(','), ...lines].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `snikidos-registrations-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

document.getElementById('download')?.addEventListener('click', downloadCsv);
document.getElementById('clear')?.addEventListener('click', () => {
  if (confirm('Delete all registration data from this browser?')) {
    localStorage.removeItem(KEY);
    renderRows();
  }
});

document.getElementById('year').textContent = new Date().getFullYear();
renderRows();
