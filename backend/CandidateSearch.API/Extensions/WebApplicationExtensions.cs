using CandidateSearch.Data;
using CandidateSearch.Data.Seed;
using Microsoft.EntityFrameworkCore;

namespace CandidateSearch.API.Extensions
{
    public static class WebApplicationExtensions
    {
        /// <summary>Development convenience: applies pending migrations and seeds demo data.</summary>
        public static async Task InitialiseDatabaseAsync(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<CandidateSearchDbContext>();

            await db.Database.MigrateAsync();
            await DbSeeder.SeedAsync(db);
        }
    }
}
