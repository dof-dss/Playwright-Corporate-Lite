// import { TestSteps } from '@poms/base-pages/TestSteps';
// import { test } from '@fixtures/MyFixtures';
// import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';

// test.describe('Duplicate Title Author Tests', () =>
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
//     testSetUpData.contentTitleforTest.contentTitle = testData.duplicated.title;
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

//     // Overiding content unique title in test data to create content with same name
//     testData.Application.title = testData.duplicated.title;
//     testData.Article.title = testData.duplicated.title;

//     // automatically logins based on above test data for each test
//     await loginHelper.loginWithValidUser();
//   });

//   test('MIS-Auth-TC01 - Duplicate Title - Create content as an "Author", create duplicate content and create a different content type but duplicate title on thesame site', { tag: "@regression" },
//     async ({ applicationHelper, articleHelper, testSetUpData, testData }) =>
//     {
//       // creating application as a draft and performing mandatory field check
//       console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

//       await applicationHelper.createApplication({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });

//       await applicationHelper.createApplication({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });

//       // overriding content type to article for creating article with same name as application
//       testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.article;
//       await articleHelper.createArticle({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });

//       await articleHelper.createArticle({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });
//     });

//   test('MIS-Author-TC02 - Duplicate Title - Create content as an "Author" on one site and ensure the same content can be created with the same name on another', { tag: "@regression" },
//     async ({ applicationHelper, articleHelper, loginHelper, testSetUpData, testData }) =>
//     {
//       // creating application as a draft and performing mandatory field check
//       console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

//       await applicationHelper.createApplication({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });

//       // overriding content type to article for creating article with same name as application
//       testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.article;
//       await articleHelper.createArticle({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });

//       testSetUpData.urlForTest.url = testSetUpData.validTestURLList.finance_url;
//       await loginHelper.loginWithValidUser();

//       await articleHelper.createArticle({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });

//       testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.application;
//       testData.Application.LinkURL = "Murphy determined to see cost of living support delivered";
//       testData.Application.LinkText = "Murphy determined to see cost of living support delivered";
//       await applicationHelper.createApplication({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });
//     });
// });

// test.describe('Duplicate Title Supervisor Tests', () =>
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
//     testSetUpData.contentTitleforTest.contentTitle = testData.duplicated.title;
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

//     // Overiding the title in test data to create content with same name
//     testData.Application.title = testData.duplicated.title;
//     testData.Article.title = testData.duplicated.title;

//     // automatically logins based on above test data for each test
//     await loginHelper.loginWithValidUser();
//   });

//   test('MIS-Super-TC01 - Duplicate Title - Create content as an "Supervisor", create duplicate content and create a different content type but duplicate title on thesame site', { tag: "@regression" },
//     async ({ applicationHelper, articleHelper, testSetUpData, testData }) =>
//     {
//       // creating application as a draft and performing mandatory field check
//       console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

//       await applicationHelper.createApplication({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });

//       await applicationHelper.createApplication({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });

//       // overriding content type to article for creating article with same name as application
//       testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.article;
//       await articleHelper.createArticle({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });

//       await articleHelper.createArticle({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });
//     });

//   test('MIS-Super-TC02 - Duplicate Title - Create content as an "Supervisor" on one site and ensure the same content can be created with the same name on another', { tag: "@regression" },
//     async ({ applicationHelper, articleHelper, loginHelper, testSetUpData, testData }) =>
//     {
//       // creating application as a draft and performing mandatory field check
//       console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

//       await applicationHelper.createApplication({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });

//       // overriding content type to article for creating article with same name as application
//       testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.article;
//       await articleHelper.createArticle({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });

//       testSetUpData.urlForTest.url = testSetUpData.validTestURLList.finance_url;
//       await loginHelper.loginWithValidUser();

//       await articleHelper.createArticle({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });

//       testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.application;
//       testData.Application.LinkURL = "Murphy determined to see cost of living support delivered";
//       testData.Application.LinkText = "Murphy determined to see cost of living support delivered";
//       await applicationHelper.createApplication({
//         preview: false,
//         mandatoryFieldCheck: false,
//       });
//     });
// });