import { Page, expect } from '@playwright/test';
import { TestSetUpData, TestData } from '../../test-data/TestDataObject';
import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';
import { RevisionPage } from '@poms/base-pages/RevisionPage';
import { ApplicationComparePage } from '@poms/content-pages/Application/ApplicationComparePage';
import { ArticleComparePage } from '@poms/content-pages/Article/ArticleComparePage';
import { ConsultationComparePage } from '@poms/content-pages/Consultation/ConsultationComparePage';
import { ContactComparePage } from '@poms/content-pages/Contact/ContactComparePage';
import { GalleryComparePage } from '@poms/content-pages/Gallery/GalleryComparePage';
import { NewsComparePage } from '@poms/content-pages/News/NewsComparePage';
import { PublicationComparePage } from '@poms/content-pages/Publication/PublicationComparePage';
import { ProfileComparePage } from '@poms/content-pages/Profile/ProfileComparePage';
import { DeleteRevisionsPage } from '@poms/base-pages/DeleteRevisionsPage';
import { RevertRevisionsPage } from '@poms/base-pages/RevertRevisionsPage';
import { VerificationHelper } from './VerificationHelper';
import { LinkComparePage } from '@poms/content-pages/Link/LinkComparePage';

export interface DeleteRevisionsOptions
{
    delete: boolean;
    cancel: boolean;
};

export interface RevertRevisionsOptions
{
    revert: boolean;
    cancel: boolean;
};

export class RevisionHelper
{

    // pages
    readonly moderationSideBar: ModerationSideBar;
    readonly verificationHelper: VerificationHelper;
    readonly revisionPage: RevisionPage;
    readonly applicationComparePage: ApplicationComparePage;
    readonly articleComparePage: ArticleComparePage;
    readonly consultationComparePage: ConsultationComparePage;
    readonly contactComparePage: ContactComparePage;
    readonly galleryComparePage: GalleryComparePage;
    readonly linkComparePage: LinkComparePage;
    readonly newsComparePage: NewsComparePage;
    readonly publicationComparePage: PublicationComparePage;
    readonly profileComparePage: ProfileComparePage;
    readonly deleteRevisionsPage: DeleteRevisionsPage;
    readonly revertRevisionsPage: RevertRevisionsPage;

    constructor(
        private page: Page,
        // isolated instances of test data via constructor
        private testSetUpData: typeof TestSetUpData,
        private testdata: typeof TestData
    )
    {
        // imported pages
        this.moderationSideBar = new ModerationSideBar(page, this.testSetUpData, this.testdata);
        this.verificationHelper = new VerificationHelper(page, this.testSetUpData, this.testdata);
        this.revisionPage = new RevisionPage(page);
        this.applicationComparePage = new ApplicationComparePage(page, this.testSetUpData, this.testdata);
        this.articleComparePage = new ArticleComparePage(page, this.testSetUpData, this.testdata);
        this.consultationComparePage = new ConsultationComparePage(page, this.testSetUpData, this.testdata);
        this.contactComparePage = new ContactComparePage(page, this.testSetUpData, this.testdata);
        this.galleryComparePage = new GalleryComparePage(page, this.testSetUpData, this.testdata);
        this.linkComparePage = new LinkComparePage(page, this.testSetUpData, this.testdata);
        this.newsComparePage = new NewsComparePage(page, this.testSetUpData, this.testdata);
        this.publicationComparePage = new PublicationComparePage(page, this.testSetUpData, this.testdata);
        this.profileComparePage = new ProfileComparePage(page, this.testSetUpData, this.testdata);
        this.deleteRevisionsPage = new DeleteRevisionsPage(page);
        this.revertRevisionsPage = new RevertRevisionsPage(page);
    }


