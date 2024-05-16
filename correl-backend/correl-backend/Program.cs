using correl_backend.API;
using correl_backend.Context;
using correl_backend.Models;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors();
builder.Services.AddMemoryCache();
builder.Services.AddDbContext<MyDbContext>();
builder.Services.AddScoped<YieldCurveService>();
builder.Services.AddScoped<IndicatorService>();

var app = builder.Build();
app.UseCors(builder => builder.AllowAnyOrigin());

EndPoints.Map(app); //maps endpoints in EndPoints class
EndPoints.MapYieldCurveService(app);
app.Run();