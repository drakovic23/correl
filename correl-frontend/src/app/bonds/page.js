"use client"

import HighchartsReact from "highcharts-react-official";
import Highcharts, {chart} from "highcharts";
import HighchartsExporting from "highcharts/modules/exporting";
import React, {useEffect, useState} from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loading from "@/app/bonds/loading";

//TODO: Change the fetch to do it server side
async function getYieldCurveData() {
    const res = await fetch('http://localhost:5289/api/yield-curve')

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }

    return await res.json();
}

const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

const calcTenYearDiff = (rateData) => {
    let ret = {
        series: [{
            data: [],
            name: '',
            type: 'area',
        }],
        xAxis: [],
    }
    //loop through every 9
    for (let i = 2; i < rateData.length; i += 9) {
        if (i >= rateData.length)
            return ret;
        let dataPoint =
            Math.round((rateData[i].lastBondYield - rateData[i + 3].lastBondYield + Number.EPSILON) * 100) / 100;

        ret.series[0].data.push(dataPoint);
        ret.xAxis.push(rateData[i].year);
    }

    ret.series[0].data = ret.series[0].data.reverse();
    ret.xAxis = ret.xAxis.reverse();

    return ret;
}
if (typeof Highcharts === 'object') {
    HighchartsExporting(Highcharts)
}
export default function Bonds()
{
    const [yieldData, setYieldData] = useState(null);
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [yieldCurveOptions, setYieldCurveOptions] = useState({
        chart: {
            type: 'spline'
        },
        title: {
            text: 'US Government Bond Yield Curve'
        },
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 1080
                },
                chartOptions: {
                    chart: {
                        className: 'small-chart'
                    }
                }
            }]
        },
        series: [],
        xAxis: {
            categories: ['3M', '6M', '1YR', '2YR', '3YR', '5YR', '10YR', '20YR', '30YR'],
            accessibility: {
                description: 'Maturity Date'
            },
        },
        yAxis: {
            allowDecimals: true, //this does nothing?
            title: {
                text: 'Yield'
            },
            labels: {
                format: '{value}%'
            }
        },
        tooltip: {
            valueSuffix: '%'
        }

    });

    const [tenYearMinusTwoOptions, setTenYearMinusTwoOptions] = useState({
        chart: {
            zoomType: 'x',
            type: 'area'
        },
        title: {
            text: 'Ten-Year Treasury Minus Two-Year',
            align: 'center'
        },
        subtitle: {
            text:
                'Click and drag in the plot area to zoom in',
            align: 'center'
        },
        xAxis: {
            categories: ['3M', '6M', '1YR', '2YR', '3YR', '5YR', '10YR', '20YR', '30YR'],
            type: 'date'
        },
        yAxis: {
            title: {
                text: '10Y - 2Y (%)'
            },
            allowDecimals: true,
            labels: {
                format: '{value}%'
            },
            plotBands: [
                {
                    value: 0,
                    width: 2.5,
                    color: 'rgba(248,3,3,0.5)',
                    zIndex: 5
                    /*label: {
                        text: "Contraction",
                        style: {
                            color: "#606060"
                        }
                    }*/
                }
            ]
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        series: [{
            type: 'area',
            name: '10Y - 2Y',
            data: []
        }],
        tooltip: {
            valueSuffix: '%'
        }
    });

    useEffect(() => {
        let isActive = true;
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const yieldCurveData = await getYieldCurveData();
                setYieldData(yieldCurveData)
                if (!isActive) return;//there's a bug here where the first series is missing the last data point
                setYieldCurveOptions(prevOptions => {
                    let seriesData_1 = yieldCurveData.slice(0, 9).reverse().map(item => item.lastBondYield); //recent month
                    let seriesData_2 = yieldCurveData.slice(9, 18).reverse().map(item => item.lastBondYield); //prev month
                    let seriesData_3 = yieldCurveData.slice(96, 105).reverse().map(item => item.lastBondYield); //1 year
                    let seriesData_4 = yieldCurveData.slice(480, 489).reverse().map(item => item.lastBondYield); //5 year
                    let series_1 = {
                        data: seriesData_1,
                        name: `${months[yieldCurveData[0].month]} ${yieldCurveData[0].year}`
                    };
                    let series_2 = {
                        data: seriesData_2,
                        name: `${months[yieldCurveData[9].month]} ${yieldCurveData[9].year}`
                    };
                    let series_3 = {
                        data: seriesData_3,
                        name: `${months[yieldCurveData[108].month]} ${yieldCurveData[108].year}`
                    };
                    let series_4 = {
                        data: seriesData_4,
                        name: `${months[yieldCurveData[540].month]} ${yieldCurveData[540].year}`
                    };
                    return {
                        ...prevOptions,
                        series: [series_1, series_2, series_3, series_4, ...prevOptions.series] // prepend new series to existing series
                    };
                });

                const tenYearMinusTwoData = calcTenYearDiff(yieldCurveData);
                //let xAxis = tenYearMinusTwoData.map.(item.data => `${months[item.month]} ${item.year}`);

                setTenYearMinusTwoOptions({
                    ...tenYearMinusTwoOptions,
                    series: tenYearMinusTwoData.series[0],
                    xAxis: {
                        ...tenYearMinusTwoOptions.xAxis,
                        categories: tenYearMinusTwoData.xAxis
                    }
                })


            } catch (error) {
                console.error("Error fetching yield curve data: ", error);
            }
        }

        fetchData()
        setIsLoading(false);

        return () => {
            isActive = false;
        }
    }, []);


    const dataHandle = () => {

        console.log(yieldData);
    }

    const handleCalenderPicker = () => {
        setDatePickerVisible(!datePickerVisible);
    }

    const renderMonthContent = (month, shortMonth, longMonth, day) => {
        const fullYear = new Date(day).getFullYear();
        const tooltipText = `Tooltip for month: ${longMonth} ${fullYear}`;

        return <span title={tooltipText}>{shortMonth}</span>;
    }

    const handleAddSeries = (date) => { //To add a series for a month
        const newOptions = {...yieldCurveOptions}
        setSelectedDate(date)
        console.log(date);
    };

    const handleRemoveSeries = (seriesName) => {
        const newOptions = {...yieldCurveOptions}; // Clone the current state
        let index = undefined;
        for (let i = 0; i < newOptions.series.length; i++) {
            if (newOptions.series.length > 1) { //I don't think this gets updated with splice?
                if (newOptions.series[i].name === seriesName) {
                    index = i;
                    if (index !== undefined) {
                        console.log("Deleting " + newOptions.series[i].name);
                        newOptions.series.splice(index, 1);
                        break;
                    }
                }
            } else {
                newOptions.series = [];
            }
        }
        setYieldCurveOptions(newOptions); // Set the new state
    }
    return (
        <>
            {/*Add loading symbol here*/}
            <div className="container mt-8 mx-auto">
                {/*
                    isLoading ? "" : <Loading/>
                */}
                <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-2 h-full">

                    <div className="card shadow-md bg-base-100 w-full rounded">
                        <div className="card-body">
                            <h1 className="text-center text-sm font-bold mt-2">ICE US Corporate Index Yield</h1>
                            <h1 className="text-center font-light mt-2 text-green-800">5.56%</h1>
                            <h1 className="text-center font-extralight text-xs">(As of May-6-2024)</h1>
                        </div>
                    </div>

                    <div className="card shadow-md bg-base-100 w-full rounded">
                        <div className="card-body">
                            <h1 className="text-center text-sm font-bold mt-2">ICE AAA US Corporate Index
                                Yield</h1>
                            <h1 className="text-center font-light mt-2 text-green-800">5.03%</h1>
                            <h1 className="text-center font-extralight text-xs">(As of May-6-2024)</h1>
                        </div>
                    </div>

                    <div className="card shadow-md bg-base-100 w-full rounded"> {/*MAYBE NEED TO ADD 0 PADDING HERE*/}
                        <div className="card-body">
                            {/*<HighchartsReact
                                    highcharts={Highcharts}
                                    options={tripleACorpYieldOptions}
                                    allowChartUpdate={true}

                                />*/}
                            <h1 className="text-center text-sm font-bold mt-2">ICE BBB US Corporate Index
                                Yield</h1>
                            <h1 className="text-center font-light mt-2 text-green-800">5.76%</h1>
                            <h1 className="text-center font-extralight text-xs">(As of May-6-2024)</h1>
                        </div>
                    </div>

                    <div className="card shadow-md bg-base-100 w-full rounded">
                        <div className="card-body">
                            <h1 className="text-center text-sm font-bold mt-2">ICE CCC & Lower US Corporate Index
                                Yield</h1>
                            <h1 className="text-center font-light mt-2 text-green-800">13.61%</h1>
                            <h1 className="text-center font-extralight text-xs">(As of May-6-2024)</h1>
                        </div>
                    </div>


                </div>
                <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-2 mt-4">
                    <div className="card shadow-md bg-base-100 w-full rounded">
                        <div className="card-body p-2">

                                { /* This doesn't actually work */
                                    isLoading ? <Loading/> : <HighchartsReact
                                    highcharts={Highcharts}
                                options={yieldCurveOptions}
                                allowChartUpdate={true}/>
                                }

                            <hr/>
                            <div className="flex">
                                <DatePicker
                                    selected={new Date()}
                                    renderMonthContent={renderMonthContent}
                                    showMonthYearPicker
                                    dateFormat="+"
                                    className="border-2 border-indigo-800 w-16 text-center text-md text-indigo-800 cursor-pointer"
                                    onChange={(date) => handleAddSeries(date)}
                                >
                                </DatePicker>
                                <div className="ml-4 flex gap-1.5">


                                    {yieldCurveOptions.series.map((series) => {
                                        return <label key={series.name} className="btn btn-sm"
                                                      onClick={() => handleRemoveSeries(series.name)}>{series.name}<h1 className="ml[-1]text-lg text-red-500">X</h1></label>
                                    })}
                                </div>
                            </div>
                            <label className='btn btn-sm' onClick={dataHandle}>Test</label>
                        </div>

                    </div>

                    <div className="card shadow-md bg-base-100 w-full rounded">
                        <div className="card-body pl-0 ml-0 mr-0 pr-0">
                            {/*Average rate of change, 3m, 6m, 12m*/}

                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={tenYearMinusTwoOptions}
                                />

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
