// import { TestSteps } from '@poms/base-pages/TestSteps';
// import { test } from '@fixtures/MyFixtures';
// import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';

// test.describe('Publication Author Tests', () =>
// {
//   // Pass the fixture for Publication Authors into the beforeEach hook
//   test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
//   {
//     const testSteps = new TestSteps();
//     await testSteps.LogInfo('Test starting');
//     await testSteps.LogInfo(testInfo.title);

//     // setting the isolated data for THIS specific test run
//     testSetUpData.urlForTest.url = testSetUpData.validTestURLList.finance_url;
//     testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
//     testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;
//     testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.publication;
//     testSetUpData.contentTitleforTest.contentTitle = testData.Publication.title;
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

//     // automatically logins based on above test data for each test
//     await loginHelper.loginWithValidUser();
//   });

//   test('Publication-Auth-TC01 - Create - Create Publication content as an "Author", perform mandatory field check and preview content', { tag: "@regression" },
//     async ({ loginHelper, publicationHelper, anonymousHelper, contentModerationHelper, navigateToCreatedContentHelper }) =>
//     {
//       await publicationHelper.createPublication({
//         preview: true,
//         mandatoryFieldCheck: false,
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

//   test('Publication-Auth-TC02 - Edit - Edit Publication as an "Author" and ensure it is not published', { tag: "@regression" },
//     async ({ publicationHelper, anonymousHelper }) =>
//     {
//       await publicationHelper.createPublication({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });

//       // edit publication
//       await publicationHelper.editPublication({
//         preview: true
//       });

//       // searching as anon to ensure edited content is not viewable as draft
//       await anonymousHelper.searchAsAnon({ edited: true });

//     });

//   test('Publication-Auth-TC03 - Delete - Delete Publication as an "Author"', { tag: "@regression" },
//     async ({ publicationHelper, navigateToCreatedContentHelper, anonymousHelper, loginHelper }) =>
//     {
//       await publicationHelper.createPublication({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });

//       // Cancel delete publication
//       await publicationHelper.deletePublication({
//         delete: false,
//         cancel: true
//       });

//       await navigateToCreatedContentHelper.navigateToCreatedContent({
//         active: true,
//         deleted: false
//       });

//       // delete publication
//       await publicationHelper.deletePublication({
//         delete: true,
//         cancel: false
//       });

//       // confirm content deleted
//       await navigateToCreatedContentHelper.navigateToCreatedContent({
//         active: false,
//         deleted: true
//       });

//     });

//   test('Publication-Auth-TC04 - Delete - Cannot delete Publication created by "Supervisor" as an "Author"', { tag: "@regression" },
//     async ({ publicationHelper, navigateToCreatedContentHelper, basePage, loginHelper, contentModerationHelper, anonymousHelper, page, testSetUpData, testData }) =>
//     {
//       const permissionCheck = new ModerationSideBar(page, testSetUpData, testData);

//       // Logging out as Before each will log in as an Author.
//       await basePage.logOut();

//       // Overriding user for test data with supervisor credentials
//       testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
//       testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;
//       // log back in and naviagte to content
//       await loginHelper.loginWithValidUser();

//       // Creating Publication as a Supervisor
//       await publicationHelper.createPublication({
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

//   test('Publication-Auth-TC05 - Compare Revision - Edit Publication content and ensure user is able to compare Revisions ', { tag: "@regression" }, async ({ publicationHelper, revisionHelper, testSetUpData }) =>
//   {
//     // creating content
//     await publicationHelper.createPublication({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // overriding test data so that Edit test saves as Needs Review
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//     // edit publication
//     await publicationHelper.editPublication({
//       preview: false
//     });

//     // comparing and verifying Revisions
//     await revisionHelper.compareRevisions();
//   });

//   test('Publication-Auth-TC06 - Delete Revision - Edit Publication content and ensure user is able to Delete Revisions', { tag: "@regression" }, async ({ publicationHelper, revisionHelper, testSetUpData }) =>
//   {
//     // creating content
//     await publicationHelper.createPublication({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // overriding test data so that Edit test saves as Needs Review
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//     // edit publication
//     await publicationHelper.editPublication({
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

