import { Page, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export class NewsComparePage
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

    // check url after saving create news
    async newsNodeURLCheck()
    {
        // escapeRegex removes all white space and replaces with '-', where '-' already exists and surrounded by 
        // white space it will just remove surrounding white space and converts all characters to lower case.
        const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();
        await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/articles/${this.testSetUpData.contentTitleforTest.contentTitle}"`);

        await expect(this.page).toHaveURL(
            new RegExp(this.testSetUpData.urlForTest.url + `/newss/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)}$`)
        );
    }

    // -------------------- Verify News methods --------------------

    //verify news when being compared method
    async verifyCompareNews()
    {
        const formatDate = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

        //-------------------- TITLE --------------------
        const title = this.page.locator('//h2/a/span');
        await this.testSteps.LogInfo('Verifying old title text was removed');
        await expect(title.locator('del')).toHaveText('New');
        await this.testSteps.LogInfo('Verifying edited title text was added');
        await expect(title.locator('ins')).toHaveText('Edited');

        //-------------------- DATE PUBLISHED --------------------
        const publishedDate = this.page.locator('//span[contains(text(),"Date published: ")]//following-sibling::span');
        await this.testSteps.LogInfo(`Verifying old published date "${formatDate(this.testData.News.publicationDate)}" was removed`);
        await expect(publishedDate.locator('del')).toHaveText(formatDate(this.testData.News.publicationDate));
        await this.testSteps.LogInfo(`Verifying edited published date "${formatDate(this.testData.News.publicationDateEdited)}" was added`);
        await expect(publishedDate.locator('ins')).toHaveText(formatDate(this.testData.News.publicationDateEdited));

        //-------------------- TOPICS --------------------
        // const topicsList = this.page.locator('//span[contains(@class,"site-topics--label") and normalize-space(.)="Topics:"]/following-sibling::span[contains(@class,"site-topics--list")]');
        // const removedTopic = this.testData.News.topics[this.testData.News.topics.length - 1];
        // const removedTopicItem = topicsList.locator('.site-topics--item').filter({ hasText: removedTopic });
        // await this.testSteps.LogInfo(`Verifying topic "${removedTopic}" was removed`);
        // await expect(removedTopicItem.locator('del')).toHaveText(removedTopic);

        // for (const topic of this.testData.News.topicsEdited)
        // {
        //     const topicItem = topicsList.locator('.site-topics--item').filter({ hasText: topic });
        //     await this.testSteps.LogInfo(`Verifying edited topic "${topic}" is visible`);
        //     await expect(topicItem).toContainText(topic);
        // }

        // const insertedTopic = this.testData.News.topicsEdited[0];
        // const insertedTopicItem = topicsList.locator('.site-topics--item').filter({ hasText: insertedTopic });
        // await this.testSteps.LogInfo(`Verifying topic "${insertedTopic}" was added`);
        // await expect(insertedTopicItem.locator('ins')).toHaveText(insertedTopic);

        //-------------------- Introductory Paragraph --------------------
        const introductoryParagraph = this.page.locator('p').filter({ hasText: 'introductory paragraph' });
        await this.testSteps.LogInfo('Verifying old introductory paragraph text was removed');
        await expect(introductoryParagraph.locator('del')).toHaveText('new');
        await this.testSteps.LogInfo('Verifying edited introductory paragraph text was added');
        await expect(introductoryParagraph.locator('ins')).toHaveText('edited');

        //-------------------- BODY FIELD --------------------
        const body = this.page.locator('p').filter({ hasText: 'news body field' });
        await this.testSteps.LogInfo('Verifying old body text was removed');
        await expect(body.locator('del')).toHaveText('new');
        await this.testSteps.LogInfo('Verifying edited body text was added');
        await expect(body.locator('ins')).toHaveText('edited');

        //-------------------- NOTES TO EDITORS --------------------
        const notesToEditors = this.page.locator('//div[text()="Notes to editors"]/following-sibling::div');
        await this.testSteps.LogInfo('Verifying old note text was removed');
        await expect(notesToEditors.locator('del')).toHaveText('new');
        await this.testSteps.LogInfo('Verifying edited note text was added');
        await expect(notesToEditors.locator('ins')).toHaveText('edited');

        //-------------------- TEASER --------------------
        const teaser = this.page.locator('//div[text()="Teaser"]/following-sibling::div');
        await this.testSteps.LogInfo('Verifying old teaser text was removed');
        await expect(teaser.locator('del')).toHaveText('new');
        await this.testSteps.LogInfo('Verifying edited teaser text was added');
        await expect(teaser.locator('ins')).toHaveText('edited');

        //-------------------- PHOTO --------------------
        await this.testSteps.LogInfo(`Verifying original photo caption "${this.testData.Media.imageCaption}" was removed`);
        await expect(this.page.locator('del').filter({ hasText: this.testData.Media.imageCaption })).toBeVisible();
        await this.testSteps.LogInfo('Verifying replacement photo is visible');
        await expect(this.page.locator('ins img')).toBeVisible();

        //-------------------- NEWS TYPE --------------------
        const newsType = this.page.locator('//div[text()="News type"]/following-sibling::div');
        await this.testSteps.LogInfo('Verifying "News story" has been removed from the news type');
        await expect(newsType.locator('del')).toHaveText('News story');

        await this.testSteps.LogInfo('Verifying "Press release" has been added to the news type');
        await expect(newsType.locator('ins')).toHaveText('Press release');
    }
}