import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { CKEditor } from '../../base-pages/CKEditor';
import { expect } from '@playwright/test';
import { UserPage } from '../../base-pages/UserPage';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { UploadMediaHelper } from '@helpers/general/UploadMediaHelper';

export interface ConsultationSaveData
{
  consultationTitle: string;
  revisionLogMessage: string;
  consultationSummary: string;
  consultationStartDate: string;
  consultationStartTime: string;
  consultationEndDate: string;
  consultationEndTime: string;
  consultationBody: string;
  consultationRespondOnline: string;
  consultationEmailAddress: string;
  consultationPostalAddress: string;
  existingRemoteDocumentName?: string;
}

export class ConsultationCreatePage
{
  // logging
  private readonly testSteps: TestSteps;

  // pages
  readonly ckeditor: CKEditor;
  readonly userPage: UserPage;
  readonly createPages: CreatePages;
  readonly previewPage: PreviewPage;
  readonly uploadMediaHelper: UploadMediaHelper;

  // locators
  private readonly consultationTitleField: Locator;
  private readonly consultationSummaryField: Locator;
  private readonly consultationStartDate: Locator;
  private readonly consultationStartTime: Locator;
  private readonly consultationEndDate: Locator;
  private readonly consultationEndTime: Locator;
  private readonly consultationRespondOnline: Locator;
  private readonly consultationEmailAddress: Locator;
  private readonly consultationPostalAddress: Locator;

  // error messages
  private readonly titleFieldIsRequired: Locator;
  private readonly summaryFieldIsRequired: Locator;
  private readonly consultationDatesIsRequired: Locator;
  private readonly bodyIsRequired: Locator;

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
    this.uploadMediaHelper = new UploadMediaHelper(page, this.testSetUpData, testData);

    // locators
    this.consultationTitleField = page.locator('#edit-title-0-value');
    this.consultationSummaryField = page.locator('#edit-field-summary-0-value');
    this.consultationStartDate = page.locator('#edit-field-consultation-dates-0-value-date');
    this.consultationStartTime = page.locator('#edit-field-consultation-dates-0-value-time');
    this.consultationEndDate = page.locator('#edit-field-consultation-dates-0-end-value-date');
    this.consultationEndTime = page.locator('#edit-field-consultation-dates-0-end-value-time');
    this.consultationRespondOnline = page.locator('#edit-field-respond-online-0-uri');
    this.consultationEmailAddress = page.locator('#edit-field-email-address-0-value');
    this.consultationPostalAddress = page.locator('#edit-field-postal-0-value');

