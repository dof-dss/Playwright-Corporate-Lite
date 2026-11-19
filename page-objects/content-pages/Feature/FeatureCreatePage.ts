import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { expect } from '@playwright/test';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';
import { UploadMediaHelper } from '@helpers/general/UploadMediaHelper';

export interface FeatureSaveData
{
  featureTitle: string;
  revisionLogMessage: string;
  linkURL: string;
  teaser: string;
}

export class FeatureCreatePage
{
  // logging
  private readonly testSteps: TestSteps;

  // pages
  private readonly createPages: CreatePages;
  private readonly uploadMediaHelper: UploadMediaHelper;

  // locators - using ARIA roles first, then unique IDs, then XPaths
  private readonly featureTitleField: Locator;
  private readonly featureLinkURLField: Locator;
  private readonly featureTeaserField: Locator;
  private readonly featurePhotoAddMediaButton: Locator;

  // error messages
  private readonly titleFieldIsRequired: Locator;
  private readonly linkURLFieldIsRequired: Locator;

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
    this.createPages = new CreatePages(page, this.testSetUpData, this.testData);
    this.uploadMediaHelper = new UploadMediaHelper(page, this.testSetUpData, this.testData);

    // locators - prioritizing ARIA roles, then unique IDs, then XPaths
    this.featureTitleField = page.locator('#edit-title-0-value');
    this.featureLinkURLField = page.locator('#edit-field-link-url-0-uri');
    this.featureTeaserField = page.locator('#edit-field-teaser-0-value');
    this.featurePhotoAddMediaButton = page.locator('button:has-text("Add media")');

    // Error messages
    this.titleFieldIsRequired = page.getByText("Title field is required.");
    this.linkURLFieldIsRequired = page.getByText("Link URL field is required.");
  }

  // ------------------------ asserts ------------------------

  // check url on create feature page
  async createFeaturePageURLCheck()
  {
    await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/node/add/feature"`);
    await expect(this.page).toHaveURL(`${this.testSetUpData.urlForTest.url}/node/add/feature`);
  }

  // check url on return to create feature page after doing a preview 
  async returnFromPreviewFeaturePageURLCheck()
  {
    await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/node/add/feature\\?uuid"`);
    await expect(this.page).toHaveURL(new RegExp(`${this.testSetUpData.urlForTest.url}/node/add/feature\\?uuid`));
  }

  // ------------------------ filling feature form ------------------------

  // enter feature title 
  async enterFeatureTitle(featureTitle: string)
  {
    await this.testSteps.LogInfo(`Entering "${featureTitle}" into the Title field`);
    await this.featureTitleField.fill(featureTitle);
  }

  // enter feature link URL
  async enterFeatureLinkURL(linkURL: string)
  {
    await this.testSteps.LogInfo(`Entering "${linkURL}" into the Link URL field and selecting matching item`);
    await this.featureLinkURLField.pressSequentially(linkURL);
    const matchingSuggestion = this.page.getByText(linkURL, { exact: true });
    await expect(matchingSuggestion).toBeVisible();
    await matchingSuggestion.click();
  }

  // enter feature teaser
  async enterFeatureTeaser(teaser: string)
  {
    await this.testSteps.LogInfo(`Entering "${teaser}" into the Teaser field`);
    await this.featureTeaserField.fill(teaser);
  }

  // click add media button for photo
  async clickAddPhotoButton()
  {
    await this.testSteps.LogInfo('Clicking Add media button for Feature Photo');
    await this.featurePhotoAddMediaButton.click();
  }

  // Mandatory Field Check feature
  async mandatoryFieldCheck()
  {
    await this.testSteps.LogInfo('Performing mandatory field check');
    await this.testSteps.LogInfo('Clicking save button');
    await this.createPages.clickSaveButton();
    await this.testSteps.LogInfo('Verifying Title field error message appears');
    await expect(this.titleFieldIsRequired).toBeVisible();
    await this.testSteps.LogInfo('Verifying Link URL field error message appears');
    await expect(this.linkURLFieldIsRequired).toBeVisible();
  }

  // fill in feature form fields
  async fillFeatureForm(data: FeatureSaveData)
  {
    await this.createFeaturePageURLCheck();
    await this.enterFeatureTitle(data.featureTitle);
    await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);
    await this.uploadMediaHelper.uploadImageWorkflow({
      original: true,
      edited: false,
    });
    await this.enterFeatureLinkURL(data.linkURL);
    await this.enterFeatureTeaser(data.teaser);
  }

  // fill in feature form and save
  async fillAndSaveFeatureForm(data: FeatureSaveData)
  {
    await this.fillFeatureForm(data);
    await this.createPages.clickSaveButton();
  }
}
