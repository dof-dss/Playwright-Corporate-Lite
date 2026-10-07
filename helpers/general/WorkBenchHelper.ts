import { Page, expect } from '@playwright/test';
import { TestSetUpData, TestData } from '../../test-data/TestDataObject';
import { ContentPage } from '@poms/base-pages/ContentPage';
import { BasePage } from '@poms/base-pages/BasePage';
import { ApplicationNodePage } from '@poms/content-pages/Application/ApplicationNodePage';
import { VerificationHelper } from './VerificationHelper';


export interface ViewState
{
    draft: boolean;
    needsReview: boolean;
    archived: boolean;
};


export class WorkBenchHelper
{
    private contentPage: ContentPage;
    private basePage: BasePage;
    private applicationNodePage: ApplicationNodePage;
    private verificationHelper: VerificationHelper;


    constructor(
        private page: Page,
        // isolated instances of test data 
        private testSetUpData: typeof TestSetUpData,
        private testData: typeof TestData
    )
    {
        // imported pages
        this.contentPage = new ContentPage(page, this.testSetUpData);
        this.basePage = new BasePage(page, testSetUpData);
        this.applicationNodePage = new ApplicationNodePage(page, testSetUpData, testData);
        this.verificationHelper = new VerificationHelper(page, this.testSetUpData, this.testData);

    }

