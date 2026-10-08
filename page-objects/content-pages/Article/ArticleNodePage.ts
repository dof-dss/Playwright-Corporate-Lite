import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { expect } from '@playwright/test';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';
import { BooksHelper } from '@poms/content-pages/Article/ArticleCreatePage';

export interface VerifyOptions
{
    expectedTitle?: string;
    addSecondAreaOfExpertise?: boolean;
    addSecondService?: boolean;
};



export class ArticleNodePage
{
    // logging
    private readonly testSteps: TestSteps;

    // constructor
    constructor
        (
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

    // check url after saving create article
    async articleNodeURLCheck(expectedTitle?: string)
    {
        const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();
        const titleToCheck = escapeRegex(expectedTitle ?? this.testSetUpData.contentTitleforTest.contentTitle);

        await this.testSteps.LogInfo(`Verifying URL path is /article/${titleToCheck} with optional -suffix and optional trailing path, or is /node/.+/latest`);
        await expect(this.page).toHaveURL(
            new RegExp(`(?:${this.testSetUpData.urlForTest.url}/article/${titleToCheck}(?:-[^/]+)?(?:/.*)?$)|(?:/node/.+/latest)`)
        );

    }

    // -------------------- Verify Article methods --------------------

    //verify article method
    async verifyArticle({ expectedTitle, addSecondAreaOfExpertise, addSecondService }: VerifyOptions)
    {
        const titleToVerify = expectedTitle ?? this.testSetUpData.contentTitleforTest.contentTitle;

        // verify title
        await this.testSteps.LogInfo(`Verifying title "${titleToVerify}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(titleToVerify);

        // verify expertise areas
        await this.testSteps.LogInfo('Verifying Areas of Expertise and selected values are visible');
        await expect(this.page.getByText('Areas of Expertise:', { exact: true })).toBeVisible();
        await expect(this.page.getByRole('link', { name: this.testData.Article.areaOfExpertise, exact: true })).toBeVisible();
        if (addSecondAreaOfExpertise === true)
        {
            await expect(this.page.getByRole('link', { name: this.testData.Article.areaOfExpertise2, exact: true })).toBeVisible();
        }

        // verify services
        await this.testSteps.LogInfo('Verifying Service and selected values are visible');
        await expect(this.page.getByText('Service:', { exact: true })).toBeVisible();
        await expect(this.page.getByRole('link', { name: this.testData.Article.service, exact: true })).toBeVisible();
        if (addSecondService === true)
        {
            await expect(this.page.getByRole('link', { name: this.testData.Article.service2, exact: true })).toBeVisible();
        }

        // verify summary
        await this.testSteps.LogInfo(`Verifying Summary "${this.testData.Article.summary}" is visible`);
        await expect(this.page.getByText(this.testData.Article.summary)).toBeVisible();

        // verify body field
        await this.testSteps.LogInfo(`Verifying Body Field "${this.testData.Article.body}" is visible`);
        await expect(this.page.getByText(this.testData.Article.body)).toBeVisible();
    }

    //verify edited article method
    async verifyEditedArticle(_: VerifyOptions)
    {
        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testData.Article.titleEdited}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.Article.titleEdited);

        // verify summary
        await this.testSteps.LogInfo(`Verifying Summary "${this.testData.Article.summaryEdited}" is visible`);
        await expect(this.page.getByText(this.testData.Article.summaryEdited)).toBeVisible();

        // verify body field
        await this.testSteps.LogInfo(`Verifying Body Field "${this.testData.Article.bodyEdited}" is visible`);
        await expect(this.page.getByText(this.testData.Article.bodyEdited)).toBeVisible();
    }

    async verifyBook(_: VerifyOptions, option: BooksHelper)
    {
        if (option.Book)
        {
            await this.verifyArticle({
                expectedTitle: this.testData.Books.BookTitle
            });
        }

        if (option.Chapter1)
        {
            await this.verifyArticle({
                expectedTitle: this.testData.Books.Chapter1Title
            });

            // verify Part of is displayed
            await this.testSteps.LogInfo(`Verifying Part of: "${this.testData.Books.BookTitle}" is visible`);
            await expect(this.page.locator(`//span[text()="Part of:"]/following-sibling::ul//a[text()="${this.testData.Books.BookTitle}"]`)).toBeVisible();
        }

        if (option.Paragraph1)
        {
            await this.verifyArticle({
                expectedTitle: this.testData.Books.Paragraph1Title
            });

            // verify Part of is displayed
            await this.testSteps.LogInfo(`Verifying Part of: "${this.testData.Books.Chapter1Title}" is visible`);
            await expect(this.page.locator(`//span[text()="Part of:"]/following-sibling::ul//a[text()="${this.testData.Books.Chapter1Title}"]`)).toBeVisible();
        }

        if (option.Chapter2)
        {
            await this.verifyArticle({
                expectedTitle: this.testData.Books.Chapter2Title
            });

            // verify Part of is displayed
            await this.testSteps.LogInfo(`Verifying Part of: "${this.testData.Books.BookTitle}" is visible`);
            await expect(this.page.locator(`//span[text()="Part of:"]/following-sibling::ul//a[text()="${this.testData.Books.BookTitle}"]`)).toBeVisible();
        }

        if (option.Paragraph2)
        {
            await this.verifyArticle({
                expectedTitle: this.testData.Books.Paragraph2Title
            });

            // verify Part of is displayed
            await this.testSteps.LogInfo(`Verifying Part of: "${this.testData.Books.Chapter2Title}" is visible`);
            await expect(this.page.locator(`//span[text()="Part of:"]/following-sibling::ul//a[text()="${this.testData.Books.Chapter2Title}"]`)).toBeVisible();
        }
    }

    //verify article method
    async verifyArticleCKEditorFullFunctionality()
    {
        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testData.Article.title}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.Article.title);

