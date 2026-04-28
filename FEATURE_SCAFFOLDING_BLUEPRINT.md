# Feature Implementation Guide

> This guide explains how to implement a new full-CRUD resource in this codebase.
> Every step follows the established pattern. Read this fully before writing any code.
>
> **Convention used throughout:**
>
> - `<resource>` — plural kebab-case name, e.g. `test-units`, `departments`
> - `<Resource>` — PascalCase singular, e.g. `TestUnit`, `Department`
> - `<resourceCamel>` — camelCase singular, e.g. `testUnit`, `department`

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Folder Structure](#2-folder-structure)
3. [Developer Workflow — What You Define vs. What the Agent Completes](#3-developer-workflow)
4. [Step 1 — Define Resource Types](#step-1--define-resource-types)
5. [Step 2 — Create the API Client](#step-2--create-the-api-client)
6. [Step 3 — Register Modal IDs](#step-3--register-modal-ids)
7. [Step 4 — Create Query Keys](#step-4--create-query-keys)
8. [Step 5 — Create Query & Mutation Options](#step-5--create-query--mutation-options)
9. [Step 6 — Define the Form Schema](#step-6--define-the-form-schema)
10. [Step 7 — Infer Form Types](#step-7--infer-form-types)
11. [Step 8 — Create the Form Hook](#step-8--create-the-form-hook)
12. [Step 9 — Create the Form Context Helper](#step-9--create-the-form-context-helper)
13. [Step 10 — Build Form Fields](#step-10--build-form-fields)
14. [Step 11 — Build the Create Form](#step-11--build-the-create-form)
15. [Step 12 — Build the Update Form](#step-12--build-the-update-form)
16. [Step 13 — Build the Create Button / Trigger](#step-13--build-the-create-button--trigger)
17. [Step 14 — Build the Update Modal Wrapper](#step-14--build-the-update-modal-wrapper)
18. [Step 15 — Build the Resource Table](#step-15--build-the-resource-table)
19. [Step 16 — Build the Page](#step-16--build-the-page)
20. [Rendering on a Page vs. a Modal](#rendering-on-a-page-vs-a-modal)
21. [Auth — Future Integration](#auth--future-integration)
22. [Quick Reference Checklist](#quick-reference-checklist)

---

## 1. Architecture Overview

```
Server (Next.js RSC)
  └─ Prefetcher              ← fetches data via serverHttp, seeds the TanStack Query cache
       └─ HydrationBoundary  ← serialises the cache and sends it to the client

Client
  └─ useSuspenseQuery        ← reads from the already-hydrated cache; zero extra network request
  └─ useMutation             ← calls the API client, then invalidates the relevant query keys
  └─ DialogProvider          ← manages all open modals as a flat array; supports stacking
  └─ ErrorBoundary           ← catches render-time errors without crashing the whole page
```

**Key design decisions — respect these in every feature:**

| Decision                                                          | Why                                                                                                                                                       |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Prefetcher` accepts an array of `fetchQueryOptions`              | A single page may need to prefetch multiple resources. Always add to the array, never nest a second `Prefetcher`.                                         |
| Query options live in `<resource>-queries-options.ts`, not inline | The same options object can be imported and reused by other resources without duplicating the API call or cache key.                                      |
| Form fields are a separate component from the form wrapper        | `<ResourceFormFields />` is shared by both the create and update form. Validation and field UI live in exactly one place.                                 |
| `use<Resource>Form` accepts `initialValue?`                       | Create forms call it with no arguments. Update forms pass the existing record. One hook, two modes.                                                       |
| `use<Resource>FormContext` wraps `useFormContext`                 | Fields stay fully decoupled from the form wrapper. Always use this helper — even for single-field forms — so the pattern is consistent as the form grows. |
| `MODAL_REGISTRY` is the single source of truth for modal IDs      | Hard-coded strings cause silent bugs. Always register IDs here.                                                                                           |

---

## 2. Folder Structure

Every resource lives under `src/app/(dashboard)/<resource>/`. The complete structure is:

```
src/
├── types/
│   └── <resource>.ts                                  ← global entity type (Step 1)
│
└── app/
    └── (dashboard)/
        └── <resource>/
            ├── page.tsx                               ← RSC page; owns the Prefetcher (Step 16)
            │
            ├── client/
            │   └── <resource>-client.ts               ← API client class (Step 2)
            │
            ├── constants/
            │   └── <resource>.queryKeys.ts            ← createQueryKeys(...) (Step 4)
            │
            ├── hooks/
            │   ├── use-<resource>-form.ts             ← react-hook-form wrapper (Step 8)
            │   └── queries/
            │       └── <resource>-queries-options.ts  ← all query & mutation options (Step 5)
            │
            ├── schemas/
            │   └── <resource>-form.schema.ts          ← zod schema (Step 6)
            │
            ├── types/
            │   └── <resource>-form.types.ts           ← inferred zod types (Step 7)
            │
            ├── contexts/
            │   └── <resource>-form.context.ts         ← typed useFormContext helper (Step 9)
            │
            └── components/
                ├── <resource>-form-fields.tsx          ← shared field components (Step 10)
                ├── <resource>-create-form.tsx          ← create form wrapper (Step 11)
                ├── update-<resource>-form.tsx          ← update form wrapper (Step 12)
                ├── create-<resource>-button.tsx        ← trigger that opens create modal (Step 13)
                ├── update-<resource>-modal.tsx         ← modal shell for update form (Step 14)
                └── <resource>-table.tsx                ← data table with actions (Step 15)
```

Two **global** files are also touched for every new resource:

```
src/
├── types/
│   └── <resource>.ts                        ← new file
└── constants/
    └── modal/
        └── modal-component-registry.ts      ← add new modal IDs here
```

---

## 3. Developer Workflow

You define the files that require domain knowledge of the backend. The agent derives everything else from those files.

### You define (requires knowledge of the backend contract):

| File                                              | Why you define it                                                              |
| ------------------------------------------------- | ------------------------------------------------------------------------------ |
| `src/types/<resource>.ts`                         | You know the exact shape the backend returns                                   |
| `.../client/<resource>-client.ts`                 | You know the endpoints, HTTP methods, and response shapes                      |
| `.../hooks/queries/<resource>-queries-options.ts` | You know which query keys to use and what invalidation strategy is appropriate |
| `.../schemas/<resource>-form.schema.ts`           | You know which fields the form needs and what validation rules apply           |

### The agent derives from those four files:

Once the files above exist, the agent can read them and auto-generate all remaining steps in order:

- **Step 3** — Modal IDs → derived from the resource name
- **Step 4** — `<resource>.queryKeys.ts` → derived from the resource name and keys used in the options file
- **Step 7** — `<resource>-form.types.ts` → inferred directly from the schema
- **Step 8** — `use-<resource>-form.ts` → derived from the types; default values match schema fields
- **Step 9** — `<resource>-form.context.ts` → derived from the types; a single typed `useFormContext` wrapper
- **Steps 10–16** — all components and the page → derived from the client, options, and types files

> **Prompt to use with the agent:**
> _"I have defined the types, client, queries-options, and schema for `<resource>`. Please complete all remaining steps in the Feature Implementation Guide."_

---

## Step 1 — Define Resource Types

**File:** `src/types/<resource>.ts`

Define the canonical shape of the entity as returned by the backend. This file lives in `src/types/` (global) because other resources may need to reference it.

**What to include:**

- The primary key: always `id: number`
- All fields the backend returns, using their exact response key names
- `createdAt: string` and `updatedAt: string` for timestamped entities (ISO 8601 — format at render time, never in the type)
- Nested relations as their own type, imported from `src/types/<related-resource>.ts`

**Rules:**

- Never use `string` for numeric IDs.
- Never add computed, derived, or UI-only fields. This type mirrors the backend response exactly.

---

## Step 2 — Create the API Client

**File:** `src/app/(dashboard)/<resource>/client/<resource>-client.ts`

A class that encapsulates every HTTP operation for this resource, instantiated once and exported as a singleton `const`.

**Structure — one method per API operation:**

| Method                              | HTTP   | Path              | Body                            | Returns (data shape)                       |
| ----------------------------------- | ------ | ----------------- | ------------------------------- | ------------------------------------------ |
| `create<Resource>(data)`            | POST   | `/<resource>`     | `<Resource>FormValues`          | `{ <resourceCamel>: <Resource> }`          |
| `getAll<Resource>({ page, limit })` | GET    | `/<resource>`     | —                               | `{ <resource>: <Resource>[]; meta: Meta }` |
| `get<Resource>ById(id)`             | GET    | `/<resource>/:id` | —                               | `{ <resourceCamel>: <Resource> }`          |
| `update<Resource>(id, data)`        | PATCH  | `/<resource>/:id` | `Partial<<Resource>FormValues>` | `{ <resourceCamel>: <Resource> }`          |
| `delete<Resource>(id)`              | DELETE | `/<resource>/:id` | —                               | `{ <resourceCamel>: <Resource> }`          |

**Rules:**

- Store the endpoint path as a `private readonly` class property to avoid duplication.
- All methods use `clientHttp` from `@/lib/axios/client.axios` — never `serverHttp`.
- The type generic on `clientHttp.get<T>` / `.post<T>` / `.patch<T>` / `.delete<T>` is the shape of `data` inside `ApiSuccess<T>` — not the full envelope.
- The response key names must match exactly what the backend sends (e.g. `{ testUnit: {...} }`, not `{ data: {...} }`).

---

## Step 3 — Register Modal IDs

**File:** `src/constants/modal/modal-component-registry.ts`

Add the new resource's modal IDs to the `MODAL_REGISTRY` object. Never use hard-coded modal ID strings anywhere else in the codebase.

**Naming convention:**

| Modal       | Key                          | Value                 |
| ----------- | ---------------------------- | --------------------- |
| Create form | `CREATE_<RESOURCE>_MODAL_ID` | `'create-<resource>'` |
| Update form | `UPDATE_<RESOURCE>_MODAL_ID` | `'update-<resource>'` |

`<RESOURCE>` is `SCREAMING_SNAKE_CASE`. `<resource>` is `kebab-case`.

> The delete confirmation does **not** need a registry entry. It uses a local `AlertDialog` managed by component state — see Step 15.

---

## Step 4 — Create Query Keys

**File:** `src/app/(dashboard)/<resource>/constants/<resource>.queryKeys.ts`

Call `createQueryKeys` (from `@/lib/query-key.factory`) with the plural kebab-case resource name as the string identifier.

This produces four key shapes:

| Key             | Shape                                     | When to use                                                                        |
| --------------- | ----------------------------------------- | ---------------------------------------------------------------------------------- |
| `.all`          | `['<resource>']`                          | **Invalidation only** — busts the full resource cache after any mutation           |
| `.list(params)` | `['<resource>', 'list', { page, limit }]` | Paginated list queries — used in `getAll<Resource>Options` and in the `Prefetcher` |
| `.detail(id)`   | `['<resource>', 'detail', id]`            | Single-record fetch by ID                                                          |
| `.options`      | `['<resource>', 'options']`               | Lightweight lists for dropdowns/selects in other resources' forms                  |

**Rules:**

- Use `.list({ page, limit })` for all list/paginated queries — never `.all` for fetching.
- Use `.all` **only** inside `queryClient.invalidateQueries(...)` in mutation `onSuccess` handlers.
- The key used in the `Prefetcher` on the page **must exactly match** the key produced by the corresponding query options function. A mismatch causes a second network request instead of reading the hydrated cache.

---

## Step 5 — Create Query & Mutation Options

**File:** `src/app/(dashboard)/<resource>/hooks/queries/<resource>-queries-options.ts`

One exported function per API operation. Each returns a TanStack Query options object that can be plugged directly into `useQuery`, `useSuspenseQuery`, or `useMutation`.

**Why this pattern exists:** If another resource needs this resource's data (e.g. a selector), it imports the options function from this file. TanStack Query returns the cached result — no extra network request.

---

### `getAll<Resource>Options({ page, limit })`

- Return type: `UseSuspenseQueryOptions<{ <resource>: <Resource>[]; meta: Meta }>`
- `queryKey`: `<resource>QueryKeys.list({ page, limit })`
- `queryFn`: call `<resource>Client.getAll<Resource>({ page, limit })`, return `response.data`

---

### `get<Resource>ByIdOptions(id)`

- Return type: `UseQueryOptions<{ <resourceCamel>: <Resource> }>`
- `queryKey`: `<resource>QueryKeys.detail(id)`
- `queryFn`: call `<resource>Client.get<Resource>ById(id)`, return `response.data`

---

### `create<Resource>Options({ queryClient, options? })`

- Accepts the caller's `UseMutationOptions` as an optional `options` param
- Returned object: spread caller's `options` first, then override:
  - `mutationFn`: calls `<resource>Client.create<Resource>(data)`
  - `onSuccess`: invalidates `<resource>QueryKeys.all`, then calls `options?.onSuccess?.(...args)`
  - `onError`: calls `options?.onError?.(...args)`

---

### `update<Resource>Options({ queryClient, options? })`

- Same shape as create
- `mutationFn` receives `{ id: number; data: Partial<<Resource>FormValues> }`
- Invalidates `.all` on success

---

### `delete<Resource>Options({ queryClient, options? })`

- Same shape as create
- `mutationFn` receives `id: number`
- Invalidates `.all` on success

---

**Rules applying to all mutation options functions:**

- Always spread the caller's `options` at the top so every property can be overridden except `mutationFn`.
- Always call the caller's `onSuccess`/`onError` callbacks **after** built-in side effects (invalidation etc.).
- Never call `toast` in this file. Toasts are the responsibility of the consuming component.

---

## Step 6 — Define the Form Schema

**File:** `src/app/(dashboard)/<resource>/schemas/<resource>-form.schema.ts`

A Zod object schema — one field per piece of data the form submits to the API.

**Rules:**

- Every field must have an explicit, human-readable error message — never rely on Zod's defaults.
- Use Zod transforms (`.trim()`, `.toUpperCase()`, `.toLowerCase()`) to normalise data before it reaches the API.
- Do not include UI-only fields (e.g. a "confirm" toggle that doesn't get sent). The schema reflects exactly what the API receives.
- For relation fields (e.g. `departmentId`), use `z.number().positive('Field is required')`.

---

## Step 7 — Infer Form Types

**File:** `src/app/(dashboard)/<resource>/types/<resource>-form.types.ts`

```ts
export type <Resource>FormValues = z.infer<typeof <resource>FormSchema>;
```

Never write the form type by hand. Infer it from the schema so changes to the schema automatically propagate to the type. This file exists solely to give other files a clean, stable import path.

---

## Step 8 — Create the Form Hook

**File:** `src/app/(dashboard)/<resource>/hooks/use-<resource>-form.ts`

A `'use client'` hook wrapping `useForm` from `react-hook-form`.

**Signature:**

```ts
function use<Resource>Form({ initialValue }?: { initialValue?: Partial<<Resource>FormValues> })
```

**Structure:**

- Define a `defaultValues` constant above the function, typed as `<Resource>FormValues`, with an empty/zero value for every field (`''` for strings, `0` for numbers, `false` for booleans)
- Spread into form: `{ ...defaultValues, ...initialValue }` — partial updates never produce `undefined` values
- Resolver: `zodResolver(<resource>FormSchema)`

**Usage:**

- Create form: `use<Resource>Form()` — no arguments, all defaults
- Update form: `use<Resource>Form({ initialValue: { name: record.name, ... } })` — pre-populated from the existing record

---

## Step 9 — Create the Form Context Helper

**File:** `src/app/(dashboard)/<resource>/contexts/<resource>-form.context.ts`

A `'use client'` file exporting a single typed wrapper over `react-hook-form`'s `useFormContext`:

```ts
export default function use<Resource>FormContext() {
  return useFormContext<<Resource>FormValues>();
}
```

This keeps `<ResourceFormFields />` fully decoupled from the form wrapper — fields never need to import the form values type directly.

Apply this step for every resource, even single-field forms. Consistency matters and forms always grow.

---

## Step 10 — Build Form Fields

**File:** `src/app/(dashboard)/<resource>/components/<resource>-form-fields.tsx`

A `'use client'` component rendering the input fields only. It has no knowledge of submit logic, mutation state, or which form (create vs update) wraps it.

**Rules:**

- Read all form state through `use<Resource>FormContext()` — never accept the form as a prop.
- Wrap every field in a `<Controller>` from `react-hook-form`.
- Use `<Field>`, `<FieldLabel>`, `<FieldError>` from `@/components/ui/field`.
- Every input has a unique `id` matching its `<FieldLabel>`'s `htmlFor`. Convention: `form-<resource>-<field-name>`.
- Render `<FieldError>` only when `fieldState.invalid` is true.
- Set `data-invalid={fieldState.invalid}` on `<Field>` and `aria-invalid={fieldState.invalid}` on the input.
- If a field is a relational selector (e.g. a department dropdown), call `useSuspenseQuery(getAll<RelatedResource>Options(...))` directly inside this component — it will hit the cache.
- Never call `useMutation` here.

---

## Step 11 — Build the Create Form

**File:** `src/app/(dashboard)/<resource>/components/<resource>-create-form.tsx`

A `'use client'` component. The `FormProvider` wrapper plus submit handler for creating a new record.

**Structure:**

1. Call `use<Resource>Form()` — no initial value (create mode)
2. Call `useMutation(create<Resource>Options({ queryClient, options: { onSuccess, onError } }))`
3. `onSuccess`: `form.reset()` → `toast.success(data.message)` → `closeModal(MODAL_REGISTRY.CREATE_<RESOURCE>_MODAL_ID)`
4. `onError`: `toast.error(error.message)`
5. Derive `isLoading` from `form.formState.isSubmitting || isPending`
6. Return `<FormProvider {...form}>` wrapping a `<form>` element
7. Inside: `<FieldGroup>` → `<ResourceFormFields />` → Cancel and Submit buttons
8. Cancel calls `closeModal(MODAL_REGISTRY.CREATE_<RESOURCE>_MODAL_ID)`
9. Submit is `disabled={isLoading}` with a loading label

**Form `id` convention:** `form-create-<resource>`

---

## Step 12 — Build the Update Form

**File:** `src/app/(dashboard)/<resource>/components/update-<resource>-form.tsx`

Identical structure to the create form with two differences:

1. Accepts `{ id: number; data: <Resource> }` as props
2. Calls `use<Resource>Form({ initialValue: { ...fieldsFromData } })` to pre-populate

**`onSuccess`:** `form.reset()` → `toast.success(response.message)` → `closeModal(MODAL_REGISTRY.UPDATE_<RESOURCE>_MODAL_ID)`

**Mutation used:** `update<Resource>Options`, with variables `{ id, data: formData }`

**Form `id` convention:** `form-update-<resource>`

---

## Step 13 — Build the Create Button / Trigger

**File:** `src/app/(dashboard)/<resource>/components/create-<resource>-button.tsx`

A `'use client'` component — the sole entry point for opening the create modal. Renders a `<Button>` with a `+` icon that calls `openModal(MODAL_REGISTRY.CREATE_<RESOURCE>_MODAL_ID, <content>)`.

**Modal content structure:**

```
<DialogContent>           ← responsive sizing (see rule below)
  <DialogHeader>
    <DialogTitle>         ← "Add New <Resource>"
    <DialogDescription>  ← brief description
  <ResourceCreateForm />
```

**Rules:**

- `DialogContent`, `DialogHeader`, `DialogTitle`, and `DialogDescription` belong here — not inside the form. This keeps the form renderable outside a dialog (e.g. on a full page) without the dialog chrome.
- Standard responsive `className` on `DialogContent`: `mx-2 max-w-[95vw] p-4 sm:mx-4 sm:max-w-[90vw] sm:p-6 md:max-w-lg lg:max-w-xl xl:max-w-2xl`

---

## Step 14 — Build the Update Modal Wrapper

**File:** `src/app/(dashboard)/<resource>/components/update-<resource>-modal.tsx`

A thin shell providing the `DialogContent` chrome for the update form. Instantiated inline when the user clicks "Update" in the table.

**Props:** `{ id: number; data: <Resource> }`

**Structure:**

```
<DialogContent>             ← same responsive className as Step 13
  <DialogHeader>
    <DialogTitle>           ← "Update <Resource>"
    <DialogDescription>    ← e.g. "Editing: {data.<nameField>}"
  <Update<Resource>Form id={id} data={data} />
```

---

## Step 15 — Build the Resource Table

**File:** `src/app/(dashboard)/<resource>/components/<resource>-table.tsx`

A `'use client'` component. Reads from the hydrated cache via `useSuspenseQuery` and handles pagination, update, and delete.

### State

| Variable          | Type             | Purpose                                           |
| ----------------- | ---------------- | ------------------------------------------------- |
| `page`            | `number`         | Current page, starts at `1`                       |
| `limit`           | `number`         | Items per page, typically `10`                    |
| `pendingDeleteId` | `number \| null` | ID queued for deletion; drives the confirm dialog |

### Data fetching

Call `useSuspenseQuery(getAll<Resource>Options({ page, limit }))` — this uses the `.list({ page, limit })` key and reads from the hydrated cache on initial render.

### Delete confirmation pattern

This is a **local `AlertDialog`** controlled by `pendingDeleteId` state. It does not use `DialogProvider` and does not need a `MODAL_REGISTRY` entry.

1. "Delete" dropdown item → sets `pendingDeleteId` to the row's `id`. Does **not** call the mutation directly.
2. `<AlertDialog open={pendingDeleteId !== null}>` renders at the top of the component.
3. `AlertDialogCancel` → resets `pendingDeleteId` to `null`.
4. `AlertDialogAction` → calls `delete<Resource>(pendingDeleteId)`, is `disabled={isDeleting}`.
5. Mutation `onSuccess` and `onError` → both reset `pendingDeleteId` to `null` and show a toast.

### Update action

The "Update" dropdown item calls:

```ts
openModal(
  MODAL_REGISTRY.UPDATE_<RESOURCE>_MODAL_ID,
  <Update<Resource>Modal id={row.id} data={row} />
)
```

The modal content is instantiated inline so it receives the current row data directly.

### Pagination

- Render pagination controls only when `totalPages > 1`
- Use the `<Pagination>` family from `@/components/ui/pagination`
- Page change: `if (newPage < 1 || newPage > totalPages) return; setPage(newPage)`
- Page number list: show up to 7 pages directly; use ellipsis for larger ranges

### Table structure

- Columns: `ID` → resource fields → `Created At` → `Actions` (right-aligned, no heading text)
- Actions column: a `<DropdownMenu>` with "Update" and "Delete" items, visible on row hover
- Empty state: a single `<TableRow>` spanning all columns, centred, muted text: `"No <resource> found."`

---

## Step 16 — Build the Page

**File:** `src/app/(dashboard)/<resource>/page.tsx`

A React Server Component (no `'use client'` directive). Owns the `Prefetcher` and composes the page layout.

**Structure:**

```tsx
<Prefetcher fetchQueryOptions={[
  {
    queryKey: <resource>QueryKeys.list({ page: 1, limit: 10 }),
    queryFn: async () => {
      const response = await serverHttp.get<{ <resource>: <Resource>[]; meta: Meta }>(
        '<resource>',
        { params: { page: 1, limit: 10 } }
      );
      return response.data;
    },
  },
  // add additional prefetch entries here if the page needs more data
]}>
  <div className="flex items-center justify-between">
    <h2 className="text-2xl font-semibold"><Resource Plural Label></h2>
    <Create<Resource>Button />
  </div>

  <ErrorBoundary fallback={<p>Failed to load <resource>. Please refresh.</p>}>
    <<Resource>Table />
  </ErrorBoundary>
</Prefetcher>
```

### Critical rule — the Prefetcher key must match the query options key exactly

The `queryKey` in the `Prefetcher` and the `queryKey` inside `getAll<Resource>Options` must be identical — same key factory function, same parameters. If they differ, the client skips the hydrated cache and makes a second network request, defeating the purpose of the prefetch.

**Rules:**

- Use `serverHttp` (from `@/lib/axios/server.axios`) in the Prefetcher `queryFn` — never `clientHttp`.
- Wrap the table in `<ErrorBoundary>` with a meaningful fallback message.
- For pages that need multiple prefetched resources, add them as additional entries in the `fetchQueryOptions` array. Never add a second `<Prefetcher>`.

---

## Rendering on a Page vs. a Modal

Form components (`<ResourceCreateForm />`, `<UpdateResourceForm />`) are isolated from their rendering context by design. The same component can be rendered in a modal or on a full page without modification.

### Modal (default)

Open via `openModal(...)` from a button or table action. The `DialogContent` chrome lives in the button trigger (Step 13) or modal wrapper (Step 14) — not inside the form.

### Full Page

Create a route at `src/app/(dashboard)/<resource>/new/page.tsx` and render the form directly. When rendered on a page, `closeModal(...)` silently no-ops. Replace it with `router.push('/<resource>')` using `useRouter` from `next/navigation`.

The cleanest approach: accept an `onSuccess?: () => void` prop on the form component and let the caller decide the post-submit behaviour (close modal vs. navigate).

### Stacked Modals

`DialogProvider` renders all modals in a flat array and supports multiple simultaneously open modals. If a form field needs a resource that doesn't exist yet, add a quick-add trigger inside `<ResourceFormFields />`:

```tsx
const { openModal } = useDialogContext();

// Render this next to the relational selector field:
<Button
  type="button"
  variant="ghost"
  size="sm"
  onClick={() =>
    openModal(
      MODAL_REGISTRY.CREATE_<RELATED_RESOURCE>_MODAL_ID,
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quick Add <RelatedResource></DialogTitle>
        </DialogHeader>
        <RelatedResourceCreateForm />
      </DialogContent>
    )
  }
>
  + Add <RelatedResource>
</Button>
```

When the related resource is created its modal closes, the parent modal remains open, and the new record is immediately available in the selector because its mutation invalidated the relevant cache key.

---

## Auth — Future Integration

Auth does not need to be implemented per-feature. When auth is wired up it applies automatically through the existing infrastructure:

- **`serverHttp`** (`src/lib/axios/server.axios.ts`) already reads the `access_token` cookie and attaches `Authorization: Bearer <token>` to every server-side request. No changes needed in any resource's page or prefetcher.
- **`clientHttp`** (`src/lib/axios/client.axios.ts`) already handles `401` responses with a silent token refresh and a failed-request queue. If the refresh fails, the error propagates to the auth layer.
- **Route guarding** will wrap the `(dashboard)` layout or individual routes — not individual resource components.

You do not need to add any auth code when implementing a new feature.

---

## Quick Reference Checklist

Copy this for each new resource. Complete steps in order — each depends on the previous one.

```
RESOURCE (kebab-case plural):   _______________   e.g. test-units
RESOURCE (PascalCase singular): _______________   e.g. TestUnit
RESOURCE (camelCase singular):  _______________   e.g. testUnit
API ENDPOINT:                   _______________   e.g. /test-units

━━━ YOU DEFINE (domain knowledge required) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  [ ] src/types/<resource>.ts                                          Step 1
  [ ] .../client/<resource>-client.ts                                  Step 2
  [ ] .../hooks/queries/<resource>-queries-options.ts                  Step 5
  [ ] .../schemas/<resource>-form.schema.ts                            Step 6

━━━ AGENT DERIVES FROM THE FILES ABOVE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  [ ] src/constants/modal/modal-component-registry.ts  (add IDs)       Step 3
  [ ] .../constants/<resource>.queryKeys.ts                             Step 4
  [ ] .../types/<resource>-form.types.ts                                Step 7
  [ ] .../hooks/use-<resource>-form.ts                                  Step 8
  [ ] .../contexts/<resource>-form.context.ts                           Step 9
  [ ] .../components/<resource>-form-fields.tsx                         Step 10
  [ ] .../components/<resource>-create-form.tsx                         Step 11
  [ ] .../components/update-<resource>-form.tsx                         Step 12
  [ ] .../components/create-<resource>-button.tsx                       Step 13
  [ ] .../components/update-<resource>-modal.tsx                        Step 14
  [ ] .../components/<resource>-table.tsx                               Step 15
  [ ] src/app/(dashboard)/<resource>/page.tsx                           Step 16
```
