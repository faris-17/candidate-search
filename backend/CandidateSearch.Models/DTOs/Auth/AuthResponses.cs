using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CandidateSearch.Models.DTOs.Auth
{
    public record RegisterResponse(int Id, string Email);
    public record LoginResponse(string Token, int ExpiresIn);
    public record TokenResult(string Token, int ExpiresInSeconds);
}
