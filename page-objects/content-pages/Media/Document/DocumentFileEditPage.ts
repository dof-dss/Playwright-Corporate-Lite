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
}

export class DocumentFileEditPage
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
    async editDocumentPageURLCheck()
    {
        await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/media/.+/edit?"`);
        await expect(this.page).toHaveURL(new RegExp(`${this.testSetUpData.urlForTest.url}/media/.+/edit\\?.*`));
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
    async fillEditedDocumentForm(data: DocumentSaveData)
    {
        await this.editDocumentPageURLCheck();
        await this.enterDocumentTitle(data.documentTitle);
        await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);
        
        // verify audio file is still uploaded 
        await expect(this.page.locator(`//*[contains(@id, "edit-field-media-file")]//span[contains(@class,'file__size')]`)).toBeVisible();
    }
}