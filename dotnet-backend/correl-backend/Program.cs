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

var app = builder.Build();
app.UseCors(builder => builder.AllowAnyOrigin());

EndPoints.Map(app); //maps endpoints in EndPoints class

app.Urls.Add("http://0.0.0.0:80");
app.Run();