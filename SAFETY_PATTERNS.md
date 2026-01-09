# Safety Patterns & Best Practices

This document outlines systematic safety patterns established across the codebase to prevent common security and reliability issues.

## Table of Contents
1. [Input Validation & Sanitization](#input-validation--sanitization)
2. [API Error Handling](#api-error-handling)
3. [Type-Safe Parsing](#type-safe-parsing)
4. [Safe Storage Access](#safe-storage-access)
5. [Form Validation](#form-validation)

---

## Input Validation & Sanitization

### Pattern
**Always validate and sanitize user input before processing or storing.**

### Location
`lib/validation.ts`

### Utilities Available

#### `sanitizeInput(input: string): string`
Removes potentially dangerous characters to prevent XSS attacks.
```typescript
import { sanitizeInput } from '../lib/validation';

const userInput = sanitizeInput(rawInput);
```

**What it does:**
- Removes `<` and `>` characters to prevent XSS
- Removes null bytes
- Trims whitespace
- Throws TypeError if input is not a string

#### `sanitizeEmail(email: string): string`
Normalizes email addresses.
```typescript
import { sanitizeEmail } from '../lib/validation';

const email = sanitizeEmail(rawEmail);
```

**What it does:**
- Converts to lowercase
- Trims whitespace
- Throws TypeError if input is not a string

#### `normalizePhoneNumber(phone: string): string`
Normalizes phone numbers to E.164 format.
```typescript
import { normalizePhoneNumber } from '../lib/validation';

const phone = normalizePhoneNumber(rawPhone);
```

**What it does:**
- Extracts digits only
- Converts 10-digit US numbers to `+1XXXXXXXXXX`
- Converts 11-digit numbers starting with 1 to `+1XXXXXXXXXX`
- Throws TypeError if input is not a string

### Usage Example
See `lib/api.ts:27-36` for the `sanitizeLeadData` function that demonstrates proper usage.

---

## API Error Handling

### Pattern
**Provide specific, actionable error messages based on error types.**

### Location
`lib/api.ts`

### APIError Class

Custom error class for better error handling:

```typescript
export class APIError extends Error {
    constructor(
        message: string,
        public code?: string,
        public statusCode?: number,
        public details?: unknown
    ) {
        super(message);
        this.name = 'APIError';
    }
}
```

### Error Handling Pattern

```typescript
try {
    await api.leads.create(data);
} catch (err) {
    if (err instanceof APIError) {
        // Handle specific API errors with user-friendly messages
        setError(err.message);
    } else {
        // Fallback for unexpected errors
        setError('Something went wrong. Please contact support.');
    }
}
```

### Implemented Error Codes

| Code | Status | Meaning |
|------|--------|---------|
| `VALIDATION_ERROR` | 400 | Input data failed validation |
| `DUPLICATE_ENTRY` | 409 | Resource already exists |
| `PERMISSION_DENIED` | 403 | User lacks necessary permissions |
| `NETWORK_ERROR` | 0 | Network connectivity issue |
| `SUBMISSION_ERROR` | 500 | Generic server error |
| `FETCH_ERROR` | 500 | Failed to retrieve data |

### Implementation Details
See `lib/api.ts:47-107` for the complete error handling implementation.

---

## Type-Safe Parsing

### Pattern
**Never use `parseInt()`, `parseFloat()`, or `Number()` directly. Use safe parsing utilities.**

### Location
`lib/validation.ts:82-97`

### Why This Matters
```typescript
// UNSAFE - Can produce NaN, which breaks calculations
const count = parseInt(userInput);
const total = count * 5; // NaN * 5 = NaN

// SAFE - Always returns a valid number
const count = safeParseInt(userInput, 0);
const total = count * 5; // 0 * 5 = 0 (fallback) or valid number
```

### Utilities Available

#### `safeParseInt(value: string | number, defaultValue: number = 0): number`
Safely parses integers with fallback.

```typescript
import { safeParseInt } from '../lib/validation';

// Range input
onChange={(e) => setGuestCount(safeParseInt(e.target.value, 10))}

// Number input
onChange={(e) => setUnits(Math.max(1, safeParseInt(e.target.value, 1)))}
```

#### `safeParseFloat(value: string | number, defaultValue: number = 0): number`
Safely parses floating point numbers with fallback.

```typescript
import { safeParseFloat } from '../lib/validation';

const price = safeParseFloat(priceInput, 0);
```

### Usage Examples
- `components/UnitCalculator.tsx:283` - Guest count slider
- `components/UnitCalculator.tsx:316` - Duration slider
- `components/EnhancedQuoteModal.tsx:274` - Units input

---

## Safe Storage Access

### Pattern
**Wrap all localStorage/sessionStorage access in try-catch. Use the safe wrapper.**

### Location
`lib/validation.ts:99-128`

### Why This Matters
LocalStorage can fail for several reasons:
- User has disabled storage
- Storage quota exceeded
- Private browsing mode
- Invalid JSON during parse

### Safe Wrapper API

```typescript
import { safeLocalStorage } from '../lib/validation';

// GET - Returns default value on error
const data = safeLocalStorage.getItem<MyType>('key', defaultValue);

// SET - Returns boolean success indicator
const success = safeLocalStorage.setItem('key', data);

// REMOVE - Returns boolean success indicator
const success = safeLocalStorage.removeItem('key');
```

### Usage Example

```typescript
// BEFORE (unsafe)
useEffect(() => {
    if (currentStep === 5) {
        localStorage.setItem('recommendations', JSON.stringify(recommendations));
    }
}, [currentStep, recommendations]);

// AFTER (safe)
useEffect(() => {
    if (currentStep === 5) {
        safeLocalStorage.setItem('recommendations', recommendations);
    }
}, [currentStep, recommendations]);
```

See `components/UnitCalculator.tsx:150` for implementation.

---

## Form Validation

### Pattern
**Validate on blur for immediate feedback, validate on submit for safety.**

### Location
`components/EnhancedQuoteModal.tsx:107-131`

### Implementation Pattern

```typescript
// 1. Add validation state
const [emailError, setEmailError] = useState('');
const [phoneError, setPhoneError] = useState('');

// 2. Create validation functions
const validateEmail = (email: string): boolean => {
    if (!email) return true; // Optional field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        setEmailError('Please enter a valid email address');
        return false;
    }
    setEmailError('');
    return true;
};

// 3. Add onBlur validation
<input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    onBlur={(e) => validateEmail(e.target.value)}
    className={emailError ? 'border-red-500' : 'border-border'}
/>
{emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}

// 4. Validate on submit
const handleSubmit = async () => {
    if (!validateEmail(email)) return;
    if (!validatePhone(phone)) return;
    // ... proceed with submission
};
```

### Validation Rules

#### Email (Optional)
- Regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Error: "Please enter a valid email address"

#### Phone (Required)
- Regex: `/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/`
- Error: "Please enter a valid phone number"

#### Name (Required)
- Min length: 2 characters
- Max length: 100 characters
- Sanitized before submission

---

## Implementation Checklist

When adding new features or forms, ensure you:

- [ ] Use `sanitizeInput()` for all text inputs
- [ ] Use `sanitizeEmail()` for email fields
- [ ] Use `normalizePhoneNumber()` for phone fields
- [ ] Use `safeParseInt()` instead of `parseInt()` or `Number()`
- [ ] Use `safeLocalStorage` instead of `localStorage`
- [ ] Implement validation functions for all input fields
- [ ] Add `onBlur` validation for immediate feedback
- [ ] Add validation checks in submit handlers
- [ ] Handle `APIError` instances specifically
- [ ] Provide user-friendly error messages
- [ ] Test with invalid inputs (empty, null, undefined, malformed)

---

## References

- **OWASP XSS Prevention**: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- **OWASP Input Validation**: https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html
- **MDN Web Storage API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API

---

## Questions or Improvements?

If you identify new safety patterns or improvements to existing ones, please update this document and the corresponding code implementations.
