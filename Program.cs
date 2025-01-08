using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using pos_system.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Add HttpClient service
builder.Services.AddHttpClient();  // Ensures HttpClient is available for DI

builder.Services.AddDbContext<POSDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("POSConnection"));
});

builder.Services.AddDbContext<IMDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("IMConnection"));
});

// Add session services
builder.Services.AddDistributedMemoryCache(); // For in-memory session storage
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30); // Set session timeout
    options.Cookie.HttpOnly = true; // Secure the cookie
    options.Cookie.IsEssential = true; // Ensure it's essential for GDPR compliance
});

// Enable CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", builder =>
    {
        builder.AllowAnyOrigin()    // Allows any origin
               .AllowAnyHeader()   // Allows any header
               .AllowAnyMethod();  // Allows any HTTP method
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Login/Error");
    app.UseHsts();
}

// Use session middleware
app.UseSession();

// Use CORS middleware
app.UseCors("AllowAllOrigins");

app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Login}/{action=Login}/{id?}")
    .WithStaticAssets();

app.Run();
