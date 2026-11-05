import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { expect } from '@playwright/test';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export interface VerifyOptions
{
};

export class PublicationNodePage
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

    // check url after saving create publication
    async publicationNodeURLCheck()
    {
        // escapeRegex removes all white space and replaces with '-', where '-' already exists and surrounded by 
        // white space it will just remove surrounding white space and converts all characters to lower case.
        const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();
        await this.testSteps.LogInfo(`Verifying URL path is /publications/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)} with optional -suffix and optional trailing path, or is /node/.+/latest`);
        await expect(this.page).toHaveURL(
            new RegExp(`(?:${this.testSetUpData.urlForTest.url}/publications/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)}(?:-[^/]+)?(?:/.*)?$)|(?:/node/.+/latest)`)
        );
    }

    // -------------------- Verify Publication methods --------------------

    //verify publication method
    async verifyPublication(_: VerifyOptions)
    {
        const publication = this.testData.Publication;
        const statistics = publication.statistics[publication.statistics.length - 1];
        const research = publication.research[publication.research.length - 1];
        const attachmentName = this.testData.Media.attachmentName;

        await this.testSteps.LogInfo(`Verifying title "${publication.title}"`);
        await expect(this.page.getByRole('heading', {
            level: 1, exact: true
        })).toHaveText(publication.title);

        await this.testSteps.LogInfo(`Verifying Date published "${publication.verifyDatePublished}"`);
        const publishedDate = this.page.locator(
            '//span[contains(text(),"Date published:")]//following-sibling::span/time'
        );
        await expect(publishedDate).toBeVisible();
        await expect(publishedDate).toHaveText(publication.verifyDatePublished);

        await this.testSteps.LogInfo('Verifying Last updated is not visible');
        await expect(this.page.getByText('Last updated:', { exact: true })).toBeHidden();

        await this.testSteps.LogInfo(`Verifying Statistics "${statistics}"`);
        await expect(this.page.getByText('Statistics:', { exact: true })).toBeVisible();
        await expect(this.page.getByRole('link', {
            name: statistics, exact: true
        })).toBeVisible();

        await this.testSteps.LogInfo(`Verifying Research and support "${research}"`);
        await expect(this.page.getByText('Research and support:', { exact: true })).toBeVisible();
        await expect(this.page.getByRole('link', {
            name: research, exact: true
        })).toBeVisible();

        await this.testSteps.LogInfo(`Verifying Summary "${publication.summary}"`);
        await expect(this.page.getByText(publication.summary, { exact: true })).toBeVisible();

        await this.testSteps.LogInfo(`Verifying Body "${publication.body}"`);
        await expect(this.page.getByText(publication.body, { exact: true })).toBeVisible();

        await this.testSteps.LogInfo(`Verifying Documents and attachment "${attachmentName}"`);
        await expect(this.page.getByRole('heading', {
            name: 'Documents', exact: true
        })).toBeVisible();
        const attachmentLink = this.page.locator('a.file-link.file--ico__pdf')
            .filter({ hasText: attachmentName });
        await expect(attachmentLink).toBeVisible();

        await this.testSteps.LogInfo('Verifying PDF format and file size');
        const attachmentMetadata = attachmentLink.locator('span.meta');
        await expect(attachmentMetadata).toBeVisible();
        await expect(attachmentMetadata).toHaveText(/^Adobe PDF \(\d+(?:\.\d+)? KB\)$/);

        await this.testSteps.LogInfo('Verifying Help viewing documents link');
        await expect(this.page.getByRole('link', {
            name: 'Help viewing documents', exact: true
        })).toBeVisible();
    }


    //verify edited publication method
    async verifyEditedPublication(_: VerifyOptions)
    {
        const publication = this.testData.Publication;
        const statistics = publication.statisticsEdited[publication.statisticsEdited.length - 1];
        const research = publication.researchEdited[publication.researchEdited.length - 1];
        const attachmentName = this.testData.Media.attachmentNameEdited;
        const publishedDateText = new Date(`${publication.datePublished}T00:00:00`).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

        await this.testSteps.LogInfo(`Verifying title "${publication.titleEdited}"`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(publication.titleEdited);

        await this.testSteps.LogInfo(`Verifying Date published "${publishedDateText}"`);
        const publishedDate = this.page.locator(
            '//span[contains(text(),"Date published:")]//following-sibling::span/time'
        );
        await expect(publishedDate).toBeVisible();
        await expect(publishedDate).toHaveText(publishedDateText);

        await this.testSteps.LogInfo(`Verifying Statistics "${statistics}"`);
        await expect(this.page.getByText('Statistics:', { exact: true })).toBeVisible();
        await expect(this.page.getByRole('link', { name: statistics, exact: true })).toBeVisible();

        await this.testSteps.LogInfo(`Verifying Research and support "${research}"`);
        await expect(this.page.getByText('Research and support:', { exact: true })).toBeVisible();
        await expect(this.page.getByRole('link', { name: research, exact: true })).toBeVisible();

        await this.testSteps.LogInfo(`Verifying Summary "${publication.summaryEdited}"`);
        await expect(this.page.getByText(publication.summaryEdited, { exact: true })).toBeVisible();

        await this.testSteps.LogInfo(`Verifying Body "${publication.bodyEdited}"`);
        await expect(this.page.getByText(publication.bodyEdited, { exact: true })).toBeVisible();

        await this.testSteps.LogInfo(`Verifying Documents and attachment "${attachmentName}"`);
        await expect(this.page.getByRole('heading', { name: 'Documents', exact: true })).toBeVisible();
        const attachmentLink = this.page.locator('a.file-link.file--ico__pdf')
            .filter({ hasText: attachmentName });
        await expect(attachmentLink).toBeVisible();

        await this.testSteps.LogInfo('Verifying PDF format and file size');
        const attachmentMetadata = attachmentLink.locator('span.meta');
        await expect(attachmentMetadata).toBeVisible();
        await expect(attachmentMetadata).toHaveText(/^Adobe PDF \(\d+(?:\.\d+)? KB\)$/);

        await this.testSteps.LogInfo('Verifying Help viewing documents link');
        await expect(this.page.getByRole('link', { name: 'Help viewing documents', exact: true })).toBeVisible();
    }

    //verify publication method
    async verifyExternalLinkPublication(_: VerifyOptions)
    {
        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testData.Publication.title}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.Publication.title);

        // verify summary
        await this.testSteps.LogInfo(`Verifying Summary "${this.testData.Publication.summary}" is visible`);
        await expect(this.page.getByText(this.testData.Publication.summary)).toBeVisible();

        // verify body field
        await this.testSteps.LogInfo(`Verifying Body "${this.testData.Publication.body}" is visible`);
        await expect(this.page.getByText(this.testData.Publication.body)).toBeVisible();

        // external link verification
        // Start waiting for the new tab before the click
        const pagePromise = this.page.context().waitForEvent('page');
        // click application link text
        await this.testSteps.LogInfo(`Clicking Link "${this.testData.Publication.linkTextPubllication}"`);
        await this.page.getByRole('link', { name: this.testData.Publication.linkTextPubllication }).click();
        // Wait for the new page object to be ready
        const newTab = await pagePromise;
        // verify link by checking url of new page 
        await this.testSteps.LogInfo(`Verifying URL "${this.testData.Publication.externalPublication}"`);
        await expect(newTab).toHaveURL(this.testData.Publication.externalPublication);
        // close new tab
        await this.testSteps.LogInfo('Closing new tab, navigated back to previous page ');
        await newTab.close();
    }


    //verify edited publication method
    async verifyEditedExternalLinkPublication(_: VerifyOptions)
    {
        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testData.Publication.titleEdited}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.Publication.titleEdited);

        // verify summary
        await this.testSteps.LogInfo(`Verifying Summary "${this.testData.Publication.summaryEdited}" is visible`);
        await expect(this.page.getByText(this.testData.Publication.summaryEdited)).toBeVisible();

        // verify body field
        await this.testSteps.LogInfo(`Verifying Body "${this.testData.Publication.bodyEdited}" is visible`);
        await expect(this.page.getByText(this.testData.Publication.bodyEdited)).toBeVisible();

        // external link verification
        // Start waiting for the new tab before the click
        const pagePromise = this.page.context().waitForEvent('page');
        // click application link text
        await this.testSteps.LogInfo(`Clicking Link "${this.testData.Publication.linkTextPubllicationEdited}"`);
        await this.page.getByRole('link', { name: this.testData.Publication.linkTextPubllicationEdited }).click();
        // Wait for the new page object to be ready
        const newTab = await pagePromise;
        // verify link by checking url of new page 
        await this.testSteps.LogInfo(`Verifying URL "${this.testData.Publication.externalPublicationEdited}"`);
        await expect(newTab).toHaveURL(this.testData.Publication.externalPublicationEdited);
        // close new tab
        await this.testSteps.LogInfo('Closing new tab, navigated back to previous page ');
        await newTab.close();
    }

}