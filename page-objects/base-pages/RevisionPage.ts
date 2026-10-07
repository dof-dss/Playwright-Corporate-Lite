import { Page, Locator, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';

export class RevisionPage
{
    // logging
    private readonly testSteps: TestSteps;

    // locators
    private readonly compareRevisionsButton: Locator;
    private readonly revertRevisionButton: Locator;
    private readonly revertDropDown: Locator;
    private readonly deleteRevisionButton: Locator;
    private readonly viewContent: Locator

    // constructor
    constructor(private readonly page: Page)
    {
        // logging isolated instance
        this.testSteps = new TestSteps();

        this.compareRevisionsButton = page.getByRole('button', { name: 'Compare selected revisions' });
        // WILL NEED UPDATED WHEN TOPICS IS FIXED
        this.revertRevisionButton = page.locator('//p[text()="This is an automated revision log message (Draft)"]//parent::td//following-sibling::td//a[text()="Revert"]')
        this.revertDropDown = page.locator('//p[text()="This is an automated revision log message (Draft)"]//parent::td//following-sibling::td//button')
        this.deleteRevisionButton = page.locator('//p[text()="This is an automated revision log message (Draft)"]//parent::td//following-sibling::td//a[text()="Delete"]')
        this.viewContent = page.getByRole('link', { name: 'View' });
    }

    // url check for Revision page
    async revisionPageURLCheck()
    {
        await this.testSteps.LogInfo('Verifying URL contains "/node/.+/revisions"');
        await expect(this.page).toHaveURL(new RegExp('/node/.+/revisions'));
    }

    // Clicking Compare selected revisions button
    async clickCompareRevisionsButton()
    {
        await this.testSteps.LogInfo('Clicking Compare revisions button');
        await this.compareRevisionsButton.click();
    }

    // Clicking Delete revisions button
    async clickDeleteRevisionsButton()
    {
        await this.testSteps.LogInfo('Clicking revisions table dropdown button');
        await this.revertDropDown.click();
        await this.testSteps.LogInfo('Clicking Delete revisions button');
        await this.deleteRevisionButton.click();
    }

    // Clicking Revert revisions button
    async clickRevertRevisionsButton()
    {
        await this.testSteps.LogInfo('Clicking Revert revisions button');
        await this.revertRevisionButton.click();
    }

    // Clicking Compare selected revisions button
    async clickViewButton()
    {
        await this.testSteps.LogInfo('Clicking View revisions link');
        await this.viewContent.click();
    }


}