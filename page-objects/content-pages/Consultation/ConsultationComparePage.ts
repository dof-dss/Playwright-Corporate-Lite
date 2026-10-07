import { Page, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export class ConsultationComparePage
{
    // logging
    private readonly testSteps: TestSteps;

    // constructor
    constructor
        (
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

    // check url after saving create consultation
    async consultationNodeURLCheck()
    {
        // escapeRegex removes all white space and replaces with '-', where '-' already exists and surrounded by 
        // white space it will just remove surrounding white space and converts all characters to lower case.
        const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();
        await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/consultations/${this.testSetUpData.contentTitleforTest.contentTitle}"`);

        await expect(this.page).toHaveURL(
            new RegExp(this.testSetUpData.urlForTest.url + `/consultations/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)}$`)
        );
    }

    // -------------------- Verify Consultation methods --------------------

    //verify consultation when being compared method
    async verifyCompareConsultation()
    {
        //-------------------- TITLE --------------------
        await this.testSteps.LogInfo('Verifying "New" text has been removed from the title');
        await expect(this.page.locator('//a[contains(text(),"Automated Test - ")]/del[text()="New"]')).toBeVisible();

        await this.testSteps.LogInfo('Verifying "Edited" text has been added to the title');
        await expect(this.page.locator('//a[contains(text(),"Automated Test - ")]/ins[text()="Edited"]')).toBeVisible();

        //-------------------- DATE --------------------
        await this.testSteps.LogInfo(`Verifying "${this.testData.Consultation.verifyStartDate} ${this.testData.Consultation.verifyEndDate}" has been removed from the date`);
        await expect(this.page.locator(`//del[text()="${this.testData.Consultation.verifyStartDate} ${this.testData.Consultation.verifyEndDate}"]`)).toBeVisible();

        await this.testSteps.LogInfo('Verifying "2025-12-31" has been added to the date');
        await expect(this.page.locator('//ins[text()="31 December 2025 31 December 2025"]')).toBeVisible();

        //-------------------- SUMMARY --------------------
        await this.testSteps.LogInfo('Verifying "new" text has been removed from Summary');
        await expect(this.page.locator('//p[contains(normalize-space(.), "consultation summary")]//del[normalize-space(.)="new"]')).toBeVisible();

        await this.testSteps.LogInfo('Verifying "edited" text has been added to Summary');
        await expect(this.page.locator('//p[contains(normalize-space(.), "consultation summary")]//ins[normalize-space(.)="edited"]')).toBeVisible();


        //-------------------- DOCUMENTS --------------------
        await this.testSteps.LogInfo(`Verifying "${this.testData.Media.attachmentName}" has been removed from the date`);
        await expect(this.page.locator(`//del/a[text()[normalize-space(.)="${this.testData.Media.attachmentName}"]]`)).toBeVisible();

        await this.testSteps.LogInfo(`Verifying "${this.testData.Media.attachmentNameEdited}" has been added to the date`);
        await expect(this.page.locator(`//ins/a[text()[normalize-space(.)="${this.testData.Media.attachmentNameEdited}"]]`)).toBeVisible();

        //-------------------- BODY FIELD --------------------
        await this.testSteps.LogInfo('Verifying "new" text has been removed from Body field');
        await expect(this.page.locator('//p[contains(normalize-space(.), "consultation body field")]//del[normalize-space(.)="new"]')).toBeVisible();

        await this.testSteps.LogInfo('Verifying "edited" text has been added to Body field');
        await expect(this.page.locator('//p[contains(normalize-space(.), "consultation body field")]//ins[normalize-space(.)="edited"]')).toBeVisible();

        //-------------------- Email --------------------
        await this.testSteps.LogInfo(`Verifying "${this.testData.Consultation.emailAddress}" has been removed from the date`);
        await expect(this.page.locator(`//div[text()="Email:"]/following-sibling::address//del/a[text()="${this.testData.Consultation.emailAddress}"]`)).toBeVisible();

        await this.testSteps.LogInfo(`Verifying "${this.testData.Consultation.emailAddressEdited}" has been added to the date`);
        await expect(this.page.locator(`//div[text()="Email:"]/following-sibling::address//ins/a[text()="${this.testData.Consultation.emailAddressEdited}"]`)).toBeVisible();

        //-------------------- WRITE TO--------------------
        await this.testSteps.LogInfo(`Verifying "${this.testData.Consultation.postalAddress}" has been removed from the date`);
        await expect(this.page.locator(`//div[text()="Write to:"]/following-sibling::address//del[text()="${this.testData.Consultation.postalAddress}"]`)).toBeVisible();

        await this.testSteps.LogInfo(`Verifying "${this.testData.Consultation.postalAddressEdited}" has been added to the date`);
        await expect(this.page.locator(`//div[text()="Write to:"]/following-sibling::address//ins[text()="${this.testData.Consultation.postalAddressEdited}"]`)).toBeVisible();

         //-------------------- PUBLISHED DATE--------------------
        await this.testSteps.LogInfo(`Verifying "${this.testData.Consultation.verifyStartDate}" has been removed from the date`);
        await expect(this.page.locator(`//div[text()="Published date"]/following-sibling::div//del[text()="${this.testData.Consultation.verifyStartDate}"]`)).toBeVisible();

        await this.testSteps.LogInfo(`Verifying "31 December 2025" has been added to the date`);
        await expect(this.page.locator(`//div[text()="Published date"]/following-sibling::div//ins[text()="31 December 2025"]`)).toBeVisible();

        //-------------------- GLOBAL TOPICS --------------------
        await this.testSteps.LogInfo('Verifying "Employment"  has been removed from global topics');
        await expect(this.page.locator('//div[text()="Global topics"]/following-sibling::div//del/a[text()="Employment"]')).toBeVisible();

        await this.testSteps.LogInfo('Verifying "Environment" has been added to global topics');
        await expect(this.page.locator('//div[text()="Global topics"]/following-sibling::div//ins/a[text()="Environment"]')).toBeVisible();

         //-------------------- TOPICS --------------------
        await this.testSteps.LogInfo('Verifying "Energy" has been removed from the topics');
        await expect(this.page.locator('//div[text()="Topics"]/following-sibling::div//del/a[text()="Energy"]')).toBeVisible();

        await this.testSteps.LogInfo('Verifying "Tourism" has been added to the topics');
        await expect(this.page.locator('//div[text()="Topics"]/following-sibling::div//ins/a[text()="Tourism"]')).toBeVisible();
    }
}