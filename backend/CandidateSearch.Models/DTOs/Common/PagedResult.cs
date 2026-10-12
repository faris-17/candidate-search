using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CandidateSearch.Models.DTOs.Common
{
    public record PagedResult<T>(int Page, int PageSize, int TotalCount, IReadOnlyList<T> Items);
}
