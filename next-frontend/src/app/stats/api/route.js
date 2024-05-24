export async function GET (req)
{
    const { searchParams } = new URL(req.url) // Retrieve the search term from the URL query parameter
    //console.log(searchParams);
   // const filteredIndicators = allIndicators.filter((indicator) =>
    //    indicator.eventName.toLowerCase().includes(searchParams.get("query").toLowerCase())
    //);
    const ticker = searchParams.get("query").toLowerCase();

    const data = await fetch(`${process.env.API_URL}/api/stats/general/${ticker}`)

    const resp = await data.json();

    return Response.json(resp);
}