    // select Compare Revision from Revisons 
    async compareRevisions()
    {
        await this.moderationSideBar.openModerationSideBar();
        await this.moderationSideBar.clickShowRevisionsButton();
        await this.revisionPage.revisionPageURLCheck();

        await this.revisionPage.clickCompareRevisionsButton();

        // switch to set compare page verification 
        switch (this.testSetUpData.contentTypeforTest.contentType)
        {
            case this.testSetUpData.validContentTypeList.application: {
                await this.applicationComparePage.verifyCompareApplication();
                break;
            }
            case this.testSetUpData.validContentTypeList.article: {
                await this.articleComparePage.verifyCompareArticle();
                break;
            }
            case this.testSetUpData.validContentTypeList.consultation: {
                await this.consultationComparePage.verifyCompareConsultation();
                break;
            }
            case this.testSetUpData.validContentTypeList.contact: {
                await this.contactComparePage.verifyCompareContact();
                break;
            }
            case this.testSetUpData.validContentTypeList.gallery: {
                await this.galleryComparePage.verifyCompareGallery();
                break;
            }
            case this.testSetUpData.validContentTypeList.link: {
                await this.linkComparePage.verifyCompareLink();
                break;
            }
            case this.testSetUpData.validContentTypeList.news: {
                await this.newsComparePage.verifyCompareNews();
                break;
            }
            case this.testSetUpData.validContentTypeList.publication: {
                await this.publicationComparePage.verifyComparePublication();
                break;
            }
            case this.testSetUpData.validContentTypeList.profile: {
                await this.profileComparePage.verifyCompareProfile();
                break;
            }
        }
    }

    async verifyThreeRevisionsDisplayed()
    {
        await this.moderationSideBar.openModerationSideBar();
        await this.moderationSideBar.clickShowRevisionsButton();
        await this.revisionPage.revisionPageURLCheck();

        await expect(this.page.locator('table tbody tr')).toHaveCount(3);
    }

    // select Delete Revision from Revisons 
    async deleteRevisions(option: DeleteRevisionsOptions)
    {
        await this.moderationSideBar.openModerationSideBar();
        await this.moderationSideBar.clickShowRevisionsButton();
        await this.revisionPage.revisionPageURLCheck();
        // clicking Delete Button - DO NOT DELETE
        await this.revisionPage.clickDeleteRevisionsButton();
        // deleting Revision
        await this.deleteRevisionsPage.deleteRevisionsPageURLCheck();

        if (option.delete === true)
        {
            await this.deleteRevisionsPage.clickDelete();
            await this.deleteRevisionsPage.deleteRevisionCofirmationCheck();
            //await this.revisionPage.revisionPageURLCheck();

            await this.verificationHelper.verifyChosenContent({
                edited: true,
            });

            // Navigate back to Revisions page to verify deleted revision is no longer visible
            await this.moderationSideBar.openModerationSideBar();
            await this.moderationSideBar.clickShowRevisionsButton();
            await this.revisionPage.revisionPageURLCheck();
            // verify new content has is stil visible 
            await expect(this.page.locator('//p[text()="This is an edited automated revision log message (Needs Review)"]')).toBeVisible();
            // verify Initial content has been deleted - no longer visible in Revisions page  
            await expect(this.page.locator('//p[text()="This is an automated revision log message (Draft)"]')).toBeHidden();
            await this.revisionPage.clickViewButton();
        }

        if (option.cancel === true)
        {
            await this.deleteRevisionsPage.clickCancel();
            // verify new content has is stil visible 
            await expect(this.page.locator('//p[text()="This is an edited automated revision log message (Needs Review)"]')).toBeVisible();
            // verify Initial content has been deleted - no longer visible in Revisions page  
            await expect(this.page.locator('//p[text()="This is an automated revision log message (Draft)"]')).toBeVisible();
            await this.revisionPage.revisionPageURLCheck();
            await this.revisionPage.clickViewButton();

            await this.verificationHelper.verifyChosenContent({
                edited: true,
            });
        }
    }

