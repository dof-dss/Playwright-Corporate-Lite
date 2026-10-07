// import { galleryImageDetails, TestData, TestSetUpData } from '../../test-data/TestDataObject';
// import { TestSteps } from '@poms/base-pages/TestSteps';
// import { test } from '@fixtures/MyFixtures';
// import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';
// import { GalleryNodePage } from '@poms/content-pages/Gallery/GalleryNodePage';

// test.describe('Gallery Author Tests', () =>
// {
//   // Pass the fixture for Gallery Authors into the beforeEach hook
//   test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
//   {
//     const testSteps = new TestSteps();
//     await testSteps.LogInfo('Test starting');
//     await testSteps.LogInfo(testInfo.title);

//     // setting the isolated data for THIS specific test run
//     testSetUpData.urlForTest.url = testSetUpData.validTestURLList.daera_url;
//     testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
//     testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;
//     testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.gallery;
//     testSetUpData.contentTitleforTest.contentTitle = testData.Gallery.title;
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

//     // automatically logins based on above test data for each test
//     await loginHelper.loginWithValidUser();
//   });

//   test('Gallery-Auth-TC01 - Create - Create Gallery content as an "Author", perform mandatory field check and preview content', { tag: "@regression" },
//     async ({ galleryHelper, newsHelper, loginHelper, contentModerationHelper, basePage, navigateToCreatedContentHelper, testSetUpData, testData, page }) =>
//     {
//       const galleryNode = new GalleryNodePage(page, testSetUpData, testData, galleryImageDetails);
//       await galleryHelper.createGallery({
//         preview: true,
//         mandatoryFieldCheck: false,
//       });

//       // PRE REQ - CREATE AND PUBLISH NEWS
//       // Logging out as Before each will log in as an Author.
//       await basePage.logOut();

//       // Overriding user for test data with supervisor credentials
//       testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
//       testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;
//       // log back in and naviagte to content
//       await loginHelper.loginWithValidUser();

//       testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.news;
//       testSetUpData.contentTitleforTest.contentTitle = testData.News.title;
//       //Creating News as a Supervisor
//       await newsHelper.createNewsWithGallery();

//       // moderating to published
//       await contentModerationHelper.supervisorModerateContent({
//         NeedsReview: false,
//         Published: true,
//         Archive: false
//       });

//       // Logging out as Before each will log in as an Author.
//       await basePage.logOut();

//       // Resetting state to draft for gallery as was overwritten to publish news
//       testSetUpData.moderationStateForTest.moderationState = testSetUpData.validModerationStates.draft;
//       // Anon Verification
//       await galleryNode.verifyGalleryAnon();

//       // Overriding user for test data with supervisor credentials
//       testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
//       testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;
//       // log back in and naviagte to content
//       await loginHelper.loginWithValidUser();

//       // Overriding title and content type back to gallery as was previously set to News
//       testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.gallery;
//       testSetUpData.contentTitleforTest.contentTitle = testData.Gallery.title;
//       await navigateToCreatedContentHelper.navigateToCreatedContent({
//         active: true,
//         deleted: false
//       });

//       // moderating to needs review
//       await contentModerationHelper.authorModerateContent({
//         NeedsReview: true,
//       });

//       // Logging out as Before each will log in as an Author.
//       await basePage.logOut();

//       // Anon Verification
//       await galleryNode.verifyGalleryAnon();
//     });

//   test('Gallery-Auth-TC02 - Edit - Edit Gallery as an "Author" and ensure it is not published', { tag: "@regression" },
//     async ({ galleryHelper, newsHelper, loginHelper, contentModerationHelper, basePage, navigateToCreatedContentHelper, testSetUpData, testData, page }) =>
//     {
//       const galleryNode = new GalleryNodePage(page, testSetUpData, testData, galleryImageDetails);

//       await galleryHelper.createGallery({
//         preview: true,
//         mandatoryFieldCheck: false,
//       });

//       // PRE REQ - CREATE AND PUBLISH NEWS
//       // Logging out as Before each will log in as an Author.
//       await basePage.logOut();

