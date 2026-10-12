using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CandidateSearch.Services.Helpers
{
    public static class DateHelper
    {
        /// <summary>Npgsql only accepts UTC DateTime for timestamptz columns.</summary>
        public static DateTime ToUtcStartOfDay(DateOnly date) =>
            DateTime.SpecifyKind(date.ToDateTime(TimeOnly.MinValue), DateTimeKind.Utc);

        public static int? CalculateAge(DateOnly? dob, DateOnly today)
        {
            if (dob is null) return null;
            var age = today.Year - dob.Value.Year;
            if (dob.Value > today.AddYears(-age)) age--;     // birthday hasn't happened yet this year
            return age;
        }
    }
}
