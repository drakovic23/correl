using Azure;
using correl_backend.Models;
using Microsoft.AspNetCore.Mvc;
using NodaTime;
using YahooQuotesApi;

namespace correl_backend.API;

public class EndPoints
{
    public static void Map(WebApplication app)
    {
        app.MapGet("/api/indicators/{id}", async (IndicatorService indicatorService, int id) =>
        {
            // Adjusted to call the correct method signature
            return await GetIndicatorValues(indicatorService, id);
        });
        
        app.MapGet("/api/indicators", async (IndicatorService indicatorService) =>
        {
            return await GetIndicators(indicatorService);
        });
        
        //Should remove this as it was really for testing
        app.MapGet("/api/initialstats", async (GeneralStatsService generalStatsService) =>
        {
            //Console.WriteLine("Received call to /api/initialstats");
            return await GetInitialStatsData(generalStatsService);
        });

        app.MapGet("/api/yield-curve/{month}", async (string ticker, DateOnly month) =>
        {
            return;
        });

        app.MapGet("/api/ticker/historical/{ticker}", async (YahooFinanceService yahooFinanceService, string ticker) =>
        {
            return await yahooFinanceService.GetHistoricalClose(ticker);
        });
        
        app.MapGet("/api/stats/general/{ticker}", async (GeneralStatsService generalStatsService, string ticker) =>
        {
            //Console.WriteLine("Calling GetGeneralStats for " + ticker);
            return await generalStatsService.GetGeneralStats(ticker);
        });
    }

    private static async Task<IResult> GetTickerData(YahooFinanceService yahooFinanceService, string ticker)
    {
        try
        {
            var tickerData = await yahooFinanceService.GetHistoricalClose(ticker);
            return Results.Ok(tickerData);
        }
        catch (Exception ex)
        {
            return Results.Problem(ex.Message);
        }
    }
    
    private static async Task<IResult> GetInitialStatsData(GeneralStatsService generalStatsService)
    {
        try
        {
            var initalStats = generalStatsService.GetInitialStats();
            return Results.Ok(initalStats);
        }
        catch (Exception ex)
        {
            return Results.Problem(ex.Message);
        }
    }
    private static async Task<IResult> GetIndicators(IndicatorService indicatorService)
    {
        try
        {
            var indicators = indicatorService.GetIndicatorNames();
            return Results.Ok(indicators);
        }
        catch (Exception ex)
        {
            return Results.Problem(ex.Message);
        }
    }
    private static async Task<IResult> GetIndicatorValues(IndicatorService indicatorService, int id)
    {
        try
        {
            var indicators = indicatorService.GetIndicator(id);
            return Results.Ok(indicators);
        }
        catch (Exception ex)
        {
            return Results.Problem(ex.Message);
        }
    }

    public static void MapYieldCurveService(WebApplication app)
    {
        //Console.WriteLine("received call to /api/yield-curve");
        app.MapGet("/api/yield-curve", GetYieldCurveSummary);
    }
    
    private static async Task<IResult> GetYieldCurveSummary(YieldCurveService yieldCurveService)
    {
        try
        {
            var bondRatesSummary = yieldCurveService.GetYieldCurveSummary();
            return Results.Ok(bondRatesSummary);
        }
        catch (Exception ex)
        {
            return Results.Problem(ex.Message);
        }
    }
}