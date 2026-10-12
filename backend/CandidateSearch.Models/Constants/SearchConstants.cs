using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CandidateSearch.Models.Constants
{
    public static class SearchConstants
    {
        public const int DefaultPageSize = 20;
        public const int MaxPageSize = 100;

        public const string SortByCreatedAt = "createdAt";
        public const string SortByLastLoginAt = "lastLoginAt";
        public const string SortByAge = "age";

        public const string SortAsc = "asc";
        public const string SortDesc = "desc";

        public static readonly string[] AllowedSortFields = [SortByCreatedAt, SortByLastLoginAt, SortByAge];
        public static readonly string[] AllowedSortOrders = [SortAsc, SortDesc];
    }
}
