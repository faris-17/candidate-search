using CandidateSearch.Models.DTOs.Candidates;
using CandidateSearch.Models.DTOs.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CandidateSearch.Services.Interfaces
{
    public interface ICandidateSearchService
    {
        Task<PagedResult<CandidateDto>> SearchAsync(int currentCandidateId, SearchQuery query, CancellationToken ct);
    }
}
