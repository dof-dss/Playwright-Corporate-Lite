import { Page } from '@playwright/test';
import { TestSetUpData, TestData } from '../../test-data/TestDataObject';
import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';
import { NavigateToCreatedContentHelper } from '@helpers/general/NavigateToCreatedContentHelper';

export interface AuthorModerationStates
{
    Draft?: boolean;
    NeedsReview: boolean;
};

export type StatsAuthorModerationStates = AuthorModerationStates;

export interface SupervisorModerationStates
{
    Draft?: boolean;
    NeedsReview: boolean;
    Published: boolean;
    Archive: boolean;
};
export interface StatsSupervisorModerationStates
{
    QuickPublish: boolean;
    Draft?: boolean;
    NeedsReview: boolean;
    Published: boolean;
    Archive: boolean;
};

type ModerationState = 'Draft' | 'Needs Review' | 'Published' | 'Archived';

export class ContentModerationHelper
{
    // pages
    private readonly moderationSideBar: ModerationSideBar;
    private readonly navigateToCreatedContentHelper: NavigateToCreatedContentHelper;

    constructor(
        private page: Page,
        // isolated instances of test data via constructor
        private testSetUpData: typeof TestSetUpData,
        private testdata: typeof TestData
    ) 
    {
        // imported pages
        this.moderationSideBar = new ModerationSideBar(page, this.testSetUpData, this.testdata);
        this.navigateToCreatedContentHelper = new NavigateToCreatedContentHelper(page, this.testSetUpData, this.testdata);
    }

    private async openAndGetCurrentState(): Promise<ModerationState>
    {
        await this.moderationSideBar.nodeURLCheck(this.testSetUpData.contentTypeforTest.contentType);
        await this.moderationSideBar.openModerationSideBar();
        return await this.moderationSideBar.getCurrentState() as ModerationState;
    }

    // ----------------- Main user moderation flows -----------------

    async authorModerateContent(wantedState: AuthorModerationStates)
    {
        const currentState = await this.openAndGetCurrentState();

        if (currentState === 'Draft')
        {
            // Verify only the expected buttons are visible 
            await this.moderationSideBar.editContentIsVisible();
            await this.moderationSideBar.submitForReviewButtonIsVisible();
            await this.moderationSideBar.deleteButtonIsVisible();
            await this.moderationSideBar.revisionsIsVisible();
            await this.moderationSideBar.scheduledTransitionsIsVisible();
            await this.moderationSideBar.whatLinksHereIsVisible();

            await this.moderationSideBar.rejectButtonNotVisible();
            await this.moderationSideBar.publishButtonNotVisible();
            await this.moderationSideBar.archiveButtonNotVisible();
            await this.moderationSideBar.quickPublishButtonNotVisible();
            await this.moderationSideBar.restoreButtonNotVisible();
            await this.moderationSideBar.restoreToDraftButtonNotVisible();
            await this.moderationSideBar.outlineIsNotVisible();
        }

        if (currentState === 'Needs Review')
        {
            // Verify only the expected buttons are visible
            await this.moderationSideBar.editContentIsVisible();
            await this.moderationSideBar.rejectButtonIsVisible();
            await this.moderationSideBar.deleteButtonIsVisible();
            await this.moderationSideBar.revisionsIsVisible();
            await this.moderationSideBar.scheduledTransitionsIsVisible();
            await this.moderationSideBar.whatLinksHereIsVisible();

            await this.moderationSideBar.submitForReviewButtonNotVisible();
            await this.moderationSideBar.publishButtonNotVisible();
            await this.moderationSideBar.archiveButtonNotVisible();
            await this.moderationSideBar.quickPublishButtonNotVisible();
            await this.moderationSideBar.restoreButtonNotVisible();
            await this.moderationSideBar.restoreToDraftButtonNotVisible();
            await this.moderationSideBar.outlineIsNotVisible();
        }

        if (wantedState.Draft)
        {
            await this.moderationSideBar.clickRejectButton();
            this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.draft;
        }

        if (wantedState.NeedsReview)
        {
            await this.moderationSideBar.clickSubmitForReviewButton();
            this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.needsreview;
        }
    }

