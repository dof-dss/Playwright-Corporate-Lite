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
    //-------------------- TITLE --------------------
    const title = this.page.locator('//h2/a/span[contains(text(),"Automated Test - ")]');
    await this.testSteps.LogInfo('Verifying old title text was removed');
    await expect(title.locator('del')).toHaveText('New');
    await this.testSteps.LogInfo('Verifying edited title text was added');
    await expect(title.locator('ins')).toHaveText('Edited');

    //-------------------- PHOTO --------------------
    const photo = this.page.locator('del.diffmod.diffimg.diffsrc');
    await this.testSteps.LogInfo('Verifying original profile photo is visible');
    await expect(photo.locator('img')).toBeVisible();
    await this.testSteps.LogInfo('Verifying replacement profile photo is visible');
    await expect(this.page.locator('ins.diffmod.diffimg.diffsrc img')).toBeVisible();

    //-------------------- SUMMARY --------------------
    const summary = this.page.locator('p').filter({ hasText: 'Profile summary' });
    await this.testSteps.LogInfo('Verifying old summary text was removed');
    await expect(summary.locator('del')).toHaveText('new');
    await this.testSteps.LogInfo('Verifying edited summary text was added');
    await expect(summary.locator('ins')).toHaveText('edited');

    //-------------------- BODY FIELD --------------------
    const body = this.page.locator('p').filter({ hasText: 'Profile body content' });
    await this.testSteps.LogInfo('Verifying old body text was removed');
    await expect(body.locator('del')).toHaveText('new');
    await this.testSteps.LogInfo('Verifying edited body text was added');
    await expect(body.locator('ins')).toHaveText('edited');

    //-------------------- DEPARTMENT --------------------
    const department = this.page.locator('//div[normalize-space(.)="Department"]/following-sibling::div');
    await this.testSteps.LogInfo('Verifying old department text was removed');
    await expect(department.locator('del')).toHaveText('new');
    await this.testSteps.LogInfo('Verifying edited department text was added');
    await expect(department.locator('ins')).toHaveText('edited');
  }

}