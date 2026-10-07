// import { TestSteps } from '@poms/base-pages/TestSteps';
// import { test } from '@fixtures/MyFixtures';
// import { ContentVisibilityHelper } from '@helpers/general/ContentVisibilityHelper';

// const urlTargets = [
//   { label: 'Finance', urlKey: 'finance_url' },
//   { label: 'Communities', urlKey: 'communities_url' },
//   { label: 'Daera', urlKey: 'daera_url' },
//   { label: 'Economy', urlKey: 'economy_url' },
//   { label: 'Education', urlKey: 'education_url' },
//   { label: 'Executive Office', urlKey: 'executive_office_url' },
//   { label: 'Health', urlKey: 'health_url' },
//   { label: 'Dfi', urlKey: 'dfi_url' },
//   { label: 'Nigov', urlKey: 'nigov_url' },
//   { label: 'Justice', urlKey: 'justice_url' }
// ] as const;

// const roleConfigs = [
//   {
//     describeName: 'Content Visibility Media Library Author Tests',
//     testPrefix: 'CVML-AUTH-TC',
//     usernameKey: 'author_username',
//     passwordKey: 'author_password'
//   },
//   {
//     describeName: 'Content Visibility Media Library Supervisor Tests',
//     testPrefix: 'CVML-SUP-TC',
//     usernameKey: 'supervisor_username',
//     passwordKey: 'supervisor_password'
//   },
//   {
//     describeName: 'Content Visibility Media Library Stats Author Tests',
//     testPrefix: 'CVML-STATS-AUTH-TC',
//     usernameKey: 'stats_author_username',
//     passwordKey: 'stats_author_password'
//   },
//   {
//     describeName: 'Content Visibility Media Library Stats Supervisor Tests',
//     testPrefix: 'CVML-STATS-SUP-TC',
//     usernameKey: 'stats_supervisor_username',
//     passwordKey: 'stats_supervisor_password'
//   },
//   {
//     describeName: 'Content Visibility Media Library Home Supervisor Tests',
//     testPrefix: 'CVML-HOME-SUP-TC',
//     usernameKey: 'homepage_supervisor_username',
//     passwordKey: 'homepage_supervisor_password'
//   }


// ] as const;

// for (const role of roleConfigs)
// {
//   test.describe(role.describeName, () =>
//   {
//     for (const [index, urlTarget] of urlTargets.entries())
//     {
//       const testCaseNumber = String(index + 1).padStart(2, '0');
//       const testCaseId = `${role.testPrefix}${testCaseNumber}`;

//       test.describe(`${testCaseId} - ${urlTarget.label}`, () =>
//       {
//         test.beforeEach(async ({ loginHelper, testSetUpData }, testInfo) =>
//         {
//           const testSteps = new TestSteps();
//           await testSteps.LogInfo('Test starting');
//           await testSteps.LogInfo(testInfo.title);

//           testSetUpData.urlForTest.url = testSetUpData.validTestURLList[urlTarget.urlKey];
//           testSetUpData.userForTest.username = testSetUpData.validUserList[role.usernameKey];
//           testSetUpData.userForTest.password = testSetUpData.validUserList[role.passwordKey];

//           await loginHelper.loginWithValidUser();
//         });

//         test(`${testCaseId} - ${urlTarget.label} - Verify Correct Media Library Content visibility`, { tag: '@regression' },
//           async ({ page, testSetUpData }) =>
//           {
//             const contentVisibilityHelper = new ContentVisibilityHelper(page, testSetUpData);
//             await contentVisibilityHelper.ContentVisibilityMediaLibrary();
//           });
//       });
//     }
//   });
// }
