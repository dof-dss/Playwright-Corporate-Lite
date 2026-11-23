import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { expect } from '@playwright/test';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export interface VerifyOptions
{
    preview?: boolean;
    expectedTitle?: string;
};

export class FeatureNodePage
{
    // logging
    private readonly testSteps: TestSteps;

    // constructor
    constructor(
        private readonly page: Page,
        // isolated instances of test data 
        private testSetUpData: typeof TestSetUpData,
        private testData: typeof TestData
    )
    {
        // logging isolated instance
        this.testSteps = new TestSteps();
    }

    // -------------------- URL CHECK --------------------

    // check url after saving create feature
    async featureNodeURLCheck(expectedTitle?: string)
    {
        const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();
        const titleToCheck = escapeRegex(expectedTitle ?? this.testSetUpData.contentTitleforTest.contentTitle);

        await this.testSteps.LogInfo(`Verifying URL path is /feature/${titleToCheck} with optional -suffix and optional trailing path, or is /node/.+`);
        await expect(this.page).toHaveURL(
            new RegExp(`(?:${this.testSetUpData.urlForTest.url}/feature/${titleToCheck}(?:-[^/]+)?(?:/.*)?$)|(?:/node/.+)`)
        );
    }

    // -------------------- Verify Feature methods --------------------

    // verify feature title is visible
    async verifyFeatureTitle(expectedTitle?: string)
    {
        const titleToVerify = expectedTitle ?? this.testSetUpData.contentTitleforTest.contentTitle;
        await this.testSteps.LogInfo(`Verifying title "${titleToVerify}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1 })).toHaveText(titleToVerify);
    }

    // verify feature link URL is visible
    async verifyFeatureLinkURL(expectedLinkURL?: string)
    {
        const linkURLToVerify = expectedLinkURL ?? (this.testData.Feature?.linkURL || '');
        await this.testSteps.LogInfo(`Verifying Link URL "${linkURLToVerify}" is visible`);
        const content = this.page.getByRole('main');
        await expect(content.getByText(linkURLToVerify)).toBeVisible();
    }

    // verify feature teaser is visible
    async verifyFeatureTeaser(expectedTeaser?: string)
    {
        const teaserToVerify = expectedTeaser ?? (this.testData.Feature?.teaser || '');
        await this.testSteps.LogInfo(`Verifying Teaser "${teaserToVerify}" is visible`);
        const content = this.page.getByRole('main');
        await expect(content.getByText(teaserToVerify)).toBeVisible();
    }

    // verify feature photo/media is displayed
    async verifyFeaturePhotoDisplayed()
    {
        await this.testSteps.LogInfo('Verifying Feature Photo is displayed');
        const mainContent = this.page.getByRole('main');
        const image = mainContent.locator('img').first();
        await expect(image).toBeVisible();
    }

    // verify feature moderation state is visible
    async verifyModerationState(expectedState?: string)
    {
        const stateToVerify = expectedState ?? 'Draft';
        await this.testSteps.LogInfo(`Verifying Moderation state "${stateToVerify}" is visible`);
        const content = this.page.getByRole('main');
        await expect(content.getByText(stateToVerify)).toBeVisible();
    }

    async verifyFeature({ preview, expectedTitle }: VerifyOptions = {})
    {
        await this.featureNodeURLCheck(expectedTitle);

        const titleToVerify = expectedTitle ?? this.testSetUpData.contentTitleforTest.contentTitle;
        const mainContent = this.page.getByRole('main');

        await this.testSteps.LogInfo(`Verifying title "${titleToVerify}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1 })).toHaveText(titleToVerify);

        await this.testSteps.LogInfo(`Verifying Teaser "${this.testData.Feature.teaser}" is visible`);
        await expect(mainContent.getByText(this.testData.Feature.teaser)).toBeVisible();

        await this.testSteps.LogInfo('Verifying Feature Photo is displayed');
        await expect(mainContent.locator('img').first()).toBeVisible();

        if (!preview)
        {
            const linkURL = this.testData.Feature.linkURL;
            const isAbsoluteURL = /^https?:\/\//i.test(linkURL);
            const href = isAbsoluteURL
                ? linkURL
                : `/feature/${linkURL.trim().toLowerCase().replace(/['\u2019]/g, '').replace(/[\s-]+/g, '-')}`;
            const cardLink = mainContent.locator(`a.card[href="${href}"]`);

            await this.testSteps.LogInfo(`Verifying Feature card links to "${href}"`);
            await expect(cardLink).toBeVisible();
            await cardLink.click();

            await this.testSteps.LogInfo(`Verifying URL "${href}"`);
            await expect(this.page).toHaveURL(url => (isAbsoluteURL ? url.href : url.pathname) === href);

            if (!isAbsoluteURL)
            {
                await expect(this.page.getByRole('heading', { level: 1 })).toHaveText(linkURL);
            }

            await this.page.goBack();
        }
    }



    async verifyEditedFeature({ preview, expectedTitle }: VerifyOptions = {})
    {
        const titleToVerify = expectedTitle ?? this.testSetUpData.contentTitleforTest.contentTitle;
        await this.featureNodeURLCheck(titleToVerify);

        const mainContent = this.page.getByRole('main');

        await this.testSteps.LogInfo(`Verifying edited title "${titleToVerify}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1 })).toHaveText(titleToVerify);

        await this.testSteps.LogInfo(`Verifying edited teaser "${this.testData.Feature.teaserEdited}" is visible`);
        await expect(mainContent.getByText(this.testData.Feature.teaserEdited)).toBeVisible();

        await this.testSteps.LogInfo('Verifying Feature Photo is displayed');
        await expect(mainContent.locator('img').first()).toBeVisible();

        if (!preview)
        {
            // Start waiting for the new tab before the click
            const pagePromise = this.page.context().waitForEvent('page');

            const cardLink = this.page.getByRole('main').locator(`a.card[href="${this.testData.Feature.linkURLEdited}"]`);

            await this.testSteps.LogInfo(`Verifying Feature card links to "${this.testData.Feature.linkURLEdited}"`);
            await expect(cardLink).toBeVisible();
            await cardLink.click();
            // Wait for the new page object to be ready
            const newTab = await pagePromise;
            // verify link by checking url of new page 
            await this.testSteps.LogInfo(`Verifying URL "${this.testData.Feature.linkURLEdited}"`);
            await expect(newTab).toHaveURL(this.testData.Feature.linkURLEdited);
            // close new tab
            await this.testSteps.LogInfo('Closing new tab, navigated back to previous page ');
            await newTab.close();
        }
    }
}

