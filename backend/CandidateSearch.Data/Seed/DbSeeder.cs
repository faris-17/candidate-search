using CandidateSearch.Models.Constants;
using CandidateSearch.Models.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CandidateSearch.Data.Seed
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(CandidateSearchDbContext db, CancellationToken ct = default)
        {
            if (await db.Candidates.AnyAsync(ct)) return;

            string[] firstNames = ["Anjali", "Rahul", "Priya", "Arun", "Meera", "Vishnu", "Sneha", "Kiran", "Divya", "Nikhil", "Fathima", "Joseph"];
            string[] lastNames = ["Nair", "Menon", "Kumar", "Thomas", "Pillai", "Varghese", "Iyer", "Joseph", "Das", "Sharma"];
            string[] locations = ["Kochi", "Trivandrum", "Kozhikode", "Bengaluru", "Chennai", "Hyderabad"];
            string[] genders = ["Male", "Female", "Other"];

            var rnd = new Random(42);
            var now = DateTime.UtcNow;
            var today = DateOnly.FromDateTime(now);

            var passwordHash = BCrypt.Net.BCrypt.HashPassword("Password@123");

            var candidates = Enumerable.Range(1, 150).Select(i =>
            {
                var created = now.AddDays(-rnd.Next(1, 120)).AddMinutes(-rnd.Next(0, 1440));
                DateTime? lastLogin = rnd.NextDouble() < 0.3
                    ? null
                    : created.AddMinutes(rnd.NextDouble() * (now - created).TotalMinutes);

                return new Candidate
                {
                    Email = $"candidate{i}@example.com",
                    PasswordHash = passwordHash,
                    Name = $"{firstNames[rnd.Next(firstNames.Length)]} {lastNames[rnd.Next(lastNames.Length)]}",
                    DateOfBirth = today.AddYears(-rnd.Next(21, 46)).AddDays(-rnd.Next(0, 365)),
                    Gender = genders[rnd.Next(genders.Length)],
                    Location = locations[rnd.Next(locations.Length)],
                    Education = EducationCatalog.All[rnd.Next(EducationCatalog.All.Count)],
                    CreatedAt = created,
                    LastLoginAt = lastLogin
                };
            });

            db.Candidates.AddRange(candidates);
            await db.SaveChangesAsync(ct);
        }
    }
}
