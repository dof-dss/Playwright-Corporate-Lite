// import { TestSteps } from '@poms/base-pages/TestSteps';
// import { test } from '@fixtures/MyFixtures';
// import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';

// test.describe('Consultation Author Tests', () =>
// {
//   // Pass the fixture for Consultation Authors into the beforeEach hook
//   test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
//   {
//     const testSteps = new TestSteps();
//     await testSteps.LogInfo('Test starting');
//     await testSteps.LogInfo(testInfo.title);

//     // setting the isolated data for THIS specific test run
//     testSetUpData.urlForTest.url = testSetUpData.validTestURLList.economy_url;
//     testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
//     testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;
//     testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.consultation;
//     testSetUpData.contentTitleforTest.contentTitle = testData.Consultation.title;
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

//     // automatically logins based on above test data for each test
//     await loginHelper.loginWithValidUser();
//   });

//   test('Consultation-Auth-TC01 - Create - Create Consultation content as an "Author", perform mandatory field check and preview content', { tag: "@regression" },
//     async ({ loginHelper, consultationHelper, anonymousHelper, contentModerationHelper, navigateToCreatedContentHelper }) =>
//     {
//       await consultationHelper.createConsultation({
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

//   test('Consultation-Auth-TC02 - Edit - Edit Consultation as an "Author" and ensure it is not published', { tag: "@regression" },
//     async ({ consultationHelper, anonymousHelper }) =>
//     {
//       await consultationHelper.createConsultation({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });

//       // edit consultation
//       await consultationHelper.editConsultation({
//         preview: true
//       });

//       // searching as anon to ensure edited content is not viewable as draft
//       await anonymousHelper.searchAsAnon({ edited: true });

//     });

//   test('Consultation-Auth-TC03 - Delete - Delete Consultation as an "Author"', { tag: "@regression" },
//     async ({ consultationHelper, navigateToCreatedContentHelper, anonymousHelper, loginHelper }) =>
//     {
//       await consultationHelper.createConsultation({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });

//       // Cancel delete consultation
//       await consultationHelper.deleteConsultation({
//         delete: false,
//         cancel: true
//       });

//       await navigateToCreatedContentHelper.navigateToCreatedContent({
//         active: true,
//         deleted: false
//       });

//       // delete consultation
//       await consultationHelper.deleteConsultation({
//         delete: true,
//         cancel: false
//       });

//       // confirm content deleted
//       await navigateToCreatedContentHelper.navigateToCreatedContent({
//         active: false,
//         deleted: true
//       });

//     });

//   test('Consultation-Auth-TC04 - Delete - Cannot delete Consultation created by "Supervisor" as an "Author"', { tag: "@regression" },
//     async ({ consultationHelper, navigateToCreatedContentHelper, basePage, loginHelper, contentModerationHelper, anonymousHelper, page, testSetUpData, testData }) =>
//     {
//       const permissionCheck = new ModerationSideBar(page, testSetUpData, testData);

//       // Logging out as Before each will log in as an Author.
//       await basePage.logOut();

//       // Overriding user for test data with supervisor credentials
//       testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
//       testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;
//       // log back in and naviagte to content
//       await loginHelper.loginWithValidUser();

//       // Creating Consultation as a Supervisor
//       await consultationHelper.createConsultation({
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

//   test('Consultation-Auth-TC05 - Compare Revision - Edit Consultation content and ensure user is able to compare Revisions ', { tag: "@regression" }, async ({ consultationHelper, revisionHelper, testSetUpData }) =>
//   {
//     // creating content
//     await consultationHelper.createConsultation({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // overriding test data so that Edit test saves as Needs Review
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//     // edit consultation
//     await consultationHelper.editConsultation({
//       preview: false
//     });

//     // comparing and verifying Revisions
//     await revisionHelper.compareRevisions();
//   });

//   test('Consultation-Auth-TC06 - Delete Revision - Edit Consultation content and ensure user is able to Delete Revisions', { tag: "@regression" }, async ({ consultationHelper, revisionHelper, testSetUpData }) =>
//   {
//     // creating content
//     await consultationHelper.createConsultation({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // overriding test data so that Edit test saves as Needs Review
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//     // edit consultation
//     await consultationHelper.editConsultation({
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

//   test('Consultation-Auth-TC07 - Revert Revision - Edit Consultation content and ensure user is able to Revert Revisions', { tag: "@regression" }, async ({ consultationHelper, revisionHelper, testSetUpData }) =>
//   {
//     // creating content
//     await consultationHelper.createConsultation({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // overriding test data so that Edit test saves as Needs Review
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//     // edit consultation
//     await consultationHelper.editConsultation({
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

//   test('Consultation-Auth-TC09 - Workbench -  Create Consultation content as an "Author", and use Workbench to complete all moderation states available', { tag: "@regression" }, async ({ consultationHelper, contentModerationHelper, workBenchHelper, navigateToCreatedContentHelper, basePage, loginHelper, testSetUpData }) =>
//   {
//     // creating consultation as a draft and performing mandatory field check
//     console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

//     await consultationHelper.createConsultation({
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

//   test('Consultation-Auth-TC10 - Create - Create Consultation as an "Author" and ensure Future Start date is displayed', { tag: "@regression" }, async ({ consultationHelper, anonymousHelper }) =>
//   {
//     await consultationHelper.createFutureConsultation({
//       preview: true,
//       mandatoryFieldCheck: false
//     });

//     // searching as anon to ensure edited content is not viewable as draft
//     await anonymousHelper.searchAsAnon({ edited: true });
//   });

// });

// test.describe('Consultation Supervisor Tests', () =>
// {
//   // Pass the fixture for Consultation Authors into the beforeEach hook
//   test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
//   {
//     const testSteps = new TestSteps();
//     await testSteps.LogInfo('Test starting');
//     await testSteps.LogInfo(testInfo.title);

