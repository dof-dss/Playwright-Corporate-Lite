import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { CKEditor } from '../../base-pages/CKEditor';
import { expect } from '@playwright/test';
import { UserPage } from '../../base-pages/UserPage';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';

export interface DocumentSaveData
{
  DocumentTitle: string;
  revisionLogMessage: string;
}

export class DocumentFileCreatePage
{
  // logging
  private readonly testSteps: TestSteps;

  // pages
  private readonly createPages: CreatePages;

  // locators
  private readonly DocumentTitleField: Locator;

  // error messages
  private readonly titleFieldIsRequired: Locator;

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
    this.createPages = new CreatePages(page, this.testSetUpData, this.testData);

    // locators
    this.DocumentTitleField = page.locator('#edit-name-0-value');
    
    // Error messages
    this.titleFieldIsRequired = page.getByText("Title field is required.");

  }

  // ------------------------ asserts ------------------------

  // check url on create Document page
  async createDocumentPageURLCheck()
  {
    await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/media/add/Document"`);
    await expect(this.page).toHaveURL(`${this.testSetUpData.urlForTest.url}/media/add/Document`);
  }

  // check url on return to create Document page after doing a preview 
  async returnFromPreviewDocumentPageURLCheck()
  {
    await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/media/add/Document\\?uuid"`);
    await expect(this.page).toHaveURL(new RegExp(`${this.testSetUpData.urlForTest.url}/media/add/Document\\?uuid`));
  }


  // ------------------------ filling application form ------------------------

  // enter application title 
  async enterDocumentTitle(DocumentTitle: string)
  {
    await this.testSteps.LogInfo(`Entering "${DocumentTitle}" into the Title field`);
    await this.DocumentTitleField.fill(DocumentTitle);
  }



  // ------------------------ actions related to create application  ------------------------

  // Mandatory Field Check application
  async mandatoryFieldCheck()
  {
    await this.testSteps.LogInfo('Performing mandatory field check');
    await this.testSteps.LogInfo('Clicking save button');
    await this.createPages.clickSaveButton();
    await this.testSteps.LogInfo('Verifying Title field error message appears');
    await expect(this.titleFieldIsRequired).toBeVisible();

  }

  // fill in application form elements - title summary topics etc
  async fillApplicationForm(data: DocumentSaveData)
  {
    await this.createDocumentPageURLCheck();
    await this.enterDocumentTitle(data.DocumentTitle);
    await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);
    

    
  }
}