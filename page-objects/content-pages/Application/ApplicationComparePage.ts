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

        //-------------------- BEFORE YOU START --------------------
        await this.testSteps.LogInfo('Verifying "new" text has been removed from Before You Start section');
        await expect(this.page.locator('//text()[normalize-space()="application before you start"]//preceding-sibling::del[text()="new"]')).toBeVisible();

        await this.testSteps.LogInfo('Verifying "edited" text has been added to Before You Start section');
        await expect(this.page.locator('//text()[normalize-space()="application before you start"]//preceding-sibling::ins[text()="edited"]')).toBeVisible();

        //-------------------- LINKS --------------------
        await this.testSteps.LogInfo('Verifying Initial Link is present in a "Del" tag but still clickable when comparing revision');
        await expect(this.page.locator(`//div[@class="launch-service"]/del/a[text()="${this.testData.Application.LinkText}"]`)).toBeVisible();

        await this.testSteps.LogInfo(`Clicking Initial Application link text "${this.testData.Application.LinkText}"`);
        await this.page.getByRole('link', { name: this.testData.Application.LinkText }).click();

        await this.testSteps.LogInfo(`Verifying Link Title ("${this.testData.Application.LinkURL}") is present when clicked`);
        await expect(this.page.getByRole('heading', { level: 1 })).toHaveText(this.testData.Application.LinkURL);

        await this.testSteps.LogInfo('Navigating back to previous page');
        await this.page.goBack();

        await this.testSteps.LogInfo('Verifying New Link is present in a "Ins" when comparing revision ');
        await expect(this.page.locator(`//div[@class="launch-service"]/ins/a[text()="${this.testData.Application.LinkTextEdited}"]`)).toBeVisible();

        const pagePromise = this.page.context().waitForEvent('page');
        await this.testSteps.LogInfo(`Clicking New Application link text "${this.testData.Application.LinkTextEdited}"`);
        await this.page.getByRole('link', { name: this.testData.Application.LinkTextEdited }).click();

        const newTab = await pagePromise;
        await this.testSteps.LogInfo(`Verifying Link URL ("${this.testData.Application.LinkURLEdited}") is present when clicked`);
        await expect(newTab).toHaveURL(this.testData.Application.LinkURLEdited);

        // close new tab
        await this.testSteps.LogInfo(`Closing new tab`);
        await newTab.close();

        //-------------------- ADDITIONAL INFORMATION --------------------
        await this.testSteps.LogInfo('Verifying "new" text has been removed from Additional Information');
        await expect(this.page.locator('//h2[text()="Additional information"]/following-sibling::p/del[text()="new"]')).toBeVisible();

        await this.testSteps.LogInfo('Verifying "edited" text has been added to Additional Information');
        await expect(this.page.locator('//h2[text()="Additional information"]/following-sibling::p/ins[text()="edited"]')).toBeVisible();

        //-------------------- GLOBAL TOPICS --------------------
        await this.testSteps.LogInfo('Verifying "Employment"  has been removed from Global Topics');
        await expect(this.page.locator('//div[text()="Global topics"]/following-sibling::div//del/a[text()="Employment"]')).toBeVisible();

        await this.testSteps.LogInfo('Verifying "Energy"  has been added to Global Topics');
        await expect(this.page.locator('//div[text()="Global topics"]/following-sibling::div//ins/a[text()="Energy"]')).toBeVisible();
    }
}