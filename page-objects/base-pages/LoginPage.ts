import { Page, Locator, expect, test } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { UserPage } from './UserPage';
import { TestSetUpData } from '../../test-data/TestDataObject';

export class LoginPage
{
    private readonly testSteps: TestSteps;

    constructor(
        private page: Page,
        // isolated instances of test data
        private testSetUpData: typeof TestSetUpData
    ) 
    {
        this.testSteps = new TestSteps();
    }

    // log in user page check 
    async logInPageURLCheck()
    {
        await this.testSteps.LogInfo(`Performing URL check to ensure user is on ${this.testSetUpData.urlForTest.url}/user/login`);
        await expect(this.page).toHaveURL(`${this.testSetUpData.urlForTest.url}/user/login`);
    }

    // click accept cookies if banner is visible
    async acceptCookies()
    {
        if (await this.page.locator('//button[text()="Accept cookies"]').isVisible())
        {
            await this.testSteps.LogInfo('Clicking "Accept Cookies" Button');
            await this.page.locator('//button[text()="Accept cookies"]').click();
        }
    }

    async login(username: string, password: string)
    {
        // Navigate using isolated test data URL
        await this.testSteps.LogInfo(`Navigating to "${this.testSetUpData.urlForTest.url}/user/login"`);
        await this.page.goto(`${this.testSetUpData.urlForTest.url}/user/login`);
        // cookie banner check and click
        await this.acceptCookies();

        // Use credentials from isolated test data for test
        await this.testSteps.LogInfo(`Entering "${username}" in username field`);
        await this.page.getByLabel('Username').fill(username);

        await this.testSteps.LogInfo('Entering users password in password field');
        await test.step('Fill Password into Password field', async () =>
        {
            // Password field is done this way to prevent Playwright from logging the actual password value
            await this.page.getByLabel('Password').evaluate((el: HTMLInputElement, passwordValue: string) =>
            {
                el.value = passwordValue;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
            }, password);
        }
        );

        await this.testSteps.LogInfo('Clicking "Log in" Button');
        await this.page.getByRole('button', { name: 'Log in' }).click();

        // new instance of userpage with this.page and isolated test data passed as parameters with following page check
        const userPage = new UserPage(this.page, this.testSetUpData);
        await userPage.loggedInPageURLCheck();
    }



    async Invalidlogin(username: string, password: string)
    {
        // Navigate using isolated test data URL
        await this.testSteps.LogInfo(`Navigating to "${this.testSetUpData.urlForTest.url}/user/login"`);
        await this.page.goto(`${this.testSetUpData.urlForTest.url}/user/login`);
        await this.logInPageURLCheck();
        // cookie banner check and click
        await this.acceptCookies();

        // Use credentials to be able to overwright in test
        await this.testSteps.LogInfo(`Entering "${username}" in username field`);
        await this.page.getByLabel('Username').fill(username);

        await this.testSteps.LogInfo('Entering users password in password field');
        await test.step('Fill Password into Password field', async () =>
        {
            // Password field is done this way to prevent Playwright from logging the actual password value
            await this.page.getByLabel('Password').evaluate((el: HTMLInputElement, passwordValue: string) =>
            {
                el.value = passwordValue;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
            }, password);
        }
        );

        await this.testSteps.LogInfo('Clicking "Log in" Button');
        await this.page.getByRole('button', { name: 'Log in' }).click();

        // LoginPageUrlCheck will ensure user is still on the Login page with a Error message displayed
        await this.logInPageURLCheck();
        await expect(this.page.getByText('Unrecognized username or password')).toBeVisible();
    }



}
