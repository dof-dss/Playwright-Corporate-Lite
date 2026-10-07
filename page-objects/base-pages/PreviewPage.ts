import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { expect } from '@playwright/test';

export class PreviewPage
{
    // logging
    private readonly testSteps: TestSteps;

    // global topics 
    private readonly backToContentEditingButton: Locator;

    // constructor
    constructor(private readonly page: Page)
    {
        // logging isolated instance
        this.testSteps = new TestSteps();

        this.backToContentEditingButton = page.getByRole('link', { name: 'Back to content editing' })
    }

    async performURLCheck()
    {
        await this.testSteps.LogInfo('Verifying URL is for preview page"');
        await expect(this.page).toHaveURL(/\/node\/preview/);
    }

    async clickBackToContentEdittingButton()
    {
        await this.testSteps.LogInfo('Clicking "Back to content editing" button');
        await this.backToContentEditingButton.click();
    }
}


    