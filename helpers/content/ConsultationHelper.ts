import { Page } from '@playwright/test';
import { BasePage } from '@poms/base-pages/BasePage';
import { ConsultationCreatePage } from '@poms/content-pages/Consultation/ConsultationCreatePage';
import { ConsultationEditPage } from '@poms/content-pages/Consultation/ConsultationEditPage';
import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';
import { UserPage } from '@poms/base-pages/UserPage';
import { ContentPage } from '@poms/base-pages/ContentPage';
import { AddContentPage } from '@poms/base-pages/AddContentPage';
import { TestSetUpData, TestData } from '../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { CreatePages } from '@poms/base-pages/CreatePages';
import { ConsultationNodePage } from '@poms/content-pages/Consultation/ConsultationNodePage';
import { DeletePage } from '@poms/base-pages/DeletePage';

export interface SaveOptions
{
    preview: boolean;
    mandatoryFieldCheck: boolean;
    existingRemoteDocumentName?: string;
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

export class ConsultationHelper
{
    // pages
    private userPage: UserPage;
    private basePage: BasePage;
    private contentPage: ContentPage;
    private addContentPage: AddContentPage;
    private consultationCreatePage: ConsultationCreatePage;
    private consultationEditPage: ConsultationEditPage;
    private moderationSideBar: ModerationSideBar;
    private previewPage: PreviewPage;
    private createPage: CreatePages;
    private consultationNodePage: ConsultationNodePage;
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
        this.consultationCreatePage = new ConsultationCreatePage(page, testSetUpData, testData);
        this.consultationEditPage = new ConsultationEditPage(page, testSetUpData, testData);
        this.moderationSideBar = new ModerationSideBar(page, testSetUpData, testData);
        this.previewPage = new PreviewPage(page);
        this.createPage = new CreatePages(page, testSetUpData, testData);
        this.consultationNodePage = new ConsultationNodePage(page, testSetUpData, testData);
        this.deletePage = new DeletePage(page);
    }

    // navigation method
    async navigateTocreateConsultation()
    {
        await this.basePage.clickContentLink();
        await this.contentPage.contentPageURLCheck();
        await this.contentPage.clickAddContentButton();
        await this.addContentPage.addContentPageURLCheck();
        await this.addContentPage.selectContent();
    }

    // create Consultation method
    async createConsultation(options: SaveOptions)
    {
        // navigate to create consultation
        await this.navigateTocreateConsultation();

        // If we're doing mandatory field check, do not fill form
        if (options?.mandatoryFieldCheck)
        {
            await this.consultationCreatePage.mandatoryFieldCheck();
        }

        // complete consultation form using isolated test data 
        await this.consultationCreatePage.fillConsultationForm({
            consultationTitle: this.testData.Consultation.title,
            revisionLogMessage: this.testData.Consultation.revisionlog,
            consultationSummary: this.testData.Consultation.summary,
            consultationStartDate: this.testData.Consultation.startDate,
            consultationStartTime: this.testData.Consultation.startTime,
            consultationEndDate: this.testData.Consultation.endDate,
            consultationEndTime: this.testData.Consultation.endTime,
            consultationBody: this.testData.Consultation.body,
            consultationRespondOnline: this.testData.Consultation.respondeOnline,
            consultationEmailAddress: this.testData.Consultation.emailAddress,
            consultationPostalAddress: this.testData.Consultation.postalAddress,
            existingRemoteDocumentName: options.existingRemoteDocumentName,
        });

        //Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview consultation method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.consultationNodePage.verifyConsultation({
                preview: true,
            });
            await this.previewPage.clickBackToContentEdittingButton();
            await this.consultationCreatePage.returnFromPreviewConsultationPageURLCheck();
        }

        // Save and verify
        await this.createPage.clickSaveButton();
        await this.consultationNodePage.consultationNodeURLCheck();
        await this.consultationNodePage.verifyConsultation({
            preview: true,
        });
    }

    // edit Consultation method
    async editConsultation(options: EditSaveOptions)
    {
        // should be on node page already
        await this.consultationNodePage.consultationNodeURLCheck();

        // open moderation sidebar
        await this.moderationSideBar.openModerationSideBar();
        // click edit content
        await this.moderationSideBar.clickEditContentButton();

        // complete consultation form using edit isolated test data 
        await this.consultationEditPage.editConsultationForm({
            consultationTitle: this.testData.Consultation.titleEdited,
            consPubDate: this.testData.Consultation.datePublished,
            revisionLogMessage: this.testData.Consultation.revisionlogEdited,
            consultationSummary: this.testData.Consultation.summaryEdited,
            consultationStartDate: this.testData.Consultation.startDateEdited,
            consultationStartTime: this.testData.Consultation.startTimeEdited,
            consultationEndDate: this.testData.Consultation.endDateEdited,
            consultationEndTime: this.testData.Consultation.endTimeEdited,
            consultationBody: this.testData.Consultation.bodyEdited,
            consultationRespondOnline: this.testData.Consultation.respondeOnlineEdited,
            consultationEmailAddress: this.testData.Consultation.emailAddressEdited,
            consultationPostalAddress: this.testData.Consultation.postalAddressEdited
        });

        // setting test set up data to new title
        this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Consultation.titleEdited;

        //Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview consultation method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.consultationNodePage.verifyEditedConsultation({ preview: true });
            await this.previewPage.clickBackToContentEdittingButton();
            await this.consultationEditPage.returnFromPreviewConsultationPageURLCheck();
        }

        // Save and verify
        await this.createPage.clickSaveButton();
        await this.consultationNodePage.consultationNodeURLCheck();
        await this.consultationNodePage.verifyEditedConsultation({
            preview: false,
        });
    }

    async deleteConsultation(options: DeleteOptions)
    {
        // should be on node page already
        await this.consultationNodePage.consultationNodeURLCheck();
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
            await this.consultationNodePage.consultationNodeURLCheck();
        }
    }

    // create Consultation method
    async createFutureConsultation(options: SaveOptions)
    {
        // navigate to create consultation
        await this.navigateTocreateConsultation();

        // If we're doing mandatory field check, do not fill form
        if (options?.mandatoryFieldCheck)
        {
            await this.consultationCreatePage.mandatoryFieldCheck();
        }

        // complete consultation form using isolated test data 
        await this.consultationCreatePage.fillConsultationForm({
            consultationTitle: this.testData.Consultation.title,
            revisionLogMessage: this.testData.Consultation.revisionlog,
            consultationSummary: this.testData.Consultation.summary,
            consultationStartDate: this.testData.Consultation.futureStartDate,
            consultationStartTime: this.testData.Consultation.startTime,
            consultationEndDate: this.testData.Consultation.endDate,
            consultationEndTime: this.testData.Consultation.endTime,
            consultationBody: this.testData.Consultation.body,
            consultationRespondOnline: this.testData.Consultation.respondeOnline,
            consultationEmailAddress: this.testData.Consultation.emailAddress,
            consultationPostalAddress: this.testData.Consultation.postalAddress,
        });

        //Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview consultation method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.previewPage.clickBackToContentEdittingButton();
            await this.consultationCreatePage.returnFromPreviewConsultationPageURLCheck();
        }

        // Save and verify
        await this.createPage.clickSaveButton();
        await this.consultationNodePage.consultationNodeURLCheck();
        await this.consultationNodePage.verifyFutureConsultation({
            preview: false,
        });
    }

}




