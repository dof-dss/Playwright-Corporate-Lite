import { TestSteps } from '@poms/base-pages/TestSteps';
import { test } from '@fixtures/MyFixtures';
import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';
import { TestData } from '@tdata/TestDataObject';

test.describe('CKEditor Body Field Author Tests', { tag: ['@regression', '@author'] }, () =>
{
  // Pass the fixture for Article Authors into the beforeEach hook
  test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
  {
    const testSteps = new TestSteps();
    await testSteps.LogInfo('Test starting');
    await testSteps.LogInfo(testInfo.title);
    // setting the isolated data for THIS specific test run
    testSetUpData.urlForTest.url = testSetUpData.validTestURLList.afbi_url;
    testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
    testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;
    testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.article;
    testSetUpData.contentTitleforTest.contentTitle = testData.Article.title;
    testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

    // automatically logins based on above test data for each test
    await loginHelper.loginWithValidUser();
  });

  test('CKEditor-Auth-TC01 - Create - Create Article content as an "Author", and use all available CKEditor functionality',
    async ({ articleHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData, testData }) =>
    {
      const randomNumber = Math.floor(1000 + Math.random() * 9000);
      testData.Article.title = `CKEditor Test Author ${randomNumber}`;
      testSetUpData.contentTitleforTest.contentTitle = testData.Article.title;

      await articleHelper.createArticleWithCKEditorFunctionality({
        preview: false,
        mandatoryFieldCheck: false,
      });
    });
});

test.describe('CKEditor Body Field Article Supervisor Tests', { tag: ['@regression', '@supervisor'] }, () =>
{
  // Pass the fixture for Article Authors into the beforeEach hook
  test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
  {
    const testSteps = new TestSteps();
    await testSteps.LogInfo('Test starting');
    await testSteps.LogInfo(testInfo.title);

    // setting the isolated data for THIS specific test run
    testSetUpData.urlForTest.url = testSetUpData.validTestURLList.afbi_url;
    testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
    testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;
    testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.article;
    testSetUpData.contentTitleforTest.contentTitle = testData.Article.title;
    testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

    // automatically logins based on above test data for each test
    await loginHelper.loginWithValidUser();
  });

  test('CKEditor-Super-TC01 - Create - Create Article content as an "Supervisor", and use all available CKEditor functionality',
    async ({ articleHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData, testData }) =>
    {
      const randomNumber = Math.floor(1000 + Math.random() * 9000);
      testData.Article.title = `CKEditor Test Super ${randomNumber}`;
      testSetUpData.contentTitleforTest.contentTitle = testData.Article.title;

      await articleHelper.createArticleWithCKEditorFunctionality({
        preview: true,
        mandatoryFieldCheck: false,
      });

      // for anon verification content type needs changed to articleCKEditorFull for search as anon to work correctly
      testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.articleCKEditorFull;

      // moderating to published
      await contentModerationHelper.supervisorModerateContent({
        NeedsReview: false,
        Published: true,
        Archive: false
      });

      // searching as anon to ensure content is viewable as it is published
      await anonymousHelper.searchAsAnon({ edited: false });
    });
});