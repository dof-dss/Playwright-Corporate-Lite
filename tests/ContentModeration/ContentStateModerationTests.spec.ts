// import { TestSteps } from '@poms/base-pages/TestSteps';
// import { test } from '@fixtures/MyFixtures';
// import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';

// test.describe('Moderation Author Tests', () =>
// {
//   // Pass the fixture for Application Authors into the beforeEach hook
//   test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
//   {
//     const testSteps = new TestSteps();
//     await testSteps.LogInfo('Test starting');
//     await testSteps.LogInfo(testInfo.title);

//     // setting the isolated data for THIS specific test run
//     testSetUpData.urlForTest.url = testSetUpData.validTestURLList.health_url;
//     testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
//     testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;
//     testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.application;
//     testSetUpData.contentTitleforTest.contentTitle = testData.Application.title;
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

//     // automatically logins based on above test data for each test
//     await loginHelper.loginWithValidUser();
//   });

//   test('MOD-AUTH-TC01 - Moderate - Perform all moderation actions available when in a "Draft" state', { tag: "@regression" },
//     async ({ applicationHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData }) =>
//     {
//       // creating application as a draft and performing mandatory field check
//       console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

//       await applicationHelper.createApplication({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });

//       // *******************************************************************
//       // ********* MODERATION FROM DRAFT TO NEEDS REVIEW STATE *************
//       // *******************************************************************

//       // moderating to needs review
//       await contentModerationHelper.authorModerateContent({
//         Draft: false,
//         NeedsReview: true,
//       });
//     });

//   test('MOD-AUTH-TC02 - Moderate - Perform all moderation actions available when in a "Needs Review" state', { tag: "@regression" },
//     async ({ applicationHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData }) =>
//     {
//       // creating application as a draft and performing mandatory field check
//       console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

//       testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//       await applicationHelper.createApplication({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });

//       // *******************************************************************
//       // ********* MODERATION FROM NEEDS REVIEW TO DRAFT STATE *************
//       // *******************************************************************
//       // moderating to draft
//       // moderating to needs review
//       await contentModerationHelper.authorModerateContent({
//         Draft: true,
//         NeedsReview: false,
//       });

//       // searching as anon to ensure content is Not viewable as it is Draft
//       await anonymousHelper.searchAsAnon({ edited: false });
//     });
// });

// test.describe('Moderation Supervisor Tests', () =>
// {
//   // Pass the fixture for Application Authors into the beforeEach hook
//   test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
//   {
//     const testSteps = new TestSteps();
//     await testSteps.LogInfo('Test starting');
//     await testSteps.LogInfo(testInfo.title);

//     // setting the isolated data for THIS specific test run
//     testSetUpData.urlForTest.url = testSetUpData.validTestURLList.health_url;
//     testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
//     testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;
//     testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.application;
//     testSetUpData.contentTitleforTest.contentTitle = testData.Application.title;
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

//     // automatically logins based on above test data for each test
//     await loginHelper.loginWithValidUser();
//   });

//   test('MOD-Super-TC01 - Moderate - Perform all moderation actions available when in a "Draft" state', { tag: "@regression" },
//     async ({ applicationHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData }) =>
//     {
//       // creating application as a draft and performing mandatory field check
//       console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

//       await applicationHelper.createApplication({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });

//       // *******************************************************************
//       // ********* MODERATION FROM DRAFT TO NEEDS REVIEW STATE *************
//       // *******************************************************************

//       // moderating to needs review
//       await contentModerationHelper.supervisorModerateContent({

//         NeedsReview: true,
//         Published: false,
//         Archive: false
//       });

//       // *******************************************************************
//       // ********* MODERATION FROM DRAFT TO ARCHIVED STATE *************
//       // *******************************************************************

//       // moderating Back to Draft to check next moderation action available
//       await contentModerationHelper.supervisorModerateContent({
//         Draft: true,
//         NeedsReview: false,
//         Published: false,
//         Archive: false
//       });

