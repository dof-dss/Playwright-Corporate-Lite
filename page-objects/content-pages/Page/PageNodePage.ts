import { Page } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { expect } from '@playwright/test';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export class PageNodePage
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

  async verifyPage()
  {
    await this.testSteps.LogInfo(`Verifying title "${this.testData.Page.title}" is visible`);
    await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.Page.title);

    await this.testSteps.LogInfo(`Verifying Page body "${this.testData.Page.body}" is visible`);
    await expect(this.page.getByText(this.testData.Page.body, { exact: true })).toBeVisible();
  }

  async verifyEditedPage()
  {
    await this.testSteps.LogInfo(`Verifying edited title "${this.testData.Page.titleEdited}" is visible`);
    await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.Page.titleEdited);

    await this.testSteps.LogInfo(`Verifying edited Page body "${this.testData.Page.bodyEdited}" is visible`);
    await expect(this.page.getByText(this.testData.Page.bodyEdited, { exact: true })).toBeVisible();
  }
}