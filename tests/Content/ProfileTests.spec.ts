// import { TestSteps } from '@poms/base-pages/TestSteps';
// import { test } from '@fixtures/MyFixtures';
// import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';

// test.describe('Profile Author Tests', () =>
// {
//   test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
//   {
//     const testSteps = new TestSteps();
//     await testSteps.LogInfo('Test starting');
//     await testSteps.LogInfo(testInfo.title);

//     testSetUpData.urlForTest.url = testSetUpData.validTestURLList.dfi_url;
//     testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
//     testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;
//     testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.profile;
//     testSetUpData.contentTitleforTest.contentTitle = testData.Profile.title;
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

//     await loginHelper.loginWithValidUser();
//   });

//   test('PRF-Auth-TC01 - Create - Create Profile content as an "Author", perform mandatory field check and preview content', { tag: "@regression" },
//     async ({ loginHelper, profileHelper, anonymousHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData, testData }) =>
//     {
//       await profileHelper.createProfile({
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

//   test('PRF-Auth-TC02 - Edit - Edit Profile as an "Author" and ensure it is not published', { tag: '@regression' },
//     async ({ profileHelper, anonymousHelper }) =>
//     {
//       await profileHelper.createProfile({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });

//       await profileHelper.editProfile({
//         preview: true,
//       });

//       await anonymousHelper.searchAsAnon({ edited: true });
//     });

//   test('PRF-Auth-TC03 - Delete - Delete Profile as an "Author"', { tag: '@regression' }, async ({ profileHelper, navigateToCreatedContentHelper }) =>
//   {
//     await profileHelper.createProfile({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     await profileHelper.deleteProfile({
//       delete: false,
//       cancel: true
//     });

//     await navigateToCreatedContentHelper.navigateToCreatedContent({
//       active: true,
//       deleted: false
//     });

//     await profileHelper.deleteProfile({
//       delete: true,
//       cancel: false
//     });

//     await navigateToCreatedContentHelper.navigateToCreatedContent({
//       active: false,
//       deleted: true
//     });
//   });

//   test('PRF-Auth-TC04 - Delete - Cannot delete Profile created by "Supervisor" as an "Author"', { tag: '@regression' }, async ({ page, testSetUpData, testData, profileHelper, navigateToCreatedContentHelper, basePage, loginHelper, contentModerationHelper, anonymousHelper }) =>
//   {
//     const permissionCheck = new ModerationSideBar(page, testSetUpData, testData);

//     // Logging out as Before each will log in as an Author.
//     await basePage.logOut();

//     // Overriding user for test data with supervisor credentials
//     testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
//     testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;
//     await loginHelper.loginWithValidUser();

//     // Creating Profile as a Supervisor
//     await profileHelper.createProfile({
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
//     await loginHelper.loginWithValidUser();

//     // Navigating to Supervisors created content
//     await navigateToCreatedContentHelper.navigateToCreatedContent({
//       active: true,
//       deleted: false
//     });

//     await permissionCheck.openModerationSideBar();
//     await permissionCheck.deleteButtonNotVisible();

//     // searching as anon to ensure content is viewable as Author has not been able to delete
//     await anonymousHelper.searchAsAnon({
//       edited: false
//     });
//   });

//   test('PRF-Auth-TC05 - Compare Revision - Edit Profile content and ensure user is able to compare Revisions', { tag: "@regression" },
//     async ({ profileHelper, revisionHelper, testSetUpData }) =>
//     {
//       await profileHelper.createProfile({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });

//       testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//       await profileHelper.editProfile({
//         preview: false,
//       });

//       await revisionHelper.compareRevisions();
//     });

//   test('PRF-Auth-TC06 - Delete Revision - Edit Profile content and ensure user is able to Delete Revisions', { tag: "@regression" },
//     async ({ profileHelper, revisionHelper, testSetUpData }) =>
//     {
//       await profileHelper.createProfile({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });

//       testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//       await profileHelper.editProfile({
//         preview: false,
//       });

//       await revisionHelper.deleteRevisions({
//         delete: false,
//         cancel: true
//       });

//       await revisionHelper.deleteRevisions({
//         delete: true,
//         cancel: false
//       });
//     });

