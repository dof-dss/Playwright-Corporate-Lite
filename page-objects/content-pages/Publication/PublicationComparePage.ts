import { Page, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export class PublicationComparePage
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

    // check url after saving create publication
    async publicationNodeURLCheck()
    {
        // escapeRegex removes all white space and replaces with '-', where '-' already exists and surrounded by 
        // white space it will just remove surrounding white space and converts all characters to lower case.
        const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();
        await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/publications/${this.testSetUpData.contentTitleforTest.contentTitle}"`);

        await expect(this.page).toHaveURL(
            new RegExp(this.testSetUpData.urlForTest.url + `/publications/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)}$`)
        );
    }

    // -------------------- Verify Publication methods --------------------

    //verify publication when being compared method
    async verifyComparePublication()
    {
        const publication = this.testData.Publication;
        const media = this.testData.Media;
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

        //-------------------- PUBLISHED DATE --------------------
        const publishedDate = this.page.locator('//span[contains(text(),"Date published:")]//following-sibling::span');
        
        await this.testSteps.LogInfo('Verifying old published date was removed');
        await expect(publishedDate.locator('del')).toHaveText(publication.verifyDatePublished);

        await this.testSteps.LogInfo('Verifying edited published date was added');
        await expect(publishedDate.locator('ins')).toHaveText(formatDate(publication.datePublished));

        //-------------------- SUMMARY --------------------
        const summary = this.page.locator('//p[@class="field-summary"]');
        await this.testSteps.LogInfo('Verifying old summary text was removed');
        await expect(summary.locator('del')).toHaveText('new');
        await this.testSteps.LogInfo('Verifying edited summary text was added');
        await expect(summary.locator('ins')).toHaveText('edited');

        //-------------------- BODY FIELD --------------------
        const body = this.page.locator('p').filter({ hasText: 'news body field' });
        await this.testSteps.LogInfo('Verifying old body text was removed');
        await expect(body.locator('del')).toHaveText('new');
        await this.testSteps.LogInfo('Verifying edited body text was added');
        await expect(body.locator('ins')).toHaveText('edited');

        
        //-------------------- DOCUMENTS --------------------
        const oldDocument = this.page.locator('del a').filter({ hasText: media.attachmentFileName });
        const editedDocument = this.page.locator('ins a').filter({ hasText: media.attachmentFileNameEdited });
        await this.testSteps.LogInfo('Verifying old document was removed');
        await expect(oldDocument).toBeVisible();
        await this.testSteps.LogInfo('Verifying edited document was added');
        await expect(editedDocument).toBeVisible();

        //-------------------- STATISTICS --------------------
        const oldStatistic = publication.statistics[publication.statistics.length - 1];
        const newStatistic = publication.statisticsEdited[publication.statisticsEdited.length - 1];
        const removedStatistic = this.page.locator('del').filter({ hasText: oldStatistic });
        const addedStatistic = this.page.locator('ins').filter({ hasText: newStatistic });
        await this.testSteps.LogInfo('Verifying old statistic was removed');
        await expect(removedStatistic).toHaveText(oldStatistic);
        await this.testSteps.LogInfo('Verifying edited statistic was added');
        await expect(addedStatistic).toHaveText(newStatistic);

        //-------------------- RESEARCH AND SUPPORT --------------------
        const oldResearch = publication.research[publication.research.length - 1];
        const newResearch = publication.researchEdited[publication.researchEdited.length - 1];
        const removedResearch = this.page.locator('del').filter({ hasText: oldResearch });
        const addedResearch = this.page.locator('ins').filter({ hasText: newResearch });
        await this.testSteps.LogInfo('Verifying old research item was removed');
        await expect(removedResearch).toHaveText(oldResearch);
        await this.testSteps.LogInfo('Verifying edited research item was added');
        await expect(addedResearch).toHaveText(newResearch);

        //-------------------- TYPE --------------------
        const originalType = this.page.getByText(publication.publicationType, { exact: true });
        const editedType = this.page.locator('ins').filter({ hasText: publication.publicationTypeEdited });
        await this.testSteps.LogInfo('Verifying original publication type remains visible');
        await expect(originalType).toHaveText(publication.publicationType);
        await this.testSteps.LogInfo('Verifying edited publication type was added');
        await expect(editedType).toContainText(publication.publicationTypeEdited);
    }
}