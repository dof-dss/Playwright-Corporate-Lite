// import { TestSteps } from '@poms/base-pages/TestSteps';
// import { test } from '@fixtures/MyFixtures';

// test.describe('Link Supervisor Tests', () =>
// {
//   // Pass the fixture for Link Supervisors into the beforeEach hook
//   test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
//   {
//     const testSteps = new TestSteps();
//     await testSteps.LogInfo('Test starting');
//     await testSteps.LogInfo(testInfo.title);

//     // setting the isolated data for THIS specific test run
//     testSetUpData.urlForTest.url = testSetUpData.validTestURLList.finance_url;
//     testSetUpData.userForTest.username = testSetUpData.validUserList.homepage_supervisor_username;
//     testSetUpData.userForTest.password = testSetUpData.validUserList.homepage_supervisor_password;
//     testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.link;
//     testSetUpData.contentTitleforTest.contentTitle = testData.Link.title;
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

//     // automatically logins based on above test data for each test
//     await loginHelper.loginWithValidUser();
//   });

//   const tc01LinkTypes = ["Quick link", "Agency link", "Corporate link"];

//   tc01LinkTypes.forEach((linkType, index) =>
//   {
//     const caseNumber = String(index + 1).padStart(2, '0');
//     test(`Link-HP-Super-TC${caseNumber} - Create - Create Link (${linkType}) content as an "HomePage Supervisor", perform mandatory field check and preview content`, { tag: "@regression" },
//       async ({ linkHelper, applicationHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData, testData }) =>
//       {
//         // creating link as a draft and performing mandatory field check
//         console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');
//         testSetUpData.moderationStateForTest.moderationState = testSetUpData.validModerationStates.draft;

//         testData.Link.linkType = linkType;
//         await linkHelper.createLink({
//           preview: true,
//           mandatoryFieldCheck: false,
//         });

//         if (linkType === "Quick link")
//         {
//           await linkHelper.reorderLink();
//         }

//         // searching as anon to ensure content is not viewable as draft
//         await anonymousHelper.verifyContentwithLink({
//           edited: false,
//         });

//         // log back in and naviagte to content
//         await loginHelper.loginWithValidUser();
//         await navigateToCreatedContentHelper.navigateToCreatedContent({
//           active: true,
//           deleted: false
//         });

//         // moderating to needs review
//         await contentModerationHelper.homepageSupervisorModerateContent({
//           QuickPublish: false, // Only available when in a "Draft" state
//           Draft: false,
//           NeedsReview: true,
//           Published: false,
//           Archive: false
//         });

//         // searching as anon to ensure content is not viewable as Needs Review
//         await anonymousHelper.verifyContentwithLink({
//           edited: false,
//         });

//         // log back in and naviagte to content
//         await loginHelper.loginWithValidUser();
//         await navigateToCreatedContentHelper.navigateToCreatedContent({
//           active: true,
//           deleted: false
//         });

//         // moderating to published
//         await contentModerationHelper.homepageSupervisorModerateContent({
//           QuickPublish: false, // Only available when in a "Draft" state
//           Draft: false,
//           NeedsReview: false,
//           Published: true,
//           Archive: false
//         });

//         // searching as anon to ensure content is viewable as it is published
//         await anonymousHelper.verifyContentwithLink({
//           edited: false,
//         });

//         // log back in and naviagte to content
//         await loginHelper.loginWithValidUser();
//         await navigateToCreatedContentHelper.navigateToCreatedContent({
//           active: true,
//           deleted: false
//         });

//         // moderating to archived
//         await contentModerationHelper.homepageSupervisorModerateContent({
//           QuickPublish: false, // Only available when in a "Draft" state
//           Draft: false,
//           NeedsReview: false,
//           Published: false,
//           Archive: true
//         });

//         // searching as anon to ensure content is not viewable when archived
//         await anonymousHelper.verifyContentwithLink({
//           edited: false,
//         });
//       });
//   });

