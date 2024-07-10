"use client"

import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import HighchartsExporting from "highcharts/modules/exporting";
import React from 'react';
import "react-datepicker/dist/react-datepicker.css";

if (typeof Highcharts === 'object') {
    HighchartsExporting(Highcharts)
}

export default function HistogramChart({histogramChartOptions})
{
    //console.log(histogramData);
    return( //The options property is not being passed
        <HighchartsReact
            highcharts={Highcharts}
            options={histogramChartOptions}
            allowChartUpdate={true}
        />
    )
}