//       // moderating "Archived" state
//       await contentModerationHelper.supervisorModerateContent({
//         Draft: false,
//         NeedsReview: false,
//         Published: false,
//         Archive: true
//       });

//       // searching as anon to ensure content is viewable as it is published
//       await anonymousHelper.searchAsAnon({ edited: false });
//     });

//   test('MOD-Super-TC02 - Moderate - Perform all moderation actions available when in a "Needs Review" state', { tag: "@regression" }, async ({ applicationHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData }) =>
//   {
//     // creating application as a draft and performing mandatory field check
//     console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//     await applicationHelper.createApplication({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // *******************************************************************
//     // ********* MODERATION FROM NEEDS REVIEW TO PUBLISHED STATE *********
//     // *******************************************************************

//     // moderating to "Published" state
//     await contentModerationHelper.supervisorModerateContent({
//       Draft: false,
//       NeedsReview: false,
//       Published: true,
//       Archive: false
//     });

//     // ******************************************************************
//     // ********* MODERATION FROM NEEDS REVIEW TO ARCHIVED STATE *********
//     // ******************************************************************

//     // PRE_-REQ = RESETTING THE STATE BACK TO NEEDS REVIEW FOR NEXT MODERATION ACTION TEST
//     await contentModerationHelper.supervisorModerateContent({
//       Draft: false,
//       NeedsReview: true,
//       Published: false,
//       Archive: false
//     });

//     // moderating to "Archived" state
//     await contentModerationHelper.supervisorModerateContent({
//       Draft: false,
//       NeedsReview: false,
//       Published: false,
//       Archive: true
//     });

//     // searching as anon to ensure content is not viewable as needs review
//     await anonymousHelper.searchAsAnon({ edited: false });

//     // log back in and naviagte to content
//     await loginHelper.loginWithValidUser();
//     await navigateToCreatedContentHelper.navigateToCreatedContent({
//       active: true,
//       deleted: false
//     });

//     // ******************************************************************
//     // ********* MODERATION FROM NEEDS REVIEW TO DRAFT STATE ************
//     // ******************************************************************

//     // PRE_-REQ = RESETTING THE STATE BACK TO NEEDS REVIEW FOR NEXT MODERATION ACTION TEST
//     await contentModerationHelper.supervisorModerateContent({
//       Draft: false,
//       NeedsReview: true,
//       Published: false,
//       Archive: false
//     });

//     // moderating back to "Draft" state
//     await contentModerationHelper.supervisorModerateContent({
//       Draft: true,
//       NeedsReview: false,
//       Published: false,
//       Archive: false
//     });

//     // searching as anon to ensure content is not viewable as needs review
//     await anonymousHelper.searchAsAnon({ edited: false });
//   });

//   test('MOD-Super-TC03 - Moderate - Perform all moderation actions available when in a "Published" state', { tag: "@regression" }, async ({ applicationHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData }) =>
//   {
//     // creating application as a draft and performing mandatory field check
//     console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

//     await applicationHelper.createApplication({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     await contentModerationHelper.supervisorModerateContent({
//       Draft: false,
//       NeedsReview: false,
//       Published: true,
//       Archive: false
//     });

//     // *******************************************************************
//     // ********* MODERATION FROM PUBLISHED TO ARCHIVED STATE *************
//     // *******************************************************************

//     // moderating to "Published" state
//     await contentModerationHelper.supervisorModerateContent({
//       Draft: false,
//       NeedsReview: false,
//       Published: true,
//       Archive: false
//     });
//   });

//   test('MOD-Super-TC04 - Moderate - Perform all moderation actions available when in a "Archived" state', { tag: "@regression" }, async ({ applicationHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData }) =>
//   {
//     // creating application as a draft and performing mandatory field check
//     console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

//     await applicationHelper.createApplication({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     await contentModerationHelper.supervisorModerateContent({
//       Draft: false,
//       NeedsReview: false,
//       Published: false,
//       Archive: true
//     });

