using CandidateSearch.Models.DTOs.Auth;
using CandidateSearch.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CandidateSearch.Services.Interfaces
{
    public interface ITokenService
    {
        TokenResult Create(Candidate candidate);
    }
}
