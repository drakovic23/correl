using correl_backend.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace correl_backend.Models;

public class IndicatorService
{
    private readonly MyDbContext _context;

    public IndicatorService(MyDbContext context)
    {
        _context = context;
    }

    public async Task<List<IndicatorValue>> GetIndicator(int id)
    {
        var ret = await _context.IndicatorValues
            .Where((i) => i.IndicatorId == id)
            .ToListAsync();
        
        return ret;
    }

    public async Task<List<Indicator>> GetIndicatorNames()
    {
        var ret = await _context.Indicators
            .ToListAsync();

        return ret;
    }
}