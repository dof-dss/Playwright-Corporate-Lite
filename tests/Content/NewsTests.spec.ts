// import { TestSteps } from '@poms/base-pages/TestSteps';
// import { test } from '@fixtures/MyFixtures';
// import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';

// test.describe('News Author Tests', () =>
// {
//   // Pass the fixture for News Authors into the beforeEach hook
//   test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
//   {
//     const testSteps = new TestSteps();
//     await testSteps.LogInfo('Test starting');
//     await testSteps.LogInfo(testInfo.title);

//     // setting the isolated data for THIS specific test run
//     testSetUpData.urlForTest.url = testSetUpData.validTestURLList.daera_url;
//     testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
//     testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;
//     testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.news;
//     testSetUpData.contentTitleforTest.contentTitle = testData.News.title;
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

//     // automatically logins based on above test data for each test
//     await loginHelper.loginWithValidUser();
//   });

//   test('News-Auth-TC01 - Create - Create News content as an "Author", perform mandatory field check and preview content', { tag: "@regression" },
//     async ({ loginHelper, newsHelper, anonymousHelper, contentModerationHelper, navigateToCreatedContentHelper }) =>
//     {
//       await newsHelper.createNews({
//         preview: true,
//         mandatoryFieldCheck: true,
//       });

//       // searching as anon to ensure content is not viewable as draft
//       await anonymousHelper.searchAsAnon({ edited: false });

//       // log back in and naviagte to content
//       await loginHelper.loginWithValidUser();
//       await navigateToCreatedContentHelper.navigateToCreatedContent({
//         active: true,
//         deleted: false
//       });

//       // moderating to needs review
//       await contentModerationHelper.authorModerateContent({
//         NeedsReview: true,
//       });

//       // searching as anon to ensure content is not viewable as needs review
//       await anonymousHelper.searchAsAnon({ edited: false });

//     });

//   test('News-Auth-TC02 - Edit - Edit News as an "Author" and ensure it is not published', { tag: "@regression" },
//     async ({ newsHelper, anonymousHelper }) =>
//     {
//       await newsHelper.createNews({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });

//       // edit news
//       await newsHelper.editNews({
//         preview: true
//       });

//       // searching as anon to ensure edited content is not viewable as draft
//       await anonymousHelper.searchAsAnon({ edited: true });

//     });

//   test('News-Auth-TC03 - Delete - Delete News as an "Author"', { tag: "@regression" },
//     async ({ newsHelper, navigateToCreatedContentHelper, anonymousHelper, loginHelper }) =>
//     {
//       await newsHelper.createNews({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });

//       // Cancel delete news
//       await newsHelper.deleteNews({
//         delete: false,
//         cancel: true
//       });

//       await navigateToCreatedContentHelper.navigateToCreatedContent({
//         active: true,
//         deleted: false
//       });

//       // delete news
//       await newsHelper.deleteNews({
//         delete: true,
//         cancel: false
//       });

//       // confirm content deleted
//       await navigateToCreatedContentHelper.navigateToCreatedContent({
//         active: false,
//         deleted: true
//       });

//     });

//   test('News-Auth-TC04 - Delete - Cannot delete News created by "Supervisor" as an "Author"', { tag: "@regression" },
//     async ({ newsHelper, navigateToCreatedContentHelper, basePage, loginHelper, contentModerationHelper, anonymousHelper, page, testSetUpData, testData }) =>
//     {
//       const permissionCheck = new ModerationSideBar(page, testSetUpData, testData);

//       // Logging out as Before each will log in as an Author.
//       await basePage.logOut();

//       // Overriding user for test data with supervisor credentials
//       testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
//       testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;
//       // log back in and naviagte to content
//       await loginHelper.loginWithValidUser();

//       // Creating News as a Supervisor
//       await newsHelper.createNews({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });

//       // moderating to Published
//       await contentModerationHelper.supervisorModerateContent({
//         NeedsReview: false,
//         Published: true,
//         Archive: false
//       });

//       // searching as anon to ensure content is viewable when published
//       await anonymousHelper.searchAsAnon({ edited: false });

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

//       await permissionCheck.openModerationSideBar();
//       await permissionCheck.deleteButtonNotVisible();