//     // *******************************************************************
//     // ********* MODERATION FROM ARCHIVED TO DRAFT STATE *****************
//     // *******************************************************************

//     // moderating to "Draft" state
//     await contentModerationHelper.supervisorModerateContent({
//       Draft: true,
//       NeedsReview: false,
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

//     // *******************************************************************
//     // ********* MODERATION FROM ARCHIVED TO PUBLISHED STATE *************
//     // *******************************************************************

//     // PRE_-REQ = RESETTING THE STATE BACK TO ARCHIVED FOR NEXT MODERATION ACTION TEST
//     await contentModerationHelper.supervisorModerateContent({
//       Draft: false,
//       NeedsReview: false,
//       Published: false,
//       Archive: true
//     });

//     // moderating to "Published" state
//     await contentModerationHelper.supervisorModerateContent({
//       Draft: false,
//       NeedsReview: false,
//       Published: true,
//       Archive: false
//     });

//     // searching as anon to ensure content is not viewable as needs review
//     await anonymousHelper.searchAsAnon({ edited: false });
//   });
// });

// test.describe('Moderation Stats Author Tests', () =>
// {
//   // Pass the fixture for Application Authors into the beforeEach hook
//   test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
//   {
//     const testSteps = new TestSteps();
//     await testSteps.LogInfo('Test starting');
//     await testSteps.LogInfo(testInfo.title);

//     // setting the isolated data for THIS specific test run
//     testSetUpData.urlForTest.url = testSetUpData.validTestURLList.health_url;
//     testSetUpData.userForTest.username = testSetUpData.validUserList.stats_author_username;
//     testSetUpData.userForTest.password = testSetUpData.validUserList.stats_author_password;
//     testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.application;
//     testSetUpData.contentTitleforTest.contentTitle = testData.Application.title;
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

//     // automatically logins based on above test data for each test
//     await loginHelper.loginWithValidUser();
//   });

//   test('MOD-STATS-AUTH-TC01 - Moderate - Perform all moderation actions available when in a "Draft" state', { tag: "@regression" },
//     async ({ applicationHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData }) =>
//     {
//       // creating application as a draft and performing mandatory field check
//       console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

//       await applicationHelper.createApplication({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });

//       // *******************************************************************
//       // ********* MODERATION FROM DRAFT TO NEEDS REVIEW STATE *************
//       // *******************************************************************

//       // moderating to needs review
//       await contentModerationHelper.statsAuthorModerateContent({
//         Draft: false,
//         NeedsReview: true,
//       });
//     });

//   test('MOD-STATS-AUTH-TC02 - Moderate - Perform all moderation actions available when in a "Needs Review" state', { tag: "@regression" },
//     async ({ applicationHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData }) =>
//     {
//       // creating application as a draft and performing mandatory field check
//       console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

//       testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//       await applicationHelper.createApplication({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });

//       // *******************************************************************
//       // ********* MODERATION FROM NEEDS REVIEW TO DRAFT STATE *************
//       // *******************************************************************
//       // moderating to draft
//       // moderating to needs review
//       await contentModerationHelper.statsAuthorModerateContent({
//         Draft: true,
//         NeedsReview: false,
//       });

//       // searching as anon to ensure content is not viewable as needs review
//       await anonymousHelper.searchAsAnon({ edited: false });
//     });
// });

// test.describe('Moderation Stats Supervisor Tests', () =>
// {
//   // Pass the fixture for Application Authors into the beforeEach hook
//   test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
//   {
//     const testSteps = new TestSteps();
//     await testSteps.LogInfo('Test starting');
//     await testSteps.LogInfo(testInfo.title);

//     // setting the isolated data for THIS specific test run
//     testSetUpData.urlForTest.url = testSetUpData.validTestURLList.health_url;
//     testSetUpData.userForTest.username = testSetUpData.validUserList.stats_supervisor_username;
//     testSetUpData.userForTest.password = testSetUpData.validUserList.stats_supervisor_password;
//     testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.application;
//     testSetUpData.contentTitleforTest.contentTitle = testData.Application.title;
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

