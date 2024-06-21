using Microsoft.Extensions.Caching.Memory;
using NodaTime;
using YahooQuotesApi;

namespace correl_backend.API;

public class CloseHistory()
{
    public DateOnly Date { get; set; }
    public double Close {get; set;}
    

    public CloseHistory(DateOnly date, double close) : this()
    {
        this.Close = close;
        this.Date = date;
    }
}

public class YahooFinanceService
{
    private readonly IMemoryCache _cache;

    public YahooFinanceService(IMemoryCache cache)
    {
        _cache = cache;
    }
    public async Task<List<CloseHistory>> GetHistoricalClose(string ticker)
    {
        var cacheKey = ticker;
        if(!_cache.TryGetValue(ticker, out List<CloseHistory> ret))
        {
            YahooQuotes yahooQuotes = new YahooQuotesBuilder()
                .WithHistoryStartDate(Instant.FromUtc(1920, 1, 1, 0, 0, 0))
                .WithPriceHistoryFrequency(Frequency.Daily)
                .Build();

            Security security = await yahooQuotes.GetAsync(ticker, Histories.PriceHistory)
                                ?? throw new ArgumentException("Symbol not found");

            PriceTick[] priceHistory = security.PriceHistory.Value;
            //We can strip all data here if needed for performance and instead only return close
            //Console.WriteLine(priceHistory[0].Close);
            ret = new List<CloseHistory>();
            foreach (var t in priceHistory)
            {
                ret.Add(new CloseHistory(t.Date.ToDateOnly(), t.Close));
            }
            
            
            //Set cache options
            var cacheOptions = new MemoryCacheEntryOptions()
                .SetSlidingExpiration(TimeSpan.FromHours(1))
                .SetAbsoluteExpiration(TimeSpan.FromHours(2));

            _cache.Set(cacheKey, ret, cacheOptions);
        }

            
        return ret;
    }
}