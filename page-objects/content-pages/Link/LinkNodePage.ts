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

        await this.testSteps.LogInfo(`Verifying URL path is /link/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)} with optional -suffix and optional trailing path, or is /node/.+`);
        await expect(this.page).toHaveURL(
            new RegExp(`(?:${this.testSetUpData.urlForTest.url}/link/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)}(?:-[^/]+)?(?:/.*)?$)|(?:/node/.+)`)
        );
    }




    // -------------------- Verify Link methods --------------------

    //verify link method
    async verifyLink({ preview }: VerifyOptions)
    {
        // verify title using ARIA role
        await this.testSteps.LogInfo(`Verifying title "${this.testData.Link.title}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1 })).toHaveText(this.testData.Link.title);

        await this.testSteps.LogInfo(`Verifying Link URL "${this.testData.Link.linkURL}" is visible`);
        const content = this.page.getByRole('main');
        await expect(content.getByText('Link URL', { exact: true })).toBeVisible();

        
        // Normalize the LinkURL: convert to lowercase, replace spaces with hyphens, and collapse multiple hyphens
        const normalizedLinkURLForDisplay = this.testData.Link.linkURL.toLowerCase().replace(/\s+/g, '-').replace(/-+/g, '-');
        await expect(content.getByText(normalizedLinkURLForDisplay)).toBeVisible();



        await this.testSteps.LogInfo(`Verifying Link Type "${this.testData.Link.linkType}" is visible`);
        await expect(content.getByText('Link type', { exact: true })).toBeVisible();
        await expect(content.getByText(this.testData.Link.linkType, { exact: true })).toBeVisible();

        const selectedTopic = this.testData.Link.topics[this.testData.Link.topics.length - 1];
        await this.testSteps.LogInfo(`Verifying topic "${selectedTopic}" is visible`);
        await expect(content.getByText('Topics:', { exact: true })).toBeVisible();
        await expect(content.getByText(selectedTopic, { exact: true })).toBeVisible();

        if (!preview)
        {
            await this.testSteps.LogInfo(`Clicking Link text "${this.testData.Link.linkURL}"`);
            const linkURL = this.page.getByText(normalizedLinkURLForDisplay);
            await linkURL.click();
            await this.testSteps.LogInfo(`Verifying title of content on new page "${this.testData.Link.linkURL}" is visible`);
            await expect(this.page.getByRole('heading', { level: 1 })).toHaveText(this.testData.Link.linkURL);
            await this.testSteps.LogInfo('Navigating back to previous page');
            await this.page.goBack();
        }
    }

    //verify edited link method
    async verifyEditedLink({ preview }: VerifyOptions)
    {
        // verify title using ARIA role
        await this.testSteps.LogInfo(`Verifying Edited title "${this.testSetUpData.contentTitleforTest.contentTitle}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.Link.titleEdited);

        await this.testSteps.LogInfo(`Verifying Edited Link URL "${this.testData.Link.linkURLEdited}" is visible`);
        const content = this.page.getByRole('main');
        await expect(content.getByText('Link URL', { exact: true })).toBeVisible();
        await expect(content.getByText(this.testData.Link.linkURLEdited)).toBeVisible();

        await this.testSteps.LogInfo(`Verifying Edited Link Type "${this.testData.Link.linkTypeEdited}" is visible`);
        await expect(content.getByText('Link type', { exact: true })).toBeVisible();
        await expect(content.getByText(this.testData.Link.linkTypeEdited, { exact: true })).toBeVisible();

        if (!preview)
        {
            await this.testSteps.LogInfo(`Clicking On Link text "${this.testData.Link.linkURLEdited}"`);
            const [newTab] = await Promise.all([
                this.page.waitForEvent('popup'),
                content.getByRole('link', { name: this.testData.Link.linkURLEdited }).click(),
            ]);
            await this.testSteps.LogInfo(`Verifying Link URL "${this.testData.Link.linkURLEdited}"`);
            await expect(newTab).toHaveURL(new URL(this.testData.Link.linkURLEdited).href);
            await this.testSteps.LogInfo('Closing New tab');
            await newTab.close();
        }
    }
}
