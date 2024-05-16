"use client"

import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import HighchartsExporting from "highcharts/modules/exporting";
import React from 'react';
import "react-datepicker/dist/react-datepicker.css";

if (typeof Highcharts === 'object') {
    HighchartsExporting(Highcharts)
}
export default function SplineChart({chartOptions})
{
    return(
        <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
            allowChartUpdate={true}
        />
    )
}