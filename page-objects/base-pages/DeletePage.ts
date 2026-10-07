import { Page, Locator, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';


export class DeletePage {
  // logging
  private readonly testSteps: TestSteps;

  // locators
  private readonly deleteButton: Locator;
  private readonly cancelButton: Locator;

  // constructor
  constructor(
    private readonly page: Page,
  ) {
    // logging isolated instance
    this.testSteps = new TestSteps();

    // locators
    this.deleteButton = page.getByRole('button', { name: 'Delete' });
    this.cancelButton = page.getByRole('link', { name: 'Cancel' });
  }

  // ------------------------ asserts ------------------------

  // check url on delete application page
  async deleteNodePageURLCheck() {
    await this.testSteps.LogInfo('Verifying URL contains "node/.+/delete"');
    await expect(this.page).toHaveURL(new RegExp('/node/.+/delete'));
  }

  // check for verification of delete message
  async deleteNodeCofirmationCheck() {
    await this.testSteps.LogInfo('Verifying delete confirmation messages is visible');
    await expect(this.page.locator('.messages__item')).toContainText('has been deleted.');
  }


  // Click delete button on Delete Page
  async clickDelete() {
    await this.testSteps.LogInfo('Clicking on "Delete" Button');
    await this.deleteButton.click();
  }
  // Click cancel on Delete Page
  async clickCancel() {
    await this.testSteps.LogInfo('Clicking on "Cancel" Button');
    await this.cancelButton.click();
  }

}