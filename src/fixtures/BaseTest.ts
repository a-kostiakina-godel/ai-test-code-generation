import { test as base } from '@playwright/test';
import { AuthPage } from '../pages/AuthPage';
import { SiteHeader } from '../components/SiteHeader';
import { ItemDetailPage } from '../pages/ItemDetailPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { Logger } from '../utils/Logger';

type PageFixtures = {
  authPage: AuthPage;
  siteHeader: SiteHeader;
  itemPage: ItemDetailPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  logger: Logger;
};

export const test = base.extend<PageFixtures>({
  authPage: async ({ page, logger }, use) => use(new AuthPage(page, logger)),
  siteHeader: async ({ page }, use) => use(new SiteHeader(page)),
  itemPage: async ({ page, logger }, use) => use(new ItemDetailPage(page, logger)),
  inventoryPage: async ({ page, logger }, use) => use(new InventoryPage(page, logger)),
  cartPage: async ({ page, logger }, use) => use(new CartPage(page, logger)),
  checkoutPage: async ({ page, logger }, use) => use(new CheckoutPage(page, logger)),
  logger: [async ({ page }, use, testInfo): Promise<void> => {
    const logger = new Logger(page, testInfo);
    await logger.setup();
    try {
      await use(logger);
    } finally {
      await logger.teardown();
    }
  }, { auto: true }],
});
