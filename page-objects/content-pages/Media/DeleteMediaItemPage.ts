import { Page, Locator, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';


export class DeleteMediaItemPage
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

  // check url on delete media item page
  async deleteMediaItemPageURLCheck()
  {
    await this.testSteps.LogInfo('Verifying URL contains "media/.+/delete"');
    await expect(this.page).toHaveURL(new RegExp('/media/.+/delete'));
  }

  // check for verification of delete message
  async deleteMediaItemConfirmationCheck()
  {
    await this.testSteps.LogInfo('Verifying delete confirmation messages is visible');
    
    await expect(
      this.page.locator('.messages__item').or(this.page.locator('.messages__content')).first()
    ).toContainText(/has been deleted\.|Deleted \d+ item/);
  }


  // Click delete button on Delete Page
  async clickDelete()
  {
    await this.testSteps.LogInfo('Clicking on "Delete" Button');
    await this.deleteButton.click();
  }
  // Click cancel on Delete Page
  async clickCancel()
  {
    await this.testSteps.LogInfo('Clicking on "Cancel" Button');
    await this.cancelButton.click();
  }

}