//     // automatically logins based on above test data for each test
//     await loginHelper.loginWithValidUser();
//   });

//   test('MOD-Stats-Super-TC01 - Moderate - Perform all moderation actions available when in a "Draft" state', { tag: "@regression" },
//     async ({ applicationHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData }) =>
//     {
//       // creating application as a draft and performing mandatory field check
//       console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

//       await applicationHelper.createApplication({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });

//       // *******************************************************************
//       // ********* MODERATION FROM DRAFT TO NEEDS REVIEW STATE *************
//       // *******************************************************************

//       // moderating to needs review
//       await contentModerationHelper.statsSupervisorModerateContent({
//         QuickPublish: false, // Only available when in a "Draft" state
//         Draft: false,
//         NeedsReview: true,
//         Published: false,
//         Archive: false
//       });

//       // *******************************************************************
//       // ********* MODERATION FROM DRAFT TO ARCHIVED STATE *************
//       // *******************************************************************

//       // moderating Back to Draft to check next moderation action available
//       await contentModerationHelper.statsSupervisorModerateContent({
//         QuickPublish: false, // Only available when in a "Draft" state
//         Draft: true,
//         NeedsReview: false,
//         Published: false,
//         Archive: false
//       });

//       // moderating "Archived" state
//       await contentModerationHelper.statsSupervisorModerateContent({
//         QuickPublish: false, // Only available when in a "Draft" state
//         Draft: false,
//         NeedsReview: false,
//         Published: false,
//         Archive: true
//       });

//       // searching as anon to ensure content is viewable as it is published
//       await anonymousHelper.searchAsAnon({ edited: false });

//       // log back in and naviagte to content
//       await loginHelper.loginWithValidUser();
//       await navigateToCreatedContentHelper.navigateToCreatedContent({
//         active: true,
//         deleted: false
//       });

//       // *******************************************************************
//       // **MODERATION FROM DRAFT TO PUBLISHED STATE (USING QUICK PUBLISH) **
//       // *******************************************************************

//       // moderating Back to Draft to check next moderation action available
//       await contentModerationHelper.statsSupervisorModerateContent({
//         QuickPublish: false, // Only available when in a "Draft" state
//         Draft: true,
//         NeedsReview: false,
//         Published: false,
//         Archive: false
//       });

//       // moderating to Published state
//       await contentModerationHelper.statsSupervisorModerateContent({
//         QuickPublish: true, // Only available when in a "Draft" state
//         Draft: false,
//         NeedsReview: false,
//         Published: false,
//         Archive: false
//       });

//       // searching as anon to ensure content is not viewable as needs review
//       await anonymousHelper.searchAsAnon({ edited: false });
//     });

//   test('MOD-Stats-Super-TC02 - Moderate - Perform all moderation actions available when in a "Needs Review" state', { tag: "@regression" }, async ({ applicationHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData }) =>
//   {
//     // creating application as a draft and performing mandatory field check
//     console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//     await applicationHelper.createApplication({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // *******************************************************************
//     // ********* MODERATION FROM NEEDS REVIEW TO PUBLISHED STATE *********
//     // *******************************************************************

//     // moderating to "Published" state
//     await contentModerationHelper.statsSupervisorModerateContent({
//       QuickPublish: false, // Only available when in a "Draft" state
//       Draft: false,
//       NeedsReview: false,
//       Published: true,
//       Archive: false
//     });

//     // ******************************************************************
//     // ********* MODERATION FROM NEEDS REVIEW TO ARCHIVED STATE *********
//     // ******************************************************************

//     // PRE-REQ = RESETTING THE STATE BACK TO NEEDS REVIEW FOR NEXT MODERATION ACTION TEST
//     await contentModerationHelper.statsSupervisorModerateContent({
//       QuickPublish: false, // Only available when in a "Draft" state
//       Draft: false,
//       NeedsReview: true,
//       Published: false,
//       Archive: false
//     });

