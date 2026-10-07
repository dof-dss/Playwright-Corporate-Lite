import { Page } from '@playwright/test';
import { BasePage } from '@poms/base-pages/BasePage';
import { NewsCreatePage } from '@poms/content-pages/News/NewsCreatePage';
import { NewsEditPage } from '@poms/content-pages/News/NewsEditPage';
import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';
import { UserPage } from '@poms/base-pages/UserPage';
import { ContentPage } from '@poms/base-pages/ContentPage';
import { AddContentPage } from '@poms/base-pages/AddContentPage';
import { TestSetUpData, TestData } from '../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { CreatePages } from '@poms/base-pages/CreatePages';
import { NewsNodePage } from '@poms/content-pages/News/NewsNodePage';
import { DeletePage } from '@poms/base-pages/DeletePage';

export interface SaveOptions
{
    preview: boolean;
    mandatoryFieldCheck: boolean;
    existingRemoteVideoName?: string;
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

export class NewsHelper
{
    // pages
    private userPage: UserPage;
    private basePage: BasePage;
    private contentPage: ContentPage;
    private addContentPage: AddContentPage;
    private newsCreatePage: NewsCreatePage;
    private newsEditPage: NewsEditPage;
    private moderationSideBar: ModerationSideBar;
    private previewPage: PreviewPage;
    private createPage: CreatePages;
    private newsNodePage: NewsNodePage;
    private deletePage: DeletePage;

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
        this.newsCreatePage = new NewsCreatePage(page, testSetUpData, testData);
        this.newsEditPage = new NewsEditPage(page, testSetUpData, testData);
        this.moderationSideBar = new ModerationSideBar(page, testSetUpData, testData);
        this.previewPage = new PreviewPage(page);
        this.createPage = new CreatePages(page, testSetUpData, testData);
        this.newsNodePage = new NewsNodePage(page, testSetUpData, testData);
        this.deletePage = new DeletePage(page);
    }

    // navigation method
    async navigateTocreateNews()
    {
        await this.basePage.clickContentLink();
        await this.contentPage.contentPageURLCheck();
        await this.contentPage.clickAddContentButton();
        await this.addContentPage.addContentPageURLCheck();
        await this.addContentPage.selectContent();
    }

    // create News method
    async createNews(options: SaveOptions)
    {
        // navigate to create news
        await this.navigateTocreateNews();

        // If we're doing mandatory field check, do not fill form
        if (options?.mandatoryFieldCheck)
        {
            await this.newsCreatePage.mandatoryFieldCheck();
        }

        // complete news form using isolated test data 
        await this.newsCreatePage.fillNewsForm({
            newsTitle: this.testData.News.title,
            newsType: this.testData.News.newsType,
            revisionLogMessage: this.testData.News.revisionlog,
            newsIntoParagraph: this.testData.News.introductoryParagraph,
            newsteaser: this.testData.News.teaser,
            newsBodyField: this.testData.News.body,
            newsNoteToEditor: this.testData.News.notesToEditor,
            existingRemoteVideoName: options.existingRemoteVideoName,
        });

        //Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview news method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.newsNodePage.verifyNews({});
            await this.previewPage.clickBackToContentEdittingButton();
            await this.newsCreatePage.returnFromPreviewNewsPageURLCheck();
        }

        // Save and verify
        await this.createPage.clickSaveButton();
        await this.newsNodePage.newsNodeURLCheck();
        await this.newsNodePage.verifyNews({});
    }
    // edit News method
    async editNews(options: EditSaveOptions)
    {
        // should be on node page already
        await this.newsNodePage.newsNodeURLCheck();

        // open moderation sidebar
        await this.moderationSideBar.openModerationSideBar();
        // click edit content
        await this.moderationSideBar.clickEditContentButton();

        // complete news form using edit isolated test data 
        await this.newsEditPage.editNewsForm({
            newsTitle: this.testData.News.titleEdited,
            newsType: this.testData.News.newsTypeEdited,
            revisionLogMessage: this.testData.News.revisionlogEdited,
            newsIntoParagraph: this.testData.News.introductoryParagraphEdited,
            pubDate: this.testData.News.publicationDateEdited,
            newsteaser: this.testData.News.teaserEdited,
            newsBodyField: this.testData.News.bodyEdited,
            newsNoteToEditor: this.testData.News.notesToEditorEdited
        });

        // setting test set up data to new title
        this.testSetUpData.contentTitleforTest.contentTitle = this.testData.News.titleEdited;
        //Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview news method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.newsNodePage.verifyEditedNews({});
            await this.previewPage.clickBackToContentEdittingButton();
            await this.newsEditPage.returnFromPreviewNewsPageURLCheck();
        }

        // Save and verify
        await this.createPage.clickSaveButton();
        await this.newsNodePage.newsNodeURLCheck();
        await this.newsNodePage.verifyEditedNews({});
    }

    async deleteNews(options: DeleteOptions)
    {
        // should be on node page already
        await this.newsNodePage.newsNodeURLCheck();
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
            await this.newsNodePage.newsNodeURLCheck();
        }
    }

    // create News method
    async createNewsWithGallery()
    {
        // navigate to create news
        await this.navigateTocreateNews();

        // complete news form using isolated test data 
        await this.newsCreatePage.fillNewsFormWithGallery({
            newsTitle: this.testData.News.title,
            newsType: this.testData.News.newsType,
            revisionLogMessage: this.testData.News.revisionlog,
            newsIntoParagraph: this.testData.News.introductoryParagraph,
            newsteaser: this.testData.News.teaser,
            newsBodyField: this.testData.Gallery.title,
            newsNoteToEditor: this.testData.News.notesToEditor
        });

        //Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // Save and verify
        await this.createPage.clickSaveButton();
        await this.newsNodePage.newsNodeURLCheck();
        await this.newsNodePage.verifyNewsWithGallery();
    }

}




