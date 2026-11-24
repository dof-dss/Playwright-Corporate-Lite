import { Page, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export class AlertComparePage 
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

    // check url for alert comparison page
    async alertComparePageURLCheck()
    {
        // escapeRegex removes all white space and replaces with '-', where '-' already exists and surrounded by 
        // white space it will just remove surrounding white space and converts all characters to lower case.
        const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();
        await this.testSteps.LogInfo(`Verifying URL contains revisions/view pattern for alert comparison`);

        await expect(this.page).toHaveURL(new RegExp('/revisions/view/'));
    }

    // -------------------- Verify Alert Comparison methods --------------------

    // verify alert when being compared method
    async verifyCompareAlert()
    {
        //-------------------- TITLE --------------------
        const alertTitle = this.page.locator('h2');
        await this.testSteps.LogInfo('Verifying "Alert" text in Title');
        await expect(alertTitle).toContainText('Alert');

        await this.testSteps.LogInfo('Verifying "Edited" text has been added to Title');
        await expect(alertTitle.locator('ins')).toHaveText('Edited');

        
        //-------------------- PUBLISHED DATE --------------------
        const publishedDateSection = this.page.locator('paragraph').filter({ hasText: 'Date published:' });
        await this.testSteps.LogInfo('Verifying Date published section exists');
        await expect(publishedDateSection).toBeVisible();

        await this.testSteps.LogInfo('Verifying old published date has been removed');
        await expect(publishedDateSection.locator('del')).toBeVisible();

        await this.testSteps.LogInfo('Verifying new published date has been added');
        await expect(publishedDateSection.locator('ins')).toBeVisible();

        
        //-------------------- IMAGE --------------------
        await this.testSteps.LogInfo('Verifying image has been removed (marked with <del>)');
        const imageDeleted = this.page.locator('del').filter({ hasText: /Deleted|Testing Image Caption/ });
        await expect(imageDeleted).toBeVisible();

        await this.testSteps.LogInfo('Verifying image replacement text shows "Inserted"');
        const imageInserted = this.page.locator('ins').filter({ hasText: 'Inserted' });
        await expect(imageInserted).toBeVisible();


        //-------------------- BODY --------------------
        const alertBody = this.page.locator('p').filter({ hasText: 'ber' });
        await this.testSteps.LogInfo('Verifying alert body contains original text');
        await expect(alertBody).toBeVisible();

        await this.testSteps.LogInfo('Verifying "edited" text has been added to alert body');
        await expect(alertBody.locator('ins')).toHaveText('edited');
    }

    // verify specific field changes in alert comparison
    async verifyAlertTitleChange(oldTitle: string, newTitle: string)
    {
        const alertTitle = this.page.locator('h2');
        await this.testSteps.LogInfo(`Verifying title has been changed from to include "${newTitle}"`);
        await expect(alertTitle.locator('ins')).toHaveText(newTitle);
    }

    // verify published date change
    async verifyPublishedDateChanged()
    {
        const publishedDateSection = this.page.locator('p').filter({ hasText: 'Date published:' });
        await this.testSteps.LogInfo('Verifying published date has been changed (deleted and inserted elements exist)');
        await expect(publishedDateSection.locator('del')).toBeVisible();
        await expect(publishedDateSection.locator('ins')).toBeVisible();
    }

    // verify image was replaced
    async verifyImageReplaced()
    {
        await this.testSteps.LogInfo('Verifying old image is marked as deleted');
        const deletedImage = this.page.locator('del').filter({ hasText: /Deleted|Caption/ });
        await expect(deletedImage).toBeVisible();

        await this.testSteps.LogInfo('Verifying new image is marked as inserted');
        const insertedImage = this.page.locator('ins').filter({ hasText: 'Inserted' });
        await expect(insertedImage).toBeVisible();
    }

    // verify body content changes
    async verifyBodyContentChanged()
    {
        const alertBody = this.page.locator('p').filter({ hasText: /ber|body/ });
        await this.testSteps.LogInfo('Verifying body content has changes (insertion exists)');
        await expect(alertBody.locator('ins')).toBeVisible();
    }
}
