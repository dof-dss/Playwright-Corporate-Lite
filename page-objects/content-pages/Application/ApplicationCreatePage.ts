import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { CKEditor } from '../../base-pages/CKEditor';
import { expect } from '@playwright/test';
import { UserPage } from '../../base-pages/UserPage';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { ApplicationNodePage } from './ApplicationNodePage';

export interface ApplicationSaveData
{
  applicationTitle: string;
  revisionLogMessage: string;
  applicationSummary: string;
  beforeyoustart: string;
  additionalinfo: string;
  topic: string;
}

export class ApplicationCreatePage
{
  // logging
  private readonly testSteps: TestSteps;

  // pages
  private readonly ckeditor: CKEditor;
  private readonly userPage: UserPage;
  private readonly createPages: CreatePages;
  private readonly previewPage: PreviewPage;
  private readonly applicationNodePage: ApplicationNodePage;

  // locators
  private readonly applicationTitleField: Locator;
  private readonly applicationSummaryField: Locator;
  private readonly applicationLinkURLField: Locator;
  private readonly applicationLinkTextField: Locator;

  // error messages
  private readonly titleFieldIsRequired: Locator;
  private readonly summaryFieldIsRequired: Locator;

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
    this.applicationNodePage = new ApplicationNodePage(page, this.testSetUpData, this.testData);

    // locators
    this.applicationTitleField = page.locator('#edit-title-0-value');
    this.applicationSummaryField = page.locator('#edit-field-summary-0-value');
    this.applicationLinkURLField = page.locator('#edit-field-link-0-uri');
    this.applicationLinkTextField = page.locator('#edit-field-link-0-title');

    // Error messages
    this.titleFieldIsRequired = page.getByText("Title field is required.");
    this.summaryFieldIsRequired = page.getByText("Summary field is required.");
  }

  // ------------------------ asserts ------------------------

  // check url on create application page
  async createApplicationPageURLCheck()
  {
    await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/node/add/application"`);
    await expect(this.page).toHaveURL(`${this.testSetUpData.urlForTest.url}/node/add/application`);
  }

  // check url on return to create application page after doing a preview 
  async returnFromPreviewApplicationPageURLCheck()
  {
    await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/node/add/application\\?uuid"`);
    await expect(this.page).toHaveURL(new RegExp(`${this.testSetUpData.urlForTest.url}/node/add/application\\?uuid`));
  }


  // ------------------------ filling application form ------------------------

  // enter application title 
  async enterApplicationTitle(applicationTitle: string)
  {
    await this.testSteps.LogInfo(`Entering "${applicationTitle}" into the Title field`);
    await this.applicationTitleField.fill(applicationTitle);
  }

  // enter application summary 
  async enterApplicationSummary(applicationSummary: string)
  {
    await this.testSteps.LogInfo(`Entering "${applicationSummary}" into the Summary field`);
    await this.applicationSummaryField.fill(applicationSummary);
  }

  // select HSE Site Topic
  async selectHSESiteTopic(topic: string)
  {
    await this.testSteps.LogInfo(`Selecting "${topic}" from the HSE Site Topic dropdown`);
    await this.page.locator('#edit-field-site-topics-shs-0-0').selectOption({ label: topic });
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
    await this.testSteps.LogInfo('Verifying Summary field error message appears');
    await expect(this.summaryFieldIsRequired).toBeVisible();
  }

  // fill in application form elements - title summary topics etc
  async fillApplicationForm(data: ApplicationSaveData)
  {
    await this.createApplicationPageURLCheck();
    await this.enterApplicationTitle(data.applicationTitle);
    await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);
    await this.ckeditor.enterCKEditorBeforeYouStart(data.beforeyoustart);
    await this.enterApplicationSummary(data.applicationSummary);
    await this.ckeditor.enterCKEditorAdditionalInfo(data.additionalinfo);
    await this.selectHSESiteTopic(data.topic);
  }
}