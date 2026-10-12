using CandidateSearch.API.Extensions;
using CandidateSearch.API.Handlers;
using CandidateSearch.Services.Extensions;

var builder = WebApplication.CreateBuilder(args);

// ---------- Services (dependency injection container) ----------
builder.Services
    .AddDatabase(builder.Configuration)
    .AddApplicationServices()
    .AddJwtAuthentication(builder.Configuration)
    .AddCorsPolicy(builder.Configuration);

builder.Services.AddControllers();
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddOpenApi();

// ---------- Middleware pipeline (order matters) ----------
var app = builder.Build();

app.UseExceptionHandler();                       // must be first, so it catches everything below

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    await app.InitialiseDatabaseAsync();
}

app.UseHttpsRedirection();
app.UseCors(ApiServiceExtensions.CorsPolicyName);
app.UseAuthentication();                         // WHO are you?  (reads the token)
app.UseAuthorization();                          // ARE YOU ALLOWED? ([Authorize])
app.MapControllers();

app.Run();