//       // Overriding user for test data with supervisor credentials
//       testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
//       testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;
//       // log back in and naviagte to content
//       await loginHelper.loginWithValidUser();

//       testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.news;
//       testSetUpData.contentTitleforTest.contentTitle = testData.News.title;
//       //Creating News as a Supervisor
//       await newsHelper.createNewsWithGallery();

//       // moderating to published
//       await contentModerationHelper.supervisorModerateContent({
//         NeedsReview: false,
//         Published: true,
//         Archive: false
//       });

//       // Logging out as Before each will log in as an Author.
//       await basePage.logOut();

//       // Resetting state to draft for gallery as was overwritten to publish news
//       testSetUpData.moderationStateForTest.moderationState = testSetUpData.validModerationStates.draft;
//       // Anon Verification
//       await galleryNode.verifyGalleryAnon();

//       // Overriding user for test data with supervisor credentials
//       testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
//       testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;
//       // log back in and naviagte to content
//       await loginHelper.loginWithValidUser();

//       // Overriding title and content type back to gallery as was previously set to News
//       testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.gallery;
//       testSetUpData.contentTitleforTest.contentTitle = testData.Gallery.title;
//       await navigateToCreatedContentHelper.navigateToCreatedContent({
//         active: true,
//         deleted: false
//       });

//       // edit gallery
//       await galleryHelper.editGallery({
//         preview: true
//       });

//       // Logging out as Before each will log in as an Author.
//       await basePage.logOut();

//       // Resetting state to draft for gallery as was overwritten to publish news
//       testSetUpData.moderationStateForTest.moderationState = testSetUpData.validModerationStates.draft;
//       // Anon Verification
//       await galleryNode.verifyGalleryAnon();
//     });


//   test('Gallery-Auth-TC03 - Delete - Delete Gallery as an "Author" (No News prereq)', { tag: "@regression" },
//     async ({ galleryHelper, navigateToCreatedContentHelper, anonymousHelper, loginHelper, basePage }) =>
//     {
//       await galleryHelper.createGallery({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });

//       // Cancel delete gallery
//       await galleryHelper.deleteGallery({
//         delete: false,
//         cancel: true
//       });

//       await navigateToCreatedContentHelper.navigateToCreatedContent({
//         active: true,
//         deleted: false
//       });

//       // delete gallery
//       await galleryHelper.deleteGallery({
//         delete: true,
//         cancel: false
//       });

//       // confirm content deleted
//       await navigateToCreatedContentHelper.navigateToCreatedContent({
//         active: false,
//         deleted: true
//       });

//     });

//   test('Gallery-Auth-TC04 - Delete - Cannot delete Gallery created by "Supervisor" as an "Author"', { tag: "@regression" },
//     async ({ galleryHelper, navigateToCreatedContentHelper, basePage, loginHelper, testSetUpData }) =>
//     {
//       // Logging out as Before each will log in as an Author.
//       await basePage.logOut();

//       // Overriding user for test data with supervisor credentials
//       testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
//       testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;
//       // log back in and naviagte to content
//       await loginHelper.loginWithValidUser();

//       // Creating Gallery as a Supervisor
//       await galleryHelper.createGallery({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });

//       await basePage.logOut();

//       // Overriding user for test data with Author credentials
//       testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
//       testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;
//       // log back in and naviagte to content
//       await loginHelper.loginWithValidUser();

//       // Navigating to Supervisors created content
//       await navigateToCreatedContentHelper.navigateToCreatedContent({
//         active: true,
//         deleted: false
//       });

//       // Verify delete is not visible for author on supervisor content
//       // (This is verified through the deleteGallery method permissions)
//     });

//   test('Gallery-Auth-TC05 - Compare Revision - Edit Gallery content and ensure user is able to compare Revisions ', { tag: "@regression" }, async ({ galleryHelper, revisionHelper, testSetUpData }) =>
//   {
//     await galleryHelper.createGallery({
//       preview: true,
//       mandatoryFieldCheck: false,
//     });

