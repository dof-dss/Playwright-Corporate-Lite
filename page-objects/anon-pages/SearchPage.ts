import { Page, Locator, expect } from '@playwright/test';
import { TestSetUpData } from '../../test-data/TestDataObject';

export class SearchPage
{
    // locators 
    private readonly siteSearchField: Locator;
    private readonly siteSearchButton: Locator;

    // constructor
    constructor(
        private readonly page: Page,
        private testSetUpData: typeof TestSetUpData
    )
    {
        // locators 
        this.siteSearchField = page.locator('#edit-query');
        this.siteSearchButton = page.locator('//input[@id="edit-submit-search"]');
    }

    // url check using isolated test data for current site being tested using regex to ensure search is included after base url
    async searchPageURLCheck()
    {
        await expect(this.page).toHaveURL(/\/search/);
    }

    // enter content title in site search field 
    async enterContentTitleInSearch(searchTerm: string)
    {
        await expect(this.siteSearchField).toBeEnabled();
        await this.siteSearchField.fill(searchTerm)
    }

    // click site search button 
    async clickSearchButton()
    {
        await this.siteSearchButton.click();
    }





}