import { Page, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export class FeatureComparePage
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

    // check url on compare feature page
    async compareFeaturePageURLCheck()
    {
        // escapeRegex removes all white space and replaces with '-', where '-' already exists and surrounded by 
        // white space it will just remove surrounding white space and converts all characters to lower case.
        const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();

        await this.testSteps.LogInfo(`Verifying URL contains /node and /revisions/view pattern`);
        await expect(this.page).toHaveURL(new RegExp('/node/.+/revisions/view/.+/.+'));
    }

    // -------------------- Verify Feature comparison methods --------------------

    // verify feature when being compared
    async verifyCompareFeature()
    {
        const main = this.page.getByRole('main');

        //-------------------- TITLE --------------------
        await this.testSteps.LogInfo('Verifying title changes are highlighted in comparison');
        const titleSection = main.locator('h3');
        await expect(titleSection).toBeVisible();

        // Verify removed text has <del> tags
        if (this.testData.Feature?.title)
        {
            await this.testSteps.LogInfo(`Verifying original title "${this.testData.Feature.title}" is marked as removed`);
            const deletedTitle = titleSection.locator('del');
            await expect(deletedTitle).toBeVisible();
        }

        // Verify added text has <ins> tags
        if (this.testData.Feature?.titleEdited)
        {
            await this.testSteps.LogInfo(`Verifying edited title "${this.testData.Feature.titleEdited}" is marked as added`);
            const insertedTitle = titleSection.locator('ins');
            await expect(insertedTitle).toBeVisible();
        }

        //-------------------- LINK URL --------------------
        await this.testSteps.LogInfo('Verifying Link URL changes are highlighted in comparison');
        
        if (this.testData.Feature?.linkURL)
        {
            await this.testSteps.LogInfo(`Verifying original Link URL "${this.testData.Feature.linkURL}" is marked as removed`);
            const deletedLinkURL = main.locator('del').filter({ hasText: this.testData.Feature.linkURL }).first();
            await expect(deletedLinkURL).toBeVisible();
        }

        if (this.testData.Feature?.linkURLEdited)
        {
            await this.testSteps.LogInfo(`Verifying edited Link URL "${this.testData.Feature.linkURLEdited}" is marked as added`);
            const insertedLinkURL = main.locator('ins').filter({ hasText: this.testData.Feature.linkURLEdited }).first();
            await expect(insertedLinkURL).toBeVisible();
        }

        //-------------------- TEASER --------------------
        await this.testSteps.LogInfo('Verifying Teaser changes are highlighted in comparison');
        
        if (this.testData.Feature?.teaser)
        {
            await this.testSteps.LogInfo(`Verifying original Teaser "${this.testData.Feature.teaser}" is marked as removed`);
            const deletedTeaser = main.locator('del').filter({ hasText: this.testData.Feature.teaser }).first();
            await expect(deletedTeaser).toBeVisible();
        }

        if (this.testData.Feature?.teaserEdited)
        {
            await this.testSteps.LogInfo(`Verifying edited Teaser "${this.testData.Feature.teaserEdited}" is marked as added`);
            const insertedTeaser = main.locator('ins').filter({ hasText: this.testData.Feature.teaserEdited }).first();
            await expect(insertedTeaser).toBeVisible();
        }
    }

    // verify specific field comparison
    async verifyTitleComparison()
    {
        await this.testSteps.LogInfo('Verifying Title field comparison');
        const titleSection = this.page.locator('h3');
        await expect(titleSection).toBeVisible();

        if (this.testData.Feature?.title)
        {
            await this.testSteps.LogInfo(`Verifying removed title text with <del> tags`);
            const deletedTitle = titleSection.locator('del');
            await expect(deletedTitle).toBeVisible();
        }

        if (this.testData.Feature?.titleEdited)
        {
            await this.testSteps.LogInfo(`Verifying added title text with <ins> tags`);
            const insertedTitle = titleSection.locator('ins');
            await expect(insertedTitle).toBeVisible();
        }
    }

    // verify Link URL comparison
    async verifyLinkURLComparison()
    {
        await this.testSteps.LogInfo('Verifying Link URL field comparison');
        const main = this.page.getByRole('main');

        if (this.testData.Feature?.linkURL)
        {
            await this.testSteps.LogInfo(`Verifying removed Link URL "${this.testData.Feature.linkURL}" with <del> tags`);
            const deletedLinkURL = main.locator('del').filter({ hasText: this.testData.Feature.linkURL }).first();
            await expect(deletedLinkURL).toBeVisible();
        }

        if (this.testData.Feature?.linkURLEdited)
        {
            await this.testSteps.LogInfo(`Verifying added Link URL "${this.testData.Feature.linkURLEdited}" with <ins> tags`);
            const insertedLinkURL = main.locator('ins').filter({ hasText: this.testData.Feature.linkURLEdited }).first();
            await expect(insertedLinkURL).toBeVisible();
        }
    }

    // verify Teaser comparison
    async verifyTeaserComparison()
    {
        await this.testSteps.LogInfo('Verifying Teaser field comparison');
        const main = this.page.getByRole('main');

        if (this.testData.Feature?.teaser)
        {
            await this.testSteps.LogInfo(`Verifying removed Teaser "${this.testData.Feature.teaser}" with <del> tags`);
            const deletedTeaser = main.locator('del').filter({ hasText: this.testData.Feature.teaser }).first();
            await expect(deletedTeaser).toBeVisible();
        }

        if (this.testData.Feature?.teaserEdited)
        {
            await this.testSteps.LogInfo(`Verifying added Teaser "${this.testData.Feature.teaserEdited}" with <ins> tags`);
            const insertedTeaser = main.locator('ins').filter({ hasText: this.testData.Feature.teaserEdited }).first();
            await expect(insertedTeaser).toBeVisible();
        }
    }

    // verify Photo comparison (if applicable)
    async verifyPhotoComparison()
    {
        await this.testSteps.LogInfo('Verifying Photo/Media field comparison');
        const main = this.page.getByRole('main');

        // Check if photos are marked as changed
        const images = main.locator('img');
        const imageCount = await images.count();
        
        if (imageCount > 0)
        {
            await this.testSteps.LogInfo(`Found ${imageCount} images in comparison`);
            await expect(images.first()).toBeVisible();
        }
    }

    // verify comparison header shows correct revision timestamps
    async verifyComparisonHeader()
    {
        await this.testSteps.LogInfo('Verifying comparison header with timestamps');
        
        const heading = this.page.getByRole('heading', { level: 1 });
        await expect(heading).toContainText('Changes to');
        
        // Verify comparing revisions section is visible
        const comparingSection = this.page.getByText('Comparing');
        await expect(comparingSection).toBeVisible();
    }

    // get deleted content (marked with <del>)
    async getDeletedElements(): Promise<string[]>
    {
        await this.testSteps.LogInfo('Retrieving deleted elements from comparison');
        const deletedElements = await this.page.locator('del').allTextContents();
        return deletedElements;
    }

    // get inserted content (marked with <ins>)
    async getInsertedElements(): Promise<string[]>
    {
        await this.testSteps.LogInfo('Retrieving inserted elements from comparison');
        const insertedElements = await this.page.locator('ins').allTextContents();
        return insertedElements;
    }

    // verify no changes message (when nothing differs)
    async verifyNoChangesMessage()
    {
        await this.testSteps.LogInfo('Verifying no changes message if content is identical');
        const noChangesMessage = this.page.getByText('No changes', { exact: false });
        await expect(noChangesMessage).toBeVisible();
    }

    // comprehensive comparison verification
    async verifyAllComparisons()
    {
        await this.compareFeaturePageURLCheck();
        await this.verifyComparisonHeader();
        await this.verifyCompareFeature();
    }
}
