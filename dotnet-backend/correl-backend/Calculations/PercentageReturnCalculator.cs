using YahooQuotesApi;

namespace correl_backend.Calculations;

public record PctReturns // Holds a list of % returns
{
    public List<double> ReturnsList = new();
    public double MeanReturn { get; set; }
}

public static class PercentageReturnCalculator
{
    
    //Calculates the % return for each element in the given priceHistory
    public static PctReturns CalculatePercentageReturns(PriceTick[] priceHistory)
    {
        if (priceHistory.Length < 1)
            throw new ArgumentException("Not enough data in priceHistory[] to calculate % returns");

        PctReturns ret = new();
        double sum = 0;
        
        Span<PriceTick> priceHistorySpan = priceHistory.AsSpan();
        for (int i = 1; i < priceHistorySpan.Length; i++) //Start at 1, since there's nothing to compare to at index 0
        {
            double calculatedGain = (priceHistorySpan[i].Close - priceHistorySpan[i - 1].Close) / priceHistorySpan[i - 1].Close;
            calculatedGain = Math.Round(calculatedGain, 4, MidpointRounding.AwayFromZero);
            sum += calculatedGain;
            ret.ReturnsList.Add(calculatedGain);
        }

        ret.MeanReturn = Math.Round(sum / priceHistorySpan.Length,4,MidpointRounding.AwayFromZero);

        return ret;
    }
}