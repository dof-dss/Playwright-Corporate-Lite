import { Page, expect } from '@playwright/test';
import { BasePage } from '@poms/base-pages/BasePage';
import { LinkCreatePage } from '@poms/content-pages/Link/LinkCreatePage';
import { LinkEditPage } from '@poms/content-pages/Link/LinkEditPage';
import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';
import { UserPage } from '@poms/base-pages/UserPage';
import { ContentPage } from '@poms/base-pages/ContentPage';
import { AddContentPage } from '@poms/base-pages/AddContentPage';
import { TestSetUpData, TestData } from '../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { CreatePages } from '@poms/base-pages/CreatePages';
import { LinkNodePage } from '@poms/content-pages/Link/LinkNodePage';
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

export class LinkHelper
{
    // pages
    private readonly userPage: UserPage;
    private readonly basePage: BasePage;
    private readonly contentPage: ContentPage;
    private readonly addContentPage: AddContentPage;
    private readonly linkCreatePage: LinkCreatePage;
    private readonly linkEditPage: LinkEditPage;
    private readonly moderationSideBar: ModerationSideBar;
    private readonly previewPage: PreviewPage;
    private readonly createPage: CreatePages;
    private readonly linkNodePage: LinkNodePage;
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
        this.linkCreatePage = new LinkCreatePage(page, testSetUpData, testData);
        this.linkEditPage = new LinkEditPage(page, testSetUpData, testData);
        this.moderationSideBar = new ModerationSideBar(page, testSetUpData, testData);
        this.previewPage = new PreviewPage(page);
        this.createPage = new CreatePages(page, testSetUpData, testData);
        this.linkNodePage = new LinkNodePage(page, testSetUpData, testData);
        this.deletePage = new DeletePage(page);
    }

    // navigation method
    async navigateToCreateLink()
    {
        await this.basePage.clickContentLink();
        await this.contentPage.contentPageURLCheck();
        await this.contentPage.clickAddContentButton();
        await this.addContentPage.addContentPageURLCheck();
        await this.addContentPage.selectContent();
    }

    // create Link method
    async createLink(options: SaveOptions)
    {
        // navigate to create link
        await this.navigateToCreateLink();



        // If we're doing mandatory field check, do not fill form
        if (options?.mandatoryFieldCheck)
        {
            await this.linkCreatePage.mandatoryFieldCheck();
        }

        // complete link form using isolated test data 
        await this.linkCreatePage.fillLinkForm({
            linkTitle: this.testData.Link.title,
            revisionLogMessage: this.testData.Link.revisionlog,
            linkURL: this.testData.Link.linkURL,
            linkType: this.testData.Link.linkType,
            linkLanguage: this.testData.Link.linkLanguage,
        });

        // updating global topic set
        //Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview link method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.linkNodePage.verifyLink({
                preview: true,
            });
            await this.previewPage.clickBackToContentEdittingButton();
            await this.linkCreatePage.returnFromPreviewLinkPageURLCheck();
        }

        // Save and verify
        await this.createPage.clickSaveButton();
        await this.linkNodePage.linkNodeURLCheck();
        await this.linkNodePage.verifyLink({
            preview: false,
        });
    }

    // edit Link method
    async editLink(options: EditSaveOptions)
    {
        // should be on node page already
        await this.linkNodePage.linkNodeURLCheck();

        // open moderation sidebar
        await this.moderationSideBar.openModerationSideBar();
        // click edit content
        await this.moderationSideBar.clickEditContentButton();

        // complete link form using edit isolated test data 
        await this.linkEditPage.editLinkForm({
            linkTitle: this.testData.Link.titleEdited,
            revisionLogMessage: this.testData.Link.revisionlogEdited,
            linkURL: this.testData.Link.linkURLEdited,
            linkType: this.testData.Link.linkTypeEdited,
            linkLanguage: this.testData.Link.linkLanguageEdited,
        });



        //Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview link method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.linkNodePage.verifyEditedLink({
                preview: true,
            });
            await this.previewPage.clickBackToContentEdittingButton();
            await this.linkEditPage.returnFromPreviewLinkPageURLCheck();
        }

        // Save and verify
        await this.createPage.clickSaveButton();
        await this.linkNodePage.linkNodeURLCheck();
        await this.linkNodePage.verifyEditedLink({
            preview: false,
        });
    }

    async deleteLink(options: DeleteOptions)
    {
        // should be on node page already
        await this.linkNodePage.linkNodeURLCheck();
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
            await this.linkNodePage.linkNodeURLCheck();
        }
    }

    // create Link method
    async reorderLink()
    {
        await this.page.getByRole('link', { name: 'Content', exact: true }).hover();
        await this.page.getByRole('link', { name: 'Links' }).hover();
        await this.page.getByRole('link', { name: 'Links - quick links' }).click();

        const targetTitle = this.testSetUpData.contentTitleforTest.contentTitle || this.testData.Link.title;
        const sourceHandle = this.page.locator(
            `//tr[contains(@class,'draggable')][.//td[@headers='view-title-table-column']//a[contains(normalize-space(.),"${targetTitle}")]]//a[contains(@class,'js-tabledrag-handle')]`
        ).first();
        const topHandle = this.page.locator("(//tr[contains(@class,'draggable')]//a[contains(@class,'js-tabledrag-handle')])[1]");

        await expect(sourceHandle).toBeVisible();
        await expect(topHandle).toBeVisible();

        // Drupal tabledrag can be flaky with HTML5 drag-and-drop, so keep a mouse fallback.
        const dragSucceeded = await sourceHandle.dragTo(topHandle).then(() => true).catch(() => false);

        if (!dragSucceeded)
        {
            const sourceBox = await sourceHandle.boundingBox();
            const targetBox = await topHandle.boundingBox();

            if (!sourceBox || !targetBox)
            {
                throw new Error('Unable to calculate drag coordinates for link reorder');
            }

            await this.page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
            await this.page.mouse.down();
            await this.page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + 4, { steps: 20 });
            await this.page.mouse.up();
        }

        const firstRowTitle = this.page.locator(
            "(//tr[contains(@class,'draggable')]//td[@headers='view-title-table-column']//div[contains(@class,'tabledrag-cell-content__item')]/a)[1]"
        );
        await expect(firstRowTitle).toContainText(targetTitle);

        const saveButton = this.page.getByRole('button', { name: 'Save' });
        if (await saveButton.isVisible())
        {
            await saveButton.click();
        }
    }

}