//     // setting the isolated data for THIS specific test run
//     testSetUpData.urlForTest.url = testSetUpData.validTestURLList.economy_url;
//     testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
//     testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;
//     testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.consultation;
//     testSetUpData.contentTitleforTest.contentTitle = testData.Consultation.title;
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

//     // automatically logins based on above test data for each test
//     await loginHelper.loginWithValidUser();
//   });

//   test('Consultation-Super-TC01 - Create - Create Consultation content as an "Supervisor", perform mandatory field check and preview content', { tag: "@regression" }, async ({ consultationHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData }) =>
//   {
//     // creating consultation as a draft and performing mandatory field check
//     console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');
//     await consultationHelper.createConsultation({
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

//   test('Consultation-Super-TC02 - Edit - Edit Published Consultation content and ensure edit is published as a "Supervisor" ', { tag: "@regression" }, async ({ consultationHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper }) =>
//   {
//     // creating content
//     await consultationHelper.createConsultation({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // moderating to published
//     await contentModerationHelper.supervisorModerateContent({
//       NeedsReview: false,
//       Published: true,
//       Archive: false
//     });

//     // edit consultation
//     await consultationHelper.editConsultation({
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

//   test('Consultation-Super-TC03 - Delete - Delete Published Consultation as "Supervisor" and confirm it isnt viewable as an anon user', { tag: "@regression" }, async ({ consultationHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper }) =>
//   {
//     // creating content
//     await consultationHelper.createConsultation({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // moderating to published
//     await contentModerationHelper.supervisorModerateContent({
//       NeedsReview: false,
//       Published: true,
//       Archive: false
//     });

//     // cancel delete consultation
//     await consultationHelper.deleteConsultation({
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

//     // delete consultation
//     await consultationHelper.deleteConsultation({
//       delete: true,
//       cancel: false
//     });

//     // confirm content deleted logged in on content page
//     await navigateToCreatedContentHelper.navigateToCreatedContent({
//       active: false,
//       deleted: true
//     });

//     // ensure consultation is deleted and not viewable to anon users
//     await anonymousHelper.searchAsAnon({ edited: false });
//   });

//   test('Consultation-Super-TC04 - Delete - Can delete Consultation created by "Author" as an "Supervisor"', { tag: "@regression" }, async ({ consultationHelper, navigateToCreatedContentHelper, basePage, loginHelper, contentModerationHelper, anonymousHelper, testSetUpData }) =>
//   {
//     // Logging out as Before each will log in as an Author.
//     await basePage.logOut();

//     // Overriding user for test data with Author credentials
//     testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
//     testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;
//     // log back in and naviagte to content
//     await loginHelper.loginWithValidUser();

//     // Creating Consultation as a Author
//     await consultationHelper.createConsultation({
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

//     // delete authors consultation
//     await consultationHelper.deleteConsultation({
//       delete: true,
//       cancel: false
//     });

//     // confirm content deleted logged in on content page
//     await navigateToCreatedContentHelper.navigateToCreatedContent({
//       active: false,
//       deleted: true
//     });
//   });

//   test('Consultation-Super-TC05 - Compare Revision - Edit Consultation content and ensure user is able to compare Revisions ', { tag: "@regression" }, async ({ consultationHelper, revisionHelper, testSetUpData }) =>
//   {
//     // creating content
//     await consultationHelper.createConsultation({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // overriding test data so that Edit test saves as Needs Review
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//     // edit consultation
//     await consultationHelper.editConsultation({
//       preview: false
//     });

//     // comparing and verifying Revisions
//     await revisionHelper.compareRevisions();

//   });

//   test('Consultation-Super-TC06 - Delete Revision - Edit Consultation content and ensure user is able to Delete Revisions', { tag: "@regression" }, async ({ consultationHelper, revisionHelper, testSetUpData }) =>
//   {
//     // creating content
//     await consultationHelper.createConsultation({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // overriding test data so that Edit test saves as Needs Review
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//     // edit consultation
//     await consultationHelper.editConsultation({
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

//   test('Consultation-Super-TC07 - Revert Revision - Edit Consultation content and ensure user is able to Revert Revisions', { tag: "@regression" }, async ({ consultationHelper, revisionHelper, testSetUpData }) =>
//   {
//     // creating content
//     await consultationHelper.createConsultation({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // overriding test data so that Edit test saves as Needs Review
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//     // edit consultation
//     await consultationHelper.editConsultation({
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

//   test('Consultation-Super-TC09 - Workbench -  Create Consultation content as an "Supervisor", and use Workbench to complete all moderation states', { tag: "@regression" }, async ({ consultationHelper, contentModerationHelper, workBenchHelper, testSetUpData }) =>
//   {
//     // creating consultation as a draft and performing mandatory field check
//     console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

//     await consultationHelper.createConsultation({
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

//   test('Consultation-Super-TC10 - Create - Create Consultation as an "Supervisor" and ensure Future Start date is displayed', { tag: "@regression" }, async ({ consultationHelper, anonymousHelper, contentModerationHelper, testSetUpData }) =>
//   {
//     await consultationHelper.createFutureConsultation({
//       preview: true,
//       mandatoryFieldCheck: false
//     });

//     // moderating to needs review
//     await contentModerationHelper.supervisorModerateContent({
//       NeedsReview: false,
//       Published: true,
//       Archive: false
//     });

//     // overriding content type for test to consultation Future Date due to consultation future date needing different verification DO NOT MOVE FROM POSITION
//     testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.consultationFutureDate;

//     // searching as anon to ensure edited content is not viewable as draft
//     await anonymousHelper.searchAsAnon({ edited: false });
//   });
// });