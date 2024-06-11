using correl_backend.API;
using correl_backend.Context;
using Microsoft.Extensions.Caching.Memory;

namespace correl_backend.Models;

public class GeneralStats
{
    public List<GeneralStat> InitialGeneralStats { get; set; } = new();
    public List<Histogram> InitialHistogram { get; set; } = new();
    public DescriptiveStat InitialDescriptive { get; set; } = new();
    

}

public class GeneralStatsService
{
    private readonly MyDbContext _context;
    private readonly IMemoryCache _cache;
    private readonly ExternalApiService _externalApiService;
    
    public GeneralStatsService (MyDbContext context, IMemoryCache cache, ExternalApiService externalApiService)
    {
        _context = context;
        _cache = cache;
        _externalApiService = externalApiService;
    }

    public GeneralStats GetInitialStats() //This was used for the initial stats on load but can now be removed
    {
        var cacheKey = "SPXInitialStats";
        int tickerId = 1;
        if (!_cache.TryGetValue(cacheKey, out GeneralStats? initialStats))
        {
            initialStats = new GeneralStats();
            initialStats.InitialDescriptive = _context.DescriptiveStats
                .FirstOrDefault(i => i.TickerId == tickerId) ?? throw new InvalidOperationException();
            
            initialStats.InitialGeneralStats = _context.GeneralStats
                .Where((g) => g.TickerId == tickerId && g.IndicatorId != null)
                .ToList();
            
            initialStats.InitialHistogram = _context.Histograms
                .Where((h) => h.TickerId == tickerId).OrderBy((h) => h.Bins)
                .ToList();

            var cacheOptions = new MemoryCacheEntryOptions()
                .SetSlidingExpiration(TimeSpan.FromHours(4))
                .SetAbsoluteExpiration(TimeSpan.FromHours((24)));

            _cache.Set(cacheKey, initialStats, cacheOptions);
        }

        return initialStats ?? new GeneralStats();
    }

    public async Task<GeneralStats> GetGeneralStats(string ticker)
    {   
        var cacheKey = ticker + "_GeneralStats";
        
        //Possibly just query the db initially instead idk
        if (!_cache.TryGetValue(cacheKey, out GeneralStats? generalStats))
        {
            //If it's not cached we need new calculations
            var resp = await _externalApiService.GetExternalApiStatusAsync("https://correl-fl.azurewebsites.net/stats/general/" + ticker);
            if (resp.IsSuccessStatusCode)
            {
                int id = await resp.Content.ReadFromJsonAsync<int>();
                
                //Query DB and create our return
                //Console.WriteLine("Ticker Id is: " + id);

                generalStats = new GeneralStats();
                generalStats.InitialGeneralStats = _context.GeneralStats
                    .Where((g) => g.TickerId == id)
                    .ToList();

                generalStats.InitialDescriptive = _context.DescriptiveStats
                    .FirstOrDefault((g) => g.TickerId == id) ?? new DescriptiveStat();

                generalStats.InitialHistogram = _context.Histograms
                    .Where((h) => h.TickerId == id)
                    .ToList();
            }
            else
            {
                throw new HttpRequestException("Symbol doesn't exist");
            }
            
            
            var cacheOptions = new MemoryCacheEntryOptions()
                .SetSlidingExpiration(TimeSpan.FromHours(4))
                .SetAbsoluteExpiration(TimeSpan.FromHours((8)));

            _cache.Set(cacheKey, generalStats, cacheOptions);
        }

        return generalStats ?? new GeneralStats();
    }
}