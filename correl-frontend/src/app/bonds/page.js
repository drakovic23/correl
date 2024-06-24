"use client"

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsExporting from "highcharts/modules/exporting";
import React, {useEffect, useState} from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InfinityLoader from "@/components/InfinityLoader/InfinityLoader";

async function getYieldCurveData() {
    const res = await fetch('https://correl-dotnet.azurewebsites.net/api/yield-curve')

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }
    return await res.json();
}

const splineColors = [
    "#2caffe",
    "#544fc5",
    "#00e272",
    "#fe6a35",
    "#6b8abc",
    "#d568fb",
    "#2ee0ca",
    "#fa4b42",
    "#feb56a",
    "#91e8e1"
];

const months = [
    "",
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


if (typeof Highcharts === 'object') {
    HighchartsExporting(Highcharts)
}

export default function Bonds()
{
    const [yieldData, setYieldData] = useState(null);
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
            }
        },
        yAxis: {
            allowDecimals: true,
            title: {
                text: 'Yield'
            },
            labels: {
                format: '{value:.2f}%'
            },
            tickInterval: 0.5
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
            text: 'Ten-Year Minus Two-Year Treasury',
            align: 'center'
        },
        subtitle: {
            text:
                'Click and drag in the plot area to zoom in',
            align: 'center'
        },
        xAxis: {
            categories: ['1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005'],
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
                }
            ]
        },
        legend: {
            enabled: false
        },
        plotOptions: {

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

    const calcTenYearDiff = (rateData) => {
        let newSeries = {
            series: [{
                data: [],
                name: '', //not needed
                type: 'area',
            }],
            xAxis: [],
        }

        let data = rateData.map((e) => e); //clone
        let filteredData = data.filter((x) => x.typeId === 3 || x.typeId === 6);
        filteredData.reverse();

        for(let i = 0; i < filteredData.length; i += 2){
            if(i + 1 >= filteredData.length)
                break;

            let dataPoint = Math.round((filteredData[i].lastBondYield - filteredData[i + 1].lastBondYield + Number.EPSILON) * 100) / 100;
            newSeries.series[0].data.push(dataPoint);
            newSeries.xAxis.push(filteredData[i].year);
        }

        return newSeries;
    }

    useEffect(() => {
        let isActive = true;
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const yieldCurveData = await getYieldCurveData();
                //console.log(yieldCurveData);
                if (!isActive) return;
                setYieldData(yieldCurveData)
                //console.log(yieldCurveData);
                if (!isActive) return;
                setYieldCurveOptions(prevOptions => { // For initial yield curve chart
                    //Every 8 elements is a month
                    let seriesData_1 = yieldCurveData.slice(0, 9).map(item => item.lastBondYield); //most recent month
                    let seriesData_2 = yieldCurveData.slice(9, 18).map(item => item.lastBondYield); //prev month
                    let seriesData_3 = yieldCurveData.slice(108, 117).map(item => item.lastBondYield); //1 year
                    //let seriesData_4 = yieldCurveData.slice(216, 225).map(item => item.lastBondYield); //2year
                    let series_1 = {
                        data: seriesData_1,
                        name: `${months[yieldCurveData[0].month]} ${yieldCurveData[0].year}`,
                        color: splineColors[0]
                    };
                    let series_2 = {
                        data: seriesData_2,
                        name: `${months[yieldCurveData[9].month]} ${yieldCurveData[9].year}`,
                        color: splineColors[1]
                    };
                    let series_3 = {
                        data: seriesData_3,
                        name: `${months[yieldCurveData[108].month]} ${yieldCurveData[108].year}`,
                        color: splineColors[2]
                    };
                    /*let series_4 = {
                        data: seriesData_4,
                        name: `${months[yieldCurveData[540].month]} ${yieldCurveData[540].year}`,
                        color: splineColors[3]
                    };*/

                    return {
                        ...prevOptions,
                        series: [series_1, series_2, series_3, ...prevOptions.series] // prepend
                    };
                });

                const tenYearMinusTwoData = calcTenYearDiff(yieldCurveData);

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

        fetchData().then(() => {setIsLoading(false)})

        return () => {
            isActive = false;
        }
    }, []);

    const renderMonthContent = (month, shortMonth, longMonth, day) => {
        const fullYear = new Date(day).getFullYear();
        const tooltipText = `Tooltip for month: ${longMonth} ${fullYear}`;

        return <span title={tooltipText}>{shortMonth}</span>;
    }

    const handleAddSeries = (date) => { //To add a series for a month
        const dateNeeded = new Date(date);
        const filteredYieldCurve = yieldData.filter((yieldRate) => yieldRate.year === dateNeeded.getFullYear() &&
            yieldRate.month === dateNeeded.getMonth() + 1)

        let newSeries = {
            data: [],
            name: `${months[filteredYieldCurve[0].month]} ${filteredYieldCurve[0].year}`,
            color: yieldCurveOptions.series.length < 10 ? splineColors[yieldCurveOptions.series.length + 1] : "#73462a"
        };
        filteredYieldCurve.map((yieldRate) => {
            newSeries.data.push(yieldRate.lastBondYield);
        })

        setYieldCurveOptions(prevOptions=> {
            return{
                ...prevOptions,
                series: [...prevOptions.series, newSeries]
            }
        });

    };

    const convertDate = (date) =>
    {
        return new Date(date);
    }



    const handleRemoveSeries = (seriesName) => {
        //e.preventDefault();
        setYieldCurveOptions(prevOptions => ({
            ...prevOptions,
            series: prevOptions.series.filter(_ => _.name !== seriesName)
        }));
    }

    /*if(isLoading)
    {
        return <InfinityLoader/>
    }*/
    return (
            <div className="container mt-8 mx-auto">
                <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-2 h-full">

                    <div className="card shadow-md bg-base-100 w-full rounded">
                        <div className="card-body">
                            <h1 className="text-center text-sm font-bold mt-2">ICE US Corporate Index Yield</h1>
                            <h1 className="text-center font-light mt-2 text-green-800">5.42%</h1>
                            <h1 className="text-center font-extralight text-xs">(As of Jun-20-2024)</h1>
                        </div>
                    </div>

                    <div className="card shadow-md bg-base-100 w-full rounded">
                        <div className="card-body">
                            <h1 className="text-center text-sm font-bold mt-2">ICE AAA US Corporate Index
                                Yield</h1>
                            <h1 className="text-center font-light mt-2 text-green-800">4.90%</h1>
                            <h1 className="text-center font-extralight text-xs">(As of Jun-20-2024)</h1>
                        </div>
                    </div>

                    <div className="card shadow-md bg-base-100 w-full rounded">
                        <div className="card-body">
                            <h1 className="text-center text-sm font-bold mt-2">ICE BBB US Corporate Index
                                Yield</h1>
                            <h1 className="text-center font-light mt-2 text-green-800">5.60%</h1>
                            <h1 className="text-center font-extralight text-xs">(As of Jun-20-2024)</h1>
                        </div>
                    </div>

                    <div className="card shadow-md bg-base-100 w-full rounded">
                        <div className="card-body">
                            <h1 className="text-center text-sm font-bold mt-2">ICE CCC & Lower US Corporate Index
                                Yield</h1>
                            <h1 className="text-center font-light mt-2 text-green-800">13.671%</h1>
                            <h1 className="text-center font-extralight text-xs">(As of Jun-20-2024)</h1>
                        </div>
                    </div>


                </div>

                {/*TODO: This should be a component*/}
                <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-2 mt-4">
                    <div className="card shadow-md bg-base-100 w-full rounded">
                        <div className="card-body p-2">
                                <HighchartsReact
                                highcharts={Highcharts}
                                options={yieldCurveOptions}
                                allowChartUpdate={true}/>
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
                                                      onClick={() => handleRemoveSeries(series.name)}>
                                            {series.name}
                                            <h1 className="ml[-1]text-lg text-red-500">X</h1>
                                        </label>
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-md bg-base-100 w-full rounded">
                        <div className="card-body pl-0 ml-0 mr-0 pr-0">
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={tenYearMinusTwoOptions}
                                />

                        </div>
                    </div>
                </div>
            </div>
    );
}
