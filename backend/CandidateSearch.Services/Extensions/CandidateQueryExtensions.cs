using CandidateSearch.Models.Constants;
using CandidateSearch.Models.DTOs.Candidates;
using CandidateSearch.Models.Entities;
using CandidateSearch.Services.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CandidateSearch.Services.Extensions
{

    /// <summary>
    /// Composable query pieces. Each method takes an IQueryable and returns a new, more specific IQueryable.
    /// Nothing runs against PostgreSQL until the caller materialises the query (CountAsync / ToListAsync).
    /// </summary>
    public static class CandidateQueryExtensions
    {
        public static IQueryable<Candidate> ApplyFilters(this IQueryable<Candidate> query, SearchQuery q, DateOnly today)
        {
            // Age is converted to a date-of-birth range so PostgreSQL can use the DOB index.
            // age >= minAge  <=>  born on or before (today - minAge years)
            if (q.MinAge.HasValue)
            {
                var latestDob = today.AddYears(-q.MinAge.Value);
                query = query.Where(c => c.DateOfBirth <= latestDob);
            }
            // age <= maxAge  <=>  has not yet turned maxAge+1  <=>  born after (today - (maxAge+1) years)
            if (q.MaxAge.HasValue)
            {
                var earliestDob = today.AddYears(-(q.MaxAge.Value + 1));
                query = query.Where(c => c.DateOfBirth > earliestDob);
            }

            if (!string.IsNullOrWhiteSpace(q.Gender))
            {
                var gender = LikeHelper.Escape(q.Gender.Trim());
                query = query.Where(c => EF.Functions.ILike(c.Gender!, gender));            // case-insensitive exact match
            }

            if (!string.IsNullOrWhiteSpace(q.Location))
            {
                var pattern = $"%{LikeHelper.Escape(q.Location.Trim())}%";
                query = query.Where(c => EF.Functions.ILike(c.Location!, pattern));         // case-insensitive "contains"
            }

            // Task 5: ONE membership predicate evaluated by PostgreSQL (education = ANY(@list)).
            // If every supplied value is unknown the list is empty and nothing matches.
            if (!string.IsNullOrWhiteSpace(q.Education))
            {
                var education = EducationParser.Parse(q.Education);
                query = query.Where(c => education.Contains(c.Education!));
            }

            // Date ranges are inclusive: "to" becomes "< start of the next day".
            if (q.CreatedFrom.HasValue)
            {
                var from = DateHelper.ToUtcStartOfDay(q.CreatedFrom.Value);
                query = query.Where(c => c.CreatedAt >= from);
            }
            if (q.CreatedTo.HasValue)
            {
                var toExclusive = DateHelper.ToUtcStartOfDay(q.CreatedTo.Value.AddDays(1));
                query = query.Where(c => c.CreatedAt < toExclusive);
            }

            // In SQL, NULL >= x and NULL < x are never true, so never-logged-in candidates never match these filters.
            if (q.LastLoginFrom.HasValue)
            {
                var from = DateHelper.ToUtcStartOfDay(q.LastLoginFrom.Value);
                query = query.Where(c => c.LastLoginAt >= from);
            }
            if (q.LastLoginTo.HasValue)
            {
                var toExclusive = DateHelper.ToUtcStartOfDay(q.LastLoginTo.Value.AddDays(1));
                query = query.Where(c => c.LastLoginAt < toExclusive);
            }

            return query;
        }

        public static IOrderedQueryable<Candidate> ApplySorting(this IQueryable<Candidate> query, SearchQuery q)
        {
            var desc = q.SortOrder.Equals(SearchConstants.SortDesc, StringComparison.OrdinalIgnoreCase);

            // "IS NULL" is ordered first so rows with no value always sort LAST
            // (PostgreSQL would otherwise put NULLs first on DESC).
            IOrderedQueryable<Candidate> ordered = (q.SortBy.ToLowerInvariant(), desc) switch
            {
                ("lastloginat", true) => query.OrderBy(c => c.LastLoginAt == null).ThenByDescending(c => c.LastLoginAt),
                ("lastloginat", false) => query.OrderBy(c => c.LastLoginAt == null).ThenBy(c => c.LastLoginAt),
                // Older date of birth = higher age, so the direction is flipped.
                ("age", true) => query.OrderBy(c => c.DateOfBirth == null).ThenBy(c => c.DateOfBirth),
                ("age", false) => query.OrderBy(c => c.DateOfBirth == null).ThenByDescending(c => c.DateOfBirth),
                (_, false) => query.OrderBy(c => c.CreatedAt),
                _ => query.OrderByDescending(c => c.CreatedAt)     // default: createdAt DESC
            };

            // Tie-breaker: without it, equal values may repeat or vanish between pages.
            return ordered.ThenBy(c => c.Id);
        }
    }
}
