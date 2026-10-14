// E-Governance Service Dashboard - script.js
// Step 1: load data (CSV file -> fallback to embedded copy -> or user uploaded CSV)
// Step 2: apply filters  Step 3: calculate KPIs  Step 4: update charts and table

const CSV_PATH = "../data/cleaned_e_governance_data.csv";
const REQUIRED = ["Application_ID","Citizen_Name","District","Service_Type","Application_Channel","Application_Date","Status","Processing_Days","Service_Fee","Satisfaction_Rating"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

let allData = [];
let filtered = [];
let charts = {};

// ---------- CSV reading ----------
function parseCSV(text) {
  const rows = [];
  let row = [], cell = "", inQuotes = false;
  text = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') inQuotes = false;
      else cell += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ",") { row.push(cell); cell = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); cell = "";
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
    } else cell += ch;
  }
  if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

function csvToRecords(text) {
  const rows = parseCSV(text);
  const header = rows[0].map(h => h.trim());
  const missing = REQUIRED.filter(c => !header.includes(c));
  if (missing.length) throw new Error("Missing columns: " + missing.join(", "));
  return rows.slice(1).map(r => {
    const o = {};
    header.forEach((h, i) => o[h] = (r[i] || "").trim());
    o.Processing_Days = Number(o.Processing_Days);
    o.Service_Fee = Number(o.Service_Fee);
    o.Satisfaction_Rating = Number(o.Satisfaction_Rating);
    o.Month = o.Application_Date.slice(0, 7);
    return o;
  });
}

// ---------- Helpers ----------
function countBy(data, field) {
  const c = {};
  data.forEach(d => c[d[field]] = (c[d[field]] || 0) + 1);
  return c;
}
function avgBy(data, groupField, valueField) {
  const sum = {}, n = {};
  data.forEach(d => {
    sum[d[groupField]] = (sum[d[groupField]] || 0) + d[valueField];
    n[d[groupField]] = (n[d[groupField]] || 0) + 1;
  });
  const avg = {};
  Object.keys(sum).forEach(k => avg[k] = sum[k] / n[k]);
  return avg;
}
function sortedEntries(obj, desc) {
  return Object.entries(obj).sort((a, b) => desc ? b[1] - a[1] : a[0].localeCompare(b[0]));
}
function monthLabel(m) { return MONTHS[Number(m.slice(5, 7)) - 1] + " " + m.slice(0, 4); }

// ---------- Filters ----------
function fillSelect(id, field, label) {
  const sel = document.getElementById(id);
  const values = [...new Set(allData.map(d => d[field]))].sort();
  sel.innerHTML = '<option value="All">All ' + label + '</option>' +
    values.map(v => '<option value="' + v + '">' + v + '</option>').join("");
}
function setupFilters() {
  fillSelect("fDistrict", "District", "Districts");
  fillSelect("fService", "Service_Type", "Services");
  fillSelect("fChannel", "Application_Channel", "Channels");
  fillSelect("fStatus", "Status", "Statuses");
}
function applyFilters() {
  const f = {
    District: document.getElementById("fDistrict").value,
    Service_Type: document.getElementById("fService").value,
    Application_Channel: document.getElementById("fChannel").value,
    Status: document.getElementById("fStatus").value
  };
  filtered = allData.filter(d => Object.keys(f).every(k => f[k] === "All" || d[k] === f[k]));
  updateDashboard();
}
function resetFilters() {
  ["fDistrict", "fService", "fChannel", "fStatus"].forEach(id => document.getElementById(id).value = "All");
  applyFilters();
}

// ---------- KPIs ----------
function calcKPIs(data) {
  const total = data.length;
  const approved = data.filter(d => d.Status === "Approved").length;
  const rejected = data.filter(d => d.Status === "Rejected").length;
  const pending = data.filter(d => d.Status === "Pending").length;
  const sumDays = data.reduce((s, d) => s + d.Processing_Days, 0);
  const sumSat = data.reduce((s, d) => s + d.Satisfaction_Rating, 0);
  return {
    total, approved, rejected, pending,
    rate: total ? approved / total * 100 : 0,
    avgDays: total ? sumDays / total : 0,
    avgSat: total ? sumSat / total : 0
  };
}
function showKPIs(k) {
  document.getElementById("kpiTotal").textContent = k.total;
  document.getElementById("kpiApproved").textContent = k.approved;
  document.getElementById("kpiRejected").textContent = k.rejected;
  document.getElementById("kpiPending").textContent = k.pending;
  document.getElementById("kpiRate").textContent = k.rate.toFixed(1) + "%";
  document.getElementById("kpiDays").textContent = k.avgDays.toFixed(1);
  document.getElementById("kpiSat").textContent = k.avgSat.toFixed(2);
}

