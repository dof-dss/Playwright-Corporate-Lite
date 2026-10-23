import { Page, Locator, expect } from '@playwright/test';
import { TestSetUpData } from '../../test-data/TestDataObject';

export class SearchPage
{
    // locators 
    private readonly siteSearchField: Locator;
    private readonly siteSearchFieldNISRA: Locator;
    private readonly siteSearchButton: Locator;
    private readonly siteSearchButtonNISRA: Locator;

    // constructor
    constructor(
        private readonly page: Page,
        private testSetUpData: typeof TestSetUpData
    )
    {
        // locators 
        this.siteSearchField = page.locator('#edit-query');
        this.siteSearchFieldNISRA = page.locator('#edit-query--2');

        this.siteSearchButton = page.locator('//input[@id="edit-submit-search"]');
        this.siteSearchButtonNISRA = page.locator('//input[@id="edit-submit-search--2"]');
    }

    // url check using isolated test data for current site being tested using regex to ensure search is included after base url
    async searchPageURLCheck()
    {
        await expect(this.page).toHaveURL(/\/search/);
    }

    // enter content title in site search field 
    async enterContentTitleInSearch(searchTerm: string)
    {
        const searchField = (await this.siteSearchField.isVisible())
            ? this.siteSearchField
            : this.siteSearchFieldNISRA;
        await expect(searchField).toBeEnabled();
        await searchField.fill(searchTerm);
    }

    // click site search button 
    async clickSearchButton()
    {
        const searchButton = (await this.siteSearchButton.isVisible())
            ? this.siteSearchButton
            : this.siteSearchButtonNISRA;
        await searchButton.click();
    }





}