//   test('Publication-Auth-TC07 - Revert Revision - Edit Publication content and ensure user is able to Revert Revisions', { tag: "@regression" }, async ({ publicationHelper, revisionHelper, testSetUpData }) =>
//   {
//     // creating content
//     await publicationHelper.createPublication({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // overriding test data so that Edit test saves as Needs Review
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//     // edit publication
//     await publicationHelper.editPublication({
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

//   test('Publication-Auth-TC09 - Workbench -  Create Publication content as an "Author", and use Workbench to complete all moderation states available', { tag: "@regression" }, async ({ publicationHelper, contentModerationHelper, workBenchHelper, navigateToCreatedContentHelper, basePage, loginHelper, testSetUpData }) =>
//   {

//     // creating publication as a draft and performing mandatory field check
//     console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

//     await publicationHelper.createPublication({
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

//   test('Publication-Auth-TC10 - Create - Create Publication content as an "Author", to test external publications', { tag: "@regression" }, async ({ publicationHelper, anonymousHelper }) =>
//   {

//     // create pub with external link
//     await publicationHelper.createExternalLinkPublication();

//     // searching as anon to ensure content is not viewable as draft
//     await anonymousHelper.searchAsAnon({ edited: false });

//   });

//   test('Publication-Auth-TC11 - Edit - Edit Publication as an "Author" and ensure external publication can be edited', { tag: "@regression" }, async ({ publicationHelper, anonymousHelper }) =>
//   {

//     // create publication
//     await publicationHelper.createExternalLinkPublication();

//     // edit pub with external link
//     await publicationHelper.editExternalLinkPublication();

//     // searching as anon to ensure edited content is not viewable as draft
//     await anonymousHelper.searchAsAnon({ edited: true });

//   });

// });

// test.describe('Publication Supervisor Tests', () =>
// {
//   // Pass the fixture for Publication Authors into the beforeEach hook
//   test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
//   {
//     const testSteps = new TestSteps();
//     await testSteps.LogInfo('Test starting');
//     await testSteps.LogInfo(testInfo.title);

//     // setting the isolated data for THIS specific test run
//     testSetUpData.urlForTest.url = testSetUpData.validTestURLList.finance_url;
//     testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
//     testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;
//     testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.publication;
//     testSetUpData.contentTitleforTest.contentTitle = testData.Publication.title;
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

//     // automatically logins based on above test data for each test
//     await loginHelper.loginWithValidUser();
//   });

//   test('Publication-Super-TC01 - Create - Create Publication content as an "Supervisor", perform mandatory field check and preview content', { tag: "@regression" }, async ({ publicationHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData }) =>
//   {

//     // creating publication as a draft and performing mandatory field check
//     console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

//     await publicationHelper.createPublication({
//       preview: true,
//       mandatoryFieldCheck: false,
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

//   test('Publication-Super-TC02 - Edit - Edit Published Publication content and ensure edit is published as a "Supervisor" ', { tag: "@regression" }, async ({ publicationHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper }) =>
//   {

//     // creating content
//     await publicationHelper.createPublication({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // moderating to published
//     await contentModerationHelper.supervisorModerateContent({
//       NeedsReview: false,
//       Published: true,
//       Archive: false
//     });

//     // edit publication
//     await publicationHelper.editPublication({
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

//   test('Publication-Super-TC03 - Delete - Delete Published Publication as "Supervisor" and confirm it isnt viewable as an anon user', { tag: "@regression" }, async ({ publicationHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper }) =>
//   {

//     // creating content
//     await publicationHelper.createPublication({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // moderating to published
//     await contentModerationHelper.supervisorModerateContent({
//       NeedsReview: false,
//       Published: true,
//       Archive: false
//     });

//     // cancel delete publication
//     await publicationHelper.deletePublication({
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

//     // delete publication
//     await publicationHelper.deletePublication({
//       delete: true,
//       cancel: false
//     });

//     // confirm content deleted logged in on content page
//     await navigateToCreatedContentHelper.navigateToCreatedContent({
//       active: false,
//       deleted: true
//     });

