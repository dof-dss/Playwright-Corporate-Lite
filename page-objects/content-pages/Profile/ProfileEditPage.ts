import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { CKEditor } from '@poms/base-pages/CKEditor';
import { expect } from '@playwright/test';
import { UserPage } from '@poms/base-pages/UserPage';
import { CreatePages } from '@poms/base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { ProfileNodePage } from './ProfileNodePage';
import { UploadMediaHelper } from '@helpers/general/UploadMediaHelper';

export interface ProfileEditSaveData
{
  profileTitle: string;
  revisionLogMessage: string;
  department: string;
  summary: string;
  body: string;
}

export class ProfileEditPage
{
  private readonly testSteps: TestSteps;
  readonly ckeditor: CKEditor;
  readonly userPage: UserPage;
  readonly createPages: CreatePages;
  readonly previewPage: PreviewPage;
  readonly profileNodePage: ProfileNodePage;
  readonly uploadMediaHelper: UploadMediaHelper;

  private readonly profileTitleField: Locator;
  private readonly profileDepartmentField: Locator;
  private readonly profileSummaryField: Locator;

  constructor(
    private readonly page: Page,
    private readonly testSetUpData: typeof TestSetUpData,
    private readonly testData: typeof TestData
  )
  {
    this.testSteps = new TestSteps();
    this.userPage = new UserPage(page, this.testSetUpData);
    this.createPages = new CreatePages(page, this.testSetUpData, this.testData);
    this.ckeditor = new CKEditor(page, this.testSetUpData, testData);
    this.previewPage = new PreviewPage(page);
    this.profileNodePage = new ProfileNodePage(page, this.testSetUpData, this.testData);
    this.uploadMediaHelper = new UploadMediaHelper(page, this.testSetUpData, this.testData);

    this.profileTitleField = page.locator('#edit-title-0-value');
    this.profileDepartmentField = page.locator('#edit-field-department-0-value');
    this.profileSummaryField = page.locator('#edit-field-summary-0-value');
  }

  async editProfilePageURLCheck()
  {
    await this.testSteps.LogInfo('Verifying URL contains "/edit/"');
    await expect(this.page).toHaveURL(/\/edit/);
  }

  async returnFromPreviewProfilePageURLCheck()
  {
    await this.testSteps.LogInfo('Verifying URL contains "/node/.+/edit?uuid"');
    await expect(this.page).toHaveURL(new RegExp('/node/.+/edit\\?uuid'));
  }

  async editProfileTitle(profileTitle: string)
  {
    await this.testSteps.LogInfo(`Entering "${profileTitle}" into the Title field`);
    await this.profileTitleField.fill(profileTitle);
  }

  async editProfileDepartment(department: string)
  {
    await this.testSteps.LogInfo(`Entering "${department}" into the Department field`);
    await this.profileDepartmentField.fill(department);
  }

  async editProfileSummary(summary: string)
  {
    await this.testSteps.LogInfo(`Entering "${summary}" into the Summary field`);
    await this.profileSummaryField.fill(summary);
  }

  async editProfileForm(data: ProfileEditSaveData)
  {
    await this.editProfilePageURLCheck();
    await this.editProfileTitle(data.profileTitle);
    await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);
    await this.editProfileDepartment(data.department);
    await this.ckeditor.enterCKEditorBody(data.body);
    await expect(this.page.locator('//input[contains(@id,"edit-field-photo-selection-0-remove-button")]')).toBeEnabled();
    await this.page.locator('//input[contains(@id,"edit-field-photo-selection-0-remove-button")]').click();
    await this.uploadMediaHelper.uploadImageWorkflow({
      original: false,
      edited: true
    });
    await this.editProfileSummary(data.summary);

  }
}