import { Page } from '@playwright/test';
import { BasePage } from '@poms/base-pages/BasePage';
import { ArticleCreatePage, BooksHelper } from '@poms/content-pages/Article/ArticleCreatePage';
import { ArticleEditPage } from '@poms/content-pages/Article/ArticleEditPage';
import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';
import { UserPage } from '@poms/base-pages/UserPage';
import { ContentPage } from '@poms/base-pages/ContentPage';
import { AddContentPage } from '@poms/base-pages/AddContentPage';
import { TestSetUpData, TestData } from '../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { CreatePages } from '@poms/base-pages/CreatePages';
import { ArticleNodePage } from '@poms/content-pages/Article/ArticleNodePage';
import { DeletePage } from '@poms/base-pages/DeletePage';
import { NavigateToCreatedContentHelper } from '@helpers/general/NavigateToCreatedContentHelper';

export interface SaveOptions
{
    preview: boolean;
    mandatoryFieldCheck: boolean;
    existingAudioName?: string;
};

export interface EditSaveOptions
{
    preview: boolean;
};

export interface DeleteOptions
{
    delete: boolean;
    cancel: boolean;
};

export class ArticleHelper
{
    // pages
    private userPage: UserPage;
    private basePage: BasePage;
    private contentPage: ContentPage;
    private addContentPage: AddContentPage;
    private articleCreatePage: ArticleCreatePage;
    private articleEditPage: ArticleEditPage;
    private moderationSideBar: ModerationSideBar;
    private previewPage: PreviewPage;
    private createPage: CreatePages;
    private articleNodePage: ArticleNodePage;
    private deletePage: DeletePage;
    private navigateToCreatedContentHelper: NavigateToCreatedContentHelper;

    // constructor
    constructor(
        private page: Page,
        private testSetUpData: typeof TestSetUpData,
        private testData: typeof TestData
    )
    {
        // imported pages
        this.userPage = new UserPage(page, testSetUpData);
        this.basePage = new BasePage(page, testSetUpData);
        this.contentPage = new ContentPage(page, testSetUpData);
        this.addContentPage = new AddContentPage(page, testSetUpData);
        this.articleCreatePage = new ArticleCreatePage(page, testSetUpData, testData);
        this.articleEditPage = new ArticleEditPage(page, testSetUpData, testData);
        this.moderationSideBar = new ModerationSideBar(page, testSetUpData, testData);
        this.previewPage = new PreviewPage(page);
        this.createPage = new CreatePages(page, testSetUpData, testData);
        this.articleNodePage = new ArticleNodePage(page, testSetUpData, testData);
        this.deletePage = new DeletePage(page);
        this.navigateToCreatedContentHelper = new NavigateToCreatedContentHelper(page, testSetUpData, testData);
    }

    // navigation method
    async navigateTocreateArticle()
    {
        await this.basePage.clickContentLink();
        await this.contentPage.contentPageURLCheck();
        await this.contentPage.clickAddContentButton();
        await this.addContentPage.addContentPageURLCheck();
        await this.addContentPage.selectContent();
    }

