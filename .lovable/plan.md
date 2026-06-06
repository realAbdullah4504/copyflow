

# Fix All Build Errors

This plan addresses all the TypeScript build errors in the project, organized by category.

## 1. Missing Dependencies (UI components referencing uninstalled packages)

Several UI components import packages that aren't installed. These files are unused scaffolding from shadcn/ui and can be safely removed or stubbed:

- `src/components/ui/calendar.tsx` - missing `react-day-picker`
- `src/components/ui/carousel.tsx` - missing `embla-carousel-react`
- `src/components/ui/chart.tsx` - missing `recharts`
- `src/components/ui/drawer.tsx` - missing `vaul`
- `src/components/ui/input-otp.tsx` - missing `input-otp`
- `src/components/ui/resizable.tsx` - missing `react-resizable-panels`
- `src/components/ui/toaster.tsx` - missing `@/hooks/use-toast`
- `src/components/ui/index.tsx` - imports missing `./data-table`

**Fix**: Delete these unused UI component files, or remove them from exports. Update `src/components/ui/index.tsx` to remove the `data-table` export.

## 2. Generic Form Component Type Issue

`src/components/common/Form.tsx` is hardcoded to `SubmissionFormValues` type, making it incompatible with `UserForm.tsx`.

**Fix**: Make `Form.tsx` generic using `UseFormReturn<any>` and `FieldValues` so it works with any form schema.

## 3. FormField Missing "email" Type

`src/components/common/FormField.tsx` doesn't include `"email"` in its type union, but `UserForm.tsx` uses `type: "email"`.

**Fix**: Add `"email"` to the `type` union in `FormField.tsx`. The `"email"` case falls through to the default `<Input>` handler, so no logic change needed.

## 4. Unused Imports / Variables

- `src/components/classes/modals/ClassModal.tsx` - remove unused `ClassEntity` import
- `src/components/guards/ProtectedRoute.tsx` - remove unused `Outlet` import
- `src/pages/auth/LoginPage.tsx` - remove unused `toast` import
- `src/pages/dashboard/admin/DashboardPage.tsx` - remove unused `useQuery` import
- `src/pages/dashboard/admin/UsersPage.tsx` - remove unused `React` import
- `src/pages/dashboard/secretary/SecretaryPage.tsx` - remove unused `Archive` and `AlertTriangle` imports

## 5. Type Mismatches

### ClassModal.tsx (line 41)
`ClassEntityV2` missing `lessonDays` for `ClassesWithSchedules`. 
**Fix**: Change the prop type from `ClassesWithSchedules` to `ClassEntityV2` where appropriate, or add `lessonDays` with a default.

### Icons index.tsx (line 4)
`IconName` not exported from `@/types`.
**Fix**: Define `IconName` type locally in the icons file.

### EditSubmissionModal.tsx (lines 128, 176)
- `f.file` typed as `unknown` - add proper type assertion
- `string[]` not assignable to `File[]` - fix `generateSubmissionPDF` call to pass `File[]`

### ViewSubmissionModal.tsx (line 253)
`Uint8Array` not assignable to `BlobPart` - cast with `as Uint8Array`.

### pagination.tsx (line 5)
`ButtonProps` needs a type-only import.
**Fix**: Change to `import type { ButtonProps }`.

### LoginPage.tsx (line 69)
`string | undefined` passed where `string` required.
**Fix**: Add fallback: `|| ""`.

### DashboardPage.tsx and SecretaryPage.tsx
`trendType` is `string` but needs to be `"up" | "down" | "neutral"`.
**Fix**: Add `as const` assertions on the trendType values.

### TeacherPage.tsx (lines 62-69)
`submissions` returns `{ data: Submission[]; total: number }` but code treats it as `Submission[]`.
**Fix**: Destructure properly: `const { data: submissions = [], ... }` or access `.data`.

## 6. Mock Data Issues

### constants/mockUsers.ts
Imports from `@/types/user` (wrong path).
**Fix**: Change to `@/types`.

### constants/classes.ts
Missing `label` property in generated mock classes.
**Fix**: Add `label` field.

### constants/submissions.ts
Multiple type mismatches (class as string, files as string, lessonDate as Date, missing printSettings fields).
**Fix**: Update mock data to match current `Submission` type.

## Technical Details

All fixes are straightforward type corrections and import cleanup. No behavioral changes. The fixes will be applied file by file, prioritizing the ones that block compilation.

