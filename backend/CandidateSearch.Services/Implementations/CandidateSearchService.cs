using CandidateSearch.Data;
using CandidateSearch.Models.DTOs.Candidates;
using CandidateSearch.Models.DTOs.Common;
using CandidateSearch.Services.Extensions;
using CandidateSearch.Services.Helpers;
using CandidateSearch.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CandidateSearch.Services.Implementations
{
    public class CandidateSearchService(CandidateSearchDbContext db) : ICandidateSearchService
    {
        public async Task<PagedResult<CandidateDto>> SearchAsync(int currentCandidateId, SearchQuery q, CancellationToken ct)
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            // 1. Build the query (nothing hits the database yet).
            var query = db.Candidates
                .AsNoTracking()
                .Where(c => c.Id != currentCandidateId)       // Task 3: the caller is excluded inside the SQL
                .ApplyFilters(q, today);                      // Tasks 4-7

            // 2. Count AFTER the filters, BEFORE paging.
            var totalCount = await query.CountAsync(ct);

            // 3. Sort -> page -> project. Still one SQL statement (ORDER BY ... LIMIT ... OFFSET ...).
            var rows = await query
                .ApplySorting(q)
                .Skip((q.Page - 1) * q.PageSize)
                .Take(q.PageSize)
                .Select(c => new { c.Id, c.Name, c.DateOfBirth, c.Gender, c.Education, c.Location, c.CreatedAt, c.LastLoginAt })
                .ToListAsync(ct);                             // the query executes here

            // At most PageSize (<= 100) rows are mapped in memory, only to compute the display age.
            var items = rows
                .Select(r => new CandidateDto(r.Id, r.Name, DateHelper.CalculateAge(r.DateOfBirth, today),
                    r.Gender, r.Education, r.Location, r.CreatedAt, r.LastLoginAt))
                .ToList();

            return new PagedResult<CandidateDto>(q.Page, q.PageSize, totalCount, items);
        }
    }
}
