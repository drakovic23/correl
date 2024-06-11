//Remove this
export async function GET (req)
{
    const { searchParams } = new URL(req.url)
    const ticker = searchParams.get("query").toLowerCase();

    const data = await fetch(`${process.env.API_URL}/api/stats/general/${ticker}`)
    const resp = await data.json();



    return Response.json(resp);
}