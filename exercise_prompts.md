
  You are a Senior QA Automation Engineer working on a Playwright + TypeScript
  test suite using the Page Object Model pattern.

---

## Project context

  Framework: Playwright (@playwright/test), TypeScript.
  Base URL: https://www.saucedemo.com
  Tests run under the "unauthenticated" Playwright project (no stored session).

  Existing files you MUST reuse — do NOT recreate them:

- src/pages/BasePage.ts       — abstract base; navigate(), this.page, this.logger
- src/utils/urlBuilder.ts     — exports LOGIN_URL = '/',
  INVENTORY_URL = '/inventory.html'
- src/utils/waitHelpers.ts    — exports waitForPageLoad(page)
- src/fixtures/index.ts       — re-exports test and expect; always import from here
- src/fixtures/BaseTest.ts    — registers authPage, inventoryPage, siteHeader,
  itemPage, logger

---

## DOM context (real saucedemo.com — data-test attributes only)

  Login form:
    `<input data-test="username" type="text" />`
    `<input data-test="password" type="password" />`
    `<input data-test="login-button" type="submit" value="Login" />`
    `<h3   data-test="error">`Epic sadface: ...`</h3>`
    `<button data-test="error-button" class="error-button">`×`</button>`

  Post-login success indicator:
    `<span data-test="title" class="title">`Products

---

## Task 1 — Update src/data/users.ts

  Add to the existing file — do NOT change anything already there:

  New user factory functions:
    export function problemUser(): UserCredentials {
      return { username: 'problem_user', password: 'secret_sauce' };
    }
    export function invalidUser(): UserCredentials {
      return { username: 'invalid_user', password: 'wrong_password' };
    }

  Add to the existing LoginErrors object (no new objects):
    emptyPassword:        'Password is required',
    invalidCredentials:   'do not match',

---

## Task 2 — Rename src/pages/LoginPage.ts → src/pages/AuthPage.ts

  Keep everything that already exists. Add only the following:

  New private field (constructor, same one-liner style as other fields):
    errorDismissButton: Locator   → page.locator('[data-test="error-button"]')

  New public getters:
    getUsername(): Locator        → this.usernameField
    getPassword(): Locator        → this.passwordField
    getSubmitButton(): Locator    → this.loginButton
    getErrorMessage(): Locator    → this.errorBanner
      (keep getErrorBanner() as well — other tests may still reference it)

  New public actions:
    async fillUsername(value: string): Promise`<void>`
      → this.logger?.info, then this.usernameField.fill(value)
    async fillPassword(value: string): Promise`<void>`
      → this.logger?.info, then this.passwordField.fill(value)
    async submit(): Promise`<void>`
      → this.logger?.info, then this.loginButton.click()
    async dismissError(): Promise`<void>`
      → this.logger?.info, then this.errorDismissButton.click()

  Note: the existing login(credentials) and submitEmptyForm() stay unchanged.

---

## Task 3 — Update src/fixtures/BaseTest.ts

- Replace import LoginPage with AuthPage (src/pages/AuthPage).
- Rename the fixture key loginPage → authPage.
- All other fixtures stay untouched.

---

## Task 4 — Create tests/e2e/auth.spec.ts

  Write exactly 7 tests inside a single describe('Auth') block.
  Each test must have exactly these inline comment sections:
    // Initialization
    // User actions
    // Verification

  Import:
    test, expect          from '../../src/fixtures'
    validUser, problemUser, lockedUser, invalidUser,
    LoginErrors           from '../../src/data/users'
    INVENTORY_URL         from '../../src/utils/urlBuilder'

  Use beforeEach to call authPage.open() — no per-test open() calls.

  Tests:

    TC-AUTH-01 @smoke
    "valid credentials redirect to inventory and show Products title"
    User actions:   authPage.login(validUser())
    Verification:   page URL toHaveURL(INVENTORY_URL)
                    inventoryPage.getTitle() toHaveText('Products')

    TC-AUTH-02 @regression
    "problem_user can authenticate and lands on inventory page"
    User actions:   authPage.login(problemUser())
    Verification:   page URL toHaveURL(INVENTORY_URL)

    TC-AUTH-03 @regression
    "locked_out_user sees locked-out error message"
    User actions:   authPage.login(lockedUser())
    Verification:   authPage.getErrorMessage() toBeVisible()
                    authPage.getErrorMessage() toContainText(LoginErrors.lockedUser)

    TC-AUTH-04 @regression
    "submitting empty form shows username required error"
    User actions:   authPage.submitEmptyForm()
    Verification:   authPage.getErrorMessage() toBeVisible()
                    authPage.getErrorMessage() toContainText(LoginErrors.emptyUsername)

    TC-AUTH-05 @regression
    "filling username but leaving password empty shows password required error"
    User actions:   authPage.fillUsername(validUser().username)
                    authPage.submit()
    Verification:   authPage.getErrorMessage() toBeVisible()
                    authPage.getErrorMessage() toContainText(LoginErrors.emptyPassword)

    TC-AUTH-06 @regression
    "invalid credentials show credentials mismatch error"
    User actions:   authPage.login(invalidUser())
    Verification:   authPage.getErrorMessage() toBeVisible()
                    authPage.getErrorMessage() toContainText(LoginErrors.invalidCredentials)

    TC-AUTH-07 @regression
    "error banner can be dismissed with the close button"
    User actions:   authPage.login(lockedUser())
                    authPage.dismissError()
    Verification:   authPage.getErrorMessage() toBeHidden()

---

## Rules

- Import test/expect from src/fixtures only; never directly from @playwright/test.
- No raw selectors in the test file — all locators live in AuthPage or InventoryPage.
- beforeEach must contain only authPage.open(); nothing else.
- Output every changed or new file with a // path: `<relative-path>` header.
- Do NOT output files you did not change.
- No new utility files, no new component files.
