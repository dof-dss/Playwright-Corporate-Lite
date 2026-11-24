import { TestSteps } from '@poms/base-pages/TestSteps';
import { test } from '@fixtures/MyFixtures';
import { LINK_TYPES } from '@poms/content-pages/Link/LinkCreatePage';
import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';
import { expect } from '@playwright/test';

test.describe('Link Author Tests', { tag: ['@regression', '@link', '@author'] }, () =>
{
  test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
  {
    const testSteps = new TestSteps();
    await testSteps.LogInfo('Test starting');
    await testSteps.LogInfo(testInfo.title);

    testSetUpData.urlForTest.url = testSetUpData.validTestURLList.nisra_url;
    testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
    testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;
    testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.link;
    testSetUpData.contentTitleforTest.contentTitle = testData.Link.title;
    testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

    await loginHelper.loginWithValidUser();
  });

  LINK_TYPES.forEach((linkType, index) =>
  {
    const caseNumber = String(index + 1).padStart(2, '0');
    test(`Link-Auth-TC${caseNumber} - Create - Create Link (${linkType}) content as an "Author", perform mandatory field check and preview content`, { tag: '@create' },
      async ({ linkHelper, applicationHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData, testData, basePage, homePage }) =>
      {
        testData.Link.linkType = linkType;
        await linkHelper.createLink({
          preview: true,
          mandatoryFieldCheck: false,
        });

            // Need to login as homepage supervisor before reordering the link
        testSetUpData.userForTest.username = testSetUpData.validUserList.homepage_supervisor_username;
        testSetUpData.userForTest.password = testSetUpData.validUserList.homepage_supervisor_password;
        await basePage.logOut();
        await homePage.homePageURLCheck();
        await loginHelper.loginWithValidUser();
        await basePage.clickContentLink();
        await linkHelper.reorderLink(false);


        // searching as anon to ensure content is not viewable as draft
        await anonymousHelper.verifyLinkAsAnon({
          edited: false,
        });

        // log in as author as Homepage can not view Links
        testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
        testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;
        // log back in and naviagte to content
        await loginHelper.loginWithValidUser();
        await navigateToCreatedContentHelper.navigateToCreatedContent({
          active: true,
          deleted: false
        });

        await contentModerationHelper.authorModerateContent({
          NeedsReview: true,
        });

        await anonymousHelper.verifyLinkAsAnon({ edited: false });
      });
  });

  LINK_TYPES.forEach((linkType, index) =>
  {
    const caseNumber = String(index + 3).padStart(2, '0');
    test(`Link-Auth-TC${caseNumber} - Edit - Edit Link (${linkType}) as an "Author" and ensure it is not published`, { tag: '@edit' },
      async ({ linkHelper, applicationHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData, testData, basePage, homePage }) =>
      {
        testData.Link.linkType = linkType;
        await linkHelper.createLink({
          preview: false,
          mandatoryFieldCheck: false,
        });

        // Need to login as homepage supervisor before reordering the link
        testSetUpData.userForTest.username = testSetUpData.validUserList.homepage_supervisor_username;
        testSetUpData.userForTest.password = testSetUpData.validUserList.homepage_supervisor_password;
        await basePage.logOut();
        await homePage.homePageURLCheck();
        await loginHelper.loginWithValidUser();
        await basePage.clickContentLink();
        await linkHelper.reorderLink(false);

        // Verify the published edit as an anonymous user.
        await anonymousHelper.verifyLinkAsAnon({
          edited: false,
        });


        // log in as author as Homepage can not view Links
        testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
        testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;
        // log back in and naviagte to content
        await loginHelper.loginWithValidUser();
        await navigateToCreatedContentHelper.navigateToCreatedContent({
          active: true,
          deleted: false
        });

        await linkHelper.editLink({
          preview: true
        });

        await anonymousHelper.verifyLinkAsAnon({ edited: true });
      });
  });

  LINK_TYPES.forEach((linkType, index) =>
  {
    const caseNumber = String(index + 5).padStart(2, '0');
    test(`Link-Auth-TC${caseNumber} - Delete - Delete Link (${linkType}) as an "Author"`, { tag: '@delete' },
      async ({ linkHelper, applicationHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData, testData, basePage, homePage }) =>
      {
        testData.Link.linkType = linkType;
        await linkHelper.createLink({
          preview: false,
          mandatoryFieldCheck: false,
        });

          // Need to login as homepage supervisor before reordering the link
        testSetUpData.userForTest.username = testSetUpData.validUserList.homepage_supervisor_username;
        testSetUpData.userForTest.password = testSetUpData.validUserList.homepage_supervisor_password;
        await basePage.logOut();
        await homePage.homePageURLCheck();
        await loginHelper.loginWithValidUser();
        await basePage.clickContentLink();
        await linkHelper.reorderLink(false);


        // searching as anon to ensure content is not viewable as draft
        await anonymousHelper.verifyLinkAsAnon({
          edited: false,
        });

        // log in as author as Homepage can not view Links
        testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
        testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;
        // log back in and naviagte to content
        await loginHelper.loginWithValidUser();
        await navigateToCreatedContentHelper.navigateToCreatedContent({
          active: true,
          deleted: false
        });

        await linkHelper.deleteLink({
          delete: false,
          cancel: true
        });

        await navigateToCreatedContentHelper.navigateToCreatedContent({
          active: true,
          deleted: false
        });

        await linkHelper.deleteLink({
          delete: true,
          cancel: false
        });

        await navigateToCreatedContentHelper.navigateToCreatedContent({
          active: false,
          deleted: true
        });
      });
  });

  LINK_TYPES.forEach((linkType, index) =>
  {
    const caseNumber = String(index + 7).padStart(2, '0');
    test(`Link-Auth-TC${caseNumber} - Delete - Cannot delete Link (${linkType}) created by a "Supervisor" as an "Author"`, { tag: '@delete' },
      async ({ page, testSetUpData, homePage, testData, linkHelper, navigateToCreatedContentHelper, basePage, loginHelper, contentModerationHelper, anonymousHelper }) =>
      {
        const permissionCheck = new ModerationSideBar(page, testSetUpData, testData);

        testData.Link.linkType = linkType;
        await basePage.logOut();

        testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
        testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;
        await loginHelper.loginWithValidUser();

        await linkHelper.createLink({
          preview: false,
          mandatoryFieldCheck: false,
        });

        await contentModerationHelper.supervisorModerateContent({
          NeedsReview: false,
          Published: true,
          Archive: false
        });

          // Need to login as homepage supervisor before reordering the link
        testSetUpData.userForTest.username = testSetUpData.validUserList.homepage_supervisor_username;
        testSetUpData.userForTest.password = testSetUpData.validUserList.homepage_supervisor_password;
        await basePage.logOut();
        await homePage.homePageURLCheck();
        await loginHelper.loginWithValidUser();
        await basePage.clickContentLink();
        await linkHelper.reorderLink(false);


        // searching as anon to ensure content is not viewable as draft
        await anonymousHelper.verifyLinkAsAnon({
          edited: false,
        });

        // log in as Author as Homepage can not view Links
        testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
        testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;
        await loginHelper.loginWithValidUser();
        await navigateToCreatedContentHelper.navigateToCreatedContent({
          active: true,
          deleted: false
        });

        await permissionCheck.openModerationSideBar();
        await permissionCheck.deleteButtonNotVisible();

        await anonymousHelper.verifyLinkAsAnon({ edited: false });
      });
  });

  LINK_TYPES.forEach((linkType, index) =>
  {
    const caseNumber = String(index + 9).padStart(2, '0');
    test(`Link-Auth-TC${caseNumber} - Compare Revision - Edit Link (${linkType}) and compare revisions`, { tag: '@revision' },
      async ({ linkHelper, revisionHelper, testSetUpData, testData }) =>
      {
        testData.Link.linkType = linkType;
        await linkHelper.createLink({
          preview: false,
          mandatoryFieldCheck: false,
        });

        testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;
        await linkHelper.editLink({
          preview: false
        });

        await revisionHelper.compareRevisions();
      });
  });

  LINK_TYPES.forEach((linkType, index) =>
  {
    const caseNumber = String(index + 11).padStart(2, '0');
    test(`Link-Auth-TC${caseNumber} - Delete Revision - Edit Link (${linkType}) and delete revisions`, { tag: '@revision' },
      async ({ linkHelper, revisionHelper, testSetUpData, testData }) =>
      {
        testData.Link.linkType = linkType;
        await linkHelper.createLink({
          preview: false,
          mandatoryFieldCheck: false,
        });

        testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;
        await linkHelper.editLink({
          preview: false
        });

        await revisionHelper.deleteRevisions({
          delete: false,
          cancel: true
        });

        await revisionHelper.deleteRevisions({
          delete: true,
          cancel: false
        });
      });
  });

  LINK_TYPES.forEach((linkType, index) =>
  {
    const caseNumber = String(index + 13).padStart(2, '0');
    test(`Link-Auth-TC${caseNumber} - Revert Revision - Edit Link (${linkType}) and revert revisions`, { tag: '@revision' },
      async ({ linkHelper, revisionHelper, testSetUpData, testData }) =>
      {
        testData.Link.linkType = linkType;
        await linkHelper.createLink({
          preview: false,
          mandatoryFieldCheck: false,
        });

        testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;
        await linkHelper.editLink({
          preview: false
        });

        await revisionHelper.revertRevisions({
          revert: false,
          cancel: true
        });

        await revisionHelper.revertRevisions({
          revert: true,
          cancel: false
        });
      });
  });

  LINK_TYPES.forEach((linkType, index) =>
  {
    const caseNumber = String(index + 15).padStart(2, '0');
    test(`Link-Auth-TC${caseNumber} - Workbench - Create Link (${linkType}) as an "Author" and complete available moderation states`, { tag: '@workbench' },
      async ({ linkHelper, contentModerationHelper, workBenchHelper, navigateToCreatedContentHelper, basePage, loginHelper, testSetUpData, testData }) =>
      {
        testData.Link.linkType = linkType;
        await linkHelper.createLink({
          preview: false,
          mandatoryFieldCheck: false
        });

        await workBenchHelper.authorWorkBench({
          draft: true,
          needsReview: false,
          archived: false
        });

        await contentModerationHelper.authorModerateContent({
          NeedsReview: true,
        });

        await workBenchHelper.authorWorkBench({
          draft: false,
          needsReview: true,
          archived: false
        });

        await basePage.logOut();

        testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
        testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;
        await loginHelper.loginWithValidUser();

        await navigateToCreatedContentHelper.navigateToCreatedContent({
          active: true,
          deleted: false
        });

        await contentModerationHelper.supervisorModerateContent({
          NeedsReview: false,
          Published: false,
          Archive: true
        });

        await basePage.logOut();

        testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
        testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;
        await loginHelper.loginWithValidUser();

        await workBenchHelper.authorWorkBench({
          draft: false,
          needsReview: false,
          archived: true
        });
      });
  });
});

