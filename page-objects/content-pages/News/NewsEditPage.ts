import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { CKEditor } from '@poms/base-pages/CKEditor';
import { expect } from '@playwright/test';
import { UserPage } from '../../base-pages/UserPage';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { NewsNodePage } from './NewsNodePage';
import { UploadMediaHelper } from '@helpers/general/UploadMediaHelper';

export interface NewsEditSaveData
{
  newsTitle: string;
  revisionLogMessage: string;
  newsType: string;
  newsIntoParagraph: string;
  pubDate: string;
  newsteaser: string;
  newsBodyField: string;
  newsNoteToEditor: string;
}

export class NewsEditPage
{
  // logging
  private readonly testSteps: TestSteps;

  // pages
  readonly ckeditor: CKEditor;
  readonly userPage: UserPage;
  readonly createPages: CreatePages;
  readonly previewPage: PreviewPage;
  readonly newsNodePage: NewsNodePage;
  readonly uploadMediaHelper: UploadMediaHelper;

  // locators
  private readonly newsTitleField: Locator;
  private readonly newsTypeField: Locator;
  private readonly newsIntroParagraphField: Locator;
  private readonly newsPublicationDate: Locator;
  private readonly newsTeaserField: Locator;

  // error messages
  // private readonly titleFieldIsRequired: Locator;
  // private readonly summaryFieldIsRequired: Locator;
  // private readonly bodyFieldIsRequired: Locator;

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
    this.newsNodePage = new NewsNodePage(page, this.testSetUpData, this.testData);
    this.uploadMediaHelper = new UploadMediaHelper(page, this.testSetUpData, this.testData);

    // locators
    this.newsTitleField = page.locator('#edit-title-0-value');
    this.newsTypeField = page.locator('#edit-field-news-type');
    this.newsIntroParagraphField = page.locator('#edit-field-summary-0-value');
    this.newsTeaserField = page.locator('#edit-field-teaser-0-value');
    this.newsPublicationDate = page.locator('#edit-field-published-date-0-value-date');

    // Error messages
    // this.titleFieldIsRequired = page.getByText("Title field is required.");
    // this.bodyFieldIsRequired = page.getByText("Body field is required.");
  }

  // ------------------------ asserts ------------------------

  // check url on edit news page
  async editNewsPageURLCheck()
  {
    await this.testSteps.LogInfo('Verifying URL contains "edit"');
    await expect(this.page).toHaveURL(/\/edit/);
  }

  // check url on return to create news page after doing a preview 
  async returnFromPreviewNewsPageURLCheck()
  {
    await this.testSteps.LogInfo('Verifying URL contains "/node/.+/edit\\?uuid"');
    await expect(this.page).toHaveURL(new RegExp('/node/.+/edit\\?uuid'));
  }

  // ------------------------ filling news form ------------------------

  // enter news title 
  async editNewsTitle(newsTitle: string)
  {
    await this.testSteps.LogInfo(`Entering "${newsTitle}" into the Title field`);
    await this.newsTitleField.fill(newsTitle);
  }

  // enter news title 
  async editNewsType(newsType: string)
  {
    await this.testSteps.LogInfo(`Selecting type "${newsType}" into the Type field`);
    await this.newsTypeField.selectOption(newsType);
  }

  // enter news summary 
  async editNewsIntroParagraph(introParagraph: string)
  {
    await this.testSteps.LogInfo(`Entering "${introParagraph}" into the introductory Paragraph field`);
    await this.newsIntroParagraphField.fill(introParagraph);
  }

  // enter pub date 
  async editPublicationDate(pubDate: string)
  {
    await this.testSteps.LogInfo(`Entering "${pubDate}" into the Publication Date field`);
    await this.newsPublicationDate.fill(pubDate);
  }

  // enter news summary 
  async editNewsTeaser(newsTeaser: string)
  {
    await this.testSteps.LogInfo(`Entering "${newsTeaser}" into the Teaser field`);
    await this.newsTeaserField.fill(newsTeaser);
  }

  // ------------------------ actions related to create news  ------------------------

  // Mandatory Field Check news
  async mandatoryFieldCheck()
  {
    // await this.createPages.clickSaveButton();
    // await expect(this.titleFieldIsRequired).toBeVisible();
    // await expect(this.summaryFieldIsRequired).toBeVisible();
    // await expect(this.bodyFieldIsRequired).toBeVisible();
  }

  // ------------------------ actions related to edit news  ------------------------

  // fill in news form elements - title summary topics etc
  async editNewsForm(data: NewsEditSaveData)
  {
    await this.editNewsPageURLCheck();
    await this.editNewsTitle(data.newsTitle);
    await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);
    await this.editNewsType(data.newsType);
    await this.editNewsIntroParagraph(data.newsIntoParagraph);
    await this.editPublicationDate(data.pubDate);
    await this.editNewsTeaser(data.newsteaser);
    await this.page.waitForTimeout(1000);
    await expect(this.page.locator('//input[contains(@id,"edit-field-video-selection-0-remove-button")]')).toBeEnabled();
    await this.page.locator('//input[contains(@id,"edit-field-video-selection-0-remove-button")]').click();
    await this.page.waitForTimeout(1000);
    await expect(this.page.locator('//input[contains(@id,"edit-field-photo-selection-0-remove-button")]')).toBeEnabled();
    await this.page.locator('//input[contains(@id,"edit-field-photo-selection-0-remove-button")]').click();
    await this.page.waitForTimeout(1000);
    await this.uploadMediaHelper.uploadImageWorkflow({
      original: false,
      edited: true
    });
    await this.page.waitForTimeout(1000);
    await this.uploadMediaHelper.uploadRemoteVideo({
      original: false,
      edited: true
    });
    await this.ckeditor.enterCKEditorBody(data.newsBodyField);
    await this.ckeditor.enterNoteToEditors(data.newsNoteToEditor);
  }
}