// ---------- Charts ----------
const BLUE = "#2f6ea5";
const PALETTE = ["#2f6ea5", "#e08a1e", "#3a9d6b", "#8e6bbf", "#c0504d", "#4bacc6", "#9aa5b1", "#d4b106"];
const STATUS_COLORS = { Approved: "#2e8b57", Rejected: "#c0392b", Pending: "#e0a100" };

function makeChart(id, type, title, xTitle, yTitle) {
  const isPie = type === "doughnut";
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: true, text: title, font: { size: 15 } },
      legend: { display: isPie || type === "line", position: isPie ? "right" : "top" }
    }
  };
  if (!isPie) {
    options.scales = {
      x: { title: { display: true, text: xTitle } },
      y: { beginAtZero: true, title: { display: true, text: yTitle } }
    };
  }
  return new Chart(document.getElementById(id), { type, data: { labels: [], datasets: [] }, options });
}
function createCharts() {
  charts.district = makeChart("cDistrict", "bar", "Applications by District", "District", "Number of Applications");
  charts.status = makeChart("cStatus", "doughnut", "Application Status");
  charts.month = makeChart("cMonth", "line", "Monthly Applications Trend", "Month", "Number of Applications");
  charts.service = makeChart("cService", "bar", "Applications by Service Type", "Service Type", "Number of Applications");
  charts.days = makeChart("cDays", "bar", "Average Processing Days by Service", "Service Type", "Average Days");
  charts.channel = makeChart("cChannel", "doughnut", "Applications by Application Channel");
  charts.sat = makeChart("cSat", "bar", "Average Satisfaction by District", "District", "Average Rating (out of 5)");
  charts.sat.options.scales.y.max = 5;
}
function setChart(chart, labels, values, label, colors) {
  chart.data.labels = labels;
  chart.data.datasets = [{ label: label, data: values, backgroundColor: colors, borderColor: colors, borderWidth: 1 }];
  chart.update();
}
function updateCharts(data) {
  const byDistrict = sortedEntries(countBy(data, "District"), true);
  setChart(charts.district, byDistrict.map(e => e[0]), byDistrict.map(e => e[1]), "Applications", BLUE);

  const st = countBy(data, "Status");
  const stLabels = ["Approved", "Rejected", "Pending"].filter(s => st[s]);
  setChart(charts.status, stLabels, stLabels.map(s => st[s]), "Applications", stLabels.map(s => STATUS_COLORS[s]));

  const mon = countBy(data, "Month");
  const monKeys = Object.keys(mon).sort();
  const lc = charts.month;
  lc.data.labels = monKeys.map(monthLabel);
  lc.data.datasets = [{ label: "Applications", data: monKeys.map(m => mon[m]), borderColor: BLUE, backgroundColor: "rgba(47,110,165,0.15)", fill: true, tension: 0.2, pointRadius: 4 }];
  lc.update();

  const bySvc = sortedEntries(countBy(data, "Service_Type"), true);
  setChart(charts.service, bySvc.map(e => e[0]), bySvc.map(e => e[1]), "Applications", "#3a9d6b");

  const days = sortedEntries(avgBy(data, "Service_Type", "Processing_Days"), true);
  setChart(charts.days, days.map(e => e[0]), days.map(e => +e[1].toFixed(1)), "Avg Processing Days", "#e08a1e");

  const ch = sortedEntries(countBy(data, "Application_Channel"), true);
  setChart(charts.channel, ch.map(e => e[0]), ch.map(e => e[1]), "Applications", PALETTE);

  const sat = sortedEntries(avgBy(data, "District", "Satisfaction_Rating"), true);
  setChart(charts.sat, sat.map(e => e[0]), sat.map(e => +e[1].toFixed(2)), "Avg Satisfaction", "#8e6bbf");
}

// ---------- Table ----------
function updateTable(data) {
  const body = document.querySelector("#dataTable tbody");
  body.innerHTML = data.map(d =>
    "<tr><td>" + d.Application_ID + "</td><td>" + d.Citizen_Name + "</td><td>" + d.District + "</td><td>" +
    d.Service_Type + "</td><td>" + d.Application_Channel + "</td><td>" + d.Application_Date + "</td><td>" +
    d.Status + "</td><td>" + d.Processing_Days + "</td><td>" + d.Service_Fee + "</td><td>" + d.Satisfaction_Rating + "</td></tr>"
  ).join("");
}

