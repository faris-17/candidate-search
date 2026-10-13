using CandidateSearch.Models.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;

namespace CandidateSearch.Data
{
    public class CandidateSearchDbContext(DbContextOptions<CandidateSearchDbContext> options) : DbContext(options)
    {
        public DbSet<Candidate> Candidates => Set<Candidate>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Picks up every IEntityTypeConfiguration<T> class in this project.
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(CandidateSearchDbContext).Assembly);
        }
    }
}
