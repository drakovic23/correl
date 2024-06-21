using correl_backend.Context;
using correl_backend.API;
using correl_backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;

namespace Tests;

public class YahooServiceTests
{
    
    [Fact]
    public async void TestYahooServiceHistoricalCloseContainsData()
    {
        var cache = new MemoryCache(new MemoryCacheOptions());
        var yFinance = new YahooFinanceService(cache);
        
        var ret = await yFinance.GetHistoricalClose("^GSPC");
        Assert.True(ret.Count > 0);
    }
    
    [Fact]
    public async void TestYahooServiceHistoricalCloseReturnsOnBadSymbol()
    {
        var cache = new MemoryCache(new MemoryCacheOptions());
        var yFinance = new YahooFinanceService(cache);

        await Assert.ThrowsAsync<ArgumentException>(() =>  yFinance.GetHistoricalClose("notarealsymbol"));
    }
    
}