//     // moderating to "Archived" state
//     await contentModerationHelper.statsSupervisorModerateContent({
//       QuickPublish: false, // Only available when in a "Draft" state
//       Draft: false,
//       NeedsReview: false,
//       Published: false,
//       Archive: true
//     });

//     // searching as anon to ensure content is not viewable as needs review
//     await anonymousHelper.searchAsAnon({ edited: false });

//     // log back in and naviagte to content
//     await loginHelper.loginWithValidUser();
//     await navigateToCreatedContentHelper.navigateToCreatedContent({
//       active: true,
//       deleted: false
//     });

//     // ******************************************************************
//     // ********* MODERATION FROM NEEDS REVIEW TO DRAFT STATE ************
//     // ******************************************************************

//     // PRE-REQ = RESETTING THE STATE BACK TO NEEDS REVIEW FOR NEXT MODERATION ACTION TEST
//     await contentModerationHelper.statsSupervisorModerateContent({
//       QuickPublish: false, // Only available when in a "Draft" state
//       Draft: false,
//       NeedsReview: true,
//       Published: false,
//       Archive: false
//     });

//     // moderating back to "Draft" state
//     await contentModerationHelper.statsSupervisorModerateContent({
//       QuickPublish: false, // Only available when in a "Draft" state
//       Draft: true,
//       NeedsReview: false,
//       Published: false,
//       Archive: false
//     });

//     // searching as anon to ensure content is not viewable as needs review
//     await anonymousHelper.searchAsAnon({ edited: false });
//   });

//   test('MOD-Stats-Super-TC03 - Moderate - Perform all moderation actions available when in a "Published" state', { tag: "@regression" }, async ({ applicationHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData }) =>
//   {
//     // creating application as a draft and performing mandatory field check
//     console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.published;


//     await applicationHelper.createApplication({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });


//     // *******************************************************************
//     // ********* MODERATION FROM PUBLISHED TO ARCHIVED STATE *************
//     // *******************************************************************

//     // moderating to "Published" state
//     await contentModerationHelper.statsSupervisorModerateContent({
//       QuickPublish: false, // Only available when in a "Draft" state
//       Draft: false,
//       NeedsReview: false,
//       Published: false,
//       Archive: true
//     });
//   });

//   test('MOD-Stats-Super-TC04 - Moderate - Perform all moderation actions available when in a "Archived" state', { tag: "@regression" }, async ({ applicationHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData }) =>
//   {
//     // creating application as a draft and performing mandatory field check
//     console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.archived;

//     await applicationHelper.createApplication({
//       preview: false,
//       mandatoryFieldCheck: false,
//     });

//     // *******************************************************************
//     // ********* MODERATION FROM ARCHIVED TO DRAFT STATE *****************
//     // *******************************************************************

//     // moderating to "Draft" state
//     await contentModerationHelper.statsSupervisorModerateContent({
//       QuickPublish: false, // Only available when in a "Draft" state
//       Draft: true,
//       NeedsReview: false,
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

//     // *******************************************************************
//     // ********* MODERATION FROM ARCHIVED TO PUBLISHED STATE *************
//     // *******************************************************************

//     // PRE-REQ = RESETTING THE STATE BACK TO ARCHIVED FOR NEXT MODERATION ACTION TEST
//     await contentModerationHelper.statsSupervisorModerateContent({
//       QuickPublish: false, // Only available when in a "Draft" state
//       Draft: false,
//       NeedsReview: false,
//       Published: false,
//       Archive: true
//     });

//     // moderating to "Published" state
//     await contentModerationHelper.statsSupervisorModerateContent({
//       QuickPublish: false, // Only available when in a "Draft" state
//       Draft: false,
//       NeedsReview: false,
//       Published: true,
//       Archive: false
//     });

//     // searching as anon to ensure content is not viewable as needs review
//     await anonymousHelper.searchAsAnon({ edited: false });
//   });
// });


