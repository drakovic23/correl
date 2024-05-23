"use client"

import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import HighchartsExporting from "highcharts/modules/exporting";
import React from 'react';

if (typeof Highcharts === 'object') {
    HighchartsExporting(Highcharts)
}

export default function GeneralChartProvider({ohlcData})
{
    return(
            <HighchartsReact
                highcharts={Highcharts}
                options={ohlcData}
                constructorType={'stockChart'}
            />
    )
}