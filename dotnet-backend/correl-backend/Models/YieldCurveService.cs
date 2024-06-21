using correl_backend.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace correl_backend.Models;
public class YieldCurveSummary
{
    public int Year { get; set; }
    public int Month { get; set; }
    public int? TypeId { get; set; }
    public DateOnly ClosestDayToEndOfMonth { get; set; }
    public decimal? LastBondYield { get; set; }
}

public class YieldCurveService
{
    private readonly MyDbContext _context;
    private readonly IMemoryCache _cache;

    public YieldCurveService(MyDbContext context, IMemoryCache cache)
    {
        _context = context;
        _cache = cache;
    }

    public async Task<List<YieldCurveSummary>> GetYieldCurveSummary()
    {
        var cacheKey = "YieldCurveSummary";
        
        if (!_cache.TryGetValue(cacheKey, out Task<List<YieldCurveSummary>> bondRatesByMonth))
        {
            bondRatesByMonth = _context.BondRates
                .Where(br => br.ConstantDate >= DateOnly.FromDateTime(new DateTime(1985,1,1,0,0,0)))
                .AsNoTracking()
                .GroupBy(br => new
                {
                    Year = br.ConstantDate.Year,
                    Month = br.ConstantDate.Month,
                    br.TypeId
                })
                .Select(g => new YieldCurveSummary
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    TypeId = g.Key.TypeId,
                    ClosestDayToEndOfMonth = g.Max(x => x.ConstantDate),
                    LastBondYield = g.Max(x => x.BondYield ?? 0) // Handle nullable BondYield
                })
                .OrderByDescending(x => x.ClosestDayToEndOfMonth)
                .ThenBy(x => x.TypeId)
                .ToListAsync();
                
            
                // Set cache options
                var cacheEntryOptions = new MemoryCacheEntryOptions()
                    .SetSlidingExpiration(TimeSpan.FromHours(4))
                    .SetAbsoluteExpiration(TimeSpan.FromHours(24));

                // Save data in cache
                await _cache.Set(cacheKey, bondRatesByMonth, cacheEntryOptions);
        }

        return await bondRatesByMonth;
    }
}