    async supervisorModerateContent(wantedState: SupervisorModerationStates)
    {
        const currentState = await this.openAndGetCurrentState();

        if (currentState === 'Draft')
        {
            await this.moderationSideBar.editContentIsVisible(); // ALWAYS VISIBLE
            await this.moderationSideBar.submitForReviewButtonIsVisible();
            //await this.moderationSideBar.archiveButtonIsVisible();
            await this.moderationSideBar.deleteButtonIsVisible();
            await this.moderationSideBar.revisionsIsVisible();
            //await this.moderationSideBar.outlineIsVisible();
            await this.moderationSideBar.scheduledTransitionsIsVisible();
            await this.moderationSideBar.whatLinksHereIsVisible();


            await this.moderationSideBar.rejectButtonNotVisible();
            await this.moderationSideBar.publishButtonNotVisible();
            await this.moderationSideBar.quickPublishButtonNotVisible();
            await this.moderationSideBar.restoreButtonNotVisible();
            await this.moderationSideBar.restoreToDraftButtonNotVisible();
        }

        if (currentState === 'Needs Review')
        {
            // Verify only the expected buttons are visible
            await this.moderationSideBar.editContentIsVisible();
            await this.moderationSideBar.rejectButtonIsVisible();
            await this.moderationSideBar.publishButtonIsVisible();
            //await this.moderationSideBar.archiveButtonIsVisible();
            await this.moderationSideBar.deleteButtonIsVisible();
            await this.moderationSideBar.revisionsIsVisible();
            //await this.moderationSideBar.outlineIsVisible();
            await this.moderationSideBar.scheduledTransitionsIsVisible();
            await this.moderationSideBar.whatLinksHereIsVisible();

            await this.moderationSideBar.submitForReviewButtonNotVisible();
            await this.moderationSideBar.quickPublishButtonNotVisible();
            await this.moderationSideBar.restoreButtonNotVisible();
            await this.moderationSideBar.restoreToDraftButtonNotVisible();
        }

        if (currentState === 'Published')
        {
            // Verify only the expected buttons are visible
            await this.moderationSideBar.editContentIsVisible(); // ALWAYS VISIBLE
            await this.moderationSideBar.archiveButtonIsVisible();
            await this.moderationSideBar.deleteButtonIsVisible();
            await this.moderationSideBar.revisionsIsVisible();
            //await this.moderationSideBar.outlineIsVisible();
            await this.moderationSideBar.scheduledTransitionsIsVisible();
            await this.moderationSideBar.whatLinksHereIsVisible();

            await this.moderationSideBar.submitForReviewButtonNotVisible();
            await this.moderationSideBar.rejectButtonNotVisible();
            await this.moderationSideBar.publishButtonNotVisible();
            await this.moderationSideBar.quickPublishButtonNotVisible();
            await this.moderationSideBar.restoreButtonNotVisible();
            await this.moderationSideBar.restoreToDraftButtonNotVisible();
        }

        if (currentState === 'Archived')
        {
            // Verify only the expected buttons are visible
            await this.moderationSideBar.editContentIsVisible(); // ALWAYS VISIBLE
            await this.moderationSideBar.restoreToDraftButtonIsVisible();
            await this.moderationSideBar.restoreButtonIsVisible();
            await this.moderationSideBar.deleteButtonIsVisible();
            await this.moderationSideBar.revisionsIsVisible();
            //await this.moderationSideBar.outlineIsVisible();
            await this.moderationSideBar.scheduledTransitionsIsVisible();
            await this.moderationSideBar.whatLinksHereIsVisible();

            await this.moderationSideBar.submitForReviewButtonNotVisible();
            await this.moderationSideBar.rejectButtonNotVisible();
            await this.moderationSideBar.publishButtonNotVisible();
            await this.moderationSideBar.archiveButtonNotVisible();
            await this.moderationSideBar.quickPublishButtonNotVisible();
        }


        if (wantedState.Draft)
        {
            if (currentState === 'Needs Review')
            {
                await this.moderationSideBar.clickRejectButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.draft;
            }

            if (currentState === 'Archived')
            {
                await this.moderationSideBar.clickRestoreToDraftButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.draft;
            }
        }

        if (wantedState.NeedsReview)
        {
            if (currentState === 'Draft')
            {
                await this.moderationSideBar.publishButtonNotVisible();
                await this.moderationSideBar.clickSubmitForReviewButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.needsreview;
            }

            if (currentState === 'Published')
            {
                await this.moderationSideBar.clickArchiveButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.archived;
                await this.moderationSideBar.openModerationSideBar();
                await this.moderationSideBar.clickRestoreToDraftButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.draft;
                await this.moderationSideBar.openModerationSideBar();
                await this.moderationSideBar.clickSubmitForReviewButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.needsreview;
            }

            if (currentState === 'Archived')
            {
                await this.moderationSideBar.clickRestoreToDraftButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.draft;
                await this.moderationSideBar.openModerationSideBar();
                await this.moderationSideBar.clickSubmitForReviewButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.needsreview;
            }


        }

        if (wantedState.Published)
        {
            if (currentState === 'Draft')
            {
                await this.moderationSideBar.publishButtonNotVisible();
                await this.moderationSideBar.clickSubmitForReviewButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.needsreview;
                await this.moderationSideBar.openModerationSideBar();
                await this.moderationSideBar.clickPublishButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.published;
            }

            if (currentState === 'Needs Review')
            {
                await this.moderationSideBar.clickPublishButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.published;
            }

            if (currentState === 'Archived')
            {
                await this.moderationSideBar.publishButtonNotVisible();
                await this.moderationSideBar.clickRestoreButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.published;
            }
        }

        if (wantedState.Archive)
        {
            if (currentState !== 'Archived')
            {
                await this.moderationSideBar.clickArchiveButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.archived;
            }
        }
    }

