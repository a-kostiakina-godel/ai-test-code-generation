
You are a Senior QA Automation Engineer working on a Playwright + TypeScript
  test suite using the Page Object Model pattern.

---

## Project context

  Framework: Playwright (@playwright/test), TypeScript, POM pattern.

  Existing relevant files (do NOT recreate them):

- src/components/InventoryItem.ts — wraps one product card (root: Locator).
  Current fields: nameLocator, priceLocator, imageLocator, addToCartButton.
  Current methods: getName(), getPrice(), getImage(), getAddToCartButton(),
  isImageLoaded(), getPriceValue(), clickAddToCart().
- src/pages/InventoryPage.ts    — extends BasePage; exposes getItem(index) and
  getItems() which return InventoryItem instances.
- src/data/inventory.ts         — CartExpectations already contains:
  badgeAfterAdd: '1'
  removeButtonText: 'Remove'
- src/components/SiteHeader.ts  — exposes getCartBadge(): Locator
- src/fixtures/index.ts         — re-exports test and expect; always import from here

---

## New UI element

  After a product is added to cart, its card shows a Remove button.
  Its outerHTML (the selector varies per product; use a prefix match):

    `<button
      class="btn btn_secondary btn_small btn_inventory"
      data-test="remove-sauce-labs-backpack"
      id="remove-sauce-labs-backpack"
      name="remove-sauce-labs-backpack">`Remove`</button>`

  Selector scoped to the card root: button[data-test^="remove"]

---

## Task

### 1. Extend src/components/InventoryItem.ts

  Add the following — do NOT duplicate or change anything already there:

- Private field:  removeButton: Locator
  Value: root.locator('button[data-test^="remove"]')
- Public getter:  getRemoveButton(): Locator
- Public action:  async clickRemove(): Promise`<void>`
  Body: await this.removeButton.click()

  Follow the exact same pattern already used for addToCartButton.

### 2. Update tests/e2e/inventory.spec.ts

  Add ONE new test inside the existing describe block — do not touch existing tests:

    TC-INV-05: clicking Remove on a product card after adding it decrements the
               cart badge back to hidden @regression

    Steps (add inline comments // Initialization, // User actions, // Verification):
    1. beforeEach already calls inventoryPage.open() — no need to repeat it.
    2. Get item at index 0 via inventoryPage.getItem(0).
    3. Click Add to Cart via item.clickAddToCart().
    4. Assert siteHeader.getCartBadge() has text CartExpectations.badgeAfterAdd.
    5. Click Remove via item.clickRemove().
    6. Assert siteHeader.getCartBadge() is hidden (toBeHidden()).

---

## Rules

- Import from '../../src/fixtures' (not @playwright/test directly).
- All locators must live inside the component/page class — no raw selectors in tests.
- Follow the exact method naming already in InventoryItem:
  getXxx(): Locator  for getters
  async clickXxx(): Promise `<void>`  for actions
- Constructor field assignment: one-liner, same style as addToCartButton.
- Output every changed file with a // path: `<relative-path>` header.
- Do NOT output files you did not change.
- No new helper files, no new Page Object or component files.
