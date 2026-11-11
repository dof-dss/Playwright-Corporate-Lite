import { Page, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export class PageComparePage
{
  private readonly testSteps: TestSteps;

  constructor(
    private readonly page: Page,
    private testSetUpData: typeof TestSetUpData,
    private testData: typeof TestData
  )
  {
    this.testSteps = new TestSteps();
  }

  async verifyComparePage()
  {
    const pageTitle = this.page.locator('//h2//a//span');
    await this.testSteps.LogInfo('Verifying "New" text has been removed from the title');
    await expect(pageTitle.locator('del')).toHaveText('New');
    await this.testSteps.LogInfo('Verifying "Edited" text has been added to the title');
    await expect(pageTitle.locator('ins')).toHaveText('Edited');

    const pageBody = this.page.locator('//p[contains(normalize-space(.), "page body content")]');
    await this.testSteps.LogInfo('Verifying "new" text has been removed from the Body field');
    await expect(pageBody.locator('del')).toHaveText('a new');
    await this.testSteps.LogInfo('Verifying "edited" text has been added to the Body field');
    await expect(pageBody.locator('ins')).toHaveText('an edited');
  }
}