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
        this.conultationNavBarLink = this.page.getByRole('link', { name: 'Consultations', exact: true });
        this.moreNewsLink = this.page.getByRole('link', { name: 'More news...', exact: true });
        this.publicationNavBarLink = this.page.getByRole('link', { name: 'Publications', exact: true });
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
    async clickMoreNewsLink()
    {
        await this.testSteps.LogInfo('Clicking More news... link');
        await this.moreNewsLink.click();
    }

    // click Publication nav bar link
    async clickPublicationNavLink()
    {
        await this.testSteps.LogInfo('Clicking Publication nav bar link');
        await this.publicationNavBarLink.click();
    }

    // verify only 9 items can be on the quick links section of the home page, if more than 9 items are present, test will fail
    async verifyQuickLinksMaxItems(maxItems: number = 9)
    {
        const quickLinksSection = this.page.locator('//section[contains(@class,"section-front--quick-links")]');
        const quickLinksHeading = quickLinksSection.locator('//h2[normalize-space()="Quick links"]');
        const quickLinksItems = quickLinksSection.locator('//h2[normalize-space()="Quick links"]/following-sibling::div[1]//ul[contains(@class,"list--hyphen-bullet")][1]/li');

        await expect(quickLinksSection).toBeVisible();
        await expect(quickLinksHeading).toBeVisible();

        const quickLinksCount = await quickLinksItems.count();
        await this.testSteps.LogInfo(`Quick links contains ${quickLinksCount} item(s). Maximum allowed is ${maxItems}.`);
        expect(quickLinksCount).toBeLessThanOrEqual(maxItems);
    }

    private getLinkLocator(sectionHeading: string, title: string): Locator
    {
        return this.page.locator(`//h2[text()="${sectionHeading}"]/following-sibling::div//li/a[text()="${title}"]`);
    }

    async verifyLink({ edited }: ContentEdited)
    {
        const title = edited ? this.testData.Link.titleEdited : this.testData.Link.title;
        const linkType = edited ? this.testData.Link.linkTypeEdited : this.testData.Link.linkType;
        const sectionByLinkType: Record<string, string> = {
            'Quick link': 'Quick links',
            'Agency link': 'We work with these bodies',
            'Corporate link': 'Corporate information',
        };
        const allSections = Object.values(sectionByLinkType);
        const expectedSection = sectionByLinkType[linkType];
        const moderationState = this.testSetUpData.moderationStateForTest.moderationState;
        const isPublished = moderationState === this.testSetUpData.validModerationStates.published;

        expect(expectedSection, `Unsupported link type: ${linkType}`).toBeDefined();

        if (!isPublished)
        {
            await this.testSteps.LogInfo(`Verifying "${moderationState}" "${linkType}" "${title}" is not visible in any section`);

            for (const section of allSections)
            {
                await expect(this.getLinkLocator(section, title)).toBeHidden();
            }

            return;
        }
        else
        {
            await this.testSteps.LogInfo(`Verifying Published "${linkType}" "${title}" is visible in the ${expectedSection} section and not visible in the other sections`);

            for (const section of allSections)
            {
                const locator = this.getLinkLocator(section, title);

                if (section === expectedSection)
                {
                    await expect(locator).toBeVisible();
                }
                else
                {
                    await expect(locator).toBeHidden();
                }
            }
        }

    }
}