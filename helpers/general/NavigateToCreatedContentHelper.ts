import { expect, Page } from '@playwright/test';
import { BasePage } from '@poms/base-pages/BasePage';
import { UserPage } from '@poms/base-pages/UserPage';
import { ContentPage } from '@poms/base-pages/ContentPage';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestSetUpData, TestData } from '../../test-data/TestDataObject';
import { BooksHelper } from '@poms/content-pages/Article/ArticleCreatePage';

export interface ContentState
{
    active: boolean;
    deleted: boolean;
};

export class NavigateToCreatedContentHelper
{
    // pages
    private readonly userPage: UserPage;
    private readonly basePage: BasePage;
    private readonly contentPage: ContentPage;
    private readonly testSteps: TestSteps;

    // constructor
    constructor(
        private readonly page: Page,
        private readonly testSetUpData: typeof TestSetUpData,
        private readonly testData: typeof TestData
    )
    {
        // imported pages
        this.userPage = new UserPage(page, testSetUpData);
        this.basePage = new BasePage(page, testSetUpData);
        this.contentPage = new ContentPage(page, testSetUpData);
        this.testSteps = new TestSteps();
    }

    // navigation method
    async navigateToCreatedContent(options: ContentState)
    {

        await this.basePage.clickContentLink();
        await this.contentPage.contentPageURLCheck();
        await this.contentPage.enterContentNameToReturnTo(this.testSetUpData.contentTitleforTest.contentTitle);
        await this.contentPage.clickFilterButton();

        if (options.active)
        {
            await this.contentPage.clickTargetContentLink(this.testSetUpData.contentTitleforTest.contentTitle);
            // Ensure user is on correct page when clicking on Content link
            await this.testSteps.LogInfo(`Ensuring user is on "${this.testSetUpData.contentTitleforTest.contentTitle}" after clicking link on Content Page`);

            // Consultation title is different as it has a span to indicate the state e.g OPEN CONSULTATION -
            // so we check both the contains and normalised-space conditions in one xpath
            await expect(this.page.locator(`//h1[contains(text(), "${this.testSetUpData.contentTitleforTest.contentTitle}") or text()[normalize-space(.)="${this.testSetUpData.contentTitleforTest.contentTitle}"]]`)).toBeVisible();
        }

        if (options.deleted)
        {
            await this.contentPage.confirmContentDoesNotExist(this.testSetUpData.contentTitleforTest.contentTitle);
        }

    }

    async navigateToCreatedBook(options: ContentState, bookOptions: BooksHelper)
    {
        const bookTitleMap: Record<keyof BooksHelper, string> = {
            Book: this.testData.Books.BookTitle,
            Chapter1: this.testData.Books.Chapter1Title,
            Chapter2: this.testData.Books.Chapter2Title,
            Paragraph1: this.testData.Books.Paragraph1Title,
            Paragraph2: this.testData.Books.Paragraph2Title,
            Glossery1: this.testData.Books.Glossery1Title,
            Glossery2: this.testData.Books.Glossery2Title,
        };

        const orderedKeys: Array<keyof BooksHelper> = ['Book', 'Chapter1', 'Paragraph1', 'Glossery1', 'Chapter2', 'Paragraph2', 'Glossery2'];

        for (const key of orderedKeys)
        {
            if (bookOptions[key] !== true) continue;

            const titleToUse = bookTitleMap[key];

            await this.basePage.clickContentLink();
            await this.contentPage.contentPageURLCheck();
            await this.contentPage.enterContentNameToReturnTo(titleToUse);
            await this.contentPage.clickFilterButton();

            if (options.active)
            {
                await this.contentPage.clickTargetContentLink(titleToUse);
                await this.testSteps.LogInfo(`Ensuring user is on "${titleToUse}" after clicking link on Content Page`);

                // Consultation title is different as it has a span to indicate the state e.g OPEN CONSULTATION -
                // so we check both the contains and normalised-space conditions in one xpath
                await expect(this.page.locator(`//h1[contains(text(), "${titleToUse}") or text()[normalize-space(.)="${titleToUse}"]]`)).toBeVisible();
            }

            if (options.deleted)
            {
                await this.contentPage.confirmContentDoesNotExist(titleToUse);
            }

        }
    }
}