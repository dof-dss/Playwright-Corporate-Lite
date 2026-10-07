import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { CKEditor } from '../../base-pages/CKEditor';
import { expect } from '@playwright/test';
import { UserPage } from '../../base-pages/UserPage';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { UploadMediaHelper } from '@helpers/general/UploadMediaHelper';

export interface ConsultationEditSaveData
{
  consultationTitle: string;
  consPubDate: string;
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
}

export class ConsultationEditPage
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
  private readonly consultationDatePubField: Locator;
  private readonly consultationSummaryField: Locator;
  private readonly consultationStartDate: Locator;
  private readonly consultationStartTime: Locator;
  private readonly consultationEndDate: Locator;
  private readonly consultationEndTime: Locator;
  private readonly consultationRespondOnline: Locator;
  private readonly consultationEmailAddress: Locator;
  private readonly consultationPostalAddress: Locator;

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
    this.consultationDatePubField = page.locator('#edit-field-published-date-0-value-date');
    this.consultationSummaryField = page.locator('#edit-field-summary-0-value');
    this.consultationStartDate = page.locator('#edit-field-consultation-dates-0-value-date');
    this.consultationStartTime = page.locator('#edit-field-consultation-dates-0-value-time');
    this.consultationEndDate = page.locator('#edit-field-consultation-dates-0-end-value-date');
    this.consultationEndTime = page.locator('#edit-field-consultation-dates-0-end-value-time');
    this.consultationRespondOnline = page.locator('#edit-field-respond-online-0-uri');
    this.consultationEmailAddress = page.locator('#edit-field-email-address-0-value');
    this.consultationPostalAddress = page.locator('#edit-field-postal-0-value');
  }

  // ------------------------ asserts ------------------------

  // check url on edit consultation page
  async editConsultationPageURLCheck()
  {
    await this.testSteps.LogInfo('Verifying URL contains "edit"');
    await expect(this.page).toHaveURL(/\/edit/);
  }

  // check url on return to create consultation page after doing a preview 
  async returnFromPreviewConsultationPageURLCheck()
  {
    await this.testSteps.LogInfo('Verifying URL contains "/node/.+/edit\\?uuid"');
    await expect(this.page).toHaveURL(new RegExp('/node/.+/edit\\?uuid'));
  }

  // ------------------------ filling consultation form ------------------------

  // enter consultation title 
  async editConsultationTitle(consultationTitle: string)
  {
    await this.testSteps.LogInfo(`Entering "${consultationTitle}" into the Title field`);
    await this.consultationTitleField.fill(consultationTitle);
  }

  // enter consultation published date
  async editPubPublishedDate(consPubDate: string)
  {
    await this.testSteps.LogInfo(`Entering "${consPubDate}" into the Published Date field`);
    await this.consultationDatePubField.fill(consPubDate);
  }

  // enter consultation summary 
  async editConsultationSummary(consultationSummary: string)
  {
    await this.testSteps.LogInfo(`Entering "${consultationSummary}" into the Summary field`);
    await this.consultationSummaryField.fill(consultationSummary);
  }

  // enter consultation consultation Start date
  async editConsultationStartDate(consultationStartDate: string)
  {
    await this.testSteps.LogInfo(`Entering "${consultationStartDate}" into the start date field`);
    await this.consultationStartDate.fill(consultationStartDate);
  }

  // enter consultation consultation Start time
  async editConsultationStartTime(consultationStartTime: string)
  {
    await this.testSteps.LogInfo(`Entering "${consultationStartTime}" into the start time field`);
    await this.consultationStartTime.fill(consultationStartTime);
  }

  // enter consultation consultation End date
  async editConsultationEndDate(consultationEndDate: string)
  {
    await this.testSteps.LogInfo(`Entering "${consultationEndDate}" into the End date field`);
    await this.consultationEndDate.fill(consultationEndDate);
  }

  // enter consultation consultation End Time
  async editConsultationEndTime(consultationEndTime: string)
  {
    await this.testSteps.LogInfo(`Entering "${consultationEndTime}" into the end time field`);
    await this.consultationEndTime.fill(consultationEndTime);
  }

  // enter consultation consultation Respond Online
  async editConsultationRespondOnline(respondeOnline: string)
  {
    await this.testSteps.LogInfo(`Entering "${respondeOnline}" into the Respond Online field`);
    await this.consultationRespondOnline.fill(respondeOnline);
  }

  // enter consultation consultation Email Address
  async editConsultationEmailAddress(emailAddress: string)
  {
    await this.testSteps.LogInfo(`Entering "${emailAddress}" into the Email address field`);
    await this.consultationEmailAddress.fill(emailAddress);
  }

  // enter consultation consultation Postal Address
  async editConsultationPostalAddress(postalAddress: string)
  {
    await this.testSteps.LogInfo(`Entering "${postalAddress}" into the Post code field`);
    await this.consultationPostalAddress.fill(postalAddress);
  }

  // ------------------------ actions related to create consultation  ------------------------

  // fill in consultation form elements - title summary topics etc
  async editConsultationForm(data: ConsultationEditSaveData)
  {
    await this.editConsultationPageURLCheck();
    await this.editConsultationTitle(data.consultationTitle);
    await this.editPubPublishedDate(data.consPubDate);
    await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);
    await this.editConsultationSummary(data.consultationSummary);
    await this.editConsultationStartDate(data.consultationStartDate);
    await this.editConsultationStartTime(data.consultationStartTime);
    await this.editConsultationEndDate(data.consultationEndDate);
    await this.editConsultationEndTime(data.consultationEndTime);
    await this.page.waitForTimeout(1000);
    await expect(this.page.locator('//input[contains(@id,"edit-field-attachment-selection-0-remove-button")]')).toBeEnabled();
    await this.page.locator('//input[contains(@id,"edit-field-attachment-selection-0-remove-button")]').click();
    await this.page.waitForTimeout(1000);
    await this.ckeditor.enterCKEditorBody(data.consultationBody);
    await this.editConsultationRespondOnline(data.consultationRespondOnline);
    await this.editConsultationEmailAddress(data.consultationEmailAddress);
    await this.editConsultationPostalAddress(data.consultationPostalAddress);
    await this.uploadMediaHelper.uploadAttachmentWorkflow({
      original: false,
      edited: true
    });
  }
}