import { TestSteps } from '@poms/base-pages/TestSteps';
import { expect, test } from '@fixtures/MyFixtures';
import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';

test.describe('Feature Author Tests', { tag: ['@regression', '@feature', '@author'] }, () =>
{
  // Pass the fixture for Feature Authors into the beforeEach hook
  test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
  {
    const testSteps = new TestSteps();
    await testSteps.LogInfo('Test starting');
    await testSteps.LogInfo(testInfo.title);

    // setting the isolated data for THIS specific test run
    testSetUpData.urlForTest.url = testSetUpData.validTestURLList.hse_url;
    testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
    testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;
    testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.feature;
    testSetUpData.contentTitleforTest.contentTitle = testData.Feature.title;
    testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

    // automatically logins based on above test data for each test
    await loginHelper.loginWithValidUser();
  });

  test('FEAT-Auth-TC01 - Create - Create Feature content as an "Author", perform mandatory field check and preview content', { tag: '@create' }, async ({ loginHelper, basePage, featureHelper, anonymousHelper, contentModerationHelper, navigateToCreatedContentHelper, page }) =>
  {
    await featureHelper.createFeature({
      preview: true,
      mandatoryFieldCheck: false,
    });

    await featureHelper.AddFeatureToHomePage(false);
    // searching as anon to ensure content is not viewable as draft
    await anonymousHelper.VerifyfeatureAsAnon({ edited: false });

    // log back in and naviagte to content 
    await loginHelper.loginWithValidUser();
    await navigateToCreatedContentHelper.navigateToCreatedContent({
      active: true,
      deleted: false
    });

    // moderating to needs review 
    await contentModerationHelper.authorModerateContent({
      NeedsReview: true,
    });

    await featureHelper.AddFeatureToHomePage(false);
    // searching as anon to ensure content is not viewable as draft
    await anonymousHelper.VerifyfeatureAsAnon({ edited: false });


    // Ensure the page is not locked 
    // automatically logins based on above test data for each test
    await loginHelper.loginWithValidUser();
    await basePage.clickContentLink();
    await page.getByRole('link', { name: 'Content', exact: true }).first().hover();
    await page.waitForTimeout(1000);
    await page.getByRole('link', { name: 'Featured Content Campaigns' }).first().click();
    await page.getByRole('link', { name: 'Unlock' }).click();
    await page.getByRole('button', { name: 'Confirm break lock' }).click();
  });

  test('FEAT-Auth-TC02 - Edit - Edit Feature as an "Author" and ensure it is not published', { tag: '@edit' }, async ({ featureHelper, basePage, anonymousHelper, navigateToCreatedContentHelper, contentModerationHelper, loginHelper, page }) =>
  {
    await featureHelper.createFeature({
      preview: false,
      mandatoryFieldCheck: false,
    });

    // edit feature
    await featureHelper.editFeature({
      preview: true
    });

    await featureHelper.AddFeatureToHomePage(false);
    // searching as anon to ensure content is not viewable as draft
    await anonymousHelper.VerifyfeatureAsAnon({ edited: false });

    // log back in and naviagte to content 
    await loginHelper.loginWithValidUser();
    await navigateToCreatedContentHelper.navigateToCreatedContent({
      active: true,
      deleted: false
    });

    // moderating to needs review 
    await contentModerationHelper.authorModerateContent({
      NeedsReview: true,
    });

    await featureHelper.AddFeatureToHomePage(false);
    // searching as anon to ensure content is not viewable as draft
    await anonymousHelper.VerifyfeatureAsAnon({ edited: false });


    // Ensure the page is not locked 
    // automatically logins based on above test data for each test
    await loginHelper.loginWithValidUser();
    await basePage.clickContentLink();
    await page.getByRole('link', { name: 'Content', exact: true }).first().hover();
    await page.waitForTimeout(1000);
    await page.getByRole('link', { name: 'Featured Content Campaigns' }).first().click();
    await page.getByRole('link', { name: 'Unlock' }).click();
    await page.getByRole('button', { name: 'Confirm break lock' }).click();
  });

  test('FEAT-Auth-TC03 - Delete - Delete Feature as an "Author"', { tag: '@delete' }, async ({ featureHelper, navigateToCreatedContentHelper }) =>
  {
    await featureHelper.createFeature({
      preview: false,
      mandatoryFieldCheck: false,
    });

    // Cancel delete feature
    await featureHelper.deleteFeature({
      delete: false,
      cancel: true
    });

    await navigateToCreatedContentHelper.navigateToCreatedContent({
      active: true,
      deleted: false
    });

    // delete feature
    await featureHelper.deleteFeature({
      delete: true,
      cancel: false
    });

    // confirm content deleted
    await navigateToCreatedContentHelper.navigateToCreatedContent({
      active: false,
      deleted: true
    });

  });

  test('FEAT-Auth-TC04 - Delete - Cannot delete Feature created by "Supervisor" as an "Author"', { tag: '@delete' }, async ({ page, testSetUpData, testData, featureHelper, navigateToCreatedContentHelper, basePage, loginHelper, contentModerationHelper, anonymousHelper }) =>
  {
    const permissionCheck = new ModerationSideBar(page, testSetUpData, testData);

    // Logging out as Before each will log in as an Author.  
    await basePage.logOut();

    // Overriding user for test data with supervisor credentials  
    testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
    testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;
    // log back in and naviagte to content 
    await loginHelper.loginWithValidUser();

    // Creating Feature as a Supervisor
    await featureHelper.createFeature({
      preview: false,
      mandatoryFieldCheck: false,
    });

    // moderating to Published
    await contentModerationHelper.supervisorModerateContent({
      NeedsReview: false,
      Published: true,
      Archive: false
    });

    // Logging out as Before each will log in as an Author.  
    await basePage.logOut();
    // Overriding user for test data with Author credentials  
    testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
    testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;

    // log back in and naviagte to content 
    await loginHelper.loginWithValidUser();

    // Navigating to Supervisors created content 
    await navigateToCreatedContentHelper.navigateToCreatedContent({
      active: true,
      deleted: false
    });

    await permissionCheck.openModerationSideBar();
    await permissionCheck.deleteButtonNotVisible();
  });

  test('FEAT-Auth-TC05 - Compare Revision - Edit Feature content and ensure user is able to compare Revisions ', { tag: '@revision' }, async ({ featureHelper, revisionHelper, testSetUpData }) =>
  {
    // creating content
    await featureHelper.createFeature({
      preview: false,
      mandatoryFieldCheck: false,
    });

    // overriding test data so that Edit test saves as Needs Review
    testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

    // edit feature
    await featureHelper.editFeature({
      preview: false
    });

    // comparing and verifying Revisions
    await revisionHelper.compareRevisions();
  });

  test('FEAT-Auth-TC06 - Delete Revision - Edit Feature content and ensure user is able to Delete Revisions', { tag: '@revision' }, async ({ featureHelper, revisionHelper, testSetUpData }) =>
  {
    // creating content
    await featureHelper.createFeature({
      preview: false,
      mandatoryFieldCheck: false,
    });

    // overriding test data so that Edit test saves as Needs Review
    testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

    // edit feature
    await featureHelper.editFeature({
      preview: false
    });

    // Cancel Deletion of Revision
    await revisionHelper.deleteRevisions({
      delete: false,
      cancel: true
    });

    // Comfirm Deletion of Revision
    await revisionHelper.deleteRevisions({
      delete: true,
      cancel: false
    });
  });

  test('FEAT-Auth-TC07 - Revert Revision - Edit Feature content and ensure user is able to Revert Revisions', { tag: '@revision' }, async ({ featureHelper, revisionHelper, testSetUpData }) =>
  {
    // creating content
    await featureHelper.createFeature({
      preview: false,
      mandatoryFieldCheck: false,
    });

    // overriding test data so that Edit test saves as Needs Review
    testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

    // edit feature
    await featureHelper.editFeature({
      preview: false
    });

    // Cancel Reverting of Revision and verify edited version is still visible
    await revisionHelper.revertRevisions({
      revert: false,
      cancel: true
    });

    // Comfirm reverting of Revision and verify inital version is now visible 
    await revisionHelper.revertRevisions({
      revert: true,
      cancel: false
    });
  });

  test('FEAT-Auth-TC08 - Workbench -  Create Feature content as an "Author", and use Workbench to complete all moderation states available', { tag: '@workbench' }, async ({ featureHelper, contentModerationHelper, workBenchHelper, navigateToCreatedContentHelper, basePage, loginHelper, testSetUpData }) =>
  {
    // creating feature as a draft and performing mandatory field check
    console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

    await featureHelper.createFeature({
      preview: false,
      mandatoryFieldCheck: false
    });

    await workBenchHelper.authorWorkBench({
      draft: true,
      needsReview: false,
      archived: false
    });

    // moderating to needs review 
    await contentModerationHelper.authorModerateContent({
      NeedsReview: true,
    });

    await workBenchHelper.authorWorkBench({
      draft: false,
      needsReview: true,
      archived: false
    });

    //Logging in as a supervisor to Archive Content as authors can view archive content but are unable to archive themseleves
    await basePage.logOut();

    // Overriding user for test data with supervisor credentials  
    testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
    testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;
    // log back in and naviagte to content 
    await loginHelper.loginWithValidUser();

    // Navigating to authors created content 
    await navigateToCreatedContentHelper.navigateToCreatedContent({
      active: true,
      deleted: false
    });

    // moderating to Archived
    await contentModerationHelper.supervisorModerateContent({
      NeedsReview: false,
      Published: false,
      Archive: true
    });

    // Logging out to complete author workbench.  
    await basePage.logOut();

    // Overriding user for test data with author credentials  
    testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
    testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;
    // log back in and naviagte to content 
    await loginHelper.loginWithValidUser();

    await workBenchHelper.authorWorkBench({
      draft: false,
      needsReview: false,
      archived: true
    });
  });
});

