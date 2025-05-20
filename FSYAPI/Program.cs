using TemplateAPI;
using TemplateAPI.Classes;
using System.Data;
using AccountAuthenticator;
using FSYCheckIn.Endpoints;

var builder = WebApplication.CreateBuilder(args);

var connString = builder.Configuration["DOTNET_DATABASE_STRING"] ?? throw new InvalidOperationException("Connection string for database not found.");
Console.WriteLine("Connection String: " + connString);
var dbConnector = new DatabaseConnector(connString);
builder.Services.AddSingleton<IDbConnection>(provider => {
    return dbConnector.ConnectWithRetry();
});

builder.Services.AddSingleton<DBService>();
builder.Services.AddSingleton<AuthService>();
builder.Services.AddSingleton<IIDMiddlewareConfig, IDMiddlewareConfig>();

var app = builder.Build();

app.UseMiddleware<IdentityMiddleware>();

app.UseDefaultFiles();
app.UseStaticFiles();
app.UseRouting();

app.MapGet("/api/health", () => "Hello");

// Add new endpoints here
app.AddAccountEndpoints();

app.MapFallbackToFile("index.html");

app.Run();

public class IDMiddlewareConfig : IIDMiddlewareConfig {
    public List<string> Paths => ["/api/health", "/api/signin"];
    public string? Whitelist => "/api";
    public TimeSpan? ExpirationDate => null;
    public TimeSpan? ReValidationDate => null;
}
