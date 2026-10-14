# E-Governance Service Dashboard

**Subject:** Data Warehousing & Business Intelligence (1ADPE404)
**Activity:** ISE-I Activity 2 - Dashboard Development | **Academic Year:** 2026-27
**Department:** Artificial Intelligence & Data Science, Annasaheb Dange College of Engineering & Technology, Ashta

## Objective
To build an interactive dashboard that analyses citizen applications for government services (certificates, property tax, water connection, scholarship, etc.) and shows KPIs, charts and filters.

## Tools Used
- HTML, CSS, JavaScript (dashboard)
- Chart.js (charts, loaded from CDN - internet is needed once to load it)
- CSV files (data), Microsoft Excel (workbook), Word and Markdown (documents)

## Folder Structure
```
E_Governance_Service_Dashboard/
├── README.md
├── dashboard/        index.html, style.css, script.js, README.txt
├── data/             raw_e_governance_data.csv, cleaned_e_governance_data.csv
├── excel/            E_Governance_Service_Dashboard.xlsx
├── documentation/    Activity_Report.docx, Viva_Questions_and_Answers.md, Presentation_Script.md
└── screenshots/      dashboard_preview.png, README.txt
```

## Dataset
Sample data of citizen applications (January - August 2026): 8 services, 5 districts (Sangli, Kolhapur, Satara, Pune, Solapur), 3 channels. Names are fictional.
- Raw file: 94 records (with duplicates, missing values and inconsistent spellings)
- Cleaned file: 90 records

## How Data Cleaning Was Performed
| Step | Result |
|---|---|
| Original records | 94 |
| Duplicate records removed (same Application_ID and details) | 4 (EG2026-006, EG2026-029, EG2026-047, EG2026-072) |
| Missing Service_Type | 2 - filled with mode (Property Tax) |
| Missing Processing_Days | 3 - filled with median (6) |
| Missing Satisfaction_Rating | 3 - filled with median (4) |
| Inconsistent district names corrected | 4 (kolhapur, SANGLI, "Pune ", Sholapur) |
| Records after cleaning | 90 |

## How to Run the Dashboard
1. Open the folder `dashboard`.
2. Double-click `index.html` (it opens in Chrome, Edge or Firefox).
3. Keep the internet ON, because Chart.js is loaded from the internet (cdnjs).

The dashboard works directly from the folder - **no local server is required**. If the browser cannot read the CSV file directly, the dashboard automatically uses a built-in copy of the cleaned data (the page shows which source is used).

*Optional:* to read the CSV file from the `data` folder, you can also run:
```
cd dashboard
python -m http.server 8000
```
then open `http://localhost:8000`.

## How to Use Filters
Use the four drop-downs - **District, Service Type, Application Channel, Status**. KPI cards, all charts and the table update immediately. Filters can be combined.

## How to Reset Filters
Click the red **Reset Filters** button. All filters return to "All".

## How to Load CSV
Click **Choose CSV** and select a CSV file that has the same 10 columns as `cleaned_e_governance_data.csv`. If columns are missing, a message is shown.
(Use the cleaned file; the raw file contains duplicates and missing values.)

## Excel Usage
Open `excel/E_Governance_Service_Dashboard.xlsx`. Sheets: Raw Data, Cleaned Data, Data Cleaning Summary, Calculations, Chart Data, Dashboard. KPIs and chart data use formulas on the Cleaned Data sheet. Use the filter arrows on the Cleaned Data sheet to explore records.

## Documentation Files
- `documentation/Activity_Report.docx` - full report (fill name, roll number and class on the title page)
- `documentation/Viva_Questions_and_Answers.md` - 29 viva questions with answers
- `documentation/Presentation_Script.md` - 5-7 minute speaking script

## Main Findings (calculated from the cleaned data)
1. A total of 90 applications were analysed after cleaning. Out of these, 66 (73.3%) were approved, 7 (7.8%) were rejected and 17 (18.9%) are still pending.
2. Sangli received the highest number of applications (26, 28.9% of all), followed by Pune (22). Satara received the fewest (11).
3. Property Tax was the most demanded service with 21 applications. Water Connection was the least demanded with 4 applications.
4. The overall approval rate is 73.3%. Birth Certificate and Water Connection had a 100% approval rate, while Senior Citizen Certificate (33.3%) and Caste Certificate (40.0%) had the lowest approval rates.
5. The average processing time is 7.0 days. Water Connection took the longest (13.8 days on average), followed by Scholarship Application (11.8 days). Birth Certificate and Property Tax were the fastest (4.4 days).
6. Online was the most common channel with 39 applications (43.3%), followed by CSC Center (26) and Government Office (25).
7. The average citizen satisfaction rating is 3.73 out of 5. Pune had the highest district average (3.86) and Kolhapur the lowest (3.47).
8. By service, Birth Certificate had the highest satisfaction (4.11) and Senior Citizen Certificate the lowest (3.0).
9. Monthly applications were highest in August (18) and lowest in January (5). February also showed a high count (17).
10. The total service fee collected from these applications is Rs. 37,345.