function updateDashboard() {
  showKPIs(calcKPIs(filtered));
  updateCharts(filtered);
  updateTable(filtered);
  document.getElementById("info").textContent =
    "Showing " + filtered.length + " of " + allData.length + " records. " + (window.dataSource || "");
}

// ---------- Loading ----------
function useData(records, source) {
  allData = records;
  window.dataSource = "Data source: " + source;
  setupFilters();
  applyFilters();
}
function loadDefault() {
  fetch(CSV_PATH)
    .then(r => { if (!r.ok) throw new Error("not found"); return r.text(); })
    .then(t => useData(csvToRecords(t), "cleaned_e_governance_data.csv"))
    .catch(() => useData(csvToRecords(EMBEDDED_CSV), "built-in copy of cleaned_e_governance_data.csv"));
}
function onCsvChosen(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try { useData(csvToRecords(reader.result), file.name); }
    catch (err) { alert("Could not load this CSV. " + err.message); }
  };
  reader.readAsText(file);
}

if (typeof document !== "undefined") {
  createCharts();
  ["fDistrict", "fService", "fChannel", "fStatus"].forEach(id => document.getElementById(id).addEventListener("change", applyFilters));
  document.getElementById("resetBtn").addEventListener("click", resetFilters);
  document.getElementById("csvFile").addEventListener("change", onCsvChosen);
  loadDefault();
}