//   test('Link-Super-TC04 - Edit - Edit Published Link content and ensure edit is published as a "Supervisor"', { tag: "@regression" },
//     async ({ linkHelper, applicationHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData, testData }) =>
//     {
//       // creating link as a draft and performing mandatory field check
//       console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

//       testData.Link.linkType = "Quick link";
//       await linkHelper.createLink({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });

//       // moderating to published
//       await contentModerationHelper.homepageSupervisorModerateContent({
//         QuickPublish: true, // Only available when in a "Draft" state
//         Draft: false,
//         NeedsReview: false,
//         Published: false,
//         Archive: false
//       });

//       testData.Link.linkTypeEdited = "Agency link";
//       // edit link
//       await linkHelper.editLink({
//         preview: true
//       });

//       // moderating edited content to published
//       await contentModerationHelper.homepageSupervisorModerateContent({
//         QuickPublish: true, // Only available when in a "Draft" state
//         Draft: false,
//         NeedsReview: false,
//         Published: false,
//         Archive: false
//       });

//       // searching as anon to ensure content is not viewable when archived
//       await anonymousHelper.verifyContentwithLink({
//         edited: true,
//       });

//       // log back in and naviagte to content
//       await loginHelper.loginWithValidUser();
//       testSetUpData.contentTitleforTest.contentTitle = testData.Link.titleEdited;
//       await navigateToCreatedContentHelper.navigateToCreatedContent({
//         active: true,
//         deleted: false
//       });

//       testData.Link.linkTypeEdited = "Corporate link";
//       // edit link
//       await linkHelper.editLink({
//         preview: false
//       });

//       // moderating edited content to published
//       await contentModerationHelper.homepageSupervisorModerateContent({
//         QuickPublish: true, // Only available when in a "Draft" state
//         Draft: false,
//         NeedsReview: false,
//         Published: false,
//         Archive: false
//       });

//       // searching as anon to ensure content is not viewable when archived
//       await anonymousHelper.verifyContentwithLink({
//         edited: true,
//       });

//     });

//   tc01LinkTypes.forEach((linkType, index) =>
//   {
//     const caseNumber = String(index + 5).padStart(2, '0');
//     test(`Link-Super-TC${caseNumber} - Delete - Delete Published Link (${linkType}) as a "Supervisor" and confirm it isnt viewable as an anon user`, { tag: "@regression" },
//       async ({ linkHelper, anonymousHelper, loginHelper, applicationHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData, testData }) =>
//       {

//         testData.Link.linkType = linkType;
//         await linkHelper.createLink({
//           preview: false,
//           mandatoryFieldCheck: false,
//         });

//         if (linkType === "Quick link")
//         {
//           await linkHelper.reorderLink();
//         }

//         await navigateToCreatedContentHelper.navigateToCreatedContent({
//           active: true,
//           deleted: false
//         });

//         // moderating to published
//         await contentModerationHelper.homepageSupervisorModerateContent({
//           QuickPublish: true, // Only available when in a "Draft" state
//           Draft: false,
//           NeedsReview: false,
//           Published: false,
//           Archive: false
//         });


//         // Cancel delete link
//         await linkHelper.deleteLink({
//           delete: false,
//           cancel: true
//         });

//         await anonymousHelper.verifyContentwithLink({
//           edited: false,
//         });

//         // log back in and naviagte to content
//         await loginHelper.loginWithValidUser();

//         await navigateToCreatedContentHelper.navigateToCreatedContent({
//           active: true,
//           deleted: false
//         });

//         // delete link
//         await linkHelper.deleteLink({
//           delete: true,
//           cancel: false
//         });

//         // confirm content deleted
//         await navigateToCreatedContentHelper.navigateToCreatedContent({
//           active: false,
//           deleted: true
//         });

//         await anonymousHelper.verifyContentwithLink({
//           edited: false,
//         });
//       });
//   });


//   test('Link-Super-TC08 - Compare Revision - Edit Link content and ensure user is able to compare Revisions ', { tag: "@regression" },
//     async ({ linkHelper, revisionHelper, testSetUpData }) =>
//     {
//       // creating content
//       await linkHelper.createLink({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });

