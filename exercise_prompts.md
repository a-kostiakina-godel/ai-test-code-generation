
## Exersize 1

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


## Exersize 2

  You are a Senior QA Automation Engineer working on a Playwright + TypeScript
  test suite using the Page Object Model pattern.

---

## Project context

  Framework: Playwright (@playwright/test), TypeScript.
  Base URL: https://www.saucedemo.com
  Tests run under the "authenticated" Playwright project (session stored in .auth/).

  Existing files you MUST reuse — do NOT recreate them:

- src/pages/BasePage.ts           — abstract base; navigate(), this.page, this.logger
- src/pages/InventoryPage.ts      — open(), getItem(index): InventoryItem, getTitle()
- src/components/InventoryItem.ts — getPrice(): Locator, clickAddToCart()
- src/components/SiteHeader.ts    — getCartBadge(): Locator, clickCartLink()
- src/utils/urlBuilder.ts         — INVENTORY_URL, CART_URL already exported
- src/utils/waitHelpers.ts        — waitForPageLoad(page)
- src/data/inventory.ts           — firstProduct(): ProductRef, CartExpectations
- src/fixtures/index.ts           — re-exports test and expect; always import from here
- src/fixtures/BaseTest.ts        — registers inventoryPage, siteHeader, logger

---

## DOM context (real saucedemo.com — data-test attributes only)

  Cart page (/cart.html):
    `<div class="cart_item">`
      `<div data-test="inventory-item-name">`...`</div>`
      `<div data-test="inventory-item-price">`...`</div>`
      `<button data-test="remove-sauce-labs-backpack">`Remove`</button>`
    `</div>`
    `<button data-test="checkout">`Checkout`</button>`
    `<button data-test="continue-shopping">`Continue Shopping`</button>`

  Checkout step 1 (/checkout-step-one.html):
    `<input data-test="firstName"  type="text" />`
    `<input data-test="lastName"   type="text" />`
    `<input data-test="postalCode" type="text" />`
    `<input data-test="continue"   type="submit" value="Continue" />`
    `<h3    data-test="error">`Error: First Name is required`</h3>`

  Checkout step 2 (/checkout-step-two.html):
    `<div data-test="subtotal-label">`Item total: $29.99`</div>`
    `<div data-test="tax-label">`Tax: $2.40`</div>`
    `<div data-test="total-label">`Total: $32.39`</div>`
    `<button data-test="finish">`Finish`</button>`

  Checkout complete (/checkout-complete.html):
    `<h2 class="complete-header">`Thank you for your order!`</h2>`
    `<button data-test="back-to-products">`Back Home`</button>`

---

## Task 1 — Update src/utils/urlBuilder.ts

  Add to the existing file — do NOT change anything already there:
    export const CHECKOUT_STEP_ONE_URL  = '/checkout-step-one.html';
    export const CHECKOUT_STEP_TWO_URL  = '/checkout-step-two.html';
    export const CHECKOUT_COMPLETE_URL  = '/checkout-complete.html';

---

## Task 2 — Create src/data/checkout.ts

    export type CustomerInfo = {
      firstName: string;
      lastName: string;
      postalCode: string;
    };

    export function defaultCustomer(): CustomerInfo {
      return { firstName: 'Test', lastName: 'User', postalCode: '10001' };
    }

    export const CheckoutExpectations = {
      completionHeader:    'Thank you for your order!',
      emptyFirstNameError: 'First Name is required',
    };

---

## Task 3 — Create src/pages/CartPage.ts

  Extends BasePage. Constructor receives Page and optional Logger.

  Private fields (same one-liner style as existing pages):
    cartItems        → page.locator('.cart_item')
    checkoutButton   → page.locator('[data-test="checkout"]')
    removeButtons    → page.locator('[data-test^="remove-"]')

  Public methods:
    getCartItems(): Locator
    getCheckoutButton(): Locator
    async proceedToCheckout(): Promise`<void>`
      → this.logger?.info, click checkoutButton, waitForPageLoad
    async removeFirstItem(): Promise`<void>`
      → this.logger?.info, click removeButtons.first()

---

