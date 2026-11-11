import { TestSteps } from '@poms/base-pages/TestSteps';
import { test } from '@fixtures/MyFixtures';
import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';

test.describe('Duplicate Title Author Tests', () =>
{
    // Pass the fixture for Application Authors into the beforeEach hook
    test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
    {
        const testSteps = new TestSteps();
        await testSteps.LogInfo('Test starting');
        await testSteps.LogInfo(testInfo.title);

        // setting the isolated data for THIS specific test run
        testSetUpData.urlForTest.url = testSetUpData.validTestURLList.nisra_url;
        testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
        testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;
        testSetUpData.contentTitleforTest.contentTitle = testData.duplicated.title;
        testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;


        // automatically logins based on above test data for each test
        await loginHelper.loginWithValidUser();
    });

    test('MIS-Auth-TC01 - Duplicate Title - Create content as an "Author", create duplicate content and create a different content type but duplicate title on thesame site', { tag: "@regression" },
        async ({ contactHelper, newsHelper, testSetUpData, testData }) =>
        {
            // creating application as a draft and performing mandatory field check
            console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');
            testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.contact;
            // Overiding content unique title in test data to create content with same name
            testData.Contact.title = testData.duplicated.title;
            testData.News.title = testData.duplicated.title;


            await contactHelper.createContact({
                preview: false,
                mandatoryFieldCheck: false,
                duplicateTitle: false,
            });

            await contactHelper.createContact({
                preview: false,
                mandatoryFieldCheck: false,
                duplicateTitle: true,
            });

            // overriding content type to article for creating article with same name as application
            // duplicateTitle value set to false as different content type on same site can have same title without conflict
            testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.news;
            await newsHelper.createNews({
                preview: false,
                mandatoryFieldCheck: false,
                duplicateTitle: false,
            });
        });

    test('MIS-Author-TC02 - Duplicate Title - Create content as an "Author" on one site and ensure the same content can be created with the same name on another', { tag: "@regression" },
        async ({ profileHelper, articleHelper, loginHelper, testSetUpData, testData }) =>
        {
            // creating application as a draft and performing mandatory field check
            console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');
            testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.profile;
            // Overiding content unique title in test data to create content with same name
            testData.Contact.title = testData.duplicated.title;
            testData.News.title = testData.duplicated.title;

            await profileHelper.createProfile({
                preview: false,
                mandatoryFieldCheck: false,
            });

            testSetUpData.urlForTest.url = testSetUpData.validTestURLList.hse_url;
            testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.profile;


            // automatically logins based on above test data for each test
            await loginHelper.loginWithValidUser();
            await profileHelper.createProfile({
                preview: false,
                mandatoryFieldCheck: false,
            });

             testSetUpData.urlForTest.url = testSetUpData.validTestURLList.etini_url;
            testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.profile;
            // automatically logins based on above test data for each test
            await loginHelper.loginWithValidUser();
            await profileHelper.createProfile({
                preview: false,
                mandatoryFieldCheck: false,
            });
        });
});

test.describe('Duplicate Title Supervisor Tests', () =>
{
    // Pass the fixture for Application Authors into the beforeEach hook
    test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
    {
        const testSteps = new TestSteps();
        await testSteps.LogInfo('Test starting');
        await testSteps.LogInfo(testInfo.title);

        // setting the isolated data for THIS specific test run
        testSetUpData.urlForTest.url = testSetUpData.validTestURLList.nisra_url;
        testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
        testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;
        testSetUpData.contentTitleforTest.contentTitle = testData.duplicated.title;
        testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

        // automatically logins based on above test data for each test
        await loginHelper.loginWithValidUser();
    });

    test('MIS-Super-TC01 - Duplicate Title - Create content as an "Supervisor", create duplicate content and create a different content type but duplicate title on thesame site', { tag: "@regression" },
        async ({ contactHelper, newsHelper, testSetUpData, testData }) =>
        {
            console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');
            testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.contact;
            // Overiding content unique title in test data to create content with same name
            testData.Contact.title = testData.duplicated.title;
            testData.News.title = testData.duplicated.title;

            await contactHelper.createContact({
                preview: false,
                mandatoryFieldCheck: false,
                duplicateTitle: false,
            });

            await contactHelper.createContact({
                preview: false,
                mandatoryFieldCheck: false,
                duplicateTitle: true,
            });

            // overriding content type to article for creating article with same name as application
            // duplicateTitle value set to false as different content type on same site can have same title without conflict
            testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.news;
            await newsHelper.createNews({
                preview: false,
                mandatoryFieldCheck: false,
                duplicateTitle: false,
            });
        });

    test('MIS-Super-TC02 - Duplicate Title - Create content as an "Supervisor" on one site and ensure the same content can be created with the same name on another', { tag: "@regression" },
        async ({ profileHelper, loginHelper, testSetUpData, testData }) =>
        {
            // creating application as a draft and performing mandatory field check
            console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');
            testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.profile;
            // Overiding content unique title in test data to create content with same name
            testData.Contact.title = testData.duplicated.title;
            testData.News.title = testData.duplicated.title;

            await profileHelper.createProfile({
                preview: false,
                mandatoryFieldCheck: false,
            });

            testSetUpData.urlForTest.url = testSetUpData.validTestURLList.hse_url;
            testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.profile;
            // automatically logins based on above test data for each test
            await loginHelper.loginWithValidUser();
            await profileHelper.createProfile({
                preview: false,
                mandatoryFieldCheck: false,
            });

            testSetUpData.urlForTest.url = testSetUpData.validTestURLList.etini_url;
            testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.profile;
            // automatically logins based on above test data for each test
            await loginHelper.loginWithValidUser();
            await profileHelper.createProfile({
                preview: false,
                mandatoryFieldCheck: false,
            });
        });
});