using CandidateSearch.Models.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace CandidateSearch.API.Handlers
{
    public class GlobalExceptionHandler(
        ILogger<GlobalExceptionHandler> logger,
        IProblemDetailsService problemDetailsService) : IExceptionHandler
    {
        public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception, CancellationToken ct)
        {
            if (exception is OperationCanceledException && context.RequestAborted.IsCancellationRequested)
                return true;

            var (status, title) = exception is AppException app
                ? (app.StatusCode, app.Message)
                : (StatusCodes.Status500InternalServerError, "An unexpected error occurred.");

            if (status >= 500)
                logger.LogError(exception, "Unhandled exception on {Method} {Path}", context.Request.Method, context.Request.Path);

            context.Response.StatusCode = status;

            return await problemDetailsService.TryWriteAsync(new ProblemDetailsContext
            {
                HttpContext = context,
                Exception = exception,
                ProblemDetails = new ProblemDetails { Status = status, Title = title }
            });
        }
    }
}
