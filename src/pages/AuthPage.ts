import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { UserCredentials } from '../data/users';
import type { Logger } from '../utils/Logger';
import { LOGIN_URL } from '../utils/urls';
import { waitForPageLoad } from '../utils/waitHelpers';

export class AuthPage extends BasePage {
  private readonly usernameField: Locator;
  private readonly passwordField: Locator;
  private readonly loginButton: Locator;
  private readonly errorBanner: Locator;
  private readonly errorDismissButton: Locator;

  constructor(page: Page, logger?: Logger) {
    super(page, logger);
    this.usernameField = page.locator('[data-test="username"]');
    this.passwordField = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorBanner = page.locator('[data-test="error"]');
    this.errorDismissButton = page.locator('[data-test="error-button"]');
  }

  async open(): Promise<void> {
    await this.navigate(LOGIN_URL);
  }

  async login(credentials: UserCredentials): Promise<void> {
    this.logger?.info(`Logging in as ${credentials.username}`);
    await this.usernameField.fill(credentials.username);
    await this.passwordField.fill(credentials.password);
    await this.loginButton.click();
    await waitForPageLoad(this.page);
  }

  async submitEmptyForm(): Promise<void> {
    this.logger?.info('Submitting login form with empty fields');
    await this.loginButton.click();
  }

  async fillUsername(value: string): Promise<void> {
    this.logger?.info(`Filling username: ${value}`);
    await this.usernameField.fill(value);
  }

  async fillPassword(value: string): Promise<void> {
    this.logger?.info('Filling password');
    await this.passwordField.fill(value);
  }

  async submit(): Promise<void> {
    this.logger?.info('Clicking submit button');
    await this.loginButton.click();
  }

  async dismissError(): Promise<void> {
    this.logger?.info('Dismissing error banner');
    await this.errorDismissButton.click();
  }

  getUsername(): Locator {
    return this.usernameField;
  }

  getPassword(): Locator {
    return this.passwordField;
  }

  getSubmitButton(): Locator {
    return this.loginButton;
  }

  getErrorMessage(): Locator {
    return this.errorBanner;
  }

  getLoginButton(): Locator {
    return this.loginButton;
  }

  getErrorBanner(): Locator {
    return this.errorBanner;
  }
}
