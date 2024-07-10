using correl_backend.Context;
using correl_backend.API;
using correl_backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;

namespace Tests;

public class FilterClosePriceServiceTests
{
    
    [Fact]
    public async void TestYahooServiceHistoricalCloseContainsData()
    {
        var cache = new MemoryCache(new MemoryCacheOptions());
        var yFinance = new FilterClosePriceService(cache);

        var priceHistory = await YTickerDataService.GetPriceHistory("^GSPC");
        var ret = await yFinance.GetHistoricalClose("^GSPC",priceHistory);
        Assert.True(ret.Count > 0);
    }
    
}