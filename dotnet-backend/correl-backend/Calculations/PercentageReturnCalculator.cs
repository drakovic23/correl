using YahooQuotesApi;

namespace correl_backend.Calculations;

public record PctReturns
{
    public List<double> Returns = new();
    public double MeanReturn { get; set; }
}

public class PercentageReturnCalculator
{
    
    //Calculates the % return for each element in the given priceHistory
    public static PctReturns CalculatePercentageReturns(PriceTick[] priceHistory)
    {
        if (priceHistory.Length < 1)
            throw new ArgumentException("Not enough data in priceHistory[] to calculate % returns");

        PctReturns ret = new();
        //List<double> gains = new();
        double sum = 0;
        for (int i = 1; i < priceHistory.Length; i++) //Start at 1, since there's nothing to compare to at index 0
        {
            double calculatedGain = (priceHistory[i].Close - priceHistory[i - 1].Close) / priceHistory[i - 1].Close;
            calculatedGain = Math.Round(calculatedGain, 4, MidpointRounding.AwayFromZero);
            sum += calculatedGain;
            ret.Returns.Add(calculatedGain);
        }

        ret.MeanReturn = Math.Round(sum / priceHistory.Length,4,MidpointRounding.AwayFromZero);

        return ret;
    }
}