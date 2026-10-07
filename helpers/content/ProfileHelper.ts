import { Page } from '@playwright/test';
import { BasePage } from '@poms/base-pages/BasePage';
import { ProfileCreatePage } from '@poms/content-pages/Profile/ProfileCreatePage';
import { ProfileEditPage } from '@poms/content-pages/Profile/ProfileEditPage';
import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';
import { UserPage } from '@poms/base-pages/UserPage';
import { ContentPage } from '@poms/base-pages/ContentPage';
import { AddContentPage } from '@poms/base-pages/AddContentPage';
import { TestSetUpData, TestData } from '../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { CreatePages } from '@poms/base-pages/CreatePages';
import { ProfileNodePage } from '@poms/content-pages/Profile/ProfileNodePage';
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

export class ProfileHelper
{
    private readonly userPage: UserPage;
    private readonly basePage: BasePage;
    private readonly contentPage: ContentPage;
    private readonly addContentPage: AddContentPage;
    private readonly profileCreatePage: ProfileCreatePage;
    private readonly profileEditPage: ProfileEditPage;
    private readonly moderationSideBar: ModerationSideBar;
    private readonly previewPage: PreviewPage;
    private readonly createPage: CreatePages;
    private readonly profileNodePage: ProfileNodePage;
    private readonly deletePage: DeletePage;

    constructor(
        private page: Page,
        private testSetUpData: typeof TestSetUpData,
        private testData: typeof TestData
    )
    {
        this.userPage = new UserPage(page, testSetUpData);
        this.basePage = new BasePage(page, testSetUpData);
        this.contentPage = new ContentPage(page, testSetUpData);
        this.addContentPage = new AddContentPage(page, testSetUpData);
        this.profileCreatePage = new ProfileCreatePage(page, testSetUpData, testData);
        this.profileEditPage = new ProfileEditPage(page, testSetUpData, testData);
        this.moderationSideBar = new ModerationSideBar(page, testSetUpData, testData);
        this.previewPage = new PreviewPage(page);
        this.createPage = new CreatePages(page, testSetUpData, testData);
        this.profileNodePage = new ProfileNodePage(page, testSetUpData, testData);
        this.deletePage = new DeletePage(page);
    }

    async navigateTocreateProfile()
    {
        await this.basePage.clickContentLink();
        await this.contentPage.contentPageURLCheck();
        await this.contentPage.clickAddContentButton();
        await this.addContentPage.addContentPageURLCheck();
        await this.addContentPage.selectContent();
    }

    async createProfile(options: SaveOptions)
    {
        await this.navigateTocreateProfile();

        if (options?.mandatoryFieldCheck)
        {
            await this.profileCreatePage.mandatoryFieldCheck();
        }

        await this.profileCreatePage.fillProfileForm({
            profileTitle: this.testData.Profile.title,
            revisionLogMessage: this.testData.Profile.revisionlog,
            department: this.testData.Profile.department,
            summary: this.testData.Profile.summary,
            body: this.testData.Profile.body,
        });

        this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Profile.title;

        await this.createPage.chooseSaveAsType();

        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.profileNodePage.verifyProfile();
            await this.previewPage.clickBackToContentEdittingButton();
            await this.profileCreatePage.returnFromPreviewProfilePageURLCheck();
        }

        await this.createPage.clickSaveButton();
        await this.profileNodePage.profileNodeURLCheck();
        await this.profileNodePage.verifyProfile();
    }

    async editProfile(options: EditSaveOptions)
    {
        await this.profileNodePage.profileNodeURLCheck();

        await this.moderationSideBar.openModerationSideBar();
        await this.moderationSideBar.clickEditContentButton();

        await this.profileEditPage.editProfileForm({
            profileTitle: this.testData.Profile.titleEdited,
            revisionLogMessage: this.testData.Profile.revisionlogEdited,
            department: this.testData.Profile.departmentEdited,
            summary: this.testData.Profile.summaryEdited,
            body: this.testData.Profile.bodyEdited,
        });

        this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Profile.titleEdited;

        await this.createPage.chooseSaveAsType();

        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.profileNodePage.verifyEditedProfile();
            await this.previewPage.clickBackToContentEdittingButton();
            await this.profileEditPage.returnFromPreviewProfilePageURLCheck();
        }

        await this.createPage.clickSaveButton();
        await this.profileNodePage.profileNodeURLCheck();
        await this.profileNodePage.verifyEditedProfile();
    }

    async deleteProfile(options: DeleteOptions)
    {
        await this.profileNodePage.profileNodeURLCheck();
        await this.moderationSideBar.openModerationSideBar();
        await this.moderationSideBar.clickDeleteButton();

        if (options.delete === true)
        {
            await this.deletePage.clickDelete();
            await this.deletePage.deleteNodeCofirmationCheck();
            await this.contentPage.confirmContentDoesNotExist(this.testSetUpData.contentTitleforTest.contentTitle);
            this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.deleted;
        }
        else if (options.cancel === true)
        {
            await this.deletePage.clickCancel();
            await this.profileNodePage.profileNodeURLCheck();
        }
    }
}