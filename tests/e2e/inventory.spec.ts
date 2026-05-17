import { test, expect } from '../../src/fixtures';
import { SortOptions, firstProduct, CartExpectations, InventoryPageData } from '../../src/data/inventory';

test.describe('Inventory', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.open();
  });

  test(
    'TC-INV-01: inventory page shows 6 product cards with complete data @smoke',
    async ({ inventoryPage }) => {
      // Initialization
      const items = await inventoryPage.getItems();

      // Verification
      await expect(inventoryPage.getTitle()).toHaveText(InventoryPageData.title);
      await expect(inventoryPage.getProductCards()).toHaveCount(6);
      for (const item of items) {
        await expect(item.getName()).not.toBeEmpty();
        await expect(item.getPrice()).toHaveText(/^\$\d+\.\d{2}$/);
        expect(await item.isImageLoaded()).toBe(true);
        await expect(item.getAddToCartButton()).toBeEnabled();
      }
    },
  );

  test(
    'TC-INV-02: sorting by Price low to high orders products by ascending price @regression',
    async ({ inventoryPage }) => {
      // User actions
      await inventoryPage.selectSortOption(SortOptions.priceLowHigh);

      // Verification
      const prices = await inventoryPage.getAllPrices();
      for (let i = 0; i < prices.length - 1; i++) {
        expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
      }
    },
  );

  test(
    'TC-INV-03: clicking Add to Cart on first product increments cart badge to 1 @smoke',
    async ({ inventoryPage, siteHeader }) => {
      // Initialization
      const { index } = firstProduct();
      const item = inventoryPage.getItem(index);

      // User actions
      await item.clickAddToCart();

      // Verification
      await expect(siteHeader.getCartBadge()).toHaveText(CartExpectations.badgeAfterAdd);
    },
  );

  test(
    'TC-INV-04: sorting by Name Z to A orders all products in descending alphabetical order @regression',
    async ({ inventoryPage }) => {
      // User actions
      await inventoryPage.selectSortOption(SortOptions.nameZA);

      // Verification
      const names = await inventoryPage.getAllNames();
      for (let i = 0; i < names.length - 1; i++) {
        expect(names[i].localeCompare(names[i + 1])).toBeGreaterThan(0);
      }
    },
  );

  test(
    'TC-INV-05: clicking Remove on a product card after adding it hides the cart badge @regression',
    async ({ inventoryPage, siteHeader }) => {
      // Initialization
      const item = inventoryPage.getItem(0);

      // User actions
      await item.clickAddToCart();
      await expect(siteHeader.getCartBadge()).toHaveText(CartExpectations.badgeAfterAdd);
      await item.clickRemove();

      // Verification
      await expect(siteHeader.getCartBadge()).toBeHidden();
    },
  );

  test(
    'TC-INV-06: sorting by Name A to Z orders all products in ascending alphabetical order @regression',
    async ({ inventoryPage }) => {
      // User actions
      await inventoryPage.selectSortOption(SortOptions.nameAZ);

      // Verification
      const names = await inventoryPage.getAllNames();
      for (let i = 0; i < names.length - 1; i++) {
        expect(names[i].localeCompare(names[i + 1])).toBeLessThan(0);
      }
    },
  );

  test(
    'TC-INV-07: sorting by Price high to low orders all products in descending price order @regression',
    async ({ inventoryPage }) => {
      // User actions
      await inventoryPage.selectSortOption(SortOptions.priceHighLow);

      // Verification
      const prices = await inventoryPage.getAllPrices();
      for (let i = 0; i < prices.length - 1; i++) {
        expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1]);
      }
    },
  );
});