//     // edit gallery
//     await galleryHelper.editGallery({
//       preview: true
//     });

//     // comparing and verifying Revisions
//     await revisionHelper.compareRevisions();
//   });

//   test('Gallery-Auth-TC06 - Delete Revision - Edit Gallery content and ensure user is able to Delete Revisions', { tag: "@regression" }, async ({ galleryHelper, revisionHelper, testSetUpData }) =>
//   {
//     await galleryHelper.createGallery({
//       preview: true,
//       mandatoryFieldCheck: false,
//     });

//     // overriding test data so that Edit test saves as Needs Review
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;
//     // edit gallery
//     await galleryHelper.editGallery({
//       preview: true
//     });

//     // Cancel Deletion of Revision
//     await revisionHelper.deleteRevisions({
//       delete: false,
//       cancel: true
//     });

//     // Comfirm Deletion of Revision
//     await revisionHelper.deleteRevisions({
//       delete: true,
//       cancel: false
//     });
//   });

//   test('Gallery-Auth-TC07 - Revert Revision - Edit Gallery content and ensure user is able to Revert Revisions', { tag: "@regression" }, async ({ galleryHelper, revisionHelper, testSetUpData }) =>
//   {
//     // creating content
//     await galleryHelper.createGallery({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // overriding test data so that Edit test saves as Needs Review
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//     // edit gallery
//     await galleryHelper.editGallery({
//       preview: false
//     });

//     // Cancel Reverting of Revision and verify edited version is still visible
//     await revisionHelper.revertRevisions({
//       revert: false,
//       cancel: true
//     });

//     // Comfirm reverting of Revision and verify inital version is now visible
//     await revisionHelper.revertRevisions({
//       revert: true,
//       cancel: false
//     });
//   });

//   test('Gallery-Auth-TC09 - Workbench -  Create Gallery content as an "Author", and use Workbench to complete all moderation states available', { tag: "@regression" }, async ({ galleryHelper, contentModerationHelper, workBenchHelper, navigateToCreatedContentHelper, basePage, loginHelper, testSetUpData }) =>
//   {
//     // creating gallery as a draft and performing mandatory field check
//     console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

//     await galleryHelper.createGallery({
//       preview: false,
//       mandatoryFieldCheck: false
//     });

//     await workBenchHelper.authorWorkBench({
//       draft: true,
//       needsReview: false,
//       archived: false
//     });

//     // moderating to needs review
//     await contentModerationHelper.authorModerateContent({
//       NeedsReview: true,
//     });

//     await workBenchHelper.authorWorkBench({
//       draft: false,
//       needsReview: true,
//       archived: false
//     });


//     //Logging in as a supervisor to Archive Content as authors can view archive content but are unable to archive themseleves
//     await basePage.logOut();

//     // Overriding user for test data with supervisor credentials
//     testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
//     testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;
//     // log back in and naviagte to content
//     await loginHelper.loginWithValidUser();

//     // Navigating to authors created content
//     await navigateToCreatedContentHelper.navigateToCreatedContent({
//       active: true,
//       deleted: false
//     });

//     // moderating to Archived
//     await contentModerationHelper.supervisorModerateContent({
//       NeedsReview: false,
//       Published: false,
//       Archive: true
//     });

//     // Logging out to complete author workbench.
//     await basePage.logOut();

//     // Overriding user for test data with author credentials
//     testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
//     testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;
//     // log back in and naviagte to content
//     await loginHelper.loginWithValidUser();

//     await workBenchHelper.authorWorkBench({
//       draft: false,
//       needsReview: false,
//       archived: true
//     });
//   });

// });

// test.describe('Gallery Supervisor Tests', () =>
// {
//   // Pass the fixture for Gallery Authors into the beforeEach hook
//   test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
//   {
//     const testSteps = new TestSteps();
//     await testSteps.LogInfo('Test starting');
//     await testSteps.LogInfo(testInfo.title);

