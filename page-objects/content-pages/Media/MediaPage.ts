import { Page, Locator, expect, test } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestSetUpData } from '@tdata/TestDataObject';


export class MediaPage
{
    private readonly testSteps: TestSteps;

    // locators 
    private readonly mediaLibrarySearch: Locator;
    private readonly mediaLibrarySearchButton: Locator;
    private readonly tableViewLink: Locator;
    private readonly gridViewLink: Locator;
    private readonly favouritesViewLink: Locator;
    private readonly addMediaLink: Locator;
    private readonly editMediaButtonTableView: Locator;
    private readonly favouriteMediaButtonGridView: Locator;
    private readonly unfavouriteMediaButtonGridView: Locator;
    private readonly selectAllButtonTableView: Locator;
    private readonly selectActionDropdown: Locator;
    private readonly mediaActionDropdown: Locator;
    private readonly applyToSelectItemsButton: Locator;

    constructor(
        private page: Page,
        // isolated instances of test data
        private testSetUpData: typeof TestSetUpData
    ) 
    {
        this.testSteps = new TestSteps();

        // locators 
        this.mediaLibrarySearch = page.locator('#edit-name');
        this.mediaLibrarySearchButton = page.locator('#edit-submit-media-library');
        this.tableViewLink = page.getByRole('link', { name: 'Table', exact: true });
        this.gridViewLink = page.getByRole('link', { name: 'Grid', exact: true });
        this.favouritesViewLink = page.getByRole('link', { name: 'Favourites', exact: true });
        this.addMediaLink = page.getByRole('link', { name: '+Add media', exact: true });
        this.editMediaButtonTableView = page.getByRole('link', { name: 'Edit', exact: true });
        this.favouriteMediaButtonGridView = page.getByRole('link', { name: 'Favourite', exact: true });
        this.unfavouriteMediaButtonGridView = page.getByRole('link', { name: 'Unfavourite', exact: true });
        this.selectAllButtonTableView = page.locator('input[type="checkbox"][title="Select all rows in this table"]');

        this.selectActionDropdown = page.getByRole('checkbox', { name: 'Select all media' });
        this.mediaActionDropdown = page.getByLabel('Action', { exact: true });
        this.applyToSelectItemsButton = page.getByRole('button', { name: 'Apply to selected items' });
    }

    // media page check 
    async mediaPageURLCheck()
    {
        const expectedMediaUrl = `${this.testSetUpData.urlForTest.url}/admin/content/media`;
        const escapedExpectedMediaUrl = expectedMediaUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        await this.testSteps.LogInfo(`Performing URL check to ensure user is on ${expectedMediaUrl} with optional trailing values`);
        await expect(this.page).toHaveURL(new RegExp(`^${escapedExpectedMediaUrl}.*$`));
    }


    // click "Table" View 
    async clickTableView()
    {
        await expect(this.gridViewLink).toBeVisible();
        await this.testSteps.LogInfo('Clicking "Table"  Button');
        await this.tableViewLink.click();
    }

    // click "Grid" View 
    async clickGridView()
    {
        await expect(this.gridViewLink).toBeVisible();
        await this.testSteps.LogInfo('Clicking "Grid"  Button');
        await this.gridViewLink.click();
    }

    // click Favourite button on "Grid" view of Media Library
    async clickFavouriteMediaButtonGridView()
    {
        await this.page.waitForTimeout(1000);
        await expect(this.favouriteMediaButtonGridView).toBeVisible();
        await this.testSteps.LogInfo('Clicking "Favourite" Button');
        await this.favouriteMediaButtonGridView.click();
    }

    async clickUnfavouriteMediaButtonGridView()
    {
        await this.page.waitForTimeout(1000);
        await expect(this.unfavouriteMediaButtonGridView).toBeVisible();
        await this.testSteps.LogInfo('Clicking "Unfavourite" Button');
        await this.unfavouriteMediaButtonGridView.click();
    }


    // click "Favourties" View 
    async clickFavourtiesView()
    {
        await expect(this.favouritesViewLink).toBeVisible();
        await this.testSteps.LogInfo('Clicking "Favourites"  Button');
        await this.favouritesViewLink.click();
    }

    // enter content title in site search field 
    async enterContentTitleInSearch(searchTerm: string)
    {
        await this.testSteps.LogInfo(`Entering "${searchTerm}" into media library search bar`);

        await expect(this.mediaLibrarySearch).toBeEnabled();
        await this.mediaLibrarySearch.fill(searchTerm);
    }

