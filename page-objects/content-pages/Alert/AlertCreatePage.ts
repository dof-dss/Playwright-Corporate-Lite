import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { CKEditor } from '../../base-pages/CKEditor';
import { expect } from '@playwright/test';
import { UserPage } from '../../base-pages/UserPage';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { AlertNodePage } from './AlertNodePage';
import { UploadMedia } from '../../base-pages/UploadMedia';

export interface AlertSaveData
{
  alertTitle: string;
  revisionLogMessage: string;
  alertBody: string;
  alertTeaser: string;
  publishedDate: string;
  photoFileName: string;
}

export class AlertCreatePage
{
  // logging
  private readonly testSteps: TestSteps;

  // pages
  private readonly ckeditor: CKEditor;
  private readonly userPage: UserPage;
  private readonly createPages: CreatePages;
  private readonly previewPage: PreviewPage;
  private readonly alertNodePage: AlertNodePage;
  private readonly uploadMedia: UploadMedia;

  // locators
  private readonly alertTitleField: Locator;
  private readonly alertBodyField: Locator;
  private readonly alertTeaserField: Locator;
  private readonly publishedDateField: Locator;
  private readonly addMediaButton: Locator;

  // error messages
  private readonly titleFieldIsRequired: Locator;
  private readonly publishedDateFieldIsRequired: Locator;
  private readonly photoFieldIsRequired: Locator;

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
    this.alertNodePage = new AlertNodePage(page, this.testSetUpData, this.testData);
    this.uploadMedia = new UploadMedia(page, this.testSetUpData, this.testData);

    // locators
    this.alertTitleField = page.locator('#edit-title-0-value');
    this.publishedDateField = page.locator('#edit-field-published-date-0-value-date');
    this.alertBodyField = page.locator('.ck-editor__editable[role="textbox"]');
    this.alertTeaserField = page.locator('#edit-field-teaser-0-value');
    this.addMediaButton = page.getByRole('button', { name: 'Add media' });

    // Error messages
    this.titleFieldIsRequired = page.getByText("Title field is required.");
    this.publishedDateFieldIsRequired = page.getByText("Published date field is required.");
    this.photoFieldIsRequired = page.getByText("Photo field is required.");
  }

  // ------------------------ asserts ------------------------

  // check url on create alert page
  async createAlertPageURLCheck()
  {
    await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/node/add/alert"`);
    await expect(this.page).toHaveURL(`${this.testSetUpData.urlForTest.url}/node/add/alert`);
  }

  // check url on return to create alert page after doing a preview 
  async returnFromPreviewAlertPageURLCheck()
  {
    await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/node/add/alert\\?uuid"`);
    await expect(this.page).toHaveURL(new RegExp(`${this.testSetUpData.urlForTest.url}/node/add/alert\\?uuid`));
  }


  // ------------------------ filling alert form ------------------------

  // enter alert title 
  async enterAlertTitle(alertTitle: string)
  {
    await this.testSteps.LogInfo(`Entering "${alertTitle}" into the Title field`);
    await this.alertTitleField.fill(alertTitle);
  }

  // enter published date
  async enterPublishedDate(publishedDate: string)
  {
    await this.testSteps.LogInfo(`Entering "${publishedDate}" into the Published date field`);
    await this.publishedDateField.fill(publishedDate);
  }

  // enter alert body using CKEditor
  async enterAlertBody(alertBody: string)
  {
    await this.testSteps.LogInfo(`Entering alert body content into the Body field`);
    await this.alertBodyField.click();
    await this.alertBodyField.fill(alertBody);
  }

  // enter alert teaser
  async enterAlertTeaser(alertTeaser: string)
  {
    await this.testSteps.LogInfo(`Entering "${alertTeaser}" into the Teaser field`);
    await this.alertTeaserField.fill(alertTeaser);
  }

  // click add media button
  async clickAddMediaButton()
  {
    await this.testSteps.LogInfo('Clicking the "Add media" button to add a photo');
    await this.addMediaButton.click();
  }

  // add photo to alert
  async addAlertPhoto(photoFileName: string)
  {
    await this.clickAddMediaButton();
    await this.page.waitForTimeout(1000);
    await this.uploadMedia.uploadImageProcess(photoFileName);

    await this.uploadMedia.enterImageValues(TestData.Media.imageAltText, TestData.Media.imageCaption, TestData.Media.imageName);

    await this.uploadMedia.clickMediaSave();
    await this.uploadMedia.clickInsertSelectedButton();

    await this.verifyPhotoUploaded();
  }

  // verify photo has been uploaded by checking for remove button
  async verifyPhotoUploaded()
  {
    await this.testSteps.LogInfo('Verifying photo has been uploaded by checking for remove button');
    const removePhotoButton = this.page.locator('//input[contains(@id,"edit-field-photo-selection-0-remove-button")]');
    await expect(removePhotoButton).toBeVisible();
  }


  // ------------------------ actions related to create alert  ------------------------

  // Mandatory Field Check alert
  async mandatoryFieldCheck()
  {
    await this.testSteps.LogInfo('Performing mandatory field check');
    await this.testSteps.LogInfo('Clicking save button');
    await this.createPages.clickSaveButton();
    await this.testSteps.LogInfo('Verifying Title field error message appears');
    await expect(this.titleFieldIsRequired).toBeVisible();
    await this.testSteps.LogInfo('Verifying Published date field error message appears');
    await expect(this.publishedDateFieldIsRequired).toBeVisible();
    await this.testSteps.LogInfo('Verifying Photo field error message appears');
    await expect(this.photoFieldIsRequired).toBeVisible();
  }

  // fill in alert form elements - title, published date, body, teaser, photo etc
  async fillAlertForm(data: AlertSaveData)
  {
    await this.createAlertPageURLCheck();
    await this.enterAlertTitle(data.alertTitle);
    await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);
    await this.enterPublishedDate(data.publishedDate);
    await this.enterAlertBody(data.alertBody);
    await this.addAlertPhoto(data.photoFileName);
    await this.enterAlertTeaser(data.alertTeaser);
  }
}
