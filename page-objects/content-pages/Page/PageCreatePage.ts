import { Page, Locator, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { CKEditor } from '../../base-pages/CKEditor';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export interface PageSaveData
{
  pageTitle: string;
  pageBody: string;
  revisionLogMessage: string;
}

export class PageCreatePage
{
  private readonly testSteps: TestSteps;
  readonly ckeditor: CKEditor;
  readonly createPages: CreatePages;

  private readonly pageTitleField: Locator;
  private readonly titleFieldIsRequired: Locator;
  private readonly bodyFieldIsRequired: Locator;

  constructor(
    private readonly page: Page,
    private testSetUpData: typeof TestSetUpData,
    private testData: typeof TestData
  )
  {
    this.testSteps = new TestSteps();
    this.createPages = new CreatePages(page, this.testSetUpData, this.testData);
    this.ckeditor = new CKEditor(page, this.testSetUpData, this.testData);

    this.pageTitleField = page.locator('#edit-title-0-value');
    this.titleFieldIsRequired = page.getByText('Title field is required.');
    this.bodyFieldIsRequired = page.getByText('Body field is required.');
  }

  async createPageURLCheck()
  {
    await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/node/add/page"`);
    await expect(this.page).toHaveURL(`${this.testSetUpData.urlForTest.url}/node/add/page`);
  }

  async returnFromPreviewPageURLCheck()
  {
    await this.testSteps.LogInfo(`Verifying URL returns to "${this.testSetUpData.urlForTest.url}/node/add/page?uuid"`);
    await expect(this.page).toHaveURL(new RegExp(`${this.testSetUpData.urlForTest.url}/node/add/page\\?uuid`));
  }

  async mandatoryFieldCheck()
  {
    await this.testSteps.LogInfo('Performing mandatory field check');
    await this.createPages.clickSaveButton();
    await expect(this.titleFieldIsRequired).toBeVisible();
    await expect(this.bodyFieldIsRequired).toBeVisible();
  }

  async enterPageTitle(pageTitle: string)
  {
    await this.testSteps.LogInfo(`Entering "${pageTitle}" into the Title field`);
    await this.pageTitleField.fill(pageTitle);
  }

  async enterPageBody(pageBody: string)
  {
    await this.ckeditor.enterCKEditorBody(pageBody);
  }

  async enterRevisionLogMessage(revisionLogMessage: string)
  {
    await this.createPages.enterRevisionLogMessage(revisionLogMessage);
  }

  async fillPageForm(data: PageSaveData)
  {
    await this.createPageURLCheck();
    await this.enterPageTitle(data.pageTitle);
    await this.enterPageBody(data.pageBody);
    await this.enterRevisionLogMessage(data.revisionLogMessage);
  }
}