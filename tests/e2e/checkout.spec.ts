import { test, expect } from '../../src/fixtures';
import { firstProduct, CartExpectations } from '../../src/data/inventory';
import { defaultCustomer, CheckoutExpectations } from '../../src/data/checkout';
import {
  CART_URL,
  CHECKOUT_STEP_ONE_URL,
  CHECKOUT_STEP_TWO_URL,
  CHECKOUT_COMPLETE_URL,
} from '../../src/utils/urls';

test.describe('Checkout', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.open();
  });

  test(
    'TC-CHECKOUT-01: adding a product to cart updates the badge and shows the item in the cart @smoke',
    async ({ inventoryPage, siteHeader, cartPage, page }) => {
      // Initialization
      const { index } = firstProduct();
      const item = inventoryPage.getItem(index);

      // User actions
      await item.clickAddToCart();
      await siteHeader.clickCartLink();

      // Verification
      await expect(siteHeader.getCartBadge()).toHaveText(CartExpectations.badgeAfterAdd);
      await expect(page).toHaveURL(CART_URL);
      await expect(cartPage.getCartItems()).toHaveCount(1);
      await expect(cartPage.getCheckoutButton()).toBeVisible();
    },
  );

  test(
    'TC-CHECKOUT-02: completing checkout flow shows correct item total and order confirmation @regression',
    async ({ inventoryPage, siteHeader, cartPage, checkoutPage, page }) => {
      // Initialization
      const { index } = firstProduct();
      const item = inventoryPage.getItem(index);
      const itemPrice = await item.getPrice().textContent();

      // User actions
      await item.clickAddToCart();
      await siteHeader.clickCartLink();
      await cartPage.proceedToCheckout();
      await checkoutPage.fillInfo(defaultCustomer());

      // Verification
      await expect(page).toHaveURL(CHECKOUT_STEP_TWO_URL);
      await expect(checkoutPage.getItemTotal()).toContainText(itemPrice ?? '');
      await checkoutPage.finish();
      await expect(page).toHaveURL(CHECKOUT_COMPLETE_URL);
      await expect(checkoutPage.getCompletionHeader()).toHaveText(CheckoutExpectations.completionHeader);
    },
  );

  test(
    'TC-CHECKOUT-03: submitting checkout info form without data shows first name required error @regression',
    async ({ inventoryPage, siteHeader, cartPage, checkoutPage, page }) => {
      // Initialization
      const { index } = firstProduct();
      const item = inventoryPage.getItem(index);

      // User actions
      await item.clickAddToCart();
      await siteHeader.clickCartLink();
      await cartPage.proceedToCheckout();
      await checkoutPage.continueWithoutInfo();

      // Verification
      await expect(page).toHaveURL(CHECKOUT_STEP_ONE_URL);
      await expect(checkoutPage.getError()).toBeVisible();
      await expect(checkoutPage.getError()).toContainText(CheckoutExpectations.emptyFirstNameError);
    },
  );

  test(
    'TC-CHECKOUT-04: removing the only item from the cart empties the cart and hides the badge @regression',
    async ({ inventoryPage, siteHeader, cartPage }) => {
      // Initialization
      const { index } = firstProduct();
      const item = inventoryPage.getItem(index);

      // User actions
      await item.clickAddToCart();
      await siteHeader.clickCartLink();
      await cartPage.removeFirstItem();

      // Verification
      await expect(cartPage.getCartItems()).toHaveCount(0);
      await expect(siteHeader.getCartBadge()).toBeHidden();
    },
  );
});
