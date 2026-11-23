import { Page, expect } from '@playwright/test';
import { BasePage } from '@poms/base-pages/BasePage';
import { ContentPage } from '@poms/base-pages/ContentPage';
import { AddContentPage } from '@poms/base-pages/AddContentPage';
import { CreatePages } from '@poms/base-pages/CreatePages';
import { DeletePage } from '@poms/base-pages/DeletePage';
import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { PageCreatePage } from '@poms/content-pages/Page/PageCreatePage';
import { PageEditPage } from '@poms/content-pages/Page/PageEditPage';
import { PageNodePage } from '@poms/content-pages/Page/PageNodePage';
import { TestSetUpData, TestData } from '../../test-data/TestDataObject';

export interface SaveOptions
{
    preview: boolean;
    mandatoryFieldCheck: boolean;
}

export interface EditSaveOptions
{
    preview: boolean;
}

export interface DeleteOptions
{
    delete: boolean;
    cancel: boolean;
}

export class PageHelper
{
    private readonly basePage: BasePage;
    private readonly contentPage: ContentPage;
    private readonly addContentPage: AddContentPage;
    private readonly pageCreatePage: PageCreatePage;
    private readonly pageEditPage: PageEditPage;
    private readonly pageNodePage: PageNodePage;
    private readonly moderationSideBar: ModerationSideBar;
    private readonly previewPage: PreviewPage;
    private readonly createPages: CreatePages;
    private readonly deletePageDialog: DeletePage;

    constructor(
        private readonly page: Page,
        private readonly testSetUpData: typeof TestSetUpData,
        private readonly testData: typeof TestData
    )
    {
        this.basePage = new BasePage(page, testSetUpData);
        this.contentPage = new ContentPage(page, testSetUpData);
        this.addContentPage = new AddContentPage(page, testSetUpData);
        this.pageCreatePage = new PageCreatePage(page, testSetUpData, testData);
        this.pageEditPage = new PageEditPage(page, testSetUpData, testData);
        this.pageNodePage = new PageNodePage(page, testSetUpData, testData);
        this.moderationSideBar = new ModerationSideBar(page, testSetUpData, testData);
        this.previewPage = new PreviewPage(page);
        this.createPages = new CreatePages(page, testSetUpData, testData);
        this.deletePageDialog = new DeletePage(page);
    }

    async navigateToCreatePage()
    {
        this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.page;
        this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Page.title;

        await this.basePage.clickContentLink();
        await this.contentPage.contentPageURLCheck();
        await this.contentPage.clickAddContentButton();
        await this.addContentPage.addContentPageURLCheck();
        await this.addContentPage.selectContent();
        await this.pageCreatePage.createPageURLCheck();
    }

    async createPage(options: SaveOptions)
    {
        await this.navigateToCreatePage();

        if (options.mandatoryFieldCheck)
        {
            await this.pageCreatePage.mandatoryFieldCheck();
        }

        await this.pageCreatePage.fillPageForm({
            pageTitle: this.testData.Page.title,
            pageBody: this.testData.Page.body,
            revisionLogMessage: this.testData.Page.revisionlog
        });
        await this.createPages.chooseSaveAsType();

        if (options.preview)
        {
            await this.createPages.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.pageNodePage.verifyPage();
            await this.previewPage.clickBackToContentEdittingButton();
            await this.pageCreatePage.returnFromPreviewPageURLCheck();
        }

        await this.createPages.clickSaveButton();
        await this.pageNodePage.verifyPage();
    }

    async editPage(options: EditSaveOptions)
    {
        await this.pageNodePage.verifyPage();
        await this.moderationSideBar.openModerationSideBar();
        await this.moderationSideBar.clickEditContentButton();

        await this.pageEditPage.editPageForm({
            pageTitle: this.testData.Page.titleEdited,
            pageBody: this.testData.Page.bodyEdited,
            revisionLogMessage: this.testData.Page.revisionlogEdited
        });

        this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Page.titleEdited;
        await this.createPages.chooseSaveAsType();

        if (options.preview)
        {
            await this.createPages.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.pageNodePage.verifyEditedPage();
            await this.previewPage.clickBackToContentEdittingButton();
            await this.pageEditPage.returnFromPreviewPagePageURLCheck();
        }

        await this.createPages.clickSaveButton();
        await this.pageNodePage.verifyEditedPage();
    }

    async deletePage(options: DeleteOptions)
    {
        await expect(this.page.getByRole('heading', {
            name: this.testSetUpData.contentTitleforTest.contentTitle,
            level: 1
        })).toBeVisible();

        await this.moderationSideBar.openModerationSideBar();
        await this.moderationSideBar.clickDeleteButton();

        if (options.delete)
        {
            await this.deletePageDialog.clickDelete();
            await this.deletePageDialog.deleteNodeCofirmationCheck();
            await this.contentPage.confirmContentDoesNotExist(this.testSetUpData.contentTitleforTest.contentTitle);
            this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.deleted;
        }
        else if (options.cancel)
        {
            await this.deletePageDialog.clickCancel();
            await expect(this.page.getByRole('heading', {
                name: this.testSetUpData.contentTitleforTest.contentTitle,
                level: 1
            })).toBeVisible();
        }
    }
}