import { Page } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { expect } from '@playwright/test';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export interface VerifyOptions
{
};

export class ContactNodePage
{
    // logging
    private readonly testSteps: TestSteps;

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
    }

    // -------------------- URL CHECK --------------------

    // check url after saving create contact
    async contactNodeURLCheck()
    {
        // escapeRegex removes all white space and replaces with '-', where '-' already exists and surrounded by
        // white space it will just remove surrounding white space and converts all characters to lower case.
        const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();

        await this.testSteps.LogInfo(`Verifying URL path is /contacts/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)} with optional -suffix and optional trailing path, or is /node/.+/latest`);
        await expect(this.page).toHaveURL(
            new RegExp(`(?:${this.testSetUpData.urlForTest.url}/contacts/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)}(?:-[^/]+)?(?:/.*)?$)|(?:/node/.+/latest)`)
        );
    }

    // -------------------- Verify Contact methods --------------------

    // verify contact method
    async verifyContact(_: VerifyOptions)
    {
        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testData.Contact.title}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1 })).toHaveText(this.testData.Contact.title);

        // 
        // Leave for adding of Statsistics to node page
        //         
        // Leave for addnig of Research and support to node page
        //

        await this.testSteps.LogInfo(`Verifying Contact Body Field topic  "${this.testData.Contact.body}" IS visible`);
        await expect(this.page.getByText(this.testData.Contact.body)).toBeVisible();

        if (this.testSetUpData.userForTest.username === this.testSetUpData.validUserList.supervisor_username)
        {
            await this.testSteps.LogInfo('Verifying the map container is visible');
            await expect(this.page.locator('iframe[title="Map showing the location of this contact"]').contentFrame().getByRole('region', { name: 'Map' })).toBeVisible();

            const coordinates = `${this.testData.Contact.mapLatitude.trim()},${this.testData.Contact.mapLongitude.trim()}`;
            const mapLink = this.page.locator('a[href^="https://maps.google.com/?q="]');
            await this.testSteps.LogInfo(`Verifying map link contains coordinates "${coordinates}"`);
            await expect(mapLink).toHaveAttribute('href', `https://maps.google.com/?q=${coordinates}`);
        }
    }

    // verify edited contact method
    async verifyEditedContact(_: VerifyOptions)
    {
        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testData.Contact.titleEdited}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.Contact.titleEdited);


        // 
        // Leave for adding of Statsistics to node page
        //         
        // Leave for addnig of Research and support to node page
        //

        await this.testSteps.LogInfo(`Verifying Contact Body Field topic  "${this.testData.Contact.bodyEdited}" IS visible`);
        await expect(this.page.getByText(this.testData.Contact.bodyEdited)).toBeVisible();


        if (this.testSetUpData.userForTest.username === this.testSetUpData.validUserList.supervisor_username)
        {
            await this.testSteps.LogInfo('Verifying the map container is visible');
            await expect(this.page.locator('iframe[title="Map showing the location of this contact"]').contentFrame().getByRole('region', { name: 'Map' })).toBeVisible();

            const coordinates = `${this.testData.Contact.mapLatitudeEdited.trim()},${this.testData.Contact.mapLongitudeEdited.trim()}`;
            const mapLink = this.page.locator('a[href^="https://maps.google.com/?q="]');
            await this.testSteps.LogInfo(`Verifying map link contains coordinates "${coordinates}"`);
            await expect(mapLink).toHaveAttribute('href', `https://maps.google.com/?q=${coordinates}`);
        }
    }
}