    // Error messages
    this.titleFieldIsRequired = page.getByText("Title field is required.");
    this.summaryFieldIsRequired = page.getByText("Summary field is required.");
    this.consultationDatesIsRequired = page.getByText("The Consultation dates date is required.");
    this.bodyIsRequired = page.getByText("Body field is required.");

  }

  // ------------------------ asserts ------------------------

  // check url on create consultation page
  async createConsultationPageURLCheck()
  {
    await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/node/add/consultation"`);

    await expect(this.page).toHaveURL(`${this.testSetUpData.urlForTest.url}/node/add/consultation`);
  }

  // check url on return to create consultation page after doing a preview 
  async returnFromPreviewConsultationPageURLCheck()
  {
    await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/node/add/consultation\\?uuid"`);
    await expect(this.page).toHaveURL(new RegExp(`${this.testSetUpData.urlForTest.url}/node/add/consultation\\?uuid`));
  }


  // ------------------------ filling consultation form ------------------------

  // enter consultation title 
  async enterConsultationTitle(consultationTitle: string)
  {
    await this.testSteps.LogInfo(`Entering "${consultationTitle}" into the Title field`);
    await this.consultationTitleField.fill(consultationTitle);
  }

  // enter consultation summary 
  async enterConsultationSummary(consultationSummary: string)
  {
    await this.testSteps.LogInfo(`Entering "${consultationSummary}" into the Summary field`);
    await this.consultationSummaryField.fill(consultationSummary);
  }

  // enter consultation consultation Start date
  async enterConsultationStartDate(consultationStartDate: string)
  {
    await this.testSteps.LogInfo(`Entering "${consultationStartDate}" into the start date field`);
    await this.consultationStartDate.fill(consultationStartDate);
  }

  // enter consultation consultation Start time
  async enterConsultationStartTime(consultationStartTime: string)
  {
    await this.testSteps.LogInfo(`Entering "${consultationStartTime}" into the start time field`);
    await this.consultationStartTime.fill(consultationStartTime);
  }

  // enter consultation consultation End date
  async enterConsultationEndDate(consultationEndDate: string)
  {
    await this.testSteps.LogInfo(`Entering "${consultationEndDate}" into the End date field`);
    await this.consultationEndDate.fill(consultationEndDate);
  }

  // enter consultation consultation End Time
  async enterConsultationEndTime(consultationEndTime: string)
  {
    await this.testSteps.LogInfo(`Entering "${consultationEndTime}" into the End time field`);
    await this.consultationEndTime.fill(consultationEndTime);
  }

  // enter consultation consultation Respond Online
  async enterConsultationRespondOnline(respondeOnline: string)
  {
    await this.testSteps.LogInfo(`Entering "${respondeOnline}" into Respond Online and selecting matching item`);
    await this.consultationRespondOnline.fill(respondeOnline);
    await this.page.getByText(respondeOnline, { exact: false }).first().click();
  }

  // enter consultation consultation Email Address
  async enterConsultationEmailAddress(emailAddress: string)
  {
    await this.testSteps.LogInfo(`Entering "${emailAddress}" into the Email address field`);
    await this.consultationEmailAddress.fill(emailAddress);
  }

  // enter consultation consultation Postal Address
  async enterConsultationPostalAddress(postalAddress: string)
  {
    await this.testSteps.LogInfo(`Entering "${postalAddress}" into the Post code field`);
    await this.consultationPostalAddress.fill(postalAddress);
  }

  // ------------------------ actions related to create consultation  ------------------------

  // Mandatory Field Check consultation
  async mandatoryFieldCheck()
  {
    await this.testSteps.LogInfo('Performing mandatory field check');
    await this.testSteps.LogInfo('Clicking save button');
    await this.createPages.clickSaveButton();
    await this.testSteps.LogInfo('Verifying Title field error message appears');
    await expect(this.titleFieldIsRequired).toBeVisible();
    await this.testSteps.LogInfo('Verifying Summary field error message appears');
    await expect(this.summaryFieldIsRequired).toBeVisible();
    await this.testSteps.LogInfo('Verifying Date field error message appears');
    await expect(this.consultationDatesIsRequired).toBeVisible();
    await this.testSteps.LogInfo('Verifying Body field error message appears');
    await expect(this.bodyIsRequired).toBeVisible();
  }

  // fill in consultation form elements - title summary topics etc
  async fillConsultationForm(data: ConsultationSaveData)
  {
    await this.createConsultationPageURLCheck();
    await this.enterConsultationTitle(data.consultationTitle);
    await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);
    await this.enterConsultationSummary(data.consultationSummary);
    await this.enterConsultationStartDate(data.consultationStartDate);
    await this.enterConsultationStartTime(data.consultationStartTime);
    await this.enterConsultationEndDate(data.consultationEndDate);
    await this.enterConsultationEndTime(data.consultationEndTime);
    await this.ckeditor.enterCKEditorBody(data.consultationBody);
    await this.enterConsultationRespondOnline(data.consultationRespondOnline);
    await this.enterConsultationEmailAddress(data.consultationEmailAddress);
    await this.enterConsultationPostalAddress(data.consultationPostalAddress);

    if (data.existingRemoteDocumentName)
    {
      await this.uploadMediaHelper.selectExistingRemoteDocumentFromLibrary(data.existingRemoteDocumentName);
    }
    else
    {
      await this.uploadMediaHelper.uploadAttachmentWorkflow({
        original: true,
        edited: false
      });
    }
  }
}