//     // ensure publication is deleted and not viewable to anon users
//     await anonymousHelper.searchAsAnon({ edited: false });
//   });

//   test('Publication-Super-TC04 - Delete - Can delete Publication created by "Author" as an "Supervisor"', { tag: "@regression" }, async ({ publicationHelper, navigateToCreatedContentHelper, basePage, loginHelper, contentModerationHelper, anonymousHelper, testSetUpData }) =>
//   {

//     // Logging out as Before each will log in as an Author.
//     await basePage.logOut();

//     // Overriding user for test data with Author credentials
//     testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
//     testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;
//     // log back in and naviagte to content
//     await loginHelper.loginWithValidUser();

//     // Creating Publication as a Author
//     await publicationHelper.createPublication({
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

//     // delete authors publication
//     await publicationHelper.deletePublication({
//       delete: true,
//       cancel: false
//     });

//     // confirm content deleted logged in on content page
//     await navigateToCreatedContentHelper.navigateToCreatedContent({
//       active: false,
//       deleted: true
//     });
//   });

//   test('Publication-Super-TC05 - Compare Revision - Edit Publication content and ensure user is able to compare Revisions ', { tag: "@regression" }, async ({ publicationHelper, revisionHelper, testSetUpData }) =>
//   {
//     // creating content
//     await publicationHelper.createPublication({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // overriding test data so that Edit test saves as Needs Review
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//     // edit publication
//     await publicationHelper.editPublication({
//       preview: false
//     });

//     // comparing and verifying Revisions
//     await revisionHelper.compareRevisions();

//   });

//   test('Publication-Super-TC06 - Delete Revision - Edit Publication content and ensure user is able to Delete Revisions', { tag: "@regression" }, async ({ publicationHelper, revisionHelper, testSetUpData }) =>
//   {
//     // creating content
//     await publicationHelper.createPublication({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // overriding test data so that Edit test saves as Needs Review
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//     // edit publication
//     await publicationHelper.editPublication({
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

//   test('Publication-Super-TC07 - Revert Revision - Edit Publication content and ensure user is able to Revert Revisions', { tag: "@regression" }, async ({ publicationHelper, revisionHelper, testSetUpData }) =>
//   {
//     // creating content
//     await publicationHelper.createPublication({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // overriding test data so that Edit test saves as Needs Review
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//     // edit publication
//     await publicationHelper.editPublication({
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

//   test('Publication-Super-TC09 - Workbench -  Create Publication content as an "Supervisor", and use Workbench to complete all moderation states', { tag: "@regression" }, async ({ publicationHelper, contentModerationHelper, workBenchHelper, testSetUpData }) =>
//   {


//     // creating publication as a draft and performing mandatory field check
//     console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

//     await publicationHelper.createPublication({
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

//   test('Publication-Super-TC10 - Create - Create Publication content as an "Super", to test external publications', { tag: "@regression" }, async ({ publicationHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData }) =>
//   {

//     await publicationHelper.createExternalLinkPublication();

//     // moderating to published
//     await contentModerationHelper.supervisorModerateContent({
//       NeedsReview: false,
//       Published: true,
//       Archive: false
//     });

//     // overriding content type for test to pub external link due to external link needing different verification DO NOT MOVE FROM THIS POSISTION
//     testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.publicationExternalLink;

//     // verifying external link can be used by anon users - as test is overriden method will NOT perform facet filter check as tested in other tests
//     await anonymousHelper.searchAsAnon({ edited: false });

//   });

//   test('Publication-Super-TC11 - Edit - Edit Publication as an "Super" and ensure external publication can be edited', { tag: "@regression" }, async ({ publicationHelper, anonymousHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData }) =>
//   {

//     await publicationHelper.createExternalLinkPublication();

//     // edit publication
//     await publicationHelper.editExternalLinkPublication();

//     // moderating to published
//     await contentModerationHelper.supervisorModerateContent({
//       NeedsReview: false,
//       Published: true,
//       Archive: false
//     });

//     // overriding content type for test to pub external link due to external link needing different verification DO NOT MOVE FROM POSITION
//     testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.publicationExternalLink;

