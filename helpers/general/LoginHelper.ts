import { Page } from '@playwright/test';
import { LoginPage } from '@poms/base-pages/LoginPage';
import { TestSetUpData } from '@tdata/TestDataObject';

export class LoginHelper
{
    constructor(
        private page: Page,
        // isolated instances of test data via constructor
        private testSetUpData: typeof TestSetUpData
    ) { }

    async loginWithValidUser()
    {
        // new instance of LoginPage with this.page and this.testSetUpData parameters set
        const loginPage = new LoginPage(this.page, this.testSetUpData);
        await loginPage.login(this.testSetUpData.userForTest.username, this.testSetUpData.userForTest.password);
    }

    async AttemptTologinWithInValidUser()
    {
        // new instance of LoginPage with this.page and this.testSetUpData parameters set
        const loginPage = new LoginPage(this.page, this.testSetUpData);
        await loginPage.Invalidlogin(this.testSetUpData.userForTest.username, this.testSetUpData.userForTest.password);
    }


}