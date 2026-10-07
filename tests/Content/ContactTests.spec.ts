// import { TestSteps } from '@poms/base-pages/TestSteps';
// import { test } from '@fixtures/MyFixtures';
// import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';

// test.describe('Contact Author Tests', () =>
// {
//   // Pass the fixture for Contact Authors into the beforeEach hook
//   test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
//   {
//     const testSteps = new TestSteps();
//     await testSteps.LogInfo('Test starting');
//     await testSteps.LogInfo(testInfo.title);

//     // setting the isolated data for THIS specific test run
//     testSetUpData.urlForTest.url = testSetUpData.validTestURLList.executive_office_url;
//     testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
//     testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;
//     testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.contact;
//     testSetUpData.contentTitleforTest.contentTitle = testData.Contact.title;
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

//     // automatically logins based on above test data for each test
//     await loginHelper.loginWithValidUser();
//   });

//   test('APP-Auth-TC01 - Create - Create Contact content as an "Author", perform mandatory field check and preview content', { tag: "@regression" },
//     async ({ loginHelper, contactHelper, anonymousHelper, contentModerationHelper, navigateToCreatedContentHelper }) =>
//     {
//       await contactHelper.createContact({
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

//   test('APP-Auth-TC02 - Edit - Edit Contact as an "Author" and ensure it is not published', { tag: "@regression" },
//     async ({ contactHelper, anonymousHelper }) =>
//     {
//       await contactHelper.createContact({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });

//       // edit contact
//       await contactHelper.editContact({
//         preview: true
//       });

//       // searching as anon to ensure edited content is not viewable as draft
//       await anonymousHelper.searchAsAnon({ edited: true });

//     });

//   test('APP-Auth-TC03 - Delete - Delete Contact as an "Author"', { tag: "@regression" }, async ({ contactHelper, navigateToCreatedContentHelper }) =>
//   {
//     await contactHelper.createContact({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // Cancel delete contact
//     await contactHelper.deleteContact({
//       delete: false,
//       cancel: true
//     });

//     await navigateToCreatedContentHelper.navigateToCreatedContent({
//       active: true,
//       deleted: false
//     });

//     // delete contact
//     await contactHelper.deleteContact({
//       delete: true,
//       cancel: false
//     });

//     // confirm content deleted
//     await navigateToCreatedContentHelper.navigateToCreatedContent({
//       active: false,
//       deleted: true
//     });

//   });

//   test('APP-Auth-TC04 - Delete - Cannot delete Contact created by "Supervisor" as an "Author"', { tag: "@regression" }, async ({ page, testSetUpData, testData, contactHelper, navigateToCreatedContentHelper, basePage, loginHelper, contentModerationHelper, anonymousHelper }) =>
//   {
//     const permissionCheck = new ModerationSideBar(page, testSetUpData, testData);

//     // Logging out as Before each will log in as an Author.
//     await basePage.logOut();

//     // Overriding user for test data with supervisor credentials
//     testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
//     testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;
//     // log back in and naviagte to content
//     await loginHelper.loginWithValidUser();

//     // Creating Contact as a Supervisor
//     await contactHelper.createContact({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // moderating to Published
//     await contentModerationHelper.supervisorModerateContent({
//       NeedsReview: false,
//       Published: true,
//       Archive: false
//     });

//     // searching as anon to ensure content is viewable when published
//     await anonymousHelper.searchAsAnon({ edited: false });

//     // Overriding user for test data with Author credentials
//     testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
//     testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;

//     // log back in and naviagte to content
//     await loginHelper.loginWithValidUser();

//     // Navigating to Supervisors created content
//     await navigateToCreatedContentHelper.navigateToCreatedContent({
//       active: true,
//       deleted: false
//     });

//     await permissionCheck.openModerationSideBar();
//     await permissionCheck.deleteButtonNotVisible();

//     // searching as anon to ensure content is viewable as Author has not been able to delete
//     await anonymousHelper.searchAsAnon({ edited: false });
//   });

//   test('APP-Auth-TC05 - Compare Revision - Edit Contact content and ensure user is able to compare Revisions ', { tag: "@regression" }, async ({ contactHelper, revisionHelper, testSetUpData }) =>
//   {
//     // creating content
//     await contactHelper.createContact({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // overriding test data so that Edit test saves as Needs Review
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//     // edit contact
//     await contactHelper.editContact({
//       preview: false
//     });

//     // comparing and verifying Revisions
//     await revisionHelper.compareRevisions();
//   });

//   test('APP-Auth-TC06 - Delete Revision - Edit Contact content and ensure user is able to Delete Revisions', { tag: "@regression" }, async ({ contactHelper, revisionHelper, testSetUpData }) =>
//   {
//     // creating content
//     await contactHelper.createContact({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // overriding test data so that Edit test saves as Needs Review
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//     // edit contact
//     await contactHelper.editContact({
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

//   test('APP-Auth-TC07 - Revert Revision - Edit Contact content and ensure user is able to Revert Revisions', { tag: "@regression" }, async ({ contactHelper, revisionHelper, testSetUpData }) =>
//   {
//     // creating content
//     await contactHelper.createContact({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // overriding test data so that Edit test saves as Needs Review
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//     // edit contact
//     await contactHelper.editContact({
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

//   test('APP-Auth-TC09 - Workbench -  Create Contact content as an "Author", and use Workbench to complete all moderation states available', { tag: "@regression" }, async ({ contactHelper, contentModerationHelper, workBenchHelper, navigateToCreatedContentHelper, basePage, loginHelper, testSetUpData }) =>
//   {
//     // creating contact as a draft and performing mandatory field check
//     console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

