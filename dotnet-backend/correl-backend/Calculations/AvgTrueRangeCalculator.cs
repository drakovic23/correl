using System.Runtime.InteropServices;
using YahooQuotesApi;

namespace correl_backend.Calculations;
public record AtrPercentageStats //Stores ATR stats
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
        List<double> trueRangeList = new();
        
        Span<PriceTick> priceHistorySpan = priceHistory.AsSpan();
        for (int i = priceHistorySpan.Length - 1; i > 0; i--)
        {
            double tr = Math.Max(priceHistorySpan[i].High - priceHistorySpan[i].Low,
                Math.Max(Math.Abs(priceHistorySpan[i].High - priceHistorySpan[i - 1].Close), 
                    Math.Abs(priceHistorySpan[i].Low - priceHistorySpan[i - 1].Close)));

            double trPercentage = tr / priceHistorySpan[i].Close;
            
            
            trueRangeList.Add(trPercentage); //The true range is stored in the List<> from most recent to oldest
        }
        
        double sum = 0;
        var trueRangeListSpan = CollectionsMarshal.AsSpan(trueRangeList);
        for(int i = 0; i < trueRangeListSpan.Length && i < 120; i++)
        {
            sum += trueRangeListSpan[i];
            int currentCount = i + 1;
            switch (i)
            {
                case 4:
                    atrStats.FiveDay = Math.Round((sum / currentCount ) * 100,2,MidpointRounding.AwayFromZero);
                    break;
                case 19:
                    atrStats.TwentyDay = Math.Round((sum / currentCount ) * 100,2,MidpointRounding.AwayFromZero);
                    break;
                case 59:
                    atrStats.SixtyDay = Math.Round((sum / currentCount ) * 100,2,MidpointRounding.AwayFromZero);
                    break;
                case 119:
                    atrStats.HundredTwentyDay = Math.Round((sum / currentCount ) * 100,2,MidpointRounding.AwayFromZero);
                    break;
            }
        }

        return atrStats;
    }
}