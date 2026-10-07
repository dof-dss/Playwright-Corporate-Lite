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

export interface NewsSaveData
{
  newsTitle: string;
  revisionLogMessage: string;
  newsType: string;
  newsIntoParagraph: string;
  newsteaser: string;
  newsBodyField: string;
  newsNoteToEditor: string;
  existingRemoteVideoName?: string;
}

export class NewsCreatePage
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
  private readonly newsTeaserField: Locator;

  // error messages
  private readonly titleFieldIsRequired: Locator;
  private readonly summaryFieldIsRequired: Locator;
  private readonly bodyFieldIsRequired: Locator;

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

    // Error messages
    this.titleFieldIsRequired = page.getByText('Title field is required.');
    this.summaryFieldIsRequired = page.getByText('Summary field is required.');
    this.bodyFieldIsRequired = page.getByText('Body field is required.');
  }

  // ------------------------ asserts ------------------------

  // check url on create news page
  async createNewsPageURLCheck()
  {
    await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/node/add/news"`);
    await expect(this.page).toHaveURL(`${this.testSetUpData.urlForTest.url}/node/add/news`);
  }

  // check url on return to create news page after doing a preview 
  async returnFromPreviewNewsPageURLCheck()
  {
    await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/node/add/news\\?uuid"`);
    await expect(this.page).toHaveURL(new RegExp(`${this.testSetUpData.urlForTest.url}/node/add/news\\?uuid`));
  }


  // ------------------------ filling news form ------------------------

  // enter news title 
  async enterNewsTitle(newsTitle: string)
  {
    await this.testSteps.LogInfo(`Entering "${newsTitle}" into the Title field`);
    await this.newsTitleField.fill(newsTitle);
  }

  // select news type
  async selectNewsType(newsType: string)
  {
    await this.testSteps.LogInfo(`Selecting type "${newsType}" into the Type field`);
    await this.newsTypeField.selectOption(newsType);
  }

  // enter news summary 
  async enterNewsIntroParagraph(introParagraph: string)
  {
    await this.testSteps.LogInfo(`Entering "${introParagraph}" into the introductory Paragraph field`);
    await this.newsIntroParagraphField.fill(introParagraph);
  }

  // enter news summary 
  async enterNewsTeaser(newsTeaser: string)
  {
    await this.testSteps.LogInfo(`Entering "${newsTeaser}" into the Teaser field`);
    await this.newsTeaserField.fill(newsTeaser);
  }

  // ------------------------ actions related to create news  ------------------------

  // Mandatory Field Check news
  async mandatoryFieldCheck()
  {
    // await this.testSteps.LogInfo('Performing mandatory field check');
    // await this.testSteps.LogInfo('Clicking save button');
    // await this.createPages.clickSaveButton();
    // await this.testSteps.LogInfo('Verifying Title field error message appears');
    // await expect(this.titleFieldIsRequired).toBeVisible();
    // await this.testSteps.LogInfo('Verifying Summary field error message appears');
    // await expect(this.summaryFieldIsRequired).toBeVisible();
    // await this.testSteps.LogInfo('Verifying Body field error message appears');
    // await expect(this.bodyFieldIsRequired).toBeVisible();
  }

  // fill in news form elements - title summary topics etc
  async fillNewsForm(data: NewsSaveData, ckEditorStrategy: 'standard' | 'gallery' = 'standard')
  {
    await this.createNewsPageURLCheck();
    await this.enterNewsTitle(data.newsTitle);
    await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);
    await this.selectNewsType(data.newsType);
    await this.enterNewsIntroParagraph(data.newsIntoParagraph);
    await this.enterNewsTeaser(data.newsteaser);
    await this.uploadMediaHelper.uploadImageWorkflow({
      original: true,
      edited: false
    });

    if (data.existingRemoteVideoName)
    {
      await this.uploadMediaHelper.selectExistingRemoteVideoFromLibrary(data.existingRemoteVideoName);
      // wait 2 seconds and refresh page
      await this.page.waitForTimeout(2000);
    }
    else
    {
      await this.uploadMediaHelper.uploadRemoteVideo({
        original: true,
        edited: false
      });
    }

    if (ckEditorStrategy === 'gallery')
    {
      await this.ckeditor.linkInternalNodeCKEditor(data.newsBodyField);
    }
    else
    {
      await this.ckeditor.enterCKEditorBody(data.newsBodyField);
    }

    await this.ckeditor.enterNoteToEditors(data.newsNoteToEditor);
  }

  // fill in news form elements - title summary topics etc with Gallery content using CK Editor
  async fillNewsFormWithGallery(data: NewsSaveData)
  {
    await this.fillNewsForm(data, 'gallery');
  }
}