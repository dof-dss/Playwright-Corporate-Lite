import { Page, Locator, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestSetUpData } from '../../test-data/TestDataObject';

export class ContentPage
{
    // logging
    private readonly testSteps: TestSteps;

    // locators
    private readonly addContentButton: Locator;
    private readonly contentPageTitleSearchField: Locator;
    private readonly contentPageFilterButton: Locator;
    private readonly contentPageApplyButton: Locator;
    private readonly myDrafts: Locator;
    private readonly allDrafts: Locator;
    private readonly needsReview: Locator;
    private readonly needsAudit: Locator;
    private readonly archived: Locator;

    // constructor
    constructor(
        private readonly page: Page,
        private testSetUpData: typeof TestSetUpData
    )
    {
        // logging isolated instance
        this.testSteps = new TestSteps();

        this.addContentButton = page.getByRole('link', { name: 'Add content' });
        this.contentPageTitleSearchField = page.locator('#edit-title');
        this.contentPageFilterButton = page.locator('#edit-submit-content');
        this.contentPageApplyButton = page.getByRole('button', { name: 'Apply' });
        this.myDrafts = page.getByRole('link', { name: 'My Drafts', exact: true });
        this.allDrafts = page.getByRole('link', { name: 'All Drafts', exact: true });
        this.needsReview = page.getByRole('link', { name: 'Needs Review', exact: true });
        this.needsAudit = page.getByRole('link', { name: 'Needs Audit', exact: true });
        this.archived = page.getByRole('link', { name: 'Archived', exact: true });
    }

    // -------------- URL CHECKS --------------

    // url check using isolated test data for current site being tested
    async contentPageURLCheck()
    {
        await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/admin/content" to ensure user is on content page`);
        await expect(this.page).toHaveURL(`${this.testSetUpData.urlForTest.url}/admin/content`);
    }

    // url check for "My Draft"
    async contentPageMyDraftsURLCheck()
    {
        await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/admin/content/drafts" to ensure user is on Drafts View on Content Page`);
        await expect(this.page).toHaveURL(`${this.testSetUpData.urlForTest.url}/admin/content/drafts`);
    }

    // url check for "All Draft"
    async contentPageAllDraftsURLCheck()
    {
        await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/admin/content/all-drafts" to ensure user is on All Drafts View on Content Page`);
        await expect(this.page).toHaveURL(`${this.testSetUpData.urlForTest.url}/admin/content/all-drafts`);
    }

    // url check for "Needs Review"
    async contentPageNeedsReviewURLCheck()
    {
        await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/admin/content/needs-review" to ensure user is on Needs Review View on Content Page`);
        await expect(this.page).toHaveURL(`${this.testSetUpData.urlForTest.url}/admin/content/needs-review`);
    }

    // url check for "Archved"
    async contentPageArchivedURLCheck()
    {
        await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/admin/content/archived" to ensure user is on Archived View on Content Page`);
        await expect(this.page).toHaveURL(`${this.testSetUpData.urlForTest.url}/admin/content/archived`);
    }


    // -------------- ACTIONS --------------

    // fill content search field
    async enterContentNameToReturnTo(contentName: string)
    {
        await this.testSteps.LogInfo(`Entering "${contentName}" to Content Page Title search field`);
        await this.contentPageTitleSearchField.fill(contentName);
    }

    // click filter button to search for content 
    async clickFilterButton()
    {
        await this.testSteps.LogInfo('Clicking "Filter" button on Content Page');
        await this.contentPageFilterButton.click();
    }

    // click add content button 
    async clickAddContentButton()
    {
        await this.testSteps.LogInfo('Clicking "Add Content" button on Content Page');
        await this.addContentButton.click();
    }

    // click "My Drafts" button 
    async clickMyDraftsButton()
    {
        await this.testSteps.LogInfo('Clicking "My Drafts" button on Content Page');
        await this.myDrafts.click();
    }

    // click "My Drafts" button 
    async clickAllDraftButton()
    {
        await this.testSteps.LogInfo('Clicking "All Drafts" button on Content Page');
        await this.allDrafts.click();
    }

    // click "Needs Review" button 
    async clickNeedsReviewButton()
    {
        await this.testSteps.LogInfo('Clicking "Needs Review" button on Content Page');
        await this.needsReview.click();
    }

    // click "Archived" button 
    async clickArchivedButton()
    {
        await this.testSteps.LogInfo('Clicking "Archived" button on Content Page');
        await this.archived.click();
    }

    // click apply button to search for content 
    async clickApplyButton()
    {
        await this.testSteps.LogInfo('Clicking "Apply" button on Content Page');
        await this.contentPageApplyButton.click();
    }

    // click filter button to search for content 
    async clickTargetContentLink(contentTargetLink: string)
    {
        await this.testSteps.LogInfo(`Verifying "${contentTargetLink}" is visible on Content Page`);
        await expect(this.page.locator(`//a[normalize-space(.)="${contentTargetLink}"]`)).toBeEnabled;

        await this.testSteps.LogInfo(`Clicking "${contentTargetLink}" on Content Page`);
        await this.page.locator(`//a[normalize-space(.)="${contentTargetLink}"]`).click();
    }

    // choose Moderation State (Only appicable on My draft and All Drafts) Draft from dropdown
    async chooseModerationStateDropdownDraft()
    {
        await this.testSteps.LogInfo('Selecting "Draft" dropdown option on Content Page');
        await this.page.locator('#edit-moderation-state-1').selectOption('nics_editorial_workflow-draft');
    }

    // choose Moderation State (Only appicable on My draft and All Drafts) Needs Review from dropdown
    async chooseModerationStateDropdownNeedsReview()
    {
        await this.testSteps.LogInfo('Selecting "Needs Review" dropdown option on Content Page');
        await this.page.locator('#edit-moderation-state-1').selectOption('nics_editorial_workflow-needs_review');
    }

    // -------------- ASSERTS --------------

    async checkNeedsReviewNotVisible()
    {
        await this.testSteps.LogInfo('Ensure "Needs Review" View IS NOT viewable on Content Page');
        await expect(this.needsReview).toBeHidden();
    }

    async checkNeedsAuditNotVisible()
    {
        await this.testSteps.LogInfo('Ensure "Needs Audit" View IS NOT viewable on Content Page');
        await expect(this.needsAudit).toBeHidden();
    }

    async confirmContentDoesNotExist(contentTargetLink: string)
    {
        await this.testSteps.LogInfo(`I should NOT see "${contentTargetLink}" on Content Page`);
        await expect(this.page.locator(`//a[normalize-space(.)="${contentTargetLink}"]`)).toBeHidden();
    }

    async confirmSecurePubIsSecure(contentTargetLink: string)
    {
        await this.testSteps.LogInfo(`I should see "${contentTargetLink}" on Content Page as a non clickable link (secure publication)`);
        await expect(this.page.locator(`//tr/td[normalize-space(.)="${contentTargetLink}"]`)).toBeVisible();
        await expect(this.page.locator(`//a[normalize-space(.)="${contentTargetLink}"]`)).toBeHidden();
    }
}
