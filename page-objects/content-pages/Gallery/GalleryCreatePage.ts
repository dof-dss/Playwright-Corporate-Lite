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

export interface GallerySaveData
{
  galleryTitle: string;
  revisionLogMessage: string;
  gallerySummary: string;
  galleryBodyField: string;
  // when set, selects this already uploaded Media Library image instead of uploading new gallery images
  existingImageName?: string;
  unavailableImageNames?: string[];
}

export class GalleryCreatePage
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

  // error messages
  private readonly titleFieldIsRequired: Locator;
  private readonly summaryFieldIsRequired: Locator;
  private readonly bodyFieldIsRequired: Locator;


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

    // Error messages
    this.titleFieldIsRequired = page.getByText("Title field is required.");
    this.summaryFieldIsRequired = page.getByText("Summary field is required.");
    this.bodyFieldIsRequired = page.getByText("Body field is required.");
  }

  // ------------------------ asserts ------------------------

  // check url on create gallery page
  async createGalleryPageURLCheck()
  {
    await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/node/add/gallery"`);
    await expect(this.page).toHaveURL(`${this.testSetUpData.urlForTest.url}/node/add/gallery`);
  }

  // check url on return to create gallery page after doing a preview 
  async returnFromPreviewGalleryPageURLCheck()
  {
    await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/node/add/gallery\\?uuid"`);
    await expect(this.page).toHaveURL(new RegExp(`${this.testSetUpData.urlForTest.url}/node/add/gallery\\?uuid`));
  }


  // ------------------------ filling gallery form ------------------------

  // enter gallery title 
  async enterGalleryTitle(galleryTitle: string)
  {
    await this.testSteps.LogInfo(`Entering "${galleryTitle}" into the Title field`);
    await this.galleryTitleField.fill(galleryTitle);
  }

  // enter gallery summary 
  async enterGallerySummary(gallerySummary: string)
  {
    await this.testSteps.LogInfo(`Entering "${gallerySummary}" into the Summary field`);
    await this.gallerySummaryField.fill(gallerySummary);
  }

  // ------------------------ actions related to create gallery  ------------------------

  // Mandatory Field Check gallery
  async mandatoryFieldCheck()
  {
    await this.createPages.clickSaveButton();
    await expect(this.titleFieldIsRequired).toBeVisible();
    await expect(this.summaryFieldIsRequired).toBeVisible();
    await expect(this.bodyFieldIsRequired).toBeVisible();

  }

  // fill in gallery form elements - title summary topics etc
  async fillGalleryForm(data: GallerySaveData)
  {
    await this.createGalleryPageURLCheck();
    await this.enterGalleryTitle(data.galleryTitle);
    await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);
    await this.enterGallerySummary(data.gallerySummary);
    await this.ckeditor.enterCKEditorBody(data.galleryBodyField);

    if (data.existingImageName)
    {
      await this.uploadMediaHelper.selectExistingImageFromLibrary(data.existingImageName, data.unavailableImageNames);
      // wait 2 seconds and refresh page
      await this.page.waitForTimeout(2000);
    }
    else
    {
      await this.uploadMediaHelper.uploadGalleryImageWorkflow({
        gallery: true,
        galleryEdit: false,
      },
        // 
        this.GalleryImageDetails
      );
    }
  }
}