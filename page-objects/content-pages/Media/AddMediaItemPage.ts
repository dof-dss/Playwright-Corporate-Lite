import { Page, Locator, expect, test } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestSetUpData } from '@tdata/TestDataObject';


export class AddMediaItemPage
{
    private readonly testSteps: TestSteps;

    constructor(
        private page: Page,
        // isolated instances of test data
        private testSetUpData: typeof TestSetUpData
    ) 
    {
        this.testSteps = new TestSteps();
    }

    // media page check 
    async addMediaItemPageURLCheck()
    {
        await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/media/add"`);
        await expect(this.page).toHaveURL(`${this.testSetUpData.urlForTest.url}/media/add`);
    }

    // click Add Audio button if visible
    async addAudioButton()
    {
        await this.page.getByRole('link', { name: 'Audio', exact: true }).isVisible();
        await this.testSteps.LogInfo('Clicking "Audio" Button');
        await this.page.getByRole('link', { name: 'Audio', exact: true }).click();
    }

    // click Add Document button if visible
    async addDocumentButton()
    {
        await this.page.getByRole('link', { name: 'Document', exact: true }).isVisible();
        await this.testSteps.LogInfo('Clicking "Document" Button');
        await this.page.getByRole('link', { name: 'Document', exact: true }).click();
    }

    // click Add Image button if visible
    async addImageButton()
    {
        await this.page.getByRole('link', { name: 'Image', exact: true }).isVisible();
        await this.testSteps.LogInfo('Clicking "Image" Button');
        await this.page.getByRole('link', { name: 'Image', exact: true }).click();
    }

    // click Add Remote document button if visible
    async addRemoteDocumentButton()
    {
        await this.page.getByRole('link', { name: 'Remote document', exact: true }).isVisible();
        await this.testSteps.LogInfo('Clicking "Remote document" Button');
        await this.page.getByRole('link', { name: 'Remote document', exact: true }).click();
    }

    // click Add Remote video button if visible
    async addRemoteVideoButton()
    {
        await this.page.getByRole('link', { name: 'Remote video', exact: true }).isVisible();
        await this.testSteps.LogInfo('Clicking "Remote video" Button');
        await this.page.getByRole('link', { name: 'Remote video', exact: true }).click();
    }

}