//     // searching as anon to ensure edited content is not viewable as draft
//     await anonymousHelper.searchAsAnon({ edited: true });
//   });

// });

// test.describe('Publication Stats Author Tests', () =>
// {
//   // Pass the fixture for Publication Authors into the beforeEach hook
//   test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
//   {
//     const testSteps = new TestSteps();
//     await testSteps.LogInfo('Test starting');
//     await testSteps.LogInfo(testInfo.title);

//     // setting the isolated data for THIS specific test run
//     testSetUpData.urlForTest.url = testSetUpData.validTestURLList.finance_url;
//     testSetUpData.userForTest.username = testSetUpData.validUserList.stats_author_username;
//     testSetUpData.userForTest.password = testSetUpData.validUserList.stats_author_password;
//     testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.publication;
//     testSetUpData.contentTitleforTest.contentTitle = testData.Publication.title;
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

//     // automatically logins based on above test data for each test
//     await loginHelper.loginWithValidUser();
//   });

//   test('Publication-Stats-Auth-TC01 - Create - Create Publication content as an "Stats Author", perform mandatory field check and preview content', { tag: "@regression" },
//     async ({ loginHelper, publicationHelper, anonymousHelper, contentModerationHelper, navigateToCreatedContentHelper }) =>
//     {
//       await publicationHelper.createPublication({
//         preview: true,
//         mandatoryFieldCheck: false,
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

//   test('Publication-Stats-Auth-TC02 - Edit - Edit Publication as an "Stats Author" and ensure it is not published', { tag: "@regression" },
//     async ({ publicationHelper, anonymousHelper }) =>
//     {
//       await publicationHelper.createPublication({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });

//       // edit publication
//       await publicationHelper.editPublication({
//         preview: true
//       });

//       // searching as anon to ensure edited content is not viewable as draft
//       await anonymousHelper.searchAsAnon({ edited: true });

//     });

//   test('Publication-Stats-Auth-TC03 - Delete - Delete Publication as an "Stats Author"', { tag: "@regression" },
//     async ({ publicationHelper, navigateToCreatedContentHelper, anonymousHelper, loginHelper }) =>
//     {
//       await publicationHelper.createPublication({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });

//       // Cancel delete publication
//       await publicationHelper.deletePublication({
//         delete: false,
//         cancel: true
//       });

//       await navigateToCreatedContentHelper.navigateToCreatedContent({
//         active: true,
//         deleted: false
//       });

//       // delete publication
//       await publicationHelper.deletePublication({
//         delete: true,
//         cancel: false
//       });

//       // confirm content deleted
//       await navigateToCreatedContentHelper.navigateToCreatedContent({
//         active: false,
//         deleted: true
//       });

//     });

//   test('Publication-Stats-Auth-TC04 - Delete - Cannot delete Publication created by "Supervisor" as an "Stats Author"', { tag: "@regression" },
//     async ({ publicationHelper, navigateToCreatedContentHelper, basePage, loginHelper, contentModerationHelper, anonymousHelper, page, testSetUpData, testData }) =>
//     {
//       const permissionCheck = new ModerationSideBar(page, testSetUpData, testData);

//       // Logging out as Before each will log in as an Author.
//       await basePage.logOut();

//       // Overriding user for test data with supervisor credentials
//       testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
//       testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;
//       // log back in and naviagte to content
//       await loginHelper.loginWithValidUser();

//       // Creating Publication as a Supervisor
//       await publicationHelper.createPublication({
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

//       // Overriding user for test data with Stats Author credentials
//       testSetUpData.userForTest.username = testSetUpData.validUserList.stats_author_username;
//       testSetUpData.userForTest.password = testSetUpData.validUserList.stats_author_password;

//       // log back in and naviagte to content
//       await loginHelper.loginWithValidUser();

//       // Navigating to Supervisors created content
//       await navigateToCreatedContentHelper.navigateToCreatedContent({
//         active: true,
//         deleted: false
//       });

//       await permissionCheck.openModerationSideBar();
//       await permissionCheck.deleteButtonNotVisible();

//       // searching as anon to ensure content is viewable as Stats Author has not been able to delete
//       await anonymousHelper.searchAsAnon({ edited: false });
//     });

