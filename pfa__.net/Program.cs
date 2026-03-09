using Microsoft.EntityFrameworkCore;
using pfa__.net.Data;
using pfa__.net.Helpers;
using pfa__.net.Repositories;
using pfa__.net.Services;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
           .EnableDetailedErrors()
           .EnableSensitiveDataLogging());

// ✅ Repositories
builder.Services.AddScoped<IPieceRepository, PieceRepository>();
builder.Services.AddScoped<IEquipementRepository, EquipementRepository>();
builder.Services.AddScoped<IConditionRepository, ConditionRepository>();  
builder.Services.AddScoped<IRegleRepository, RegleRepository>();           
builder.Services.AddScoped<SpeechService>();

// Controllers
builder.Services.AddControllers();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("AllowAngular");
app.UseExceptionHandler("/error");
app.UseMiddleware<JwtMiddleware>();
app.MapControllers();

app.Run();