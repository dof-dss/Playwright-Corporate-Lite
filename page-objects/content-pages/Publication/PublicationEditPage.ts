import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { CKEditor } from '../../base-pages/CKEditor';
import { expect } from '@playwright/test';
import { UserPage } from '../../base-pages/UserPage';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { PublicationNodePage } from './PublicationNodePage';
import { UploadMediaHelper } from '@helpers/general/UploadMediaHelper';

export interface PublicationEditSaveData
{
  publicationTitle: string;
  publicationPublishedDate: string;
  publicationLastUpdatedDate: string;
  publicationLastUpdatedTime: string;
  revisionLogMessage: string;
  publicationSummary: string;
  pubType: string;
  publicationBodyField: string;
}

export interface EditPubExternalSaveData
{
  publicationTitle: string;
  revisionLogMessage: string;
  publicationLastUpdatedDate: string;
  publicationLastUpdatedTime: string;
  publicationSummary: string;
  pubType: string;
  publicationBodyField: string;
  publicationExteralLink: string;
  publicationLinkText: string;
}

export class PublicationEditPage
{
  // logging
  private readonly testSteps: TestSteps;

  // pages
  private readonly ckeditor: CKEditor;
  private readonly userPage: UserPage;
  private readonly createPages: CreatePages;
  private readonly previewPage: PreviewPage;
  private readonly publicationNodePage: PublicationNodePage;
  private readonly uploadMediaHelper: UploadMediaHelper;

  // locators
  private readonly publicationTitleField: Locator;
  private readonly attachmentTypePublicRadioButton: Locator;
  private readonly attachmentTypeSecureRadioButton: Locator;
  private readonly publicationDatePubField: Locator;
  private readonly pubLastUpdatedDate: Locator;
  private readonly pubLastUpdatedTime: Locator;
  private readonly pubTypeField: Locator;
  private readonly publicationSummaryField: Locator;
  private readonly publicationExternalLinkField: Locator;
  private readonly publicationLinkTextField: Locator;

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
    this.publicationNodePage = new PublicationNodePage(page, this.testSetUpData, this.testData);
    this.uploadMediaHelper = new UploadMediaHelper(page, this.testSetUpData, testData);