//       // overriding test data so that Edit test saves as Needs Review
//       testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//       // edit link
//       await linkHelper.editLink({
//         preview: false
//       });

//       // comparing and verifying Revisions
//       await revisionHelper.compareRevisions();
//     });

//   test('Link-Super-TC09 - Delete Revision - Edit Link content and ensure user is able to Delete Revisions', { tag: "@regression" },
//     async ({ linkHelper, revisionHelper, testSetUpData }) =>
//     {
//       // creating content
//       await linkHelper.createLink({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });

//       // overriding test data so that Edit test saves as Needs Review
//       testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//       // edit link
//       await linkHelper.editLink({
//         preview: false
//       });

//       // Cancel Deletion of Revision
//       await revisionHelper.deleteRevisions({
//         delete: false,
//         cancel: true
//       });

//       // Confirm Deletion of Revision
//       await revisionHelper.deleteRevisions({
//         delete: true,
//         cancel: false
//       });
//     });

//   test('Link-Super-TC10 - Revert Revision - Edit Link content and ensure user is able to Revert Revisions', { tag: "@regression" },
//     async ({ linkHelper, revisionHelper, testSetUpData }) =>
//     {
//       // creating content
//       await linkHelper.createLink({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });

//       // overriding test data so that Edit test saves as Needs Review
//       testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

//       // edit link
//       await linkHelper.editLink({
//         preview: false
//       });

//       // Cancel Reverting of Revision and verify edited version is still visible
//       await revisionHelper.revertRevisions({
//         revert: false,
//         cancel: true
//       });

//       // Confirm reverting of Revision and verify initial version is now visible
//       await revisionHelper.revertRevisions({
//         revert: true,
//         cancel: false
//       });
//     });

//   test('Link-Super-TC11 - Workbench -  Create Link content as an "Supervisor", and use Workbench to complete all moderation states', { tag: "@regression" },
//     async ({ linkHelper, contentModerationHelper, workBenchHelper, testSetUpData }) =>
//     {
//       // creating link as a draft and performing mandatory field check
//       console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

//       await linkHelper.createLink({
//         preview: false,
//         mandatoryFieldCheck: false
//       });

//       await workBenchHelper.supervisorWorkBench({
//         draft: true,
//         needsReview: false,
//         archived: false
//       });

//       // moderating to needs review
//       await contentModerationHelper.homepageSupervisorModerateContent({
//         QuickPublish: false, // Only available when in a "Draft" state
//         Draft: false,
//         NeedsReview: true,
//         Published: false,
//         Archive: false
//       });

//       await workBenchHelper.supervisorWorkBench({
//         draft: false,
//         needsReview: true,
//         archived: false
//       });

//       // moderating to archived
//       await contentModerationHelper.homepageSupervisorModerateContent({
//         QuickPublish: false, // Only available when in a "Draft" state
//         Draft: false,
//         NeedsReview: false,
//         Published: false,
//         Archive: true
//       });

//       await workBenchHelper.supervisorWorkBench({
//         draft: false,
//         needsReview: false,
//         archived: true
//       });
//     });

//   test('Link-Super-TC12 - Value Checker - Create and Publish link, ensure no more than 9 quick links are displayed', { tag: "@regression" },
//     async ({ linkHelper, anonymousHelper, contentModerationHelper, testSetUpData, testData, homePage }) =>
//     {
//       // creating link as a draft and performing mandatory field check
//       console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

//       testData.Link.linkType = "Quick link";
//       await linkHelper.createLink({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });

//       // moderating to published
//       await contentModerationHelper.homepageSupervisorModerateContent({
//         QuickPublish: true, // Only available when in a "Draft" state
//         Draft: false,
//         NeedsReview: false,
//         Published: false,
//         Archive: false
//       });

//       if (testData.Link.linkType === "Quick link")
//       {
//         await linkHelper.reorderLink();
//       }

//       // searching as anon to ensure content is not viewable when archived
//       await anonymousHelper.verifyContentwithLink({
//         edited: false,
//       });
//       await homePage.verifyQuickLinksMaxItems();
//     });
// });
