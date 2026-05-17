import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import type { Logger } from '../utils/Logger';
import { waitForPageLoad } from '../utils/waitHelpers';

export class CartPage extends BasePage {
  private readonly cartItems: Locator;
  private readonly checkoutButton: Locator;
  private readonly removeButtons: Locator;

  constructor(page: Page, logger?: Logger) {
    super(page, logger);
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.removeButtons = page.locator('[data-test^="remove-"]');
  }

  getCartItems(): Locator {
    return this.cartItems;
  }

  getCheckoutButton(): Locator {
    return this.checkoutButton;
  }

  async proceedToCheckout(): Promise<void> {
    this.logger?.info('Proceeding to checkout');
    await this.checkoutButton.click();
    await waitForPageLoad(this.page);
  }

  async removeFirstItem(): Promise<void> {
    this.logger?.info('Removing first item from cart');
    await this.removeButtons.first().click();
  }
}
