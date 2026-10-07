// import { TestSteps } from '@poms/base-pages/TestSteps';
// import { test } from '@fixtures/MyFixtures';
// import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';
// import { BooksHelper } from '@poms/content-pages/Article/ArticleCreatePage';

// type BookCreationDeps = {
//   articleHelper: {
//     createArticleWithBook: (options: { preview: boolean; mandatoryFieldCheck: boolean }, bookOptions: BooksHelper) => Promise<void>;
//   };
//   contentModerationHelper: {
//     supervisorModerateContent: (options: { NeedsReview: boolean; Published: boolean; Archive: boolean }) => Promise<void>;
//   };
// };

// const createPublishedBookHierarchy = async ({ articleHelper, contentModerationHelper }: BookCreationDeps) =>
// {
//   let bookOptions: BooksHelper = {};
//   const createBook = async (options: BooksHelper, preview = false) =>
//   {
//     await articleHelper.createArticleWithBook({ preview, mandatoryFieldCheck: false }, options);
//     bookOptions = { ...bookOptions, ...options };
//   };

//   await createBook({ Book: true }, true);
//   await contentModerationHelper.supervisorModerateContent({ NeedsReview: false, Published: true, Archive: false });

//   await createBook({ Chapter1: true });
//   await contentModerationHelper.supervisorModerateContent({ NeedsReview: false, Published: true, Archive: false });

//   await createBook({ Paragraph1: true });
//   await contentModerationHelper.supervisorModerateContent({ NeedsReview: false, Published: true, Archive: false });

//   await createBook({ Glossery1: true });
//   await contentModerationHelper.supervisorModerateContent({ NeedsReview: false, Published: true, Archive: false });

//   await createBook({ Chapter2: true });
//   await contentModerationHelper.supervisorModerateContent({ NeedsReview: false, Published: true, Archive: false });

//   await createBook({ Paragraph2: true });
//   await contentModerationHelper.supervisorModerateContent({ NeedsReview: false, Published: true, Archive: false });

//   await createBook({ Glossery2: true });
//   await contentModerationHelper.supervisorModerateContent({ NeedsReview: false, Published: true, Archive: false });

//   return bookOptions;
// };

// test.describe('Books Supervisor Tests', () =>
// {
//   // Pass the fixture for Article Authors into the beforeEach hook
//   test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
//   {
//     const testSteps = new TestSteps();
//     await testSteps.LogInfo('Test starting');
//     await testSteps.LogInfo(testInfo.title);
//     // setting the isolated data for THIS specific test run
//     testSetUpData.urlForTest.url = testSetUpData.validTestURLList.finance_url;
//     testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
//     testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;
//     testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.article;
//     testSetUpData.contentTitleforTest.contentTitle = testData.Books.BookTitle;
//     testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;


//     // automatically logins based on above test data for each test
//     await loginHelper.loginWithValidUser();
//   });

//   test('BOOK-SUPER-TC01 - Create - Create Book (Only Top Level) as an "Supervisor", perform mandatory field check and preview content', { tag: "@regression" },
//     async ({ loginHelper, articleHelper, anonymousHelper, contentModerationHelper, navigateToCreatedContentHelper }) =>
//     {
//       let bookOptions: BooksHelper = {};
//       const createBook = async (options: BooksHelper, preview = false) => {
//         await articleHelper.createArticleWithBook({ preview, mandatoryFieldCheck: false }, options);
//         bookOptions = { ...bookOptions, ...options };
//       };

//       // Main Book
//       await createBook({ Book: true }, true);

//       // searching as anon to ensure content is not viewable as draft
//       await anonymousHelper.searchAsAnon({ edited: false });

//       // log back in and naviagte to content
//       await loginHelper.loginWithValidUser();
//       await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });

//       // moderating to needs review
//       await contentModerationHelper.supervisorModerateContent({
//         NeedsReview: true,
//         Published: false,
//         Archive: false
//       });

//       // searching as anon to ensure content is not viewable as needs review
//       await anonymousHelper.searchAsAnon({ edited: false });

//       // log back in and naviagte to content
//       await loginHelper.loginWithValidUser();
//       await navigateToCreatedContentHelper.navigateToCreatedContent({
//         active: true,
//         deleted: false
//       });

//       // moderating to published
//       await contentModerationHelper.supervisorModerateContent({
//         NeedsReview: false,
//         Published: true,
//         Archive: false
//       });

//       // searching as anon to ensure content is viewable as it is published
//       await anonymousHelper.searchAsAnon({ edited: false });

//       // log back in and naviagte to content
//       await loginHelper.loginWithValidUser();
//       await navigateToCreatedContentHelper.navigateToCreatedContent({
//         active: true,
//         deleted: false
//       });

//       // moderating to archived
//       await contentModerationHelper.supervisorModerateContent({
//         NeedsReview: false,
//         Published: false,
//         Archive: true
//       });

//       // searching as anon to ensure content is not viewable as it is archived
//       await anonymousHelper.searchAsAnon({ edited: false });
//     });

//   test('BOOK-SUPER-TC02 - Create - Create Book with Child Pages as an "Supervisor"', { tag: "@regression" },
//     async ({ loginHelper, articleHelper, testData, testSetUpData, anonymousHelper, contentModerationHelper, navigateToCreatedContentHelper }) =>
//     {
//       await createPublishedBookHierarchy({ articleHelper, contentModerationHelper });
//     });

//   test('BOOK-SUPER-TC03 - Delete - Create Book with Child Pages as an "Supervisor" and ensure delete in correct order', { tag: "@regression" },
//     async ({ loginHelper, articleHelper, testData, testSetUpData, anonymousHelper, contentModerationHelper, navigateToCreatedContentHelper }) =>
//     {
//       const bookOptions = await createPublishedBookHierarchy({ articleHelper, contentModerationHelper });

//       testSetUpData.contentTitleforTest.contentTitle = testData.Books.BookTitle;
//       // searching as anon to ensure content is not viewable as draft
//       await anonymousHelper.searchAsAnon({ edited: false });

//       // log back in and naviagte to content
//       await loginHelper.loginWithValidUser();
//       await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });


//       // delete Book — bookOptions reflects exactly what was created above
//       await articleHelper.deleteBook({ delete: true, cancel: false }, bookOptions);

//       // confirm all created levels are deleted
//       await navigateToCreatedContentHelper.navigateToCreatedBook({ active: false, deleted: true }, bookOptions);
//     });

// });