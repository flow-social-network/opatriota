# Test Suite: O Patriota Brasil Backend

This test suite covers the backend functionality of O Patriota Brasil.
Tests were designed to verify authentication, authorization, editorial workflow,
database operations, and security requirements.

## Test Organization

Tests are organized by priority and cover:

1. **Authentication** - Firebase token verification, user identification
2. **Authorization** - Role-based permission checking
3. **Editorial Workflow** - Article status transitions
4. **Database Operations** - CRUD operations, integrity
5. **Security** - SSRF protection, IDOR prevention
6. **RSS Automation** - Feed polling, deduplication
7. **Meta Integration** - Facebook Graph API structure

## Running Tests

```bash
# Using vitest (recommended)
npx vitest run

# Or with jest if configured
npx jest
```

## Test Files

- `test/auth.test.ts` - Authentication and basic authorization
- `test/authorization.test.ts` - Role-based permission tests
- `test/workflow.test.ts` - Editorial workflow tests
- `test/security.test.ts` - Security and vulnerability tests
- `test/rss.test.ts` - RSS automation tests
- `test/meta.test.ts` - Meta integration structure tests

## Key Test Scenarios

### Authentication
- [x] Bearer token verification (placeholder - requires Firebase credentials)
- [x] userId in query string fallback
- [x] userId in request body fallback
- [x] x-user-id header fallback
- [x] Unauthenticated access rejection (401)

### Authorization
- [x] Leitor role: read-only access
- [x] Assinante role: read + exclusive content
- [x] Colunista role: create articles
- [x] Jornalista role: create and edit own articles
- [x] Editor role: manage editorial queue
- [x] Chief Editor: full editorial control
- [x] Administrador: complete system access
- [x] Permission checking in all routes
- [x] Negative tests (block unauthorized access)

### Editorial Workflow
- [x] New articles start as DRAFT
- [x] DRAFT → IN_REVIEW (submission for review)
- [x] IN_REVIEW → APPROVED (chief editor or admin)
- [x] IN_REVIEW → REJECTED (content sent back for correction)
- [x] REJECTED cannot be published directly
- [x] APPROVED → PUBLISHED (publication)
- [x] Author cannot approve own article (policy violation)
- [x] ADMIN/CHIEF_EDITOR can approve own content (audited)
- [x] Publication agendada validates state at execution time
- [x] Public API only returns published articles

### Security
- [x] SSRF protection (is_safe_url validation)
- [x] Internal IP blocking (localhost, 127.0.0.1, 192.168.x.x, 10.x.x.x, 172.x.x.x)
- [x] Cloud metadata endpoint blocking (169.254.169.254)
- [x] URL protocol validation (only http/https)
- [x] RSS polling with timeout (15s)
- [x] Abort control for long-running requests
- [x] Route-level authorization
- [x] IDOR prevention (author-only delete/edit)
- [x] Rate limiting concepts

### RSS Automation
- [x] SSRF-protected URL validation
- [x] Timeout per source (15s)
- [x] Basic RSS XML parsing
- [x] Item extraction from feeds
- [x] Error handling for unavailable sources
- [x] Mock integration with source management

### Meta Integration
- [x] /api/meta/connect - connection guidance
- [x] /api/meta/publish - publication guidance
- [x] Facebook NOT used for login
- [x] Token storage planned (encrypted, external key)
- [x] Permission validation structure
- [x] CSRF protection design

## Test Data

Tests use Prisma client with SQLite/PostgreSQL configured.
Mock data is used when database is not available.
Test articles, sources, and users are created per test suite.

## Known Limitations

- Firebase Admin SDK requires real credentials (FIREBASE_ADMIN_PATH)
- Neon PostgreSQL requires DATABASE_URL configuration
- NVIDIA NIM API key optional (NIM_API_KEY env var)
- Meta Graph API requires META_ACCESS_TOKEN and META_PAGE_ID
- Prisma client needs generation (prisma generate)

## Manual Test Commands

```bash
# Start server
npx tsx src/server.ts

# Test health
curl http://localhost:4000/health

# Test articles (with userId query)
curl "http://localhost:4000/api/articles?userId=uid-test"

# Test authorization (leitor role)
curl "http://localhost:4000/api/sources?userId=uid-leitor"

# Test RSS sources
curl "http://localhost:4000/api/rss/sources?userId=uid-1"

# Test Meta connect (returns guidance)
curl -X POST http://localhost:4000/api/meta/connect \
  -H "Authorization: Bearer test" \
  -H "x-user-id: uid-admin"
```