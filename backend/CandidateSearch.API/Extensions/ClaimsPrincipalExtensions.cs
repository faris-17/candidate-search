using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace CandidateSearch.API.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        /// <summary>Reads the candidate id from the JWT "sub" claim. Returns null if missing or invalid.</summary>
        public static int? GetCandidateId(this ClaimsPrincipal user)
        {
            var value = user.FindFirstValue(JwtRegisteredClaimNames.Sub);
            return int.TryParse(value, out var id) ? id : null;
        }
    }
}
