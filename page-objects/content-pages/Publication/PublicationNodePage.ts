import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { expect } from '@playwright/test';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export interface VerifyOptions
{
};

export class PublicationNodePage
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

    // check url after saving create publication
    async publicationNodeURLCheck()
    {
        // escapeRegex removes all white space and replaces with '-', where '-' already exists and surrounded by 
        // white space it will just remove surrounding white space and converts all characters to lower case.
        const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();
        await this.testSteps.LogInfo(`Verifying URL path is /publications/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)} with optional -suffix and optional trailing path, or is /node/.+/latest`);
        await expect(this.page).toHaveURL(
            new RegExp(`(?:${this.testSetUpData.urlForTest.url}/publications/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)}(?:-[^/]+)?(?:/.*)?$)|(?:/node/.+/latest)`)
        );
    }

    // -------------------- Verify Publication methods --------------------

    //verify publication method
    async verifyPublication(_: VerifyOptions)
    {
        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testData.Publication.title}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.Publication.title);

        // verify publication published date
        await this.testSteps.LogInfo(`Verifying Date Published "${this.testData.Publication.verifyDatePublished}" is visible`);
        await expect(this.page.locator(`//span[contains(text(),"Date published: ")]//following-sibling::span/time[contains(text(),"${this.testData.Publication.verifyDatePublished}")]`)).toBeVisible();

        // verify publication last updated text is not present
        await this.testSteps.LogInfo(`Verifying Last updated "${this.testData.Publication.verifyLastUpdatedDate}" is NOT visible`);
        await expect(this.page.locator(`//span[contains(text(),"Last updated: ")]//following-sibling::span/time[contains(text(),"${this.testData.Publication.verifyLastUpdatedDate}")]`)).toBeHidden();

        // verify summary
        await this.testSteps.LogInfo(`Verifying Summary "${this.testData.Publication.summary}" is visible`);
        await expect(this.page.getByText(this.testData.Publication.summary)).toBeVisible();

        // verify body field
        await this.testSteps.LogInfo(`Verifying Body "${this.testData.Publication.body}" is visible`);
        await expect(this.page.getByText(this.testData.Publication.body)).toBeVisible();
    }


    //verify edited publication method
    async verifyEditedPublication(_: VerifyOptions)
    {
        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testData.Publication.titleEdited}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.Publication.titleEdited);

        // verify publication published date
        await this.testSteps.LogInfo('Verifying Date Published "31 December 2025" is visible');
        await expect(this.page.locator('//span[contains(text(),"Date published")]//following-sibling::span/time[contains(text(),"31 December 2025")]')).toBeVisible();

        // verify publication last updated date
        await this.testSteps.LogInfo(`Verifying Last updated "${this.testData.Publication.verifyLastUpdatedDate}" is visible`);
        await expect(this.page.locator(`//span[contains(text(),"Last updated: ")]//following-sibling::span/time[contains(text(),"${this.testData.Publication.verifyLastUpdatedDate}")]`)).toBeVisible();

        // verify summary
        await this.testSteps.LogInfo(`Verifying Summary "${this.testData.Publication.summaryEdited}" is visible`);
        await expect(this.page.getByText(this.testData.Publication.summaryEdited)).toBeVisible();

        // verify body field
        await this.testSteps.LogInfo(`Verifying Body "${this.testData.Publication.bodyEdited}" is visible`);
        await expect(this.page.getByText(this.testData.Publication.bodyEdited)).toBeVisible();
    }

    //verify publication method
    async verifyExternalLinkPublication(_: VerifyOptions)
    {
        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testData.Publication.title}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.Publication.title);

        // verify summary
        await this.testSteps.LogInfo(`Verifying Summary "${this.testData.Publication.summary}" is visible`);
        await expect(this.page.getByText(this.testData.Publication.summary)).toBeVisible();

        // verify body field
        await this.testSteps.LogInfo(`Verifying Body "${this.testData.Publication.body}" is visible`);
        await expect(this.page.getByText(this.testData.Publication.body)).toBeVisible();

        // external link verification
        // Start waiting for the new tab before the click
        const pagePromise = this.page.context().waitForEvent('page');
        // click application link text
        await this.testSteps.LogInfo(`Clicking Link "${this.testData.Publication.linkTextPubllication}"`);
        await this.page.getByRole('link', { name: this.testData.Publication.linkTextPubllication }).click();
        // Wait for the new page object to be ready
        const newTab = await pagePromise;
        // verify link by checking url of new page 
        await this.testSteps.LogInfo(`Verifying URL "${this.testData.Publication.externalPublication}"`);
        await expect(newTab).toHaveURL(this.testData.Publication.externalPublication);
        // close new tab
        await this.testSteps.LogInfo('Closing new tab, navigated back to previous page ');
        await newTab.close();
    }


    //verify edited publication method
    async verifyEditedExternalLinkPublication(_: VerifyOptions)
    {
        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testData.Publication.titleEdited}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.Publication.titleEdited);

        // verify summary
        await this.testSteps.LogInfo(`Verifying Summary "${this.testData.Publication.summaryEdited}" is visible`);
        await expect(this.page.getByText(this.testData.Publication.summaryEdited)).toBeVisible();

        // verify body field
        await this.testSteps.LogInfo(`Verifying Body "${this.testData.Publication.bodyEdited}" is visible`);
        await expect(this.page.getByText(this.testData.Publication.bodyEdited)).toBeVisible();

        // external link verification
        // Start waiting for the new tab before the click
        const pagePromise = this.page.context().waitForEvent('page');
        // click application link text
        await this.testSteps.LogInfo(`Clicking Link "${this.testData.Publication.linkTextPubllicationEdited}"`);
        await this.page.getByRole('link', { name: this.testData.Publication.linkTextPubllicationEdited }).click();
        // Wait for the new page object to be ready
        const newTab = await pagePromise;
        // verify link by checking url of new page 
        await this.testSteps.LogInfo(`Verifying URL "${this.testData.Publication.externalPublicationEdited}"`);
        await expect(newTab).toHaveURL(this.testData.Publication.externalPublicationEdited);
        // close new tab
        await this.testSteps.LogInfo('Closing new tab, navigated back to previous page ');
        await newTab.close();
    }

}