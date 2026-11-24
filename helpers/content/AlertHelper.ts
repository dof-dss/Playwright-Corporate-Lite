import { Page } from '@playwright/test';
import { BasePage } from '@poms/base-pages/BasePage';
import { AlertCreatePage } from '@poms/content-pages/Alert/AlertCreatePage';
import { AlertEditPage } from '@poms/content-pages/Alert/AlertEditPage';
import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';
import { UserPage } from '@poms/base-pages/UserPage';
import { ContentPage } from '@poms/base-pages/ContentPage';
import { AddContentPage } from '@poms/base-pages/AddContentPage';
import { TestSetUpData, TestData } from '../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { CreatePages } from '@poms/base-pages/CreatePages';
import { AlertNodePage } from '@poms/content-pages/Alert/AlertNodePage';
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

export class AlertHelper
{
    // pages
    private readonly userPage: UserPage;
    private readonly basePage: BasePage;
    private readonly contentPage: ContentPage;
    private readonly addContentPage: AddContentPage;
    private readonly alertCreatePage: AlertCreatePage;
    private readonly alertEditPage: AlertEditPage;
    private readonly moderationSideBar: ModerationSideBar;
    private readonly previewPage: PreviewPage;
    private readonly createPage: CreatePages;
    private readonly alertNodePage: AlertNodePage;
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
        this.alertCreatePage = new AlertCreatePage(page, testSetUpData, testData);
        this.alertEditPage = new AlertEditPage(page, testSetUpData, testData);
        this.moderationSideBar = new ModerationSideBar(page, testSetUpData, testData);
        this.previewPage = new PreviewPage(page);
        this.createPage = new CreatePages(page, testSetUpData, testData);
        this.alertNodePage = new AlertNodePage(page, testSetUpData, testData);
        this.deletePage = new DeletePage(page);
    }

    // navigation method
    async navigateTocreateAlert()
    {
        await this.basePage.clickContentLink();
        await this.contentPage.contentPageURLCheck();
        await this.contentPage.clickAddContentButton();
        await this.addContentPage.addContentPageURLCheck();
        await this.addContentPage.selectContent();
    }

    // create Alert method
    async createAlert(options: SaveOptions)
    {
        // navigate to create alert
        await this.navigateTocreateAlert();

        // If we're doing mandatory field check, do not fill form
        if (options?.mandatoryFieldCheck)
        {
            await this.alertCreatePage.mandatoryFieldCheck();
        }

        // complete alert form using isolated test data 
        await this.alertCreatePage.fillAlertForm({
            alertTitle: this.testData.Alert.title,
            revisionLogMessage: this.testData.Alert.revisionlog,
            alertBody: this.testData.Alert.body,
            alertTeaser: this.testData.Alert.teaser,
            publishedDate: this.testData.Alert.publishedDate,
            photoFileName: this.testData.Media.imageFileName,
        });

        //Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview alert method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.alertNodePage.verifyAlert();
            await this.previewPage.clickBackToContentEdittingButton();
            await this.alertCreatePage.returnFromPreviewAlertPageURLCheck();
        }

        // Save and verify
        await this.createPage.clickSaveButton();
        await this.alertNodePage.alertNodeURLCheck();
        await this.alertNodePage.verifyAlert();
    }

    // edit Alert method
    async editAlert(options: EditSaveOptions)
    {
        // should be on node page already
        await this.alertNodePage.alertNodeURLCheck();

        // open moderation sidebar
        await this.moderationSideBar.openModerationSideBar();
        // click edit content
        await this.moderationSideBar.clickEditContentButton();

        // complete alert form using edit isolated test data with image replacement
        await this.alertEditPage.editAlertForm({
            alertTitle: this.testData.Alert.titleEdited,
            revisionLogMessage: this.testData.Alert.revisionlogEdited,
            alertBody: this.testData.Alert.bodyEdited,
            alertTeaser: this.testData.Alert.teaserEdited,
            publishedDate: this.testData.Alert.publishedDateEdited,
            photoFileName: this.testData.Media.imageFileNameEdited,
        });

        // setting test set up data to new title
        this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Alert.titleEdited;

        //Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview alert method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.alertNodePage.verifyEditedAlert();
            await this.previewPage.clickBackToContentEdittingButton();
            await this.alertEditPage.returnFromPreviewAlertPageURLCheck();
        }

        // Save and verify
        await this.createPage.clickSaveButton();
        await this.alertNodePage.alertNodeURLCheck();
        await this.alertNodePage.verifyEditedAlert();
    }

    async deleteAlert(options: DeleteOptions)
    {
        // should be on node page already
        await this.alertNodePage.alertNodeURLCheck();
        // open moderation sidebar
        await this.moderationSideBar.openModerationSideBar();
        // click delete content
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
            await this.alertNodePage.alertNodeURLCheck();
        }
    }

}
