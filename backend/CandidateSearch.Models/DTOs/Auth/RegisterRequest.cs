using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CandidateSearch.Models.DTOs.Auth
{
    public class RegisterRequest
    {
        [Required, EmailAddress, MaxLength(256)]
        public string Email { get; set; } = string.Empty;

        [Required, MinLength(8), MaxLength(72)]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$",
            ErrorMessage = "Password must contain an uppercase letter, a lowercase letter, a digit and a special character.")]
        public string Password { get; set; } = string.Empty;
    }
}