        // verify summary
        await this.testSteps.LogInfo(`Verifying Summary "${this.testData.Article.summary}" is visible`);
        await expect(this.page.getByText(this.testData.Article.summary)).toBeVisible();

        // verify body field
        await this.testSteps.LogInfo(`Verifying Body Field "${this.testData.Article.body}" is visible`);
        await expect(this.page.getByText(this.testData.Article.body)).toBeVisible();

        // verify ckeditor bold
        await this.testSteps.LogInfo('Verifying Body Field Bold Text "This is Bold" is visible');
        await expect(this.page.locator('//div[@class="article-content"]/p/strong[contains(text(),"This is Bold")]')).toBeVisible();

        // verify ckeditor italics
        await this.testSteps.LogInfo('Verifying Body Field Italics Text "This is Italics" is visible');
        await expect(this.page.locator('//div[@class="article-content"]/p/em[contains(text(),"This is Italics")]')).toBeVisible();

        // verify ckeditor block quote
        await this.testSteps.LogInfo('Verifying Body Field Block Quote "This is a Block Quote" is visible');
        await expect(this.page.locator('//div[@class="article-content"]/blockquote/p[contains(text(),"This is a Block quote")]')).toBeVisible();

        // verify ckeditor Superscript
        await this.testSteps.LogInfo('Verifying Body Field Superscript Text "This is a Superscript" is visible');
        await expect(this.page.locator('//div[@class="article-content"]/p/sup[contains(text(),"This is a Superscript")]')).toBeVisible();

        // verify ckeditor nomral paragraph
        await this.testSteps.LogInfo('Verifying Body Field normal paragraph Text "This is a normal Paragraph" is visible');
        await expect(this.page.locator('//div[@class="article-content"]/p[contains(text(),"This is a normal Paragraph")]')).toBeVisible();

        // verify  ckeditor h2
        await this.testSteps.LogInfo('Verifying Body Field Heading 2 "This is Heading 2" is visible');
        await expect(this.page.getByRole('heading', { name: 'This is Heading 2', level: 2, exact: true })).toBeVisible();

        // verify ckeditor h3
        await this.testSteps.LogInfo('Verifying Body Field Heading 3 "This is Heading 3" is visible');
        await expect(this.page.getByRole('heading', { name: 'This is Heading 3', level: 3, exact: true })).toBeVisible();

