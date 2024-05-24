using correl_backend.API;
using correl_backend.Context;
using correl_backend.Models;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors();
builder.Services.AddMemoryCache();
builder.Services.AddDbContext<MyDbContext>();
builder.Services.AddScoped<YieldCurveService>();
builder.Services.AddScoped<IndicatorService>();
builder.Services.AddScoped<YahooFinanceService>();
builder.Services.AddHttpClient();
builder.Services.AddTransient<ExternalApiService>(); // this specifies that a new instance is created each time!
builder.Services.AddScoped<GeneralStatsService>();

var app = builder.Build();
app.UseCors(builder => builder.AllowAnyOrigin());

EndPoints.Map(app); //maps endpoints in EndPoints class
EndPoints.MapYieldCurveService(app);

app.Urls.Add("http://0.0.0.0:80");
//app.Urls.Add("https://*:443");
app.Run();