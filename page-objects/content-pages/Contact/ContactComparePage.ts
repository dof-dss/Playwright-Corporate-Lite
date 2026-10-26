import { Page, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export class ContactComparePage
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

    // check url after saving create contact
    async contactNodeURLCheck()
    {
        // escapeRegex removes all white space and replaces with '-', where '-' already exists and surrounded by
        // white space it will just remove surrounding white space and converts all characters to lower case.
        const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();
        await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/contact/${this.testSetUpData.contentTitleforTest.contentTitle}"`);

        await expect(this.page).toHaveURL(
            new RegExp(this.testSetUpData.urlForTest.url + `/contact/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)}$`)
        );
    }

    // -------------------- Verify Contact methods --------------------

    // verify contact when being compared method
    async verifyCompareContact()
    {
        //-------------------- TITLE --------------------
        const consultationTitle = this.page.locator('//h2//a//span');
        await this.testSteps.LogInfo('Verifying "New" text has been removed from the title');
        await expect(consultationTitle.locator('del')).toHaveText('New');

        await this.testSteps.LogInfo('Verifying "Edited" text has been added to the title');
        await expect(consultationTitle.locator('ins')).toHaveText('Edited');

        //-------------------- BODY FIELD --------------------
        const contactBody = this.page.locator('//p[contains(normalize-space(.), "contact body field")]');
        await this.testSteps.LogInfo('Verifying "new" text has been removed from Body field');
        await expect(contactBody.locator('del')).toHaveText('new');

        await this.testSteps.LogInfo('Verifying "edited" text has been added to Body field');
        await expect(contactBody.locator('ins')).toHaveText('edited');


        // NEEDS FIXED: Implement verification when big is fixed
        //-------------------- Statistics --------------------
      
        //--------------- Research and Support ---------------

    }
}
