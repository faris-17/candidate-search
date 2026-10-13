# Candidate Search Web Application

An end-to-end candidate search platform built for the **Machine Test: Candidate Search Engineering Assessment**.

This solution features:
* **Backend:** ASP.NET Core 9 Web API
* **Database:** PostgreSQL with Entity Framework Core 9 (Code-First Migrations)
* **Frontend:** React 19 + TypeScript + Vite
* **Authentication:** JWT Bearer Authentication & BCrypt Password Hashing
* **API Documentation:** OpenAPI & Scalar Interactive API Reference

---

## Architecture & Technical Highlights

1. **Database-Level Querying:**
   All filtering (age range, gender, location, multi-select education, created date, last login date), sorting, and pagination are performed at the **PostgreSQL query level** using EF Core `IQueryable`. No in-memory filtering or materialization of full tables occurs in C#.
2. **Education Multi-Select (Task 5):**
   The comma-separated education query string (e.g. `education=BTech,MBA,MCA`) is parsed, normalized, and translated to a single PostgreSQL `WHERE education = ANY(@list)` / `IN (...)` clause.
3. **Caller Exclusion (Task 3):**
   The authenticated user's ID is read from the JWT `sub` claim and excluded directly in SQL (`WHERE id <> @currentCandidateId`).
4. **Secure Authentication (Tasks 1 & 2):**
   * Passwords hashed using `BCrypt.Net-Next`.
   * Fast timing attack mitigation: invalid login requests take constant time.
   * Duplicate email registrations return `409 Conflict`.
   * All `/api/candidates/*` endpoints are protected by `[Authorize]`.
5. **Interactive UI (Tasks 11 & 12):**
   * Filter controls for Age (min/max), Gender dropdown, Location text search, Education multi-select checkboxes, Created Date range, and Last Login Date range.
   * Sorting controls (`createdAt`, `lastLoginAt`, `age`) with ascending/descending toggles.
   * Resilient states: Loading spinner, error messages with retry, empty state ("No candidates match your filters"), and paginated navigation.
   * Automatic 401 interception: redirects to login if the JWT expires.
   * Sign In & Register tabs.

---

## Prerequisites

