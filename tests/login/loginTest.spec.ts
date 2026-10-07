// import { test, expect } from '@playwright/test';
// import { LoginHelper } from '../../helpers/general/LoginHelper';
// import { TestSetUpData } from '../../test-data/TestDataObject';
// import { TestSteps } from '@poms/base-pages/TestSteps';


// test.describe('Login Tests', () =>
// {

//   test('should login successfully with valid credentials', { tag: "@regression" }, async ({ page }) =>
//   {
//     //set test url
//     TestSetUpData.urlForTest.url = TestSetUpData.validTestURLList.finance_url;

//     //setting test to run as an author
//     TestSetUpData.userForTest.username = TestSetUpData.validUserList.author_username;
//     TestSetUpData.userForTest.password = TestSetUpData.validUserList.author_password;


//     //site login
//     let loginHelper = new LoginHelper(page, TestSetUpData);
//     await loginHelper.loginWithValidUser();
//   });


//   test('should NOT login successfully with Invalid credentials', { tag: "@regression" }, async ({ page }) =>
//   {
//     //set test url
//     TestSetUpData.urlForTest.url = TestSetUpData.validTestURLList.finance_url;

//     let loginHelper = new LoginHelper(page, TestSetUpData);
//     const testSteps = new TestSteps();

//     // setting test to run with incorrect Username and Password
//     await testSteps.LogInfo('Attempting To login With Incorrect Username and Password');
//     TestSetUpData.userForTest.username = "IncorrectUsername";
//     TestSetUpData.userForTest.password = "IncorrectPassword";
//     await loginHelper.AttemptTologinWithInValidUser();

//     // setting test to run with Correct Username But Incorrect Password
//     await testSteps.LogInfo('Attempting To login With correct Username (for Author) But Incorrect Password');
//     //setting test to run as an author
//     TestSetUpData.userForTest.username = TestSetUpData.validUserList.author_username;
//     TestSetUpData.userForTest.password = "IncorrectPassword";
//     await loginHelper.AttemptTologinWithInValidUser();

//     // setting test to run with Correct Password But Incorrect Username
//     await testSteps.LogInfo('Attempting To login With correct Username But Incorrect Password');
//     TestSetUpData.userForTest.username = "IncorrectUsername";
//     TestSetUpData.userForTest.password = TestSetUpData.validUserList.author_password;
//     await loginHelper.AttemptTologinWithInValidUser();

//     //setting test to run as an author
//     await testSteps.LogInfo('Ensuring User is able to Login with the Correct details (for AUthor) even after failed attempts');
//     TestSetUpData.userForTest.username = TestSetUpData.validUserList.author_username;
//     TestSetUpData.userForTest.password = TestSetUpData.validUserList.author_password;
//     await loginHelper.loginWithValidUser();
//   });

// });
