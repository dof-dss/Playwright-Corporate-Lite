import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestSetUpData, TestData } from '../../test-data/TestDataObject';

export class CreatePages
{
    // logging
    private readonly testSteps: TestSteps;

    readonly saveButton: Locator;
    readonly previewButton: Locator;

    // constructor
    constructor(
        private readonly page: Page,
        // isolated instances of test data 
        private testSetUpData: typeof TestSetUpData,
        private testData: typeof TestData,
    )
    {
        // logging isolated instance
        this.testSteps = new TestSteps();

        this.saveButton = page.locator('#edit-submit');
        this.previewButton = page.locator('#edit-preview');
    }

    //#region content creation

    // choose save as type from dropdown
    async enterRevisionLogMessage(revisionLogMessage: string)
    {
        await this.testSteps.LogInfo(`Entering "${revisionLogMessage}" into the Revision message field`);

        await this.page.locator('#edit-revision-log-0-value').or(this.page.locator('#edit-revision-log-message-0-value')).first().fill(revisionLogMessage);
        

    }

    // choose save as type from dropdown
    async chooseSaveAsType()
    {
        const saveOption = this.testSetUpData.saveAsOptionForTest.saveAsOption;
        await this.testSteps.LogInfo(`Selecting "${saveOption}" from Save as dropown field`);
        await this.page.locator('#edit-moderation-state-0-state').selectOption(saveOption);
    }

    // Click preview button
    async clickPreviewButton()
    {
        await this.testSteps.LogInfo('Clicking Preview button');
        // click preview button 
        await this.previewButton.click();
    }

    // Clcik Save button
    async clickSaveButton()
    {
        await this.testSteps.LogInfo('Clicking Save button');
        // click save button
        await this.saveButton.click();
    }

}
