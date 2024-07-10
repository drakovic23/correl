export async function getTickerNews(ticker)
{
    const currentDate = new Date();
    let startDate = new Date();
    startDate.setMonth(currentDate.getMonth() - 2);

    const startDateMonth = startDate.getMonth() + 1; //The news api uses months 1 - 12 but js indexes from 0
    const currentDateMonth = currentDate.getMonth() + 1;
    //Format the dates
    const startDateStr = `${startDate.getFullYear()}-${startDateMonth < 10 ? '0' + startDateMonth 
        : startDateMonth}-${startDate.getDate() < 10 ? '0' + startDate.getDate() : startDate.getDate()}`;
    const currentDateStr = `${currentDate.getFullYear()}-${currentDateMonth < 10 ? '0' + currentDateMonth
        : currentDateMonth}-${currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate()}`;

    const res = await fetch (`${process.env.API_NEWS_URL}?symbol=${ticker}&from=${startDateStr}&to=${currentDateStr}&token=${process.env.API_NEWS_FREE_TOKEN}`)

    if(!res.ok)
    {
        throw new Error("Failed to fetch news data")
    }

    return await res.json();
}
export async function getStatsPageData(ticker)
{
    const res = await fetch(`${process.env.API_URL}/api/data/home/${ticker}`, {cache: "no-store"})

    if(!res.ok)
    {
        throw new Error('Failed to fetch historical data')
    }
    //console.log("Fetched historical ticker data")
    return await res.json();
}

export async function getYieldCurveData() {
    const res = await fetch(`${process.env.API_URL}/api/yield-curve`)

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }
    return await res.json();
}

export async function getHistogramChartOptions(histogramData, symbol)
{
    //console.log("HISTOGRAM DATA: \n" + histogramData);
    const histChartOptions =
        {
            title: {
                text: symbol + ' Daily Returns Distribution',
                style: {
                    fontSize: '16px',
                }
            },
            chart: {
                type: 'column',
                //height: 500
            },
            xAxis: {
                type: 'category',
                categories: [],
                labels: {
                    style:
                        {
                            fontSize:'12px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                }
            },
            yAxis: {
                type: 'logarithmic',
                title:
                    {
                        text: ''
                    }

            },
            plotOptions: {
                column: {
                    pointPadding: 0,
                    borderWidth: 2,
                    groupPadding: 0,
                    shadow: false
                }
            },
            series: [
                {
                    data: [],
                    name: 'Daily % Gain',
                    color: '#2f72c3',
                    colorByPoint: false,
                    groupPadding: 0,
                    borderColor: '#485757'

                }
            ],
            legend: {
                enabled: false
            }
        }

        for(let i = 0;i < histogramData.length; i++)
        {
            histChartOptions.xAxis.categories.push(histogramData[i].binName);
            histChartOptions.series[0].data.push(parseInt(histogramData[i].frequency));
        }
        //console.log(histChartOptions.series[0].data[0]);
        return histChartOptions
}

export function getTickerChartOptions(data, symbol)
{
    const chartOptions =
        {
            rangeSelector: {
                selected: 3,
            },
            title: {
                text: symbol + ' Daily Close'
            },

            series: [{
                name: symbol,
                data: [],
                tooltip: {
                    valueDecimals: 2
                }
            }],
            yAxis: {
                offset: 20,
                lineWidth: 1,
            }
        }

    data.forEach((t) => {
        const entry = [new Date(t.date).getTime(), t.close]
        chartOptions.series[0].data.push(entry)
    })


    return chartOptions;
}