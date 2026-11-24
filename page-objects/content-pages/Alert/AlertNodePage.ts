import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { expect } from '@playwright/test';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export class AlertNodePage
{
    // logging
    private readonly testSteps: TestSteps;

    // locators
    private readonly alertTitle: Locator;
    private readonly publishedDate: Locator;
    private readonly alertImage: Locator;
    private readonly alertBody: Locator;
    private readonly alertImageCaption: Locator;
    private readonly statusMessage: Locator;

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

        // locators
        this.alertTitle = page.getByRole('heading', { level: 1 });
        this.publishedDate = page.locator('time');
        this.alertImage = page.locator('img');
        this.alertBody = page.locator('p');
        this.alertImageCaption = page.locator('figure figcaption');
        this.statusMessage = page.locator('[role="contentinfo"][role="status"]');
    }

    // -------------------- Helper methods --------------------

    // format date from YYYY-MM-DD to "DD Month YYYY" format (e.g., "24 November 2026")
    private formatDateForDisplay(dateString: string): string
    {
        const date = new Date(dateString + 'T00:00:00Z');
        return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
    }

    // -------------------- URL CHECK --------------------

    // check url after saving create alert
    async alertNodeURLCheck()
    {
        // escapeRegex removes all white space and replaces with '-', where '-' already exists and surrounded by 
        // white space it will just remove surrounding white space and converts all characters to lower case.
        const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();

        await this.testSteps.LogInfo(`Verifying URL path is /alert/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)} with optional -suffix and optional trailing path, or is /node/.+`);
        await expect(this.page).toHaveURL(
            new RegExp(`(?:${this.testSetUpData.urlForTest.url}/alert/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)}(?:-[^/]+)?(?:/.*)?$)|(?:/node/.+)`)
        );
    }

    // -------------------- Verify Alert methods --------------------

    // verify alert method
    async verifyAlert()
    {
        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testData.Alert.title}" is visible`);
        await expect(this.alertTitle).toHaveText(this.testData.Alert.title);

        // verify published date
        await this.testSteps.LogInfo('Verifying Date published label is visible');
        const datePublishedBase = this.page.locator('//span[contains(text(), "Date published")]');
        await expect(datePublishedBase).toBeVisible();

        const formattedDate = this.formatDateForDisplay(this.testData.Alert.publishedDate);
        await this.testSteps.LogInfo(`Verifying published date "${formattedDate}" is in time element`);
        const datePublishedTime = this.page.locator('//span[contains(text(), "Date published")]/following-sibling::span//time');
        await expect(datePublishedTime).toBeVisible();
        await expect(datePublishedTime).toContainText(formattedDate);

        // verify alert body
        await this.testSteps.LogInfo(`Verifying alert body contains "${this.testData.Alert.body}"`);
        await expect(this.page.getByText(this.testData.Alert.body)).toBeVisible();

        // verify alert image is visible
        await this.testSteps.LogInfo(`Verifying alert image is visible with alt text "${this.testData.Media.imageAltText}"`);
        await expect(this.page.getByRole('img', { name: this.testData.Media.imageAltText })).toBeVisible();
        // verify alert image caption
        await this.testSteps.LogInfo(`Verifying image caption "${this.testData.Alert.imageCaption}" is visible`);
        await expect(this.page.getByText(this.testData.Alert.imageCaption)).toBeVisible();
    }

    // verify edited alert method
    async verifyEditedAlert()
    {
        // verify title
        await this.testSteps.LogInfo(`Verifying edited title "${this.testData.Alert.titleEdited}" is visible`);
        await expect(this.alertTitle).toHaveText(this.testData.Alert.titleEdited);

        // verify published date
        await this.testSteps.LogInfo('Verifying Date published label is visible');
        const datePublishedBase = this.page.locator('//span[contains(text(), "Date published")]');
        await expect(datePublishedBase).toBeVisible();

        const formattedDate = this.formatDateForDisplay(this.testData.Alert.publishedDateEdited);
        await this.testSteps.LogInfo(`Verifying edited published date "${formattedDate}" is in time element`);
        const datePublishedTime = this.page.locator('//span[contains(text(), "Date published")]/following-sibling::span//time');
        await expect(datePublishedTime).toBeVisible();
        await expect(datePublishedTime).toContainText(formattedDate);

        await this.testSteps.LogInfo(`Verifying alert body contains "${this.testData.Alert.bodyEdited}"`);
        await expect(this.page.getByText(this.testData.Alert.bodyEdited)).toBeVisible();

        // verify alert image is visible
        await this.testSteps.LogInfo(`Verifying alert image is visible with alt text "${this.testData.Media.imageAltText}"`);
        await expect(this.page.getByRole('img', { name: this.testData.Media.imageAltText })).toBeVisible();

        // verify edited image caption
        await this.testSteps.LogInfo(`Verifying edited image caption "${this.testData.Media.imageCaptionEdited}" is visible`);
        await expect(this.page.getByText(this.testData.Media.imageCaptionEdited)).toBeVisible();
    }
}
