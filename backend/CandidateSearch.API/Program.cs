using CandidateSearch.API.Extensions;
using CandidateSearch.API.Handlers;
using CandidateSearch.Services.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddDatabase(builder.Configuration)
    .AddApplicationServices()
    .AddJwtAuthentication(builder.Configuration)
    .AddCorsPolicy(builder.Configuration);

builder.Services.AddControllers();
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddOpenApi();

var app = builder.Build();

app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/openapi/v1.json", "Candidate Search API v1");
        c.RoutePrefix = "swagger";
    });
    app.MapGet("/", () => Results.Redirect("/swagger"));
    await app.InitialiseDatabaseAsync();
}

app.UseHttpsRedirection();
app.UseCors(ApiServiceExtensions.CorsPolicyName);
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();