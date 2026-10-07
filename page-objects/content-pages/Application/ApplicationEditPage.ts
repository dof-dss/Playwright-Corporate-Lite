import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { CKEditor } from '../../base-pages/CKEditor';
import { expect } from '@playwright/test';
import { UserPage } from '../../base-pages/UserPage';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { ApplicationNodePage } from './ApplicationNodePage';

export interface ApplicationEditSaveData
{
  applicationTitle: string;
  revisionLogMessage: string;
  applicationSummary: string;
  beforeyoustart: string;
  additionalinfo: string;
  topic: string;
  topic2: string;
}

export class ApplicationEditPage
{
  // logging
  private readonly testSteps: TestSteps;

  // pages
  readonly ckeditor: CKEditor;
  readonly userPage: UserPage;
  readonly createPages: CreatePages;
  readonly previewPage: PreviewPage;
  readonly applicationNodePage: ApplicationNodePage;

  // locators
  private readonly applicationTitleField: Locator;
  private readonly applicationSummaryField: Locator;
  private readonly applicationLinkURLField: Locator;
  private readonly applicationLinkTextField: Locator;

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
  }

  // ------------------------ asserts ------------------------

  // check url on edit application page
  async editApplicationPageURLCheck()
  {
    await this.testSteps.LogInfo('Verifying URL contains "edit"');
    await expect(this.page).toHaveURL(/\/edit/);
  }

  // check url on return to create application page after doing a preview 
  async returnFromPreviewApplicationPageURLCheck()
  {
    await this.testSteps.LogInfo('Verifying URL contains "/node/.+/edit\\?uuid"');
    await expect(this.page).toHaveURL(new RegExp('/node/.+/edit\\?uuid'));
  }

  // ------------------------ filling application form ------------------------

  // edit application title 
  async editApplicationTitle(applicationTitle: string)
  {
    await this.testSteps.LogInfo(`Entering "${applicationTitle}" into the Title field`);
    await this.applicationTitleField.fill(applicationTitle);
  }

  // edit application summary 
  async editApplicationSummary(applicationSummary: string)
  {
    await this.testSteps.LogInfo(`Entering "${applicationSummary}" into the Summary field`);
    await this.applicationSummaryField.fill(applicationSummary);
  }

  // edit HSE Site Topic
  async editHSESiteTopic(topic: string)
  {
    await this.testSteps.LogInfo(`Selecting "${topic}" from the HSE Site Topic dropdown`);
    await this.page.locator('#edit-field-site-topics-shs-0-0').selectOption({ label: topic });
  }

  // click add second hse site topic button
  async clickAddSecondHSESiteTopicButton()
  {
    await this.testSteps.LogInfo('Clicking the "Add another item" button to add the second HSE Site Topic');
    await this.page.getByText('Add another item').click();
  }

  // add second HSE Site Topic
  async addSecondHSESiteTopic(topic2: string)
  {
    await this.testSteps.LogInfo(`Selecting "${topic2}" from the second HSE Site Topic dropdown`);
    await this.page.locator('#edit-field-site-topics-shs-1-0').selectOption({ label: topic2 });
  }

  // ------------------------ actions related to edit application  ------------------------

  // fill in application form elements - title summary topics etc
  async editApplicationForm(data: ApplicationEditSaveData)
  {
    await this.editApplicationPageURLCheck();
    await this.editApplicationTitle(data.applicationTitle);
    await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);
    await this.ckeditor.enterCKEditorBeforeYouStart(data.beforeyoustart);
    await this.editApplicationSummary(data.applicationSummary);
    await this.ckeditor.enterCKEditorAdditionalInfo(data.additionalinfo);
    await this.editHSESiteTopic(data.topic);
    await this.clickAddSecondHSESiteTopicButton();
    await this.addSecondHSESiteTopic(data.topic2);
  }
}