using correl_backend.Calculations;
using Tests.Helpers;
using YahooQuotesApi;

namespace Tests;

public class HistogramTests
{
    [Fact]
    public void AtrStatsFreqTest()
    {
        PriceTick[] priceHistory = TickHistoryGenerator.GeneratePriceHistoryFromCsv();
        var returns = PercentageReturnCalculator.CalculatePercentageReturns(priceHistory);
        var hist = new HistogramCalculator().CalculateHistTable(returns);
        
        Assert.Equal(1167,hist[0].Frequency);
        Assert.Equal(1274,hist[9].Frequency);
    }
    
    [Fact]
    public void AtrStatsProbabilitiesTest()
    {
        PriceTick[] priceHistory = TickHistoryGenerator.GeneratePriceHistoryFromCsv();
        var returns = PercentageReturnCalculator.CalculatePercentageReturns(priceHistory);
        var hist = new HistogramCalculator().CalculateHistTable(returns);
        double tolerance = 0.001;
        
        Assert.Equal(0.1837,hist[0].Probability,tolerance);
        Assert.Equal(0.0535,hist[1].Probability,tolerance);
        Assert.Equal(0.0595,hist[2].Probability,tolerance);
        Assert.Equal(0.0854,hist[3].Probability,tolerance);
        Assert.Equal(0.0950,hist[4].Probability,tolerance);
        Assert.Equal(0.1067,hist[5].Probability,tolerance);
        Assert.Equal(0.0865,hist[6].Probability,tolerance);
        Assert.Equal(0.0707,hist[7].Probability,tolerance);
        Assert.Equal(0.0582,hist[8].Probability,tolerance);
        Assert.Equal(0.2008,hist[9].Probability,tolerance);
        
        Assert.Equal(1,hist[9].CumulativeProbability);
    }
}