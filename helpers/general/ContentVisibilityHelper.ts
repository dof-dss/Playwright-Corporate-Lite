import { Page } from '@playwright/test';
import { AddContentPage } from '@poms/base-pages/AddContentPage';
import { BasePage } from '@poms/base-pages/BasePage';
import { ContentPage } from '@poms/base-pages/ContentPage';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestSetUpData, TestData } from '@tdata/TestDataObject';
import { MediaPage } from '@poms/content-pages/Media/MediaPage';
import { AddMediaItemPage } from '@poms/content-pages/Media/AddMediaItemPage';
import { MediaHelper } from '@helpers/general/MediaHelper';

export class ContentVisibilityHelper
{
    private readonly basePage: BasePage;
    private readonly contentPage: ContentPage;
    private readonly addContentPage: AddContentPage;
    private readonly testSteps: TestSteps;
    private readonly mediaPage: MediaPage;
    private readonly addMediaItemPage: AddMediaItemPage;
    private readonly mediahelper: MediaHelper;

    constructor(
        private readonly page: Page,
        // isolated instances of test data via constructor
        private readonly testSetUpData: typeof TestSetUpData
    )
    {
        this.basePage = new BasePage(page, testSetUpData);
        this.contentPage = new ContentPage(page, testSetUpData);
        this.addContentPage = new AddContentPage(page, testSetUpData);
        this.testSteps = new TestSteps();
        this.mediaPage = new MediaPage(page, testSetUpData);
        this.addMediaItemPage = new AddMediaItemPage(page, testSetUpData);
        this.mediahelper = new MediaHelper(page, testSetUpData, TestData);
    }

    // navigation method
    async navigateToContentTypes()
    {
        await this.basePage.clickContentLink();
        await this.contentPage.contentPageURLCheck();
        await this.contentPage.clickAddContentButton();
        await this.addContentPage.addContentPageURLCheck();
    }

    async ContentVisibility()
    {
        await this.navigateToContentTypes();

        await this.AlertContentVisibility();
        await this.ApplicationContentVisibility();
        await this.ArticleContentVisibility();
        await this.ChartContentVisibility();
        await this.ConsultationContentVisibility();
        await this.ContactContentVisibility();
        await this.FeatureContentVisibility();
        await this.GalleryContentVisibility();
        await this.LinkContentVisibility();
        await this.NewsContentVisibility();
        await this.PageContentVisibility();
        await this.ProfileContentVisibility();
        await this.PublicationContentVisibility();
        await this.ResearcherProfileContentVisibility();
        // await this.SecureStatsContentVisibility();
        // await this.SecureMarketContentVisibility();
    }

    async AlertContentVisibility()
    {
        this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.alert;

        // Alert is visible on: HSE
        if (this.testSetUpData.urlForTest.url === this.testSetUpData.validTestURLList.hse_url)
        {
            await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
            await this.addContentPage.VerifyContentIsVisible();
        }
        else
        {
            await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS NOT VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
            await this.addContentPage.VerifyContentIsNOTVisible();
        }
    }

    async ApplicationContentVisibility()
    {
        this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.application;

        // Application is visible on: ETI, HSE, NISRA
        if (this.testSetUpData.urlForTest.url === this.testSetUpData.validTestURLList.etini_url ||
            this.testSetUpData.urlForTest.url === this.testSetUpData.validTestURLList.hse_url ||
            this.testSetUpData.urlForTest.url === this.testSetUpData.validTestURLList.nisra_url)
        {
            await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
            await this.addContentPage.VerifyContentIsVisible();
        } else
        {
            await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS NOT VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
            await this.addContentPage.VerifyContentIsNOTVisible();
        }
    }

    async ArticleContentVisibility()
    {
        this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.article;

        // Article is visible on: AFBI, ETINI, HSENI.
        if (this.testSetUpData.urlForTest.url === this.testSetUpData.validTestURLList.afbi_url ||
            this.testSetUpData.urlForTest.url === this.testSetUpData.validTestURLList.etini_url ||
            this.testSetUpData.urlForTest.url === this.testSetUpData.validTestURLList.hse_url)
        {
            await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
            await this.addContentPage.VerifyContentIsVisible();
        }
        else
        {
            await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS NOT VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
            await this.addContentPage.VerifyContentIsNOTVisible();
        }
    }

    async ChartContentVisibility()
    {
        this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.chart;

        // Chart is visible on: NISRA
        if (this.testSetUpData.urlForTest.url === this.testSetUpData.validTestURLList.nisra_url)
        {
            await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
            await this.addContentPage.VerifyContentIsVisible();
        }
        else
        {
            await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS NOT VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
            await this.addContentPage.VerifyContentIsNOTVisible();
        }
    }


    async ConsultationContentVisibility()
    {
        this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.consultation;

        // Consultation is visible on: HSENI.
        if (this.testSetUpData.urlForTest.url === this.testSetUpData.validTestURLList.hse_url)
        {
            await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
            await this.addContentPage.VerifyContentIsVisible();
        }
        else
        {
            await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS NOT VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
            await this.addContentPage.VerifyContentIsNOTVisible();
        }
    }

    async ContactContentVisibility()
    {
        this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.contact;

        // Contact is visible on: AFBI, ETINI, NSMC, HSE, NISRA

        await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
        await this.addContentPage.VerifyContentIsVisible();
    }


    async FeatureContentVisibility()
    {
        this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.feature;

        // Feature is visible on: HSENI
        if (this.testSetUpData.urlForTest.url === this.testSetUpData.validTestURLList.hse_url)
        {
            await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
            await this.addContentPage.VerifyContentIsVisible();
        }
        else
        {
            await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS NOT VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
            await this.addContentPage.VerifyContentIsNOTVisible();
        }
    }