    // select Revert Revision from Revisons 
    async revertRevisions(option: RevertRevisionsOptions)
    {
        await this.moderationSideBar.openModerationSideBar();
        await this.moderationSideBar.clickShowRevisionsButton();
        await this.revisionPage.revisionPageURLCheck();
        // clicking Revert Button - DO NOT DELETE
        await this.revisionPage.clickRevertRevisionsButton();
        // Reverting Revision URL Checl
        await this.revertRevisionsPage.revertRevisionsPageURLCheck();

        if (option.revert === true)
        {
            await this.revertRevisionsPage.clickRevert();
            await this.revertRevisionsPage.revertRevisionCofirmationCheck();
            await this.revisionPage.revisionPageURLCheck();

            // verify new content has is stil visible 
            await expect(this.page.locator('//p[text()="This is an edited automated revision log message (Needs Review)"]')).toBeVisible();
            // verify Initial content is still visible 
            await expect(this.page.locator('//p[text()="This is an automated revision log message (Draft)"]')).toBeVisible();
            // Verify new reivision is visible when reverting 
            await expect(this.page.locator('//p[contains(text(),"Copy of revision")]')).toBeVisible();
            await this.revisionPage.clickViewButton();

            // switch to assign correct reverted title to test setup data content title for test
            switch (this.testSetUpData.contentTypeforTest.contentType)
            {
                case this.testSetUpData.validContentTypeList.application: {
                    // reverting content tutle for test back to original revisions title
                    this.testSetUpData.contentTitleforTest.contentTitle = this.testdata.Application.title;
                }
                    break;
                case this.testSetUpData.validContentTypeList.article: {
                    // reverting content tutle for test back to original revisions title
                    this.testSetUpData.contentTitleforTest.contentTitle = this.testdata.Article.title;
                }
                    break;
                case this.testSetUpData.validContentTypeList.consultation: {
                    // reverting content tutle for test back to original revisions title
                    this.testSetUpData.contentTitleforTest.contentTitle = this.testdata.Consultation.title;
                }
                    break;
                case this.testSetUpData.validContentTypeList.contact: {
                    // reverting content tutle for test back to original revisions title
                    this.testSetUpData.contentTitleforTest.contentTitle = this.testdata.Contact.title;
                }
                    break;
                case this.testSetUpData.validContentTypeList.gallery: {
                    // reverting content tutle for test back to original revisions title
                    this.testSetUpData.contentTitleforTest.contentTitle = this.testdata.Gallery.title;
                }
                    break;
                case this.testSetUpData.validContentTypeList.link: {
                    // reverting content tutle for test back to original revisions title
                    this.testSetUpData.contentTitleforTest.contentTitle = this.testdata.Link.title;
                }
                    break;
                case this.testSetUpData.validContentTypeList.news: {
                    // reverting content tutle for test back to original revisions title
                    this.testSetUpData.contentTitleforTest.contentTitle = this.testdata.News.title;
                }
                    break;
                case this.testSetUpData.validContentTypeList.publication: {
                    // reverting content tutle for test back to original revisions title
                    this.testSetUpData.contentTitleforTest.contentTitle = this.testdata.Publication.title;
                }
                    break;
                case this.testSetUpData.validContentTypeList.profile: {
                    this.testSetUpData.contentTitleforTest.contentTitle = this.testdata.Profile.title;
                }
                    break;
            }

            await this.verificationHelper.verifyChosenContent({
                edited: false,
            });
        }

        if (option.cancel === true)
        {
            await this.revertRevisionsPage.clickCancel();
            // verify new content has is stil visible 
            await expect(this.page.locator('//p[text()="This is an edited automated revision log message (Needs Review)"]')).toBeVisible();
            // verify Initial content has been deleted - no longer visible in Revisions page  
            await expect(this.page.locator('//p[text()="This is an automated revision log message (Draft)"]')).toBeVisible();
            // Verify new reivision is not visible as reverting was cancelled 
            await expect(this.page.locator('//p[contains(text(),"Copy of revision")]')).toBeHidden();
            await this.revisionPage.revisionPageURLCheck();
            await this.revisionPage.clickViewButton();

            await this.verificationHelper.verifyChosenContent({
                edited: true,
            });
        }
    }


}