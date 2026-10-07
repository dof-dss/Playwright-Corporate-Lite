import { Page, Locator, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';


export class DeleteRevisionsPage
{
  // logging
  private readonly testSteps: TestSteps;

  // locators
  private readonly deleteButton: Locator;
  private readonly cancelButton: Locator;

  // constructor
  constructor(
    private readonly page: Page,
  )
  {
    // logging isolated instance
    this.testSteps = new TestSteps();

    // locators
    this.deleteButton = page.getByRole('button', { name: 'Delete' });
    this.cancelButton = page.getByRole('link', { name: 'Cancel' });
  }

  // ------------------------ asserts ------------------------

  // check url on delete revision page
  async deleteRevisionsPageURLCheck()
  {
    await this.testSteps.LogInfo('Verifying URL contains "/node/.+/revisions/.+/delete"');
    await expect(this.page).toHaveURL(new RegExp('/node/.+/revisions/.+/delete'));
  }

  // check for verification of delete message
  async deleteRevisionCofirmationCheck()
  {

    await this.testSteps.LogInfo('Verifying delete revisions confirmation messages is visible');
    const confirmationMessage = this.page.locator('.messages__item').or(this.page.locator('.messages__content'));
    await expect(confirmationMessage).toContainText('has been deleted.');

  }


  // Click Delete 
  async clickDelete()
  {
    await this.testSteps.LogInfo('Clicking on "Delete" Button');
    await this.deleteButton.click();
  }

  // Click Cancel
  async clickCancel()
  {
    await this.testSteps.LogInfo('Clicking on "Cancel" Button');
    await this.cancelButton.click();
  }

}