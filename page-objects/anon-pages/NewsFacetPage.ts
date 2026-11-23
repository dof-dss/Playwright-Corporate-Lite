import { Page, Locator, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestData, TestSetUpData } from '../../test-data/TestDataObject';

export class NewsFacetPage
{
    private readonly testSteps = new TestSteps();

    // locators 
    private readonly newsFacetSearchField: Locator;
    private readonly newsFacetSearchButton: Locator;
    private readonly facetFilterNewsType: Locator;
    private readonly facetFilterNewsTopic: Locator;
    private readonly facetFilterPublicationDate: Locator;

    // constructor
    constructor(
        private readonly page: Page,
        private readonly testSetUpData: typeof TestSetUpData,
        private readonly testData: typeof TestData
    )
    {
        // locators 
        this.newsFacetSearchField = page.locator('#edit-search-news--2');
        this.newsFacetSearchButton = page.locator('#edit-submit-news-search--2');
        this.facetFilterNewsType = this.page.getByRole('button', { name: 'News type', exact: true });
        this.facetFilterNewsTopic = this.page.getByRole('button', { name: 'News topic', exact: true });
        this.facetFilterPublicationDate = this.page.getByRole('button', { name: 'News date', exact: true })
            .or(this.page.getByRole('button', { name: 'Publication date', exact: true })).first();
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

    async selectFacetFilterNewsType(edited: boolean = false)
    {
        const newsType = edited ? this.testData.News.newsTypeEdited : this.testData.News.newsType;
        if (await this.facetFilterNewsType.getAttribute('aria-expanded') !== 'true')
        {
            await this.facetFilterNewsType.click();
        }

        const newsTypeOption = this.page.locator('a.facet-item--link').filter({ hasText: newsType });
        if (this.testSetUpData.moderationStateForTest.moderationState !== this.testSetUpData.validModerationStates.published
            && !(await newsTypeOption.isVisible()))
        {
            await this.testSteps.LogInfo(`News type "${newsType}" is not available for unpublished content`);
            return;
        }

        await expect(newsTypeOption).toBeEnabled();
        await newsTypeOption.click();
    }

    async selectFacetFilterNewsTopic(edited: boolean = false)
    {
        const topics = edited
            ? this.testData.News.topicsEdited
            : this.testData.News.topics;

        for (const topic of topics.slice(0, 2))
        {
            if (await this.facetFilterNewsTopic.getAttribute('aria-expanded') !== 'true')
            {
                await this.facetFilterNewsTopic.click();
            }

            const topicOption = this.page.locator('a.facet-item--link').filter({ hasText: topic });
            if (this.testSetUpData.moderationStateForTest.moderationState !== this.testSetUpData.validModerationStates.published
                && !(await topicOption.isVisible()))
            {
                await this.testSteps.LogInfo(`News topic "${topic}" is not available for unpublished content`);
                continue;
            }

            await expect(topicOption).toBeEnabled();
            await topicOption.click();
        }
    }

    // click news facet filter publication date span
    async clickFacetFilterPubDateSpan()
    {
        await this.facetFilterPublicationDate.click();
    }

    // click news facet filter publication date span
    async clickFacetFilterPubDateFilter()
    {
        await this.selectNewsDateFilter(this.testData.News.publicationDate);
    }


    // click news facet filter publication date span
    async clickFacetFilterPubDateEditedFilter()
    {
        await this.selectNewsDateFilter(this.testData.News.publicationDateEdited);
    }

    private async selectNewsDateFilter(publishedDate: string)
    {
        const year = Number(publishedDate.slice(0, 4));
        const monthIndex = Number(publishedDate.slice(5, 7)) - 1;
        const month = new Date(year, monthIndex, 1).toLocaleString('en-GB', { month: 'long' });
        const yearOption = this.page.locator('span.facet-item__value').getByText(String(year), { exact: true });

        if (this.testSetUpData.moderationStateForTest.moderationState !== this.testSetUpData.validModerationStates.published
            && !(await yearOption.isVisible()))
        {
            await this.testSteps.LogInfo(`News date year "${year}" is not available for unpublished content`);
            return;
        }

        await expect(yearOption).toBeEnabled();
        await yearOption.click();

        const monthOption = this.page.locator('a.facet-item--link').filter({ hasText: month });
        if (this.testSetUpData.moderationStateForTest.moderationState !== this.testSetUpData.validModerationStates.published
            && !(await monthOption.isVisible()))
        {
            await this.testSteps.LogInfo(`News date month "${month}" is not available for unpublished content`);
            return;
        }

        await expect(monthOption).toBeEnabled();
        await monthOption.click();
    }
}