    // create Article method
    async createArticle(options: SaveOptions)
    {
        // navigate to create article
        await this.navigateTocreateArticle();

        // If we're doing mandatory field check, do not fill form
        if (options?.mandatoryFieldCheck)
        {
            await this.articleCreatePage.mandatoryFieldCheck();
        }

        // complete article form using isolated test data 
        await this.articleCreatePage.fillArticleForm({
            articleTitle: this.testData.Article.title,
            revisionLogMessage: this.testData.Article.revisionlog,
            articleSummary: this.testData.Article.summary,
            articleBodyField: this.testData.Article.body,
        });

        //Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview article method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.articleNodePage.verifyArticle(
                {}
            );
            await this.previewPage.clickBackToContentEdittingButton();
            await this.articleCreatePage.returnFromPreviewArticlePageURLCheck();
        }

        // Save and verify
        await this.createPage.clickSaveButton();
        await this.articleNodePage.articleNodeURLCheck();
        await this.articleNodePage.verifyArticle({});
    }

    // edit Article method
    async editArticle(options: EditSaveOptions)
    {
        // should be on node page already
        await this.articleNodePage.articleNodeURLCheck();

        // open moderation sidebar
        await this.moderationSideBar.openModerationSideBar();
        // click edit content
        await this.moderationSideBar.clickEditContentButton();

        // complete article form using edit isolated test data 
        await this.articleEditPage.editArticleForm({
            articleTitle: this.testData.Article.titleEdited,
            revisionLogMessage: this.testData.Article.revisionlogEdited,
            articleSummary: this.testData.Article.summaryEdited,
            articleBodyField: this.testData.Article.bodyEdited,
        });

        // setting test set up data to new title
        this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Article.titleEdited;
        //Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview article method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.articleNodePage.verifyEditedArticle({});
            await this.previewPage.clickBackToContentEdittingButton();
            await this.articleEditPage.returnFromPreviewArticlePageURLCheck();
        }

        // Save and verify
        await this.createPage.clickSaveButton();
        await this.articleNodePage.articleNodeURLCheck();
        await this.articleNodePage.verifyEditedArticle({});
    }

    async deleteArticle(options: DeleteOptions)
    {
        // should be on node page already
        await this.articleNodePage.articleNodeURLCheck();
        // open moderation sidebar
        await this.moderationSideBar.openModerationSideBar();
        // click edit content
        await this.moderationSideBar.clickDeleteButton();

        if (options.delete === true)
        {
            await this.deletePage.clickDelete();
            await this.deletePage.deleteNodeCofirmationCheck();
            await this.contentPage.confirmContentDoesNotExist(this.testSetUpData.contentTitleforTest.contentTitle);
            // test moderation state updated to deleted 
            this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.deleted;
        }
        else if (options.cancel === true)
        {
            await this.deletePage.clickCancel();
            await this.articleNodePage.articleNodeURLCheck();
        }
    }

    // create Article method with CK Editor 
    async createArticleWithCKEditorFunctionality(options: SaveOptions)
    {
        // navigate to create article
        await this.navigateTocreateArticle();

        // complete article form using isolated test data 
        await this.articleCreatePage.fillArticleFormWithCKEditorFunctionality({
            articleTitle: this.testData.Article.title,
            revisionLogMessage: this.testData.Article.revisionlog,
            articleSummary: this.testData.Article.summary,
            articleBodyField: this.testData.Article.body,
            existingAudioName: options.existingAudioName,
        });

        //Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview article method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.articleNodePage.verifyArticleCKEditorFullFunctionality();
            await this.previewPage.clickBackToContentEdittingButton();
            await this.articleCreatePage.returnFromPreviewArticlePageURLCheck();
        }

        // Save and verify
        await this.createPage.clickSaveButton();
        await this.articleNodePage.articleNodeURLCheck();
        await this.articleNodePage.verifyArticleCKEditorFullFunctionality();
    }

    // create Article method with CK Editor 
    async createArticleWithBook(options: SaveOptions, bookOptions: BooksHelper = { Book: true })
    {
        // navigate to create article
        await this.navigateTocreateArticle();

        const bookTitleMap: Record<keyof BooksHelper, string> = {
            Book: this.testData.Books.BookTitle,
            Chapter1: this.testData.Books.Chapter1Title,
            Chapter2: this.testData.Books.Chapter2Title,
            Paragraph1: this.testData.Books.Paragraph1Title,
            Paragraph2: this.testData.Books.Paragraph2Title,
            Glossery1: this.testData.Books.Glossery1Title,
            Glossery2: this.testData.Books.Glossery2Title,
        };

        for (const key of Object.keys(bookTitleMap) as Array<keyof BooksHelper>)
        {
            if (bookOptions[key])
            {
                await this.articleCreatePage.fillArticleFormWithBook({
                    articleTitle: bookTitleMap[key],
                    revisionLogMessage: this.testData.Article.revisionlog,
                    articleSummary: this.testData.Article.summary,
                    articleBodyField: this.testData.Article.body,
                }, bookOptions);
            }
        }

        // updating global topic set
        //Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview article method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.articleNodePage.verifyBook({}, bookOptions);
            await this.previewPage.clickBackToContentEdittingButton();
            await this.articleCreatePage.returnFromPreviewArticlePageURLCheck();
        }

        // Save and verify
        await this.createPage.clickSaveButton();

        // last enabled book level wins (mirrors creation order above)
        const enabledKeys = (Object.keys(bookTitleMap) as Array<keyof BooksHelper>).filter(key => bookOptions[key]);
        const bookNodeTitle = enabledKeys.length > 0
            ? bookTitleMap[enabledKeys[enabledKeys.length - 1]]
            : this.testData.Books.BookTitle;

        // keep contentTitleforTest in sync so articleNodeURLCheck fallback and subsequent helpers are correct
        this.testSetUpData.contentTitleforTest.contentTitle = bookNodeTitle;

        await this.articleNodePage.articleNodeURLCheck(bookNodeTitle);
        await this.articleNodePage.verifyBook({}, bookOptions);
    }

    async deleteBook(options: DeleteOptions, bookOptions: BooksHelper)
    {
        if (options.delete === true)
        {
            // root-first order: parent is visited before its children each pass,
            // so delete-button-not-visible is asserted while blockers still exist
            const deletionOrder: Array<{ item: keyof BooksHelper; blockers: Array<keyof BooksHelper>; }> = [
                { item: 'Book', blockers: ['Chapter1', 'Paragraph1', 'Glossery1', 'Chapter2', 'Paragraph2', 'Glossery2'] },
                { item: 'Chapter1', blockers: ['Paragraph1', 'Glossery1'] },
                { item: 'Paragraph1', blockers: ['Glossery1'] },
                { item: 'Glossery1', blockers: [] },
                { item: 'Chapter2', blockers: ['Paragraph2', 'Glossery2'] },
                { item: 'Paragraph2', blockers: ['Glossery2'] },
                { item: 'Glossery2', blockers: [] },
            ];

            // use a local copy so the caller's bookOptions is not mutated (needed for post-delete navigation)
            const tracking = { ...bookOptions };

            while (deletionOrder.some(d => tracking[d.item] === true))
            {
                for (const { item, blockers } of deletionOrder)
                {
                    if (tracking[item] !== true) continue;

                    await this.navigateToCreatedContentHelper.navigateToCreatedBook(
                        { active: true, deleted: false },
                        { [item]: true } as BooksHelper
                    );

                    const canDelete = blockers.every(blocker => !tracking[blocker]);

                    if (canDelete)
                    {
                        await this.moderationSideBar.openModerationSideBar();
                        await this.moderationSideBar.clickDeleteButton();
                        await this.deletePage.clickDelete();
                        await this.deletePage.deleteNodeCofirmationCheck();
                        tracking[item] = false;
                        await this.contentPage.confirmContentDoesNotExist(this.testSetUpData.contentTitleforTest.contentTitle);
                        if (item === 'Book')
                        {
                            this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.deleted;
                        }
                    }
                    else
                    {
                        await this.moderationSideBar.openModerationSideBar();
                        await this.moderationSideBar.deleteButtonNotVisible();
                    }
                }
            }
        }
    }
}
