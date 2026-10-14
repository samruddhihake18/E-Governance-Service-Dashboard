E-Governance Service Dashboard - how to open
=============================================
1. Double-click index.html (use Chrome, Edge or Firefox).
2. Keep internet ON (Chart.js is loaded from cdnjs.cloudflare.com).
3. Use the filters (District, Service Type, Channel, Status). Click "Reset Filters" to clear them.
4. "Choose CSV" loads another CSV with the same 10 columns.

Files: index.html (page), style.css (design), script.js (data loading, filters, KPIs, charts).
No server needed. If the CSV in ../data cannot be read by the browser, a built-in copy of the cleaned data is used automatically.
Optional server:  cd dashboard   then   python -m http.server 8000   then open http://localhost:8000
