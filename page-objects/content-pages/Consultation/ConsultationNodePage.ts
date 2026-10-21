import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { expect } from '@playwright/test';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export interface VerifyOptions
{
    preview: boolean;
};

export class ConsultationNodePage
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

    // check url after saving create consultation
    async consultationNodeURLCheck()
    {
        // escapeRegex removes all white space and replaces with '-', where '-' already exists and surrounded by 
        // white space it will just remove surrounding white space and converts all characters to lower case.
        const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();

        await this.testSteps.LogInfo(`Verifying URL path is /consultations/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)} with optional -suffix and optional trailing path, or is /node/.+/latest`);
        await expect(this.page).toHaveURL(
            new RegExp(`(?:${this.testSetUpData.urlForTest.url}/consultations/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)}(?:-[^/]+)?(?:/.*)?$)|(?:/node/.+/latest)`)
        );
    }

    // -------------------- Verify Consultation methods --------------------

    //verify consultation method
    async verifyConsultation({ preview }: VerifyOptions)
    {
        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testData.Consultation.title}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.Consultation.title);

        await this.testSteps.LogInfo('Verifying Topics and selected values are visible');
        await expect(this.page.getByText('Topics:', { exact: true })).toBeVisible();
        await expect(this.page.getByRole('link', { name: this.testData.Consultation.consultationSiteTopic, exact: true })).toBeVisible();
        await expect(this.page.getByRole('link', { name: this.testData.Consultation.consultationSiteTopic2, exact: true })).toBeVisible();

        // verify consultation Opens box
        await this.testSteps.LogInfo('Verifying "Consultation Open" is visible');
        await expect(this.page.getByText('Consultation Open', { exact: true })).toBeVisible();
        // verify consultation closes date time
        await this.testSteps.LogInfo(`Verifying consultation opened "${this.testData.Consultation.verifyStartDateAndTime}" and closes "${this.testData.Consultation.verifyEndDateAndTime}"`);
        await expect(this.page.getByText(`Consultation opened ${this.testData.Consultation.verifyStartDateAndTime.replace('.', ':')} and closes ${this.testData.Consultation.verifyEndDateAndTime.replace('.', ':')}.`, { exact: true })).toBeVisible();

        // verify summary
        await this.testSteps.LogInfo(`Verifying Summary "${this.testData.Consultation.summary}" is visible`);
        await expect(this.page.getByText(this.testData.Consultation.summary)).toBeVisible();

        // verify body field
        await this.testSteps.LogInfo(`Verifying Body "${this.testData.Consultation.body}" is visible`);
        await expect(this.page.getByText(this.testData.Consultation.body)).toBeVisible();

        // verify documents section is visible
        await this.testSteps.LogInfo('Verifying Documents heading is visible');
        await expect(this.page.getByRole('heading', { name: 'Documents', exact: true })).toBeVisible();
        await this.testSteps.LogInfo(`Verifying attachment "${this.testData.Media.attachmentName}" is visible`);
        await expect(this.page.locator('a.file-link.file--ico__pdf').filter({ hasText: this.testData.Media.attachmentName })).toBeVisible();
        await this.testSteps.LogInfo('Verifying Help viewing documents link is visible');
        await expect(this.page.getByRole('link', { name: 'Help viewing documents', exact: true })).toBeVisible();

        // verify ways to respond section is visible
        await this.testSteps.LogInfo('Verifying Ways to Respond heading is visible');
        await expect(this.page.getByRole('heading', { name: 'Ways to Respond', exact: true })).toBeVisible();

        await this.testSteps.LogInfo('Verifying Respond Online link is visible');
        await expect(this.page.locator('.respond-online a.btn').filter({ hasText: 'Respond Online' })).toBeVisible();

        if (!preview)
        {
            // Only clicking on Link when content has been saved as unable to click to naviagte to it when in preview
            // Start waiting for the new tab before the click
            const pagePromise = this.page.context().waitForEvent('page');

            // click application link text
            await this.testSteps.LogInfo('Clicking Link text "Respond online"');
            await this.page.locator('.respond-online a.btn').filter({ hasText: 'Respond Online' }).click();

            // Wait for the new page object to be ready
            const newTab = await pagePromise;

            // verify link by checking url of new page 
            await this.testSteps.LogInfo(`Verifying title of content on new tab "${this.testData.Consultation.respondeOnline}" is visible`);
            await expect(newTab.locator(`//h1[normalize-space(.)="${this.testData.Consultation.respondeOnline}"]`)).toBeVisible();

            // close new tab
            await this.testSteps.LogInfo('Navigating back to previous page');
            await newTab.close();
        }

        // verify email field
        await this.testSteps.LogInfo(`Verifying Email address "${this.testData.Consultation.emailAddress}" is visible`);
        await expect(this.page.getByText('Email Address:', { exact: true })).toBeVisible();
        await expect(this.page.getByRole('link', { name: this.testData.Consultation.emailAddress, exact: true })).toBeVisible();
        await expect(this.page.getByRole('link', { name: this.testData.Consultation.emailAddress, exact: true })).toHaveAttribute('href', `mailto:${this.testData.Consultation.emailAddress}`);

        // verify Post address
        await this.testSteps.LogInfo(`Verifying Postal address "${this.testData.Consultation.postalAddress}" is visible`);
        await expect(this.page.getByText('Write to:', { exact: true })).toBeVisible();
        await expect(this.page.getByText(this.testData.Consultation.postalAddress)).toBeVisible();

    }

    //verify edited consultation method
    async verifyEditedConsultation(_: VerifyOptions)
    {
        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testData.Consultation.titleEdited}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.Consultation.titleEdited);

        await this.testSteps.LogInfo('Verifying topics value are visible');
        await expect(this.page.getByText('Topics:', { exact: true })).toBeVisible();
        await expect(this.page.getByRole('link', { name: this.testData.Consultation.consultationSiteTopicEdited, exact: true })).toBeVisible();
        await expect(this.page.getByRole('link', { name: this.testData.Consultation.consultationSiteTopic2Edited, exact: true })).toBeHidden();

        // verify consultation Closed box
        await this.testSteps.LogInfo('Verifying "Consultation Closed" is visible');
        await expect(this.page.getByText('Consultation Closed', { exact: true })).toBeVisible();
        // verify consultation opens date time
        await this.testSteps.LogInfo(`Verifying consultation opened "${this.testData.Consultation.verifyEditedStartDateAndTime}" and closed "${this.testData.Consultation.verifyEditedEndDateAndTime}"`);
        await expect(this.page.getByText(`Consultation opened ${this.testData.Consultation.verifyEditedStartDateAndTime.replace('.', ':')} and closed ${this.testData.Consultation.verifyEditedEndDateAndTime.replace('.', ':')}.`, { exact: true })).toBeVisible();

        // verify summary
        await this.testSteps.LogInfo(`Verifying Summary "${this.testData.Consultation.summaryEdited}" is visible`);
        await expect(this.page.getByText(this.testData.Consultation.summaryEdited)).toBeVisible();

        // verify body field
        await this.testSteps.LogInfo(`Verifying Body "${this.testData.Consultation.bodyEdited}" is visible`);
        await expect(this.page.getByText(this.testData.Consultation.bodyEdited)).toBeVisible();

        // verify documents section
        await this.testSteps.LogInfo('Verifying Documents heading is visible');
        await expect(this.page.getByRole('heading', { name: 'Documents', exact: true })).toBeVisible();

        await this.testSteps.LogInfo(`Verifying edited attachment "${this.testData.Media.attachmentNameEdited}" is visible`);
        await expect(this.page.locator('a.file-link.file--ico__pdf').filter({ hasText: this.testData.Media.attachmentNameEdited })).toBeVisible();


        await this.testSteps.LogInfo('Verifying Help viewing documents link is visible');
        await expect(this.page.getByRole('link', { name: 'Help viewing documents', exact: true })).toBeVisible();

        // verify ways to respond section is hidden as consultation is closed
        await this.testSteps.LogInfo('Verifying Ways to Respond and Respond Online are hidden');
        await expect(this.page.getByRole('heading', { name: 'Ways to Respond', exact: true })).toBeHidden();
        await expect(this.page.locator('.respond-online a.btn').filter({ hasText: 'Respond Online' })).toBeHidden();

        await this.testSteps.LogInfo(`Verifying edited email address "${this.testData.Consultation.emailAddressEdited}" is hidden`);
        await expect(this.page.getByText('Email Address:', { exact: true })).toBeHidden();
        await expect(this.page.getByRole('link', { name: this.testData.Consultation.emailAddressEdited, exact: true })).toBeHidden();

        await this.testSteps.LogInfo(`Verifying edited postal address "${this.testData.Consultation.postalAddressEdited}" is hidden`);
        await expect(this.page.getByText('Write to:', { exact: true })).toBeHidden();
        await expect(this.page.getByText(this.testData.Consultation.postalAddressEdited, { exact: true })).toBeHidden();
    }

    //verify consultation method
    async verifyFutureConsultation({ preview }: VerifyOptions)
    {
        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testData.Consultation.title}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.Consultation.title);

        await this.testSteps.LogInfo('Verifying Topics and selected values are visible');
        await expect(this.page.getByText('Topics:', { exact: true })).toBeVisible();
        await expect(this.page.getByRole('link', { name: this.testData.Consultation.consultationSiteTopic, exact: true })).toBeVisible();
        await expect(this.page.getByRole('link', { name: this.testData.Consultation.consultationSiteTopic2, exact: true })).toBeVisible();

        // verify consultation Opens box
        await this.testSteps.LogInfo('Verifying "Consultation Open" is visible');
        await expect(this.page.getByText('Consultation Open', { exact: true })).toBeVisible();

        // verify consultation opens date time
        await this.testSteps.LogInfo(`Verifying consultation opened "${this.testData.Consultation.verifyFutureStartDate}" and closes "${this.testData.Consultation.verifyEndDateAndTime}"`);
        await expect(this.page.getByText(`Consultation opened ${this.testData.Consultation.verifyFutureStartDate.replace('.', ':')} and closes ${this.testData.Consultation.verifyEndDateAndTime.replace('.', ':')}.`, { exact: true })).toBeVisible();

        // verify summary
        await this.testSteps.LogInfo(`Verifying Summary "${this.testData.Consultation.summary}" is visible`);
        await expect(this.page.getByText(this.testData.Consultation.summary)).toBeVisible();

        // verify body field
        await this.testSteps.LogInfo(`Verifying Body "${this.testData.Consultation.body}" is visible`);
        await expect(this.page.getByText(this.testData.Consultation.body)).toBeVisible();

        // verify documents section is visible
        await this.testSteps.LogInfo('Verifying Documents heading is visible');
        await expect(this.page.getByRole('heading', { name: 'Documents', exact: true })).toBeVisible();
        await this.testSteps.LogInfo(`Verifying attachment "${this.testData.Media.attachmentName}" is visible`);
        await expect(this.page.locator('a.file-link.file--ico__pdf').filter({ hasText: this.testData.Media.attachmentName })).toBeVisible();
        await this.testSteps.LogInfo('Verifying Help viewing documents link is visible');
        await expect(this.page.getByRole('link', { name: 'Help viewing documents', exact: true })).toBeVisible();

        // verify ways to respond section is hidden as consultation is closed
        await this.testSteps.LogInfo('Verifying Ways to Respond and Respond Online are hidden');
        await expect(this.page.getByRole('heading', { name: 'Ways to Respond', exact: true })).toBeHidden();
        await expect(this.page.locator('.respond-online a.btn').filter({ hasText: 'Respond Online' })).toBeHidden();

        await this.testSteps.LogInfo(`Verifying edited email address "${this.testData.Consultation.emailAddressEdited}" is hidden`);
        await expect(this.page.getByText('Email Address:', { exact: true })).toBeHidden();
        await expect(this.page.getByRole('link', { name: this.testData.Consultation.emailAddressEdited, exact: true })).toBeHidden();

        await this.testSteps.LogInfo(`Verifying edited postal address "${this.testData.Consultation.postalAddressEdited}" is hidden`);
        await expect(this.page.getByText('Write to:', { exact: true })).toBeHidden();
        await expect(this.page.getByText(this.testData.Consultation.postalAddressEdited, { exact: true })).toBeHidden();
    }
}