    // click site search button 
    async clickSearchButton()
    {
        await this.testSteps.LogInfo('Clicking media library "Apply filters" button');
        await this.mediaLibrarySearchButton.click();
    }

    // click +Add media button
    async clickAddMediaButton()
    {
        await expect(this.addMediaLink).toBeVisible();
        await this.testSteps.LogInfo('Clicking "+Add media" Button');
        await this.addMediaLink.click();
    }

    // click Edit button on "Table" view of Media Library
    async clickEditMediaButtonTableView()
    {
        await expect(this.editMediaButtonTableView).toBeVisible();
        await this.testSteps.LogInfo('Clicking "Edit" Button');
        await this.editMediaButtonTableView.click();
    }

    // click Edit button on "Grid" view of Media Library
    async clickEditMediaButtonGridView(searchTerm: string)
    {
        const editMediaLink = this.page.locator(`//a[starts-with(normalize-space(.), 'Edit ') and contains(normalize-space(.), '${searchTerm}')]`);

        await expect(editMediaLink).toBeVisible();
        await this.testSteps.LogInfo('Clicking "Edit" Button');
        await editMediaLink.click();
    }

    // click Delete button on "Grid" view of Media Library
    async clickDeleteMediaButtonGridView(searchTerm: string)
    {
        const deleteMediaLink = this.page.locator(`//a[starts-with(normalize-space(.), 'Delete ') and contains(normalize-space(.), '${searchTerm}')]`);

        await expect(deleteMediaLink).toBeVisible();
        await this.testSteps.LogInfo('Clicking "Delete" Button');
        await deleteMediaLink.click();
    }

    // click Select all button on "Table" view of Media Library
    async deleteMultipleMediaFromBulkOptions()
    {
        await expect(this.selectAllButtonTableView).toBeVisible();
        await this.testSteps.LogInfo('Clicking "Select all" Button');
        await this.selectAllButtonTableView.click();

        await expect(this.mediaActionDropdown).toBeVisible();
        await this.testSteps.LogInfo('Selecting "Delete media" from Actions dropdown');
        await this.mediaActionDropdown.selectOption('media_delete_action');

        await this.applyToSelectItemsButton.click();
    }

    // choose "Delete media" from bulk Actions dropdown
    async deleteSingleMediaFromBulkOptions(searchTerm: string)
    {
        await this.page.waitForTimeout(1000);
        await expect(this.page.getByRole('checkbox', { name: `Select ${searchTerm}` })).toBeVisible();
        await this.page.getByRole('checkbox', { name: `Select ${searchTerm}` }).check();

        await expect(this.mediaActionDropdown).toBeVisible();
        await this.testSteps.LogInfo('Selecting "Delete media" from Actions dropdown');
        await this.mediaActionDropdown.selectOption('media_delete_action');

        await this.applyToSelectItemsButton.click();
    }

    // choose "Publish media" from bulk Actions dropdown
    async choosePublishMediaFromBulkOptions(searchTerm: string)
    {
        await this.page.waitForTimeout(1000);
        await expect(this.page.getByRole('checkbox', { name: `Select ${searchTerm}` })).toBeVisible();
        await this.page.getByRole('checkbox', { name: `Select ${searchTerm}` }).check();

        await expect(this.mediaActionDropdown).toBeVisible();
        await this.testSteps.LogInfo('Selecting "Publish media" from Actions dropdown');
        await this.mediaActionDropdown.selectOption('media_publish_action');

        await this.applyToSelectItemsButton.click();
    }

    // choose "Publish media" from bulk Actions dropdown
    async chooseUnpublishMediaFromBulkOptions(searchTerm: string)
    {
        await this.page.waitForTimeout(1000);
        await expect(this.page.getByRole('checkbox', { name: `Select ${searchTerm}` })).toBeVisible();
        await this.page.getByRole('checkbox', { name: `Select ${searchTerm}` }).check();

        await expect(this.mediaActionDropdown).toBeVisible();
        await this.testSteps.LogInfo('Selecting "Unpublish media" from Actions dropdown');
        await this.mediaActionDropdown.selectOption('media_unpublish_action');

        await this.applyToSelectItemsButton.click();

    }



}

