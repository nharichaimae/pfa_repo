using pfa__.net.Repositories;
using Microsoft.EntityFrameworkCore;
using pfa__.net.Data;
using pfa__.net.Helpers;

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
builder.Services.AddScoped<IConditionRepository, ConditionRepository>();  // ← AJOUTÉ
builder.Services.AddScoped<IRegleRepository, RegleRepository>();           // ← AJOUTÉ

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