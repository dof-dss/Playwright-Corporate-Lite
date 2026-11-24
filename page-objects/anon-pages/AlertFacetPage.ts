import { Page, Locator, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestData, TestSetUpData } from '../../test-data/TestDataObject';

export class AlertFacetPage
{
    private readonly testSteps = new TestSteps();

    // locators 
    private readonly alertFacetSearchField: Locator;
    private readonly alertFacetSearchButton: Locator;
    private readonly facetFilteralertDate: Locator;

    // constructor
    constructor(
        private readonly page: Page,
        private readonly testSetUpData: typeof TestSetUpData,
        private readonly testData: typeof TestData
    )
    {
        // locators 
        this.alertFacetSearchField = page.locator('#edit-search-alerts--2');
        this.alertFacetSearchButton = page.locator('#edit-submit-alerts-search--2');

        this.facetFilteralertDate = this.page.getByRole('button', { name: 'Published Date', exact: true });
    }

    // url check using isolated test data for current site being tested
    async alertPageURLCheck()
    {
        await expect(this.page).toHaveURL(this.testSetUpData.urlForTest.url + '/alerts');
    }

    // enter content title in site search field 
    async enterContentTitleInSearch(searchTerm: string)
    {
        await expect(this.alertFacetSearchField).toBeEnabled();
        await this.alertFacetSearchField.fill(searchTerm);
    }

    // click site search button 
    async clickalertFacetSearchButton()
    {
        await this.alertFacetSearchButton.click();
    }

    // click alert facet filter alert published date span
    async clickFacetFilteralertPublishedDateSpan()
    {
        await this.facetFilteralertDate.click();
    }

    // click alert facet filter publication date span
    async clickFacetFilterPubDateFilter()
    {
        const publishedDate = this.testData.Alert.publishedDate;
        const year = Number(publishedDate.slice(0, 4));
        const monthIndex = Number(publishedDate.slice(5, 7)) - 1;
        const month = new Date(year, monthIndex, 1).toLocaleString('en-GB', { month: 'long' });
        const yearOption = this.page.locator('span.facet-item__value').getByText(String(year), { exact: true });

        // Ensure the year is visible before interating with it as if content is not published yet 
        // there may be none of this year available.
        if (this.testSetUpData.moderationStateForTest.moderationState !== this.testSetUpData.validModerationStates.published
            && !(await yearOption.isVisible()))
        {
            await this.testSteps.LogInfo(`The year "${year}" is not visible as content is not published and no other content have this "${year}" assigned`);
            return;
        }

        await expect(yearOption).toBeEnabled();
        await yearOption.click();

        // Ensure the month is visible before interating with it as if content is not published yet 
        // there may be none of this month available.
        const monthOption = this.page.locator(`//span[contains(text(),"${month}")]`);
        if (this.testSetUpData.moderationStateForTest.moderationState !== this.testSetUpData.validModerationStates.published
            && !(await monthOption.isVisible()))
        {
            await this.testSteps.LogInfo(`The month "${month}" is not visible as content is not published and no other content have this "${month}" assigned`);
            return;
        }

        await expect(monthOption).toBeEnabled();
        await monthOption.click();
    }


    // click alert facet filter publication date span
    async clickFacetFilterPubDateEditedFilter()
    {
        const publishedDate = this.testData.Alert.publishedDateEdited;
        const year = Number(publishedDate.slice(0, 4));
        const monthIndex = Number(publishedDate.slice(5, 7)) - 1;
        const month = new Date(year, monthIndex, 1).toLocaleString('en-GB', { month: 'long' });
        const yearOption = this.page.locator('span.facet-item__value').getByText(String(year), { exact: true });

        // Ensure the year is visible before interating with it as if content is not published yet 
        // there may be none of this year available.  
        if (this.testSetUpData.moderationStateForTest.moderationState !== this.testSetUpData.validModerationStates.published
            && !(await yearOption.isVisible()))
        {
            await this.testSteps.LogInfo(`The year "${year}" is not visible as content is not published and no other content have this "${year}" assigned`);
            return;
        }

        await expect(yearOption).toBeEnabled();
        await yearOption.click();

        // Ensure the month is visible before interating with it as if content is not published yet 
        // there may be none of this month available.
        const monthOption = this.page.locator(`//span[contains(text(),"${month}")]`);
        if (this.testSetUpData.moderationStateForTest.moderationState !== this.testSetUpData.validModerationStates.published
            && !(await monthOption.isVisible()))
        {
            await this.testSteps.LogInfo(`The month "${month}" is not visible as content is not published and no other content have this "${month}" assigned`);
            return;
        }

        await expect(monthOption).toBeEnabled();
        await monthOption.click();
    }
}