//     // setting the isolated data for THIS specific test run
//     testSetUpData.urlForTest.url = testSetUpData.validTestURLList.daera_url;
//     testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
//     testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;
//     testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.gallery;
//     testSetUpData.contentTitleforTest.contentTitle = testData.Gallery.title;
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

//     // automatically logins based on above test data for each test
//     await loginHelper.loginWithValidUser();
//   });

//   test('Gallery-Super-TC01 - Create - Create Gallery content as an "Supervisor", perform mandatory field check and preview content', { tag: "@regression" }, async ({ galleryHelper, newsHelper, loginHelper, contentModerationHelper, basePage, navigateToCreatedContentHelper, testSetUpData, testData, page }) =>
//   {
//     const galleryNode = new GalleryNodePage(page, testSetUpData, testData, galleryImageDetails);
//     await galleryHelper.createGallery({
//       preview: true,
//       mandatoryFieldCheck: false,
//     });

//     testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.news;
//     testSetUpData.contentTitleforTest.contentTitle = testData.News.title;
//     //Creating News as a Supervisor
//     await newsHelper.createNewsWithGallery();

//     // moderating to published
//     await contentModerationHelper.supervisorModerateContent({
//       NeedsReview: false,
//       Published: true,
//       Archive: false
//     });

//     // Logging out as Before each will log in as an Author.
//     await basePage.logOut();

//     // Resetting state to draft for gallery as was overwritten to publish news
//     testSetUpData.moderationStateForTest.moderationState = testSetUpData.validModerationStates.draft;
//     // Anon Verification
//     await galleryNode.verifyGalleryAnon();

//     // log back in and naviagte to content
//     await loginHelper.loginWithValidUser();
//     // Overriding title and content type back to gallery as was previously set to News
//     testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.gallery;
//     testSetUpData.contentTitleforTest.contentTitle = testData.Gallery.title;
//     await navigateToCreatedContentHelper.navigateToCreatedContent({
//       active: true,
//       deleted: false
//     });

//     // moderating to needs review
//     await contentModerationHelper.supervisorModerateContent({
//       NeedsReview: true,
//       Published: false,
//       Archive: false
//     });

//     // Logging out as Before each will log in as an Author.
//     await basePage.logOut();

//     // Anon Verification
//     await galleryNode.verifyGalleryAnon();

//     // log back in and naviagte to content
//     await loginHelper.loginWithValidUser();

//     await navigateToCreatedContentHelper.navigateToCreatedContent({
//       active: true,
//       deleted: false
//     });

//     // moderating to published
//     await contentModerationHelper.supervisorModerateContent({
//       NeedsReview: false,
//       Published: true,
//       Archive: false
//     });

//     // Logging out as Before each will log in as an Author.
//     await basePage.logOut();

//     // Anon Verification
//     await galleryNode.verifyGalleryAnon();

//     // log back in and naviagte to content
//     await loginHelper.loginWithValidUser();

//     await navigateToCreatedContentHelper.navigateToCreatedContent({
//       active: true,
//       deleted: false
//     });

//     // moderating to published
//     await contentModerationHelper.supervisorModerateContent({
//       NeedsReview: false,
//       Published: false,
//       Archive: true
//     });

//     // Logging out as Before each will log in as an Author.
//     await basePage.logOut();

//     // Anon Verification
//     await galleryNode.verifyGalleryAnon();
//   });

//   test('Gallery-Super-TC02 - Edit - Edit Published Gallery content and ensure edit is published as a "Supervisor" ', { tag: "@regression" }, async ({ galleryHelper, newsHelper, loginHelper, contentModerationHelper, basePage, navigateToCreatedContentHelper, testSetUpData, testData, page }) =>
//   {
//     const galleryNode = new GalleryNodePage(page, testSetUpData, testData, galleryImageDetails);
//     await galleryHelper.createGallery({
//       preview: true,
//       mandatoryFieldCheck: false,
//     });

//     // moderating to published
//     await contentModerationHelper.supervisorModerateContent({
//       NeedsReview: false,
//       Published: true,
//       Archive: false
//     });

