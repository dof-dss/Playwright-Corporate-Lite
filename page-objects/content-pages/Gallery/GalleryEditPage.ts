import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { CKEditor } from '../../base-pages/CKEditor';
import { expect } from '@playwright/test';
import { UserPage } from '../../base-pages/UserPage';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData, galleryImageDetails } from '../../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { GalleryNodePage } from './GalleryNodePage';
import { UploadMediaHelper } from '@helpers/general/UploadMediaHelper';

export interface GalleryEditSaveData
{
  galleryTitle: string;
  revisionLogMessage: string;
  gallerySummary: string;
  galleryBodyField: string;
}

export class GalleryEditPage
{
  // logging
  private readonly testSteps: TestSteps;

  // pages
  readonly ckeditor: CKEditor;
  readonly userPage: UserPage;
  readonly createPages: CreatePages;
  readonly previewPage: PreviewPage;
  readonly galleryNodePage: GalleryNodePage;
  readonly uploadMediaHelper: UploadMediaHelper;

  // locators
  private readonly galleryTitleField: Locator;
  private readonly gallerySummaryField: Locator;

  // constructor
  constructor(
    private readonly page: Page,
    // isolated instances of test data 
    private testSetUpData: typeof TestSetUpData,
    private testData: typeof TestData,
    private GalleryImageDetails: typeof galleryImageDetails
  )
  {
    // logging isolated instance
    this.testSteps = new TestSteps();

    // imported pages
    this.userPage = new UserPage(page, this.testSetUpData);
    this.createPages = new CreatePages(page, this.testSetUpData, this.testData);
    this.ckeditor = new CKEditor(page, this.testSetUpData, testData);
    this.previewPage = new PreviewPage(page);
    this.galleryNodePage = new GalleryNodePage(page, this.testSetUpData, this.testData, galleryImageDetails);
    this.uploadMediaHelper = new UploadMediaHelper(page, this.testSetUpData, this.testData);

    // locators
    this.galleryTitleField = page.locator('#edit-title-0-value');
    this.gallerySummaryField = page.locator('#edit-field-summary-0-value');
  }

  // ------------------------ asserts ------------------------

  // check url on edit gallery page
  async editGalleryPageURLCheck()
  {
    await this.testSteps.LogInfo('Verifying URL contains "/edit/"');
    await expect(this.page).toHaveURL(/\/edit/);
  }

  // check url on return to create gallery page after doing a preview 
  async returnFromPreviewGalleryPageURLCheck()
  {
    await this.testSteps.LogInfo('Verifying URL contains "/node/.+/edit?uuid"');
    await expect(this.page).toHaveURL(new RegExp('/node/.+/edit\\?uuid'));
  }

  // ------------------------ filling gallery form ------------------------

  // edit gallery title 
  async editGalleryTitle(galleryTitle: string)
  {
    await this.testSteps.LogInfo(`Entering "${galleryTitle}" into the Title field`);
    await this.galleryTitleField.fill(galleryTitle);
  }

  // edit gallery summary 
  async editGallerySummary(gallerySummary: string)
  {
    await this.testSteps.LogInfo(`Entering "${gallerySummary}" into the Summary field`);
    await this.gallerySummaryField.fill(gallerySummary);
  }

  // ------------------------ actions related to edit gallery  ------------------------

  // fill in gallery form elements - title summary topics etc
  async editGalleryForm(data: GalleryEditSaveData)
  {
    await this.editGalleryPageURLCheck();
    await this.editGalleryTitle(data.galleryTitle);
    await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);
    await this.editGallerySummary(data.gallerySummary);

    // Removing of image 5
    await this.page.waitForTimeout(1000);
    await expect(this.page.locator('//input[contains(@id,"edit-field-gallery-images-selection-4-remove-button")]')).toBeEnabled();
    await this.page.locator('//input[contains(@id,"edit-field-gallery-images-selection-4-remove-button")]').click();
    // Removing of image 4
    await this.page.waitForTimeout(1000);
    await expect(this.page.locator('//input[contains(@id,"edit-field-gallery-images-selection-3-remove-button")]')).toBeEnabled();
    await this.page.locator('//input[contains(@id,"edit-field-gallery-images-selection-3-remove-button")]').click();
    // Removing of image 3
    await this.page.waitForTimeout(1000);
    await expect(this.page.locator('//input[contains(@id,"edit-field-gallery-images-selection-2-remove-button")]')).toBeEnabled();
    await this.page.locator('//input[contains(@id,"edit-field-gallery-images-selection-2-remove-button")]').click();
    // Removing of image 2
    await this.page.waitForTimeout(1000);
    await expect(this.page.locator('//input[contains(@id,"edit-field-gallery-images-selection-1-remove-button")]')).toBeEnabled();
    await this.page.locator('//input[contains(@id,"edit-field-gallery-images-selection-1-remove-button")]').click();
    // Removing of image 1
    await this.page.waitForTimeout(1000);
    await expect(this.page.locator('//input[contains(@id,"edit-field-gallery-images-selection-0-remove-button")]')).toBeEnabled();
    await this.page.locator('//input[contains(@id,"edit-field-gallery-images-selection-0-remove-button")]').click();

    await this.ckeditor.enterCKEditorBody(data.galleryBodyField);
    await this.uploadMediaHelper.uploadGalleryImageWorkflow({
      gallery: false,
      galleryEdit: true,
    },
      // 
      this.GalleryImageDetails
    );
  }
}