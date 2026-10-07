import { Page } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { expect } from '@playwright/test';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export class ProfileNodePage
{
  private readonly testSteps: TestSteps;
  private readonly profileImageSelector = '//div[contains(@class,"media-image")]//img';

  constructor(
    private readonly page: Page,
    private readonly testSetUpData: typeof TestSetUpData,
    private readonly testData: typeof TestData
  )
  {
    this.testSteps = new TestSteps();
  }

  async profileNodeURLCheck()
  {
    const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();
    const escapedTitle = escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle);

    await this.testSteps.LogInfo(`Verifying URL path is /profiles/${escapedTitle} with optional -suffix and optional trailing path, or is /node/.+/latest`);
    await expect(this.page).toHaveURL(
      new RegExp(`(?:${this.testSetUpData.urlForTest.url}/profiles/${escapedTitle}(?:-[^/]+)?(?:/.*)?$)|(?:/node/.+/latest)`)
    );
  }

  async verifyProfile()
  {
    await this.testSteps.LogInfo(`Verifying title "${this.testData.Profile.title}" is visible`);
    await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.Profile.title);

    // await this.testSteps.LogInfo(`Verifying Department "${this.testData.Profile.department}" is visible`);
    // await expect(this.page.getByText(this.testData.Profile.department)).toBeVisible();

    await this.testSteps.LogInfo(`Verifying Summary "${this.testData.Profile.summary}" is visible`);
    await expect(this.page.getByText(this.testData.Profile.summary)).toBeVisible();

    await this.testSteps.LogInfo(`Verifying Body "${this.testData.Profile.body}" is visible`);
    await expect(this.page.getByText(this.testData.Profile.body)).toBeVisible();

    await this.testSteps.LogInfo('Verifying profile image is visible');
    await expect(this.page.locator(this.profileImageSelector)).toBeVisible();
  }

  async verifyEditedProfile()
  {
    await this.testSteps.LogInfo(`Verifying title "${this.testData.Profile.titleEdited}" is visible`);
    await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.Profile.titleEdited);

    // await this.testSteps.LogInfo(`Verifying Department "${this.testData.Profile.departmentEdited}" is visible`);
    // await expect(this.page.getByText(this.testData.Profile.departmentEdited)).toBeVisible();

    await this.testSteps.LogInfo(`Verifying Summary "${this.testData.Profile.summaryEdited}" is visible`);
    await expect(this.page.getByText(this.testData.Profile.summaryEdited)).toBeVisible();

    await this.testSteps.LogInfo(`Verifying Body "${this.testData.Profile.bodyEdited}" is visible`);
    await expect(this.page.getByText(this.testData.Profile.bodyEdited)).toBeVisible();

    await this.testSteps.LogInfo('Verifying profile image is visible');
    await expect(this.page.locator(this.profileImageSelector)).toBeVisible();

  }
}