//   test('PRF-Auth-TC07 - Revert Revision - Edit Profile content and ensure user is able to Revert Revisions', { tag: '@regression' }, async ({ profileHelper, revisionHelper, testSetUpData }) =>
//   {
//     await profileHelper.createProfile({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//     await profileHelper.editProfile({
//       preview: false,
//     });

//     await revisionHelper.revertRevisions({
//       revert: false,
//       cancel: true
//     });

//     await revisionHelper.revertRevisions({
//       revert: true,
//       cancel: false
//     });
//   });

//   test('PRF-Auth-TC08 - Workbench -  Create Profile content as an "Author", and use Workbench to complete all moderation states available', { tag: "@regression" },
//     async ({ profileHelper, contentModerationHelper, workBenchHelper, navigateToCreatedContentHelper, basePage, loginHelper, testSetUpData }) =>
//     {
//       // creating profile as a draft and performing mandatory field check
//       console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

//       await profileHelper.createProfile({
//         preview: false,
//         mandatoryFieldCheck: false
//       });

//       await workBenchHelper.authorWorkBench({
//         draft: true,
//         needsReview: false,
//         archived: false
//       });

//       // moderating to needs review
//       await contentModerationHelper.authorModerateContent({
//         NeedsReview: true,
//       });

//       await workBenchHelper.authorWorkBench({
//         draft: false,
//         needsReview: true,
//         archived: false
//       });

//       //Logging in as a supervisor to Archive Content as authors can view archive content but are unable to archive themseleves
//       await basePage.logOut();

//       // Overriding user for test data with supervisor credentials
//       testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
//       testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;
//       // log back in and naviagte to content
//       await loginHelper.loginWithValidUser();

//       // Navigating to authors created content
//       await navigateToCreatedContentHelper.navigateToCreatedContent({
//         active: true,
//         deleted: false
//       });

//       // moderating to Archived
//       await contentModerationHelper.supervisorModerateContent({
//         NeedsReview: false,
//         Published: false,
//         Archive: true
//       });

//       // Logging out to complete author workbench.
//       await basePage.logOut();

//       // Overriding user for test data with author credentials
//       testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
//       testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;
//       // log back in and naviagte to content
//       await loginHelper.loginWithValidUser();

//       await workBenchHelper.authorWorkBench({
//         draft: false,
//         needsReview: false,
//         archived: true
//       });

//     });
// });

// test.describe('Profile Supervisor Tests', () =>
// {
//   test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
//   {
//     const testSteps = new TestSteps();
//     await testSteps.LogInfo('Test starting');
//     await testSteps.LogInfo(testInfo.title);

//     testSetUpData.urlForTest.url = testSetUpData.validTestURLList.dfi_url;
//     testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
//     testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;
//     testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.profile;
//     testSetUpData.contentTitleforTest.contentTitle = testData.Profile.title;
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

//     await loginHelper.loginWithValidUser();
//   });

//   test('PRF-Super-TC01 - Create - Create Profile content as a "Supervisor", perform mandatory field check and preview content', { tag: "@regression" }, async ({ profileHelper, anonymousHelper, contentModerationHelper, loginHelper, navigateToCreatedContentHelper, testSetUpData, testData }) =>
//   {
//     // creating profile as a draft and performing mandatory field check
//     console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

//     await profileHelper.createProfile({
//       preview: true,
//       mandatoryFieldCheck: false,
//     });

//     // searching as anon to ensure content is not viewable as draft
//     await anonymousHelper.searchAsAnon({
//       edited: false
//     });

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
//     await anonymousHelper.searchAsAnon({
//       edited: false
//     });

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
//     await anonymousHelper.searchAsAnon({
//       edited: false
//     });

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
//     await anonymousHelper.searchAsAnon({
//       edited: false
//     });

//   });

//   test('PRF-Super-TC02 - Edit - Edit Published Profile content and ensure edit is published as a "Supervisor" ', { tag: "@regression" }, async ({ profileHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData, testData }) =>
//   {
//     // creating content
//     await profileHelper.createProfile({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // moderating to published
//     await contentModerationHelper.supervisorModerateContent({
//       NeedsReview: false,
//       Published: true,
//       Archive: false
//     });

//     // edit profile
//     await profileHelper.editProfile({
//       preview: true
//     });

//     // moderating edited content to published
//     await contentModerationHelper.supervisorModerateContent({
//       NeedsReview: false,
//       Published: true,
//       Archive: false
//     });

