import { Page } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestData, TestSetUpData, galleryImageDetails } from '../../test-data/TestDataObject';
import { expect } from '@playwright/test';
import { ApplicationNodePage } from '@poms/content-pages/Application/ApplicationNodePage';
import { ArticleNodePage } from '@poms/content-pages/Article/ArticleNodePage';
import { ConsultationNodePage } from '@poms/content-pages/Consultation/ConsultationNodePage';
import { GalleryNodePage } from '@poms/content-pages/Gallery/GalleryNodePage';
import { NewsNodePage } from '@poms/content-pages/News/NewsNodePage';
import { PublicationNodePage } from '@poms/content-pages/Publication/PublicationNodePage';
import { ProfileNodePage } from '@poms/content-pages/Profile/ProfileNodePage';

export class ContentNodePageRouter
{
    private readonly testSteps: TestSteps;
    private readonly applicationNodePage: ApplicationNodePage;
    private readonly articleNodePage: ArticleNodePage;
    private readonly consultationNodePage: ConsultationNodePage;
    private readonly galleryNodePage: GalleryNodePage;
    private readonly newsNodePage: NewsNodePage;
    private readonly publicationNodePage: PublicationNodePage;
    private readonly profileNodePage: ProfileNodePage;

    constructor(
        private page: Page,
        private testSetUpData: typeof TestSetUpData,
        private testData: typeof TestData
    )
    {
        this.testSteps = new TestSteps();
        this.applicationNodePage = new ApplicationNodePage(page, testSetUpData, testData);
        this.articleNodePage = new ArticleNodePage(page, testSetUpData, testData);
        this.consultationNodePage = new ConsultationNodePage(page, testSetUpData, testData);
        this.galleryNodePage = new GalleryNodePage(page, testSetUpData, testData, galleryImageDetails);
        this.newsNodePage = new NewsNodePage(page, testSetUpData, testData);
        this.publicationNodePage = new PublicationNodePage(page, testSetUpData, testData);
        this.profileNodePage = new ProfileNodePage(page, testSetUpData, testData);
    }

    async verifyNodeURL(contentType: string): Promise<void>
    {
        const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();

        switch (contentType)
        {
            case this.testSetUpData.validContentTypeList.application:
                {
                    await this.applicationNodePage.applicationNodeURLCheck();
                    break;
                }
            case this.testSetUpData.validContentTypeList.article:
                {
                    await this.articleNodePage.articleNodeURLCheck();
                    break;
                }
            case this.testSetUpData.validContentTypeList.consultation:
                {
                    await this.consultationNodePage.consultationNodeURLCheck();
                    break;
                }
            case this.testSetUpData.validContentTypeList.contact:
                {
                    //await this.contactNodePage.contactNodeURLCheck();
                    break;
                }
            case this.testSetUpData.validContentTypeList.gallery:
                {
                    await this.galleryNodePage.galleryNodeURLCheck();
                    break;
                }
            case this.testSetUpData.validContentTypeList.link:
                {
                    //await this.linkNodePage.linkNodeURLCheck();
                    break;
                }
            case this.testSetUpData.validContentTypeList.news:
                {
                    await this.newsNodePage.newsNodeURLCheck();
                    break;
                }
            case this.testSetUpData.validContentTypeList.profile:
                {
                    await this.profileNodePage.profileNodeURLCheck();
                    break;
                }
            case this.testSetUpData.validContentTypeList.publication:
                {
                    await this.publicationNodePage.publicationNodeURLCheck();
                    break;
                }
        }
    }
}