//       // searching as anon to ensure content is viewable as Author has not been able to delete
//       await anonymousHelper.searchAsAnon({ edited: false });
//     });

//   test('News-Auth-TC05 - Compare Revision - Edit News content and ensure user is able to compare Revisions ', { tag: "@regression" }, async ({ newsHelper, revisionHelper, testSetUpData }) =>
//   {
//     // creating content
//     await newsHelper.createNews({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // overriding test data so that Edit test saves as Needs Review
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//     // edit news
//     await newsHelper.editNews({
//       preview: false
//     });

//     // comparing and verifying Revisions
//     await revisionHelper.compareRevisions();
//   });

//   test('News-Auth-TC06 - Delete Revision - Edit News content and ensure user is able to Delete Revisions', { tag: "@regression" }, async ({ newsHelper, revisionHelper, testSetUpData }) =>
//   {
//     // creating content
//     await newsHelper.createNews({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // overriding test data so that Edit test saves as Needs Review
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//     // edit news
//     await newsHelper.editNews({
//       preview: false
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

//   test('News-Auth-TC07 - Revert Revision - Edit News content and ensure user is able to Revert Revisions', { tag: "@regression" }, async ({ newsHelper, revisionHelper, testSetUpData }) =>
//   {
//     // creating content
//     await newsHelper.createNews({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // overriding test data so that Edit test saves as Needs Review
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//     // edit news
//     await newsHelper.editNews({
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

//   test('News-Auth-TC09 - Workbench -  Create News content as an "Author", and use Workbench to complete all moderation states available', { tag: "@regression" }, async ({ newsHelper, contentModerationHelper, workBenchHelper, navigateToCreatedContentHelper, basePage, loginHelper, testSetUpData }) =>
//   {
//     // creating news as a draft and performing mandatory field check
//     console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

//     await newsHelper.createNews({
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

// test.describe('News Supervisor Tests', () =>
// {
//   // Pass the fixture for News Authors into the beforeEach hook
//   test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
//   {
//     const testSteps = new TestSteps();
//     await testSteps.LogInfo('Test starting');
//     await testSteps.LogInfo(testInfo.title);

//     // setting the isolated data for THIS specific test run
//     testSetUpData.urlForTest.url = testSetUpData.validTestURLList.daera_url;
//     testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
//     testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;
//     testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.news;
//     testSetUpData.contentTitleforTest.contentTitle = testData.News.title;
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

//     // automatically logins based on above test data for each test
//     await loginHelper.loginWithValidUser();
//   });

//   test('News-Super-TC01 - Create - Create News content as an "Supervisor", perform mandatory field check and preview content', { tag: "@regression" }, async ({ newsHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData }) =>
//   {
//     // creating news as a draft and performing mandatory field check
//     console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

//     await newsHelper.createNews({
//       preview: true,
//       mandatoryFieldCheck: true,
//     });

//     // searching as anon to ensure content is not viewable as draft
//     await anonymousHelper.searchAsAnon({ edited: false });

//     // log back in and naviagte to content
//     await loginHelper.loginWithValidUser();
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

//     // searching as anon to ensure content is not viewable as needs review
//     await anonymousHelper.searchAsAnon({ edited: false });

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

//     // searching as anon to ensure content is viewable as it is published
//     await anonymousHelper.searchAsAnon({ edited: false });

//     // log back in and naviagte to content
//     await loginHelper.loginWithValidUser();
//     await navigateToCreatedContentHelper.navigateToCreatedContent({
//       active: true,
//       deleted: false
//     });

//     // moderating to archived
//     await contentModerationHelper.supervisorModerateContent({
//       NeedsReview: false,
//       Published: false,
//       Archive: true
//     });

//     // searching as anon to ensure content is not viewable as it is archived
//     await anonymousHelper.searchAsAnon({ edited: false });
//   });

//   test('News-Super-TC02 - Edit - Edit Published News content and ensure edit is published as a "Supervisor" ', { tag: "@regression" }, async ({ newsHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper }) =>
//   {
//     // creating content
//     await newsHelper.createNews({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // moderating to published
//     await contentModerationHelper.supervisorModerateContent({
//       NeedsReview: false,
//       Published: true,
//       Archive: false
//     });

//     // edit news
//     await newsHelper.editNews({
//       preview: true
//     });

