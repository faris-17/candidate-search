using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace CandidateSearch.API.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static int? GetCandidateId(this ClaimsPrincipal user)
        {
            var value = user.FindFirstValue(JwtRegisteredClaimNames.Sub);
            return int.TryParse(value, out var id) ? id : null;
        }
    }
}
