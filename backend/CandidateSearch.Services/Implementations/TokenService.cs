using CandidateSearch.Models.DTOs.Auth;
using CandidateSearch.Models.Entities;
using CandidateSearch.Models.Settings;
using CandidateSearch.Services.Interfaces;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace CandidateSearch.Services.Implementations
{
    public class TokenService(IOptions<JwtSettings> options) : ITokenService
    {
        private readonly JwtSettings _settings = options.Value;

        public TokenResult Create(Candidate candidate)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.Key));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, candidate.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, candidate.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

            var now = DateTime.UtcNow;
            var token = new JwtSecurityToken(
                issuer: _settings.Issuer,
                audience: _settings.Audience,
                claims: claims,
                notBefore: now,
                expires: now.AddSeconds(_settings.ExpiresInSeconds),    // same value is returned as expiresIn
                signingCredentials: credentials);

            return new TokenResult(new JwtSecurityTokenHandler().WriteToken(token), _settings.ExpiresInSeconds);
        }
    }
}
