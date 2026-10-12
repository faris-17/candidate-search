using CandidateSearch.Models.Constants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CandidateSearch.Services.Helpers
{
    public static class EducationParser
    {
        /// <summary>"BTech, m.tech,MBA" becomes ["B.Tech","M.Tech","MBA"]. Unknown values are dropped.</summary>
        public static List<string> Parse(string raw) =>
            raw.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
               .Select(EducationCatalog.Normalize)
               .OfType<string>()
               .Distinct()
               .ToList();
    }
}
