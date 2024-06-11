using System.Net;
using Azure;
using correl_backend.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using NodaTime;
using YahooQuotesApi;

namespace correl_backend.API;

public class EndPoints
{
    //TODO: Log exceptions
    //TODO: Handle specific SQL Exception
    //TODO: Implement using in db context to allow async calls to DB
    public static void Map(WebApplication app)
    {
        app.MapGet("/api/indicators/{id}", async (IndicatorService indicatorService, int id) =>
        {
            try
            {
                var ret = indicatorService.GetIndicator(id);
                return Results.Ok(ret);
            }
            catch (Exception ex)
            {
                return Results.StatusCode(500);
            }
        });
        
        app.MapGet("/api/indicators", async (IndicatorService indicatorService) =>
        {
            try
            {
                var ret = indicatorService.GetIndicatorNames();
                return Results.Ok(ret);
            }
            catch (Exception ex)
            {
                return Results.StatusCode(500);
            }
        });

        app.MapGet("/api/yield-curve/{month}", async (string ticker, DateOnly month) =>
        {
            //Not implemented
            return;
        });
        
        app.MapGet("/api/yield-curve", async (YieldCurveService yieldCurveService) =>
        {
            try
            {
                var ret = yieldCurveService.GetYieldCurveSummary();
                return Results.Ok(ret);
            }
            catch (Exception ex)
            {
                return Results.StatusCode(500);
            }
        });

        app.MapGet("/api/ticker/historical/{ticker}", async (YahooFinanceService yahooFinanceService, string ticker) =>
        {
            try
            {
                var ret = await yahooFinanceService.GetHistoricalClose(ticker);
                return Results.Ok(ret);
            }
            catch (Exception ex)
            {
                return Results.StatusCode(500);
            }
        });
        
        app.MapGet("/api/stats/general/{ticker}", async (GeneralStatsService generalStatsService, string ticker) =>
        {
            //return await generalStatsService.GetGeneralStats(ticker);
            try
            {
                var ret = await generalStatsService.GetGeneralStats(ticker);
                return Results.Ok(ret);
            }
            catch (HttpRequestException ex)
            {
                return Results.BadRequest();
            }
            catch (Exception ex)
            {
                return Results.StatusCode(500);
            }
        });
    }
}