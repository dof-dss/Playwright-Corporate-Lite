import { Page, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestSetUpData, TestData, galleryImageDetails } from '../../../test-data/TestDataObject';

export class GalleryComparePage
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

    // check url after saving create gallery
    async galleryNodeURLCheck()
    {
        // escapeRegex removes all white space and replaces with '-', where '-' already exists and surrounded by 
        // white space it will just remove surrounding white space and converts all characters to lower case.
        const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();

        await expect(this.page).toHaveURL(
            new RegExp(this.testSetUpData.urlForTest.url + `/gallerys/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)}$`)
        );
    }

    // -------------------- Verify Gallery methods --------------------

    //verify gallery when being compared method
    async verifyCompareGallery()
    {
        //-------------------- TITLE --------------------
        await this.testSteps.LogInfo('Verifying "New" text has been removed from the title');
        await expect(this.page.locator('//a[contains(text(),"Automated Test - ")]/del[text()="New"]')).toBeVisible();

        await this.testSteps.LogInfo('Verifying "Edited" text has been added to the title');
        await expect(this.page.locator('//a[contains(text(),"Automated Test - ")]/ins[text()="Edited"]')).toBeVisible();

        //-------------------- TOPICS --------------------
        ///
        //
        // ------------------ ADD TOPICS WHEN FIXED - CURRENTLY A BUG  ------------------
        //
        ///

        //-------------------- SUMMARY --------------------
        await this.testSteps.LogInfo('Verifying "new" text has been removed from the summary');
        await expect(this.page.locator('//div[@class="page-summary"]//del[text()="new"]')).toBeVisible();

        await this.testSteps.LogInfo('Verifying "edited" text has been added to the summary');
        await expect(this.page.locator('//div[@class="page-summary"]//ins[text()="edited"]')).toBeVisible();

        //-------------------- BODY FIELD --------------------
        await this.testSteps.LogInfo('Verifying "new" text has been removed from the body field');
        await expect(this.page.locator('//div[@class="page-summary"]/following-sibling::p//del[text()="new"]')).toBeVisible();

        await this.testSteps.LogInfo('Verifying "edited" text has been added to the body field');
        await expect(this.page.locator('//div[@class="page-summary"]/following-sibling::p//ins[text()="edited"]')).toBeVisible();

        //-------------------- GALLERY IMAGES  --------------------
        const details = galleryImageDetails;

        if (details.length > 0)
        {
            for (let i = 0; i < details.length; i++)
            {
                const values = details[i];

                await this.testSteps.LogInfo(`Verifying gallery image: ${values.title} is in the del column`);
                await expect(this.page.locator(`//del[(contains(@class,'diff'))]//img[@title="${values.title}"]`)).toBeVisible();
            }
        }

        await this.testSteps.LogInfo('Verifying new image is in the ins column');
        await expect(this.page.locator('//ins[@class="diffmod diffimg diffsrc"]/img')).toBeVisible();

    }
}