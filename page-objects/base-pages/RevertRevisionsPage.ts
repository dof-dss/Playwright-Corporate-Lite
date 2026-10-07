import { Page, Locator, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';

export class RevertRevisionsPage
{
  // logging
  private readonly testSteps: TestSteps;

  // locators
  private readonly revertButton: Locator;
  private readonly cancelButton: Locator;

  // constructor
  constructor(
    private readonly page: Page,
  )
  {
    // logging isolated instance
    this.testSteps = new TestSteps();

    // locators
    this.revertButton = page.getByRole('button', { name: 'Revert' });
    this.cancelButton = page.getByRole('link', { name: 'Cancel' });
  }

  // ------------------------ asserts ------------------------

  // check url on revert revision page
  async revertRevisionsPageURLCheck()
  {
    await this.testSteps.LogInfo('Verifying URL contains "/node/.+/revisions/.+/revert"');
    await expect(this.page).toHaveURL(new RegExp('/node/.+/revisions/.+/revert'));
  }

  // check for verification of reverting message
  async revertRevisionCofirmationCheck()
  {
    await this.testSteps.LogInfo('Verifying revert revisions confirmation messages is visible');
    await expect(this.page.locator('.messages-list__wrapper')).toContainText('has been reverted');
  }


  // edit application title 
  async clickRevert()
  {
    await this.testSteps.LogInfo('Clicking on "Revert" button');
    await this.revertButton.click();
  }

  async clickCancel()
  {
    await this.testSteps.LogInfo('Clicking on "Cancel" button');
    await this.cancelButton.click();
  }

}