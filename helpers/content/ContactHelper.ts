import { Page } from '@playwright/test';
import { BasePage } from '@poms/base-pages/BasePage';
import { ContactCreatePage } from '@poms/content-pages/Contact/ContactCreatePage';
import { ContactEditPage } from '@poms/content-pages/Contact/ContactEditPage';
import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';
import { UserPage } from '@poms/base-pages/UserPage';
import { ContentPage } from '@poms/base-pages/ContentPage';
import { AddContentPage } from '@poms/base-pages/AddContentPage';
import { TestSetUpData, TestData } from '../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { CreatePages } from '@poms/base-pages/CreatePages';
import { ContactNodePage } from '@poms/content-pages/Contact/ContactNodePage';
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

export class ContactHelper
{
    // pages
    private readonly userPage: UserPage;
    private readonly basePage: BasePage;
    private readonly contentPage: ContentPage;
    private readonly addContentPage: AddContentPage;
    private readonly contactCreatePage: ContactCreatePage;
    private readonly contactEditPage: ContactEditPage;
    private readonly moderationSideBar: ModerationSideBar;
    private readonly previewPage: PreviewPage;
    private readonly createPage: CreatePages;
    private readonly contactNodePage: ContactNodePage;
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
        this.contactCreatePage = new ContactCreatePage(page, testSetUpData, testData);
        this.contactEditPage = new ContactEditPage(page, testSetUpData, testData);
        this.moderationSideBar = new ModerationSideBar(page, testSetUpData, testData);
        this.previewPage = new PreviewPage(page);
        this.createPage = new CreatePages(page, testSetUpData, testData);
        this.contactNodePage = new ContactNodePage(page, testSetUpData, testData);
        this.deletePage = new DeletePage(page);
    }

    // navigation method
    async navigateTocreateContact()
    {
        await this.basePage.clickContentLink();
        await this.contentPage.contentPageURLCheck();
        await this.contentPage.clickAddContentButton();
        await this.addContentPage.addContentPageURLCheck();
        await this.addContentPage.selectContent();
    }

    // create Contact method
    async createContact(options: SaveOptions)
    {
        // navigate to create contact
        await this.navigateTocreateContact();

        // If we're doing mandatory field check, do not fill form
        if (options?.mandatoryFieldCheck)
        {
            await this.contactCreatePage.mandatoryFieldCheck();
        }

        // complete contact form using isolated test data 
        await this.contactCreatePage.fillContactForm({
            contactTitle: this.testData.Contact.title,
            revisionLogMessage: this.testData.Contact.revisionlog,
            contactBody: this.testData.Contact.body,
            mapName: this.testData.Contact.mapName,
            mapLatitude: this.testData.Contact.mapLatitude,
            mapLongitude: this.testData.Contact.mapLongitude,
        });

        //Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview contact method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.contactNodePage.verifyContact({
            });
            await this.previewPage.clickBackToContentEdittingButton();
            await this.contactCreatePage.returnFromPreviewContactPageURLCheck();
        }

        // Save and verify
        await this.createPage.clickSaveButton();
        await this.contactNodePage.contactNodeURLCheck();
        await this.contactNodePage.verifyContact({
        });
    }

    // edit Contact method
    async editContact(options: EditSaveOptions)
    {
        // should be on node page already
        await this.contactNodePage.contactNodeURLCheck();

        // open moderation sidebar
        await this.moderationSideBar.openModerationSideBar();
        // click edit content
        await this.moderationSideBar.clickEditContentButton();

        // complete contact form using edit isolated test data 
        await this.contactEditPage.editContactForm({
            contactTitle: this.testData.Contact.titleEdited,
            revisionLogMessage: this.testData.Contact.revisionlogEdited,
            contactBody: this.testData.Contact.bodyEdited,
            mapLocationModalName: this.testData.Contact.mapLocationModalName,
            mapName: this.testData.Contact.mapNameEdited,
        });

        // setting test set up data to new title
        this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Contact.titleEdited;
        //Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview contact method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.contactNodePage.verifyEditedContact({
            });
            await this.previewPage.clickBackToContentEdittingButton();
            await this.contactEditPage.returnFromPreviewContactPageURLCheck();
        }

        // Save and verify
        await this.createPage.clickSaveButton();
        await this.contactNodePage.contactNodeURLCheck();
        await this.contactNodePage.verifyEditedContact({
        });
    }

    async deleteContact(options: DeleteOptions)
    {
        // should be on node page already
        await this.contactNodePage.contactNodeURLCheck();
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
            await this.contactNodePage.contactNodeURLCheck();
        }
    }

}




