import { Page, expect } from '@playwright/test';
import { BasePage } from '@poms/base-pages/BasePage';
import { FeatureCreatePage } from '@poms/content-pages/Feature/FeatureCreatePage';
import { FeatureEditPage } from '@poms/content-pages/Feature/FeatureEditPage';
import { FeatureNodePage } from '@poms/content-pages/Feature/FeatureNodePage';
import { FeatureComparePage } from '@poms/content-pages/Feature/FeatureComparePage';
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

export class FeatureHelper
{
    // pages
    private readonly userPage: UserPage;
    private readonly basePage: BasePage;
    private readonly contentPage: ContentPage;
    private readonly addContentPage: AddContentPage;
    private readonly featureCreatePage: FeatureCreatePage;
    private readonly featureEditPage: FeatureEditPage;
    private readonly moderationSideBar: ModerationSideBar;
    private readonly previewPage: PreviewPage;
    private readonly createPage: CreatePages;
    private readonly featureNodePage: FeatureNodePage;
    private readonly featureComparePage: FeatureComparePage;
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
        this.featureCreatePage = new FeatureCreatePage(page, testSetUpData, testData);
        this.featureEditPage = new FeatureEditPage(page, testSetUpData, testData);
        this.moderationSideBar = new ModerationSideBar(page, testSetUpData, testData);
        this.previewPage = new PreviewPage(page);
        this.createPage = new CreatePages(page, testSetUpData, testData);
        this.featureNodePage = new FeatureNodePage(page, testSetUpData, testData);
        this.featureComparePage = new FeatureComparePage(page, testSetUpData, testData);
        this.deletePage = new DeletePage(page);
    }

    // navigation method
    async navigateToCreateFeature()
    {
        await this.basePage.clickContentLink();
        await this.contentPage.contentPageURLCheck();
        await this.contentPage.clickAddContentButton();
        await this.addContentPage.addContentPageURLCheck();
        await this.addContentPage.selectContent();
    }

    // create Feature method
    async createFeature(options: SaveOptions)
    {
        // navigate to create feature
        await this.navigateToCreateFeature();

        // If we're doing mandatory field check, do not fill form
        if (options?.mandatoryFieldCheck)
        {
            await this.featureCreatePage.mandatoryFieldCheck();
        }

        // complete feature form using isolated test data 
        await this.featureCreatePage.fillFeatureForm({
            featureTitle: this.testData.Feature.title,
            revisionLogMessage: this.testData.Feature.revisionlog,
            linkURL: this.testData.Feature.linkURL,
            teaser: this.testData.Feature.teaser,
        });

        // Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview feature method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.featureNodePage.verifyFeature({
                preview: true,
            });
            await this.previewPage.clickBackToContentEdittingButton();
            await this.featureCreatePage.returnFromPreviewFeaturePageURLCheck();
        }

        // Save and verify
        await this.createPage.clickSaveButton();
        await this.featureNodePage.featureNodeURLCheck();
        await this.featureNodePage.verifyFeature({
            preview: false,
        });
    }

    // edit Feature method
    async editFeature(options: EditSaveOptions)
    {
        // should be on node page already
        await this.featureNodePage.featureNodeURLCheck();

        // open moderation sidebar
        await this.moderationSideBar.openModerationSideBar();
        // click edit content
        await this.moderationSideBar.clickEditContentButton();

        // complete feature form using edit isolated test data 
        await this.featureEditPage.editFeatureForm({
            featureTitle: this.testData.Feature.titleEdited,
            revisionLogMessage: this.testData.Feature.revisionlogEdited,
            linkURL: this.testData.Feature.linkURLEdited,
            teaser: this.testData.Feature.teaserEdited,
        });

        this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Feature.titleEdited;

        // Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview feature method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.featureNodePage.verifyEditedFeature({
                preview: true,
            });
            await this.previewPage.clickBackToContentEdittingButton();
            await this.featureEditPage.returnFromPreviewFeaturePageURLCheck();
        }

        // Save and verify
        await this.createPage.clickSaveButton();
        await this.featureNodePage.featureNodeURLCheck();
        await this.featureNodePage.verifyEditedFeature({
            preview: false,
        });
    }

    // delete Feature method
    async deleteFeature(options: DeleteOptions)
    {
        // should be on node page already
        await this.featureNodePage.featureNodeURLCheck();
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
            await this.featureNodePage.featureNodeURLCheck();
        }
    }

    async AddFeatureToHomePage(edited: boolean)
    {
        await this.page.getByRole('link', { name: 'Content', exact: true }).hover();
        await this.page.getByRole('link', { name: 'Featured Content Campaigns' }).click();


        await this.page.locator('#edit-field-featured-content-5-target-id').clear();

        const targetTitle = edited ? this.testData.Feature.titleEdited : this.testSetUpData.contentTitleforTest.contentTitle || this.testData.Feature.title;

        await this.inputFeaturedContentTarget(targetTitle);

        const saveButton = this.page.getByRole('button', { name: 'Save', exact: true });
        await expect(saveButton).toBeVisible();
        await saveButton.click();
        await expect(this.page.locator('.messages--status')).toBeVisible();

        //When This saves will save as a draft - Does NOT matter of moderation on Feature as this is the only way it can be visible on Home Page
        this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.draft;
    }

    async RemoveFeatureFromCampaigns(edited: boolean)
    {
        await this.page.getByRole('link', { name: 'Content', exact: true }).hover();
        await this.page.getByRole('link', { name: 'Featured Content Campaigns' }).click();

        const targetTitle = edited ? this.testData.Feature.titleEdited : this.testSetUpData.contentTitleforTest.contentTitle || this.testData.Feature.title;
        if (!targetTitle.trim())
        {
            throw new Error('Cannot remove a feature without a title');
        }

        const targetValue = new RegExp(`^${targetTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?: \\(\\d+\\))?$`);
        const fields = this.page.locator('input[id^="edit-field-featured-content-"][id$="-target-id"]');
        const matchingFields = [];

        await expect(fields.first()).toBeVisible();
        for (const field of await fields.all())
        {
            if (targetValue.test(await field.inputValue()))
            {
                matchingFields.push(field);
            }
        }

        if (matchingFields.length === 0)
        {
            throw new Error(`Feature "${targetTitle}" was not found in Featured Content Campaigns`);
        }

        for (const field of matchingFields)
        {
            await field.clear();
        }

        const saveButton = this.page.getByRole('button', { name: 'Save', exact: true });
        await expect(saveButton).toBeVisible();
        await saveButton.click();
        await expect(this.page.locator('.messages--status')).toBeVisible();
    }

    async inputFeaturedContentTarget(targetTitle: string)
    {
        await this.page.locator('#edit-field-featured-content-5-target-id').pressSequentially(targetTitle);

        const suggestion = this.page.locator('li.ui-menu-item').filter({ hasText: targetTitle }).first();
        const isPublished = this.testSetUpData.moderationStateForTest.moderationState ===
            this.testSetUpData.validModerationStates.published;

        if (isPublished)
        {
            await expect(suggestion).toBeVisible();
            await suggestion.click();

            const sourceHandle = this.page.locator(
                `//tr[contains(@class,'draggable')][.//input[@id='edit-field-featured-content-5-target-id']]//a[@title='Change order']`
            ).first();
            const topHandle = this.page.locator(
                `(//tr[contains(@class,'draggable')])[1]//a[@title='Change order']`
            ).first();

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

            // Title is stored in the input's value (e.g. "Title (2486)"), not as row text
            const firstRowInput = this.page.locator(
                `(//tr[contains(@class,'draggable')])[1]//input[contains(@id,'edit-field-featured-content-')]`
            );
            await expect(firstRowInput).toHaveValue(new RegExp(targetTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
        }
        else
        {
            await expect(suggestion).toBeHidden();
        }
    }




}