//   test('Publication-Stats-Auth-TC05 - Compare Revision - Edit Publication content and ensure user is able to compare Revisions ', { tag: "@regression" }, async ({ publicationHelper, revisionHelper, testSetUpData }) =>
//   {
//     // creating content
//     await publicationHelper.createPublication({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // overriding test data so that Edit test saves as Needs Review
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//     // edit publication
//     await publicationHelper.editPublication({
//       preview: false
//     });

//     // comparing and verifying Revisions
//     await revisionHelper.compareRevisions();
//   });

//   test('Publication-Stats-Auth-TC06 - Delete Revision - Edit Publication content and ensure user is able to Delete Revisions', { tag: "@regression" }, async ({ publicationHelper, revisionHelper, testSetUpData }) =>
//   {
//     // creating content
//     await publicationHelper.createPublication({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // overriding test data so that Edit test saves as Needs Review
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//     // edit publication
//     await publicationHelper.editPublication({
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

//   test('Publication-Stats-Auth-TC07 - Revert Revision - Edit Publication content and ensure user is able to Revert Revisions', { tag: "@regression" }, async ({ publicationHelper, revisionHelper, testSetUpData }) =>
//   {
//     // creating content
//     await publicationHelper.createPublication({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // overriding test data so that Edit test saves as Needs Review
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//     // edit publication
//     await publicationHelper.editPublication({
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

//   test('Publication-Stats-Auth-TC09 - Workbench -  Create Publication content as an "Stats Author", and use Workbench to complete all moderation states available', { tag: "@regression" }, async ({ publicationHelper, contentModerationHelper, workBenchHelper, navigateToCreatedContentHelper, basePage, loginHelper, testSetUpData }) =>
//   {

//     // creating publication as a draft and performing mandatory field check
//     console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

//     await publicationHelper.createPublication({
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

//     // Overriding user for test data with stats author credentials
//     testSetUpData.userForTest.username = testSetUpData.validUserList.stats_author_username;
//     testSetUpData.userForTest.password = testSetUpData.validUserList.stats_author_password;
//     // log back in and naviagte to content
//     await loginHelper.loginWithValidUser();

//     await workBenchHelper.authorWorkBench({
//       draft: false,
//       needsReview: false,
//       archived: true
//     });
//   });

//   test('Publication-Stats-Auth-TC10 - Create - Create Publication content as an "Stats Author", to test external publications', { tag: "@regression" }, async ({ publicationHelper, anonymousHelper }) =>
//   {

//     // create pub with external link
//     await publicationHelper.createExternalLinkPublication();

//     // searching as anon to ensure content is not viewable as draft
//     await anonymousHelper.searchAsAnon({ edited: false });

//   });

//   test('Publication-Stats-Auth-TC11 - Edit - Edit Publication as an "Stats Author" and ensure external publication can be edited', { tag: "@regression" }, async ({ publicationHelper, anonymousHelper }) =>
//   {

//     // create publication
//     await publicationHelper.createExternalLinkPublication();

//     // edit pub with external link
//     await publicationHelper.editExternalLinkPublication();

//     // searching as anon to ensure edited content is not viewable as draft
//     await anonymousHelper.searchAsAnon({ edited: true });

//   });

// });

// test.describe('Publication Stats Supervisor Tests', () =>
// {
//   // Pass the fixture for Publication Authors into the beforeEach hook
//   test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
//   {
//     const testSteps = new TestSteps();
//     await testSteps.LogInfo('Test starting');
//     await testSteps.LogInfo(testInfo.title);

//     // setting the isolated data for THIS specific test run
//     testSetUpData.urlForTest.url = testSetUpData.validTestURLList.finance_url;
//     testSetUpData.userForTest.username = testSetUpData.validUserList.stats_supervisor_username;
//     testSetUpData.userForTest.password = testSetUpData.validUserList.stats_supervisor_password;
//     testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.publication;
//     testSetUpData.contentTitleforTest.contentTitle = testData.Publication.title;
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

//     // automatically logins based on above test data for each test
//     await loginHelper.loginWithValidUser();
//   });

