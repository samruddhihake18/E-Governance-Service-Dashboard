# Viva Questions and Answers

**Project:** E-Governance Service Dashboard  
**Subject:** Data Warehousing & Business Intelligence (1ADPE404) | ISE-I Activity 2

---

**Q1. What is Business Intelligence?**  
**Answer:** Business Intelligence (BI) means collecting data, analysing it and showing it in a simple form like charts and reports, so that people can take better decisions.

**Q2. What is a dashboard?**  
**Answer:** A dashboard is one screen that shows the most important numbers and charts of a topic. It helps us understand the data quickly.

**Q3. What is a KPI?**  
**Answer:** KPI means Key Performance Indicator. It is an important number that shows how well something is performing, for example Approval Rate or Average Processing Days.

**Q4. Why did you select E-Governance?**  
**Answer:** The topic E-Governance Service Dashboard was allotted to me. It is also a useful topic because government services like certificates, tax and scholarships are used by many citizens, and analysing them can reduce delays.

**Q5. What is E-Governance?**  
**Answer:** E-Governance means giving government services to citizens using computers and the internet, like online certificates and online tax payment.

**Q6. What is your dataset?**  
**Answer:** My dataset has citizen applications for government services. It has Application ID, name, district, service type, channel, date, status, processing days, fee and satisfaction rating.

**Q7. How many records are there?**  
**Answer:** The raw dataset has 94 records. After cleaning it has 90 records, because 4 duplicate records were removed.

**Q8. What attributes are used?**  
**Answer:** Application_ID, Citizen_Name, District, Service_Type, Application_Channel, Application_Date, Status, Processing_Days, Service_Fee and Satisfaction_Rating - 10 attributes in total.

**Q9. What is data cleaning?**  
**Answer:** Data cleaning means correcting the data before analysis - removing duplicates, filling missing values and correcting wrong or inconsistent values.

**Q10. Why are missing values handled?**  
**Answer:** If values are missing, the averages and counts can be wrong, and charts may not work properly. So we fill them with suitable values.

**Q11. How did you handle the missing values?**  
**Answer:** I filled missing Processing_Days with the median (6), missing Satisfaction_Rating with the median (4) and missing Service_Type with the mode (Property Tax, the most frequent service).

**Q12. What are duplicate records?**  
**Answer:** Duplicate records are the same record entered more than once. They make the counts wrong because the same application is counted twice.

**Q13. How did you remove duplicates?**  
**Answer:** I checked records with the same Application_ID and the same details. I found 4 duplicates and kept only the first copy of each.

**Q14. What inconsistent values did you correct?**  
**Answer:** Some district names were written differently, like 'kolhapur', 'SANGLI', 'Pune ' with an extra space and 'Sholapur'. I changed them to Kolhapur, Sangli, Pune and Solapur.

**Q15. What is the difference between raw and cleaned data?**  
**Answer:** Raw data is the original data with problems like missing values and duplicates. Cleaned data is the corrected data which is ready for analysis.

**Q16. Why did you use a bar chart?**  
**Answer:** A bar chart is best for comparing categories, such as applications in different districts or services.

**Q17. Why did you use a pie/doughnut chart?**  
**Answer:** A doughnut chart shows how a whole is divided into parts. I used it for Approved/Rejected/Pending and for the application channels, because there are only a few categories.

**Q18. Why did you use a line chart?**  
**Answer:** A line chart shows change over time, so I used it for monthly applications.

**Q19. What is an interactive filter?**  
**Answer:** A filter lets the user choose a value, like District = Sangli. Then the dashboard shows data only for that choice, and the KPIs and charts update automatically.

**Q20. What is approval rate?**  
**Answer:** Approval rate = Approved applications divided by Total applications × 100. In my data it is 73.3% (66 out of 90).

**Q21. What is average processing time?**  
**Answer:** It is the average number of days taken to process an application. In my data it is 7.0 days.

**Q22. What tools did you use?**  
**Answer:** HTML, CSS and JavaScript for the dashboard, Chart.js for charts, CSV files for data, Microsoft Excel for the workbook and Word for the report. All are free or common tools; no paid software is needed.

**Q23. What are the main findings?**  
**Answer:** Sangli had the most applications (26); Property Tax was the most demanded service (21); 73.3% were approved; Water Connection took the longest time (13.8 days); Online was the most common channel (39 applications).

**Q24. Which service takes the most time and which has the best satisfaction?**  
**Answer:** Water Connection takes the most time (13.8 days on average). Birth Certificate has the highest satisfaction (4.11 out of 5).

**Q25. What is the purpose of the dashboard?**  
**Answer:** The purpose is to help government officers see service demand, status of applications, processing time and citizen satisfaction quickly, so they can plan and improve services.

**Q26. How are the KPIs calculated in the dashboard?**  
**Answer:** They are calculated in JavaScript from the filtered data. They are not typed manually, so they change when the filters change.

**Q27. What is the use of the Excel file?**  
**Answer:** The Excel file has the raw data, cleaned data, cleaning summary, KPI calculations using formulas, chart data and a dashboard sheet with charts.

**Q28. What is the conclusion?**  
**Answer:** The dashboard shows the application status, demand and performance of E-Governance services clearly. It helps in decision making and is easy to use with filters.

**Q29. What future improvements are possible?**  
**Answer:** Using real government data, adding more filters, adding a map, connecting to a live database, and building the same dashboard in Power BI or Tableau.