//     await contactHelper.createContact({
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

// test.describe('Contact Supervisor Tests', () =>
// {
//   // Pass the fixture for Contact Authors into the beforeEach hook
//   test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
//   {
//     const testSteps = new TestSteps();
//     await testSteps.LogInfo('Test starting');
//     await testSteps.LogInfo(testInfo.title);

//     // setting the isolated data for THIS specific test run
//     testSetUpData.urlForTest.url = testSetUpData.validTestURLList.executive_office_url;
//     testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
//     testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;
//     testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.contact;
//     testSetUpData.contentTitleforTest.contentTitle = testData.Contact.title;
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

//     // automatically logins based on above test data for each test
//     await loginHelper.loginWithValidUser();
//   });

//   test('APP-Super-TC01 - Create - Create Contact content as an "Supervisor", perform mandatory field check and preview content', { tag: "@regression" }, async ({ contactHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData }) =>
//   {
//     // creating contact as a draft and performing mandatory field check
//     console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

//     await contactHelper.createContact({
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

//     // searching as anon to ensure content is viewable as it is published
//     await anonymousHelper.searchAsAnon({ edited: false });

//   });

//   test('APP-Super-TC02 - Edit - Edit Published Contact content and ensure edit is published as a "Supervisor" ', { tag: "@regression" }, async ({ contactHelper, anonymousHelper, contentModerationHelper }) =>
//   {
//     // creating content
//     await contactHelper.createContact({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // moderating to published
//     await contentModerationHelper.supervisorModerateContent({
//       NeedsReview: false,
//       Published: true,
//       Archive: false
//     });

//     // edit contact
//     await contactHelper.editContact({
//       preview: true
//     });

//     // moderating edited content to published
//     await contentModerationHelper.supervisorModerateContent({
//       NeedsReview: false,
//       Published: true,
//       Archive: false
//     });

//     // ensure edit does not publish published set to true
//     await anonymousHelper.searchAsAnon({ edited: true });
//   });

//   test('APP-Super-TC03 - Delete - Delete Published Contact as "Supervisor" and confirm it isnt viewable as an anon user', { tag: "@regression" }, async ({ contactHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper }) =>
//   {
//     // creating content
//     await contactHelper.createContact({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // moderating to published
//     await contentModerationHelper.supervisorModerateContent({
//       NeedsReview: false,
//       Published: true,
//       Archive: false
//     });

//     // cancel delete contact
//     await contactHelper.deleteContact({
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

//     // delete contact
//     await contactHelper.deleteContact({
//       delete: true,
//       cancel: false
//     });

//     // confirm content deleted logged in on content page
//     await navigateToCreatedContentHelper.navigateToCreatedContent({
//       active: false,
//       deleted: true
//     });

//     // ensure contact is deleted and not viewable to anon users
//     await anonymousHelper.searchAsAnon({ edited: false });
//   });

//   test('APP-Super-TC04 - Delete - Can delete Contact created by "Author" as an "Supervisor"', { tag: "@regression" }, async ({ contactHelper, navigateToCreatedContentHelper, basePage, loginHelper, contentModerationHelper, anonymousHelper, testSetUpData }) =>
//   {
//     // Logging out as Before each will log in as an Author.
//     await basePage.logOut();

//     // Overriding user for test data with Author credentials
//     testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
//     testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;
//     // log back in and naviagte to content
//     await loginHelper.loginWithValidUser();

//     // Creating Contact as a Author
//     await contactHelper.createContact({
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

//     // delete authors contact
//     await contactHelper.deleteContact({
//       delete: true,
//       cancel: false
//     });

//     // confirm content deleted logged in on content page
//     await navigateToCreatedContentHelper.navigateToCreatedContent({
//       active: false,
//       deleted: true
//     });
//   });

//   test('APP-Super-TC05 - Compare Revision - Edit Contact content and ensure user is able to compare Revisions ', { tag: "@regression" }, async ({ contactHelper, revisionHelper, testSetUpData }) =>
//   {
//     // creating content
//     await contactHelper.createContact({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // overriding test data so that Edit test saves as Needs Review
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//     // edit contact
//     await contactHelper.editContact({
//       preview: false
//     });

//     // comparing and verifying Revisions
//     await revisionHelper.compareRevisions();

//   });

//   test('APP-Super-TC06 - Delete Revision - Edit Contact content and ensure user is able to Delete Revisions', { tag: "@regression" }, async ({ contactHelper, revisionHelper, testSetUpData }) =>
//   {
//     // creating content
//     await contactHelper.createContact({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // overriding test data so that Edit test saves as Needs Review
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//     // edit contact
//     await contactHelper.editContact({
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

//   test('APP-Super-TC07 - Revert Revision - Edit Contact content and ensure user is able to Revert Revisions', { tag: "@regression" }, async ({ contactHelper, revisionHelper, testSetUpData }) =>
//   {
//     // creating content
//     await contactHelper.createContact({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // overriding test data so that Edit test saves as Needs Review
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//     // edit contact
//     await contactHelper.editContact({
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

//   test('APP-Super-TC09 - Workbench -  Create Contact content as an "Supervisor", and use Workbench to complete all moderation states', { tag: "@regression" }, async ({ contactHelper, contentModerationHelper, workBenchHelper, testSetUpData }) =>
//   {
//     // creating contact as a draft and performing mandatory field check
//     console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

//     await contactHelper.createContact({
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