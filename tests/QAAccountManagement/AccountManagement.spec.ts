import { expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { LoginPage } from '@poms/base-pages/LoginPage';
import { test } from '@fixtures/MyFixtures';

test.describe('QA Account Management Configuration', () =>
{
    // Pass the fixture for Publication Authors into the beforeEach hook
    test.beforeEach(async ({ }, testInfo) =>
    {
        const testSteps = new TestSteps();
        await testSteps.LogInfo('Configuration starting');
        await testSteps.LogInfo(testInfo.title);
    });

    test('Enable QA Accounts', { tag: "@EnableQAAccounts" },
        async ({ page, testSetUpData }) =>
        {
            const testSteps = new TestSteps();
            const loginPage = new LoginPage(page, testSetUpData);
            const username = testSetUpData.validUserList.supervisor_username;
            const password = testSetUpData.validUserList.supervisor_password;

            // Navigate using isolated test data URL
            await testSteps.LogInfo(`Enabling QA Accounts`);
            await page.goto(`${testSetUpData.qaAccounts.finance_url_ddev}/origins-qa/api/users/enable/${testSetUpData.qaAccounts.qaAccountManagementToken}`);

            await testSteps.LogInfo(`Waiting for 5 seconds`);
            await page.waitForTimeout(5000);

            await testSteps.LogInfo(`Performing URL check to ensure user is on ${testSetUpData.qaAccounts.finance_url_ddev}/origins-qa/api/users/enable/{TOKEN}`);
            await expect(page).toHaveURL(`${testSetUpData.qaAccounts.finance_url_ddev}/origins-qa/api/users/enable/${testSetUpData.qaAccounts.qaAccountManagementToken}`);

            await page.goto(`${testSetUpData.qaAccounts.finance_url_ddev}/user/login`);
            // cookie banner check and click
            await loginPage.acceptCookies();

            // Use credentials from isolated test data for test
            await testSteps.LogInfo(`Entering "${username}" in username field`);
            await page.getByLabel('Username').fill(username);

            await testSteps.LogInfo('Entering users password in password field');
            await test.step('Fill Password into Password field', async () =>
            {
                await page.getByLabel('Password').evaluate((el: HTMLInputElement, passwordValue: string) =>
                {
                    el.value = passwordValue;
                    el.dispatchEvent(new Event('input', { bubbles: true }));
                    el.dispatchEvent(new Event('change', { bubbles: true }));
                }, password);
            }
            );

            await testSteps.LogInfo('Clicking "Log in" Button');
            await page.getByRole('button', { name: 'Log in' }).click();

            // new instance of userpage with this.page and isolated test data passed as parameters with following page check
            const formattedusername: string = username.replace(/_|\s/g, "");

            await testSteps.LogInfo(`Performing URL check to ensure user is on ${testSetUpData.qaAccounts.finance_url_ddev}/users/${formattedusername}?check_logged_in=1`);
            await expect(page).toHaveURL(`${testSetUpData.qaAccounts.finance_url_ddev}/users/${formattedusername}?check_logged_in=1`);
        });

    test('Disable QA Accounts', { tag: "@DisableQAAccounts" },
        async ({ page, testSetUpData }) =>
        {
            const testSteps = new TestSteps();
            const loginPage = new LoginPage(page, testSetUpData);
            const username = testSetUpData.validUserList.supervisor_username;
            const password = testSetUpData.validUserList.supervisor_password;

            // Navigate using isolated test data URL
            await testSteps.LogInfo(`Disabling QA Accounts`);
            await page.goto(`${testSetUpData.qaAccounts.finance_url_ddev}/origins-qa/api/users/disable/${testSetUpData.qaAccounts.qaAccountManagementToken}`);

            await testSteps.LogInfo(`Waiting for 5 seconds`);
            await page.waitForTimeout(5000);

            await testSteps.LogInfo(`Performing URL check to ensure user is on ${testSetUpData.qaAccounts.finance_url_ddev}/origins-qa/api/users/disable/{TOKEN}`);
            await expect(page).toHaveURL(`${testSetUpData.qaAccounts.finance_url_ddev}/origins-qa/api/users/disable/${testSetUpData.qaAccounts.qaAccountManagementToken}`);

            await page.goto(`${testSetUpData.qaAccounts.finance_url_ddev}/user/login`);
            // cookie banner check and click
            await loginPage.acceptCookies();

            // Use credentials from isolated test data for test
            await testSteps.LogInfo(`Entering "${username}" in username field`);
            await page.getByLabel('Username').fill(username);

            await testSteps.LogInfo('Entering users password in password field');
            await test.step('Fill Password into Password field', async () =>
            {
                await page.getByLabel('Password').evaluate((el: HTMLInputElement, passwordValue: string) =>
                {
                    el.value = passwordValue;
                    el.dispatchEvent(new Event('input', { bubbles: true }));
                    el.dispatchEvent(new Event('change', { bubbles: true }));
                }, password);
            }
            );

            await testSteps.LogInfo('Clicking "Log in" Button');
            await page.getByRole('button', { name: 'Log in' }).click();

            // new instance of userpage with this.page and isolated test data passed as parameters with following page check
            await expect(page.getByText('Unrecognized username or password')).toBeVisible();
        });
});