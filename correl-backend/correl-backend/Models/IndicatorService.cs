using correl_backend.Context;
using Microsoft.Extensions.Caching.Memory;

namespace correl_backend.Models;

public class IndicatorService
{
    private readonly MyDbContext _context;

    public IndicatorService(MyDbContext context)
    {
        _context = context;
    }

    public List<IndicatorValue> GetIndicator(int id)
    {
        var ret = _context.IndicatorValues
            .Where((i) => i.IndicatorId == id)
            .ToList();
        
        return ret;
    }

    public List<Indicator> GetIndicatorNames()
    {
        var ret = _context.Indicators
            .ToList();

        return ret;
    }
}