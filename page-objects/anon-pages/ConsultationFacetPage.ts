import { Page, Locator, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestData, TestSetUpData } from '../../test-data/TestDataObject';

export class ConsultationFacetPage
{
    private readonly testSteps = new TestSteps();

    // locators 
    private readonly consultationFacetSearchField: Locator;
    private readonly consultationFacetSearchButton: Locator;
    private readonly facetFilterConsultationDate: Locator;
    private readonly facetFilterConsultationTopic: Locator;

    // constructor
    constructor(
        private readonly page: Page,
        private readonly testSetUpData: typeof TestSetUpData,
        private readonly testData: typeof TestData
    )
    {
        // locators 
        this.consultationFacetSearchField = page.locator('#edit-search-consultations--2');
        this.consultationFacetSearchButton = page.locator('#edit-submit-consultation-search--2');

        this.facetFilterConsultationTopic = this.page.getByRole('button', { name: 'Consultation Topic', exact: true });


        this.facetFilterConsultationDate = this.page.getByRole('button', { name: 'Published Date', exact: true });
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


    // Click consultation facet filter consultation Topic span
    async clickFacetFilterConsultationTopicSpan()
    {
        await this.facetFilterConsultationTopic.click();
    }

    async selectFacetFilterConsultationTopic(edited: boolean = false)
    {
        const topics = edited
            ? [this.testData.Consultation.consultationSiteTopicEdited, this.testData.Consultation.consultationSiteTopic2Edited]
            : [this.testData.Consultation.consultationSiteTopic, this.testData.Consultation.consultationSiteTopic2];

        for (const topic of topics)
        {
            if (topic.trim().toLowerCase() === '- none -')
            {
                continue;
            }

            if (await this.facetFilterConsultationTopic.getAttribute('aria-expanded') !== 'true')
            {
                await this.facetFilterConsultationTopic.click();
            }

            const topicLink = this.page.locator('a.facet-item--link').filter({ hasText: topic });
            if (this.testSetUpData.moderationStateForTest.moderationState !== this.testSetUpData.validModerationStates.published
                && !(await topicLink.isVisible())
            )
            {
                await this.testSteps.LogInfo(`Consultation topic "${topic}" is not visible as content is not published and no other content have this "${topic}" assigned`);
                continue;
            }

            await expect(topicLink).toBeEnabled();
            await topicLink.click();

        }
    }


    // click consultation facet filter consultation published date span
    async clickFacetFilterConsultationPublishedDateSpan()
    {
        await this.facetFilterConsultationDate.click();
    }

    // click consultation facet filter publication date span
    async clickFacetFilterPubDateFilter()
    {
        const publishedDate = this.testData.Consultation.datePublished;
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


    // click consultation facet filter publication date span
    async clickFacetFilterPubDateEditedFilter()
    {
        const publishedDate = this.testData.Consultation.datePublishedEdited;
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