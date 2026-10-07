import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { expect } from '@playwright/test';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData, galleryImageDetails } from '../../../test-data/TestDataObject';
import path from 'path';

export interface VerifyOptions
{
    preview: boolean;
    existingImageName?: string;
};

export interface VerifyGalleryAnonOptions
{
    existingImageName?: string;
};

export class GalleryNodePage
{
    // logging
    private readonly testSteps: TestSteps;

    // constructor
    constructor(
        private readonly page: Page,
        // isolated instances of test data 
        private testSetUpData: typeof TestSetUpData,
        private testData: typeof TestData,
        private GalleryImageDetails: typeof galleryImageDetails
    )
    {
        // logging isolated instance
        this.testSteps = new TestSteps();

    }

    // -------------------- URL CHECK --------------------

    // check url after saving create gallery
    async galleryNodeURLCheck()
    {
        // escapeRegex removes all white space and replaces with '-', where '-' already exists and surrounded by 
        // white space it will just remove surrounding white space and converts all characters to lower case.
        const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();
        await this.testSteps.LogInfo(`Verifying URL path is /galleries/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)} with optional -suffix and optional trailing path, or is /node/.+/latest`);
        await expect(this.page).toHaveURL(
            new RegExp(`(?:${this.testSetUpData.urlForTest.url}/galleries/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)}(?:-[^/]+)?(?:/.*)?$)|(?:/node/.+/latest)`)
        );
    }

