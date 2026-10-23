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
    statistics: string;
    statistics2: string;
    researchAndSupport: string;
    researchAndSupport2: string;
    revisionLogMessage: string;
    contactBody: string;
    mapName: string;
    mapLocationModalName: string;
    mapLatitude: string;
    mapLongitude: string;
}

export class ContactEditPage
{
    // logging
    private readonly testSteps: TestSteps;
    private selectedStatistics?: string;
    private selectedStatisticsLevel1?: string;
    private selectedStatisticsLevel2?: string;
    private selectedResearchAndSupport?: string;
    private selectedResearchAndSupportLevel1?: string;

    // pages
    private readonly ckeditor: CKEditor;
    private readonly userPage: UserPage;
    private readonly createPages: CreatePages;
    private readonly previewPage: PreviewPage;
    private readonly contactNodePage: ContactNodePage;

    // locators
    private readonly contactTitleField: Locator;
    private readonly coordinateDetails: Locator;
    private readonly mapLatitudeField: Locator;
    private readonly mapLongitudeField: Locator;
    private readonly statisticsFields: Locator;
    private readonly researchAndSupportFields: Locator;
    private readonly addressField: Locator;
    private readonly urlAliasField: Locator;
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
        this.coordinateDetails = page.getByRole('button', { name: 'Coordinate details', exact: true });
        this.mapLatitudeField = page.locator('#edit-field-location-map-0-lat');
        this.mapLongitudeField = page.locator('#edit-field-location-map-0-lng');
        this.statisticsFields = page.getByRole('combobox', { name: 'Statistics', exact: true });
        this.researchAndSupportFields = page.getByRole('combobox', { name: 'Research and support', exact: true });
        this.addressField = page.getByPlaceholder('Enter Address', { exact: true });
        this.urlAliasField = page.getByRole('textbox', { name: 'URL alias', exact: true });
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

    async clickCoordinateDetails()
    {
        await this.coordinateDetails.click();
    }

    async enterMapLatitude(mapLatitude: string)
    {
        await this.testSteps.LogInfo(`Entering "${mapLatitude}" into the Map Latitude field`);
        await this.mapLatitudeField.fill(mapLatitude);
    }

    async enterMapLongitude(mapLongitude: string)
    {
        await this.testSteps.LogInfo(`Entering "${mapLongitude}" into the Map Longitude field`);
        await this.mapLongitudeField.fill(mapLongitude);
    }

    async selectStatistics(statistics: string)
    {
        await this.testSteps.LogInfo(`Selecting "${statistics}" from the Statistics dropdown`);
        await this.page.locator('#edit-field-site-topics-shs-0-0').selectOption({ label: statistics });
        this.selectedStatistics = statistics;
        this.selectedStatisticsLevel1 = undefined;
        this.selectedStatisticsLevel2 = undefined;
    }

    async selectStatisticsLevel1(statisticslevel1: string)
    {
        if (this.selectedStatistics === undefined)
        {
            throw new Error('Call selectStatistics before selecting a Statistics sublevel.');
        }
        await this.testSteps.LogInfo(`Selecting "${statisticslevel1}" from the sub level "${this.selectedStatistics}" statistic dropdown`);
        await this.page.locator('#edit-field-site-topics-shs-0-1').selectOption({ label: statisticslevel1 });
        this.selectedStatisticsLevel1 = statisticslevel1;
        this.selectedStatisticsLevel2 = undefined;
    }

    async selectStatisticsLevel2(statisticslevel2: string)
    {
        if (this.selectedStatisticsLevel1 === undefined)
        {
            throw new Error('Call selectStatisticsLevel1 before selecting Statistics level 2.');
        }
        await this.testSteps.LogInfo(`Selecting "${statisticslevel2}" from the sub level "${this.selectedStatisticsLevel1}" statistic dropdown`);
        await this.page.locator('#edit-field-site-topics-shs-0-2').selectOption({ label: statisticslevel2 });
        this.selectedStatisticsLevel2 = statisticslevel2;
    }