//     // moderating edited content to published
//     await contentModerationHelper.supervisorModerateContent({
//       NeedsReview: false,
//       Published: true,
//       Archive: false
//     });

//     // ensure edit is publish published set to true
//     await anonymousHelper.searchAsAnon({ edited: true });
//   });

//   test('News-Super-TC03 - Delete - Delete Published News as "Supervisor" and confirm it isnt viewable as an anon user', { tag: "@regression" }, async ({ newsHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper }) =>
//   {
//     // creating content
//     await newsHelper.createNews({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // moderating to published
//     await contentModerationHelper.supervisorModerateContent({
//       NeedsReview: false,
//       Published: true,
//       Archive: false
//     });

//     // cancel delete news
//     await newsHelper.deleteNews({
//       delete: false,
//       cancel: true
//     });

//     // ensure cancel has not deleted content and it is viewable to anon users
//     await anonymousHelper.searchAsAnon({ edited: false });

//     // log back in and naviagte to content
//     await loginHelper.loginWithValidUser();
//     await navigateToCreatedContentHelper.navigateToCreatedContent({
//       active: true,
//       deleted: false
//     });

//     // delete news
//     await newsHelper.deleteNews({
//       delete: true,
//       cancel: false
//     });

//     // confirm content deleted logged in on content page
//     await navigateToCreatedContentHelper.navigateToCreatedContent({
//       active: false,
//       deleted: true
//     });

//     // ensure news is deleted and not viewable to anon users
//     await anonymousHelper.searchAsAnon({ edited: false });
//   });

//   test('News-Super-TC04 - Delete - Can delete News created by "Author" as an "Supervisor"', { tag: "@regression" }, async ({ newsHelper, navigateToCreatedContentHelper, basePage, loginHelper, contentModerationHelper, anonymousHelper, testSetUpData }) =>
//   {

//     // Logging out as Before each will log in as an Author.
//     await basePage.logOut();

//     // Overriding user for test data with Author credentials
//     testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
//     testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;
//     // log back in and naviagte to content
//     await loginHelper.loginWithValidUser();

//     // Creating News as a Author
//     await newsHelper.createNews({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // moderating to Published
//     await contentModerationHelper.authorModerateContent({
//       NeedsReview: false
//     });

//     // searching as anon to ensure content is not viewable when is a Needs Review state
//     await anonymousHelper.searchAsAnon({ edited: false });

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

//     // delete authors news
//     await newsHelper.deleteNews({
//       delete: true,
//       cancel: false
//     });

//     // confirm content deleted logged in on content page
//     await navigateToCreatedContentHelper.navigateToCreatedContent({
//       active: false,
//       deleted: true
//     });
//   });

//   test('News-Super-TC05 - Compare Revision - Edit News content and ensure user is able to compare Revisions ', { tag: "@regression" }, async ({ newsHelper, revisionHelper, testSetUpData }) =>
//   {
//     // creating content
//     await newsHelper.createNews({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // overriding test data so that Edit test saves as Needs Review
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//     // edit news
//     await newsHelper.editNews({
//       preview: false
//     });

//     // comparing and verifying Revisions
//     await revisionHelper.compareRevisions();

//   });

//   test('News-Super-TC06 - Delete Revision - Edit News content and ensure user is able to Delete Revisions', { tag: "@regression" }, async ({ newsHelper, revisionHelper, testSetUpData }) =>
//   {
//     // creating content
//     await newsHelper.createNews({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // overriding test data so that Edit test saves as Needs Review
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//     // edit news
//     await newsHelper.editNews({
//       preview: false
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

//   test('News-Super-TC07 - Revert Revision - Edit News content and ensure user is able to Revert Revisions', { tag: "@regression" }, async ({ newsHelper, revisionHelper, testSetUpData }) =>
//   {
//     // creating content
//     await newsHelper.createNews({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // overriding test data so that Edit test saves as Needs Review
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//     // edit news
//     await newsHelper.editNews({
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

//   test('News-Super-TC09 - Workbench -  Create News content as an "Supervisor", and use Workbench to complete all moderation states', { tag: "@regression" }, async ({ newsHelper, contentModerationHelper, workBenchHelper, testSetUpData }) =>
//   {
//     // creating news as a draft and performing mandatory field check
//     console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

//     await newsHelper.createNews({
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