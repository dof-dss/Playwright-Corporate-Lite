import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { expect } from '@playwright/test';
import { UserPage } from '../../base-pages/UserPage';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';
import { UploadMediaHelper } from '@helpers/general/UploadMediaHelper';


export interface FeatureEditData
{
  featureTitle: string;
  revisionLogMessage: string;
  linkURL: string;
  teaser: string;
}

export class FeatureEditPage
{
  // logging
  private readonly testSteps: TestSteps;

  // pages
  private readonly userPage: UserPage;
  private readonly createPages: CreatePages;

  // locators - using ARIA roles first, then unique IDs, then XPaths
  private readonly featureTitleField: Locator;
  private readonly featureLinkURLField: Locator;
  private readonly featureTeaserField: Locator;
  private readonly featurePhotoAddMediaButton: Locator;

  // constructor
  constructor(
    private readonly page: Page,
    // isolated instances of test data
    private readonly testSetUpData: typeof TestSetUpData,
    private readonly testData: typeof TestData
  )
  {
    // logging isolated instance
    this.testSteps = new TestSteps();

    // imported pages
    this.userPage = new UserPage(page, testSetUpData);
    this.createPages = new CreatePages(page, testSetUpData, this.testData);
    this.uploadMediaHelper = new UploadMediaHelper(page, this.testSetUpData, this.testData);

    // locators - prioritizing ARIA roles, then unique IDs, then XPaths
    this.featureTitleField = page.locator('#edit-title-0-value');
    this.featureLinkURLField = page.locator('#edit-field-link-url-0-uri');
    this.featureTeaserField = page.locator('#edit-field-teaser-0-value');
    this.featurePhotoAddMediaButton = page.locator('button:has-text("Add media")');
  }
  private readonly uploadMediaHelper: UploadMediaHelper;

  // check url on edit feature page
  async editFeaturePageURLCheck()
  {
    await this.testSteps.LogInfo(`Verifying URL pattern matches /node/.+/edit`);
    await expect(this.page).toHaveURL(new RegExp('/node/.+/edit'));
  }

  // check url on return to edit feature page after doing a preview 
  async returnFromPreviewFeaturePageURLCheck()
  {
    await this.testSteps.LogInfo(`Verifying URL pattern matches /node/.+/edit\\?uuid`);
    await expect(this.page).toHaveURL(new RegExp('/node/.+/edit\\?uuid'));
  }

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
    await this.featureLinkURLField.fill(linkURL);
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

  // edit feature form fields
  async editFeatureForm(data: FeatureEditData)
  {
    await this.editFeaturePageURLCheck();
    await this.enterFeatureTitle(data.featureTitle);
    await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);
    await this.page.waitForTimeout(1000);
    await expect(this.page.locator('//input[contains(@id,"edit-field-photo-selection-0-remove-button")]')).toBeEnabled();
    await this.page.locator('//input[contains(@id,"edit-field-photo-selection-0-remove-button")]').click();
    await this.page.waitForTimeout(1000);
    await this.uploadMediaHelper.uploadImageWorkflow({
      original: false,
      edited: true,
    });
    await this.enterFeatureLinkURL(data.linkURL);
    await this.enterFeatureTeaser(data.teaser);
  }

  // edit feature form and save
  async editAndSaveFeatureForm(data: FeatureEditData)
  {
    await this.editFeatureForm(data);
    await this.createPages.clickSaveButton();
  }
}
