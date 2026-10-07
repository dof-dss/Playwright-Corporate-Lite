import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { CKEditor } from '../../../base-pages/CKEditor';
import { expect } from '@playwright/test';
import { UserPage } from '../../../base-pages/UserPage';
import { CreatePages } from '../../../base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { UploadMedia } from '@poms/base-pages/UploadMedia';

export interface DocumentSaveData
{
    documentTitle: string;
    revisionLogMessage: string;
    existingDocumentName?: string;
}

export class DocumentFileCreatePage
{
    // logging
    private readonly testSteps: TestSteps;

    // pages
    private readonly createPages: CreatePages;
    private readonly uploadMedia: UploadMedia;

    // locators
    private readonly documentTitleField: Locator;

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
        this.documentTitleField = page.locator('#edit-name-0-value');

        // Error messages
        this.titleFieldIsRequired = page.getByText("Title field is required.");

    }

    // ------------------------ asserts ------------------------

    // check url on create audio page
    async createDocumentPageURLCheck()
    {
        await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/media/add/document"`);
        await expect(this.page).toHaveURL(`${this.testSetUpData.urlForTest.url}/media/add/document`);
    }


    // ------------------------ filling application form ------------------------

    // enter application title 
    async enterDocumentTitle(documentTitle: string)
    {
        await this.testSteps.LogInfo(`Entering "${documentTitle}" into the Title field`);
        await this.documentTitleField.fill(documentTitle);
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
    async fillDocumentForm(data: DocumentSaveData)
    {
        await this.createDocumentPageURLCheck();
        await this.enterDocumentTitle(data.documentTitle);
        await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);

        if (data.existingDocumentName)
        {
            //await this.uploadMedia.selectExistingImageFromLibrary(data.existingDocumentName);
            // wait 2 seconds and refresh page
            await this.page.waitForTimeout(2000);
        }
        else
        {
            // uploading Document
            await this.page.waitForTimeout(1000);
            await this.uploadMedia.uploadAttachmnetProcess(TestData.Media.attachmentFileName);

            // verify document file is uploaded - Was very inconsistent with time to upload, 
            // verifying the file size is visible seems to be the most reliable way to verify upload
            await expect(this.page.locator(`//*[contains(@id, "edit-field-media-file")]//span[contains(@class,'file__size')]`)).toBeVisible();
        }
    }
}