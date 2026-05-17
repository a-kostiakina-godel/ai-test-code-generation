import { test, expect } from '../../src/fixtures';
import { LOGIN_URL, INVENTORY_URL, CART_URL } from '../../src/utils/urlBuilder';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(INVENTORY_URL);
  });

  test(
    'TC-NAV-01: hamburger menu logout navigates to login page @smoke',
    async ({ siteHeader, authPage, page }) => {
      await siteHeader.openHamburgerMenu();
      await siteHeader.clickLogout();
      await expect(page).toHaveURL(LOGIN_URL);
      await expect(authPage.getSubmitButton()).toBeVisible();
    },
  );

  test(
    'TC-NAV-02: cart link navigates to cart page @smoke',
    async ({ siteHeader, page }) => {
      await siteHeader.clickCartLink();
      await expect(page).toHaveURL(CART_URL);
    },
  );
});