//     testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.news;
//     testSetUpData.contentTitleforTest.contentTitle = testData.News.title;
//     //Creating News as a Supervisor
//     await newsHelper.createNewsWithGallery();

//     // moderating to published
//     await contentModerationHelper.supervisorModerateContent({
//       NeedsReview: false,
//       Published: true,
//       Archive: false
//     });

//     // Logging out to verify as Anon
//     await basePage.logOut();
//     // Anon Verification
//     await galleryNode.verifyGalleryAnon();

//     // log back in and naviagte to content
//     await loginHelper.loginWithValidUser();
//     // Overriding title and content type back to gallery as was previously set to News
//     testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.gallery;
//     testSetUpData.contentTitleforTest.contentTitle = testData.Gallery.title;
//     await navigateToCreatedContentHelper.navigateToCreatedContent({
//       active: true,
//       deleted: false
//     });

//     // edit gallery
//     await galleryHelper.editGallery({
//       preview: true
//     });

//     // moderating edited content to published
//     await contentModerationHelper.supervisorModerateContent({
//       NeedsReview: false,
//       Published: true,
//       Archive: false
//     });

//     // Logging out to verify as Anon
//     await basePage.logOut();
//     // Anon Verification
//     await galleryNode.verifyEditedGalleryAnon();
//   });

//   test('Gallery-Super-TC03 - Delete - Delete Published Gallery as "Supervisor" and confirm it isnt viewable as an anon user', { tag: "@regression" }, async ({ galleryHelper, newsHelper, loginHelper, contentModerationHelper, basePage, navigateToCreatedContentHelper, testSetUpData, testData, page }) =>
//   {
//     const galleryNode = new GalleryNodePage(page, testSetUpData, testData, galleryImageDetails);
//     const moderationSideBar = new ModerationSideBar(page, testSetUpData, testData);

//     await galleryHelper.createGallery({
//       preview: true,
//       mandatoryFieldCheck: false,
//     });

//     // moderating to published
//     await contentModerationHelper.supervisorModerateContent({
//       NeedsReview: false,
//       Published: true,
//       Archive: false
//     });

//     testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.news;
//     testSetUpData.contentTitleforTest.contentTitle = testData.News.title;
//     //Creating News as a Supervisor
//     await newsHelper.createNewsWithGallery();

//     // moderating to published
//     await contentModerationHelper.supervisorModerateContent({
//       NeedsReview: false,
//       Published: true,
//       Archive: false
//     });

//     testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.gallery;
//     testSetUpData.contentTitleforTest.contentTitle = testData.Gallery.title;
//     // Navigating to Supervisors created content
//     await navigateToCreatedContentHelper.navigateToCreatedContent({
//       active: true,
//       deleted: false
//     });

//     // cancel delete gallery
//     await galleryHelper.deleteGallery({
//       delete: false,
//       cancel: true
//     });

//     // Logging out to verify as Anon
//     await basePage.logOut();
//     // Anon Verification
//     await galleryNode.verifyGalleryAnon();

//     // log back in and naviagte to content
//     await loginHelper.loginWithValidUser();
//     await navigateToCreatedContentHelper.navigateToCreatedContent({
//       active: true,
//       deleted: false
//     });

//     // delete gallery
//     await galleryHelper.deleteGallery({
//       delete: true,
//       cancel: false
//     });

//     await navigateToCreatedContentHelper.navigateToCreatedContent({
//       active: false,
//       deleted: true
//     });

//     // Logging out to verify as Anon
//     await basePage.logOut();
//     // Anon Verification
//     await galleryNode.verifyGalleryAnon();
//   });

//   test('Gallery-Super-TC04 - Delete - Can delete Gallery created by "Author" as an "Supervisor"', { tag: "@regression" }, async ({ galleryHelper, navigateToCreatedContentHelper, basePage, loginHelper, contentModerationHelper, anonymousHelper, testSetUpData }) =>
//   {
//     // Logging out as Before each will log in as an Author.
//     await basePage.logOut();

//     // Overriding user for test data with Author credentials
//     testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
//     testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;
//     // log back in and naviagte to content
//     await loginHelper.loginWithValidUser();

