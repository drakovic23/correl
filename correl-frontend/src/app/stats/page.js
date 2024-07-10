export const maxDuration = 60;

import HistogramChart from "@/components/StatCharts/HistogramChart";
import GeneralChartProvider from "@/components/GeneralChartProvider/GeneralChartProvider";
import {getHistogramChartOptions, getStatsPageData, getTickerNews, getTickerChartOptions} from "@/app/actions";
import TickerSearch from "@/components/TickerSearch/TickerSearch";
import FreqTable from "@/components/Tables/FreqTable";
import ErrorAlert from "@/components/ErrorAlert/ErrorAlert";
import NewsTable from "@/components/Tables/NewsTable";

export default async function Stats({searchParams})
{
    const defaultSymbol = "^GSPC"; //Our default symbol is ^GSPC
    const symbol = searchParams.symbol || defaultSymbol; //If there's no symbol passed to searchParams use default

    let error = null;
    const fetchStatsData = async (symbolToFetch) => {
        return await getStatsPageData(symbolToFetch);
    }

    let statsPageData;
    try
    {
        statsPageData = await fetchStatsData(symbol);
    }catch(err)
    {
        error = true;
        try{
            statsPageData = await fetchStatsData(defaultSymbol);
        }catch(err){
            return(
                <p>Error loading default symbol :(</p>
            )
        }
    }

    const histogramChartOptions =  await getHistogramChartOptions(statsPageData.histTable, symbol);
    const spxHistoricalChartOptions = getTickerChartOptions(statsPageData.closeHistories, error ? defaultSymbol : symbol);
    const mean = parseFloat(statsPageData.pctReturnMean);
    const stdDev = parseFloat(statsPageData.stdDev);

    //std dev calcs
    const stdDevUpper= [((mean + (stdDev)) * 100).toFixed(2),
        ( (mean + (2 * stdDev)) * 100).toFixed(2),
        ( (mean + (3 * stdDev)) * 100 ).toFixed(2)
    ];
    const stdDevLower= [((mean - (stdDev)) * 100).toFixed(2),
        ( (mean - (2 * stdDev)) * 100).toFixed(2),
        ( (mean - (3 * stdDev)) * 100 ).toFixed(2)
    ];

    let newsData;
    try{
        newsData = await getTickerNews(symbol);
    }catch(e)
    {
        newsData = []
    }

    return(

        <div className="md:px-6 sm:px-2">
            <TickerSearch/>
            {error ? <ErrorAlert
                text="Invalid symbol, enter a valid symbol"
            /> : ""}
            <div className="grid xl:grid-cols-4 md:grid-cols-1 sm:grid-cols-1 gap-4 flex-row mt-4">
                <div className="card bg-base-100 rounded lg:col-span-3 md:col-span-1 sm:col-span-1 sm:p-0">
                    <div className="card-body border-gray-300 border w-full sm:p-0 md:p-4">
                        <GeneralChartProvider
                            ohlcData={spxHistoricalChartOptions}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                    <div className="card bg-base-100 h-fit w-full rounded">
                        <div className="card-body sm:p-0 md:p-4 gap-2 border-gray-300 border w-full">
                            <div className="grid grid-cols-2 gap-1">


                                <div className="flex items-start justify-between gap-2 text-sm">
                                    <div>
                                        <p className="font-medium text-base-content/70">Total Trading Days</p>
                                        <div className="mt-4 flex items-center gap-2">
                                            <h5 className="inline text-lg font-semibold">{statsPageData.closeHistories.length}</h5>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="flex items-start justify-between gap-2 text-sm border-l border-gray-300 w-full">
                                    <div className="pl-4">
                                        <p className="font-medium text-base-content/70">Mean Daily Return</p>
                                        <div
                                            className="mt-4 flex items-center gap-2 text-center w-full place-items-center">
                                            <h5 className="inline text-lg font-semibold">{`${(mean * 100).toFixed(2)}%`}</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*<h2 className="card-title text-gray-400 text-sm">Total Count</h2>

                            <h1 className="font-normal text-sm">{dailyStats.initialDescriptive.count} Trading Days</h1>
                                <h1 className="font-normal text-sm">{dailyStats.initialDescriptive.count} Mean Return</h1>*/}
                        </div>
                    </div>

                    <div className="card bg-base-100 h-fit w-full rounded">
                        <div className="card-body sm:p-0 md:p-4 gap-2 border-gray-300 border">
                            <div className="flex items-start justify-between gap-2 text-sm">
                                <p className="font-medium text-base-content/70">Average Daily True Range (Rolling)</p>
                            </div>
                            <div className="grid grid-cols-4 pt-2 gap-1 divide-x divide-base-content/10">
                                <div className="text-center">
                                    <p className="font-medium text-base-content/70">5 Day</p>
                                    <p className="mt-1 text-lg font-semibold">{`${statsPageData.atrStats.fiveDay.toFixed(2)}%`}</p>
                                </div>

                                <div className="text-center">
                                    <p className="font-medium text-base-content/70">20 Day</p>
                                    <p className="mt-1 text-lg font-semibold">{`${statsPageData.atrStats.twentyDay.toFixed(2)}%`}</p>
                                </div>

                                <div className="text-center">
                                    <p className="font-medium text-base-content/70">120 Day</p>
                                    <p className="mt-1 text-lg font-semibold">{`${statsPageData.atrStats.sixtyDay.toFixed(2)}%`}</p>
                                </div>

                                <div className="text-center">
                                    <p className="font-medium text-base-content/70">240 Day</p>
                                    <p className="mt-1 text-lg font-semibold">{`${statsPageData.atrStats.hundredTwentyDay.toFixed(2)}%`}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card bg-base-100 h-full w-full rounded">
                        <div className="card-body sm:p-0 md:p-4 gap-2 border-gray-300 border">
                            <div className="flex items-start justify-between gap-2 text-sm">
                                <p className="font-medium text-base-content/70">Daily Standard Deviation</p>
                            </div>
                            <div className="grid grid-cols-4 pt-2 gap-1 divide-x divide-base-content/10">
                                <div className="text-center">
                                    <p className="font-medium text-base-content/70">&nbsp;</p>
                                    <p className="mt-1 font-medium text-base-content/70">Upper</p>
                                    <p className="mt-2 font-medium text-base-content/70">Lower</p>
                                </div>

                                <div className="text-center">
                                    <p className="font-medium text-base-content/70">1 SD</p>
                                    <p className="mt-1 text-lg font-semibold">{`${stdDevUpper[0]}%`}</p>
                                    <p className="mt-1 text-lg font-semibold">{`${stdDevLower[0]}%`}</p>
                                </div>

                                <div className="text-center">
                                    <p className="font-medium text-base-content/70">2 SD</p>
                                    <p className="mt-1 text-lg font-semibold">{`${stdDevUpper[1]}%`}</p>
                                    <p className="mt-1 text-lg font-semibold">{`${stdDevLower[1]}%`}</p>
                                </div>

                                <div className="text-center">
                                    <p className="font-medium text-base-content/70">3 SD</p>
                                    <p className="mt-1 text-lg font-semibold">{`${stdDevUpper[2]}%`}</p>
                                    <p className="mt-1 text-lg font-semibold">{`${stdDevLower[2]}%`}</p>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid lg:grid-cols-8 lg:gap-4 sm:gap-2 sm:grid-cols-1 gap-4 mt-4">
                <div className="card rounded bg-base-100 md:col-span-3 sm:col-span-1">
                    <div className="card-body border-gray-300 border p-4">
                        <HistogramChart
                            histogramChartOptions={histogramChartOptions}
                        />
                    </div>
                </div>
                <div className="card rounded bg-base-100 text-center md:col-span-2 sm:col-span-1">
                    <div className="card-body p-4 border-gray-300 border w-full">
                        <h2 className="font-semibold">Frequency Table</h2>
                        <hr/>

                            <FreqTable
                                histogramData={statsPageData.histTable}
                            />

                    </div>
                </div>


                <div className="card rounded bg-base-100 md:col-span-3 sm:col-span-1">
                    <div className="card-body border-gray-300 border p-2">
                        <div className="text-center">
                            <h2 className="font-semibold">News</h2>
                        </div>
                        <hr/>
                        <NewsTable
                            newsData={newsData}
                        />
                    </div>
                </div>
            </div>

        </div>
    )
}