test.describe('Link Supervisor Tests', { tag: ['@regression', '@link', '@supervisor'] }, () =>
{
  // Pass the fixture for Link Supervisors into the beforeEach hook
  test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
  {
    const testSteps = new TestSteps();
    await testSteps.LogInfo('Test starting');
    await testSteps.LogInfo(testInfo.title);

    // setting the isolated data for THIS specific test run
    testSetUpData.urlForTest.url = testSetUpData.validTestURLList.nisra_url;
    testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
    testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;
    testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.link;
    testSetUpData.contentTitleforTest.contentTitle = testData.Link.title;
    testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

    // automatically logins based on above test data for each test
    await loginHelper.loginWithValidUser();
  });

  const tc01LinkTypes = LINK_TYPES;

  tc01LinkTypes.forEach((linkType, index) =>
  {
    const caseNumber = String(index + 1).padStart(2, '0');
    test(`Link-Super-TC${caseNumber} - Create - Create Link (${linkType}) content as an "HomePage Supervisor", perform mandatory field check and preview content`, { tag: '@create' },
      async ({ linkHelper, applicationHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData, testData, basePage, homePage }) =>
      {
        // creating link as a draft and performing mandatory field check
        console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');
        testSetUpData.moderationStateForTest.moderationState = testSetUpData.validModerationStates.draft;

        // Set linkType for this test iteration
        testData.Link.linkType = linkType;

        await linkHelper.createLink({
          preview: true,
          mandatoryFieldCheck: false,
        });


        // Need to login as homepage supervisor before reordering the link
        testSetUpData.userForTest.username = testSetUpData.validUserList.homepage_supervisor_username;
        testSetUpData.userForTest.password = testSetUpData.validUserList.homepage_supervisor_password;
        await basePage.logOut();
        await homePage.homePageURLCheck();
        await loginHelper.loginWithValidUser();
        await basePage.clickContentLink();
        await linkHelper.reorderLink(false);


        // searching as anon to ensure content is not viewable as draft
        await anonymousHelper.verifyLinkAsAnon({
          edited: false,
        });

        // log in as supervisor as Homepage can not view Links
        testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
        testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;
        // log back in and naviagte to content
        await loginHelper.loginWithValidUser();
        await navigateToCreatedContentHelper.navigateToCreatedContent({
          active: true,
          deleted: false
        });

        // moderating to needs review
        await contentModerationHelper.supervisorModerateContent({
          Draft: false,
          NeedsReview: true,
          Published: false,
          Archive: false
        });

        // searching as anon to ensure content is not viewable as Needs Review
        await anonymousHelper.verifyLinkAsAnon({
          edited: false,
        });

        // log back in and naviagte to content
        await loginHelper.loginWithValidUser();
        await navigateToCreatedContentHelper.navigateToCreatedContent({
          active: true,
          deleted: false
        });

        // moderating to published
        await contentModerationHelper.supervisorModerateContent({
          Draft: false,
          NeedsReview: false,
          Published: true,
          Archive: false
        });

        // searching as anon to ensure content is viewable as it is published
        await anonymousHelper.verifyLinkAsAnon({
          edited: false,
        });

        // log back in and naviagte to content
        await loginHelper.loginWithValidUser();
        await navigateToCreatedContentHelper.navigateToCreatedContent({
          active: true,
          deleted: false
        });

        // moderating to archived
        await contentModerationHelper.supervisorModerateContent({
          Draft: false,
          NeedsReview: false,
          Published: false,
          Archive: true
        });

        // searching as anon to ensure content is not viewable when archived
        await anonymousHelper.verifyLinkAsAnon({
          edited: false,
        });
      });
  });

  tc01LinkTypes.forEach((linkType, index) =>
  {
    const caseNumber = String(index + 3).padStart(2, '0');
    test(`Link-Super-TC${caseNumber} - Edit - Edit Published Link (${linkType}) content and ensure edit is published as a "Supervisor"`, { tag: '@edit' },
      async ({ linkHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData, testData, basePage, homePage }) =>
      {
        console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

        // Set linkType for this test iteration
        testData.Link.linkType = linkType;

        await linkHelper.createLink({
          preview: false,
          mandatoryFieldCheck: false,
        });

        // moderating to published
        await contentModerationHelper.supervisorModerateContent({
          Draft: false,
          NeedsReview: false,
          Published: true,
          Archive: false
        });

        // Need to login as homepage supervisor before reordering the link
        testSetUpData.userForTest.username = testSetUpData.validUserList.homepage_supervisor_username;
        testSetUpData.userForTest.password = testSetUpData.validUserList.homepage_supervisor_password;
        await basePage.logOut();
        await homePage.homePageURLCheck();
        await loginHelper.loginWithValidUser();
        await basePage.clickContentLink();
        await linkHelper.reorderLink(false);

        // Verify the published edit as an anonymous user.
        await anonymousHelper.verifyLinkAsAnon({
          edited: false,
        });


        // log in as supervisor as Homepage can not view Links
        testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
        testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;
        // log back in and naviagte to content
        await loginHelper.loginWithValidUser();
        await navigateToCreatedContentHelper.navigateToCreatedContent({
          active: true,
          deleted: false
        });

        // edit link
        await linkHelper.editLink({
          preview: true
        });
        expect(testSetUpData.contentTitleforTest.contentTitle).toBe(testData.Link.titleEdited);

        // moderating edited content to published
        await contentModerationHelper.supervisorModerateContent({
          Draft: false,
          NeedsReview: false,
          Published: true,
          Archive: false
        });

        // Need to login as homepage supervisor before reordering the link
        testSetUpData.userForTest.username = testSetUpData.validUserList.homepage_supervisor_username;
        testSetUpData.userForTest.password = testSetUpData.validUserList.homepage_supervisor_password;
        await basePage.logOut();
        await homePage.homePageURLCheck();
        await loginHelper.loginWithValidUser();
        await basePage.clickContentLink();
        await linkHelper.reorderLink(true);


        // Verify the published edit as an anonymous user.
        await anonymousHelper.verifyLinkAsAnon({
          edited: true,
        });
      });
  });

  tc01LinkTypes.forEach((linkType, index) =>
  {
    const caseNumber = String(index + 5).padStart(2, '0');
    test(`Link-Super-TC${caseNumber} - Delete - Delete Published Link (${linkType}) as a "Supervisor" and confirm it isnt viewable as an anon user`, { tag: '@delete' },
      async ({ linkHelper, anonymousHelper, loginHelper, applicationHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData, testData, basePage, homePage }) =>
      {
        // creating link as a draft and performing mandatory field check
        console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');
        testSetUpData.moderationStateForTest.moderationState = testSetUpData.validModerationStates.draft;

        // Set linkType for this test iteration
        testData.Link.linkType = linkType;

        await linkHelper.createLink({
          preview: true,
          mandatoryFieldCheck: false,
        });


        // Need to login as homepage supervisor before reordering the link
        testSetUpData.userForTest.username = testSetUpData.validUserList.homepage_supervisor_username;
        testSetUpData.userForTest.password = testSetUpData.validUserList.homepage_supervisor_password;
        await basePage.logOut();
        await homePage.homePageURLCheck();
        await loginHelper.loginWithValidUser();
        await basePage.clickContentLink();
        await linkHelper.reorderLink(false);


        // searching as anon to ensure content is not viewable as draft
        await anonymousHelper.verifyLinkAsAnon({
          edited: false,
        });

        // log in as supervisor as Homepage can not view Links
        testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
        testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;
        // log back in and naviagte to content
        await loginHelper.loginWithValidUser();
        await navigateToCreatedContentHelper.navigateToCreatedContent({
          active: true,
          deleted: false
        });


        // Cancel delete link
        await linkHelper.deleteLink({
          delete: false,
          cancel: true
        });

        await anonymousHelper.verifyLinkAsAnon({
          edited: false,
        });

        // log back in and naviagte to content
        await loginHelper.loginWithValidUser();

        await navigateToCreatedContentHelper.navigateToCreatedContent({
          active: true,
          deleted: false
        });

        // delete link
        await linkHelper.deleteLink({
          delete: true,
          cancel: false
        });

        // confirm content deleted
        await navigateToCreatedContentHelper.navigateToCreatedContent({
          active: false,
          deleted: true
        });

        await anonymousHelper.verifyLinkAsAnon({
          edited: false,
        });
      });
  });


  test('Link-Super-TC07 - Compare Revision - Edit Link content and ensure user is able to compare Revisions ', { tag: '@revision' },
    async ({ linkHelper, revisionHelper, testSetUpData }) =>
    {
      // creating content
      await linkHelper.createLink({
        preview: false,
        mandatoryFieldCheck: false,
      });

      // overriding test data so that Edit test saves as Needs Review
      testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

      // edit link
      await linkHelper.editLink({
        preview: false
      });

      // comparing and verifying Revisions
      await revisionHelper.compareRevisions();
    });

  test('Link-Super-TC08 - Delete Revision - Edit Link content and ensure user is able to Delete Revisions', { tag: '@revision' },
    async ({ linkHelper, revisionHelper, testSetUpData }) =>
    {
      // creating content
      await linkHelper.createLink({
        preview: false,
        mandatoryFieldCheck: false,
      });

      // overriding test data so that Edit test saves as Needs Review
      testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

      // edit link
      await linkHelper.editLink({
        preview: false
      });

      // Cancel Deletion of Revision
      await revisionHelper.deleteRevisions({
        delete: false,
        cancel: true
      });

      // Confirm Deletion of Revision
      await revisionHelper.deleteRevisions({
        delete: true,
        cancel: false
      });
    });

  test('Link-Super-TC09 - Revert Revision - Edit Link content and ensure user is able to Revert Revisions', { tag: '@revision' },
    async ({ linkHelper, revisionHelper, testSetUpData }) =>
    {
      // creating content
      await linkHelper.createLink({
        preview: false,
        mandatoryFieldCheck: false,
      });

      // overriding test data so that Edit test saves as Needs Review
      testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

      // edit link
      await linkHelper.editLink({
        preview: false
      });

      // Cancel Reverting of Revision and verify edited version is still visible
      await revisionHelper.revertRevisions({
        revert: false,
        cancel: true
      });

      // Confirm reverting of Revision and verify initial version is now visible
      await revisionHelper.revertRevisions({
        revert: true,
        cancel: false
      });
    });

  test('Link-Super-TC10 - Workbench -  Create Link content as an "Supervisor", and use Workbench to complete all moderation states', { tag: '@workbench' },
    async ({ linkHelper, contentModerationHelper, workBenchHelper, testSetUpData }) =>
    {
      // creating link as a draft and performing mandatory field check
      console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

      await linkHelper.createLink({
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
        Draft: false,
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
        Draft: false,
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

  tc01LinkTypes.forEach((linkType, index) =>
  {
    const caseNumber = String(index + 11).padStart(2, '0');
    test(`Link-Super-TC${caseNumber} - Value Checker - Create and Publish link (${linkType}), ensure no more than 8 links are displayed in the matching section`, { tag: '@regression' },
      async ({ linkHelper, anonymousHelper, contentModerationHelper, testSetUpData, testData, homePage, basePage, loginHelper }) =>
    {
      // creating link as a draft and performing mandatory field check
      console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

      testData.Link.linkType = linkType;

      await linkHelper.createLink({
          preview: false,
          mandatoryFieldCheck: false,
        });

        // moderating to published
        await contentModerationHelper.supervisorModerateContent({
          Draft: false,
          NeedsReview: false,
          Published: true,
          Archive: false
        });

        // Need to login as homepage supervisor before reordering the link
        testSetUpData.userForTest.username = testSetUpData.validUserList.homepage_supervisor_username;
        testSetUpData.userForTest.password = testSetUpData.validUserList.homepage_supervisor_password;
        await basePage.logOut();
        await homePage.homePageURLCheck();
        await loginHelper.loginWithValidUser();
        await basePage.clickContentLink();
        await linkHelper.reorderLink(false);

        // Verify the published edit as an anonymous user.
        await anonymousHelper.verifyLinkAsAnon({
          edited: false,
        });
        
      await homePage.verifyLinksMaxItems();
      });
  });
});