//     // Creating Gallery as a Author
//     await galleryHelper.createGallery({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     await basePage.logOut();

//     // Overriding user for test data with Supervisor credentials
//     testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
//     testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;

//     // log back in and naviagte to content
//     await loginHelper.loginWithValidUser();

//     // Navigating to Authors created content
//     await navigateToCreatedContentHelper.navigateToCreatedContent({
//       active: true,
//       deleted: false
//     });

//     // delete authors gallery
//     await galleryHelper.deleteGallery({
//       delete: true,
//       cancel: false
//     });

//     // confirm content deleted logged in on content page
//     await navigateToCreatedContentHelper.navigateToCreatedContent({
//       active: false,
//       deleted: true
//     });
//   });

//   test('Gallery-Super-TC05 - Compare Revision - Edit Gallery content and ensure user is able to compare Revisions ', { tag: "@regression" }, async ({ galleryHelper, revisionHelper, testSetUpData }) =>
//   {
//     await galleryHelper.createGallery({
//       preview: true,
//       mandatoryFieldCheck: false,
//     });

//     // edit gallery
//     await galleryHelper.editGallery({
//       preview: true
//     });

//     // comparing and verifying Revisions
//     await revisionHelper.compareRevisions();
//   });

//   test('Gallery-Super-TC06 - Delete Revision - Edit Gallery content and ensure user is able to Delete Revisions', { tag: "@regression" }, async ({ galleryHelper, revisionHelper, testSetUpData }) =>
//   {
//     await galleryHelper.createGallery({
//       preview: true,
//       mandatoryFieldCheck: false,
//     });

//     // overriding test data so that Edit test saves as Needs Review
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;
//     // edit gallery
//     await galleryHelper.editGallery({
//       preview: true
//     });

//     // Cancel Deletion of Revision
//     await revisionHelper.deleteRevisions({
//       delete: false,
//       cancel: true
//     });

//     // Comfirm Deletion of Revision
//     await revisionHelper.deleteRevisions({
//       delete: true,
//       cancel: false
//     });
//   });

//   test('Gallery-Super-TC07 - Revert Revision - Edit Gallery content and ensure user is able to Revert Revisions', { tag: "@regression" }, async ({ galleryHelper, revisionHelper, testSetUpData }) =>
//   {
//     // creating content
//     await galleryHelper.createGallery({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // overriding test data so that Edit test saves as Needs Review
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//     // edit gallery
//     await galleryHelper.editGallery({
//       preview: false
//     });

//     // Cancel Reverting of Revision and verify edited version is still visible
//     await revisionHelper.revertRevisions({
//       revert: false,
//       cancel: true
//     });

//     // Comfirm reverting of Revision and verify inital version is now visible
//     await revisionHelper.revertRevisions({
//       revert: true,
//       cancel: false
//     });
//   });

//   test('Gallery-Super-TC09 - Workbench -  Create Gallery content as an "Supervisor", and use Workbench to complete all moderation states', { tag: "@regression" }, async ({ galleryHelper, contentModerationHelper, workBenchHelper, testSetUpData }) =>
//   {
//     // creating gallery as a draft and performing mandatory field check
//     console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

//     await galleryHelper.createGallery({
//       preview: false,
//       mandatoryFieldCheck: false
//     });

//     await workBenchHelper.supervisorWorkBench({
//       draft: true,
//       needsReview: false,
//       archived: false
//     });

//     // moderating to needs review
//     await contentModerationHelper.supervisorModerateContent({
//       NeedsReview: true,
//       Published: false,
//       Archive: false
//     });

//     await workBenchHelper.supervisorWorkBench({
//       draft: false,
//       needsReview: true,
//       archived: false
//     });

//     // moderating to needs review
//     await contentModerationHelper.supervisorModerateContent({
//       NeedsReview: false,
//       Published: false,
//       Archive: true
//     });

//     await workBenchHelper.supervisorWorkBench({
//       draft: false,
//       needsReview: false,
//       archived: true
//     });

//   });

// });