    async selectStatisticsLevel3(statisticslevel3: string)
    {
        if (this.selectedStatisticsLevel2 === undefined)
        {
            throw new Error('Call selectStatisticsLevel2 before selecting Statistics level 3.');
        }
        await this.testSteps.LogInfo(`Selecting "${statisticslevel3}" from the sub level "${this.selectedStatisticsLevel2}" statistic dropdown`);
        await this.page.locator('#edit-field-site-topics-shs-0-3').selectOption({ label: statisticslevel3 });
    }

    async clickAddAnotherStatistics()
    {
        await this.testSteps.LogInfo('Clicking Add another item for Statistics');
        await this.page.locator('.js-form-item-field-site-topics')
            .getByText('Add another item', { exact: true }).click();
    }

    async selectStatistics2(statistics2: string)
    {
        await this.testSteps.LogInfo(`Selecting "${statistics2}" from the second Statistics dropdown`);
        await this.page.locator('#edit-field-site-topics-shs-1-0').selectOption({ label: statistics2 });
    }

    async selectResearchAndSupport(researchAndSupport: string)
    {
        await this.testSteps.LogInfo(`Selecting "${researchAndSupport}" from the Research and support dropdown`);
        await this.page.locator('#edit-field-research-support-shs-0-0').selectOption({ label: researchAndSupport });
        this.selectedResearchAndSupport = researchAndSupport;
        this.selectedResearchAndSupportLevel1 = undefined;
    }

    async selectResearchAndSupportLevel1(researchAndSupportlevel1: string)
    {
        if (this.selectedResearchAndSupport === undefined)
        {
            throw new Error('Call selectResearchAndSupport before selecting a Research and support sublevel.');
        }
        await this.testSteps.LogInfo(`Selecting "${researchAndSupportlevel1}" from the sub level "${this.selectedResearchAndSupport}" Research and support dropdown`);
        await this.page.locator('#edit-field-research-support-shs-0-1').selectOption({ label: researchAndSupportlevel1 });
        this.selectedResearchAndSupportLevel1 = researchAndSupportlevel1;
    }

    async selectResearchAndSupportLevel2(researchAndSupportlevel2: string)
    {
        if (this.selectedResearchAndSupportLevel1 === undefined)
        {
            throw new Error('Call selectResearchAndSupportLevel1 before selecting Research and support level 2.');
        }
        await this.testSteps.LogInfo(`Selecting "${researchAndSupportlevel2}" from the sub level "${this.selectedResearchAndSupportLevel1}" Research and support dropdown`);
        await this.page.locator('#edit-field-research-support-shs-0-2').selectOption({ label: researchAndSupportlevel2 });
    }

    async clickAddAnotherResearchAndSupport()
    {
        await this.testSteps.LogInfo('Clicking Add another item for Research and support');
        await this.page.locator('.js-form-item-field-research-support')
            .getByText('Add another item', { exact: true }).click();
    }

    async selectResearchAndSupport2(researchAndSupport2: string)
    {
        await this.testSteps.LogInfo(`Selecting "${researchAndSupport2}" from the second Research and support dropdown`);
        await this.page.locator('#edit-field-research-support-shs-1-0').selectOption({ label: researchAndSupport2 });
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


        await this.selectStatistics(data.statistics);
        await this.selectStatistics2(data.statistics2);

        await this.selectResearchAndSupport(data.researchAndSupport);
        await this.selectResearchAndSupport2(data.researchAndSupport2);

        await this.ckeditor.enterCKEditorBody(data.contactBody);


        if (this.testSetUpData.userForTest.username === this.testSetUpData.validUserList.supervisor_username)
        {
            await this.clickCoordinateDetails();
            await this.enterMapLatitude(data.mapLatitude);
            await this.enterMapLongitude(data.mapLongitude);
        }
    }
}
