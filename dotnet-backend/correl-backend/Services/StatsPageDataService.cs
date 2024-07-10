using correl_backend.API;
using correl_backend.Calculations;
using Microsoft.Extensions.Caching.Memory;

namespace correl_backend.Services;

public sealed record HomePageData
{
    public int TotalTradingDays { get; set; }
    public double PctReturnMean { get; set; }
    public double StdDev { get; set; }
    public AtrPercentageStats? AtrStats { get; set; }
    public List<HistogramPoint>? HistTable { get; set; }
    public List<CloseHistory>? CloseHistories { get; set; }

}
public class StatsPageDataService //We will use this to construct the data for the /stats page
{
    private readonly IMemoryCache _cache;
    
    public StatsPageDataService(IMemoryCache cache)
    {
        _cache = cache;
    }
    public async Task<HomePageData> GetHomePageData(string ticker)
    {
        HomePageData homePageData = new();
        
        var tickerData = await YTickerDataService.GetPriceHistory(ticker);
        var pctGains = PercentageReturnCalculator.CalculatePercentageReturns(tickerData);
        FilterClosePriceService filterClosePriceService = new(_cache);
        
        homePageData.CloseHistories = await filterClosePriceService.GetHistoricalClose(ticker, tickerData);
        homePageData.TotalTradingDays = tickerData.Length;
        homePageData.PctReturnMean = pctGains.MeanReturn;
        
        var tasks = new[]
        {
            Task.Run(() =>
            {
                homePageData.HistTable = new HistogramCalculator().CalculateHistTable(pctGains);
            }),
            Task.Run(() =>
            {
                homePageData.AtrStats = AvgTrueRangeCalculator.CalcAtrStats(tickerData);
            }),
            Task.Run(() =>
            {
                homePageData.StdDev = StdDevCalculator.CalcStdDev(pctGains);
            })

        };

        Task.WaitAll(tasks);

        return homePageData;
    }
    
}