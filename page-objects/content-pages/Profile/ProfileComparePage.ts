import { Page, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export class ProfileComparePage
{
  private readonly testSteps: TestSteps;

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
    await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/profiles/${this.testSetUpData.contentTitleforTest.contentTitle}"`);

    await expect(this.page).toHaveURL(
      new RegExp(this.testSetUpData.urlForTest.url + `/profiles/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)}$`)
    );
  }

  async verifyCompareProfile()
  {
    await this.testSteps.LogInfo('Verifying "New" text has been removed from the title');
    await expect(this.page.locator('//h1[contains(text(),"Automated Test - ")]/del[text()="New"]')).toBeVisible();
    await this.testSteps.LogInfo('Verifying "Edited" text has been added to the title');
    await expect(this.page.locator('//h1[contains(text(),"Automated Test - ")]/ins[text()="Edited"]')).toBeVisible();

    // await this.testSteps.LogInfo('Verifying department changes are visible');
    // await expect(this.page.locator('//div[text()="Department"]/following-sibling::div//del[text()="new"]')).toBeVisible();
    // await expect(this.page.locator('//div[text()="Department"]/following-sibling::div//ins[text()="edited"]')).toBeVisible();

    await this.testSteps.LogInfo('Verifying "New" text has been removed from the profile summary');
    await expect(this.page.locator('//div[@class="page-summary"]//del[text()="new"]')).toBeVisible();
    await this.testSteps.LogInfo('Verifying "Edited" text has been added to the profile summary');
    await expect(this.page.locator('//div[@class="page-summary"]//ins[text()="edited"]')).toBeVisible();

    await this.testSteps.LogInfo('Verifying "New" text has been removed from the Body');
    await expect(this.page.locator('//div[@class="page-summary"]//del[text()="new"]')).toBeVisible();
    await this.testSteps.LogInfo('Verifying "Edited" text has been added to the Body');
    await expect(this.page.locator('//div[@class="page-summary"]//ins[text()="edited"]')).toBeVisible();

    await this.testSteps.LogInfo('Verifying image is shown in the del column');
    await expect(this.page.locator('//del[@class="diffmod diffimg diffsrc"]/img')).toBeVisible();
    await this.testSteps.LogInfo('Verifying  image is shown in the ins column');
    await expect(this.page.locator('//ins[@class="diffmod diffimg diffsrc"]/img')).toBeVisible();
  }

}