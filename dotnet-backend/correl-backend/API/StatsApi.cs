using correl_backend.Calculations;

namespace correl_backend.API;

public class StatsApi
{
    public static void Map(WebApplication app)
    {
        app.MapGet("/api/stats/atr/{ticker}", async (string ticker) =>
        {
            try
            {
                var tickerData = await YTickerDataService.GetPriceHistory(ticker);
                var ret = AvgTrueRangeCalculator.CalcAtrStats(tickerData);
                return Results.Ok(ret);
            }
            catch (Exception ex)
            {
                return Results.StatusCode(500);
            }
        });
        
        app.MapGet("/api/stats/histogram/{ticker}", async (string ticker) =>
        {
            try
            {
                var tickerData = await YTickerDataService.GetPriceHistory(ticker);
                PctReturns pctRet = PercentageReturnCalculator.CalculatePercentageReturns(tickerData);
                var ret = new HistogramCalculator().CalculateHistTable(pctRet);
                return Results.Ok(ret);
            }
            catch (Exception ex)
            {
                return Results.StatusCode(500);
            }
        });
        
        app.MapGet("/api/stats/stddev/{ticker}", async (string ticker) =>
        {
            try
            {
                var tickerData = await YTickerDataService.GetPriceHistory(ticker);
                PctReturns pctRet = PercentageReturnCalculator.CalculatePercentageReturns(tickerData);
                var ret = StdDevCalculator.CalcStdDev(pctRet);
                return Results.Ok(ret);
            }
            catch (Exception ex)
            {
                return Results.StatusCode(500);
            }
        });
    }
}