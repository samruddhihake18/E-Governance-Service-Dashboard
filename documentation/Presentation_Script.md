# Presentation Script (5-7 minutes)

**Topic:** E-Governance Service Dashboard  |  **Subject:** Data Warehousing & Business Intelligence (1ADPE404)

*(Speak slowly. Open the dashboard before you start. Approximate time is written for each part.)*

---

## 1. Greeting (15 sec)
Good morning, respected madam and my dear friends. My name is ____________ and my roll number is ____________.

## 2. Introduction (30 sec)
Today I will present my ISE-I Activity 2 for the subject Data Warehousing and Business Intelligence. In this activity we had to create a Business Intelligence dashboard. A dashboard shows important numbers and charts on one screen, so that we can understand the data easily.

## 3. Topic (20 sec)
My topic is the E-Governance Service Dashboard. E-Governance means giving government services like certificates, tax payment and scholarships to citizens online. My dashboard analyses the applications that citizens submit for these services.

## 4. Objective (30 sec)
The objective is to understand how many applications are received, how many are approved, rejected or pending, which service and district have more demand, how much time is taken to process an application, and how satisfied the citizens are.

## 5. Dataset (30 sec)
I created a sample dataset with 94 records. It has 10 columns such as application ID, district, service type, channel, date, status, processing days, fee and satisfaction rating. There are 8 services, 5 districts - Sangli, Kolhapur, Satara, Pune and Solapur - and 3 channels: Online, CSC Center and Government Office. The data is from January to August 2026.

## 6. Data Cleaning (60 sec)
The raw data was not clean on purpose, so I could show the data preparation phase. I found 4 duplicate records and removed them. I found 8 missing values: 2 in service type, 3 in processing days and 3 in satisfaction rating. I filled the numbers with the median and the service type with the mode. I also corrected 4 district names like 'kolhapur' and 'Sholapur'. So, 94 records became 90 clean records.

## 7. KPIs (45 sec)
At the top of the dashboard there are seven KPI cards. Total applications are 90. Approved are 66, rejected 7 and pending 17. The approval rate is 73.3 percent. The average processing time is 7.0 days and the average satisfaction rating is 3.73 out of 5. These values are calculated from the data and not typed manually.

## 8. Dashboard Charts (75 sec)
There are seven charts. The bar chart of applications by district shows that Sangli has the highest number, 26 applications. The doughnut chart shows the status - most applications are approved. The line chart shows the monthly trend; applications were highest in August and lowest in January. The next bar chart shows service demand - Property Tax is the highest with 21 applications. Then we have average processing days by service, where Water Connection takes the longest, about 13.8 days. There is a doughnut chart for channels, where Online is the highest, and the last chart shows average satisfaction by district.

## 9. Filters (45 sec)
Now I will show the filters. There are four filters: District, Service Type, Application Channel and Status. *(Select District = Sangli.)* See, when I select Sangli, the KPIs, all charts and the table below change immediately. I can also select a service or channel together with it. To go back, I click the Reset Filters button. I can also load another CSV file using the Choose CSV button.

## 10. Findings (45 sec)
The main findings are: Sangli has the highest demand. Property Tax is the most applied service. 73.3 percent of applications are approved. Water Connection takes the longest time. Online is the most used channel with 39 applications. And Pune has the best average satisfaction, 3.86.

## 11. Conclusion (30 sec)
In conclusion, the dashboard gives a clear picture of E-Governance services. It helps officers to find which services need more attention and how to reduce delay. In future, it can be improved using real government data and more filters.

## 12. Thank you (10 sec)
Thank you, madam and friends. I am ready for your questions.
