# Quick Test Guide for Elvang Frontend

## Setup (First Time Only)

```bash
npm install
```

## Running Tests

### Run all tests once
```bash
npm test
```

### Run tests in watch mode (re-runs on file changes)
```bash
npm run test:watch
```

### Generate coverage report
```bash
npm run test:coverage
```

## Test Files Overview

| File | What It Tests |
|------|---------------|
| `ReusableFunctions.test.js` | Token validation, authorized fetch, overlay functionality |
| `searchBar.test.js` | Product search, autocomplete, filtering |
| `loginModule.test.js` | Login form, authentication, token storage |
| `createProductModule.test.js` | Product creation form, image upload, validation |
| `createWarehouseModule.test.js` | Warehouse creation form, validation |
| `dashboard.test.js` | Dashboard rendering, card interactions |
| `landingPageModule.test.js` | Landing page structure, navigation |
| `header.test.js` | Header component, logout functionality |
| `styles.test.js` | CSS validation and structure |

## Test Statistics

- **Total test files**: 9
- **Estimated total tests**: 250+
- **Coverage target**: 80%+

## What's Being Tested

✅ **Happy Paths**: Normal user workflows and expected behavior  
✅ **Edge Cases**: Empty inputs, whitespace, special characters  
✅ **Error Handling**: Network failures, invalid data, malformed tokens  
✅ **Validation**: Input validation, form requirements  
✅ **Authentication**: Token management, expiration, logout  
✅ **DOM Manipulation**: Element creation, event handling  
✅ **Async Operations**: API calls, promises, async/await  
✅ **UI Components**: Forms, buttons, overlays, search  
✅ **CSS Structure**: Valid syntax, responsive design, animations  

## Common Test Patterns Used

### Testing Async Functions
```javascript
it('should fetch data', async () => {
  global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
  await myAsyncFunction();
  expect(global.fetch).toHaveBeenCalled();
});
```

### Testing DOM Events
```javascript
it('should handle click', async () => {
  const button = element.querySelector('button');
  button.click();
  await new Promise(resolve => setTimeout(resolve, 10));
  expect(someEffect).toHaveOccurred();
});
```

### Testing Token Validation
```javascript
it('should validate token', () => {
  const token = `header.${btoa(JSON.stringify({ exp: Date.now()/1000 + 3600 }))}.sig`;
  localStorage.setItem('token', token);
  expect(isTokenExpired()).toBe(false);
});
```

## Troubleshooting

### "Module not found" errors
- Run `npm install` to install dependencies
- Check that all test files are in the `test/` directory

### Tests hanging or timing out
- Ensure all async functions use `await`
- Check that fetch is properly mocked
- Verify promises are resolved

### Unexpected failures
- Clear `node_modules` and run `npm install` again
- Check that `test/setup.js` is configured correctly
- Ensure localStorage is cleared in beforeEach

## Next Steps

1. Install dependencies: `npm install`
2. Run tests: `npm test`
3. Check coverage: `npm run test:coverage`
4. Review failures and fix issues
5. Maintain tests as you add features

## Best Practices

- ✅ Write tests before or alongside new features
- ✅ Keep tests isolated and independent
- ✅ Use descriptive test names
- ✅ Mock external dependencies
- ✅ Test both success and failure cases
- ✅ Aim for high coverage but focus on critical paths

## Need Help?

- Check `test/README.md` for detailed documentation
- Review existing test files for examples
- Ensure mocks in `test/setup.js` match your needs