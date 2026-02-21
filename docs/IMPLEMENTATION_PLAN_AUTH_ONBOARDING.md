# Implementation Plan: Auth Sync, Membership, and Onboarding

**Purpose:** Execute in order. Each phase has goals, files, and verification. Do not remove or change existing login/signup/Google UI or Supabase session handling. Only add membership, onboarding, and protect (tabs) by membership.

**Reference:** ARCHITECTURE.md is the source of truth. Follow its folder structure, API contracts, and constraints (env for URLs, no hardcoded IPs, useColors(), etc.).

---

## Prerequisites (verify first)

### Backend

The frontend will call these endpoints. **If they do not exist in the current backend, implement them before starting frontend Phases 2–6.**

- **POST /api/auth/sync**  
  - Header: `Authorization: Bearer <access_token>` (Supabase JWT).  
  - Response: `{ user: {...}, membership: {...} | null }`. If no membership row for the user, `membership` is `null`.  
  - Backend: verify token (e.g. Supabase `auth.getUser()`), sync user to DB, load membership, return user + membership.

- **POST /api/businesses**  
  - Header: `Authorization: Bearer <access_token>`.  
  - Body: `{ name: string }`.  
  - Creates business and membership (caller = owner), returns business and/or membership per your API design.

- **POST /api/businesses/join**  
  - Header: `Authorization: Bearer <access_token>`.  
  - Body: `{ businessCode: string }`.  
  - Creates membership (employee), returns membership and/or business.

Implement per ARCHITECTURE.md: authRoutes, businessRoutes, auth middleware, Prisma User/Membership/Business. Mount routes in backend entry (e.g. `server.ts`) under `/api/auth` and `/api/businesses`.

**Verification:** `curl` or Postman: each endpoint returns expected shape with valid token; sync returns `membership: null` when user has no membership.

### Frontend (existing; do not break)

- Supabase client: `frontend/lib/supabase.ts`
- Auth screens: `frontend/app/(auth)/login.tsx`, `signup.tsx`; components under `frontend/src/components/authentication/`
- `frontend/src/hooks/useAuth.ts` — currently returns `{ session, loading }` only (Supabase session)
- Tabs: `frontend/app/(tabs)/_layout.tsx` with Home, Assets, Settings

---

## Phase 1: Types and API layer

**Goal:** Shared types for user/membership and an API helper that sends the Supabase access token. Base URL from env; no hardcoded IP.

**1.1 Types (frontend)**

- Create `frontend/src/types/user.ts` (if missing):  
  `User`: `id`, `email`, `fullName`, `avatarUrl` (or match backend).  
  `Membership`: `id`, `businessId`, `businessName` (or `name`), `role`: `'owner' | 'employee'`, plus any other fields the backend returns.
- Create or update `frontend/src/types/auth.ts`:  
  `AuthSyncResponse`: `{ user: User; membership: Membership | null }`.

**1.2 API base URL**

- In `frontend/src/services/api.ts`:  
  - **Remove any hardcoded base URL** (e.g. `http://192.168.0.8:8080/api`).  
  - Use `process.env.EXPO_PUBLIC_API_BASE_URL` or `Constants.expoConfig?.extra?.apiBaseUrl`.  
  - Fallback for dev only: e.g. `http://localhost:8080/api`. Do not commit a machine-specific IP.
- Ensure the base URL includes the `/api` prefix so paths like `auth/sync` become `.../api/auth/sync`.

**1.3 Authenticated request helper**

- Add a function that accepts endpoint, options (method, body), and optional `accessToken`. When `accessToken` is provided, set header `Authorization: Bearer <accessToken>`.  
  - Either: `apiRequestWithAuth<T>(endpoint, options, accessToken)` and keep existing `apiRequest` for now, or refactor `apiRequest` to accept an optional token and use it when present.
- All auth/business calls (sync, create business, join business) must use this helper with the current Supabase session token.

**1.4 Optional (can be Phase 1 or when first needed)**

- Add e.g. `apiRequestWithBusiness<T>(businessId, path, options, accessToken)` that prepends `/businesses/${businessId}` and uses the same Bearer token.

**Verification:** Types compile. With a token passed, the helper sends the correct base URL (from env/fallback) and `Authorization: Bearer <token>`.

---

## Phase 2: AuthContext (session + user + membership)

**Goal:** One place for Supabase session, synced user, membership, loading, and refresh. Login/signup only set session; they do not need to know about membership.

**2.1 Create AuthContext**

