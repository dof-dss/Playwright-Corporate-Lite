// import { Page } from '@playwright/test';
// import { AddContentPage } from '@poms/base-pages/AddContentPage';
// import { BasePage } from '@poms/base-pages/BasePage';
// import { ContentPage } from '@poms/base-pages/ContentPage';
// import { TestSteps } from '@poms/base-pages/TestSteps';
// import { TestSetUpData, TestData } from '@tdata/TestDataObject';
// import { MediaPage } from '@poms/content-pages/Media/MediaPage';
// import { AddMediaItemPage } from '@poms/content-pages/Media/AddMediaItemPage';
// import { MediaHelper } from '@helpers/general/MediaHelper';

// export class ContentVisibilityHelper
// {
//     private readonly basePage: BasePage;
//     private readonly contentPage: ContentPage;
//     private readonly addContentPage: AddContentPage;
//     private readonly testSteps: TestSteps;
//     private readonly mediaPage: MediaPage;
//     private readonly addMediaItemPage: AddMediaItemPage;
//     private readonly mediahelper: MediaHelper;

//     constructor(
//         private readonly page: Page,
//         // isolated instances of test data via constructor
//         private readonly testSetUpData: typeof TestSetUpData
//     )
//     {
//         this.basePage = new BasePage(page, testSetUpData);
//         this.contentPage = new ContentPage(page, testSetUpData);
//         this.addContentPage = new AddContentPage(page, testSetUpData);
//         this.testSteps = new TestSteps();
//         this.mediaPage = new MediaPage(page, testSetUpData);
//         this.addMediaItemPage = new AddMediaItemPage(page, testSetUpData);
//         this.mediahelper = new MediaHelper(page, testSetUpData, TestData);
//     }

//     // navigation method
//     async navigateToContentTypes()
//     {
//         await this.basePage.clickContentLink();
//         await this.contentPage.contentPageURLCheck();
//         await this.contentPage.clickAddContentButton();
//         await this.addContentPage.addContentPageURLCheck();
//     }

//     async ContentVisibility()
//     {
//         await this.navigateToContentTypes();

//         await this.ApplicationContentVisibility();
//         await this.ArticleContentVisibility();
//         await this.ChartContentVisibility();
//         await this.ConsultationContentVisibility();
//         await this.ContactContentVisibility();
//         await this.GalleryContentVisibility();
//         await this.LinkContentVisibility();
//         await this.NewsContentVisibility();
//         await this.ProfileContentVisibility();
//         await this.PublicationContentVisibility();
//     }

//     async ApplicationContentVisibility()
//     {
//         this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.application;

//         await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
//         await this.addContentPage.VerifyContentIsVisible();
//     }

//     async ArticleContentVisibility()
//     {
//         this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.article;

//         await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
//         await this.addContentPage.VerifyContentIsVisible();
//     }

//     async ChartContentVisibility()
//     {
//         this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.chart;

//         await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
//         await this.addContentPage.VerifyContentIsVisible();
//     }


//     async ConsultationContentVisibility()
//     {
//         this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.consultation;

//         await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
//         await this.addContentPage.VerifyContentIsVisible();
//     }

//     async ContactContentVisibility()
//     {
//         this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.contact;

//         await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
//         await this.addContentPage.VerifyContentIsVisible();
//     }

//     async GalleryContentVisibility()
//     {
//         this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.gallery;

//         await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
//         await this.addContentPage.VerifyContentIsVisible();
//     }

//     async LinkContentVisibility()
//     {
//         this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.link;

//         if (this.testSetUpData.userForTest.username === this.testSetUpData.validUserList.supervisor_username ||
//             this.testSetUpData.userForTest.username === this.testSetUpData.validUserList.stats_supervisor_username ||
//             this.testSetUpData.userForTest.username === this.testSetUpData.validUserList.homepage_supervisor_username)
//         {
//             await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
//             await this.addContentPage.VerifyContentIsVisible();
//         }
//         else
//         {
//             await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS NOT VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
//             await this.addContentPage.VerifyContentIsNOTVisible();
//         }

//     }

//     async NewsContentVisibility()
//     {
//         this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.news;

//         await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
//         await this.addContentPage.VerifyContentIsVisible();
//     }

//     async ProfileContentVisibility()
//     {
//         this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.profile;

//         await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
//         await this.addContentPage.VerifyContentIsVisible();
//     }

//     async PublicationContentVisibility()
//     {
//         this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.publication;

//         await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
//         await this.addContentPage.VerifyContentIsVisible();
//     }

//     // MEDIA LIBRARY CONTENT VISIBILITY METHODS
//     async ContentVisibilityMediaLibrary()
//     {
//         await this.mediahelper.startAddMediaFlow();

//         await this.AudioContentVisibility();
//         await this.DocumentContentVisibility();
//         await this.ImageContentVisibility();
//         await this.RemoteDocumentContentVisibility();
//         await this.RemoteVideoContentVisibility();
//     }


//     async AudioContentVisibility()
//     {
//         this.testSetUpData.contentTypeforTest.contentType = "Audio";

//         await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
//         await this.addContentPage.VerifyContentIsVisible();
//     }


//     async DocumentContentVisibility()
//     {
//         this.testSetUpData.contentTypeforTest.contentType = "Document";

//         await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
//         await this.addContentPage.VerifyContentIsVisible();
//     }


//     async ImageContentVisibility()
//     {
//         this.testSetUpData.contentTypeforTest.contentType = "Image";

//         await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
//         await this.addContentPage.VerifyContentIsVisible();
//     }


//     async RemoteDocumentContentVisibility()
//     {
//         this.testSetUpData.contentTypeforTest.contentType = "Remote document";

//         await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
//         await this.addContentPage.VerifyContentIsVisible();
//     }


//     async RemoteVideoContentVisibility()
//     {
//         this.testSetUpData.contentTypeforTest.contentType = "Remote video";

//         await this.testSteps.LogInfo(`Verifying "${this.testSetUpData.contentTypeforTest.contentType}" link IS VISIBLE on "${this.testSetUpData.urlForTest.url}" as a "${this.testSetUpData.userForTest.username}" user`);
//         await this.addContentPage.VerifyContentIsVisible();
//     }

// }