//   test('Publication-Stats-Super-TC01 - Create - Create Publication content as an "Stats Supervisor", perform mandatory field check and preview content', { tag: "@regression" }, async ({ publicationHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData }) =>
//   {

//     // creating publication as a draft and performing mandatory field check
//     console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

//     await publicationHelper.createPublication({
//       preview: true,
//       mandatoryFieldCheck: false,
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
//     await contentModerationHelper.statsSupervisorModerateContent({
//       QuickPublish: false,
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
//     await contentModerationHelper.statsSupervisorModerateContent({
//       QuickPublish: false,
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
//     await contentModerationHelper.statsSupervisorModerateContent({
//       QuickPublish: false,
//       NeedsReview: false,
//       Published: false,
//       Archive: true
//     });

//     // searching as anon to ensure content is not viewable as it is archived
//     await anonymousHelper.searchAsAnon({ edited: false });
//   });

//   test('Publication-Stats-Super-TC02 - Edit - Edit Published Publication content and ensure edit is published as a "Stats Supervisor" ', { tag: "@regression" }, async ({ publicationHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper }) =>
//   {

//     // creating content
//     await publicationHelper.createPublication({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // moderating to published
//     await contentModerationHelper.statsSupervisorModerateContent({
//       QuickPublish: false,
//       NeedsReview: false,
//       Published: true,
//       Archive: false
//     });

//     // edit publication
//     await publicationHelper.editPublication({
//       preview: true
//     });

//     // moderating edited content to published
//     await contentModerationHelper.statsSupervisorModerateContent({
//       QuickPublish: false,
//       NeedsReview: false,
//       Published: true,
//       Archive: false
//     });

//     // ensure edit is publish published set to true
//     await anonymousHelper.searchAsAnon({ edited: true });
//   });

//   test('Publication-Stats-Super-TC03 - Delete - Delete Published Publication as "Stats Supervisor" and confirm it isnt viewable as an anon user', { tag: "@regression" }, async ({ publicationHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper }) =>
//   {

//     // creating content
//     await publicationHelper.createPublication({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // moderating to published
//     await contentModerationHelper.statsSupervisorModerateContent({
//       QuickPublish: false,
//       NeedsReview: false,
//       Published: true,
//       Archive: false
//     });

//     // cancel delete publication
//     await publicationHelper.deletePublication({
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

//     // delete publication
//     await publicationHelper.deletePublication({
//       delete: true,
//       cancel: false
//     });

//     // confirm content deleted logged in on content page
//     await navigateToCreatedContentHelper.navigateToCreatedContent({
//       active: false,
//       deleted: true
//     });

//     // ensure publication is deleted and not viewable to anon users
//     await anonymousHelper.searchAsAnon({ edited: false });
//   });

//   test('Publication-Stats-Super-TC04 - Delete - Can delete Publication created by "Author" as an "Stats Supervisor"', { tag: "@regression" }, async ({ publicationHelper, navigateToCreatedContentHelper, basePage, loginHelper, contentModerationHelper, anonymousHelper, testSetUpData }) =>
//   {

//     // Logging out as Before each will log in as an Author.
//     await basePage.logOut();

//     // Overriding user for test data with Author credentials
//     testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
//     testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;
//     // log back in and naviagte to content
//     await loginHelper.loginWithValidUser();

//     // Creating Publication as a Author
//     await publicationHelper.createPublication({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // moderating to Published
//     await contentModerationHelper.authorModerateContent({
//       NeedsReview: false
//     });

//     // searching as anon to ensure content is not viewable when is a Needs Review state
//     await anonymousHelper.searchAsAnon({ edited: false });

//     // Overriding user for test data with Stats Supervisor credentials
//     testSetUpData.userForTest.username = testSetUpData.validUserList.stats_supervisor_username;
//     testSetUpData.userForTest.password = testSetUpData.validUserList.stats_supervisor_password;

//     // log back in and naviagte to content
//     await loginHelper.loginWithValidUser();

//     // Navigating to Authors created content
//     await navigateToCreatedContentHelper.navigateToCreatedContent({
//       active: true,
//       deleted: false
//     });