- File: `frontend/src/contexts/AuthContext.tsx`.
- State: `session` (Supabase session | null), `user` (User | null), `membership` (Membership | null), `loading` (boolean). One loading flag is enough: true until session and sync state are resolved.
- Session: On mount and via `supabase.auth.onAuthStateChange`, update `session`. When `session` becomes non-null, call **POST /api/auth/sync** with `session.access_token`, set `user` and `membership` from response, then set `loading` false. When `session` becomes null, set `user` and `membership` to null and `loading` false.
- **Sync failure (e.g. network or 401):** Set `membership` to null, set `loading` to false so the app does not hang. Optionally set an `authError` state for the app to show a message or redirect to login.
- Expose: `session`, `user`, `membership`, `loading`, `refreshUserAndMembership()` (async: get current session, call sync again, update user and membership), and optionally `signOut()` that calls `supabase.auth.signOut()` and clears user/membership in state.

**2.2 Provider in root layout**

- File: `frontend/app/_layout.tsx`.  
- Wrap the entire app (Stack and its children) with `AuthProvider`. The component that reads `useAuth()` and branches on session/membership/loading must be **inside** the provider (e.g. same file: wrap `<Stack>` with `<AuthProvider>`, and the component that calls `useAuth()` and renders conditionally is a child of the provider).

**2.3 useAuth hook**

- File: `frontend/src/hooks/useAuth.ts`.  
- Replace the current implementation with a consumer of AuthContext (e.g. `useContext(AuthContext)`). Return the context value: `session`, `user`, `membership`, `loading`, `refreshUserAndMembership`, and optionally `signOut`. Keep the same export name and path so existing imports in `_layout.tsx`, `(auth)/_layout.tsx`, and `(tabs)/_layout.tsx` keep working.

**Verification:** After login, context has `session`, `user`, and `membership` (or null). Calling `refreshUserAndMembership()` updates membership. Sign out clears session, user, and membership.

---

## Phase 3: Root layout routing (auth vs onboarding vs tabs)

**Goal:** Unauthenticated → auth only; authenticated without membership → onboarding only; authenticated with membership → tabs. (tabs) is only accessible when membership exists.

**3.1 Root layout logic**

- File: `frontend/app/_layout.tsx`.  
- Read from AuthContext: `session`, `membership`, `loading`.
- If `loading` → render a minimal loading UI (e.g. blank or splash); do not render (tabs) or (auth) yet.
- If `!session` → render only the (auth) group (e.g. redirect or conditional so unauthenticated users see auth; default to login).
- If `session && membership == null` → show onboarding (redirect to `/(auth)/onboarding` or equivalent).
- If `session && membership != null` → show (tabs) (e.g. redirect to `/(tabs)` or render (tabs) as main content). This is the only case where (tabs) is accessible.

**3.2 (auth) layout — required change**

- File: `frontend/app/(auth)/_layout.tsx`.  
- **Do not** redirect all authenticated users to (tabs). Use membership:
  - If `session && membership != null` → redirect to `/(tabs)`.
  - If `session && membership == null` → redirect to `/(auth)/onboarding` (or show stack that includes onboarding).
  - If `!session` → show the auth stack (login/signup).
- Ensure the (auth) layout reads `membership` from `useAuth()` (same hook, now from context).

**3.3 Default route for unauthenticated users**

- Ensure when the app opens with no session, the user lands on login. Add `frontend/app/(auth)/index.tsx` that redirects to `/(auth)/login`, or otherwise set the default for the (auth) group to login so there is no ambiguity.

**Verification:** Logged-out → auth only. Logged-in with no membership → onboarding only. Logged-in with membership → tabs. No way to open (tabs) without a membership.

---

## Phase 4: Protect (tabs) with membership guard

**Goal:** Even if routing misbehaves, (tabs) checks membership and redirects to onboarding when missing.

**4.1 (tabs) layout guard**

- File: `frontend/app/(tabs)/_layout.tsx`.  
- Keep: if no session → redirect to `/(auth)/login` (or equivalent).
- Add: if session exists but `membership == null` (and not still loading), redirect to onboarding (e.g. `Redirect href="/(auth)/onboarding"` or the route used in Phase 3).
- Only render the Tabs UI when both session and membership are present.

**Verification:** With session but no membership, navigating directly to a (tabs) route still redirects to onboarding. With session and membership, (tabs) renders normally.

---

## Phase 5: Onboarding screen (create or join business)

**Goal:** Single screen when session exists and membership is null. Two actions: create business (owner) or join business (employee by code). On success, refresh membership and navigate to (tabs).

**5.1 Create onboarding screen**

- File: `frontend/app/(auth)/onboarding.tsx`.  
- Content: Heading e.g. “Welcome to Apex Tracking”. Two clear actions: “Create a Business” and “Join a Business”.

**5.2 Create a business flow**

- When user taps “Create a Business”, show an input for business name (and any other required fields). On submit:
  - Call **POST /api/businesses** with body `{ name: string }`, using the authenticated API helper with current `session.access_token`.
  - On success: call `refreshUserAndMembership()` from AuthContext, then navigate to `/(tabs)` (e.g. `router.replace('/(tabs)')`).
  - On error: show error message (validation/conflict); do not leave onboarding.

**5.3 Join a business flow**

