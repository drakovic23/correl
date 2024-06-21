# Financial Dashboard

A financial markets dashboard that displays some stats on the daily returns of publicly traded securities.

## Description

Right now, the dashboard displays historical daily close price, ATR (Average True Range) values, the 
distribution of daily returns, common standard deviations as well as the US yield curve.

I mainly created this to get more exposure to the front end side of things while learning some back end technologies.

A live preview is available here: [Live Preview](https://correl-frontend.vercel.app/stats)

### Images

![img_1.png](img_1.png)
![img.png](img.png)

## How it works

### ASP.NET
* Provides APIs for getting necessary yield-curve data and data on any other type of bond.
* Provides APIs for retrieving indicator data.
* Hosted on Azure
* Uses .NET Minimal API

### Python Flask
* Uses NumPy and Pandas to calculate stats on ticker data
* Provides APIs for calculating stats given a symbol (ticker), used by the /stats page.
* Runs a daily query for new bond data provided by the FRED to update the DB tables.
* Can also scrape economic indicator data but this is not used at the moment.
* Hosted on Azure.
* Uses Gunicorn as web server gateway

### SQL
* Holds data on bonds for the respective country as I plan to implement a country context for each page.
* Hosted on Azure.

### Next.Js
* Handles all UI and some external API requests.
* Is responsive but not really meant to be used on mobile devices.
* Hosted on Vercel

### Why did I choose to build this way?
* I like to learn stuff

## Todo:
- [x] Implement daily bonds data update
- [ ] Add symbol search suggestions for /stats
- [x] Implement Indicator suggestions
- [ ] Implement Indicators page
- [ ] Add support for other countries
- [ ] Implement Authentication?