    // locators
    this.publicationTitleField = page.locator('#edit-title-0-value');
    this.attachmentTypePublicRadioButton = page.locator('#edit-publication-attachment-type-0');
    this.attachmentTypeSecureRadioButton = page.locator('#edit-publication-attachment-type-1');
    this.publicationDatePubField = page.locator('#edit-field-published-date-0-value-date');
    this.pubLastUpdatedDate = page.locator('#edit-field-last-updated-0-value-date');
    this.pubLastUpdatedTime = page.locator('#edit-field-last-updated-0-value-time');
    this.pubTypeField = page.locator('#edit_field_publication_type_chosen');
    this.publicationSummaryField = page.locator('#edit-field-summary-0-value');
    this.publicationExternalLinkField = page.locator('#edit-field-external-publication-0-uri');
    this.publicationLinkTextField = page.locator('#edit-field-external-publication-0-title');
  }

  // ------------------------ asserts ------------------------

  // check url on edit publication page
  async editPublicationPageURLCheck()
  {
    await this.testSteps.LogInfo('Verifying URL contains "edit"');
    await expect(this.page).toHaveURL(/\/edit/);
  }

  // check url on return to create publication page after doing a preview 
  async returnFromPreviewPublicationPageURLCheck()
  {
    await this.testSteps.LogInfo('Verifying URL contains "/node/.+/edit\\?uuid"');
    await expect(this.page).toHaveURL(new RegExp('/node/.+/edit\\?uuid'));
  }

  // ------------------------ filling publication form ------------------------

  // edit publication title 
  async editPublicationTitle(publicationTitle: string)
  {
    await this.testSteps.LogInfo(`Entering "${publicationTitle}" into the Title field`);
    await this.publicationTitleField.fill(publicationTitle);
  }

  // verify publication attachment type is hidden 
  async attachmentTypeHidden()
  {
    await this.testSteps.LogInfo(`Verifying radio buttons for Attachment Type are hidden`);
    await expect(this.attachmentTypePublicRadioButton).toBeHidden();
    await expect(this.attachmentTypeSecureRadioButton).toBeHidden();
  }

  // select publication attachement type of Public 
  async selectPublicAttachmentType()
  {
    await this.testSteps.LogInfo(`Selecting "Public" in the Attachment Type radio button`);
    await this.attachmentTypePublicRadioButton.click();
  }

  // select publication attachement type of Secure
  async selectSecureAttachmentType()
  {
    await this.testSteps.LogInfo(`Selecting "Secure" in the Attachment Type radio button`);
    await this.attachmentTypeSecureRadioButton.click();
  }

  // enter publication published date
  async editPubPublishedDate(publicationPubDate: string)
  {
    await this.testSteps.LogInfo(`Entering "${publicationPubDate}" into the Published Date field`);
    await this.publicationDatePubField.fill(publicationPubDate);
  }

  // enter consultation consultation Start date
  async editPubLastUpdatedDate(publicationStartDate: string)
  {
    await this.testSteps.LogInfo(`Entering "${publicationStartDate}" into the Last Updated Date field`);
    await this.pubLastUpdatedDate.fill(publicationStartDate);
  }

  // enter consultation consultation Start time
  async editPubLastUpdatedTime(publicationStartTime: string)
  {
    await this.testSteps.LogInfo(`Entering "${publicationStartTime}" into the Last Updated Time field`);
    await this.pubLastUpdatedTime.fill(publicationStartTime);
  }

  // edit publication summary 
  async editPublicationSummary(publicationSummary: string)
  {
    await this.testSteps.LogInfo(`Entering "${publicationSummary}" into the Summary field`);
    await this.publicationSummaryField.fill(publicationSummary);
  }

  // select publication type 
  async editPubType(pubType: string)
  {
    await this.testSteps.LogInfo('Clciking Publication Field');
    await this.pubTypeField.click();
    await this.testSteps.LogInfo(`Selecting "${pubType}" into the Publication Type`);
    await this.page.locator(`//ul/li[contains(text(), "${pubType}")]`).click();
  }

  // enter publication summary 
  async editPublicationExternalLink(publicationExteralLink: string)
  {
    await this.testSteps.LogInfo(`Entering "${publicationExteralLink}" into the External Link field`);
    await this.publicationExternalLinkField.fill(publicationExteralLink);
  }

  // enter publication summary 
  async editPublicationLinkText(publicationLinkText: string)
  {
    await this.testSteps.LogInfo(`Entering "${publicationLinkText}" into the External Link Text field`);
    await this.publicationLinkTextField.fill(publicationLinkText);
  }

  // ------------------------ actions related to edit publication  ------------------------

  // fill in publication form elements - title summary topics etc
  async editPublicationForm(data: PublicationEditSaveData)
  {
    await this.editPublicationPageURLCheck();
    await this.editPublicationTitle(data.publicationTitle);
    await this.editPubPublishedDate(data.publicationPublishedDate);
    await this.editPubLastUpdatedDate(data.publicationLastUpdatedDate);
    await this.editPubLastUpdatedTime(data.publicationLastUpdatedTime);
    await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);
    await this.editPubType(data.pubType);
    await this.editPublicationSummary(data.publicationSummary);
    await expect(this.page.locator('//input[contains(@id,"edit-field-publication-files-selection-0-remove-button")]')).toBeEnabled();
    await this.page.locator('//input[contains(@id,"edit-field-publication-files-selection-0-remove-button")]').click();
    await this.ckeditor.enterCKEditorBody(data.publicationBodyField);
    await this.uploadMediaHelper.uploadAttachmentWorkflow({
      original: false,
      edited: true
    });
  }

  // fill in publication form elements - title summary topics etc
  async editExternalLinkPublicationForm(data: EditPubExternalSaveData)
  {
    await this.editPublicationPageURLCheck();
    await this.editPublicationTitle(data.publicationTitle);
    await this.editPubLastUpdatedDate(data.publicationLastUpdatedDate);
    await this.editPubLastUpdatedTime(data.publicationLastUpdatedTime);
    await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);
    await this.editPubType(data.pubType);
    await this.editPublicationSummary(data.publicationSummary);
    await this.ckeditor.enterCKEditorBody(data.publicationBodyField);
    await this.editPublicationExternalLink(data.publicationExteralLink);
    await this.editPublicationLinkText(data.publicationLinkText);
  }
}