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
        const consultationTitle = this.page.locator('//h2//a//span');
        await this.testSteps.LogInfo('Verifying "New" text has been removed from the title');
        await expect(consultationTitle.locator('del')).toHaveText('New');

        await this.testSteps.LogInfo('Verifying "Edited" text has been added to the title');
        await expect(consultationTitle.locator('ins')).toHaveText('Edited');

        //-------------------- DATE --------------------
        await this.testSteps.LogInfo('Verifying "closes" has been removed and "Closed" has been added to the consultation status');
        await expect(this.page.locator('//del[normalize-space(.)="closes"]')).toHaveText('closes');
        await expect(this.page.locator('//ins[normalize-space(.)="Closed"]')).toHaveText('Closed');

        const [oldEndDate, oldEndTime] = this.testData.Consultation.verifyEndDateAndTime.split(', ');
        const [oldHour, oldMinute] = oldEndTime.split(' ')[0].split('.');
        const [newStartDate, newStartTime] = this.testData.Consultation.verifyEditedStartDateAndTime.split(', ');
        const newHour = newStartTime.split('.')[0];
        const [newEndDate, newEndTime] = this.testData.Consultation.verifyEditedEndDateAndTime.split(', ');
        const dateParagraph = this.page.locator('.consultation_dates p').nth(1);
        const removed = dateParagraph.locator('del');
        const added = dateParagraph.locator('ins');

        await this.testSteps.LogInfo('Verifying the consultation date changes');
        await expect(removed.nth(0)).toHaveText(oldEndDate);
        await expect(added.nth(0)).toHaveText(`Consultation opened ${newStartDate}`);
        await expect(removed.nth(1)).toHaveText(oldHour);
        await expect(added.nth(1)).toHaveText(newHour);
        await expect(removed.nth(2)).toHaveText(oldMinute);
        await expect(added.nth(2)).toHaveText(`00 am and closed ${newEndDate}, ${newEndTime.replace('.', ':').split(' ')[0]}`);
        await expect(dateParagraph).toContainText('pm.');

        //-------------------- SUMMARY --------------------
        const consultationSummary = this.page.locator('//p[contains(normalize-space(.), "consultation summary")]');
        await this.testSteps.LogInfo('Verifying "new" text has been removed from Summary');
        await expect(consultationSummary.locator('del')).toHaveText('new');

        await this.testSteps.LogInfo('Verifying "edited" text has been added to Summary');
        await expect(consultationSummary.locator('ins')).toHaveText('edited');

        //-------------------- DOCUMENTS --------------------
        const oldAttachment = this.page.locator(`//del/a[text()[normalize-space(.)="${this.testData.Media.attachmentName}"]]`);
        const newAttachment = this.page.locator(`//ins/a[text()[normalize-space(.)="${this.testData.Media.attachmentNameEdited}"]]`);
        await this.testSteps.LogInfo(`Verifying "${this.testData.Media.attachmentName}" has been removed from the date`);
        await expect(oldAttachment).toHaveText(this.testData.Media.attachmentName);

        await this.testSteps.LogInfo(`Verifying "${this.testData.Media.attachmentNameEdited}" has been added to the date`);
        await expect(newAttachment).toHaveText(this.testData.Media.attachmentNameEdited);

        //-------------------- RESPOND ONLINE --------------------
        const oldRespondOnlinePath = '/publications/competent-authority-guidance-heavy-fuel-oil-hfo';
        const oldRespondOnlineLink = this.page.locator(`//del/a[@href="${oldRespondOnlinePath}"]`);
        await this.testSteps.LogInfo(`Verifying old Respond Online link "${oldRespondOnlinePath}" has been removed`);
        await expect(oldRespondOnlineLink).toHaveText(oldRespondOnlinePath);

        const newRespondOnlineUrl = this.testData.Consultation.respondeOnlineEdited;
        const newRespondOnlineLink = this.page.locator(`//ins/a[@href="${newRespondOnlineUrl}"]`);
        await this.testSteps.LogInfo(`Verifying new Respond Online link "${this.testData.Consultation.respondeOnlineEdited}" has been added`);
        await expect(newRespondOnlineLink).toHaveAttribute('href', newRespondOnlineUrl);
        await expect(newRespondOnlineLink).toContainText(newRespondOnlineUrl);

        //-------------------- BODY FIELD --------------------
        const consultationBody = this.page.locator('//p[contains(normalize-space(.), "consultation body field")]');
        await this.testSteps.LogInfo('Verifying "new" text has been removed from Body field');
        await expect(consultationBody.locator('del')).toHaveText('new');

        await this.testSteps.LogInfo('Verifying "edited" text has been added to Body field');
        await expect(consultationBody.locator('ins')).toHaveText('edited');

        // //-------------------- Email --------------------
        const [oldEmailLocalPart, oldEmailDomain] = this.testData.Consultation.emailAddress.split('@');
        const [newEmailLocalPart] = this.testData.Consultation.emailAddressEdited.split('@');
        const emailValue = this.page.locator('//div[normalize-space(.)="Email address"]/following-sibling::div');

        await this.testSteps.LogInfo(`Verifying old email local part "${oldEmailLocalPart}" has been removed`);
        await expect(this.page.locator(`//div[normalize-space(.)="Email address"]/following-sibling::div/del[normalize-space(.)="${oldEmailLocalPart}"]`)).toBeVisible();
        await this.testSteps.LogInfo(`Verifying new email local part "${newEmailLocalPart}" has been added`);
        await expect(this.page.locator(`//div[normalize-space(.)="Email address"]/following-sibling::div/ins[normalize-space(.)="${newEmailLocalPart}"]`)).toBeVisible();
        await this.testSteps.LogInfo(`Verifying shared email domain "@${oldEmailDomain}" remains visible`);
        await expect(emailValue).toContainText(`@${oldEmailDomain}`);

        //-------------------- WRITE TO--------------------
        await this.testSteps.LogInfo(`Verifying postal address "${this.testData.Consultation.postalAddress}" has been removed`);
        await expect(this.page.locator(`//div[normalize-space(.)="Postal address"]/following-sibling::div/del[normalize-space(.)="${this.testData.Consultation.postalAddress}"]`)).toBeVisible();

        await this.testSteps.LogInfo(`Verifying edited postal address "${this.testData.Consultation.postalAddressEdited}" has been added`);
        await expect(this.page.locator(`//div[normalize-space(.)="Postal address"]/following-sibling::div/ins[normalize-space(.)="${this.testData.Consultation.postalAddressEdited}"]`)).toBeVisible();

        //-------------------- TOPICS --------------------
        await this.testSteps.LogInfo(`Verifying "${this.testData.Consultation.consultationSiteTopic}" has been removed from the topics`);
        await expect(this.page.locator(`//span[contains(@class,"site-topics--label") and normalize-space(.)="Topics:"]/following-sibling::span[contains(@class,"site-topics--list")]//span[contains(@class,"site-topics--item")]/a/del[normalize-space(.)="${this.testData.Consultation.consultationSiteTopic}"]`)).toBeVisible();

        await this.testSteps.LogInfo(`Verifying "${this.testData.Consultation.consultationSiteTopic2}" has been removed from the topics`);
        await expect(this.page.locator(`//span[contains(@class,"site-topics--label") and normalize-space(.)="Topics:"]/following-sibling::span[contains(@class,"site-topics--list")]//span[contains(@class,"site-topics--item")]/del/a[normalize-space(.)="${this.testData.Consultation.consultationSiteTopic2}"]`)).toBeVisible();

        await this.testSteps.LogInfo(`Verifying "${this.testData.Consultation.consultationSiteTopicEdited}" has been added to the topics`);
        await expect(this.page.locator(`//span[contains(@class,"site-topics--label") and normalize-space(.)="Topics:"]/following-sibling::span[contains(@class,"site-topics--list")]//span[contains(@class,"site-topics--item")]/ins/a[normalize-space(.)="${this.testData.Consultation.consultationSiteTopicEdited}"]`)).toBeVisible();
    
    
        //-------------------- PUBLISHED DATE--------------------
        const getPublishedDateParts = (date: string) =>
        {
            const [year, month, day] = date.split('-');
            const weekday = new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', {
                weekday: 'short',
                timeZone: 'UTC',
            });
            return { weekday, day, month, year };
        };
        const oldPublishedDate = getPublishedDateParts(this.testData.Consultation.datePublished);
        const newPublishedDate = getPublishedDateParts(this.testData.Consultation.datePublishedEdited);
        const publishedDateValue = this.page.locator('.published-date span').nth(1);
        const removedPublishedDateParts = publishedDateValue.locator('del');
        const addedPublishedDateParts = publishedDateValue.locator('ins');

        await this.testSteps.LogInfo(`Verifying old published weekday "${oldPublishedDate.weekday}" has been removed`);
        await expect(removedPublishedDateParts.nth(0)).toHaveText(oldPublishedDate.weekday);
        await this.testSteps.LogInfo(`Verifying new published weekday "${newPublishedDate.weekday}" has been added`);
        await expect(addedPublishedDateParts.nth(0)).toHaveText(newPublishedDate.weekday);
        await this.testSteps.LogInfo(`Verifying old published day "${oldPublishedDate.day}" has been removed`);
        await expect(removedPublishedDateParts.nth(1)).toHaveText(oldPublishedDate.day);
        await this.testSteps.LogInfo(`Verifying new published day "${newPublishedDate.day}" has been added`);
        await expect(addedPublishedDateParts.nth(1)).toHaveText(newPublishedDate.day);
        await this.testSteps.LogInfo(`Verifying old published month "${oldPublishedDate.month}" has been removed`);
        await expect(removedPublishedDateParts.nth(2)).toHaveText(oldPublishedDate.month);
        await this.testSteps.LogInfo(`Verifying new published month "${newPublishedDate.month}" has been added`);
        await expect(addedPublishedDateParts.nth(2)).toHaveText(newPublishedDate.month);
        await this.testSteps.LogInfo(`Verifying old published year "${oldPublishedDate.year}" has been removed`);
        await expect(removedPublishedDateParts.nth(3)).toHaveText(oldPublishedDate.year);
        await this.testSteps.LogInfo(`Verifying new published year "${newPublishedDate.year}" has been added`);
        await expect(addedPublishedDateParts.nth(3)).toHaveText(newPublishedDate.year);
        await this.testSteps.LogInfo('Verifying unchanged published time "12:00" remains visible');
        await expect(publishedDateValue).toContainText('12:00');
    }
}
