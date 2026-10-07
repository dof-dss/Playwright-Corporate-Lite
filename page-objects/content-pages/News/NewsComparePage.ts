import { Page, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export class NewsComparePage
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

    // check url after saving create news
    async newsNodeURLCheck()
    {
        // escapeRegex removes all white space and replaces with '-', where '-' already exists and surrounded by 
        // white space it will just remove surrounding white space and converts all characters to lower case.
        const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();
        await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/articles/${this.testSetUpData.contentTitleforTest.contentTitle}"`);

        await expect(this.page).toHaveURL(
            new RegExp(this.testSetUpData.urlForTest.url + `/newss/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)}$`)
        );
    }

    // -------------------- Verify News methods --------------------

    //verify news when being compared method
    async verifyCompareNews()
    {
        //-------------------- TITLE --------------------
        await this.testSteps.LogInfo('Verifying "New" text has been removed from the title');
        await expect(this.page.locator('//h1[contains(text(),"Automated Test - ")]/del[text()="New"]')).toBeVisible();

        await this.testSteps.LogInfo('Verifying "Edited" text has been added to the title');
        await expect(this.page.locator('//h1[contains(text(),"Automated Test - ")]/ins[text()="Edited"]')).toBeVisible();

        //-------------------- TOPICS --------------------
        ///
        //
        // ------------------ ADD TOPICS WHEN FIXED - CURRENTLY A BUG  ------------------
        //
        ///

        //-------------------- SUMMARY --------------------
        await this.testSteps.LogInfo('Verifying "new" text has been removed from the summary');
        await expect(this.page.locator('//div[@class="page-summary"]/del[text()="new"]')).toBeVisible();

        await this.testSteps.LogInfo('Verifying "edited" text has been added to the summary');
        await expect(this.page.locator('//div[@class="page-summary"]/ins[text()="edited"]')).toBeVisible();

        //-------------------- BODY FIELD --------------------
        await this.testSteps.LogInfo('Verifying "new" text has been removed from the body field');
        await expect(this.page.locator('//div[@class="page-summary"]/following-sibling::p/del[text()="new"]')).toBeVisible();

        await this.testSteps.LogInfo('Verifying "edited" text has been added to the body field');
        await expect(this.page.locator('//div[@class="page-summary"]/following-sibling::p/ins[text()="edited"]')).toBeVisible();

        //-------------------- GLOBAL TOPICS --------------------
        await this.testSteps.LogInfo('Verifying "Employment" has been removed from the global topics');
        await expect(this.page.locator('//div[text()="Global topics"]/following-sibling::div//del/a[text()="Employment"]')).toBeVisible();

        await this.testSteps.LogInfo('Verifying "Energy" has been added to the global topics');
        await expect(this.page.locator('//div[text()="Global topics"]/following-sibling::div//ins/a[text()="Energy"]')).toBeVisible();

        //-------------------- TOPICS --------------------
        await this.testSteps.LogInfo('Verifying "Actions to Protect our Environment" has been removed from the topics');
        await expect(this.page.locator('//div[text()="Topics"]/following-sibling::div//del/a[text()="Actions to Protect our Environment"]')).toBeVisible();

        await this.testSteps.LogInfo('Verifying "Animal Health, Welfare and Trade" has been added to the topics');
        await expect(this.page.locator('//div[text()="Topics"]/following-sibling::div//ins/a[text()="Animal Health, Welfare and Trade"]')).toBeVisible();

        //-------------------- NEWS TYPE --------------------
        await this.testSteps.LogInfo('Verifying "News story" has been removed from the news type');
        await expect(this.page.locator('//div[text()="News type"]/following-sibling::div//del[text()="News story"]')).toBeVisible();

        await this.testSteps.LogInfo('Verifying "Press release" has been added to the news type');
        await expect(this.page.locator('//div[text()="News type"]/following-sibling::div//ins[text()="Press release"]')).toBeVisible();

        //-------------------- TEASER --------------------
        await this.testSteps.LogInfo('Verifying "new news teaser" has been removed from the teaser');
        await expect(this.page.locator('//div[text()="Teaser"]/following-sibling::div//del[text()="new"]')).toBeVisible();

        await this.testSteps.LogInfo('Verifying "edited news teaser" has been added to the teaser');
        await expect(this.page.locator('//div[text()="Teaser"]/following-sibling::div//ins[text()="edited"]')).toBeVisible();
    }
}