    async GalleryContentVisibility()
    {
        this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.gallery;

        // Gallery is visible on: AFBI, ETINI, NSMC, NISRA
        if (this.testSetUpData.urlForTest.url === this.testSetUpData.validTestURLList.afbi_url ||
            this.testSetUpData.urlForTest.url === this.testSetUpData.validTestURLList.etini_url ||
            this.testSetUpData.urlForTest.url === this.testSetUpData.validTestURLList.nisra_url)
        {
            await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
            await this.addContentPage.VerifyContentIsVisible();
        }
        else
        {
            await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS NOT VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
            await this.addContentPage.VerifyContentIsNOTVisible();
        }
    }

    async LinkContentVisibility()
    {
        this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.link;

        // Link is visible on: AFBI, ETINI, HSE, NISRA, NSMC
        await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
        await this.addContentPage.VerifyContentIsVisible();
    }

    async NewsContentVisibility()
    {
        this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.news;

        // News is visible on: AFBI, ETINI, HSE, NISRA, NSMC
        await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
        await this.addContentPage.VerifyContentIsVisible();
    }

    async PageContentVisibility()
    {
        this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.page;

        // Page is visible on: AFBI, ETINI, HSE, NSMC
        if (this.testSetUpData.urlForTest.url === this.testSetUpData.validTestURLList.afbi_url ||
            this.testSetUpData.urlForTest.url === this.testSetUpData.validTestURLList.etini_url ||
            this.testSetUpData.urlForTest.url === this.testSetUpData.validTestURLList.hse_url ||
            this.testSetUpData.urlForTest.url === this.testSetUpData.validTestURLList.nmsc_url)
        {
            await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
            await this.addContentPage.VerifyContentIsVisible();
        }
        else{
            await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS NOT VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
            await this.addContentPage.VerifyContentIsNOTVisible();
        }
    }

    async ProfileContentVisibility()
    {
        this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.profile;

        // Profile is visible on: ETINI,HSENI, NISRA
        if (this.testSetUpData.urlForTest.url === this.testSetUpData.validTestURLList.etini_url ||
            this.testSetUpData.urlForTest.url === this.testSetUpData.validTestURLList.hse_url ||
            this.testSetUpData.urlForTest.url === this.testSetUpData.validTestURLList.nisra_url)
        {
            await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
            await this.addContentPage.VerifyContentIsVisible();
        }
        else
        {
            await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS NOT VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
            await this.addContentPage.VerifyContentIsNOTVisible();
        }
    }

    async PublicationContentVisibility()
    {
        this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.publication;

        // Publication is visible on: AFBI, ETINI, HSE, NISRA, NSMC
        await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
        await this.addContentPage.VerifyContentIsVisible();
    }

    async ResearcherProfileContentVisibility()
    {
        this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.researcherProfile;

        // Researcher Profile is visible on: AFBI, 
        if (this.testSetUpData.urlForTest.url === this.testSetUpData.validTestURLList.afbi_url)
        {
            await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
            await this.addContentPage.VerifyContentIsVisible();
        }
        else
        {
            await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS NOT VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
            await this.addContentPage.VerifyContentIsNOTVisible();
        }
    }

    async SecureStatsContentVisibility()
    {
        this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.secureStats;

        // Secure Stats is visible on: NISRA 
        if (this.testSetUpData.urlForTest.url === this.testSetUpData.validTestURLList.nisra_url)
        {
            await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
            await this.addContentPage.VerifyContentIsVisible();
        }
        else
        {
            await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS NOT VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
            await this.addContentPage.VerifyContentIsNOTVisible();
        }
    }

    async SecureMarketContentVisibility()
    {
        this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.secureMarket;

        // Secure Market is visible on: NISRA
        if (this.testSetUpData.urlForTest.url === this.testSetUpData.validTestURLList.nisra_url)
        {
            await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
            await this.addContentPage.VerifyContentIsVisible();
        }
        else
        {
            await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS NOT VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
            await this.addContentPage.VerifyContentIsNOTVisible();
        }
    }

    // MEDIA LIBRARY CONTENT VISIBILITY METHODS
    async ContentVisibilityMediaLibrary()
    {
        await this.mediahelper.startAddMediaFlow();

        await this.AudioContentVisibility();
        await this.DocumentContentVisibility();
        await this.ImageContentVisibility();
        await this.RemoteDocumentContentVisibility();
        await this.RemoteVideoContentVisibility();
    }


    async AudioContentVisibility()
    {
        this.testSetUpData.contentTypeforTest.contentType = "Audio";

        await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
        await this.addContentPage.VerifyContentIsVisible();
    }


    async DocumentContentVisibility()
    {
        this.testSetUpData.contentTypeforTest.contentType = "Document";

        await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
        await this.addContentPage.VerifyContentIsVisible();
    }


    async ImageContentVisibility()
    {
        this.testSetUpData.contentTypeforTest.contentType = "Image";

        await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
        await this.addContentPage.VerifyContentIsVisible();
    }


    async RemoteDocumentContentVisibility()
    {
        this.testSetUpData.contentTypeforTest.contentType = "Remote document";

        await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
        await this.addContentPage.VerifyContentIsVisible();
    }


    async RemoteVideoContentVisibility()
    {
        this.testSetUpData.contentTypeforTest.contentType = "Remote video";

        await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
        await this.addContentPage.VerifyContentIsVisible();
    }

}