// Built-in copy of the cleaned dataset (used when the browser blocks reading the CSV from file://)
const EMBEDDED_CSV = `Application_ID,Citizen_Name,District,Service_Type,Application_Channel,Application_Date,Status,Processing_Days,Service_Fee,Satisfaction_Rating
EG2026-001,Santosh Salunkhe,Pune,Birth Certificate,Online,2026-01-01,Approved,3,50,5
EG2026-002,Jyoti Shinde,Sangli,Scholarship Application,Online,2026-01-03,Approved,10,0,5
EG2026-003,Ajay Bhosale,Pune,Residence Certificate,Online,2026-01-04,Rejected,3,30,4
EG2026-004,Sachin Bhosale,Kolhapur,Scholarship Application,CSC Center,2026-01-07,Approved,15,0,3
EG2026-005,Suresh Sawant,Kolhapur,Income Certificate,Government Office,2026-01-18,Rejected,6,40,2
EG2026-006,Omkar Chavan,Sangli,Birth Certificate,Online,2026-02-01,Approved,5,40,4
EG2026-007,Yogesh Mohite,Satara,Birth Certificate,Online,2026-02-02,Approved,3,45,4
EG2026-008,Sachin Kamble,Kolhapur,Property Tax,Online,2026-02-02,Approved,2,3000,4
EG2026-009,Suresh Kale,Satara,Residence Certificate,Online,2026-02-02,Approved,6,35,5
EG2026-010,Kavita Kamble,Satara,Residence Certificate,Government Office,2026-02-08,Approved,6,35,5
EG2026-011,Meena Desai,Kolhapur,Income Certificate,CSC Center,2026-02-09,Approved,5,30,5
EG2026-012,Santosh More,Sangli,Income Certificate,Online,2026-02-09,Approved,6,35,4
EG2026-013,Sneha Mane,Pune,Residence Certificate,Government Office,2026-02-12,Approved,6,35,3
EG2026-014,Prashant Kulkarni,Solapur,Income Certificate,Online,2026-02-13,Approved,5,30,5
EG2026-015,Kiran Sawant,Pune,Income Certificate,CSC Center,2026-02-17,Approved,4,35,3
EG2026-016,Pallavi Desai,Sangli,Property Tax,CSC Center,2026-02-17,Approved,4,600,3
EG2026-017,Rohan Mohite,Sangli,Scholarship Application,Government Office,2026-02-22,Approved,11,0,4
EG2026-018,Rohan Salunkhe,Solapur,Property Tax,Online,2026-02-23,Approved,4,1500,5
EG2026-019,Swati Thorat,Sangli,Income Certificate,CSC Center,2026-02-24,Approved,6,35,5
EG2026-020,Ajay Gaikwad,Satara,Caste Certificate,CSC Center,2026-02-26,Approved,10,30,4
EG2026-021,Madhuri Kale,Solapur,Senior Citizen Certificate,CSC Center,2026-02-26,Approved,6,25,4
EG2026-022,Priya Yadav,Satara,Scholarship Application,CSC Center,2026-02-27,Approved,7,0,4
EG2026-023,Pooja Sawant,Kolhapur,Residence Certificate,CSC Center,2026-03-01,Approved,5,30,5
EG2026-024,Prashant Mane,Sangli,Birth Certificate,Online,2026-03-04,Approved,5,50,5
EG2026-025,Mahesh Sawant,Sangli,Residence Certificate,Government Office,2026-03-09,Approved,9,30,3
EG2026-026,Yogesh Jadhav,Kolhapur,Property Tax,Online,2026-03-10,Rejected,4,40,1
EG2026-027,Suresh Patil,Kolhapur,Property Tax,Online,2026-03-11,Approved,3,2200,3
EG2026-028,Pallavi Thorat,Pune,Scholarship Application,Government Office,2026-03-13,Approved,10,0,5
EG2026-029,Rekha Chavan,Kolhapur,Income Certificate,Government Office,2026-03-19,Approved,11,30,3
EG2026-030,Rekha Kamble,Sangli,Income Certificate,CSC Center,2026-03-21,Approved,7,30,3
EG2026-031,Yogesh Desai,Kolhapur,Residence Certificate,CSC Center,2026-03-24,Pending,4,25,3
EG2026-032,Rekha Kale,Pune,Water Connection,Government Office,2026-03-24,Approved,15,2000,5
EG2026-033,Shital Salunkhe,Pune,Caste Certificate,Online,2026-03-25,Approved,9,30,4
EG2026-034,Vijay Joshi,Sangli,Birth Certificate,Online,2026-03-26,Approved,3,30,4
EG2026-035,Dattatray Gaikwad,Solapur,Birth Certificate,Online,2026-04-05,Approved,3,35,5
EG2026-036,Sunita Pawar,Satara,Income Certificate,Government Office,2026-04-11,Approved,11,35,3
EG2026-037,Kiran Mane,Solapur,Birth Certificate,CSC Center,2026-04-11,Approved,6,45,3
EG2026-038,Kiran Chavan,Solapur,Scholarship Application,CSC Center,2026-04-12,Approved,9,0,3
EG2026-039,Vaishali Gaikwad,Pune,Water Connection,Government Office,2026-04-14,Approved,9,2000,4
EG2026-040,Ajay Salunkhe,Sangli,Property Tax,Government Office,2026-04-21,Pending,6,1200,3
EG2026-041,Madhuri Joshi,Pune,Property Tax,Online,2026-04-24,Approved,6,600,5
EG2026-042,Shital Chavan,Pune,Property Tax,Online,2026-05-02,Approved,2,1200,4
EG2026-043,Santosh Sawant,Sangli,Residence Certificate,Online,2026-05-06,Pending,5,35,3
EG2026-044,Pravin Mohite,Pune,Water Connection,Online,2026-05-10,Approved,12,1000,5
EG2026-045,Yogesh Kamble,Pune,Residence Certificate,Government Office,2026-05-15,Approved,8,30,4
EG2026-046,Rekha Patil,Sangli,Property Tax,CSC Center,2026-05-17,Approved,4,1500,4
EG2026-047,Meena Yadav,Pune,Water Connection,Online,2026-05-17,Approved,19,1000,2
EG2026-048,Pallavi Mane,Pune,Scholarship Application,CSC Center,2026-05-18,Rejected,14,0,1
EG2026-049,Santosh Joshi,Pune,Property Tax,Online,2026-05-19,Rejected,2,1200,3
EG2026-050,Rekha Sawant,Sangli,Caste Certificate,Online,2026-05-19,Approved,7,40,4
EG2026-051,Archana Salunkhe,Pune,Residence Certificate,Online,2026-05-24,Approved,4,25,5
EG2026-052,Anita Bhosale,Pune,Residence Certificate,Government Office,2026-05-26,Approved,5,30,4
EG2026-053,Tushar Mohite,Kolhapur,Property Tax,Government Office,2026-05-27,Approved,6,2200,4
EG2026-054,Santosh Mohite,Kolhapur,Income Certificate,Online,2026-06-01,Approved,5,35,5
EG2026-055,Sneha Kulkarni,Satara,Scholarship Application,Online,2026-06-07,Approved,12,0,4
EG2026-056,Rohan Joshi,Sangli,Scholarship Application,CSC Center,2026-06-07,Approved,12,0,4
EG2026-057,Prashant Mohite,Pune,Caste Certificate,Government Office,2026-06-15,Pending,9,30,3
EG2026-058,Vijay Thorat,Solapur,Senior Citizen Certificate,Government Office,2026-06-18,Approved,8,25,5
EG2026-059,Ganesh Yadav,Sangli,Birth Certificate,CSC Center,2026-06-21,Approved,6,45,4
EG2026-060,Dattatray Salunkhe,Solapur,Birth Certificate,CSC Center,2026-06-26,Approved,6,30,3
EG2026-061,Pallavi Kamble,Kolhapur,Senior Citizen Certificate,Government Office,2026-07-01,Rejected,4,20,2
EG2026-062,Priya Kamble,Sangli,Residence Certificate,Online,2026-07-03,Approved,6,30,5
EG2026-063,Pooja Gaikwad,Sangli,Property Tax,Online,2026-07-03,Approved,12,0,5
EG2026-064,Jyoti Kamble,Pune,Property Tax,Online,2026-07-04,Approved,2,1500,4
EG2026-065,Kavita Yadav,Sangli,Residence Certificate,Online,2026-07-12,Approved,4,35,4
EG2026-066,Rohan Kulkarni,Satara,Property Tax,Government Office,2026-07-13,Approved,7,850,3
EG2026-067,Yogesh Thorat,Sangli,Residence Certificate,Government Office,2026-07-15,Approved,10,30,4
EG2026-068,Sachin More,Kolhapur,Property Tax,Online,2026-07-16,Approved,3,600,3
EG2026-069,Manisha Desai,Solapur,Scholarship Application,CSC Center,2026-07-20,Pending,16,0,2
EG2026-070,Rahul Gaikwad,Kolhapur,Scholarship Application,Online,2026-07-26,Approved,15,0,5
EG2026-071,Vaishali Deshmukh,Kolhapur,Residence Certificate,CSC Center,2026-07-26,Approved,6,30,5
EG2026-072,Rahul More,Kolhapur,Senior Citizen Certificate,CSC Center,2026-07-28,Pending,8,25,2
EG2026-073,Archana Chavan,Satara,Caste Certificate,Government Office,2026-08-01,Pending,12,35,3
EG2026-074,Suresh Salunkhe,Solapur,Caste Certificate,Online,2026-08-05,Pending,8,40,4
EG2026-075,Meena Deshmukh,Solapur,Income Certificate,Government Office,2026-08-08,Approved,8,35,3
EG2026-076,Anita Desai,Sangli,Income Certificate,Online,2026-08-10,Approved,6,40,4
EG2026-077,Sneha Gaikwad,Sangli,Property Tax,CSC Center,2026-08-12,Pending,4,1500,3
EG2026-078,Ganesh Pawar,Sangli,Property Tax,Online,2026-08-14,Pending,6,3000,4
EG2026-079,Dattatray Kale,Pune,Caste Certificate,CSC Center,2026-08-14,Pending,5,30,3
EG2026-080,Omkar Sawant,Pune,Caste Certificate,Government Office,2026-08-15,Approved,12,30,5
EG2026-081,Shital Sawant,Satara,Caste Certificate,Online,2026-08-15,Pending,9,40,4
EG2026-082,Meena Sawant,Sangli,Property Tax,Online,2026-08-16,Pending,4,3000,3
EG2026-083,Madhuri More,Satara,Senior Citizen Certificate,Online,2026-08-16,Pending,4,25,3
EG2026-084,Rohan Sawant,Kolhapur,Property Tax,Government Office,2026-08-17,Pending,5,850,4
EG2026-085,Anita Mane,Kolhapur,Residence Certificate,Government Office,2026-08-18,Approved,5,25,3
EG2026-086,Omkar Desai,Sangli,Senior Citizen Certificate,Government Office,2026-08-20,Pending,9,20,2
EG2026-087,Sunita Salunkhe,Solapur,Scholarship Application,CSC Center,2026-08-21,Pending,11,0,3
EG2026-088,Ganesh Kamble,Kolhapur,Property Tax,Online,2026-08-22,Approved,4,850,4
EG2026-089,Shital Desai,Sangli,Caste Certificate,CSC Center,2026-08-26,Rejected,6,40,2
EG2026-090,Jyoti Joshi,Pune,Property Tax,CSC Center,2026-08-28,Approved,3,2200,4
`;
