using correl_backend.Calculations;
using Tests.Helpers;
using YahooQuotesApi;

namespace Tests;

public class AverageTrueRangeStatsTest
{
    [Fact]
    public void AtrStatsTest()
    {
        PriceTick[] priceHistory = TickHistoryGenerator.GeneratePriceHistoryFromCsv();
        var atr = AvgTrueRangeCalculator.CalcAtrStats(priceHistory);
        double tolerance = 0.1;
        
        Assert.Equal(2.82,atr.FiveDay,tolerance);
        Assert.Equal(3.42,atr.TwentyDay,tolerance);
        Assert.Equal(3.07,atr.SixtyDay,tolerance);
        Assert.Equal(3.09,atr.HundredTwentyDay,tolerance);
    }
}