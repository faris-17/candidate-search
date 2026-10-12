using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CandidateSearch.Services.Helpers
{
    public static class LikeHelper
    {
        /// <summary>Escapes LIKE wildcards so a user typing "%" or "_" is matched literally.</summary>
        public static string Escape(string value) =>
            value.Replace("\\", "\\\\").Replace("%", "\\%").Replace("_", "\\_");
    }
}