//     // delete authors publication
//     await publicationHelper.deletePublication({
//       delete: true,
//       cancel: false
//     });

//     // confirm content deleted logged in on content page
//     await navigateToCreatedContentHelper.navigateToCreatedContent({
//       active: false,
//       deleted: true
//     });
//   });

//   test('Publication-Stats-Super-TC05 - Compare Revision - Edit Publication content and ensure user is able to compare Revisions ', { tag: "@regression" }, async ({ publicationHelper, revisionHelper, testSetUpData }) =>
//   {
//     // creating content
//     await publicationHelper.createPublication({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // overriding test data so that Edit test saves as Needs Review
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//     // edit publication
//     await publicationHelper.editPublication({
//       preview: false
//     });

//     // comparing and verifying Revisions
//     await revisionHelper.compareRevisions();

//   });

//   test('Publication-Stats-Super-TC06 - Delete Revision - Edit Publication content and ensure user is able to Delete Revisions', { tag: "@regression" }, async ({ publicationHelper, revisionHelper, testSetUpData }) =>
//   {
//     // creating content
//     await publicationHelper.createPublication({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // overriding test data so that Edit test saves as Needs Review
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//     // edit publication
//     await publicationHelper.editPublication({
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

//   test('Publication-Stats-Super-TC07 - Revert Revision - Edit Publication content and ensure user is able to Revert Revisions', { tag: "@regression" }, async ({ publicationHelper, revisionHelper, testSetUpData }) =>
//   {
//     // creating content
//     await publicationHelper.createPublication({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // overriding test data so that Edit test saves as Needs Review
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//     // edit publication
//     await publicationHelper.editPublication({
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

//   test('Publication-Stats-Super-TC09 - Workbench -  Create Publication content as an "Stats Supervisor", and use Workbench to complete all moderation states', { tag: "@regression" }, async ({ publicationHelper, contentModerationHelper, workBenchHelper, testSetUpData }) =>
//   {


//     // creating publication as a draft and performing mandatory field check
//     console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

//     await publicationHelper.createPublication({
//       preview: false,
//       mandatoryFieldCheck: false
//     });

//     await workBenchHelper.supervisorWorkBench({
//       draft: true,
//       needsReview: false,
//       archived: false
//     });

//     // moderating to needs review
//     await contentModerationHelper.statsSupervisorModerateContent({
//       QuickPublish: false,
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
//     await contentModerationHelper.statsSupervisorModerateContent({
//       QuickPublish: false,
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

//   test('Publication-Stats-Super-TC10 - Create - Create Publication content as an "Stats Supervisor", to test external publications', { tag: "@regression" }, async ({ publicationHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData }) =>
//   {

//     await publicationHelper.createExternalLinkPublication();

//     // moderating to published
//     await contentModerationHelper.statsSupervisorModerateContent({
//       QuickPublish: false,
//       NeedsReview: false,
//       Published: true,
//       Archive: false
//     });

//     // overriding content type for test to pub external link due to external link needing different verification DO NOT MOVE FROM THIS POSISTION
//     testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.publicationExternalLink;

//     // verifying external link can be used by anon users - as test is overriden method will NOT perform facet filter check as tested in other tests
//     await anonymousHelper.searchAsAnon({ edited: false });

//   });

//   test('Publication-Stats-Super-TC11 - Edit - Edit Publication as an "Stats Supervisor" and ensure external publication can be edited', { tag: "@regression" }, async ({ publicationHelper, anonymousHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData }) =>
//   {

//     await publicationHelper.createExternalLinkPublication();

//     // edit publication
//     await publicationHelper.editExternalLinkPublication();

//     // moderating to published
//     await contentModerationHelper.statsSupervisorModerateContent({
//       QuickPublish: false,
//       NeedsReview: false,
//       Published: true,
//       Archive: false
//     });

//     // overriding content type for test to pub external link due to external link needing different verification DO NOT MOVE FROM POSITION
//     testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.publicationExternalLink;

//     // searching as anon to ensure edited content is not viewable as draft
//     await anonymousHelper.searchAsAnon({ edited: true });
//   });

// });