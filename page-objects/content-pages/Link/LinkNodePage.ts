import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { expect } from '@playwright/test';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export interface VerifyOptions
{
    preview: boolean;
};

export class LinkNodePage
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

    // check url after saving create link
    async linkNodeURLCheck()
    {
        // escapeRegex removes all white space and replaces with '-', where '-' already exists and surrounded by 
        // white space it will just remove surrounding white space and converts all characters to lower case.
        const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();

        await this.testSteps.LogInfo(`Verifying URL path is /links/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)} with optional -suffix and optional trailing path, or is /node/.+`);
        await expect(this.page).toHaveURL(
            new RegExp(`(?:${this.testSetUpData.urlForTest.url}/links/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)}(?:-[^/]+)?(?:/.*)?$)|(?:/node/.+)`)
        );
    }

    // -------------------- Verify Link methods --------------------

    //verify link method
    async verifyLink({ preview }: VerifyOptions)
    {
        // verify title using ARIA role
        await this.testSteps.LogInfo(`Verifying title "${this.testData.Link.title}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1 })).toHaveText(this.testData.Link.title);

        // verify link URL using ARIA role
        await this.testSteps.LogInfo(`Verifying Link URL "${this.testData.Link.linkURL}" is visible`);
        const normalizedLinkURLPath = this.testData.Link.linkURL
            .replace(/^https?:\/\/[^/]+/i, '')
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/^\/+/, '');
        await expect(this.page.locator(`//h2[normalize-space()="Link URL"]/following-sibling::div/a[contains(normalize-space(), "${normalizedLinkURLPath}")]`)).toBeVisible();

        if (!preview)
        {
            // Only clicking on Link when content has been saved as unable to click to naviagte to it when in preview
            // click application link text
            await this.testSteps.LogInfo(`Clicking Link text "${this.testData.Link.linkURL}"`);
            //await this.page.getByRole('link', { name: this.testData.Link.linkURL }).click();
            await this.page.locator(`//h2[normalize-space()="Link URL"]/following-sibling::div/a[contains(normalize-space(), "${normalizedLinkURLPath}")]`).click();
            // verify link by checking title (link url is page title for internal link edit test will be external)
            await this.testSteps.LogInfo(`Verifying title of content on new page "${this.testData.Link.linkURL}" is visible`);
            await expect(this.page.getByRole('heading', { level: 1 })).toHaveText(this.testData.Link.linkURL);
            // navigate back to previous page 
            await this.testSteps.LogInfo('Navigating back to previous page');
            await this.page.goBack();
        }


        // verify link type using ARIA role
        await this.testSteps.LogInfo(`Verifying Link Type "${this.testData.Link.linkType}" is visible`);
        await expect(this.page.locator(`//h2[normalize-space()="Link type"]/following-sibling::div[text()="${this.testData.Link.linkType}"]`)).toBeVisible();

        // verify link language using ARIA role
        await this.testSteps.LogInfo(`Verifying Link Language "${this.testData.Link.linkLanguage}" is visible`);
        await expect(this.page.locator(`//h2[normalize-space()="Link language"]/following-sibling::div[text()="${this.testData.Link.linkLanguage}"]`)).toBeVisible();
    }

    //verify edited link method
    async verifyEditedLink({ preview }: VerifyOptions)
    {
        // verify title using ARIA role
        await this.testSteps.LogInfo(`Verifying Edited title "${this.testSetUpData.contentTitleforTest.contentTitle}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.Link.titleEdited);

        // verify link URL using ARIA role
        await this.testSteps.LogInfo(`Verifying Edited Link URL "${this.testData.Link.linkURLEdited}" is visible`);
        await expect(this.page.locator(`//h2[normalize-space()="Link URL"]/following-sibling::div/a[contains(normalize-space(), "${this.testData.Link.linkURLEdited}")]`)).toBeVisible();

        if (!preview)
        {
            // Only clicking on Link when content has been saved as unable to click to navigate to it when in preview
            // Start waiting for the new tab before the click
            const pagePromise = this.page.context().waitForEvent('page');
            // click application link text
            await this.testSteps.LogInfo(`Clicking On Link text "${this.testData.Link.linkURLEdited}"`);
            await this.page.getByRole('link', { name: this.testData.Link.linkURLEdited }).click();
            // Wait for the new page object to be ready
            const newTab = await pagePromise;
            // verify link by checking url of new page 
            await this.testSteps.LogInfo(`Verifying Link URL "${this.testData.Application.LinkURLEdited}"`);
            await expect(newTab).toHaveURL(this.testData.Application.LinkURLEdited);
            // close new tab
            await this.testSteps.LogInfo('Closing New tab');
            await newTab.close();
        }

        // verify link type using ARIA role
        await this.testSteps.LogInfo(`Verifying Edited Link Type "${this.testData.Link.linkTypeEdited}" is visible`);
        await expect(this.page.locator(`//h2[normalize-space()="Link type"]/following-sibling::div[text()="${this.testData.Link.linkTypeEdited}"]`)).toBeVisible();

        // verify link language using ARIA role
        await this.testSteps.LogInfo(`Verifying Edited Link Language "${this.testData.Link.linkLanguageEdited}" is visible`);
        await expect(this.page.locator(`//h2[normalize-space()="Link language"]/following-sibling::div[text()="${this.testData.Link.linkLanguageEdited}"]`)).toBeVisible();
    }
}