//     // ensure edit does not publish published set to true
//     await anonymousHelper.searchAsAnon({
//       edited: true
//     });
//   });

//   test('PRF-Super-TC03 - Delete - Delete Published Article as "Supervisor" and confirm it isnt viewable as an anon user', { tag: "@regression" }, async ({ profileHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData, testData }) =>
//   {
//     // creating content
//     await profileHelper.createProfile({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // moderating to published
//     await contentModerationHelper.supervisorModerateContent({
//       NeedsReview: false,
//       Published: true,
//       Archive: false
//     });

//     // cancel delete profile
//     await profileHelper.deleteProfile({
//       delete: false,
//       cancel: true
//     });

//     // ensure cancel has not deleted content and it is viewable to anon users
//     await anonymousHelper.searchAsAnon({
//       edited: false
//     });

//     // log back in and naviagte to content
//     await loginHelper.loginWithValidUser();
//     await navigateToCreatedContentHelper.navigateToCreatedContent({
//       active: true,
//       deleted: false
//     });

//     // delete profile
//     await profileHelper.deleteProfile({
//       delete: true,
//       cancel: false
//     });

//     // confirm content deleted logged in on content page
//     await navigateToCreatedContentHelper.navigateToCreatedContent({
//       active: false,
//       deleted: true
//     });

//     // ensure profile is deleted and not viewable to anon users
//     await anonymousHelper.searchAsAnon({
//       edited: false
//     });
//   });

//   test('PRF-Super-TC04 - Delete - Can delete Profile created by "Author" as an "Supervisor"', { tag: "@regression" }, async ({ profileHelper, navigateToCreatedContentHelper, basePage, loginHelper, contentModerationHelper, anonymousHelper, testSetUpData }) =>
//   {
//     // Logging out as Before each will log in as a Supervisor.
//     await basePage.logOut();

//     // Overriding user for test data with Author credentials
//     testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
//     testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;
//     // log back in and naviagte to content
//     await loginHelper.loginWithValidUser();

//     // Creating Profile as a Author
//     await profileHelper.createProfile({
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

//     // delete authors profile
//     await profileHelper.deleteProfile({
//       delete: true,
//       cancel: false
//     });

//     // confirm content deleted logged in on content page
//     await navigateToCreatedContentHelper.navigateToCreatedContent({
//       active: false,
//       deleted: true
//     });
//   });

//   test('PRF-Super-TC05 - Compare Revision - Edit Profile content and ensure user is able to compare Revisions ', { tag: "@regression" }, async ({ profileHelper, revisionHelper, testSetUpData }) =>
//   {
//     // creating content
//     await profileHelper.createProfile({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // overriding test data so that Edit test saves as Needs Review
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//     // edit profile
//     await profileHelper.editProfile({
//       preview: false
//     });

//     // comparing and verifying Revisions
//     await revisionHelper.compareRevisions();

//   });

//   test('PRF-Super-TC06 - Delete Revision - Edit Profile content and ensure user is able to Delete Revisions', { tag: "@regression" }, async ({ profileHelper, revisionHelper, testSetUpData }) =>
//   {
//     // creating content
//     await profileHelper.createProfile({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // overriding test data so that Edit test saves as Needs Review
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//     // edit profile
//     await profileHelper.editProfile({
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

//   test('PRF-Super-TC07 - Revert Revision - Edit Profile content and ensure user is able to Revert Revisions', { tag: '@regression' }, async ({ profileHelper, revisionHelper, testSetUpData }) =>
//   {
//     await profileHelper.createProfile({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//     await profileHelper.editProfile({
//       preview: false,
//     });

//     await revisionHelper.revertRevisions({
//       revert: false,
//       cancel: true
//     });
//     await revisionHelper.revertRevisions({
//       revert: true,
//       cancel: false
//     });
//   });

//   test('PRF-Super-TC08 - Workbench -  Create Profile content as a "Supervisor", and use Workbench to complete all moderation states', { tag: "@regression" }, async ({ profileHelper, contentModerationHelper, workBenchHelper, testSetUpData }) =>
//   {
//     // creating profile as a draft and performing mandatory field check
//     console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

//     await profileHelper.createProfile({
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

//     // moderating to archived
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