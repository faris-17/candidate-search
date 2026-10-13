using CandidateSearch.Data;
using CandidateSearch.Models.DTOs.Auth;
using CandidateSearch.Models.Entities;
using CandidateSearch.Models.Exceptions;
using CandidateSearch.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CandidateSearch.Services.Implementations
{
    public class AuthService(CandidateSearchDbContext db, ITokenService tokenService) : IAuthService
    {
        private static readonly string DummyHash = BCrypt.Net.BCrypt.HashPassword("not-a-real-password");

        public async Task<RegisterResponse> RegisterAsync(RegisterRequest request, CancellationToken ct)
        {
            var email = NormalizeEmail(request.Email);

            if (await db.Candidates.AnyAsync(c => c.Email == email, ct))
                throw new EmailAlreadyExistsException();

            var candidate = new Candidate
            {
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                CreatedAt = DateTime.UtcNow
            };
            db.Candidates.Add(candidate);

            try
            {
                await db.SaveChangesAsync(ct);
            }
            catch (DbUpdateException ex) when (ex.InnerException is PostgresException { SqlState: PostgresErrorCodes.UniqueViolation })
            {
                throw new EmailAlreadyExistsException();
            }

            return new RegisterResponse(candidate.Id, candidate.Email);
        }

        public async Task<LoginResponse> LoginAsync(LoginRequest request, CancellationToken ct)
        {
            var email = NormalizeEmail(request.Email);
            var candidate = await db.Candidates.FirstOrDefaultAsync(c => c.Email == email, ct);

            try
            {
                var passwordValid = BCrypt.Net.BCrypt.Verify(request.Password, candidate?.PasswordHash ?? DummyHash);

                if (candidate is null || !passwordValid)
                    throw new InvalidCredentialsException();
            }
            catch (Exception ex) when (ex is not InvalidCredentialsException)
            {
                throw new InvalidCredentialsException();
            }

            candidate.LastLoginAt = DateTime.UtcNow;
            await db.SaveChangesAsync(ct);

            var token = tokenService.Create(candidate);
            return new LoginResponse(token.Token, token.ExpiresInSeconds);
        }

        private static string NormalizeEmail(string email) => email.Trim().ToLowerInvariant();
    }
}
