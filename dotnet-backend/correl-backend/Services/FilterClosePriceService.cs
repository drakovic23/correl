using Microsoft.Extensions.Caching.Memory;
using NodaTime;
using YahooQuotesApi;

namespace correl_backend.API;

public sealed class CloseHistory()
{
    public DateOnly Date { get; set; }
    public double Close {get; set;}

    public CloseHistory(DateOnly date, double close) : this()
    {
        this.Close = close;
        this.Date = date;
    }
}

public class FilterClosePriceService
{
    private readonly IMemoryCache _cache;
    
    public FilterClosePriceService(IMemoryCache cache)
    {
        _cache = cache;
    }
    public List<CloseHistory> GetHistoricalClose(string ticker, PriceTick[] priceHistory)
    {
        var cacheKey = ticker + "_closeHistory";
        if(!_cache.TryGetValue(ticker, out List<CloseHistory> ret))
        {
            ret = new List<CloseHistory>();
            Span<PriceTick> priceHistorySpan = priceHistory.AsSpan();
            foreach (var t in priceHistorySpan)
            {
                ret.Add(new CloseHistory(t.Date.ToDateOnly(), t.Close));
            }
            
            //Set cache options
            var cacheOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromHours(4));

            _cache.Set(cacheKey, ret, cacheOptions);
        }

            
        return ret;
    }
}