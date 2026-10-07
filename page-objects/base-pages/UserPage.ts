import { Page, Locator, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestSetUpData } from '../../test-data/TestDataObject';

export class UserPage
{
    // logging
    private readonly testSteps: TestSteps;

    // constructor 
    constructor(
        private readonly page: Page,
        // isolated instances of test data 
        private testSetUpData: typeof TestSetUpData
    ) 
    {
        this.testSteps = new TestSteps();
    }

    // logged in user page check 
    async loggedInPageURLCheck()
    {
        const formattedusername: string = this.testSetUpData.userForTest.username.replace(/_|\s/g, "");

        await this.testSteps.LogInfo(`Performing URL check to ensure user is on ${this.testSetUpData.urlForTest.url}/users/${formattedusername}?check_logged_in=1`);
        await expect(this.page).toHaveURL(`${this.testSetUpData.urlForTest.url}/users/${formattedusername}?check_logged_in=1`);
    }


}
