# Utils

This folder contains reusable utility functions and helpers that can be used throughout the application.

## Structure

- **validators.ts** - Validation functions (email, password, etc.)
- **formatters.ts** - Formatting functions (dates, currency, text, etc.)

## Usage

```typescript
import { isValidEmail, formatDate } from '"@/utils"';

// Validation
if (isValidEmail(email)) {
  // ...
}

// Formatting
const formattedDate = formatDate(new Date());
```

## Guidelines

- Keep functions pure (no side effects)
- Each function should have a single responsibility
- Add JSDoc comments for complex functions
- Write unit tests for utility functions
