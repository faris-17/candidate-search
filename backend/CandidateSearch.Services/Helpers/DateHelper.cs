using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CandidateSearch.Services.Helpers
{
    public static class DateHelper
    {
        public static DateTime ToUtcStartOfDay(DateOnly date) =>
            DateTime.SpecifyKind(date.ToDateTime(TimeOnly.MinValue), DateTimeKind.Utc);

        public static int? CalculateAge(DateOnly? dob, DateOnly today)
        {
            if (dob is null) return null;
            var age = today.Year - dob.Value.Year;
            if (dob.Value > today.AddYears(-age)) age--;
            return age;
        }
    }
}
