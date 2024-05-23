export async function getGeneralStats(ticker)
{
    const res = await fetch(`${process.env.API_URL}/api/stats/general/${ticker}`, {cache: 'no-store'})

    if(!res.ok) {
        throw new Error('Failed to fetch data')
    }

    return await res.json();
}

export async function getTickerData(ticker)
{
    const res = await fetch(`${process.env.API_URL}/api/ticker/historical/${ticker}`, {cache: "default"})

    if(!res.ok)
    {
        throw new Error('Failed to fetch historical data')
    }

    return await res.json();
}