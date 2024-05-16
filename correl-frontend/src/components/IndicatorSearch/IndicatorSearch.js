"use client"
import React, { useState } from 'react';
import SplineChart from "@/components/IndicatorCharts/SplineChart";

const getSelectedSearchData = async (id) => {
    const response = await fetch(`http://localhost:5289/api/indicators/${id}`);
    const data = await response.json();
    //console.log(data);
    return data;
}

const chartTemplate = {
    chart: {
        type: 'spline'
    },
    title: {
        text: 'TITLE HERE'
    },
    series: [{
        name: 'Indicator',
        data: []
    }],
        xAxis: {
    categories: [],
        accessibility: {
        description: 'Date'
    },
},
    yAxis: {
            allowDecimals: true,
            title: {
            text: ''
        },
        labels: {
            format: '{value}'
        }
    },
    tooltip: {
        valueSuffix: ''
    },

}
export default function IndicatorSearch() {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedIndicator, setSelectedIndicator] = useState(null);
    const [chartData,setChartData] = useState(null);

    const fetchSuggestions = async (term) => {
        const response = await fetch(`/indicators/api?query=${term}`);
        const data = await response.json();
        //console.log(data.filteredIndicators);
        setSuggestions(data.filteredIndicators);
    };

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        if (value) {
            fetchSuggestions(value);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = async (indicator) => {
        setSearchTerm(indicator.eventName);
        setSuggestions([]);
        // Fetch detailed data for the selected indicator
        //const response = await fetch(`/api/indicators/${encodeURIComponent(indicator)}`);
        //const data = await response.json();
        //console.log(indicator);
        const indicatorData = await getSelectedSearchData(indicator.id);
        console.log("Calling API for indicator id: " + indicator.id);

        let chartOptions= structuredClone(chartTemplate);

        indicatorData.reverse().map((d) => {
            chartOptions.series[0].data.push(parseFloat(d.actual));
            chartOptions.xAxis.categories.push(d.releaseDate);
        })
        chartOptions.title.text = indicator.eventName;
        chartOptions.series[0].name = indicator.eventName;
        console.log("setting chart title to: " + indicator.eventName);
        console.log(chartOptions);

        setChartData(chartOptions);
        //setSelectedIndicator(indicator);
        //Handle the selected indicator
        //Display chart or table?


    };

    return (
        <div>
            <label className="input input-bordered flex items-center gap-2">
                <input onChange={handleSearchChange} value={searchTerm} type="text" className="grow" placeholder="Search" autoComplete="off"/>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                     className="w-4 h-4 opacity-70">
                    <path fillRule="evenodd"
                          d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                          clipRule="evenodd"/>
                </svg>
            </label>
            <ul className="shadow dropdown-content z-[1] bg-base-100">
                {suggestions.map((suggestion, index) => (
                    <li
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        style={{cursor: 'pointer'}}
                        className="hover:bg-base-300"
                    >
                        {suggestion.eventName}
                    </li>
                ))}
            </ul>

            { chartData === null ? "" :
                <div className="overflow-x-auto mt-8">

                    <div className="card bg-base-100 rounded">
                        <div className="card-body">
                    <SplineChart
                        chartOptions={chartData}
                        allowChartUpdate={true}
                    />
                        </div>
                    </div>
                </div>
                }
        </div>
    );
}