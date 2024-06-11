export async function getGeneralStats(ticker)
{
    const res = await fetch(`${process.env.API_URL}/api/stats/general/${ticker}`, {cache: 'no-store'})

    if(!res.ok)
    {
        throw new Error('Failed to fetch data')
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