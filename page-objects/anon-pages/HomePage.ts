import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '@poms/base-pages/BasePage';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestData, TestSetUpData } from '../../test-data/TestDataObject';

export interface ContentEdited
{
    edited: boolean;
};

export class HomePage
{
    // logging
    private readonly testSteps: TestSteps;

    // locators 
    private readonly siteSearchField: Locator;
    private readonly siteSearchButton: Locator;
    private readonly conultationNavBarLink: Locator;
    private readonly moreNewsLink: Locator;
    private readonly publicationNavBarLink: Locator;


    // constructor
    constructor(
        private readonly page: Page,
        private testData: typeof TestData,
        private testSetUpData: typeof TestSetUpData,
    )
    {
        // logging isolated instance
        this.testSteps = new TestSteps();

        // locators 
        this.siteSearchField = page.locator('#edit-query');
        this.siteSearchButton = page.locator('#edit-submit-search');
        this.conultationNavBarLink = this.page.getByRole('link', { name: 'Latest Consultations' });
        this.moreNewsLink = this.page.getByRole('link', { name: 'News', exact: true });
        this.publicationNavBarLink = this.page.getByRole('link', { name: 'Publications', exact: true });
    }

    async navigateToHome()
    {
        const activeHome = this.page.locator('span.active.nav-link').filter({ hasText: /^Home$/ });

        if (!(await activeHome.isVisible()))
        {
            await this.page.getByRole('link', { name: 'Home', exact: true }).first().click();
        }

        await this.homePageURLCheck();
    }

    async navigateToService(service: string)
    {
        const activeService = this.page.locator('span.active.nav-link').and(this.page.getByText(service, { exact: true }));

        if (!(await activeService.isVisible()))
        {
            await this.page.getByRole('link', { name: service, exact: true }).click();
        }
    }

    // url check using isolated test data for current site being tested
    async homePageURLCheck()
    {
        await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}" and user is on home page`);
        await expect(this.page).toHaveURL(this.testSetUpData.urlForTest.url);
    }

    // enter content title in site search field 
    async enterContentTitleInSearch(searchTerm: string)
    {
        await this.testSteps.LogInfo(`Entering "${searchTerm}" imto home page site search bar`);

        await expect(this.siteSearchField).toBeEnabled();
        await this.siteSearchField.fill(searchTerm);
    }

    // click site search button 
    async clickSearchButton()
    {
        await this.testSteps.LogInfo('Clicking site search button');
        await this.siteSearchButton.click();
    }

    // click consultation nav bar link
    async clickConsultationNavLink()
    {
        await this.testSteps.LogInfo('Clicking Consultation nav bar link');
        await this.conultationNavBarLink.click();
    }

    // click more news link 
    async clickNewsLink()
    {
        await this.testSteps.LogInfo('Clicking News nav bar link');
        await this.moreNewsLink.click();
    }

    // click Publication nav bar link
    async clickPublicationNavLink()
    {
        await this.testSteps.LogInfo('Clicking Publication nav bar link');
        await this.publicationNavBarLink.click();
    }

    // verify only 8 items can be on the Links section of the home page, if more than 8 items are present, test will fail
    async verifyLinksMaxItems(maxItems: number = 8)
    {
        const section = this.testData.Link.linkType;
        const sectionHeading = this.page.getByRole('heading', { name: section, exact: true });
        const sectionItems = this.page.locator(`//h2[normalize-space()="${section}"]/following-sibling::*//ul[contains(@class,"list--hyphen-bullet")][1]/li`);

        await expect(sectionHeading).toBeVisible();

        const sectionCount = await sectionItems.count();
        await this.testSteps.LogInfo(`${section} contains ${sectionCount} item(s). Maximum allowed is ${maxItems}.`);
        expect(sectionCount).toBeLessThanOrEqual(maxItems);
    }

    private getLinkLocator(sectionHeading: string, title: string): Locator
    {
        return this.page.locator(`//h2[normalize-space()="${sectionHeading}"]/following-sibling::*//li/a[text()="${title}"]`);
    }

    async verifyLink({ edited }: ContentEdited)
    {
        const title = edited ? this.testData.Link.titleEdited : this.testData.Link.title;
        const linkType = edited ? this.testData.Link.linkTypeEdited : this.testData.Link.linkType;
        const sectionByLinkType: Record<string, string> = {
            'Data tools / Popular links': 'Data tools / Popular links',
            'Popular statistics': 'Popular statistics',
        };
        const allSections = Object.values(sectionByLinkType);
        const expectedSection = sectionByLinkType[linkType];
        const moderationState = this.testSetUpData.moderationStateForTest.moderationState;
        const isPublished = moderationState === this.testSetUpData.validModerationStates.published;
        const publishedLink = this.page.getByRole('link', { name: title });

        if (!isPublished)
        {
            await this.testSteps.LogInfo(`Verifying "${moderationState}" "${linkType}" "${title}" is not visible in any section`);
            await expect(publishedLink).toBeHidden();
            return;
        }
        else
        {
            await this.testSteps.LogInfo(`Verifying Published "${linkType}" "${title}" is visible on the homepage`);
            await expect(publishedLink).toBeVisible();
            if (expectedSection)
            {
                for (const section of allSections)
                {
                    const sectionLink = this.getLinkLocator(section, title);
                    if (section === expectedSection)
                    {
                        await expect(sectionLink).toBeVisible();
                    }
                    else
                    {
                        await expect(sectionLink).toBeHidden();
                    }
                }
            }
        }

    }
}