    async statsAuthorModerateContent(wantedState: StatsAuthorModerationStates)
    {
        await this.authorModerateContent(wantedState);
    }

    async statsSupervisorModerateContent(wantedState: StatsSupervisorModerationStates)
    {
        const currentState = await this.openAndGetCurrentState();

        if (currentState === 'Draft')
        {
            await this.moderationSideBar.editContentIsVisible(); // ALWAYS VISIBLE
            await this.moderationSideBar.submitForReviewButtonIsVisible();
            await this.moderationSideBar.quickPublishButtonIsVisible();
            await this.moderationSideBar.archiveButtonIsVisible();
            await this.moderationSideBar.deleteButtonIsVisible();
            await this.moderationSideBar.revisionsIsVisible();
            await this.moderationSideBar.outlineIsVisible();
            await this.moderationSideBar.scheduledTransitionsIsVisible();
            await this.moderationSideBar.whatLinksHereIsVisible();


            await this.moderationSideBar.rejectButtonNotVisible();
            await this.moderationSideBar.publishButtonNotVisible();
            await this.moderationSideBar.restoreButtonNotVisible();
            await this.moderationSideBar.restoreToDraftButtonNotVisible();
        }

        if (currentState === 'Needs Review')
        {
            // Verify only the expected buttons are visible
            await this.moderationSideBar.editContentIsVisible();
            await this.moderationSideBar.rejectButtonIsVisible();
            await this.moderationSideBar.publishButtonIsVisible();
            await this.moderationSideBar.archiveButtonIsVisible();
            await this.moderationSideBar.deleteButtonIsVisible();
            await this.moderationSideBar.revisionsIsVisible();
            await this.moderationSideBar.outlineIsVisible();
            await this.moderationSideBar.scheduledTransitionsIsVisible();
            await this.moderationSideBar.whatLinksHereIsVisible();

            await this.moderationSideBar.submitForReviewButtonNotVisible();
            await this.moderationSideBar.quickPublishButtonNotVisible();
            await this.moderationSideBar.restoreButtonNotVisible();
            await this.moderationSideBar.restoreToDraftButtonNotVisible();
        }

        if (currentState === 'Published')
        {
            // Verify only the expected buttons are visible
            await this.moderationSideBar.editContentIsVisible(); // ALWAYS VISIBLE
            await this.moderationSideBar.archiveButtonIsVisible();
            await this.moderationSideBar.deleteButtonIsVisible();
            await this.moderationSideBar.revisionsIsVisible();
            await this.moderationSideBar.outlineIsVisible();
            await this.moderationSideBar.scheduledTransitionsIsVisible();
            await this.moderationSideBar.whatLinksHereIsVisible();


            await this.moderationSideBar.submitForReviewButtonNotVisible();
            await this.moderationSideBar.rejectButtonNotVisible();
            await this.moderationSideBar.publishButtonNotVisible();
            await this.moderationSideBar.quickPublishButtonNotVisible();
            await this.moderationSideBar.restoreButtonNotVisible();
            await this.moderationSideBar.restoreToDraftButtonNotVisible();
        }

        if (currentState === 'Archived')
        {
            // Verify only the expected buttons are visible
            await this.moderationSideBar.editContentIsVisible(); // ALWAYS VISIBLE
            await this.moderationSideBar.restoreToDraftButtonIsVisible();
            await this.moderationSideBar.restoreButtonIsVisible();
            await this.moderationSideBar.deleteButtonIsVisible();
            await this.moderationSideBar.revisionsIsVisible();
            await this.moderationSideBar.outlineIsVisible();
            await this.moderationSideBar.scheduledTransitionsIsVisible();
            await this.moderationSideBar.whatLinksHereIsVisible();

            await this.moderationSideBar.submitForReviewButtonNotVisible();
            await this.moderationSideBar.rejectButtonNotVisible();
            await this.moderationSideBar.publishButtonNotVisible();
            await this.moderationSideBar.archiveButtonNotVisible();
            await this.moderationSideBar.quickPublishButtonNotVisible();
        }

        if (wantedState.QuickPublish)
        {
            if (currentState === 'Draft')
            {
                await this.moderationSideBar.clickQuickPublishButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.published;
            }

            if (currentState === 'Needs Review')
            {
                await this.moderationSideBar.clickPublishButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.published;
            }

            if (currentState === 'Archived')
            {
                await this.moderationSideBar.clickRestoreToDraftButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.draft;
                await this.moderationSideBar.openModerationSideBar();
                await this.moderationSideBar.clickQuickPublishButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.published;
            }
        }

        if (wantedState.Draft)
        {
            if (currentState === 'Needs Review')
            {
                await this.moderationSideBar.clickRejectButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.draft;
            }

            if (currentState === 'Archived')
            {
                await this.moderationSideBar.clickRestoreToDraftButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.draft;
            }
        }

        if (wantedState.NeedsReview)
        {
            if (currentState === 'Draft')
            {
                await this.moderationSideBar.clickSubmitForReviewButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.needsreview;
            }

            if (currentState === 'Published')
            {
                await this.moderationSideBar.clickArchiveButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.archived;
                await this.moderationSideBar.openModerationSideBar();
                await this.moderationSideBar.clickRestoreToDraftButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.draft;
                await this.moderationSideBar.openModerationSideBar();
                await this.moderationSideBar.clickSubmitForReviewButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.needsreview;
            }

            if (currentState === 'Archived')
            {
                await this.moderationSideBar.clickRestoreToDraftButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.draft;
                await this.moderationSideBar.openModerationSideBar();
                await this.moderationSideBar.clickSubmitForReviewButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.needsreview;
            }


        }

        if (wantedState.Published)
        {
            if (currentState === 'Draft')
            {
                await this.moderationSideBar.clickQuickPublishButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.published;
            }

            if (currentState === 'Needs Review')
            {
                await this.moderationSideBar.clickPublishButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.published;
            }

            if (currentState === 'Archived')
            {
                await this.moderationSideBar.publishButtonNotVisible();
                await this.moderationSideBar.clickRestoreButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.published;
            }
        }

        if (wantedState.Archive)
        {
            if (currentState !== 'Archived')
            {
                await this.moderationSideBar.clickArchiveButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.archived;
            }
        }
    }

    async homepageSupervisorModerateContent(wantedState: StatsSupervisorModerationStates)
    {
        await this.statsSupervisorModerateContent(wantedState);
    }
}