//TODO: Add chart for PMI
//TODO: Add chart for FRED rate
//TODO: M2 Money Supply M/M and Y/Y CHG%
import IndicatorSearch from "@/components/IndicatorSearch/IndicatorSearch";

async function getPmi() {
    const res = await fetch('http://localhost:5289/api/indicators/53')

    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }

    return await res.json();
}
async function getConsumerSentiment() {
    const res = await fetch('http://localhost:5289/api/indicators/16')

    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }

    return await res.json();
}
async function getFinalGdp() {
    const res = await fetch('http://localhost:5289/api/indicators/61')

    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }

    return await res.json();
}

async function getIndicatorNames() {
    const res = await fetch('http://localhost:5289/api/indicators/61')

    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }

    return await res.json();
}

function setPmiOptions(data)
{
    const pmiChartOptions = {
        chart: {
            type: 'spline'
        },
        title: {
            text: 'ISM Manufacturing PMI'
        },
        series: [{
            name: 'ISM PMI',
            data: []
        }],
        xAxis: {
            categories: [],
            accessibility: {
                description: 'Date'
            },
        },
        yAxis: {
            plotBands: [
                {
                    value: 50,
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
            ],
            allowDecimals: true,
            title: {
                text: 'PMI'
            },
            labels: {
                format: '{value}'
            }
        },
        tooltip: {
            valueSuffix: ''
        },

    };

    //const clone = pmiChartOptions
    data.reverse().forEach((d) => {
       pmiChartOptions.series[0].data.push(parseFloat(d.actual));
       pmiChartOptions.xAxis.categories.push(d.releaseDate);
    });


    return pmiChartOptions;
}
export default async function Indicators()
{
    //const pmiData = await getPmi();
    //const pmiOptions= setPmiOptions(pmiData);
    //console.log(pmiChartOptions.series[0].data);

    return(
        <div className="container mt-8 mx-auto">
            {/*<label className="input input-bordered flex items-center gap-2">
                <input type="text" className="grow" placeholder="Search" autoComplete="off"/>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                     className="w-4 h-4 opacity-70">
                    <path fillRule="evenodd"
                          d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                          clipRule="evenodd"/>
                </svg>
            </label>*/}
            <div className="grid grid-cols-1 h-full gap-0 mt-8">
                <IndicatorSearch/>
            </div>
            {/*<div className="grid grid-cols-3 h-full gap-2 mt-8">
                <div className="card bg-base-100 rounded">
                    <div className="card-body p-2">
                        <SplineChart
                            chartOptions={pmiOptions}
                        />
                    </div>
                </div>

                <div className="card bg-base-100 rounded">
                    <div className="card-body">
                        <h1>ISM PMI</h1>
                    </div>
                </div>

                <div className="card bg-base-100 rounded">
                    <div className="card-body">
                        <h1>ISM PMI</h1>
                    </div>
                </div>
            </div>*/}

        </div>
    )
}


/*export async function getServerSideProps() {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const posts = await response.json();

    return {
        props: {
            posts,
        },
    };
}*/