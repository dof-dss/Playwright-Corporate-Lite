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

export interface AlertEditSaveData
{
  alertTitle: string;
  revisionLogMessage: string;
  alertBody: string;
  alertTeaser: string;
  publishedDate: string;
  photoFileName: string;
}

export class AlertEditPage
{
  // logging
  private readonly testSteps: TestSteps;

  // pages
  readonly ckeditor: CKEditor;
  readonly userPage: UserPage;
  readonly createPages: CreatePages;
  readonly previewPage: PreviewPage;
  readonly alertNodePage: AlertNodePage;
  readonly uploadMedia: UploadMedia;

  // locators
  private readonly alertTitleField: Locator;
  private readonly alertBodyField: Locator;
  private readonly alertTeaserField: Locator;
  private readonly publishedDateField: Locator;
  private readonly removeImageButton: Locator;
  private readonly addMediaButton: Locator;

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
    this.removeImageButton = page.getByRole('button', { name: /Remove/ });
    this.addMediaButton = page.getByRole('button', { name: 'Add media' });
  }

  // ------------------------ asserts ------------------------

  // check url on edit alert page
  async editAlertPageURLCheck()
  {
    await this.testSteps.LogInfo('Verifying URL contains "edit"');
    await expect(this.page).toHaveURL(/\/edit/);
  }

  // check url on return to edit alert page after doing a preview 
  async returnFromPreviewAlertPageURLCheck()
  {
    await this.testSteps.LogInfo('Verifying URL contains "/node/.+/edit\\?uuid"');
    await expect(this.page).toHaveURL(new RegExp('/node/.+/edit\\?uuid'));
  }


  // ------------------------ filling alert form ------------------------

  // edit alert title 
  async editAlertTitle(alertTitle: string)
  {
    await this.testSteps.LogInfo(`Clearing and entering "${alertTitle}" into the Title field`);
    await this.alertTitleField.clear();
    await this.alertTitleField.fill(alertTitle);
  }

  // edit published date
  async editPublishedDate(publishedDate: string)
  {
    await this.testSteps.LogInfo(`Clearing and entering "${publishedDate}" into the Published date field`);
    await this.publishedDateField.clear();
    await this.publishedDateField.fill(publishedDate);
  }

  // edit alert body using CKEditor
  async editAlertBody(alertBody: string)
  {
    await this.testSteps.LogInfo(`Clearing and entering alert body content into the Body field`);
    await this.alertBodyField.click();
    await this.alertBodyField.clear();
    await this.alertBodyField.fill(alertBody);
  }

  // edit alert teaser
  async editAlertTeaser(alertTeaser: string)
  {
    await this.testSteps.LogInfo(`Clearing and entering "${alertTeaser}" into the Teaser field`);
    await this.alertTeaserField.clear();
    await this.alertTeaserField.fill(alertTeaser);
  }

  // click add media button
  async clickAddMediaButton()
  {
    await this.testSteps.LogInfo('Clicking the "Add media" button to add a new photo');
    await this.addMediaButton.click();
  }

  // add photo to alert
  async addAlertPhoto(photoFileName: string)
  {
    await this.clickAddMediaButton();
    await this.page.waitForTimeout(1000);
    await this.uploadMedia.uploadImageProcess(photoFileName);
    await this.uploadMedia.enterImageValues(TestData.Media.imageAltText, TestData.Media.imageCaptionEdited, TestData.Media.imageName);
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


  // ------------------------ actions related to edit alert  ------------------------

  // fill in alert form elements with new data - removes existing image first
  async editAlertForm(data: AlertEditSaveData)
  {
    await this.editAlertPageURLCheck();
    await this.editAlertTitle(data.alertTitle);
    await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);
    await this.editPublishedDate(data.publishedDate);
    await this.editAlertBody(data.alertBody);
    await expect(this.page.locator('//input[contains(@id,"edit-field-photo-selection-0-remove-button")]')).toBeVisible();
    await this.page.locator('//input[contains(@id,"edit-field-photo-selection-0-remove-button")]').click();
    await this.page.waitForTimeout(500);
    await this.addAlertPhoto(data.photoFileName);
    await this.editAlertTeaser(data.alertTeaser);
  }
}
