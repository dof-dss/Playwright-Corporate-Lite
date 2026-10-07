import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { CKEditor } from '../../base-pages/CKEditor';
import { expect } from '@playwright/test';
import { UserPage } from '../../base-pages/UserPage';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { ArticleNodePage } from './ArticleNodePage';

export interface ArticleSaveData
{
  articleTitle: string;
  revisionLogMessage: string;
  articleSummary: string;
  articleBodyField: string;
  existingAudioName?: string;
}

export interface BooksHelper
{
  Book?: boolean;
  Chapter1?: boolean;
  Chapter2?: boolean;
  Paragraph1?: boolean;
  Paragraph2?: boolean;
  Glossery1?: boolean;
  Glossery2?: boolean;
};

export class ArticleCreatePage
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
    this.articleNodePage = new ArticleNodePage(page, this.testSetUpData, this.testData);

    // locators
    this.articleTitleField = page.locator('#edit-title-0-value');
    this.articleSummaryField = page.locator('#edit-field-summary-0-value');

    // Error messages
    this.titleFieldIsRequired = page.getByText("Title field is required.");
    this.summaryFieldIsRequired = page.getByText("Summary field is required.");
    this.bodyFieldIsRequired = page.getByText("Body field is required.");
  }

  // ------------------------ asserts ------------------------

  // check url on create article page
  async createArticlePageURLCheck()
  {
    await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/node/add/article"`);
    await expect(this.page).toHaveURL(`${this.testSetUpData.urlForTest.url}/node/add/article`);
  }

  // check url on return to create article page after doing a preview 
  async returnFromPreviewArticlePageURLCheck()
  {
    await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/node/add/article\\?uuid"`);
    await expect(this.page).toHaveURL(new RegExp(`${this.testSetUpData.urlForTest.url}/node/add/article\\?uuid`));
  }


  // ------------------------ filling article form ------------------------

  // enter article title 
  async enterArticleTitle(articleTitle: string)
  {
    await this.testSteps.LogInfo(`Entering "${articleTitle}" into the Title field`);
    await this.articleTitleField.fill(articleTitle);
  }

  // enter article summary 
  async enterArticleSummary(articleSummary: string)
  {
    await this.testSteps.LogInfo(`Entering "${articleSummary}" into the Summary field`);
    await this.articleSummaryField.fill(articleSummary);
  }

  // ------------------------ actions related to create article  ------------------------

  // Mandatory Field Check article
  async mandatoryFieldCheck()
  {
    await this.testSteps.LogInfo('Performing mandatory field check');
    await this.testSteps.LogInfo('Clicking save button');
    await this.createPages.clickSaveButton();
    await this.testSteps.LogInfo('Verifying Title field error message appears');
    await expect(this.titleFieldIsRequired).toBeVisible();
    await this.testSteps.LogInfo('Verifying Summary field error message appears');
    await expect(this.summaryFieldIsRequired).toBeVisible();
    await this.testSteps.LogInfo('Verifying Body field error message appears');
    await expect(this.bodyFieldIsRequired).toBeVisible();
  }

  // fill in article form elements - title summary topics etc
  async fillArticleForm(data: ArticleSaveData, ckEditorStrategy: 'standard' | 'functionality' | 'importFromWord' = 'standard')
  {
    await this.createArticlePageURLCheck();
    await this.enterArticleTitle(data.articleTitle);
    await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);
    await this.enterArticleSummary(data.articleSummary);

    switch (ckEditorStrategy)
    {
      case 'functionality':
        await this.ckeditor.enterCKEditorBodyFunctionality(data.articleBodyField, data.existingAudioName);
        break;
      case 'importFromWord':
        await this.ckeditor.enterCKEditorBodyImportFromWord(data.articleBodyField);
        break;
      default:
        await this.ckeditor.enterCKEditorBody(data.articleBodyField);
    }
  }

  // fill in article form elements with CKEditor functionality
  async fillArticleFormWithCKEditorFunctionality(data: ArticleSaveData)
  {
    await this.fillArticleForm(data, 'functionality');
  }

  // // fill in article form elements with CKEditor importing from Word
  // async fillArticleFormWithCKEditorImportingFromWord(data: ArticleSaveData)
  // {
  //   await this.fillArticleForm(data, 'importFromWord');
  // }

  async fillArticleFormWithBook(data: ArticleSaveData, option: BooksHelper)
  {
    await this.fillArticleForm(data, 'standard');

    await this.createBook(data, option);
  }

  // input Book data
  async createBook(data: ArticleSaveData, option: BooksHelper)
  {
    await this.page.getByRole('button', { name: 'Book outline Not in book' }).click();

    if (option.Book === true)
    {
      await this.page.getByLabel('Book').selectOption('new');
    }

    if (option.Chapter1 === true)
    {
      await this.page.getByLabel('Book').selectOption(this.testData.Books.BookTitle);
    }

    if (option.Paragraph1 === true)
    {
      await this.page.getByLabel('Book').selectOption(this.testData.Books.BookTitle);
      const parentItemSelect = this.page.locator('[name="book[pid]"]');
      await expect(parentItemSelect).toBeEnabled();
      const chapterValue = await this.page.locator(`//select[@name="book[pid]"]/option[contains(text(), "${this.testData.Books.Chapter1Title}")]`).getAttribute('value');
      await parentItemSelect.selectOption(chapterValue!);
    }

    if (option.Glossery1 === true)
    {
      await this.page.getByLabel('Book').selectOption(this.testData.Books.BookTitle);
      const parentItemSelect = this.page.locator('[name="book[pid]"]');
      await expect(parentItemSelect).toBeEnabled();
      const chapterValue = await this.page.locator(`//select[@name="book[pid]"]/option[contains(text(), "${this.testData.Books.Paragraph1Title}")]`).getAttribute('value');
      await parentItemSelect.selectOption(chapterValue!);
    }

    if (option.Chapter2 === true)
    {
      await this.page.getByLabel('Book').selectOption(this.testData.Books.BookTitle);
    }

    if (option.Paragraph2 === true)
    {
      await this.page.getByLabel('Book').selectOption(this.testData.Books.BookTitle);
      const parentItemSelect = this.page.locator('[name="book[pid]"]');
      await expect(parentItemSelect).toBeEnabled();
      const chapterValue = await this.page.locator(`//select[@name="book[pid]"]/option[contains(text(), "${this.testData.Books.Chapter2Title}")]`).getAttribute('value');
      await parentItemSelect.selectOption(chapterValue!);
    }

    if (option.Glossery2 === true)
    {
      await this.page.getByLabel('Book').selectOption(this.testData.Books.BookTitle);
      const parentItemSelect = this.page.locator('[name="book[pid]"]');
      await expect(parentItemSelect).toBeEnabled();
      const chapterValue = await this.page.locator(`//select[@name="book[pid]"]/option[contains(text(), "${this.testData.Books.Paragraph2Title}")]`).getAttribute('value');
      await parentItemSelect.selectOption(chapterValue!);
    }
  }

}