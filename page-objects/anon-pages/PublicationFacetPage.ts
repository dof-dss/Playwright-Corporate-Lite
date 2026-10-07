import { Page, Locator, expect } from '@playwright/test';
import { TestData, TestSetUpData } from '../../test-data/TestDataObject';

export class PublicationFacetPage
{
    // locators 
    private readonly publicationFacetSearchField: Locator;
    private readonly publicationFacetSearchButton: Locator;
    private readonly facetFilterType: Locator;
    private readonly facetFilterPublicationDate: Locator;

    // constructor
    constructor(
        private readonly page: Page,
        private readonly testSetUpData: typeof TestSetUpData,
        private readonly testData: typeof TestData
    )
    {
        // locators 
        this.publicationFacetSearchField = page.locator('#edit-search--2');
        this.publicationFacetSearchButton = page.locator('#edit-submit-publications-search--2');
        this.facetFilterType = this.page.getByRole('button', { name: 'Publication type' });
        this.facetFilterPublicationDate = this.page.getByRole('button', { name: 'Publication date' });
    }

    // url check using isolated test data for current site being tested
    async publicationPageURLCheck()
    {
        await expect(this.page).toHaveURL(`${this.testSetUpData.urlForTest.url}/publications`);
    }

    // enter content title in site search field 
    async enterContentTitleInSearch(searchTerm: string)
    {
        await expect(this.publicationFacetSearchField).toBeEnabled();
        await this.publicationFacetSearchField.fill(searchTerm);
    }

    // click site search button 
    async clickPublicationFacetSearchButton()
    {
        await this.publicationFacetSearchButton.click();
    }

    // click publication facet filter topic span
    async clickFacetFilterTypeSpan()
    {
        await this.facetFilterType.click();
    }

    // click publication facet filter topic span
    async clickFacetFilterTypeFilter()
    {
        await this.page.locator(`//a/span[contains(text(),"${this.testData.Publication.publicationType}")]`).click();
    }

    // click publication facet filter topic span
    async clickFacetFilterTypeEditedFilter()
    {
        await this.page.locator(`//a/span[contains(text(),"${this.testData.Publication.publicationTypeEdited}")]`).click();
    }

    // click publication facet filter publication date span
    async clickFacetFilterPubDateSpan()
    {
        await this.facetFilterPublicationDate.click();
    }

    // click publication facet filter publication date span
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


    // click publication facet filter publication date span
    async clickFacetFilterPubDateEditedFilter()
    {
        await this.page.locator('//span[contains(text(),"2025")]').click();
        await this.page.locator('//span[contains(text(),"December 2025")]').click();
    }
}