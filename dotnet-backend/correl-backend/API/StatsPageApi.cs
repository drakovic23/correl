using correl_backend.Services;

namespace correl_backend.API;

public class StatsPageApi
{
    public static void Map(WebApplication app)
    {

        app.MapGet("/api/data/home/{ticker}", async (StatsPageDataService homePageDataService, string ticker) =>
        {
            try
            {
                var ret = await homePageDataService.GetHomePageData(ticker);
                return Results.Ok(ret);
            }
            catch (Exception ex)
            {
                return Results.StatusCode(500);
            }
        });
    
    }
}