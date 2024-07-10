using NodaTime;
using YahooQuotesApi;

namespace correl_backend.API;

public static class YTickerDataService
{
    //Returns the PriceTick[] history for a given symbol;
    //The order is from oldest -> newest
    public static async Task<PriceTick[]> GetPriceHistory(string symbol)
    {
        YahooQuotes yahooQuotes = new YahooQuotesBuilder()
            .WithHistoryStartDate(Instant.FromUtc(1920, 1, 1, 0, 0, 0))
            .WithPriceHistoryFrequency(Frequency.Daily)
            .Build();
        
        Security security = await yahooQuotes.GetAsync(symbol, Histories.PriceHistory)
                            ?? throw new ArgumentException("Symbol not found");

        return security.PriceHistory.Value;
    }
}