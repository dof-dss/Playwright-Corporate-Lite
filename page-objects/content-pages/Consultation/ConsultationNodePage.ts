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
        // verify consultation open 
        await this.testSteps.LogInfo('Verifying "Open consultation" text is present');
        await expect(this.page.locator('//span[contains(text(), "Open consultation")]')).toBeVisible();

        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testData.Consultation.title}" is visible`);
        await expect(this.page.locator(`//h1[text()[normalize-space(.)="${this.testData.Consultation.title}"]]`)).toBeVisible();

        // verify consultation closes box
        await this.testSteps.LogInfo('Verifying "Consultation closes" text is present');
        await expect(this.page.locator('//p/strong[contains(text(), "Consultation closes")]')).toBeVisible();

        // verify consultation closes date time
        await this.testSteps.LogInfo(`Verifying Consultaiton Closes date amd time "${this.testData.Consultation.verifyEndDateAndTime}" is visible`);
        await expect(this.page.locator(`//p[text()[normalize-space(.)="${this.testData.Consultation.verifyEndDateAndTime}"]]`)).toBeVisible();

        // verify summary
        await this.testSteps.LogInfo(`Verifying Summary "${this.testData.Consultation.summary}" is visible`);
        await expect(this.page.getByText(this.testData.Consultation.summary)).toBeVisible();

        // verify body field
        await this.testSteps.LogInfo(`Verifying Body "${this.testData.Consultation.body}" is visible`);
        await expect(this.page.getByText(this.testData.Consultation.body)).toBeVisible();

        if (!preview)
        {
            // Only clicking on Link when content has been saved as unable to click to naviagte to it when in preview
            // Start waiting for the new tab before the click
            const pagePromise = this.page.context().waitForEvent('page');

            // click application link text
            await this.testSteps.LogInfo('Clicking Link text "Respond online"');
            await this.page.getByRole('link', { name: 'Respond online' }).click();

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
        await expect(this.page.getByText(this.testData.Consultation.emailAddress)).toBeVisible();

        // verify Post address
        await this.testSteps.LogInfo(`Verifying Postal address "${this.testData.Consultation.postalAddress}" is visible`);
        await expect(this.page.getByText(this.testData.Consultation.postalAddress)).toBeVisible();

    }

    //verify edited consultation method
    async verifyEditedConsultation(_: VerifyOptions)
    {
        // verify consultation open 
        await this.testSteps.LogInfo('Verifying "Closed consultation" text is present');
        await expect(this.page.locator('//span[contains(text(), "Closed consultation")]')).toBeVisible();

        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testData.Consultation.titleEdited}" is visible`);
        await expect(this.page.locator(`//h1[text()[normalize-space(.)="${this.testData.Consultation.titleEdited}"]]`)).toBeVisible();

        // verify consultation opens box
        await this.testSteps.LogInfo('Verifying "Consultation closed" text is present');
        await expect(this.page.locator('//p/strong[contains(text(), "Consultation closed")]')).toBeVisible();

        // verify consultation opens date time
        await this.testSteps.LogInfo('Verifying "Consultation opened 31 December 2025, 10.00 am and closed 31 December 2025, 5.00 pm" text is present');
        await expect(this.page.locator('//p[text()[normalize-space(.)="Consultation opened 31 December 2025, 10.00 am and closed 31 December 2025, 5.00 pm"]]')).toBeVisible();

        // verify summary
        await this.testSteps.LogInfo(`Verifying Summary "${this.testData.Consultation.summaryEdited}" is visible`);
        await expect(this.page.getByText(this.testData.Consultation.summaryEdited)).toBeVisible();

        // verify body field
        await this.testSteps.LogInfo(`Verifying Body "${this.testData.Consultation.bodyEdited}" is visible`);
        await expect(this.page.getByText(this.testData.Consultation.bodyEdited)).toBeVisible();

        // verify consultation close message displayed
        await this.testSteps.LogInfo('Verifying Consultation close message is is visible');
        await expect(this.page.getByText('Important information Consultation closed — responses are no longer being')).toBeVisible();

        // verify ways to respond is hidden 
        await this.testSteps.LogInfo('Verifying respond online message is NOT displayed');
        await expect(this.page.getByRole('link', { name: 'Respond online' })).toBeHidden();

        // verify consultation ways to respond is not available and has information message instead (as consultation is closed in the edit tests)
        await this.testSteps.LogInfo('Verifying "Consultation closed — responses are no longer being accepted." text is present');
        await expect(this.page.locator('//p[text()[normalize-space(.)="Consultation closed — responses are no longer being accepted."]]')).toBeVisible();
    }

    //verify consultation method
    async verifyFutureConsultation(_: VerifyOptions)
    {
        // verify consultation open 
        await this.testSteps.LogInfo('Verifying "Consultation opens" text is present');
        await expect(this.page.locator('//strong[contains(text(),"Consultation opens")]')).toBeVisible();

        // verify title
        //await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.Consultation.title);
        await this.testSteps.LogInfo(`Verifying title "${this.testData.Consultation.title}" is visible`);
        await expect(this.page.locator(`//h1[text()[normalize-space(.)="${this.testData.Consultation.title}"]]`)).toBeVisible();

        // verify consultation closes date time
        await this.testSteps.LogInfo(`Verifying future start date "${this.testData.Consultation.verifyFutureStartDate}" is visible`);
        await expect(this.page.locator(`//p[text()[normalize-space(.)="${this.testData.Consultation.verifyFutureStartDate}"]]`)).toBeVisible();

        // verify summary
        await this.testSteps.LogInfo(`Verifying Summary "${this.testData.Consultation.summary}" is visible`);
        await expect(this.page.getByText(this.testData.Consultation.summary)).toBeVisible();

        // verify body field
        await this.testSteps.LogInfo(`Verifying Body "${this.testData.Consultation.body}" is visible`);
        await expect(this.page.getByText(this.testData.Consultation.body)).toBeVisible();

        // verify email field
        await this.testSteps.LogInfo(`Verifying Email address "${this.testData.Consultation.emailAddress}" is visible`);
        await expect(this.page.getByText(this.testData.Consultation.emailAddress)).toBeHidden();

        // verify address
        await this.testSteps.LogInfo(`Verifying Postal address "${this.testData.Consultation.postalAddress}" is visible`);
        await expect(this.page.getByText(this.testData.Consultation.postalAddress)).toBeHidden();

        await this.testSteps.LogInfo('Verifying "Consultation pending — details on ways to respond will be provided when the consultation has opened." text is present');
        await expect(this.page.locator('//p[text()[normalize-space(.)="Consultation pending — details on ways to respond will be provided when the consultation has opened."]]')).toBeVisible();
    }
}