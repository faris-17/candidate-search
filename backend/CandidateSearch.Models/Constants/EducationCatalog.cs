using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CandidateSearch.Models.Constants
{
    public static class EducationCatalog
    {
        public static readonly IReadOnlyList<string> All = ["B.Tech", "M.Tech", "MBA", "MCA", "PhD"];

        private static readonly Dictionary<string, string> Lookup = All.ToDictionary(Key);

        public static string? Normalize(string input) => Lookup.GetValueOrDefault(Key(input));

        private static string Key(string value) =>
            new string(value.Where(char.IsLetterOrDigit).ToArray()).ToLowerInvariant();
    }
}
