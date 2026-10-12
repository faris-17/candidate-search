using CandidateSearch.Models.DTOs.Auth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CandidateSearch.Services.Interfaces
{

    public interface IAuthService
    {
        Task<RegisterResponse> RegisterAsync(RegisterRequest request, CancellationToken ct);
        Task<LoginResponse> LoginAsync(LoginRequest request, CancellationToken ct);
    }
}
