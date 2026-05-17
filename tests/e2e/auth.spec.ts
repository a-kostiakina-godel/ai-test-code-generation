import { test, expect } from '../../src/fixtures';
import { validUser, problemUser, lockedUser, invalidUser, LoginErrors } from '../../src/data/users';
import { INVENTORY_URL } from '../../src/utils/urls';

test.describe('Auth', () => {
  test.beforeEach(async ({ authPage }) => {
    await authPage.open();
  });

  test(
    'TC-AUTH-01: valid credentials redirect to inventory and show Products title @smoke',
    async ({ authPage, inventoryPage, siteHeader, page }) => {
      // Initialization
      const user = validUser();

      // User actions
      await authPage.login(user);

      // Verification
      await expect(page).toHaveURL(INVENTORY_URL);
      await expect(inventoryPage.getTitle()).toHaveText('Products');
      await expect(siteHeader.getHamburgerButton()).toBeVisible();
    },
  );

  test(
    'TC-AUTH-02: problem_user can authenticate and lands on inventory page @regression',
    async ({ authPage, page }) => {
      // Initialization
      const user = problemUser();

      // User actions
      await authPage.login(user);

      // Verification
      await expect(page).toHaveURL(INVENTORY_URL);
    },
  );

  test(
    'TC-AUTH-03: locked_out_user sees locked-out error message @regression',
    async ({ authPage }) => {
      // Initialization
      const user = lockedUser();

      // User actions
      await authPage.login(user);

      // Verification
      await expect(authPage.getErrorMessage()).toBeVisible();
      await expect(authPage.getErrorMessage()).toContainText(LoginErrors.lockedUser);
    },
  );

  test(
    'TC-AUTH-04: submitting empty form shows username required error @regression',
    async ({ authPage }) => {
      // Initialization
      const errorMessage = authPage.getErrorMessage();

      // User actions
      await authPage.submitEmptyForm();

      // Verification
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toContainText(LoginErrors.emptyUsername);
    },
  );

  test(
    'TC-AUTH-05: filling username but leaving password empty shows password required error @regression',
    async ({ authPage }) => {
      // Initialization
      const errorMessage = authPage.getErrorMessage();

      // User actions
      await authPage.fillUsername(validUser().username);
      await authPage.submit();

      // Verification
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toContainText(LoginErrors.emptyPassword);
    },
  );

  test(
    'TC-AUTH-06: invalid credentials show credentials mismatch error @regression',
    async ({ authPage }) => {
      // Initialization
      const user = invalidUser();

      // User actions
      await authPage.login(user);

      // Verification
      await expect(authPage.getErrorMessage()).toBeVisible();
      await expect(authPage.getErrorMessage()).toContainText(LoginErrors.invalidCredentials);
    },
  );

  test(
    'TC-AUTH-07: error banner can be dismissed with the close button @regression',
    async ({ authPage }) => {
      // Initialization
      const errorMessage = authPage.getErrorMessage();

      // User actions
      await authPage.login(lockedUser());
      await authPage.dismissError();

      // Verification
      await expect(errorMessage).toBeHidden();
    },
  );
});