    // Supervisor WorkBench Helper
    async supervisorWorkBench(options: ViewState)
    {
        await this.basePage.clickContentLink();
        await this.contentPage.contentPageURLCheck();

        if (options.draft)
        {
            // verifying Content is not in Needs Review view
            await this.contentPage.clickNeedsReviewButton();
            await this.contentPage.contentPageNeedsReviewURLCheck();
            await this.contentPage.enterContentNameToReturnTo(this.testSetUpData.contentTitleforTest.contentTitle);
            await this.contentPage.clickApplyButton();
            await this.contentPage.confirmContentDoesNotExist(this.testSetUpData.contentTitleforTest.contentTitle);

            // verifying Content is not in Archived view
            await this.contentPage.clickArchivedButton();
            await this.contentPage.contentPageArchivedURLCheck();
            await this.contentPage.enterContentNameToReturnTo(this.testSetUpData.contentTitleforTest.contentTitle);
            await this.contentPage.clickApplyButton();
            await this.contentPage.confirmContentDoesNotExist(this.testSetUpData.contentTitleforTest.contentTitle);

            // verifying Content is NOT in My Drafts view when Moderation State dropdown is set to Needs Review
            await this.contentPage.clickMyDraftsButton();
            await this.contentPage.contentPageMyDraftsURLCheck();
            await this.contentPage.enterContentNameToReturnTo(this.testSetUpData.contentTitleforTest.contentTitle);
            await this.contentPage.chooseModerationStateDropdownNeedsReview();
            await this.contentPage.clickApplyButton();
            await this.contentPage.confirmContentDoesNotExist(this.testSetUpData.contentTitleforTest.contentTitle);

            // verifying Content is in My Drafts view when Moderation State dropdown is set to Draft
            await this.contentPage.chooseModerationStateDropdownDraft();
            await this.contentPage.clickApplyButton();
            await this.contentPage.clickTargetContentLink(this.testSetUpData.contentTitleforTest.contentTitle);
            await this.verificationHelper.verifyChosenContent({
                edited: false,
            });
            // verifying Content is NOT in All Drafts view when Moderation State dropdown is set to Needs Review
            await this.basePage.clickContentLink();
            await this.contentPage.contentPageURLCheck();
            await this.contentPage.clickAllDraftButton();
            await this.contentPage.contentPageAllDraftsURLCheck();
            await this.contentPage.enterContentNameToReturnTo(this.testSetUpData.contentTitleforTest.contentTitle);
            await this.contentPage.chooseModerationStateDropdownNeedsReview();
            await this.contentPage.clickApplyButton();
            await this.contentPage.confirmContentDoesNotExist(this.testSetUpData.contentTitleforTest.contentTitle);

            // verifying Content is in All Drafts view when Moderation State dropdown is set to Draft
            await this.contentPage.chooseModerationStateDropdownDraft();
            await this.contentPage.clickApplyButton();
            await this.contentPage.clickTargetContentLink(this.testSetUpData.contentTitleforTest.contentTitle);
            await this.verificationHelper.verifyChosenContent({
                edited: false,
            });
        }

        if (options.needsReview)
        {
            // verifying Content is NOT in Archived view
            await this.contentPage.clickArchivedButton();
            await this.contentPage.contentPageArchivedURLCheck();
            await this.contentPage.enterContentNameToReturnTo(this.testSetUpData.contentTitleforTest.contentTitle);
            await this.contentPage.clickApplyButton();
            await this.contentPage.confirmContentDoesNotExist(this.testSetUpData.contentTitleforTest.contentTitle);

            // verifying Content is NOT in My Drafts view when Moderation State dropdown is set to Draft
            await this.contentPage.clickMyDraftsButton();
            await this.contentPage.contentPageMyDraftsURLCheck();
            await this.contentPage.enterContentNameToReturnTo(this.testSetUpData.contentTitleforTest.contentTitle);
            await this.contentPage.chooseModerationStateDropdownDraft();
            await this.contentPage.clickApplyButton();
            await this.contentPage.confirmContentDoesNotExist(this.testSetUpData.contentTitleforTest.contentTitle);

            // verifying Content is in My Drafts view when Moderation State dropdown is set to Needs Review
            await this.contentPage.chooseModerationStateDropdownNeedsReview();
            await this.contentPage.clickApplyButton();
            await this.contentPage.clickTargetContentLink(this.testSetUpData.contentTitleforTest.contentTitle);
            await this.verificationHelper.verifyChosenContent({
                edited: false,
            });
            // verifying Content is NOT in All Drafts view when Moderation State dropdown is set to Draft
            await this.basePage.clickContentLink();
            await this.contentPage.contentPageURLCheck();
            await this.contentPage.clickAllDraftButton();
            await this.contentPage.contentPageAllDraftsURLCheck();
            await this.contentPage.enterContentNameToReturnTo(this.testSetUpData.contentTitleforTest.contentTitle);
            await this.contentPage.chooseModerationStateDropdownDraft();
            await this.contentPage.clickApplyButton();
            await this.contentPage.confirmContentDoesNotExist(this.testSetUpData.contentTitleforTest.contentTitle);

            // verifying Content is in All Drafts view when Moderation State dropdown is set to Needs Review
            await this.contentPage.chooseModerationStateDropdownNeedsReview();
            await this.contentPage.clickApplyButton();
            await this.contentPage.clickTargetContentLink(this.testSetUpData.contentTitleforTest.contentTitle);
            await this.verificationHelper.verifyChosenContent({
                edited: false,
            });
            // verifying Content is Displayed in Needs Review view
            await this.basePage.clickContentLink();
            await this.contentPage.contentPageURLCheck();
            await this.contentPage.clickNeedsReviewButton();
            await this.contentPage.contentPageNeedsReviewURLCheck();
            await this.contentPage.enterContentNameToReturnTo(this.testSetUpData.contentTitleforTest.contentTitle);
            await this.contentPage.clickApplyButton();
            await this.contentPage.clickTargetContentLink(this.testSetUpData.contentTitleforTest.contentTitle);
            await this.verificationHelper.verifyChosenContent({
                edited: false,
            });
        }

        if (options.archived)
        {
            // verifying Content is NOT in My Draft view
            await this.contentPage.clickMyDraftsButton();
            await this.contentPage.contentPageMyDraftsURLCheck();
            await this.contentPage.enterContentNameToReturnTo(this.testSetUpData.contentTitleforTest.contentTitle);
            await this.contentPage.clickApplyButton();
            await this.contentPage.confirmContentDoesNotExist(this.testSetUpData.contentTitleforTest.contentTitle);

            // verifying Content is NOT in All Draft view
            await this.contentPage.clickAllDraftButton();
            await this.contentPage.contentPageAllDraftsURLCheck();
            await this.contentPage.enterContentNameToReturnTo(this.testSetUpData.contentTitleforTest.contentTitle);
            await this.contentPage.chooseModerationStateDropdownDraft();
            await this.contentPage.clickApplyButton();
            await this.contentPage.confirmContentDoesNotExist(this.testSetUpData.contentTitleforTest.contentTitle);

            // verifying Content is NOT in Needs Review view
            await this.contentPage.clickNeedsReviewButton();
            await this.contentPage.contentPageNeedsReviewURLCheck();
            await this.contentPage.enterContentNameToReturnTo(this.testSetUpData.contentTitleforTest.contentTitle);
            await this.contentPage.clickApplyButton();
            await this.contentPage.confirmContentDoesNotExist(this.testSetUpData.contentTitleforTest.contentTitle);

            // verifying Content is in Archived view
            await this.contentPage.clickArchivedButton();
            await this.contentPage.contentPageArchivedURLCheck();
            await this.contentPage.enterContentNameToReturnTo(this.testSetUpData.contentTitleforTest.contentTitle);
            await this.contentPage.clickApplyButton();
            await this.contentPage.clickTargetContentLink(this.testSetUpData.contentTitleforTest.contentTitle);
            await this.verificationHelper.verifyChosenContent({
                edited: false,
            });
        }
    }

