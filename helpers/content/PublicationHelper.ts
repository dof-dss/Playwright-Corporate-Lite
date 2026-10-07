import { Page } from '@playwright/test';
import { BasePage } from '@poms/base-pages/BasePage';
import { PublicationCreatePage } from '@poms/content-pages/Publication/PublicationCreatePage';
import { PublicationEditPage } from '@poms/content-pages/Publication/PublicationEditPage';
import { PublicationNodePage } from '@poms/content-pages/Publication/PublicationNodePage';
import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';
import { UserPage } from '@poms/base-pages/UserPage';
import { ContentPage } from '@poms/base-pages/ContentPage';
import { AddContentPage } from '@poms/base-pages/AddContentPage';
import { TestSetUpData, TestData } from '../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { CreatePages } from '@poms/base-pages/CreatePages';
import { DeletePage } from '@poms/base-pages/DeletePage';

export interface SaveOptions
{
    preview: boolean;
    mandatoryFieldCheck: boolean;
    existingDocumentName?: string;
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

export class PublicationHelper
{
    // pages
    private userPage: UserPage;
    private basePage: BasePage;
    private contentPage: ContentPage;
    private addContentPage: AddContentPage;
    private publicationCreatePage: PublicationCreatePage;
    private publicationEditPage: PublicationEditPage;
    private publicationNodePage: PublicationNodePage;
    private moderationSideBar: ModerationSideBar;
    private previewPage: PreviewPage;
    private createPage: CreatePages;
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
        this.publicationCreatePage = new PublicationCreatePage(page, testSetUpData, testData);
        this.publicationEditPage = new PublicationEditPage(page, testSetUpData, testData);
        this.publicationNodePage = new PublicationNodePage(page, testSetUpData, testData);
        this.moderationSideBar = new ModerationSideBar(page, testSetUpData, testData);
        this.previewPage = new PreviewPage(page);
        this.createPage = new CreatePages(page, testSetUpData, testData);
        this.deletePage = new DeletePage(page);
    }

    // navigation method
    async navigateTocreatePublication()
    {
        await this.basePage.clickContentLink();
        await this.contentPage.contentPageURLCheck();
        await this.contentPage.clickAddContentButton();
        await this.addContentPage.addContentPageURLCheck();
        await this.addContentPage.selectContent();
    }

    // create Publication method
    async createPublication(options: SaveOptions)
    {
        // navigate to create publication
        await this.navigateTocreatePublication();

        // If we're doing mandatory field check, do not fill form
        if (options?.mandatoryFieldCheck)
        {
            //await this.publicationCreatePage.mandatoryFieldCheck();
        }

        // complete publication form using isolated test data 
        await this.publicationCreatePage.fillPublicationForm({
            publicationTitle: this.testData.Publication.title,
            revisionLogMessage: this.testData.Publication.revisionlog,
            pubType: this.testData.Publication.publicationType,
            publicationSummary: this.testData.Publication.summary,
            publicationBodyField: this.testData.Publication.body,
            existingDocumentName: options.existingDocumentName,
        });

        //Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview publication method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.publicationNodePage.verifyPublication({});
            await this.previewPage.clickBackToContentEdittingButton();
            await this.publicationCreatePage.returnFromPreviewPublicationPageURLCheck();
        }

        // Save and verify
        await this.createPage.clickSaveButton();
        await this.publicationNodePage.publicationNodeURLCheck();
        await this.publicationNodePage.verifyPublication({});
    }

    // edit Publication method
    async editPublication(options: EditSaveOptions)
    {
        // should be on node page already
        await this.publicationNodePage.publicationNodeURLCheck();

        // open moderation sidebar
        await this.moderationSideBar.openModerationSideBar();
        // click edit content
        await this.moderationSideBar.clickEditContentButton();

        // complete publication form using edit isolated test data 
        await this.publicationEditPage.editPublicationForm({
            publicationTitle: this.testData.Publication.titleEdited,
            publicationPublishedDate: this.testData.Publication.datePublished,
            revisionLogMessage: this.testData.Publication.revisionlogEdited,
            publicationLastUpdatedDate: this.testData.Publication.lastUpdatedDateEdited,
            publicationLastUpdatedTime: this.testData.Publication.lastUpdatedTimeEdited,
            pubType: this.testData.Publication.publicationTypeEdited,
            publicationSummary: this.testData.Publication.summaryEdited,
            publicationBodyField: this.testData.Publication.bodyEdited,
        });

        // setting test set up data to new title
        this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Publication.titleEdited;

        //Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview publication method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.publicationNodePage.verifyEditedPublication({});
            await this.previewPage.clickBackToContentEdittingButton();
            await this.publicationEditPage.returnFromPreviewPublicationPageURLCheck();
        }

        // Save and verify
        await this.createPage.clickSaveButton();
        await this.publicationNodePage.publicationNodeURLCheck();
        await this.publicationNodePage.verifyEditedPublication({});
    }

    async deletePublication(options: DeleteOptions)
    {
        // should be on node page already
        await this.publicationNodePage.publicationNodeURLCheck();
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
            await this.publicationNodePage.publicationNodeURLCheck();
        }
    }

    // create Publication method
    async createExternalLinkPublication()
    {
        // navigate to create publication
        await this.navigateTocreatePublication();

        // complete publication form using isolated test data 
        await this.publicationCreatePage.fillExternalLinkPublicationForm({
            publicationTitle: this.testData.Publication.title,
            revisionLogMessage: this.testData.Publication.revisionlog,
            pubType: this.testData.Publication.publicationType,
            publicationSummary: this.testData.Publication.summary,
            publicationBodyField: this.testData.Publication.body,
            publicationExteralLink: this.testData.Publication.externalPublication,
            publicationLinkText: this.testData.Publication.linkTextPubllication
        });

        //Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // Save and verify
        await this.createPage.clickSaveButton();
        await this.publicationNodePage.publicationNodeURLCheck();
        await this.publicationNodePage.verifyExternalLinkPublication({});
    }

    // create Publication method
    async editExternalLinkPublication()
    {
        // should be on node page already
        await this.publicationNodePage.publicationNodeURLCheck();

        // open moderation sidebar
        await this.moderationSideBar.openModerationSideBar();
        // click edit content
        await this.moderationSideBar.clickEditContentButton();

        // complete publication form using isolated test data 
        await this.publicationEditPage.editExternalLinkPublicationForm({
            publicationTitle: this.testData.Publication.titleEdited,
            revisionLogMessage: this.testData.Publication.revisionlog,
            publicationLastUpdatedDate: this.testData.Publication.lastUpdatedDateEdited,
            publicationLastUpdatedTime: this.testData.Publication.lastUpdatedTimeEdited,
            pubType: this.testData.Publication.publicationTypeEdited,
            publicationSummary: this.testData.Publication.summaryEdited,
            publicationBodyField: this.testData.Publication.bodyEdited,
            publicationExteralLink: this.testData.Publication.externalPublicationEdited,
            publicationLinkText: this.testData.Publication.linkTextPubllicationEdited
        });

        // updating title 
        this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Publication.titleEdited;

        //Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // Save and verify
        await this.createPage.clickSaveButton();
        await this.publicationNodePage.publicationNodeURLCheck();
        await this.publicationNodePage.verifyEditedExternalLinkPublication({});
    }
}