        // verify  ckeditorh4
        await this.testSteps.LogInfo('Verifying Body Field Heading 4 "This is Heading 4" is visible');
        await expect(this.page.getByRole('heading', { name: 'This is Heading 4', level: 4, exact: true })).toBeVisible();

        // verify ckeditor Information notice
        await this.testSteps.LogInfo('Verifying Body Field Information notice Text "This is an Information notice" is visible');
        await expect(this.page.locator('//strong[@class="visually-hidden"]')).toHaveText("Important information ");
        await expect(this.page.getByText('This is an information notice')).toBeVisible();

        // verify ckeditor first bullet point
        await this.testSteps.LogInfo('Verifying Body Field Bullet Point 1 "First This is a Bullet point test" is visible');
        await expect(this.page.locator('//ul/li[contains(text(),"First This is a Bullet point test")]')).toBeVisible();

        // verify ckeditor second bullet point
        await this.testSteps.LogInfo('Verifying Body Field Bullet Point 2 "Second Bullet point" is visible');
        await expect(this.page.locator('//ul/li[contains(text(),"Second Bullet point")]')).toBeVisible();

        // verify ckeditor third bullet point
        await this.testSteps.LogInfo('Verifying Body Field Bullet Point 3 "Third Bullet point" is visible');
        await expect(this.page.locator('//ul/li[contains(text(),"Third Bullet point")]')).toBeVisible();

        // verify ckeditor first numbered list point
        await this.testSteps.LogInfo('Verifying Body Numbered list point 1 "Number 1 This is a Numbered List point test." is visible');
        await expect(this.page.locator('//ol/li[contains(text(),"Number 1 This is a Numbered List point test.")]')).toBeVisible();

        // verify ckeditor second numbered list point
        await this.testSteps.LogInfo('Verifying Body Field Numbered list point 2 "Number 2" is visible');
        await expect(this.page.locator('//ol/li[contains(text(),"Number 2")]')).toBeVisible();

        // verify ckeditor numbered list point
        await this.testSteps.LogInfo('Verifying Body Field Numbered list point 3 "Number 3" is visible');
        await expect(this.page.locator('//ol/li[contains(text(),"Number 3")]')).toBeVisible();

        // verify ckeditor first numbered list point starting from 10
        await this.testSteps.LogInfo('Verifying Body Field Numbered list point 1 "Number 10 This is Numbered List point test when started at value 10." is visible');
        await expect(this.page.locator('//ol[@start="10"]/li[contains(text(),"Number 10 This is Numbered List point test when started at value 10.")]')).toBeVisible();

        // verify ckeditor second numbered list point
        await this.testSteps.LogInfo('Verifying Body Field Numbered list point 2 "Number 11" is visible');
        await expect(this.page.locator('//ol[@start="10"]/li[contains(text(),"Number 11")]')).toBeVisible();

        // verify ckeditor numbered list point
        await this.testSteps.LogInfo('Verifying Body Field Numbered list point 3 "Number 12" is visible');
        await expect(this.page.locator('//ol[@start="10"]/li[contains(text(),"Number 12")]')).toBeVisible();

        // verify ckeditor first numbered list point going in reverse order from 50
        // await this.testSteps.LogInfo('Verifying Body Field Numbered list point 1 "Number 50 This is a reverse Numbered List point test." is visible');
        // await expect(this.page.locator('//ol[@start="50"][@reversed="reversed"]/li[contains(text(),"Number 50 This is a reverse Numbered List point test.")]')).toBeVisible();

        // verify ckeditor second numbered list point going in reverse order from 50
        // await this.testSteps.LogInfo('Verifying Body Field Numbered list point 2 "Number 49" is visible');
        // await expect(this.page.locator('//ol[@start="50"][@reversed="reversed"]/li[contains(text(),"Number 49")]')).toBeVisible();