    // Author WorkBench Helper
    async authorWorkBench(options: ViewState)
    {
        await this.basePage.clickContentLink();
        await this.contentPage.contentPageURLCheck();

        await this.contentPage.checkNeedsReviewNotVisible();
        await this.contentPage.checkNeedsAuditNotVisible();

        if (options.draft)
        {
            // verifying Content is not in Archived view
            await this.contentPage.clickArchivedButton();
            await this.contentPage.contentPageArchivedURLCheck();
            await this.contentPage.enterContentNameToReturnTo(this.testSetUpData.contentTitleforTest.contentTitle);
            await this.contentPage.clickApplyButton();
            await this.contentPage.confirmContentDoesNotExist(this.testSetUpData.contentTitleforTest.contentTitle);

            // verifying Content is NOT in My Drafts view when Moderation State dropdown is set to Needs Review
            await this.contentPage.clickMyDraftsButton();
            await this.contentPage.contentPageMyDraftsURLCheck();
            await this.contentPage.enterContentNameToReturnTo(this.testSetUpData.contentTitleforTest.contentTitle);
            await this.contentPage.chooseModerationStateDropdownNeedsReview();
            await this.contentPage.clickApplyButton();
            await this.contentPage.confirmContentDoesNotExist(this.testSetUpData.contentTitleforTest.contentTitle);

            // verifying Content is in My Drafts view when Moderation State dropdown is set to Draft
            await this.contentPage.chooseModerationStateDropdownDraft();
            await this.contentPage.clickApplyButton();
            await this.contentPage.clickTargetContentLink(this.testSetUpData.contentTitleforTest.contentTitle);
            await this.verificationHelper.verifyChosenContent({
                edited: false,
            });
            // verifying Content is NOT in All Drafts view when Moderation State dropdown is set to Needs Review
            await this.basePage.clickContentLink();
            await this.contentPage.contentPageURLCheck();
            await this.contentPage.clickAllDraftButton();
            await this.contentPage.contentPageAllDraftsURLCheck();
            await this.contentPage.enterContentNameToReturnTo(this.testSetUpData.contentTitleforTest.contentTitle);
            await this.contentPage.chooseModerationStateDropdownNeedsReview();
            await this.contentPage.clickApplyButton();
            await this.contentPage.confirmContentDoesNotExist(this.testSetUpData.contentTitleforTest.contentTitle);

            // verifying Content is in All Drafts view when Moderation State dropdown is set to Draft
            await this.contentPage.chooseModerationStateDropdownDraft();
            await this.contentPage.clickApplyButton();
            await this.contentPage.clickTargetContentLink(this.testSetUpData.contentTitleforTest.contentTitle);
            await this.verificationHelper.verifyChosenContent({
                edited: false,
            });
        }

        if (options.needsReview)
        {
            // verifying Content is not in Archived view
            await this.contentPage.clickArchivedButton();
            await this.contentPage.contentPageArchivedURLCheck();
            await this.contentPage.enterContentNameToReturnTo(this.testSetUpData.contentTitleforTest.contentTitle);
            await this.contentPage.clickApplyButton();
            await this.contentPage.confirmContentDoesNotExist(this.testSetUpData.contentTitleforTest.contentTitle);

            // verifying Content is NOT in My Drafts view when Moderation State dropdown is set to Draft
            await this.contentPage.clickMyDraftsButton();
            await this.contentPage.contentPageMyDraftsURLCheck();
            await this.contentPage.enterContentNameToReturnTo(this.testSetUpData.contentTitleforTest.contentTitle);
            await this.contentPage.chooseModerationStateDropdownDraft();
            await this.contentPage.clickApplyButton();
            await this.contentPage.confirmContentDoesNotExist(this.testSetUpData.contentTitleforTest.contentTitle);

            // verifying Content is in My Drafts view when Moderation State dropdown is set to Needs Review
            await this.contentPage.chooseModerationStateDropdownNeedsReview();
            await this.contentPage.clickApplyButton();
            await this.contentPage.clickTargetContentLink(this.testSetUpData.contentTitleforTest.contentTitle);
            await this.verificationHelper.verifyChosenContent({
                edited: false,
            });
            // verifying Content is NOT in All Drafts view when Moderation State dropdown is set to Draft
            await this.basePage.clickContentLink();
            await this.contentPage.contentPageURLCheck();
            await this.contentPage.clickAllDraftButton();
            await this.contentPage.contentPageAllDraftsURLCheck();
            await this.contentPage.enterContentNameToReturnTo(this.testSetUpData.contentTitleforTest.contentTitle);
            await this.contentPage.chooseModerationStateDropdownDraft();
            await this.contentPage.clickApplyButton();
            await this.contentPage.confirmContentDoesNotExist(this.testSetUpData.contentTitleforTest.contentTitle);

            // verifying Content is in All Drafts view when Moderation State dropdown is set to Needs Review
            await this.contentPage.chooseModerationStateDropdownNeedsReview();
            await this.contentPage.clickApplyButton();
            await this.contentPage.clickTargetContentLink(this.testSetUpData.contentTitleforTest.contentTitle);
            await this.verificationHelper.verifyChosenContent({
                edited: false,
            });
        }

        if (options.archived)
        {
            // verifying Content is NOT in My Draft view
            await this.contentPage.clickMyDraftsButton();
            await this.contentPage.contentPageMyDraftsURLCheck();
            await this.contentPage.enterContentNameToReturnTo(this.testSetUpData.contentTitleforTest.contentTitle);
            await this.contentPage.clickApplyButton();
            await this.contentPage.confirmContentDoesNotExist(this.testSetUpData.contentTitleforTest.contentTitle);

            // verifying Content is NOT in All Draft view
            await this.contentPage.clickAllDraftButton();
            await this.contentPage.contentPageAllDraftsURLCheck();
            await this.contentPage.enterContentNameToReturnTo(this.testSetUpData.contentTitleforTest.contentTitle);
            await this.contentPage.chooseModerationStateDropdownDraft();
            await this.contentPage.clickApplyButton();
            await this.contentPage.confirmContentDoesNotExist(this.testSetUpData.contentTitleforTest.contentTitle);

            // verifying Content is in Archived view
            await this.contentPage.clickArchivedButton();
            await this.contentPage.contentPageArchivedURLCheck();
            await this.contentPage.enterContentNameToReturnTo(this.testSetUpData.contentTitleforTest.contentTitle);
            await this.contentPage.clickApplyButton();
            await this.contentPage.clickTargetContentLink(this.testSetUpData.contentTitleforTest.contentTitle);
            await this.verificationHelper.verifyChosenContent({
                edited: false,
            });
        }
    }

    async statsAuthorWorkBench(options: ViewState)
    {
        await this.authorWorkBench(options);
    }

    async statssupervisorWorkBench(options: ViewState)
    {
        await this.supervisorWorkBench(options);
    }
}