## Task 4 — Create src/pages/CheckoutPage.ts

  Extends BasePage. Covers step 1 (info form), step 2 (order summary),
  and the completion screen.

  Private fields:
    firstNameField    → [data-test="firstName"]
    lastNameField     → [data-test="lastName"]
    postalCodeField   → [data-test="postalCode"]
    continueButton    → [data-test="continue"]
    errorMessage      → [data-test="error"]
    itemTotalLabel    → [data-test="subtotal-label"]
    taxLabel          → [data-test="tax-label"]
    totalLabel        → [data-test="total-label"]
    finishButton      → [data-test="finish"]
    completionHeader  → page.locator('.complete-header')

  Public methods:
    async fillInfo(info: CustomerInfo): Promise`<void>`
      → log, fill all three fields, click continueButton, waitForPageLoad
    async continueWithoutInfo(): Promise`<void>`
      → log, click continueButton (no fill, no waitForPageLoad)
    getError(): Locator
    getItemTotal(): Locator
    getTax(): Locator
    getTotal(): Locator
    async finish(): Promise`<void>`
      → log, click finishButton, waitForPageLoad
    getCompletionHeader(): Locator

  Import CustomerInfo from '../data/checkout'.

---

## Task 5 — Update src/fixtures/BaseTest.ts

  Add to PageFixtures type and extend block — keep all existing fixtures untouched:
    cartPage:     CartPage     (import from ../pages/CartPage)
    checkoutPage: CheckoutPage (import from ../pages/CheckoutPage)

  Both follow the same pattern as inventoryPage:
    async ({ page, logger }, use) => use(new XxxPage(page, logger))

---

## Task 6 — Create tests/e2e/checkout.spec.ts

  Write exactly 4 tests inside a describe('Checkout') block.
  Use beforeEach to open the inventory page via inventoryPage.open().
  Each test must have // Initialization, // User actions, // Verification sections.
  No raw selectors in the spec file.

  Imports:
    test, expect                      from '../../src/fixtures'
    firstProduct, CartExpectations    from '../../src/data/inventory'
    defaultCustomer, CheckoutExpectations  from '../../src/data/checkout'
    CART_URL, CHECKOUT_STEP_ONE_URL,
    CHECKOUT_STEP_TWO_URL,
    CHECKOUT_COMPLETE_URL             from '../../src/utils/urlBuilder'

    TC-CHECKOUT-01 @smoke  (positive)
    "adding a product to cart updates the badge and shows the item in the cart"
    Initialization: const { index } = firstProduct(); const item = inventoryPage.getItem(index)
    User actions:   item.clickAddToCart() → siteHeader.clickCartLink()
    Verification:   badge toHaveText(CartExpectations.badgeAfterAdd)
                    page toHaveURL(CART_URL)
                    cartPage.getCartItems() toHaveCount(1)
                    cartPage.getCheckoutButton() toBeVisible()

    TC-CHECKOUT-02 @regression  (positive — happy path)
    "completing checkout flow shows correct item total and order confirmation"
    Initialization: const { index } = firstProduct(); const item = inventoryPage.getItem(index)
                    const itemPrice = await item.getPrice().textContent()
    User actions:   item.clickAddToCart() → siteHeader.clickCartLink()
                    → cartPage.proceedToCheckout()
                    → checkoutPage.fillInfo(defaultCustomer())
                    → checkoutPage.finish()
    Verification:   after fillInfo: page toHaveURL(CHECKOUT_STEP_TWO_URL)
                                    checkoutPage.getItemTotal() toContainText(itemPrice ?? '')
                    after finish:   page toHaveURL(CHECKOUT_COMPLETE_URL)
                                    checkoutPage.getCompletionHeader()
                                      toHaveText(CheckoutExpectations.completionHeader)

    TC-CHECKOUT-03 @regression  (negative — form validation)
    "submitting checkout info form without data shows first name required error"
    Initialization: const { index } = firstProduct(); const item = inventoryPage.getItem(index)
    User actions:   item.clickAddToCart() → siteHeader.clickCartLink()
                    → cartPage.proceedToCheckout()
                    → checkoutPage.continueWithoutInfo()
    Verification:   page toHaveURL(CHECKOUT_STEP_ONE_URL)
                    checkoutPage.getError() toBeVisible()
                    checkoutPage.getError() toContainText(CheckoutExpectations.emptyFirstNameError)

    TC-CHECKOUT-04 @regression  (negative — cart modification)
    "removing the only item from the cart empties the cart and hides the badge"
    Initialization: const { index } = firstProduct(); const item = inventoryPage.getItem(index)
    User actions:   item.clickAddToCart() → siteHeader.clickCartLink()
                    → cartPage.removeFirstItem()
    Verification:   cartPage.getCartItems() toHaveCount(0)
                    siteHeader.getCartBadge() toBeHidden()

---

## Rules

- Import test/expect from src/fixtures only.
- Use data-test selectors throughout; the only exceptions are .cart_item
  (cart item container has no data-test) and .complete-header
  (completion heading has no data-test).
- All locators must live in page/component classes — no raw selectors in the spec.
- Each test must have exactly the three comment sections in order.
- Output every changed or new file with a // path: `<relative-path>` header.
- Do NOT output files you did not change.
- No new utility files, no new component file