* [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
* [Node.js (v18+)](https://nodejs.org/) & npm
* [PostgreSQL 15+](https://www.postgresql.org/) (or [Docker Desktop](https://www.docker.com/))

---

## Quick Start Guide

### 1. Database Setup

You can run PostgreSQL locally or using Docker:

#### Option A: Using Docker (Recommended)
From the repository root, start PostgreSQL using the provided `docker-compose.yml`:
```bash
docker compose up -d
```
This spins up PostgreSQL on `localhost:5432` with database `candidate_search` (user `postgres`, password `Password@123`).

#### Option B: Using an Existing PostgreSQL Instance
Ensure a PostgreSQL database named `candidate_search` exists.

---

### 2. Backend Configuration & Setup

1. Open a terminal in the `backend/` folder:
   ```bash
   cd backend
   ```

2. Configure your database connection string and JWT signing key using .NET User Secrets:
   ```bash
   dotnet user-secrets set "ConnectionStrings:Default" "Host=localhost;Database=candidate_search;Username=postgres;Password=Password@123" --project CandidateSearch.API/CandidateSearch.API.csproj
   dotnet user-secrets set "Jwt:Key" "CandidateSearch-Dev-Secret-Key-32chars!!" --project CandidateSearch.API/CandidateSearch.API.csproj
   ```
   *(Replace password with your local PostgreSQL password if not using Docker)*.

3. Apply Database Migrations:
   ```bash
   dotnet ef database update --project CandidateSearch.Data/CandidateSearch.Data.csproj --startup-project CandidateSearch.API/CandidateSearch.API.csproj
   ```

4. Run the Backend API:
   ```bash
   dotnet run --project CandidateSearch.API/CandidateSearch.API.csproj --launch-profile https
   ```
   * **HTTPS:** `https://localhost:7169`
   * **HTTP:** `http://localhost:5177`
   * **Interactive Swagger UI:** `https://localhost:7169/swagger`

> **Note on Seed Data:** On initial startup in Development mode, the application automatically runs `InitialiseDatabaseAsync()` to seed **150 realistic candidates** with hashed passwords into the database.

---

### 3. Frontend Setup

1. Open a new terminal in the `frontend/` folder:
   ```bash
   cd frontend
   ```

2. Ensure `frontend/.env` points to the backend:
   ```env
   VITE_API_URL=https://localhost:7169
   ```

3. Install dependencies and start the Vite dev server:
   ```bash
   npm install
   npm run dev
   ```

4. Open your browser and navigate to:
   **`http://localhost:5173`**

---

## Demo Credentials

The database is pre-seeded with 150 test candidates. You can log in using any of the seeded accounts:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Demo User 1** | `candidate1@example.com` | `Password@123` |
| **Demo User 2** | `candidate2@example.com` | `Password@123` |
| *(Any user 1-150)* | `candidate{i}@example.com` | `Password@123` |

You can also use the **Register** tab on the login page to create a new user.

---

## API Reference

### Authentication

#### Register
* **`POST /api/auth/register`**
* **Body:**
  ```json
  {
    "email": "newuser@example.com",
    "password": "Password@123"
  }
  ```
* **Responses:**
  * `201 Created` - Account created
  * `400 Bad Request` - Validation failure (password requirements or invalid email)
  * `409 Conflict` - Email already in use

#### Login
* **`POST /api/auth/login`**
* **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "Password@123"
  }
  ```
* **Responses:**
  * `200 OK` - Returns `{ "token": "...", "expiresIn": 3600 }`
  * `401 Unauthorized` - Generic invalid credentials message

---

### Candidate Search (Protected)

* **`GET /api/candidates/search`**
* **Headers:** `Authorization: Bearer <jwt-token>`
* **Query Parameters:**
  * `page` (default: `1`)
  * `pageSize` (default: `20`, max: `100`)
  * `minAge` & `maxAge` (e.g. `?minAge=25&maxAge=35`)
  * `gender` (e.g. `?gender=Female`)
  * `location` (e.g. `?location=Kochi` — case-insensitive substring search)
  * `education` (e.g. `?education=BTech,MBA,MCA` — comma-separated multi-select)
  * `createdFrom` & `createdTo` (e.g. `?createdFrom=2026-08-01&createdTo=2026-10-15`)
  * `lastLoginFrom` & `lastLoginTo` (e.g. `?lastLoginFrom=2026-09-01&lastLoginTo=2026-10-15`)
  * `sortBy` (`createdAt` [default], `lastLoginAt`, `age`)
  * `sortOrder` (`desc` [default], `asc`)

#### Sample Response Shape:
```json
{
  "page": 1,
  "pageSize": 20,
  "totalCount": 149,
  "items": [
    {
      "id": 110,
      "name": "Meera Thomas",
      "age": 35,
      "gender": "Other",
      "education": "M.Tech",
      "location": "Kochi",
      "createdAt": "2026-10-11T04:06:27.654722Z",
      "lastLoginAt": "2026-10-11T22:21:41.009738Z"
    }
  ]
}
```

---

## Assumptions & Design Decisions

1. **Age vs. Date of Birth:**
   Storing `date_of_birth` rather than a dynamic `age` integer in PostgreSQL allows index utilization on `date_of_birth`. Filtering by age translates to date boundaries:
   * `age >= minAge` $\rightarrow$ `date_of_birth <= today - minAge years`
   * `age <= maxAge` $\rightarrow$ `date_of_birth > today - (maxAge + 1) years`
   Display age is computed in memory only for the paginated slice of <= 20 records returned.

2. **Null `last_login_at` Treatment:**
   Candidates who have never logged in have `last_login_at IS NULL`. In SQL semantics, comparison against NULL yields `UNKNOWN` (falsy). Therefore, candidates who have never logged in are excluded when `lastLoginFrom` or `lastLoginTo` filters are supplied. For sorting by `lastLoginAt DESC`, rows with `NULL` are explicitly ordered last.

3. **Multi-Select Education Parsing:**
   The `education` query parameter supports both formal abbreviations (`B.Tech`, `M.Tech`) and user-entered variants (`BTech`, `mtech`). These are parsed and normalized in `EducationParser`, producing a SQL `c.education = ANY(@list)` predicate.

4. **Self-Exclusion (Task 3):**
   The logged-in candidate ID is extracted from the `sub` claim of the verified JWT and appended as `c.Id != currentCandidateId` directly to the SQL query.

---

## Time Spent & Future Enhancements

* **Total Time Spent:** Approximately 5.5 hours.
* **What I'd Do Next With More Time:**
  1. **URL Synchronization:** Sync search and filter state with browser URL search parameters (`useSearchParams`) so search queries can be bookmarked and shared.
  2. **Refresh Token Flow:** Implement HTTP-only cookie-based refresh tokens alongside short-lived access tokens.
  3. **Full-Text Search:** Add a PostgreSQL `tsvector` and GIN index for search across candidate name, skills, and summary.
  4. **Redis Caching:** Cache candidate catalog values (e.g. locations and educations) and total candidate counts to minimize DB load on high-traffic queries.
