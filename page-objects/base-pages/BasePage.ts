import { Page, Locator, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestSetUpData } from '../../test-data/TestDataObject';

export class BasePage
{
    // logging
    private readonly testSteps: TestSteps;

    // locator 
    private readonly contentLink: Locator;
    private readonly adminToolbar: Locator;

    // constructor 
    constructor(
        private readonly page: Page,
        // isolated instances of test data 
        private testSetUpData: typeof TestSetUpData
    ) 
    {
        // logging isolated instance
        this.testSteps = new TestSteps();

        // locators
        this.contentLink = page.getByRole('link', { name: 'Content', exact: true }).first();
        this.adminToolbar = this.page.locator('#toolbar-item-administration');
    }

    // click content link and if it is not showing click burger button
    async clickContentLink()
    {
        // try catch as sometimes the toolbar burger button needs clicked to display the content link
        try
        {
            await this.testSteps.LogInfo('Attempting to click content link');
            // constant poll for 2 seconds to check for link
            await this.contentLink.waitFor({ state: 'visible', timeout: 2000 });
            // click link
            await this.contentLink.click();
        }
        catch
        {
            await this.testSteps.LogInfo('Clicking admin tool bar link to change nav view');
            // if timeout fails above click on toolbar burger button
            await this.adminToolbar.click();
            // then click content link
            await this.testSteps.LogInfo('Clicking content link');
            await this.contentLink.click();
        }
        await this.testSteps.LogInfo('Click Successfull');
    }

    // log out user in user page check 
    async logOut()
    {
        await expect(this.page.locator('#toolbar-item-user')).toBeVisible();
        await expect(this.page.locator('#toolbar-item-user')).toBeEnabled();

        try
        {
            await this.testSteps.LogInfo('Attempting to click toolbar user link');
            await this.page.locator('#toolbar-item-user').click();
            await expect(this.page.locator('//a[text()="Log out"]')).toBeVisible();
            await this.testSteps.LogInfo('Attempting to click log out link');
            await this.page.locator('//a[text()="Log out"]').click();
        } catch (error)
        {
            await this.testSteps.LogInfo('Clicking admin tool bar link to change nav view');
            await this.page.locator('#toolbar-item-user').click();
            await expect(this.page.locator('//a[text()="Log out"]')).toBeVisible();
            await this.testSteps.LogInfo('Attempting to click log out link');
            await this.page.locator('//a[text()="Log out"]').click();
        }
    }
}