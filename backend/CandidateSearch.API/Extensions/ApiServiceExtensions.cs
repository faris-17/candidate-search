using System.Text;
using CandidateSearch.Data;
using CandidateSearch.Models.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace CandidateSearch.API.Extensions
{
    public static class ApiServiceExtensions
    {
        public const string CorsPolicyName = "web";

        public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("Default");
            if (string.IsNullOrWhiteSpace(connectionString))
                throw new InvalidOperationException("ConnectionStrings:Default is not configured (use dotnet user-secrets).");

            services.AddDbContext<CandidateSearchDbContext>(options =>
                options.UseNpgsql(connectionString, npgsql =>
                    npgsql.MigrationsAssembly(typeof(CandidateSearchDbContext).Assembly.GetName().Name)));

            return services;
        }

        public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            var section = configuration.GetSection(JwtSettings.SectionName);

            services.AddOptions<JwtSettings>()
                .Bind(section)
                .ValidateDataAnnotations()
                .ValidateOnStart();

            var jwt = section.Get<JwtSettings>()
                      ?? throw new InvalidOperationException("Missing 'Jwt' configuration section.");

            services
                .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.MapInboundClaims = false;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = jwt.Issuer,
                        ValidateAudience = true,
                        ValidAudience = jwt.Audience,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Key)),
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero
                    };
                });

            services.AddAuthorization();
            return services;
        }

        public static IServiceCollection AddCorsPolicy(this IServiceCollection services, IConfiguration configuration)
        {
            var origins = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];

            services.AddCors(options => options.AddPolicy(CorsPolicyName, policy =>
                policy.WithOrigins(origins).AllowAnyHeader().AllowAnyMethod()));

            return services;
        }
    }
}
