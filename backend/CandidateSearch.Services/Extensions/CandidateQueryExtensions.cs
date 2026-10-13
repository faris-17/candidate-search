using CandidateSearch.Models.Constants;
using CandidateSearch.Models.DTOs.Candidates;
using CandidateSearch.Models.Entities;
using CandidateSearch.Services.Helpers;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CandidateSearch.Services.Extensions
{

    public static class CandidateQueryExtensions
    {
        public static IQueryable<Candidate> ApplyFilters(this IQueryable<Candidate> query, SearchQuery q, DateOnly today)
        {
            if (q.MinAge.HasValue)
            {
                var latestDob = today.AddYears(-q.MinAge.Value);
                query = query.Where(c => c.DateOfBirth <= latestDob);
            }
            if (q.MaxAge.HasValue)
            {
                var earliestDob = today.AddYears(-(q.MaxAge.Value + 1));
                query = query.Where(c => c.DateOfBirth > earliestDob);
            }

            if (!string.IsNullOrWhiteSpace(q.Gender))
            {
                var gender = LikeHelper.Escape(q.Gender.Trim());
                query = query.Where(c => EF.Functions.ILike(c.Gender!, gender));
            }

            if (!string.IsNullOrWhiteSpace(q.Location))
            {
                var pattern = $"%{LikeHelper.Escape(q.Location.Trim())}%";
                query = query.Where(c => EF.Functions.ILike(c.Location!, pattern));
            }

            if (!string.IsNullOrWhiteSpace(q.Education))
            {
                var education = EducationParser.Parse(q.Education);
                query = query.Where(c => education.Contains(c.Education!));
            }

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

            IOrderedQueryable<Candidate> ordered = (q.SortBy.ToLowerInvariant(), desc) switch
            {
                ("lastloginat", true) => query.OrderBy(c => c.LastLoginAt == null).ThenByDescending(c => c.LastLoginAt),
                ("lastloginat", false) => query.OrderBy(c => c.LastLoginAt == null).ThenBy(c => c.LastLoginAt),
                ("age", true) => query.OrderBy(c => c.DateOfBirth == null).ThenBy(c => c.DateOfBirth),
                ("age", false) => query.OrderBy(c => c.DateOfBirth == null).ThenByDescending(c => c.DateOfBirth),
                (_, false) => query.OrderBy(c => c.CreatedAt),
                _ => query.OrderByDescending(c => c.CreatedAt)
            };

            return ordered.ThenBy(c => c.Id);
        }
    }
}
