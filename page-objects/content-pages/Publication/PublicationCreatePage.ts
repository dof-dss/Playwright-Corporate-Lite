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

export interface PublicationSaveData
{
  publicationTitle: string;
  revisionLogMessage: string;
  publicationSummary: string;
  pubType: string;
  publicationBodyField: string;
  publicationExteralLink?: string;
  publicationLinkText?: string;
  existingDocumentName?: string;
}


export class PublicationCreatePage
{

  // logging
  private readonly testSteps: TestSteps;

  // pages
  readonly ckeditor: CKEditor;
  readonly userPage: UserPage;
  readonly createPages: CreatePages;
  readonly previewPage: PreviewPage;
  readonly publicationNodePage: PublicationNodePage;
  readonly uploadMediaHelper: UploadMediaHelper;

  // locators
  private readonly publicationTitleField: Locator;
  private readonly attachmentTypePublicRadioButton: Locator;
  private readonly attachmentTypeSecureRadioButton: Locator;
  private readonly pubTypeField: Locator;
  private readonly publicationSummaryField: Locator;
  private readonly publicationExternalLinkField: Locator;
  private readonly publicationLinkTextField: Locator;


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
    this.publicationNodePage = new PublicationNodePage(page, this.testSetUpData, this.testData);
    this.uploadMediaHelper = new UploadMediaHelper(page, this.testSetUpData, testData);

    // locators
    this.publicationTitleField = page.locator('#edit-title-0-value');
    this.attachmentTypePublicRadioButton = page.locator('#edit-publication-attachment-type-0');
    this.attachmentTypeSecureRadioButton = page.locator('#edit-publication-attachment-type-1');
    this.pubTypeField = page.locator('#edit_field_publication_type_chosen');
    this.publicationSummaryField = page.locator('#edit-field-summary-0-value');
    this.publicationExternalLinkField = page.locator('#edit-field-external-publication-0-uri');
    this.publicationLinkTextField = page.locator('#edit-field-external-publication-0-title');

    // Error messages
    this.titleFieldIsRequired = page.getByText('Title field is required.');
    this.summaryFieldIsRequired = page.getByText('Summary field is required.');
    this.bodyFieldIsRequired = page.getByText('Body field is required.');
  }

  // ------------------------ asserts ------------------------

  // check url on create publication page
  async createPublicationPageURLCheck()
  {
    await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/node/add/publication"`);
    await expect(this.page).toHaveURL(`${this.testSetUpData.urlForTest.url}/node/add/publication`);
  }

  // check url on return to create publication page after doing a preview 
  async returnFromPreviewPublicationPageURLCheck()
  {
    await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/node/add/publication\\?uuid"`);
    await expect(this.page).toHaveURL(new RegExp(`${this.testSetUpData.urlForTest.url}/node/add/publication\\?uuid`));
  }


  // ------------------------ filling publication form ------------------------

  // enter publication title 
  async enterPublicationTitle(publicationTitle: string)
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

  // enter publication summary 
  async enterPublicationSummary(publicationSummary: string)
  {
    await this.testSteps.LogInfo(`Entering "${publicationSummary}" into the Summary field`);
    await this.publicationSummaryField.fill(publicationSummary);
  }

  // select publication type 
  async selectPubType(pubType: string)
  {
    await this.testSteps.LogInfo('Clciking Publication Field');
    await this.pubTypeField.click();
    await this.testSteps.LogInfo(`Selecting "${pubType}" into the Publication Type`);
    await this.page.locator(`//ul/li[contains(text(), "${pubType}")]`).click();
  }

  // enter publication summary 
  async enterPublicationExternalLink(publicationExteralLink: string)
  {
    await this.testSteps.LogInfo(`Entering "${publicationExteralLink}" into the External Link field`);
    await this.publicationExternalLinkField.fill(publicationExteralLink);
  }

  // enter publication summary 
  async enterPublicationLinkText(publicationLinkText: string)
  {
    await this.testSteps.LogInfo(`Entering "${publicationLinkText}" into the External Link Text field`);
    await this.publicationLinkTextField.fill(publicationLinkText);
  }

  // ------------------------ actions related to create publication  ------------------------

  // Mandatory Field Check publication
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

  // fill in publication form elements - title summary topics etc
  async fillPublicationForm(data: PublicationSaveData, publicationStrategy: 'standard' | 'externalLink' = 'standard')
  {
    await this.createPublicationPageURLCheck();
    await this.enterPublicationTitle(data.publicationTitle);
    await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);
    await this.selectPubType(data.pubType);
    await this.enterPublicationSummary(data.publicationSummary);
    await this.ckeditor.enterCKEditorBody(data.publicationBodyField);

    if (data.existingDocumentName)
    {
      await this.uploadMediaHelper.selectExistingAttachmentFromLibrary(data.existingDocumentName);
    }
    else
    {
      if (publicationStrategy === 'externalLink')
      {
        await this.enterPublicationExternalLink(data.publicationExteralLink!);
        await this.enterPublicationLinkText(data.publicationLinkText!);
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

  // fill in publication form elements with external link using external link strategy
  async fillExternalLinkPublicationForm(data: PublicationSaveData)
  {
    await this.fillPublicationForm(data, 'externalLink');
  }

}