import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { expect } from '@playwright/test';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export interface VerifyOptions
{
};

export class NewsNodePage
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

    // check url after saving create news
    async newsNodeURLCheck()
    {
        // escapeRegex removes all white space and replaces with '-', where '-' already exists and surrounded by 
        // white space it will just remove surrounding white space and converts all characters to lower case.
        const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();
        await this.testSteps.LogInfo(`Verifying URL path is /news/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)} with optional -suffix and optional trailing path, or is /node/.+/latest`);
        await expect(this.page).toHaveURL(
            new RegExp(`(?:${this.testSetUpData.urlForTest.url}/news/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)}(?:-[^/]+)?(?:/.*)?$)|(?:/node/.+/latest)`)
        );
    }

    // -------------------- Verify News methods --------------------

    //verify news method
    async verifyNews(_: VerifyOptions)
    {
        const publishedDate = new Date(`${this.testData.News.publicationDate}T00:00:00`).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testData.News.title}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.News.title);

        // verify publication date
        await this.testSteps.LogInfo(`Verifying Date published "${publishedDate}" is visible`);
        await expect(this.page.locator('//span[contains(text(),"Date published: ")]//following-sibling::span/time'))
            .toHaveText(publishedDate);

        // verify selected topic
        const selectedTopic = this.testData.News.topics[this.testData.News.topics.length - 1];
        await this.testSteps.LogInfo(`Verifying topic "${selectedTopic}" is visible`);
        await expect(this.page.getByText('Topics:', { exact: true })).toBeVisible();
        await expect(this.page.getByRole('link', { name: selectedTopic, exact: true })).toBeVisible();

        // verify intro paragraph
        await this.testSteps.LogInfo(`Verifying introductory Paragraph "${this.testData.News.introductoryParagraph}" is visible`);
        await expect(this.page.getByText(this.testData.News.introductoryParagraph)).toBeVisible();

        //verify image is uploaded and displayed (does not verify if it is correct image just that it is on page)
        await this.testSteps.LogInfo('Verifying image is visible');
        await expect(this.page.locator('//figure/img')).toBeVisible();

        // verify body field
        await this.testSteps.LogInfo(`Verifying Body "${this.testData.News.body}" is visible`);
        await expect(this.page.getByText(this.testData.News.body)).toBeVisible();

        // verify note to editors field
        await this.testSteps.LogInfo(`Verifying Note to Editors "${this.testData.News.notesToEditor}" is visible`);
        await expect(this.page.getByText(this.testData.News.notesToEditor)).toBeVisible();
    }


    //verify edited news method
    async verifyEditedNews(_: VerifyOptions)
    {
        const publishedDate = new Date(`${this.testData.News.publicationDateEdited}T00:00:00`).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testData.News.titleEdited}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.News.titleEdited);

        // verify publication date
        await this.testSteps.LogInfo(`Verifying Date published "${publishedDate}" is visible`);
        await expect(this.page.locator('//span[contains(text(),"Date published: ")]//following-sibling::span/time'))
            .toHaveText(publishedDate);

        // verify selected topics
        // await expect(this.page.getByText('Topics:', { exact: true })).toBeVisible();
        // for (const topic of this.testData.News.topicsEdited)
        // {
        //     await this.testSteps.LogInfo(`Verifying topic "${topic}" is visible`);
        //     await expect(this.page.getByRole('link', { name: topic, exact: true })).toBeVisible();
        // }

        await this.testSteps.LogInfo(`Verifying introductory Paragraph "${this.testData.News.introductoryParagraphEdited}" is visible`);
        await expect(this.page.getByText(this.testData.News.introductoryParagraphEdited)).toBeVisible();

        await this.testSteps.LogInfo('Verifying image is visible');
        await expect(this.page.locator('//div/img')).toBeVisible();

        await this.testSteps.LogInfo(`Verifying Body "${this.testData.News.bodyEdited}" is visible`);
        await expect(this.page.getByText(this.testData.News.bodyEdited)).toBeVisible();

        await this.testSteps.LogInfo(`Verifying Note to Editors "${this.testData.News.notesToEditorEdited}" is visible`);
        await expect(this.page.getByText(this.testData.News.notesToEditorEdited)).toBeVisible();
    }
}