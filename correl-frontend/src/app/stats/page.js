import HistogramChart from "@/components/StatCharts/HistogramChart";
import GeneralChartProvider from "@/components/GeneralChartProvider/GeneralChartProvider";
import WarningAlert from "@/components/WarningAlert/WarningAlert";
import {getGeneralStats, getTickerData} from "@/app/actions";
import TickerSearch from "@/components/TickerSearch/TickerSearch";
import FreqTable from "@/components/Tables/FreqTable";

function setHistogramOptions(data, symbol)
{
    const chartOptions =
        {
            title: {
                text: symbol + ' Daily Returns Distribution',
                style: {
                    fontSize: '16px',
                }

            },
            chart: {
                type: 'column'
            },
            xAxis: {
                type: 'category',
                categories:[ //bin values
                    '<= 2.0%',
                    '-2.0% to -1.5%',
                    '-1.5% to -1.0%',
                    '1.0% to -0.5%',
                    '-0.5% to 0.0%',
                    '0.0% to 0.5%',
                    '0.5% to 1.0%',
                    '1.0% to 1.5%',
                    '1.5% to 2.0%',
                    '>= 2.0%'
                ],
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

    data.forEach((point) => {
        chartOptions.series[0].data.push(point.counts);
    })
    return chartOptions;
}

function setTickerChartOptions(data, symbol)
{
    const chartOptions =
        {
            rangeSelector: {
                selected: 4,
            },
            title: {
                text: symbol + ' Daily Close Price'
            },

            series: [{
                name: symbol,
                data: [],
                tooltip: {
                    valueDecimals: 2
                }
            }],

        }

    //let seriesData = [];
    data.forEach((t) => {
        const entry = [new Date(t.date).getTime(), t.close]
        chartOptions.series[0].data.push(entry)
    })


    return chartOptions;
}
export default async function Stats({searchParams})
{
    const defaultSymbol = "^GSPC";
    const symbol = searchParams.symbol || defaultSymbol;
    const dailyStats = await getGeneralStats(symbol);
    const dailyHistoricalClose = await getTickerData(symbol);
    const histogramChartOptions = setHistogramOptions(dailyStats.initialHistogram, symbol)
    const spxHistoricalChartOptions = setTickerChartOptions(dailyHistoricalClose, symbol);
    const mean = parseFloat(dailyStats.initialDescriptive.mean);
    const stdDev = parseFloat(dailyStats.initialDescriptive.std);

    //Calculate the probability table
    const binNames = [ //bin values
        '<= 2.0%',
        '-2.0% to -1.5%',
        '-1.5% to -1.0%',
        '1.0% to -0.5%',
        '-0.5% to 0.0%',
        '0.0% to 0.5%',
        '0.5% to 1.0%',
        '1.0% to 1.5%',
        '1.5% to 2.0%',
        '>= 2.0%'
    ]
    let freqTableData = []


    dailyStats.initialHistogram.forEach((point,i) => {
       let newObj = {
           binName: "",
           freq: 0,
           probability: 0.00,
           cumulativeProb: 0.00
       }

       newObj.binName = binNames[i];
       newObj.freq = point.counts;
       newObj.probability = parseFloat((point.counts / dailyStats.initialDescriptive.count) * 100);
       if(i !== 0)
       {
           let cumulative = 0;

           for(let p = 0; p < freqTableData.length && p < i; p++)
           {
               cumulative += freqTableData[p].probability;
           }

           cumulative += newObj.probability;
           newObj.cumulativeProb = parseFloat(cumulative).toFixed(2);
       }else{
           newObj.cumulativeProb = (newObj.probability).toFixed(2);
       }

       freqTableData.push(newObj);
    });

    //Return info


    //std dev calcs
    const stdDevUpper= [((mean + (stdDev)) * 100).toFixed(2),
        ( (mean + (2 * stdDev)) * 100).toFixed(2),
        ( (mean + (3 * stdDev)) * 100 ).toFixed(2)
    ];
    const stdDevLower= [((mean - (stdDev)) * 100).toFixed(2),
        ( (mean - (2 * stdDev)) * 100).toFixed(2),
        ( (mean - (3 * stdDev)) * 100 ).toFixed(2)
    ];

    //console.log(dailyStats)
    return(
        <div className="">
            <WarningAlert/>

            <TickerSearch/>

            <div className="flex flex-grow">
                <div className="card shadow-md bg-base-100 rounded w-full">
                    <div className="card-body p-2">
                        <GeneralChartProvider
                            ohlcData={spxHistoricalChartOptions}
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-grow gap-1 mt-2">
                <div className="card shadow-md bg-base-100 rounded w-1/3">
                    <div className="card-body p-2">
                        <HistogramChart
                            chartOptions={histogramChartOptions}
                        />
                    </div>
                </div>
                <div className="card shadow-md bg-base-100 rounded text-center items-center">
                    <div className="card-body p-2">
                        <h1 className="font-semibold">Frequency Table</h1>
                        <hr/>
                        <FreqTable
                            freqData={freqTableData}
                        />
                    </div>
                </div>

                <div className="card shadow-md bg-base-100 rounded text-center items-center">
                    <div className="card-body rounded p-2">
                        <h1 className="font-semibold">Daily Return Stats (%)</h1>
                        <hr/>
                        <div className="overflow-x-auto mt-2">
                            <table className="table table-xs text-center">
                                <thead>
                                <tr>
                                    <th>Count</th>
                                    <th>Mean</th>
                                    <th>Min</th>
                                    <th>Max</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>{dailyStats.initialDescriptive.count}</td>
                                    <td>{`${(dailyStats.initialDescriptive.mean * 100).toFixed(2)}%`}</td>
                                    <td>{`${(dailyStats.initialDescriptive.min * 100).toFixed(2)}%`}</td>
                                    <td>{`${(dailyStats.initialDescriptive.max * 100).toFixed(2)}%`}</td>
                                </tr>
                                </tbody>
                            </table>
                            <hr/>

                            <table className="table table-xs mt-4 text-center">
                                <thead>
                                <tr>
                                    <th>Std Dev</th>
                                    <th>1</th>
                                    <th>2</th>
                                    <th>3</th>

                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>Upper</td>
                                    <td>{`${stdDevUpper[0]}%`}</td>
                                    <td>{`${stdDevUpper[1]}%`}</td>
                                    <td>{`${stdDevUpper[2]}%`}</td>
                                </tr>
                                <tr>
                                    <td>Lower</td>
                                    <td>{`${stdDevLower[0]}%`}</td>
                                    <td>{`${stdDevLower[1]}%`}</td>
                                    <td>{`${stdDevLower[2]}%`}</td>
                                </tr>
                                </tbody>
                            </table>
                            <hr/>
                            <table className="table table-xs mt-4 text-center">
                                <thead>
                                <tr>
                                    <th>20D ATR</th>
                                    <th>60D ATR</th>
                                    <th>120D ATR</th>
                                    <th>240D ATR</th>

                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>{`${dailyStats.initialGeneralStats[0].value}%`}</td>
                                    <td>{`${dailyStats.initialGeneralStats[1].value}%`}</td>
                                    <td>{`${dailyStats.initialGeneralStats[2].value}%`}</td>
                                    <td>{`${dailyStats.initialGeneralStats[3].value}%`}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="card shadow-md bg-base-100 rounded text-center items-center">
                    <div className="card-body rounded p-2">
                        <div className="overflow-x-auto">
                            <div className="table table-xs">
                                <table>
                                    <thead>
                                    <tr>
                                        <th>
                                            YTD
                                        </th>
                                        <th>
                                            12M
                                        </th>
                                        <th>
                                            6M
                                        </th>
                                        <th>
                                            3M
                                        </th>
                                        <th>
                                            1M
                                        </th>
                                    </tr>
                                    </thead>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>




            </div>
        </div>
    )
}