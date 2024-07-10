using YahooQuotesApi;

namespace correl_backend.Calculations;
public sealed record AtrPercentageStats //Stores ATR stats
{
    public double FiveDay { get; set; }
    public double TwentyDay { get; set; }
    public double SixtyDay { get; set; }
    public double HundredTwentyDay { get; set; }
}
public static class AvgTrueRangeCalculator
{
    
    public static AtrPercentageStats CalcAtrStats(PriceTick[] priceHistory)
    {
        if (priceHistory.Length < 120)
        {
            throw new ArgumentException("Not enough trading days in priceHistory[] to calculate ATR");
        }
        
        AtrPercentageStats atrStats = new AtrPercentageStats();
        List<double> trueRange = new();
        for (int i = priceHistory.Length - 1; i > 0; i--)
        {
            if (i - 1 > priceHistory.Length)
                throw new IndexOutOfRangeException();
            
            double tr = Math.Max(priceHistory[i].High - priceHistory[i].Low,
                Math.Max(Math.Abs(priceHistory[i].High - priceHistory[i - 1].Close), 
                    priceHistory[i].Low - priceHistory[i - 1].Close));//

            double trPercentage = tr / priceHistory[i].Open;
            
            
            trueRange.Add(trPercentage); //The true range is stored in the List<> from most recent to oldest
        }
        
        double sum = 0;
        for(int i = 0; i < trueRange.Count && i < 120; i++)
        {
            sum += trueRange[i];
            switch (i)
            {
                case 4:
                    atrStats.FiveDay = Math.Round((sum / i ) * 100,2,MidpointRounding.AwayFromZero);
                    break;
                case 19:
                    atrStats.TwentyDay = Math.Round((sum / i ) * 100,2,MidpointRounding.AwayFromZero);
                    break;
                case 59:
                    atrStats.SixtyDay = Math.Round((sum / i ) * 100,2,MidpointRounding.AwayFromZero);
                    break;
                case 119:
                    atrStats.HundredTwentyDay = Math.Round((sum / i ) * 100,2,MidpointRounding.AwayFromZero);
                    break;
            }
        }

        return atrStats;
    }
}