        // verify ckeditor numbered list point going in reverse order from 50
        // await this.testSteps.LogInfo('Verifying Body Field Numbered list point 3 "Number 48" is visible');
        // await expect(this.page.locator('//ol[@start="50"][@reversed="reversed"]/li[contains(text(),"Number 48")]')).toBeVisible();

        // verify ckeditor img is embeded
        await this.testSteps.LogInfo('Verifying Body Field image is embeded - NEEDS MANUAL ATTENTION');
        await expect(this.page.locator('//div[@class="media-image"]/img')).toBeVisible();

        // verify ckeditor audio file is embeded
        await this.testSteps.LogInfo('Verifying Body Field audio file is embeded - NEEDS MANUAL ATTENTION');
        await expect(this.page.locator('//audio[@controls="controls"]')).toBeVisible();

        // verify ckeditor audio file is embeded
        await this.testSteps.LogInfo('Verifying Body Field remote video embeded - NEEDS MANUAL ATTENTION');
        await expect(this.page.locator('//div[@class="media-video"]')).toBeVisible();

        // specail symbol 1
        await this.testSteps.LogInfo('Verifying  "$" from special characters is visible"');
        await expect(this.page.getByText('$')).toBeVisible();

        // specail symbol 2
        await this.testSteps.LogInfo('Verifying  "‱" from special characters is visible"');
        await expect(this.page.getByText('‱')).toBeVisible();

        // table
        await this.testSteps.LogInfo('Verifying  "Table" has been added and is visible"');
        await expect(this.page.locator('//table')).toBeVisible();

        // table row 1 column 1
        await this.testSteps.LogInfo('Verifying  "Table row 1 column 1" has been added and is visible"');
        await expect(this.page.locator('//table/tbody/tr[1]/td[1][contains(text(), "Row 1, Column 1")]')).toBeVisible();

        // table row 1 column 2
        await this.testSteps.LogInfo('Verifying  "Table row 1 column 2" has been added and is visible"');
        await expect(this.page.locator('//table/tbody/tr[1]/td[2][contains(text(), "Row 1, Column 2")]')).toBeVisible();

        // table row 1 column 3
        await this.testSteps.LogInfo('Verifying  "Table row 1 column 3" has been added and is visible"');
        await expect(this.page.locator('//table/tbody/tr[1]/td[3][contains(text(), "Row 1, Column 3")]')).toBeVisible();

        // table row 2 column 1
        await this.testSteps.LogInfo('Verifying  "Table row 2 column 1" has been added and is visible"');
        await expect(this.page.locator('//table/tbody/tr[2]/td[1][contains(text(), "Row 2, Column 1")]')).toBeVisible();

        // table row 2 column 2
        await this.testSteps.LogInfo('Verifying  "Table row 2 column 2" has been added and is visible"');
        await expect(this.page.locator('//table/tbody/tr[2]/td[2][contains(text(), "Row 2, Column 2")]')).toBeVisible();

