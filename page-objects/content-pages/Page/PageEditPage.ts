import { Page, Locator, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { CKEditor } from '../../base-pages/CKEditor';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export interface PageEditSaveData
{
  pageTitle: string;
  pageBody: string;
  revisionLogMessage: string;
}

export class PageEditPage
{
  private readonly testSteps: TestSteps;
  private readonly ckeditor: CKEditor;
  private readonly createPages: CreatePages;
  private readonly pageTitleField: Locator;

  constructor(
    private readonly page: Page,
    private testSetUpData: typeof TestSetUpData,
    private testData: typeof TestData
  )
  {
    this.testSteps = new TestSteps();
    this.ckeditor = new CKEditor(page, this.testSetUpData, this.testData);
    this.createPages = new CreatePages(page, this.testSetUpData, this.testData);
    this.pageTitleField = page.locator('#edit-title-0-value');
  }

  async editPagePageURLCheck()
  {
    await this.testSteps.LogInfo('Verifying URL contains "/edit"');
    await expect(this.page).toHaveURL(/\/edit(?:\?.*)?$/);
  }

  async returnFromPreviewPagePageURLCheck()
  {
    await this.testSteps.LogInfo('Verifying URL returns to the Page edit form after preview');
    await expect(this.page).toHaveURL(/\/node\/\d+\/edit\?uuid=/);
  }

  async editPageTitle(pageTitle: string)
  {
    await this.testSteps.LogInfo(`Entering "${pageTitle}" into the Title field`);
    await this.pageTitleField.fill(pageTitle);
  }

  async editPageBody(pageBody: string)
  {
    await this.ckeditor.enterCKEditorBody(pageBody);
  }

  async editPageForm(data: PageEditSaveData)
  {
    await this.editPagePageURLCheck();
    await this.editPageTitle(data.pageTitle);
    await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);
    await this.editPageBody(data.pageBody);
  }
}