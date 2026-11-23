import { Page } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { expect } from '@playwright/test';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export class LinkComparePage
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

    // check url on compare link page
    async compareLinkPageURLCheck()
    {
        // escapeRegex removes all white space and replaces with '-', where '-' already exists and surrounded by 
        // white space it will just remove surrounding white space and converts all characters to lower case.
        const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();

        await expect(this.page).toHaveURL(
            new RegExp(this.testSetUpData.urlForTest.url + `/link/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)}$`)
        );
    }

    // verify both versions are visible for comparison
    async verifyCompareLink()
    {
        const main = this.page.getByRole('main');

        //-------------------- TITLE --------------------
        await this.testSteps.LogInfo('Verifying "New" text has been removed from the title');
        await expect(main.locator('h2 a span del')).toBeVisible();
        await expect(main.locator('h2 a span del')).toHaveText('New');

        await this.testSteps.LogInfo('Verifying "Edited" text has been added to the title');
        await expect(main.locator('h2 a span ins')).toBeVisible();
        await expect(main.locator('h2 a span ins')).toHaveText('Edited');

        //-------------------- LINK URL --------------------
        const linkURL = main.getByText('Link URL', { exact: true }).locator('..');
        await this.testSteps.LogInfo(`Verifying "${this.testData.Link.linkURL}" text has been removed from the Link URL section`);
        const normalizedLinkURLPath = this.testData.Link.linkURL
            .replace(/^https?:\/\/[^/]+/i, '')
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^\/+/, '');
        await expect(linkURL.locator('del a')).toBeVisible();
        await expect(linkURL.locator('del a')).toContainText(normalizedLinkURLPath);

        await this.testSteps.LogInfo(`Verifying "${this.testData.Link.linkURLEdited}" text has been added to the Link URL section`);
        await expect(linkURL.locator('ins a')).toBeVisible();
        await expect(linkURL.locator('ins a')).toContainText(this.testData.Link.linkURLEdited);

        //-------------------- LINK TYPE --------------------
        const linkType = main.getByText('Link type', { exact: true }).locator('..');
        await this.testSteps.LogInfo(`Verifying "${this.testData.Link.linkType}" text has been removed from the Link Type section`);
        await expect(linkType.locator('del a')).toBeVisible();
        await expect(linkType.locator('del a')).toHaveText(this.testData.Link.linkType);

        await this.testSteps.LogInfo(`Verifying "${this.testData.Link.linkTypeEdited}" text has been added to the Link Type section`);
        await expect(linkType.locator('ins a')).toBeVisible();
        await expect(linkType.locator('ins a')).toHaveText(this.testData.Link.linkTypeEdited);

        //-------------------- TOPICS --------------------
        const topics = main.locator('.field--name-field-site-topics');
        const originalTopic = this.testData.Link.topics[this.testData.Link.topics.length - 1];
        await this.testSteps.LogInfo(`Verifying "${originalTopic}" has been removed from Topics`);
        await expect(topics.locator('del').filter({ hasText: originalTopic })).toBeVisible();

        for (const topic of new Set(this.testData.Link.topicsEdited))
        {
            await this.testSteps.LogInfo(`Verifying "${topic}" has been added to Topics`);
            await expect(topics.locator('ins').filter({ hasText: topic })).toBeVisible();
        }
    }
}