        // table row 2 column 3
        await this.testSteps.LogInfo('Verifying  "Table row 2 column 3" has been added and is visible"');
        await expect(this.page.locator('//table/tbody/tr[2]/td[3][contains(text(), "Row 2, Column 3")]')).toBeVisible();


    }

    //verify article method
    async verifyArticleCKEditorImportWord()
    {
        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testData.Article.title}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.Article.title);

        // verify summary
        await this.testSteps.LogInfo(`Verifying Summary "${this.testData.Article.summary}" is visible`);
        await expect(this.page.getByText(this.testData.Article.summary)).toBeVisible();

        // verify body field
        await this.testSteps.LogInfo(`Verifying Body Field "${this.testData.Article.body}" is visible`);
        await expect(this.page.getByText(this.testData.Article.body)).toBeVisible();

        // verify ckeditor bold
        await this.testSteps.LogInfo('Verifying Body Field Bold Text "This is Bold" is visible');
        await expect(this.page.locator('//div[@class="article-content"]/p/strong[contains(text(),"This is Bold")]')).toBeVisible();

        // // verify ckeditor italics
        // await this.testSteps.LogInfo('Verifying Body Field Italics Text "This is Italics" is visible');
        // await expect(this.page.locator('//div[@class="article-content"]/p/em[contains(text(),"This is Italics")]')).toBeVisible();

        // verify ckeditor Superscript
        await this.testSteps.LogInfo('Verifying Body Field Superscript Text "This is a Superscript" is visible');
        await expect(this.page.locator('//div[@class="article-content"]/p/sup[contains(text(),"This is a Superscript")]')).toBeVisible();

        // verify ckeditor nomral paragraph
        await this.testSteps.LogInfo('Verifying Body Field normal paragraph Text "This is a normal Paragraph" is visible');
        await expect(this.page.locator('//div[@class="article-content"]/p[contains(text(),"This is a normal Paragraph")]')).toBeVisible();

        // verify  ckeditor h2
        await this.testSteps.LogInfo('Verifying Body Field Heading 2 "This is Heading 2" is visible');
        await expect(this.page.getByRole('heading', { name: 'This is Heading 2', level: 2, exact: true })).toBeVisible();

        // verify ckeditor h3
        await this.testSteps.LogInfo('Verifying Body Field Heading 3 "This is Heading 3" is visible');
        await expect(this.page.getByRole('heading', { name: 'This is Heading 3', level: 3, exact: true })).toBeVisible();

        // verify  ckeditorh4
        await this.testSteps.LogInfo('Verifying Body Field Heading 4 "This is Heading 4" is visible');
        await expect(this.page.getByRole('heading', { name: 'This is Heading 4', level: 4, exact: true })).toBeVisible();

        // verify ckeditor first bullet point
        await this.testSteps.LogInfo('Verifying Body Field Bullet Point 1 "First This is a Bullet point test" is visible');
        await expect(this.page.locator('//ul/li[contains(text(),"First This is a Bullet point test")]')).toBeVisible();

        // verify ckeditor second bullet point
        await this.testSteps.LogInfo('Verifying Body Field Bullet Point 2 "Second Bullet point" is visible');
        await expect(this.page.locator('//ul/li[contains(text(),"Second Bullet point")]')).toBeVisible();

        // verify ckeditor third bullet point
        await this.testSteps.LogInfo('Verifying Body Field Bullet Point 3 "Third Bullet point" is visible');
        await expect(this.page.locator('//ul/li[contains(text(),"Third Bullet point")]')).toBeVisible();

        // verify ckeditor first numbered list point
        await this.testSteps.LogInfo('Verifying Body Numbered list point 1 "Number 1 This is a Numbered List point test." is visible');
        await expect(this.page.locator('//ol/li[contains(text(),"Number 1 This is a Numbered List point test.")]')).toBeVisible();

        // verify ckeditor second numbered list point
        await this.testSteps.LogInfo('Verifying Body Field Numbered list point 2 "Number 2" is visible');
        await expect(this.page.locator('//ol/li[contains(text(),"Number 2")]')).toBeVisible();

        // verify ckeditor numbered list point
        await this.testSteps.LogInfo('Verifying Body Field Numbered list point 3 "Number 3" is visible');
        await expect(this.page.locator('//ol/li[contains(text(),"Number 3")]')).toBeVisible();

        // verify ckeditor first numbered list point starting from 10
        await this.testSteps.LogInfo('Verifying Body Field Numbered list point 1 "Number 10 This is Numbered List point test when started at value 10." is visible');
        await expect(this.page.locator('//ol[@start="10"]/li[contains(text(),"Number 10 This is Numbered List point test when started at value 10.")]')).toBeVisible();

        // verify ckeditor second numbered list point
        await this.testSteps.LogInfo('Verifying Body Field Numbered list point 2 "Number 11" is visible');
        await expect(this.page.locator('//ol[@start="10"]/li[contains(text(),"Number 11")]')).toBeVisible();

        // verify ckeditor numbered list point
        await this.testSteps.LogInfo('Verifying Body Field Numbered list point 3 "Number 12" is visible');
        await expect(this.page.locator('//ol[@start="10"]/li[contains(text(),"Number 12")]')).toBeVisible();
    }

}