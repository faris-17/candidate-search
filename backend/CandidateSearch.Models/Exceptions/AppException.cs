using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CandidateSearch.Models.Exceptions
{
    /// <summary>Base class for expected business errors. Carries the HTTP status that should be returned.</summary>
    public abstract class AppException(string message, int statusCode) : Exception(message)
    {
        public int StatusCode { get; } = statusCode;
    }

    public class EmailAlreadyExistsException() : AppException("Email is already registered.", 409);

    public class InvalidCredentialsException() : AppException("Invalid email or password.", 401);
}
