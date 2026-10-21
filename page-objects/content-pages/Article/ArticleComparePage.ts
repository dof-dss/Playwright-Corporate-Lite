import { Page, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export class ArticleComparePage
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

    // check url after saving create article
    async articleNodeURLCheck() 
    {
        // escapeRegex removes all white space and replaces with '-', where '-' already exists and surrounded by 
        // white space it will just remove surrounding white space and converts all characters to lower case.
        const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();
        await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/articles/${this.testSetUpData.contentTitleforTest.contentTitle}"`);

        await expect(this.page).toHaveURL(
            new RegExp(this.testSetUpData.urlForTest.url + `/article/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)}$`)
        );
    }

    // -------------------- Verify Article methods --------------------

    //verify article when being compared method
    async verifyCompareArticle()
    {
        //-------------------- TITLE --------------------
        const articleTitle = this.page.locator('//h2//a//span');
        await this.testSteps.LogInfo('Verifying "New" text has been removed from the title');
        await expect(articleTitle.locator('del')).toHaveText('New');

        await this.testSteps.LogInfo('Verifying "Edited" text has been added to the title');
        await expect(articleTitle.locator('ins')).toHaveText('Edited');

        //-------------------- SUMMARY --------------------
        const articleSummary = this.page.locator('p.field-summary');
        await this.testSteps.LogInfo('Verifying "new" text has been removed from Summary');
        await expect(articleSummary.locator('del')).toHaveText('new');

        await this.testSteps.LogInfo('Verifying "edited" text has been added to Summary');
        await expect(articleSummary.locator('ins')).toHaveText('edited');

        //-------------------- BODY FIELD --------------------
        const articleBody = this.page.locator('//p[contains(normalize-space(.), "article body content")]');
        await this.testSteps.LogInfo('Verifying "new" text has been removed from Body section');
        await expect(articleBody.locator('del')).toHaveText('new');

        await this.testSteps.LogInfo('Verifying "edited" text has been added to Body section');
        await expect(articleBody.locator('ins')).toHaveText('edited');

        //-------------------- Area of Expertise --------------------
        const areaOfExpertiseList = this.page.locator('//span[contains(@class,"site-topics--label") and normalize-space(.)="Areas of Expertise:"]/following-sibling::span[contains(@class,"site-topics--list")]');
        await this.testSteps.LogInfo(`Verifying "${this.testData.Article.areaOfExpertise}" has been removed from Area of Expertise`);
        await expect(areaOfExpertiseList.locator('.site-topics--item a del')).toHaveText(this.testData.Article.areaOfExpertise);

        await this.testSteps.LogInfo(`Verifying "${this.testData.Article.areaOfExpertise2}" has been removed from Area of Expertise`);
        await expect(areaOfExpertiseList.locator('.site-topics--item del a')).toHaveText(this.testData.Article.areaOfExpertise2);

        await this.testSteps.LogInfo(`Verifying "${this.testData.Article.areaOfExpertise2Edited}" has been added to Area of Expertise`);
        await expect(areaOfExpertiseList.locator('.site-topics--item ins a')).toHaveText(this.testData.Article.areaOfExpertise2Edited);


        //-------------------- SERVICE --------------------
        const serviceList = this.page.locator('//span[contains(@class,"site-topics--label") and normalize-space(.)="Service:"]/following-sibling::span[contains(@class,"site-topics--list")]');
        await this.testSteps.LogInfo(`Verifying "${this.testData.Article.service}" has been removed from Service`);
        await expect(serviceList.locator('.site-topics--item del a')).toHaveText(this.testData.Article.service);

        await this.testSteps.LogInfo(`Verifying "${this.testData.Article.serviceEdited}" has been added to Service`);
        await expect(serviceList.locator('.site-topics--item ins a')).toHaveText(this.testData.Article.serviceEdited);

        await this.testSteps.LogInfo(`Verifying unchanged service "${this.testData.Article.service2}" remains visible`);
        await expect(serviceList.getByRole('link', { name: this.testData.Article.service2, exact: true })).toBeVisible();
    }



    //verify article when being compared method
    async verifyCompareGallery()
    {
        //-------------------- TITLE --------------------
        await this.testSteps.LogInfo('Verifying "New" text has been removed from Title');
        await expect(this.page.locator('//a[contains(text(),"Automated Test - ")]/del[text()="New"]')).toBeVisible();

        await this.testSteps.LogInfo('Verifying "Edited" text has been added to Title');
        await expect(this.page.locator('//a[contains(text(),"Automated Test - ")]/ins[text()="Edited"]')).toBeVisible();

        //-------------------- TOPICS --------------------
        ///
        //
        // ------------------ ADD TOPICS WHEN FIXED - CURRENTLY A BUG  ------------------
        //
        ///

        //-------------------- SUMMARY --------------------
        await this.testSteps.LogInfo('Verifying "new" text has been removed from Summary');
        await expect(this.page.locator('//div[@class="page-summary"]/del[text()="new"]')).toBeVisible();

        await this.testSteps.LogInfo('Verifying "edited" text has been added to Summary');
        await expect(this.page.locator('//div[@class="page-summary"]/ins[text()="edited"]')).toBeVisible();

        //-------------------- BODY FIELD --------------------
        await this.testSteps.LogInfo('Verifying "new" text has been removed from Body field');
        await expect(this.page.locator('//div[@class="page-summary"]/following-sibling::p/del[text()="new"]')).toBeVisible();

        await this.testSteps.LogInfo('Verifying "edited" text has been added to Body field');
        await expect(this.page.locator('//div[@class="page-summary"]/following-sibling::p/ins[text()="edited"]')).toBeVisible();

        //-------------------- GLOBAL TOPICS --------------------
        await this.testSteps.LogInfo('Verifying "Employment" has been removed from Global topics');
        await expect(this.page.locator('//div[text()="Global topics"]/following-sibling::div//del/a[text()="Employment"]')).toBeVisible();

        await this.testSteps.LogInfo('Verifying "Energy" has been added to Global topics');
        await expect(this.page.locator('//div[text()="Global topics"]/following-sibling::div//ins/a[text()="Energy"]')).toBeVisible();
    }
}