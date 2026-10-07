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

        await this.testSteps.LogInfo(`Verifying Contact Body Field topic  "${this.testData.Contact.body}" IS visible`);
        await expect(this.page.getByText(this.testData.Contact.body)).toBeVisible();

        if (TestSetUpData.userForTest.username === TestSetUpData.validUserList.supervisor_username)
        {
            await this.testSteps.LogInfo(`Verifying Contact Map IS visible`);
            await expect(this.page.getByRole('menuitemradio', { name: 'Show street map' })).toBeVisible();
        }
    }

    // verify edited contact method
    async verifyEditedContact(_: VerifyOptions)
    {
        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testData.Contact.titleEdited}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.Contact.titleEdited);

        await this.testSteps.LogInfo(`Verifying Contact Body Field topic  "${this.testData.Contact.bodyEdited}" IS visible`);
        await expect(this.page.getByText(this.testData.Contact.bodyEdited)).toBeVisible();

        if (TestSetUpData.userForTest.username === TestSetUpData.validUserList.supervisor_username)
        {
            await this.testSteps.LogInfo(`Verifying Contact Map IS visible`);
            await expect(this.page.getByRole('menuitemradio', { name: 'Show street map' })).toBeVisible();
        }
    }
}
