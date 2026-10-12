using CandidateSearch.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CandidateSearch.Data.Configurations
{
    public class CandidateConfiguration : IEntityTypeConfiguration<Candidate>
    {
        public void Configure(EntityTypeBuilder<Candidate> b)
        {
            b.ToTable("candidates");
            b.HasKey(x => x.Id);

            b.Property(x => x.Id).HasColumnName("id");
            b.Property(x => x.Email).HasColumnName("email").HasMaxLength(256).IsRequired();
            b.Property(x => x.PasswordHash).HasColumnName("password_hash").HasMaxLength(100).IsRequired();
            b.Property(x => x.Name).HasColumnName("name").HasMaxLength(150);
            b.Property(x => x.DateOfBirth).HasColumnName("date_of_birth");
            b.Property(x => x.Gender).HasColumnName("gender").HasMaxLength(20);
            b.Property(x => x.Location).HasColumnName("location").HasMaxLength(100);
            b.Property(x => x.Education).HasColumnName("education").HasMaxLength(50);
            b.Property(x => x.CreatedAt).HasColumnName("created_at");
            b.Property(x => x.LastLoginAt).HasColumnName("last_login_at");

            b.HasIndex(x => x.Email).IsUnique().HasDatabaseName("ux_candidates_email");
            b.HasIndex(x => x.Education).HasDatabaseName("ix_candidates_education");
            b.HasIndex(x => x.Location).HasDatabaseName("ix_candidates_location");
            b.HasIndex(x => x.DateOfBirth).HasDatabaseName("ix_candidates_date_of_birth");
            b.HasIndex(x => x.CreatedAt).HasDatabaseName("ix_candidates_created_at");
            b.HasIndex(x => x.LastLoginAt).HasDatabaseName("ix_candidates_last_login_at");
        }
    }
}
