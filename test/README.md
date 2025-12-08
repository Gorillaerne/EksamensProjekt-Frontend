# Elvang Frontend Test Suite

This directory contains comprehensive unit tests for the Elvang warehouse management frontend application.

## Test Framework

- **Vitest**: Modern, fast test runner with native ES module support
- **jsdom**: DOM implementation for Node.js testing
- **happy-dom**: Alternative fast DOM implementation

## Running Tests

### Install Dependencies

```bash
npm install
```

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Generate Coverage Report

```bash
npm run test:coverage
```

## Test Structure

### Core Utilities (`ReusableFunctions.test.js`)
- **isTokenExpired()**: Token validation and expiration checking
- **authorizedFetch()**: Authenticated API requests
- **showOverlay()**: Modal overlay management

### UI Components

#### `searchBar.test.js`
- Product search functionality
- Autocomplete dropdown behavior
- Filter by name, SKU, price, description
- Result selection and display

#### `loginModule.test.js`
- Login form validation
- Authentication flow
- Token storage
- Error handling

#### `createProductModule.test.js`
- Product form creation
- Image preview functionality
- Form validation
- Product creation API calls

#### `createWarehouseModule.test.js`
- Warehouse form creation
- Input validation
- Warehouse creation flow

#### `dashboard.test.js`
- Dashboard rendering
- Card creation and interactions
- Token-based access control

#### `landingPageModule.test.js`
- Landing page structure
- Header/Hero/Story/Footer sections
- Conditional navigation based on auth state

#### `header.test.js`
- Header component structure
- Logo and search bar integration
- Logout functionality

### CSS Validation (`styles.test.js`)
- CSS syntax validation
- Critical selector verification
- Responsive design checks

## Test Coverage

The test suite aims for comprehensive coverage including:

- ✅ Happy path scenarios
- ✅ Edge cases and error conditions
- ✅ Input validation
- ✅ Network error handling
- ✅ Authentication flows
- ✅ DOM manipulation
- ✅ Event handlers
- ✅ Async operations

## Key Testing Patterns

### Mocking localStorage
```javascript
beforeEach(() => {
  localStorage.clear();
});
```

### Mocking fetch
```javascript
global.fetch.mockResolvedValueOnce({
  ok: true,
  json: async () => ({ data: 'test' })
});
```

### Testing JWT Tokens
```javascript
const futureTimestamp = Math.floor(Date.now() / 1000) + 3600;
const payload = { exp: futureTimestamp };
const token = `header.${btoa(JSON.stringify(payload))}.signature`;
localStorage.setItem('token', token);
```

### Testing DOM Events
```javascript
const button = module.querySelector('.m-submit');
button.click();
await new Promise(resolve => setTimeout(resolve, 10));
```

## Best Practices

1. **Clean State**: Each test starts with a clean slate (cleared localStorage, mocks)
2. **Isolation**: Tests don't depend on each other
3. **Descriptive Names**: Test names clearly describe what they're testing
4. **Async Handling**: Proper async/await usage for asynchronous operations
5. **Error Suppression**: Console errors are mocked to avoid noise during testing

## Common Issues

### FileReader Mock
If you see issues with file upload tests, ensure the FileReader mock in `setup.js` is properly configured.

### Fetch Responses
All fetch calls must be mocked before the test runs, or they will fail.

### Token Expiration
Be careful with token timestamps - use relative times (Date.now() + offset) rather than absolute values.

## Adding New Tests

1. Create a new test file in the `test/` directory
2. Follow the naming convention: `<moduleName>.test.js`
3. Import the module to test
4. Structure tests with `describe` and `it` blocks
5. Use `beforeEach` for setup and cleanup

Example:
```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import { myFunction } from '../Javascript/myModule.js';

describe('myModule', () => {
  beforeEach(() => {
    // Setup
  });

  describe('myFunction', () => {
    it('should do something', () => {
      const result = myFunction();
      expect(result).toBe('expected');
    });
  });
});
```

## CI/CD Integration

Tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run tests
  run: npm test

- name: Generate coverage
  run: npm run test:coverage
```

## Troubleshooting

### Tests Hanging
- Check for missing `await` on async functions
- Ensure all promises are resolved

### Unexpected Failures
- Clear node_modules and reinstall
- Check mock configurations in `setup.js`

### Coverage Issues
- Ensure all code paths are tested
- Check for untested branches in conditionals

## Contributing

When adding new features:
1. Write tests first (TDD approach)
2. Ensure all tests pass
3. Maintain coverage above 80%
4. Document complex test scenarios