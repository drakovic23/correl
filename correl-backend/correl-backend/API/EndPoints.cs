using Azure;
using correl_backend.Models;
using Microsoft.AspNetCore.Mvc;
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
        Console.WriteLine("received call to /api/yield-curve");
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