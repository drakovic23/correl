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
    public async Task<List<CloseHistory>> GetHistoricalClose(string ticker, IEnumerable<PriceTick> priceHistory)
    {
        var cacheKey = ticker;
        if(!_cache.TryGetValue(ticker, out List<CloseHistory> ret))
        {
            ret = new List<CloseHistory>();
            foreach (var t in priceHistory)
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