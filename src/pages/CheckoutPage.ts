import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import type { Logger } from '../utils/Logger';
import { CustomerInfo } from '../data/checkout';
import { waitForPageLoad } from '../utils/waitHelpers';

export class CheckoutPage extends BasePage {
  private readonly firstNameField: Locator;
  private readonly lastNameField: Locator;
  private readonly postalCodeField: Locator;
  private readonly continueButton: Locator;
  private readonly errorMessage: Locator;
  private readonly itemTotalLabel: Locator;
  private readonly taxLabel: Locator;
  private readonly totalLabel: Locator;
  private readonly finishButton: Locator;
  private readonly completionHeader: Locator;

  constructor(page: Page, logger?: Logger) {
    super(page, logger);
    this.firstNameField = page.locator('[data-test="firstName"]');
    this.lastNameField = page.locator('[data-test="lastName"]');
    this.postalCodeField = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.itemTotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.completionHeader = page.locator('.complete-header');
  }

  async fillInfo(info: CustomerInfo): Promise<void> {
    this.logger?.info(`Filling checkout info for ${info.firstName} ${info.lastName}`);
    await this.firstNameField.fill(info.firstName);
    await this.lastNameField.fill(info.lastName);
    await this.postalCodeField.fill(info.postalCode);
    await this.continueButton.click();
    await waitForPageLoad(this.page);
  }

  async continueWithoutInfo(): Promise<void> {
    this.logger?.info('Clicking continue without filling checkout info');
    await this.continueButton.click();
  }

  async finish(): Promise<void> {
    this.logger?.info('Finishing order');
    await this.finishButton.click();
    await waitForPageLoad(this.page);
  }

  getError(): Locator {
    return this.errorMessage;
  }

  getItemTotal(): Locator {
    return this.itemTotalLabel;
  }

  getTax(): Locator {
    return this.taxLabel;
  }

  getTotal(): Locator {
    return this.totalLabel;
  }

  getCompletionHeader(): Locator {
    return this.completionHeader;
  }
}
