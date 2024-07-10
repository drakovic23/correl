using correl_backend.Models;

namespace correl_backend.API;

public class IndicatorsApi
{
    public static void Map(WebApplication app)
    {
        app.MapGet("/api/indicators/{id}", async (IndicatorService indicatorService, int id) =>
        {
            try
            {
                var ret = await indicatorService.GetIndicator(id);
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
                var ret = await indicatorService.GetIndicatorNames();
                return Results.Ok(ret);
            }
            catch (Exception ex)
            {
                return Results.StatusCode(500);
            }
        });
    }
}