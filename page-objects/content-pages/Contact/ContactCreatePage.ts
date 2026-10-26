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
    statistics: string;
    statisticslevel1: string;
    statisticslevel2: string;
    statisticslevel3: string;
    statistics2: string;
    researchAndSupport: string;
    researchAndSupportlevel1: string;
    researchAndSupportlevel2: string;
    researchAndSupport2: string;
    address?: string;
    urlAlias?: string;
}

export class ContactCreatePage
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
    readonly contactNodePage: ContactNodePage;

    // locators
    private readonly contactTitleField: Locator;
    private readonly mapNameField: Locator;
    private readonly coordinateDetails: Locator;
    private readonly mapLatitudeField: Locator;
    private readonly mapLongitudeField: Locator;
    private readonly statisticsFields: Locator;
    private readonly researchAndSupportFields: Locator;
    private readonly addressField: Locator;
    private readonly urlAliasField: Locator;
    private readonly setMapButton: Locator;
    private readonly clearMapFieldsButton: Locator;

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
        this.coordinateDetails = page.getByRole('button', { name: 'Coordinate details', exact: true });
        this.mapLatitudeField = page.locator('#edit-field-location-map-0-lat');
        this.mapLongitudeField = page.locator('#edit-field-location-map-0-lng');
        this.statisticsFields = page.getByRole('combobox', { name: 'Statistics', exact: true });
        this.researchAndSupportFields = page.getByRole('combobox', { name: 'Research and support', exact: true });
        this.addressField = page.getByPlaceholder('Enter Address', { exact: true });
        this.urlAliasField = page.getByRole('textbox', { name: 'URL alias', exact: true });
        this.setMapButton = page.getByRole('button', { name: 'Set Map', exact: true });
        this.clearMapFieldsButton = page.getByRole('button', { name: 'Clear', exact: true });

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

    async enterAddress(address: string)
    {
        await this.testSteps.LogInfo(`Entering "${address}" into the address search field`);
        await this.addressField.fill(address);
    }

    // async openCoordinateDetails()
    // {
    //     const coordinateDetails = this.page.locator('details').filter({
    //         has: this.page.locator('summary').filter({ hasText: /^Coordinate details$/ })
    //     });
    //     if (await coordinateDetails.getAttribute('open') === null)
    //     {
    //         await coordinateDetails.locator('summary').click();
    //     }
    //     await expect(coordinateDetails).toHaveAttribute('open');
    // }

    async clickCoordinateDetails()
    {
        await this.coordinateDetails.click();
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

    // async clickSetMapButton()
    // {
    //     await this.testSteps.LogInfo('Clicking "Set Map" button');
    //     await this.setMapButton.click();
    // }

    // async clearMapFields()
    // {
    //     await this.testSteps.LogInfo('Clicking "Clear" button');
    //     await this.clearMapFieldsButton.click();
    // }

    // enter contact map name
    // async enterMapName(mapName: string)
    // {
    //     await this.testSteps.LogInfo(`Entering "${mapName}" into the Map Name field`);
    //     await this.mapNameField.fill(mapName);
    // }




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

        // Statistics 1 and sublevels
        await this.selectStatistics(data.statistics);
        await this.selectStatisticsLevel1(data.statisticslevel1);
        await this.selectStatisticsLevel2(data.statisticslevel2);
        await this.selectStatisticsLevel3(data.statisticslevel3);
        await this.clickAddAnotherStatistics();
        // Statistics 2 and no sublevels added
        await this.selectStatistics2(data.statistics2);

        // Research and Support 1 and sublevels
        await this.selectResearchAndSupport(data.researchAndSupport);
        await this.selectResearchAndSupportLevel1(data.researchAndSupportlevel1);
        await this.selectResearchAndSupportLevel2(data.researchAndSupportlevel2);
        await this.clickAddAnotherResearchAndSupport();
        // Research and Support 2 and no sublevels added
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
