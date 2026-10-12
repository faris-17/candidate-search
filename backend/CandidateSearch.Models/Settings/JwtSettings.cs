using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CandidateSearch.Models.Settings
{
    public class JwtSettings
    {
        public const string SectionName = "Jwt";

        [Required] public string Issuer { get; set; } = string.Empty;
        [Required] public string Audience { get; set; } = string.Empty;

        [Required, MinLength(32, ErrorMessage = "Jwt:Key must be at least 32 characters.")]
        public string Key { get; set; } = string.Empty;

        [Range(60, 86_400)] public int ExpiresInSeconds { get; set; } = 3600;
    }
}
