namespace correl_backend.API;

public class HistoricalDataApi
{
    public static void Map(WebApplication app)
    {
        app.MapGet("/api/ticker/historical/{ticker}", async (FilterClosePriceService filterClosePriceService, string ticker) =>
        {
            try
            {
                var tickerData = await YTickerDataService.GetPriceHistory(ticker);
                var ret =  filterClosePriceService.GetHistoricalClose(ticker,tickerData);
                return Results.Ok(ret);
            }
            catch (Exception ex)
            {
                return Results.StatusCode(500);
            }
        });
    }
}