import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { CKEditor } from '../../base-pages/CKEditor';
import { expect } from '@playwright/test';
import { UserPage } from '../../base-pages/UserPage';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { ContactNodePage } from './ContactNodePage';

export interface ContactEditSaveData
{
    contactTitle: string;
    revisionLogMessage: string;
    contactBody: string;
    mapName: string;
    mapLocationModalName: string;
}

export class ContactEditPage
{
    // logging
    private readonly testSteps: TestSteps;

    // pages
    private readonly ckeditor: CKEditor;
    private readonly userPage: UserPage;
    private readonly createPages: CreatePages;
    private readonly previewPage: PreviewPage;
    private readonly contactNodePage: ContactNodePage;

    // locators
    private readonly contactTitleField: Locator;
    private readonly clearMapFieldsButton: Locator;
    private readonly setMapButton: Locator;
    private readonly mapModalNameField: Locator;
    private readonly findMapModalButton: Locator;
    private readonly insertMapModalButton: Locator;
    private readonly mapNameField: Locator;

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

        // imported pages
        this.userPage = new UserPage(page, this.testSetUpData);
        this.createPages = new CreatePages(page, this.testSetUpData, this.testData);
        this.ckeditor = new CKEditor(page, this.testSetUpData, testData);
        this.previewPage = new PreviewPage(page);
        this.contactNodePage = new ContactNodePage(page, this.testSetUpData, this.testData);

        // locators
        this.contactTitleField = page.getByRole('textbox', { name: 'Point of contact' });
        this.clearMapFieldsButton = page.getByRole('button', { name: 'Clear' });
        this.setMapButton = page.getByRole('button', { name: 'Set Map' });
        this.mapModalNameField = page.locator('#centre_map_on');
        this.findMapModalButton = page.getByRole('button', { name: 'Find' });
        this.insertMapModalButton = page.getByRole('button', { name: 'Insert map' });
        this.mapNameField = page.getByRole('textbox', { name: 'Map Name' });
    }

    // ------------------------ asserts ------------------------

    // check url on edit contact page
    async editContactPageURLCheck()
    {
        await this.testSteps.LogInfo('Verifying URL contains "edit"');
        await expect(this.page).toHaveURL(/\/edit/);
    }

    // check url on return to edit contact page after doing a preview
    async returnFromPreviewContactPageURLCheck()
    {
        await this.testSteps.LogInfo('Verifying URL contains "/node/.+/edit\\?uuid"');
        await expect(this.page).toHaveURL(new RegExp('/node/.+/edit\\?uuid'));
    }

    // ------------------------ filling contact form ------------------------

    // edit contact title
    async editContactTitle(contactTitle: string)
    {
        await this.testSteps.LogInfo(`Entering "${contactTitle}" into the Point of contact field`);
        await this.contactTitleField.fill(contactTitle);
    }

    // clear map fields
    async clearMapFields()
    {
        await this.testSteps.LogInfo(`Clicking "Clear" button to clear map fields`);
        await this.clearMapFieldsButton.click();
    }

    // click set map button
    async clickSetMapButton()
    {
        await this.testSteps.LogInfo(`Clicking "Set Map" button`);
        await this.setMapButton.click();
    }

    // enter map Modal name
    async enterMapModalName(mapLocationModalName: string)
    {
        await this.testSteps.LogInfo(`Entering "${mapLocationModalName}" into the Map Location Modal Name field`);
        await this.mapModalNameField.fill(mapLocationModalName);
    }

    // Click find in map modal 
    async clickFindMapModalButton()
    {
        await this.testSteps.LogInfo(`Clicking "Find" button in the Map Location Modal`);
        await this.findMapModalButton.click();
    }

    // Click insert map button in map modal
    async clickInsertMapModalButton()
    {
        await this.testSteps.LogInfo(`Clicking "Insert" button in the Map Location Modal`);
        await this.page.waitForTimeout(3000);
        await this.insertMapModalButton.click();
    }

    // edit contact map name
    async editMapName(mapName: string)
    {
        await this.testSteps.LogInfo(`Entering "${mapName}" into the Map Name field`);
        await this.mapNameField.fill(mapName);
    }

    // ------------------------ actions related to edit contact ------------------------

    // fill in contact form elements - title body topics etc
    async editContactForm(data: ContactEditSaveData)
    {
        await this.editContactPageURLCheck();
        await this.editContactTitle(data.contactTitle);
        await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);
        await this.ckeditor.enterCKEditorBody(data.contactBody);
        await this.clearMapFields();;
        await this.clickSetMapButton();
        await this.enterMapModalName(data.mapLocationModalName);

        if (TestSetUpData.userForTest.username === TestSetUpData.validUserList.supervisor_username)
        {
            await this.clickFindMapModalButton();
            await this.clickInsertMapModalButton();
            await this.editMapName(data.mapName);
        }
    }
}
