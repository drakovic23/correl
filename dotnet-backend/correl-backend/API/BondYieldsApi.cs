using correl_backend.Models;

namespace correl_backend.API;

public class BondYieldsApi
{
    public static void Map(WebApplication app)
    {
        app.MapGet("/api/yield-curve", async (YieldCurveService yieldCurveService) =>
        {
            try
            {
                var ret = await yieldCurveService.GetYieldCurveSummary();
                return Results.Ok(ret);
            }
            catch (Exception ex)
            {
                return Results.StatusCode(500);
            }
        });
    }
}