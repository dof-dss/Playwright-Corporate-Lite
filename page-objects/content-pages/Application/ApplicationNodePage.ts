import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { expect } from '@playwright/test';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export class ApplicationNodePage
{
    // logging
    private readonly testSteps: TestSteps;

    // constructor
    constructor(
        private readonly page: Page,
        // isolated instances of test data 
        private testSetUpData: typeof TestSetUpData,
        private testData: typeof TestData
    )
    {
        // logging isolated instance
        this.testSteps = new TestSteps();
    }

    // -------------------- URL CHECK --------------------

    // check url after saving create application
    async applicationNodeURLCheck()
    {
        // escapeRegex removes all white space and replaces with '-', where '-' already exists and surrounded by 
        // white space it will just remove surrounding white space and converts all characters to lower case.
        const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();

        await this.testSteps.LogInfo(`Verifying URL path is /services/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)} with optional -suffix and optional trailing path, or is /node/.+`);
        await expect(this.page).toHaveURL(
            new RegExp(`(?:${this.testSetUpData.urlForTest.url}/services/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)}(?:-[^/]+)?(?:/.*)?$)|(?:/node/.+)`)
        );
    }

    // -------------------- Verify Application methods --------------------

    //verify application method
    async verifyApplication()
    {
        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testData.Application.title}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1 })).toHaveText(this.testData.Application.title);

        // Verify topics
        // await this.testSteps.LogInfo('Verifying Topics label is visible');
        // await expect(this.page.getByText('Topics:', { exact: true })).toBeVisible();
        // await this.testSteps.LogInfo(`Verifying topic "${this.testData.HSE_SiteTopics.topic}" is visible`);
        // await expect(this.page.getByText(this.testData.HSE_SiteTopics.topic)).toBeVisible();
        // await this.testSteps.LogInfo(`Verifying topic2 "${this.testData.HSE_SiteTopics.topic2}" is visible`);
        // await expect(this.page.getByText(this.testData.HSE_SiteTopics.topic2)).toBeVisible();

        // verify summary
        await this.testSteps.LogInfo(`Verifying Summary "${this.testData.Application.summary}" is visible`);
        await expect(this.page.getByText(this.testData.Application.summary)).toBeVisible();

        // verify Before you start H2
        await this.testSteps.LogInfo('Verifying "Before you Start" heading is visible');
        await expect(this.page.getByRole('heading', { level: 2, name: 'Before you start' })).toBeVisible();
        await this.testSteps.LogInfo(`Verifying Before you start "${this.testData.Application.beforeyoustart}" is visible`);
        await expect(this.page.getByText(this.testData.Application.beforeyoustart)).toBeVisible();

        // verify Additional information H2
        // await this.testSteps.LogInfo('Verifying Additional info heading is visible');
        // await expect(this.page.getByRole('heading', { level: 2, name: 'Additional information' })).toBeVisible();
        await this.testSteps.LogInfo(`Verifying Additional Info "${this.testData.Application.additionalinfo}" is visible`);
        await expect(this.page.getByText(this.testData.Application.additionalinfo)).toBeVisible();
    }


    //verify edited application method
    async verifyEditedApplication()
    {
        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testSetUpData.contentTitleforTest.contentTitle}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.Application.titleEdited);

        // Verify topics
        // await this.testSteps.LogInfo('Verifying Topics label is visible');
        // await expect(this.page.getByText('Topics:', { exact: true })).toBeVisible();

        // await this.testSteps.LogInfo(`Verifying Edited topic "${this.testData.HSE_SiteTopics.topicEdited}" is visible`);
        // await expect(this.page.getByText(this.testData.HSE_SiteTopics.topicEdited)).toBeVisible();
        // await this.testSteps.LogInfo(`Verifying Edited topic2 "${this.testData.HSE_SiteTopics.topic2Edited}" is NOT visible as it was set to '- None -'`);
        // await expect(this.page.getByText(this.testData.HSE_SiteTopics.topic2Edited)).toBeHidden();

        // verify summary
        await this.testSteps.LogInfo(`Verifying Edited Summary "${this.testData.Application.summaryEdited}" is visible`);
        await expect(this.page.getByText(this.testData.Application.summaryEdited)).toBeVisible();

        // verify Before you start H2
        await this.testSteps.LogInfo('Verifying Before you start Heading is visible');
        await expect(this.page.getByRole('heading', { level: 2, name: 'Before you start' })).toBeVisible();

        // verify before you start
        await this.testSteps.LogInfo(`Verifying Edited Before you start "${this.testData.Application.beforeyoustartEdited}" is visible`);
        await expect(this.page.getByText(this.testData.Application.beforeyoustartEdited)).toBeVisible();

        // // verify Additional information H2
        // await this.testSteps.LogInfo('Verifying Additional information is visible');
        // await expect(this.page.getByRole('heading', { level: 2, name: 'Additional information' })).toBeVisible();

        // verify addtional info
        await this.testSteps.LogInfo(`Verifying Additional Information "${this.testData.Application.additionalinfoEdited}" is visible`);
        await expect(this.page.getByText(this.testData.Application.additionalinfoEdited)).toBeVisible();
    }
}