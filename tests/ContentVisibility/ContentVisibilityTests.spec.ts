import { TestSteps } from '@poms/base-pages/TestSteps';
import { test } from '@fixtures/MyFixtures';
import { ContentVisibilityHelper } from '@helpers/general/ContentVisibilityHelper';

const urlTargets = [
    { label: 'AFBI', urlKey: 'afbi_url' },
    { label: 'ETINI', urlKey: 'etini_url' },
    { label: 'HSENI', urlKey: 'hse_url' },
    { label: 'NSMC', urlKey: 'nmsc_url' },
    { label: 'NISRA', urlKey: 'nisra_url' },
] as const;

const roleConfigs = [
    {
        describeName: 'Content Visibility Author Tests',
        testPrefix: 'CV-AUTH-TC',
        usernameKey: 'author_username',
        passwordKey: 'author_password'
    },
    {
        describeName: 'Content Visibility Supervisor Tests',
        testPrefix: 'CV-SUP-TC',
        usernameKey: 'supervisor_username',
        passwordKey: 'supervisor_password'
    },



] as const;

for (const role of roleConfigs)
{
    test.describe(role.describeName, () =>
    {
        for (const [index, urlTarget] of urlTargets.entries())
        {
            const testCaseNumber = String(index + 1).padStart(2, '0');
            const testCaseId = `${role.testPrefix}${testCaseNumber}`;

            test.describe(`${testCaseId} - ${urlTarget.label}`, () =>
            {
                test.beforeEach(async ({ loginHelper, testSetUpData }, testInfo) =>
                {
                    const testSteps = new TestSteps();
                    await testSteps.LogInfo('Test starting');
                    await testSteps.LogInfo(testInfo.title);

                    testSetUpData.urlForTest.url = testSetUpData.validTestURLList[urlTarget.urlKey];
                    testSetUpData.userForTest.username = testSetUpData.validUserList[role.usernameKey];
                    testSetUpData.userForTest.password = testSetUpData.validUserList[role.passwordKey];

                    await loginHelper.loginWithValidUser();
                });

                test(`${testCaseId} - ${urlTarget.label} - Verify Correct Content visibility`, { tag: '@regression' },
                    async ({ page, testSetUpData }) =>
                    {
                        const contentVisibilityHelper = new ContentVisibilityHelper(page, testSetUpData);
                        await contentVisibilityHelper.ContentVisibility();
                    });
            });
        }
    });
}


