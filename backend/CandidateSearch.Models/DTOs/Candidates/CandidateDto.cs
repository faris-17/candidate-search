using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CandidateSearch.Models.DTOs.Candidates
{
    public record CandidateDto(
    int Id,
    string? Name,
    int? Age,
    string? Gender,
    string? Education,
    string? Location,
    DateTime CreatedAt,
    DateTime? LastLoginAt);
}