- When user taps “Join a Business”, show an input for business code (e.g. APEX-7K2X). On submit:
  - Call **POST /api/businesses/join** with body `{ businessCode: string }` (trimmed; case per backend), using the same authenticated helper and token.
  - On success: call `refreshUserAndMembership()`, then navigate to `/(tabs)`.
  - On error: show error (e.g. invalid or expired code); do not leave onboarding.

**5.4 Restrict access**

- Onboarding is only for “session and no membership”. If the user navigates to onboarding with membership (e.g. deep link), redirect to `/(tabs)` so existing members do not see the onboarding form.

**Verification:** New user signs up → sees onboarding → creates business → lands on (tabs) with membership. Another user signs up → sees onboarding → joins with valid code → lands on (tabs). Invalid code shows error and stays on onboarding.

---

## Phase 6: Business service and error handling

**Goal:** Central place for backend auth/business calls and consistent error handling.

**6.1 Business service**

- File: `frontend/src/services/businessService.ts`.  
- Functions:  
  - `syncUser(accessToken: string)` → POST /api/auth/sync with token; return typed `AuthSyncResponse` (or user + membership).  
  - `createBusiness(name: string, accessToken: string)` → POST /api/businesses with body `{ name }`.  
  - `joinBusiness(businessCode: string, accessToken: string)` → POST /api/businesses/join with body `{ businessCode }`.  
- Each uses the Phase 1 API helper that sends the Bearer token. Return typed responses; handle 4xx/5xx by throwing or returning a result type so callers can show messages.

**6.2 Use in AuthContext and onboarding**

- AuthContext calls `businessService.syncUser(session.access_token)` when syncing (replace any inline fetch).
- Onboarding screen calls `businessService.createBusiness` and `businessService.joinBusiness` with `session.access_token`. Do not assume success; handle errors.

**6.3 Error messages**

- Map backend error codes/messages to user-friendly text (e.g. “Invalid business code”, “Business name is required”). Show these on the onboarding screen for create/join failures.

**Verification:** Sync and create/join go through the business service; errors are handled and shown without crashing.

---

## Phase 7: Cleanup and edge cases

**Goal:** No regressions, clear loading/error states, (tabs) always protected by membership.

**7.1 Single useAuth implementation**

- Ensure all imports of `useAuth` use the context-based implementation (session + user + membership + refresh + optional signOut). Remove any duplicate session-only logic that could confuse future work.

**7.2 Loading and redirect order**

- Avoid flashing (auth) or (tabs) before membership is known. Keep `loading` true until sync has completed (or failed with membership null). Redirect from onboarding to (tabs) only after `refreshUserAndMembership()` has updated context so (tabs) sees membership.

**7.3 Sign out**

- Sign out (e.g. from Settings) must clear session and membership. After sign out, user lands on `/(auth)/login`. Verify AuthContext clears state and the (tabs) guard no longer applies (user is sent to auth).

**7.4 Documentation**

- In code or in ARCHITECTURE.md / PROGRESS.md: “(tabs) is protected: only users with a membership can access. Onboarding is the single screen for creating or joining a business when session exists but membership is null.”

**Verification:** Full flow: sign up → onboarding → create or join → (tabs). Sign out → login. Direct navigation to (tabs) with session but no membership → redirect to onboarding. No duplicate auth logic left in the codebase.

---

## Summary checklist for the agent

- [ ] **Prerequisites:** Backend exposes POST /api/auth/sync, POST /api/businesses, POST /api/businesses/join (or implement them first).
- [ ] **Phase 1:** Types (User, Membership, AuthSyncResponse); API base URL from env (no hardcoded IP); apiRequestWithAuth (or equivalent) with Bearer token.
- [ ] **Phase 2:** AuthContext with session, user, membership, loading, refresh (and optional signOut); AuthProvider in root layout; useAuth() returns context; loading cleared on sync failure.
- [ ] **Phase 3:** Root layout: loading → splash; !session → (auth); session && !membership → onboarding; session && membership → (tabs). (auth) layout uses membership (not “any session → (tabs)”). Default unauthenticated route = login (e.g. (auth)/index.tsx).
- [ ] **Phase 4:** (tabs) layout: if session but !membership → redirect to onboarding; only render tabs when membership exists.
- [ ] **Phase 5:** Onboarding screen: Create business (name → POST /api/businesses) and Join business (code → POST /api/businesses/join); on success refresh and navigate to (tabs); show errors; redirect to (tabs) if user already has membership.
- [ ] **Phase 6:** businessService for sync, create, join; AuthContext and onboarding use it; errors handled and displayed.
- [ ] **Phase 7:** Single useAuth implementation; no flash of wrong screen; sign out clears state; (tabs) protected by membership; docs updated.

**Do not:** Change existing login/signup/Google UI or flow; remove Supabase session handling; or allow (tabs) to be visible when membership is null.

**Keep:** All current authentication functionality; only add membership, onboarding, and protect (tabs) by membership.
