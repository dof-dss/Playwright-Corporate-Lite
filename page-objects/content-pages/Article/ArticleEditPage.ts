import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { CKEditor } from '../../base-pages/CKEditor';
import { expect } from '@playwright/test';
import { UserPage } from '../../base-pages/UserPage';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { ArticleNodePage } from './ArticleNodePage';

export interface ArticleEditSaveData
{
  articleTitle: string;
  revisionLogMessage: string;
  articleSummary: string;
  areaOfExpertise: string;
  areaOfExpertise2: string;
  service: string;
  service2: string;
  articleBodyField: string;
  SecondAreaOfExpertise?: boolean;
  SecondService?: boolean;
}

export class ArticleEditPage
{
  // logging
  private readonly testSteps: TestSteps;

  // pages
  readonly ckeditor: CKEditor;
  readonly userPage: UserPage;
  readonly createPages: CreatePages;
  readonly previewPage: PreviewPage;
  readonly articleNodePage: ArticleNodePage;

  // locators
  private readonly articleTitleField: Locator;
  private readonly articleSummaryField: Locator;

  // constructor
  constructor(
    private readonly page: Page,
    // isolated instances of test data 
    private testSetUpData: typeof TestSetUpData,
    private testData: typeof TestData
  )
  {
    // logging isolated instance
    this.testSteps = new TestSteps();

    // imported pages
    this.userPage = new UserPage(page, this.testSetUpData);
    this.createPages = new CreatePages(page, this.testSetUpData, this.testData);
    this.ckeditor = new CKEditor(page, this.testSetUpData, testData);
    this.previewPage = new PreviewPage(page);
    this.articleNodePage = new ArticleNodePage(page, this.testSetUpData, this.testData);

    // locators
    this.articleTitleField = page.locator('#edit-title-0-value');
    this.articleSummaryField = page.locator('#edit-field-summary-0-value');
  }

  // ------------------------ asserts ------------------------

  // check url on edit article page
  async editArticlePageURLCheck()
  {
    await this.testSteps.LogInfo('Verifying URL contains "edit"');
    await expect(this.page).toHaveURL(/\/edit/);
  }

  // check url on return to create article page after doing a preview 
  async returnFromPreviewArticlePageURLCheck()
  {
    await this.testSteps.LogInfo('Verifying URL contains "/node/.+/edit\\?uuid"');
    await expect(this.page).toHaveURL(new RegExp('/node/.+/edit\\?uuid'));
  }

  // ------------------------ filling article form ------------------------

  // edit article title 
  async editArticleTitle(articleTitle: string)
  {
    await this.testSteps.LogInfo(`Entering "${articleTitle}" into the Title field`);
    await this.articleTitleField.fill(articleTitle);
  }

  // edit article summary 
  async editArticleSummary(articleSummary: string)
  {
    await this.testSteps.LogInfo(`Entering "${articleSummary}" into the Summary field`);
    await this.articleSummaryField.fill(articleSummary);
  }

  async selectAreaOfExpertise(areaOfExpertise: string)
  {
    await this.testSteps.LogInfo(`Selecting "${areaOfExpertise}" from the Area of expertise dropdown`);
    await this.page.locator('#edit-field-site-topics-shs-0-0').selectOption({ label: areaOfExpertise });

    await this.page.waitForTimeout(1000);
  }

  async clickAddAnotherAreaOfExpertise()
  {
    await this.testSteps.LogInfo('Clicking Add another item for Area of expertise');
    await this.page.locator('.js-form-item-field-site-topics')
      .getByText('Add another item', { exact: true }).click();
  }

  async selectAreaOfExpertise2(areaOfExpertise2: string)
  {
    await this.testSteps.LogInfo(`Selecting "${areaOfExpertise2}" from the Area of expertise dropdown`);
    await this.page.locator('#edit-field-site-topics-shs-1-0').selectOption({ label: areaOfExpertise2 });
  }

  async selectService(service: string)
  {
    await this.testSteps.LogInfo(`Selecting "${service}" from the Service dropdown`);
    await this.page.locator('#edit-field-site-services-shs-0-0').selectOption({ label: service });
  }

  async clickAddAnotherService()
  {
    await this.testSteps.LogInfo('Clicking Add another item for Service');
    await this.page.locator('.js-form-item-field-site-services')
      .getByText('Add another item', { exact: true }).click();
  }

  async selectService2(service2: string)
  {
    await this.testSteps.LogInfo(`Selecting "${service2}" from the Service dropdown`);
    await this.page.locator('#edit-field-site-services-shs-1-0').selectOption({ label: service2 });

    await this.page.waitForTimeout(500);
  }

  // ------------------------ actions related to edit article  ------------------------

  // fill in article form elements - title summary topics etc
  async editArticleForm(data: ArticleEditSaveData)
  {
    await this.editArticlePageURLCheck();
    await this.editArticleTitle(data.articleTitle);
    await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);
    //Adding another first before setting first back to none
    
    // Will always add a second area of expertise as the first one is set to - None - to ensure this does not display - None - or 
    // if it will ignore the 2nd area of expertise
    await this.clickAddAnotherAreaOfExpertise();
    await this.selectAreaOfExpertise2(data.areaOfExpertise2);

    await this.selectAreaOfExpertise(data.areaOfExpertise);
    await this.editArticleSummary(data.articleSummary);
    await this.selectService(data.service);

    if (data.SecondService === true)
    {
      if (!(await this.page.locator('#edit-field-site-services-shs-1-0').isVisible()))
      {
        await this.clickAddAnotherService();
      }
      await this.selectService2(data.service2);
    }
    await this.ckeditor.enterCKEditorBody(data.articleBodyField);
  }
}