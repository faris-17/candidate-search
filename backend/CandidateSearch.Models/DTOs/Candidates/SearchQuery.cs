using CandidateSearch.Models.Constants;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CandidateSearch.Models.DTOs.Candidates
{
    public class SearchQuery : IValidatableObject
    {
        [Range(1, 100_000)] public int Page { get; set; } = 1;
        [Range(1, SearchConstants.MaxPageSize)] public int PageSize { get; set; } = SearchConstants.DefaultPageSize;

        [Range(0, 120)] public int? MinAge { get; set; }
        [Range(0, 120)] public int? MaxAge { get; set; }

        [MaxLength(20)] public string? Gender { get; set; }
        [MaxLength(100)] public string? Location { get; set; }

        [MaxLength(200)] public string? Education { get; set; }

        public DateOnly? CreatedFrom { get; set; }
        public DateOnly? CreatedTo { get; set; }
        public DateOnly? LastLoginFrom { get; set; }
        public DateOnly? LastLoginTo { get; set; }

        public string SortBy { get; set; } = SearchConstants.SortByCreatedAt;
        public string SortOrder { get; set; } = SearchConstants.SortDesc;

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (MinAge > MaxAge)
                yield return new ValidationResult("minAge cannot be greater than maxAge.", [nameof(MinAge), nameof(MaxAge)]);
            if (CreatedFrom > CreatedTo)
                yield return new ValidationResult("createdFrom cannot be after createdTo.", [nameof(CreatedFrom), nameof(CreatedTo)]);
            if (LastLoginFrom > LastLoginTo)
                yield return new ValidationResult("lastLoginFrom cannot be after lastLoginTo.", [nameof(LastLoginFrom), nameof(LastLoginTo)]);
            if (!SearchConstants.AllowedSortFields.Contains(SortBy, StringComparer.OrdinalIgnoreCase))
                yield return new ValidationResult($"sortBy must be one of: {string.Join(", ", SearchConstants.AllowedSortFields)}.", [nameof(SortBy)]);
            if (!SearchConstants.AllowedSortOrders.Contains(SortOrder, StringComparer.OrdinalIgnoreCase))
                yield return new ValidationResult("sortOrder must be 'asc' or 'desc'.", [nameof(SortOrder)]);
        }
    }
}
