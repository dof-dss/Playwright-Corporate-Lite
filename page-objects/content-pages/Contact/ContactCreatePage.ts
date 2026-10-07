import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { CKEditor } from '../../base-pages/CKEditor';
import { expect } from '@playwright/test';
import { UserPage } from '../../base-pages/UserPage';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { ContactNodePage } from './ContactNodePage';

export interface ContactSaveData
{
    contactTitle: string;
    revisionLogMessage: string;
    contactBody: string;
    mapName: string;
    mapLatitude: string;
    mapLongitude: string;
}

export class ContactCreatePage
{
    // logging
    private readonly testSteps: TestSteps;

    // pages
    private readonly ckeditor: CKEditor;
    private readonly userPage: UserPage;
    private readonly createPages: CreatePages;
    private readonly previewPage: PreviewPage;
    readonly contactNodePage: ContactNodePage;

    // locators
    private readonly contactTitleField: Locator;
    private readonly mapNameField: Locator;
    private readonly mapLatitudeField: Locator;
    private readonly mapLongitudeField: Locator;

    // error messages
    private readonly titleFieldIsRequired: Locator;

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
        this.mapNameField = page.getByRole('textbox', { name: 'Map Name' });
        this.mapLatitudeField = page.getByRole('textbox', { name: 'Latitude' });
        this.mapLongitudeField = page.getByRole('textbox', { name: 'Longitude' });

        // error messages
        this.titleFieldIsRequired = page.getByText('Title field is required.');
    }

    // ------------------------ asserts ------------------------

    // check url on create contact page
    async createContactPageURLCheck()
    {
        await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/node/add/contact"`);
        await expect(this.page).toHaveURL(`${this.testSetUpData.urlForTest.url}/node/add/contact`);
    }

    // check url on return to create contact page after doing a preview
    async returnFromPreviewContactPageURLCheck()
    {
        await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/node/add/contact\\?uuid"`);
        await expect(this.page).toHaveURL(new RegExp(`${this.testSetUpData.urlForTest.url}/node/add/contact\\?uuid`));
    }

    // ------------------------ filling contact form ------------------------

    // enter contact title
    async enterContactTitle(contactTitle: string)
    {
        await this.testSteps.LogInfo(`Entering "${contactTitle}" into the Point of contact field`);
        await this.contactTitleField.fill(contactTitle);
    }

    // enter contact map name
    async enterMapName(mapName: string)
    {
        await this.testSteps.LogInfo(`Entering "${mapName}" into the Map Name field`);
        await this.mapNameField.fill(mapName);
    }

    // enter contact map latitude
    async enterMapLatitude(mapLatitude: string)
    {
        await this.testSteps.LogInfo(`Entering "${mapLatitude}" into the Map Latitude field`);
        await this.mapLatitudeField.fill(mapLatitude);
    }

    // enter contact map longitude
    async enterMapLongitude(mapLongitude: string)
    {
        await this.testSteps.LogInfo(`Entering "${mapLongitude}" into the Map Longitude field`);
        await this.mapLongitudeField.fill(mapLongitude);
    }

    // ------------------------ actions related to create contact ------------------------

    // mandatory field check contact
    async mandatoryFieldCheck()
    {
        await this.testSteps.LogInfo('Performing mandatory field check');
        await this.testSteps.LogInfo('Clicking save button');
        await this.createPages.clickSaveButton();
        await this.testSteps.LogInfo('Verifying Title field error message appears');
        await expect(this.titleFieldIsRequired).toBeVisible();
    }

    // fill in contact form elements - title body topics etc
    async fillContactForm(data: ContactSaveData)
    {
        await this.createContactPageURLCheck();
        await this.enterContactTitle(data.contactTitle);
        await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);
        await this.ckeditor.enterCKEditorBody(data.contactBody);

        if (TestSetUpData.userForTest.username === TestSetUpData.validUserList.supervisor_username)
        {
            await this.enterMapName(data.mapName);
            await this.enterMapLatitude(data.mapLatitude);
            await this.enterMapLongitude(data.mapLongitude);
        }
    }
}
