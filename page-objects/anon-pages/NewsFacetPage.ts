import { Page, Locator, expect } from '@playwright/test';
import { TestData, TestSetUpData } from '../../test-data/TestDataObject';

export class NewsFacetPage
{
    // locators 
    private readonly newsFacetSearchField: Locator;
    private readonly newsFacetSearchButton: Locator;
    private readonly facetFilterPublicationDate: Locator;

    // constructor
    constructor(
        private readonly page: Page,
        private readonly testSetUpData: typeof TestSetUpData,
        private readonly testData: typeof TestData
    )
    {
        // locators 
        this.newsFacetSearchField = page.locator('#edit-search--2');
        this.newsFacetSearchButton = page.locator('#edit-submit-news-search--2');
        this.facetFilterPublicationDate = this.page.getByRole('button', { name: 'Publication date' });
    }

    // url check using isolated test data for current site being tested
    async newsPageURLCheck()
    {
        await expect(this.page).toHaveURL(`${this.testSetUpData.urlForTest.url}/news`);
    }

    // enter content title in site search field 
    async enterContentTitleInSearch(searchTerm: string)
    {
        await expect(this.newsFacetSearchField).toBeEnabled();
        await this.newsFacetSearchField.fill(searchTerm);
    }

    // click site search button 
    async clickNewsFacetSearchButton()
    {
        await this.newsFacetSearchButton.click();
    }

    // click news facet filter publication date span
    async clickFacetFilterPubDateSpan()
    {
        await this.facetFilterPublicationDate.click();
    }

    // click news facet filter publication date span
    async clickFacetFilterPubDateFilter()
    {
        const date = new Date();
        const month = date.toLocaleString('en-GB', { month: 'long' });
        const year = date.getFullYear();

        await expect(this.page.locator(`//span[contains(text(),"${year}")]`)).toBeEnabled();
        await this.page.locator(`//span[contains(text(),"${year}")]`).click();

        await expect(this.page.locator(`//span[contains(text(),"${month}")]`)).toBeEnabled();
        await this.page.locator(`//span[contains(text(),"${month}")]`).click();
    }


    // click news facet filter publication date span
    async clickFacetFilterPubDateEditedFilter()
    {
        await this.page.locator('//span[contains(text(),"2025")]').click();
        await this.page.locator('//span[contains(text(),"December")]').click();
    }
}