    // -------------------- Verify Gallery methods --------------------
    async verifyGallery({ preview, existingImageName }: VerifyOptions)
    {

        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testData.Gallery.title}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.Gallery.title);

        // verify summary
        await this.testSteps.LogInfo(`Verifying Summary "${this.testData.Gallery.summary}" is visible`);
        await expect(this.page.getByText(this.testData.Gallery.summary)).toBeVisible();

        // verify body field
        await this.testSteps.LogInfo(`Verifying Body "${this.testData.Gallery.body}" is visible`);
        await expect(this.page.getByText(this.testData.Gallery.body)).toBeVisible();

        // verify images
        if (!preview && !existingImageName)
        {
            await this.testSteps.LogInfo('Verifying Images are all successfully uploaded');
            let i = 1;
            for (const img of galleryImageDetails)
            {
                const { alt, title, caption } = img;

                await this.page.waitForTimeout(1000);

                await this.testSteps.LogInfo(`Verifying image ${i} is visible`);
                await expect(this.page.locator(`//img[@alt="${alt}"]`)).toBeEnabled();

                await this.testSteps.LogInfo(`Verifying image ${i} Alt text "${alt}" is visible`);
                await expect(this.page.locator(`//img[@alt="${alt}"]`)).toBeVisible();

                await this.testSteps.LogInfo(`Verifying image ${i} Title text "${title}" is visible`);
                await expect(this.page.locator(`//img[@title="${title}"]`)).toBeVisible();

                await this.testSteps.LogInfo(`Verifying image ${i} caption text "${caption}" is visible`);
                await expect(this.page.locator(`//figcaption[normalize-space(.)="${caption}"]`)).toBeVisible();

                await this.page.waitForTimeout(1000);

                await this.testSteps.LogInfo(`Clicking image ${i}`);
                const image = this.page.getByRole('img', { name: alt });
                await expect(image).toBeVisible();
                await image.click();
                await this.page.waitForTimeout(1000);

                await this.testSteps.LogInfo(`Closing image ${i}`);
                const closeButton = this.page.getByRole('button', { name: 'Close' });
                await expect(closeButton).toBeVisible();
                await closeButton.click();
                await this.page.waitForTimeout(1000);

                i++;
            }
        } else if (existingImageName)
        {
            await this.testSteps.LogInfo(`Verifying image is visible`);

            await this.testSteps.LogInfo(`Verifying image Alt text "${this.testData.Media.galleryImageAltText}" is visible`);
            await expect(this.page.locator(`//img[@alt="${this.testData.Media.galleryImageAltText}"]`)).toBeVisible();

            await this.testSteps.LogInfo(`Verifying image Title text "${this.testData.Media.galleryImageTitle}" is visible`);
            await expect(this.page.locator(`//img[@title="${this.testData.Media.galleryImageTitle}"]`)).toBeVisible();

            await this.testSteps.LogInfo(`Verifying image caption text "${this.testData.Media.galleryImageCaption}" is visible`);
            await expect(this.page.locator(`//figcaption[normalize-space(.)="${this.testData.Media.galleryImageCaption}"]`)).toBeVisible();

            await this.testSteps.LogInfo(`Clicking image ${this.testData.Media.galleryImageCaption}`);
            const image = this.page.getByRole('img', { name: this.testData.Media.galleryImageAltText });
            await expect(image).toBeVisible();
            await image.click();
            await this.page.waitForTimeout(1000);

            await this.testSteps.LogInfo(`Closing image ${this.testData.Media.galleryImageCaption}`);
            const closeButton = this.page.getByRole('button', { name: 'Close' });
            await expect(closeButton).toBeVisible();
            await closeButton.click();
            await this.page.waitForTimeout(1000);
        }
    }

    async verifyGalleryAnon(options?: VerifyGalleryAnonOptions)
    {
        await this.testSteps.LogInfo('Navigating to created News that Gallery has been linked too');
        // escapeRegex removes all white space and replaces with '-', where '-' already exists and surrounded by 
        // white space it will just remove surrounding white space and converts all characters to lower case.
        const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();
        await this.page.goto(this.testSetUpData.urlForTest.url + `/news/${escapeRegex(this.testData.News.title)}`);
        await expect(this.page).toHaveURL(
            new RegExp(this.testSetUpData.urlForTest.url + `/news/${escapeRegex(this.testData.News.title)}`)
        );

        // verify title
        await this.testSteps.LogInfo(`Verifying News title "${this.testData.News.title}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.News.title);

        await this.testSteps.LogInfo(`Verifying Gallery link text is visible after being added through CK Editor "${this.testData.Gallery.title}"`);
        await expect(this.page.locator(`//a[text()="${this.testData.Gallery.title}"]`)).toBeVisible();
        await this.testSteps.LogInfo(`Clicking Gallery link text that was added through CK Editor "${this.testData.Gallery.title}"`);
        await this.page.locator(`//a[text()="${this.testData.Gallery.title}"]`).click();

        if (this.testSetUpData.moderationStateForTest.moderationState === this.testSetUpData.validModerationStates.published)
        {
            await this.verifyGallery({
                preview: false,
                existingImageName: options?.existingImageName,
            });
        }
        else
        {
            await this.testSteps.LogInfo(`Verifying unpublished Gallery "${this.testData.Gallery.title}" displays a 404 error `);
            //expect Page not found error
            const notFoundHeading = this.page.locator('//h1[normalize-space(.)="Page not found (404)"]').or(this.page.locator('//h1[normalize-space(.)="Page not found"]'));
            await expect(notFoundHeading).toBeVisible();
        }
    }

    //verify edited gallery method
    async verifyEditedGallery({ preview }: VerifyOptions)
    {
        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testData.Gallery.titleEdited}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.Gallery.titleEdited);

        // verify summary
        await this.testSteps.LogInfo(`Verifying Summary "${this.testData.Gallery.summaryEdited}" is visible`);
        await expect(this.page.getByText(this.testData.Gallery.summaryEdited)).toBeVisible();

        // verify body field
        await this.testSteps.LogInfo(`Verifying Body "${this.testData.Gallery.bodyEdited}" is visible`);
        await expect(this.page.getByText(this.testData.Gallery.bodyEdited)).toBeVisible();

        // verify images
        await this.testSteps.LogInfo('Verifying Edited Image has been uploaded');
        await expect(this.page.locator(`//img`)).toBeEnabled();

        await this.testSteps.LogInfo(`Verifying Edited image has No Alt `);
        await expect(this.page.locator(`//img[@alt=""]`)).toBeVisible();

        await this.testSteps.LogInfo(`Verifying Edited image Title is not visible`);
        await expect(this.page.locator(`//img[@title=""]`)).toBeHidden();

        await this.testSteps.LogInfo(`Verifying Edited image caption is not present visible`);
        await expect(this.page.locator(`//figcaption[normalize-space(.)=""]`)).toBeHidden();

        if (!preview)
        {
            await this.testSteps.LogInfo(`Clicking edited image 1`);
            const image = this.page.locator(`//img`);
            await expect(image).toBeVisible();
            await image.click();
            await this.page.waitForTimeout(500);

            await this.testSteps.LogInfo(`Closing image 1`);
            const closeButton = this.page.getByRole('button', { name: 'Close' });
            await expect(closeButton).toBeVisible();
            await closeButton.click();
            await this.page.waitForTimeout(500);
        }


        await this.testSteps.LogInfo('Verifying Original Images 1 - 5 have been removed through editing Process');
        let i = 1;
        for (const img of galleryImageDetails)
        {
            const { alt, title, caption } = img;

            await this.testSteps.LogInfo(`Verifying image ${i} is NOT visible`);

            await this.testSteps.LogInfo(`Verifying image ${i} Alt text "${alt}" is NOT visible`);
            await expect(this.page.locator(`//img[@alt="${alt}"]`)).toBeHidden();

            await this.testSteps.LogInfo(`Verifying image ${i} Title text "${title}" is NOT visible`);
            await expect(this.page.locator(`//img[@title="${title}"]`)).toBeHidden();

            await this.testSteps.LogInfo(`Verifying image ${i} caption text "${caption}" is NOT visible`);
            await expect(this.page.locator(`//figcaption[normalize-space(.)="${caption}"]`)).toBeHidden();

            i++;
        }
    }

    //verify gallery method as anon user
    async verifyEditedGalleryAnon()
    {
        await this.testSteps.LogInfo('Navigating to created News that Gallery has been linked too');
        // escapeRegex removes all white space and replaces with '-', where '-' already exists and surrounded by 
        // white space it will just remove surrounding white space and converts all characters to lower case.
        const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();
        await this.page.goto(this.testSetUpData.urlForTest.url + `/news/${escapeRegex(this.testData.News.title)}`);
        await expect(this.page).toHaveURL(
            new RegExp(this.testSetUpData.urlForTest.url + `/news/${escapeRegex(this.testData.News.title)}`)
        );

        // verify title
        await this.testSteps.LogInfo(`Verifying News title "${this.testData.News.title}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.News.title);

        await this.testSteps.LogInfo(`Verifying Gallery link text is visible after being added through CK Editor "${this.testData.Gallery.title}"`);
        await expect(this.page.locator(`//a[text()="${this.testData.Gallery.title}"]`)).toBeVisible();
        await this.testSteps.LogInfo(`Clicking Gallery link text that was added through CK Editor "${this.testData.Gallery.title}"`);
        await this.page.locator(`//a[text()="${this.testData.Gallery.title}"]`).click();

        if (this.testSetUpData.moderationStateForTest.moderationState === this.testSetUpData.validModerationStates.published)
        {
            await this.verifyEditedGallery({
                preview: false
            });
        }
        else
        {
            await this.testSteps.LogInfo(`Verifying unpublished Gallery "${this.testData.Gallery.title}" displays a 404 error `);
            //expect Page not found error
            await expect(this.page.locator('//h1[normalize-space(.)="Page not found (404)"]')).toBeVisible();
        }
    }
}