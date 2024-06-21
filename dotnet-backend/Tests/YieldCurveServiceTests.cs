using correl_backend.Context;
using correl_backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Tests;

public class YieldCurveServiceTests
{
    [Fact]
    public async void TestYieldCurveServiceSummaryContainsData()
    {
        var cache = new MemoryCache(new MemoryCacheOptions());
        var optionsBuilder = new DbContextOptionsBuilder<MyDbContext>();
        var context = new MyDbContext(optionsBuilder.Options);

        var yieldCurveService = new YieldCurveService(context,cache);
        var ret = await yieldCurveService.GetYieldCurveSummary();
        
        Assert.True(ret.Count > 0);
    }
}