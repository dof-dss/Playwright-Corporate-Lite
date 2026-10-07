import { Page } from '@playwright/test';
import { BasePage } from '@poms/base-pages/BasePage';
import { ApplicationCreatePage } from '@poms/content-pages/Application/ApplicationCreatePage';
import { ApplicationEditPage } from '@poms/content-pages/Application/ApplicationEditPage';
import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';
import { UserPage } from '@poms/base-pages/UserPage';
import { ContentPage } from '@poms/base-pages/ContentPage';
import { AddContentPage } from '@poms/base-pages/AddContentPage';
import { TestSetUpData, TestData } from '../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { CreatePages } from '@poms/base-pages/CreatePages';
import { ApplicationNodePage } from '@poms/content-pages/Application/ApplicationNodePage';
import { DeletePage } from '@poms/base-pages/DeletePage';

export interface SaveOptions
{
    preview: boolean;
    mandatoryFieldCheck: boolean;
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

export class ApplicationHelper
{
    // pages
    private readonly userPage: UserPage;
    private readonly basePage: BasePage;
    private readonly contentPage: ContentPage;
    private readonly addContentPage: AddContentPage;
    private readonly applicationCreatePage: ApplicationCreatePage;
    private readonly applicationEditPage: ApplicationEditPage;
    private readonly moderationSideBar: ModerationSideBar;
    private readonly previewPage: PreviewPage;
    private readonly createPage: CreatePages;
    private readonly applicationNodePage: ApplicationNodePage;
    private readonly deletePage: DeletePage;

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
        this.applicationCreatePage = new ApplicationCreatePage(page, testSetUpData, testData);
        this.applicationEditPage = new ApplicationEditPage(page, testSetUpData, testData);
        this.moderationSideBar = new ModerationSideBar(page, testSetUpData, testData);
        this.previewPage = new PreviewPage(page);
        this.createPage = new CreatePages(page, testSetUpData, testData);
        this.applicationNodePage = new ApplicationNodePage(page, testSetUpData, testData);
        this.deletePage = new DeletePage(page);
    }

    // navigation method
    async navigateTocreateApplication()
    {
        await this.basePage.clickContentLink();
        await this.contentPage.contentPageURLCheck();
        await this.contentPage.clickAddContentButton();
        await this.addContentPage.addContentPageURLCheck();
        await this.addContentPage.selectContent();
    }

    // create Application method
    async createApplication(options: SaveOptions)
    {
        // navigate to create application
        await this.navigateTocreateApplication();

        // If we're doing mandatory field check, do not fill form
        if (options?.mandatoryFieldCheck)
        {
            await this.applicationCreatePage.mandatoryFieldCheck();
        }

        // complete application form using isolated test data 
        await this.applicationCreatePage.fillApplicationForm({
            applicationTitle: this.testData.Application.title,
            revisionLogMessage: this.testData.Application.revisionlog,
            applicationSummary: this.testData.Application.summary,
            beforeyoustart: this.testData.Application.beforeyoustart,
            additionalinfo: this.testData.Application.additionalinfo,
            topic: this.testData.HSE_SiteTopics.topic,
        });

        //Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview application method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.applicationNodePage.verifyApplication();
            await this.previewPage.clickBackToContentEdittingButton();
            await this.applicationCreatePage.returnFromPreviewApplicationPageURLCheck();
        }

        // Save and verify
        await this.createPage.clickSaveButton();
        await this.applicationNodePage.applicationNodeURLCheck();
        await this.applicationNodePage.verifyApplication();
    }

    // edit Application method
    async editApplication(options: EditSaveOptions)
    {
        // should be on node page already
        await this.applicationNodePage.applicationNodeURLCheck();

        // open moderation sidebar
        await this.moderationSideBar.openModerationSideBar();
        // click edit content
        await this.moderationSideBar.clickEditContentButton();

        // complete application form using edit isolated test data 
        await this.applicationEditPage.editApplicationForm({
            applicationTitle: this.testData.Application.titleEdited,
            revisionLogMessage: this.testData.Application.revisionlogEdited,
            beforeyoustart: this.testData.Application.beforeyoustartEdited,
            applicationSummary: this.testData.Application.summaryEdited,
            additionalinfo: this.testData.Application.additionalinfoEdited,
            topic: this.testData.HSE_SiteTopics.topicEdited,
            topic2: this.testData.HSE_SiteTopics.topic2,
        });

        // setting test set up data to new title
        this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Application.titleEdited;

        //Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview application method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.applicationNodePage.verifyEditedApplication();
            await this.previewPage.clickBackToContentEdittingButton();
            await this.applicationEditPage.returnFromPreviewApplicationPageURLCheck();
        }

        // Save and verify
        await this.createPage.clickSaveButton();
        await this.applicationNodePage.applicationNodeURLCheck();
        await this.applicationNodePage.verifyEditedApplication();
    }

    async deleteApplication(options: DeleteOptions)
    {
        // should be on node page already
        await this.applicationNodePage.applicationNodeURLCheck();
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
            await this.applicationNodePage.applicationNodeURLCheck();
        }
    }

}




