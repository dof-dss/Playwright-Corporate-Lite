import { Page, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export class ApplicationComparePage 
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

    // check url after saving create application
    async applicationNodeURLCheck()
    {
        // escapeRegex removes all white space and replaces with '-', where '-' already exists and surrounded by 
        // white space it will just remove surrounding white space and converts all characters to lower case.
        const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();
        await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/Services/${this.testSetUpData.contentTitleforTest.contentTitle}"`);

        await expect(this.page).toHaveURL(
            new RegExp(this.testSetUpData.urlForTest.url + `/services/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)}$`)
        );
    }

    // -------------------- Verify Application methods --------------------

    //verify application when being compared method
    async verifyCompareApplication()
    {
        //-------------------- TITLE --------------------
        const applicationTitle = this.page.locator('//h2//a//span');
        await this.testSteps.LogInfo('Verifying "New" text has been removed from Title');
        await expect(applicationTitle.locator('del')).toHaveText('New');

        await this.testSteps.LogInfo('Verifying "Edited" text has been added to Title');
        await expect(applicationTitle.locator('ins')).toHaveText('Edited');

      
        //-------------------- SUMMARY --------------------
        const applicationSummary = this.page.locator('p.field-summary');
        await this.testSteps.LogInfo('Verifying "new" text has been removed from Summary');
        await expect(applicationSummary.locator('del')).toHaveText('new');

        await this.testSteps.LogInfo('Verifying "edited" text has been added to Summary');
        await expect(applicationSummary.locator('ins')).toHaveText('edited');

        //-------------------- BEFORE YOU START --------------------
        const applicationBeforeYouStart = this.page.locator('//h2[normalize-space(.)="Before you start"]/following-sibling::p[1]');
        await this.testSteps.LogInfo('Verifying "new" text has been removed from Before You Start section');
        await expect(applicationBeforeYouStart.locator('del')).toHaveText('new');

        await this.testSteps.LogInfo('Verifying "edited" text has been added to Before You Start section');
        await expect(applicationBeforeYouStart.locator('ins')).toHaveText('edited');


        //-------------------- ADDITIONAL INFORMATION --------------------
    const applicationAdditionalInfo = this.page.locator('p').filter({ hasText: 'application additional information' });
        await this.testSteps.LogInfo('Verifying "new" text has been removed from Additional Information');
        await expect(applicationAdditionalInfo.locator('del')).toHaveText('new');

        await this.testSteps.LogInfo('Verifying "edited" text has been added to Additional Information');
        await expect(applicationAdditionalInfo.locator('ins')).toHaveText('edited');

       
     //-------------------- TOPICS --------------------
        const siteTopics = this.page.locator('//span[contains(@class,"site-topics--label") and normalize-space(.)="Site topics:"]/following-sibling::span[contains(@class,"site-topics--list")]');
        await this.testSteps.LogInfo(`Verifying "${this.testData.HSE_SiteTopics.topic}" has been removed from Site topics`);
        await expect(siteTopics.locator('.site-topics--item del a')).toHaveText(this.testData.HSE_SiteTopics.topic);

        await this.testSteps.LogInfo(`Verifying "${this.testData.HSE_SiteTopics.topic2}" has been removed from Site topics`);
        await expect(siteTopics.locator('.site-topics--item a del')).toHaveText(this.testData.HSE_SiteTopics.topic2);

        await this.testSteps.LogInfo(`Verifying "${this.testData.HSE_SiteTopics.topicEdited}" has been added to Site topics`);
        await expect(siteTopics.locator('.site-topics--item ins a')).toHaveText(this.testData.HSE_SiteTopics.topicEdited);
    }
}