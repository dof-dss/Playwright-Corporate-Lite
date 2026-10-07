import { Page, Locator } from '@playwright/test';
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
        //-------------------- TITLE --------------------
        await this.testSteps.LogInfo('Verifying "New" text has been removed from the title');
        await expect(this.page.locator('//a[contains(text(),"Automated Test - ")]/del[text()="New"]')).toBeVisible();

        await this.testSteps.LogInfo('Verifying "Edited" text has been added to the title');
        await expect(this.page.locator('//a[contains(text(),"Automated Test - ")]/ins[text()="Edited"]')).toBeVisible();

        //-------------------- LINK URL --------------------
        await this. testSteps.LogInfo(`Verifying "${this.testData.Link.linkURL}" text has been removed from the Link URL section`);
        const normalizedLinkURLPath = this.testData.Link.linkURL
            .replace(/^https?:\/\/[^/]+/i, '')
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/^\/+/, '');
        await expect(this.page.locator(`//h2[normalize-space()="Link URL"]/following-sibling::div//del//a[contains(normalize-space(), "${normalizedLinkURLPath}")]`)).toBeVisible();


        await this.testSteps.LogInfo(`Verifying "${this.testData.Link.linkURLEdited}" text has been added to the Link URL section`);
        await expect(this.page.locator(`//h2[normalize-space()="Link URL"]/following-sibling::div//ins//a[contains(normalize-space(), "${this.testData.Link.linkURLEdited}")]`)).toBeVisible();

        //-------------------- LINK TYPE --------------------
        await this.testSteps.LogInfo(`Verifying "${this.testData.Link.linkType}" text has been removed from the Link Type section`);
        await expect(this.page.locator(`//h2[normalize-space()="Link type"]//following-sibling::div/del[text()="Quick"]`)).toBeVisible();

        await this.testSteps.LogInfo(`Verifying "${this.testData.Link.linkTypeEdited}" text has been added to the Link Type section`);
        await expect(this.page.locator(`//h2[normalize-space()="Link type"]//following-sibling::div/ins[text()="Corporate"]`)).toBeVisible();

        //-------------------- LINK LANGUAGE --------------------
        await this.testSteps.LogInfo(`Verifying "${this.testData.Link.linkLanguage}" text has been removed from the Link Language section`);
        await expect(this.page.locator(`//h2[normalize-space()="Link language"]//following-sibling::div/del[normalize-space()="${this.testData.Link.linkLanguage}"]`)).toBeVisible();

        await this.testSteps.LogInfo(`Verifying "${this.testData.Link.linkLanguageEdited}" text has been added to the Link Language section`);
        await expect(this.page.locator(`//h2[normalize-space()="Link language"]//following-sibling::div/ins[normalize-space()="${this.testData.Link.linkLanguageEdited}"]`)).toBeVisible();


    }
}
