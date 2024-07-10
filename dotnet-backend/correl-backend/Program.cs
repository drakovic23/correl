using correl_backend.API;
using correl_backend.Context;
using correl_backend.Models;
using correl_backend.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors();
builder.Services.AddMemoryCache();
builder.Services.AddDbContext<MyDbContext>();
builder.Services.AddScoped<YieldCurveService>();
builder.Services.AddScoped<IndicatorService>();
builder.Services.AddScoped<FilterClosePriceService>();
builder.Services.AddScoped<StatsPageDataService>();
builder.Services.AddHttpClient();

var app = builder.Build();
app.UseCors(builder => builder.AllowAnyOrigin());

BondYieldsApi.Map(app);
HistoricalDataApi.Map(app);
IndicatorsApi.Map(app);
StatsApi.Map(app);
StatsPageApi.Map(app);

app.Urls.Add("http://0.0.0.0:80");
app.Run();
