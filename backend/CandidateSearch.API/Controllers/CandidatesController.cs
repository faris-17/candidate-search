using CandidateSearch.API.Extensions;
using CandidateSearch.Models.DTOs.Candidates;
using CandidateSearch.Models.DTOs.Common;
using CandidateSearch.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace CandidateSearch.API.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/candidates")]
    public class CandidatesController(ICandidateSearchService searchService) : ControllerBase
    {
        [HttpGet("search")]
        [ProducesResponseType(typeof(PagedResult<CandidateDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<PagedResult<CandidateDto>>> Search([FromQuery] SearchQuery query, CancellationToken ct)
        {
            var currentId = User.GetCandidateId();
            if (currentId is null) return Unauthorized();

            return Ok(await searchService.SearchAsync(currentId.Value, query, ct));
        }
    }
}
