using System.Globalization;
using correl_backend.Calculations;
using Tests.Helpers;
using Xunit.Abstractions;
using YahooQuotesApi;

namespace Tests;

public class PctReturnsTest
{
    
    [Fact]
    public void PctReturnCalcTest()
    {
        PriceTick[] history = TickHistoryGenerator.GeneratePriceHistoryFromCsv();
        PctReturns returns = PercentageReturnCalculator.CalculatePercentageReturns(history);
        
        Assert.True(returns.ReturnsList.Count > 0);
        Assert.Equal(0.131868,returns.ReturnsList[0],4);
        Assert.Equal(0.009709,returns.ReturnsList[1],4);
        
    }
    
    [Fact]
    public void PctReturnMeanCalcTest()
    {
        PriceTick[] history = TickHistoryGenerator.GeneratePriceHistoryFromCsv();
        PctReturns returns = PercentageReturnCalculator.CalculatePercentageReturns(history);
        
        Assert.Equal(0.00012,returns.MeanReturn,2);
    }
}