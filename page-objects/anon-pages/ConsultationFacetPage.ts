import { Page, Locator, expect } from '@playwright/test';
import { TestData, TestSetUpData } from '../../test-data/TestDataObject';

export class ConsultationFacetPage
{
    // locators 
    private readonly consultationFacetSearchField: Locator;
    private readonly consultationFacetSearchButton: Locator;
    private readonly facetFilterConsultationDate: Locator;

    // constructor
    constructor(
        private readonly page: Page,
        private readonly testSetUpData: typeof TestSetUpData,
        private readonly testData: typeof TestData
    )
    {
        // locators 
        this.consultationFacetSearchField = page.locator('#edit-search--2');
        this.consultationFacetSearchButton = page.locator('#edit-submit-consultations-search--2');
        this.facetFilterConsultationDate = this.page.getByRole('button', { name: 'Publication date' });
    }

    // url check using isolated test data for current site being tested
    async consultationPageURLCheck()
    {
        await expect(this.page).toHaveURL(this.testSetUpData.urlForTest.url + '/consultations');
    }

    // enter content title in site search field 
    async enterContentTitleInSearch(searchTerm: string)
    {
        await expect(this.consultationFacetSearchField).toBeEnabled();
        await this.consultationFacetSearchField.fill(searchTerm);
    }

    // click site search button 
    async clickConsultationFacetSearchButton()
    {
        await this.consultationFacetSearchButton.click();
    }

    // click consultation facet filter publication date span
    async clickFacetFilterPubDateSpan()
    {
        await this.facetFilterConsultationDate.click();
    }

    // click consultation facet filter publication date span
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


    // click consultation facet filter publication date span
    async clickFacetFilterPubDateEditedFilter()
    {
        await this.page.locator('//span[contains(text(),"2025")]').click();
        await this.page.locator('//span[contains(text(),"December")]').click();
    }
}