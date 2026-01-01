# Testing Guide

## Test Coverage

Project hiện có **28 tests** covering các modules chính:

### ✅ Test Files

1. **services.test.ts** - Puzzle Service & AI Service

   - ✅ 16 tests for Puzzle Service (checkGuess, calculateScore)
   - ⏭️ 3 tests skipped for AI Service (require actual Gemini API)

2. **cleanup.test.ts** - Cleanup Service

   - ✅ 6 tests for auto-deletion features
   - Tests unpopular puzzles deletion (rating < -10)
   - Tests unverified puzzles deletion (>24h old)

3. **api.test.ts** - API Routes
   - ✅ 4 tests for authentication endpoints
   - Tests health check endpoint
   - Tests admin login (success/failure cases)

## Running Tests

### Run All Tests

```bash
cd server
npm test
```

### Run Specific Test File

```bash
npm test services.test.ts
npm test cleanup.test.ts
npm test api.test.ts
```

### Run With Coverage

```bash
npm test -- --coverage
```

### Watch Mode (Development)

```bash
npm run test:watch
```

## Test Results Summary

```
Test Suites: 3 passed, 3 total
Tests:       3 skipped, 25 passed, 28 total
Time:        ~10s
```

## What's Tested

### ✅ Puzzle Service

- [x] Valid guess checking (exact match)
- [x] Case-insensitive word matching
- [x] Whitespace trimming
- [x] Invalid guess rejection
- [x] Wrong number of words
- [x] Duplicate words handling
- [x] Multiple group matching
- [x] Score calculation (attempts penalty)
- [x] Score calculation (time penalty)
- [x] Minimum score enforcement (100 points)
- [x] Perfect score calculation (1000 points)
- [x] Score comparison (faster = higher)
- [x] Score comparison (fewer attempts = higher)

### ✅ Cleanup Service

- [x] Delete unpopular puzzles (rating < -10)
- [x] Delete unverified puzzles (>24h old)
- [x] Return correct deletion count
- [x] Handle zero deletions
- [x] Database error handling
- [x] Query verification (correct SQL)

### ✅ API Routes

- [x] Health check endpoint
- [x] Admin login - valid password
- [x] Admin login - invalid password
- [x] Admin login - missing password

### ⏭️ Skipped Tests (Require External API)

- [ ] AI puzzle generation with theme
- [ ] AI puzzle generation without theme
- [ ] AI puzzle validation

> **Note**: AI Service tests are skipped because they require actual Gemini API calls which may hit quota limits during testing. To enable them, remove `.skip` from test definitions and ensure valid `GEMINI_API_KEY` in `.env`.

## Test Structure

### Mock Strategy

- Database queries mocked with `jest.mock('../db')`
- External services (AI, puzzle, auth) mocked for API tests
- Isolation ensures fast, reliable tests

### Assertions

- Type checking with TypeScript
- Value assertions with Jest matchers
- Error handling validation
- HTTP status code verification

## Adding New Tests

### Example Test Template

```typescript
describe("Your Feature", () => {
  beforeEach(() => {
    // Setup before each test
    jest.clearAllMocks();
  });

  test("should do something", () => {
    // Arrange
    const input = "test";

    // Act
    const result = yourFunction(input);

    // Assert
    expect(result).toBe("expected");
  });
});
```

## Coverage Goals

Current coverage focus:

- ✅ Core business logic (Puzzle Service)
- ✅ Background jobs (Cleanup Service)
- ✅ Authentication (Admin Login)
- 🔄 Database operations (partially via service tests)
- ❌ WebSocket connections (not yet tested)
- ❌ Full API integration (only login tested)

## CI/CD Integration

Tests run automatically on:

- Local development (`npm test`)
- Pre-commit hooks (if configured)
- CI pipeline (GitHub Actions - if set up)

## Troubleshooting

### Test Timeouts

If AI tests timeout:

- Check API quota: `GEMINI_API_KEY` in `.env`
- Skip AI tests: Use `test.skip()`
- Increase timeout: Add third parameter to test (e.g., `30000`)

### Database Mock Issues

If database tests fail:

- Clear mocks: `jest.clearAllMocks()` in `beforeEach`
- Check mock return values: Include `rowCount` field
- Verify SQL queries match actual implementation

### API Test Failures

If API tests fail:

- Check environment variables (ADMIN_PASSWORD, JWT_SECRET)
- Verify response structure matches routes.ts
- Ensure express middleware is properly set up

## Future Test Improvements

1. **Integration Tests**

   - Full API endpoint testing
   - Database integration tests
   - WebSocket connection tests

2. **E2E Tests**

   - User flow testing
   - Puzzle creation → play → completion
   - Admin workflow tests

3. **Performance Tests**

   - Load testing for API endpoints
   - Database query optimization
   - Concurrent user handling

4. **Coverage Expansion**
   - Increase to 80%+ code coverage
   - Add edge case testing
   - Error boundary testing