test.describe('Feature Supervisor Tests', { tag: ['@regression', '@feature', '@supervisor'] }, () =>
{
  // Pass the fixture for Feature Authors into the beforeEach hook
  test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
  {
    const testSteps = new TestSteps();
    await testSteps.LogInfo('Test starting');
    await testSteps.LogInfo(testInfo.title);

    // setting the isolated data for THIS specific test run
    testSetUpData.urlForTest.url = testSetUpData.validTestURLList.hse_url;
    testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
    testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;
    testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.feature;
    testSetUpData.contentTitleforTest.contentTitle = testData.Feature.title;
    testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

    // automatically logins based on above test data for each test
    await loginHelper.loginWithValidUser();
  });

  test('FEAT-Super-TC01 - Create - Create Feature content as an "Supervisor", perform mandatory field check and preview content', { tag: '@create' }, async ({ featureHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData, page, basePage }) =>
  {
    // creating feature as a draft and performing mandatory field check
    console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

    await featureHelper.createFeature({
      preview: true,
      mandatoryFieldCheck: false,
    });

    await featureHelper.AddFeatureToHomePage(false);

    // searching as anon to ensure content is not viewable as draft
    await anonymousHelper.VerifyfeatureAsAnon({ edited: false });

    // log back in and naviagte to content 
    await loginHelper.loginWithValidUser();
    await navigateToCreatedContentHelper.navigateToCreatedContent({
      active: true,
      deleted: false
    });

    // moderating to needs review 
    await contentModerationHelper.supervisorModerateContent({
      NeedsReview: true,
      Published: false,
      Archive: false
    });

    await featureHelper.AddFeatureToHomePage(false);

    // searching as anon to ensure content is not viewable as needs review 
    await anonymousHelper.VerifyfeatureAsAnon({ edited: false });

    // log back in and naviagte to content 
    await loginHelper.loginWithValidUser();
    await navigateToCreatedContentHelper.navigateToCreatedContent({
      active: true,
      deleted: false
    });

    // moderating to published  
    await contentModerationHelper.supervisorModerateContent({
      NeedsReview: false,
      Published: true,
      Archive: false
    });

    await featureHelper.AddFeatureToHomePage(false);

    // searching as anon - Content is Published and Added to Featured Content on Home Page but 
    // curent page is in a draft state - verify it is not visible
    await anonymousHelper.VerifyfeatureAsAnon({ edited: false });

    // log back in and naviagte to content 
    await loginHelper.loginWithValidUser();
    await navigateToCreatedContentHelper.navigateToFeatureContentCampaigns();

    // moderating to Needs Review 
    await contentModerationHelper.supervisorModerateContent({
      NeedsReview: true,
      Published: false,
      Archive: false
    });

    // searching as anon - Content is Published and Added to Featured Content on Home Page but 
    // curent page is in a draft state - verify it is not visible
    await anonymousHelper.VerifyfeatureAsAnon({ edited: false });

    // log back in and naviagte to content 
    await loginHelper.loginWithValidUser();
    await navigateToCreatedContentHelper.navigateToFeatureContentCampaigns();

    // moderating to Published
    await contentModerationHelper.supervisorModerateContent({
      NeedsReview: false,
      Published: true,
      Archive: false
    });

    // searching as anon - Content is Published and Added to Featured Content on Home Page but 
    // curent page is in a draft state - verify it is not visible
    await anonymousHelper.VerifyfeatureAsAnon({ edited: false });


    // // log back in and naviagte to content 
    // await loginHelper.loginWithValidUser();
    // await navigateToCreatedContentHelper.navigateToCreatedContent({
    //   active: true,
    //   deleted: false
    // });

    // // moderating to Archived  
    // await contentModerationHelper.supervisorModerateContent({
    //   NeedsReview: false,
    //   Published: false,
    //   Archive: true
    // });

    // // Ensuring Content is not visible when feature is Archived
    // await anonymousHelper.VerifyfeatureAsAnon({ edited: false });

    // Ensure the page is not locked 
    // automatically logins based on above test data for each test
    await loginHelper.loginWithValidUser();
    await basePage.clickContentLink();
    await page.getByRole('link', { name: 'Content', exact: true }).first().hover();
    await page.waitForTimeout(1000);
    await page.getByRole('link', { name: 'Featured Content Campaigns' }).first().click();
    await page.getByRole('link', { name: 'Unlock' }).click();
    await page.getByRole('button', { name: 'Confirm break lock' }).click();
  });

  test('FEAT-Super-TC02 - Edit - Edit Published Feature content and ensure edit is published as a "Supervisor" ', { tag: '@edit' }, async ({ featureHelper, anonymousHelper, contentModerationHelper, navigateToCreatedContentHelper, loginHelper, page, basePage }) =>
  {
    // creating content
    await featureHelper.createFeature({
      preview: false,
      mandatoryFieldCheck: false,
    });

    // moderating to published  
    await contentModerationHelper.supervisorModerateContent({
      NeedsReview: false,
      Published: true,
      Archive: false
    });

    // await featureHelper.AddFeatureToHomePage(false);
    // // moderating to Published
    // await contentModerationHelper.supervisorModerateContent({
    //   NeedsReview: true,
    //   Published: true,
    //   Archive: false
    // });

    // await navigateToCreatedContentHelper.navigateToCreatedContent({
    //   active: true,
    //   deleted: false
    // });

    // edit feature
    await featureHelper.editFeature({
      preview: false
    });

    // moderating to Published
    await contentModerationHelper.supervisorModerateContent({
      NeedsReview: false,
      Published: true,
      Archive: false
    });

    await featureHelper.AddFeatureToHomePage(false);
    // moderating to Published
    await contentModerationHelper.supervisorModerateContent({
      NeedsReview: false,
      Published: true,
      Archive: false
    });
    // searching as anon to verify edited content
    await anonymousHelper.VerifyfeatureAsAnon({ edited: true });
    ;

    // Ensure the page is not locked 
    // automatically logins based on above test data for each test
    await loginHelper.loginWithValidUser();
    await basePage.clickContentLink();
    await page.getByRole('link', { name: 'Content', exact: true }).first().hover();
    await page.waitForTimeout(1000);
    await page.getByRole('link', { name: 'Featured Content Campaigns' }).first().click();
    await page.getByRole('link', { name: 'Unlock' }).click();
    await page.getByRole('button', { name: 'Confirm break lock' }).click();
  });

  test('FEAT-Super-TC03 - Delete - Delete Published Feature as an "Supervisor"', { tag: '@delete' }, async ({ featureHelper, anonymousHelper, contentModerationHelper, navigateToCreatedContentHelper }) =>
  {
    // creating content
    await featureHelper.createFeature({
      preview: false,
      mandatoryFieldCheck: false,
    });

    // moderating to published  
    await contentModerationHelper.supervisorModerateContent({
      NeedsReview: false,
      Published: true,
      Archive: false
    });

    // Cancel delete feature
    await featureHelper.deleteFeature({
      delete: false,
      cancel: true
    });

    await navigateToCreatedContentHelper.navigateToCreatedContent({
      active: true,
      deleted: false
    });

    // delete feature
    await featureHelper.deleteFeature({
      delete: true,
      cancel: false
    });

    // confirm content deleted
    await navigateToCreatedContentHelper.navigateToCreatedContent({
      active: false,
      deleted: true
    });

    // searching as anon to ensure content is not viewable
    await anonymousHelper.VerifyfeatureAsAnon({ edited: false });
  });

  test('FEAT-Super-TC04 - Delete - Can delete Article created by "Author" as an "Supervisor"', { tag: '@delete' }, async ({ featureHelper, testSetUpData, basePage, loginHelper, navigateToCreatedContentHelper }) =>
  {
    // Logging out as Before each will log in as an Author.  
    await basePage.logOut();

    // Overriding user for test data with Author credentials  
    testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
    testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;
    // log in as Author
    await loginHelper.loginWithValidUser();

    // creating content
    await featureHelper.createFeature({
      preview: false,
      mandatoryFieldCheck: false,
    });

    // Logging out as Before each will log in as an Author.  
    await basePage.logOut();

    testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
    testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;

    // log back in as Supervisor
    await loginHelper.loginWithValidUser();
    await navigateToCreatedContentHelper.navigateToCreatedContent({
      active: true,
      deleted: false
    });

    // Cancel delete feature
    await featureHelper.deleteFeature({
      delete: false,
      cancel: true
    });

    await navigateToCreatedContentHelper.navigateToCreatedContent({
      active: true,
      deleted: false
    });

    // delete feature
    await featureHelper.deleteFeature({
      delete: true,
      cancel: false
    });

    // confirm content deleted
    await navigateToCreatedContentHelper.navigateToCreatedContent({
      active: false,
      deleted: true
    });
  });

  test('FEAT-Super-TC05 - Compare Revision - Edit Feature content and ensure user is able to compare Revisions ', { tag: '@revision' }, async ({ featureHelper, revisionHelper, testSetUpData }) =>
  {
    // creating content
    await featureHelper.createFeature({
      preview: false,
      mandatoryFieldCheck: false,
    });

    // overriding test data so that Edit test saves as Needs Review
    testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;
    // edit feature
    await featureHelper.editFeature({
      preview: false
    });

    // comparing and verifying Revisions
    await revisionHelper.compareRevisions();
  });

  test('FEAT-Super-TC06 - Delete Revision - Edit Feature content and ensure user is able to Delete Revisions', { tag: '@revision' }, async ({ featureHelper, revisionHelper, testSetUpData }) =>
  {
    // creating content
    await featureHelper.createFeature({
      preview: false,
      mandatoryFieldCheck: false,
    });

    // overriding test data so that Edit test saves as Needs Review
    testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;


    // edit feature
    await featureHelper.editFeature({
      preview: false
    });

    // Cancel Deletion of Revision
    await revisionHelper.deleteRevisions({
      delete: false,
      cancel: true
    });

    // Comfirm Deletion of Revision
    await revisionHelper.deleteRevisions({
      delete: true,
      cancel: false
    });
  });

  test('FEAT-Super-TC07 - Revert Revision - Edit Feature content and ensure user is able to Revert Revisions', { tag: '@revision' }, async ({ featureHelper, revisionHelper, testSetUpData }) =>
  {
    // creating content
    await featureHelper.createFeature({
      preview: false,
      mandatoryFieldCheck: false,
    });

    // overriding test data so that Edit test saves as Needs Review
    testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;


    // edit feature
    await featureHelper.editFeature({
      preview: false
    });


    // Cancel Reverting of Revision and verify edited version is still visible
    await revisionHelper.revertRevisions({
      revert: false,
      cancel: true
    });

    // Comfirm reverting of Revision and verify inital version is now visible 
    await revisionHelper.revertRevisions({
      revert: true,
      cancel: false
    });
  });

  test('FEAT-Super-TC08 - Workbench - Create Feature content as a "Supervisor", and use Workbench to complete all moderation states available', { tag: '@workbench' }, async ({ featureHelper, contentModerationHelper, workBenchHelper, testSetUpData }) =>
  {
    // creating feature as a draft and performing mandatory field check
    console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

    await featureHelper.createFeature({
      preview: false,
      mandatoryFieldCheck: false
    });

    await workBenchHelper.supervisorWorkBench({
      draft: true,
      needsReview: false,
      archived: false
    });

    // moderating to needs review 
    await contentModerationHelper.supervisorModerateContent({
      NeedsReview: true,
      Published: false,
      Archive: false
    });

    await workBenchHelper.supervisorWorkBench({
      draft: false,
      needsReview: true,
      archived: false
    });


    // moderating to archived  
    await contentModerationHelper.supervisorModerateContent({
      NeedsReview: false,
      Published: false,
      Archive: true
    });

    await workBenchHelper.supervisorWorkBench({
      draft: false,
      needsReview: false,
      archived: true
    });

  });

});
