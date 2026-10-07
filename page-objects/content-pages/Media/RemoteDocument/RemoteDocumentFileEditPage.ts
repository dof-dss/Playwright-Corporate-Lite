import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { CKEditor } from '../../../base-pages/CKEditor';
import { expect } from '@playwright/test';
import { UserPage } from '../../../base-pages/UserPage';
import { CreatePages } from '../../../base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { UploadMedia } from '@poms/base-pages/UploadMedia';

export interface RemoteDocumentSaveData
{
    remoteDocumentTitle: string;
    revisionLogMessage: string;
    remoteDocumentURL: string;
}

export class RemoteDocumentFileEditPage
{
    // logging
    private readonly testSteps: TestSteps;

    // pages
    private readonly createPages: CreatePages;
    private readonly uploadMedia: UploadMedia;

    // locators
    private readonly remoteDocumentTitleField: Locator;
    private readonly createNewRevisionCheckbox: Locator;

    // error messages
    private readonly titleFieldIsRequired: Locator;

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
        this.uploadMedia = new UploadMedia(page, this.testSetUpData, this.testData);

        // locators
        this.remoteDocumentTitleField = page.locator('#edit-name-0-value');

        this.createNewRevisionCheckbox = page.locator('#edit-revision');

        // Error messages
        this.titleFieldIsRequired = page.getByText("Title field is required.");

    }

    // ------------------------ asserts ------------------------

    // check url on create remoteDocument page
    async editRemoteDocumentPageURLCheck()
    {
        await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/media/.+/edit?"`);
        await expect(this.page).toHaveURL(new RegExp(`${this.testSetUpData.urlForTest.url}/media/.+/edit\\?.*`));
    }

    // ------------------------ filling application form ------------------------

    // enter application title 
    async enterRemoteDocumentTitle(remoteDocumentTitle: string)
    {
        await this.testSteps.LogInfo(`Entering "${remoteDocumentTitle}" into the Title field`);
        await this.remoteDocumentTitleField.fill(remoteDocumentTitle);
    }



    // ------------------------ actions related to create application  ------------------------

    // Mandatory Field Check application
    async mandatoryFieldCheck()
    {
        await this.testSteps.LogInfo('Performing mandatory field check');
        await this.testSteps.LogInfo('Clicking save button');
        await this.createPages.clickSaveButton();
        await this.testSteps.LogInfo('Verifying Title field error message appears');
        await expect(this.titleFieldIsRequired).toBeVisible();

    }

    // fill in application form elements - title summary topics etc
    async fillEditedRemoteDocumentForm(data: RemoteDocumentSaveData)
    {
        await this.editRemoteDocumentPageURLCheck();
        await this.enterRemoteDocumentTitle(data.remoteDocumentTitle);
        // Revision log message field is not displayed, must click on Create new revision
        await this.createNewRevisionCheckbox.check();
        await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);

        await this.uploadMedia.addRemoteDocumentProcess(data.remoteDocumentURL);
    }
}