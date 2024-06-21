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
export async function getGeneralStats(ticker)
{
    const res = await fetch(`${process.env.API_STATS_URL}/stats/general/${ticker}`, {cache: 'no-store'});

    if(!res.ok)
    {
        throw new Error('Failed to fetch general stats')
    }

    //console.log(res.json());
    return await res.json();
}

export async function getTickerData(ticker)
{
    const res = await fetch(`${process.env.API_URL}/api/ticker/historical/${ticker}`, {cache: "no-store"})

    if(!res.ok)
    {
        throw new Error('Failed to fetch historical data')
    }
    //console.log("Fetched historical ticker data")
    return await res.json();
}