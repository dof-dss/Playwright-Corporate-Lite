import { Page } from '@playwright/test';
import { TestSetUpData, TestData, galleryImageDetails } from '../../test-data/TestDataObject';
import { ApplicationNodePage } from '@poms/content-pages/Application/ApplicationNodePage';
import { ArticleNodePage } from '@poms/content-pages/Article/ArticleNodePage';
import { ConsultationNodePage } from '@poms/content-pages/Consultation/ConsultationNodePage';
import { GalleryNodePage } from '@poms/content-pages/Gallery/GalleryNodePage';
import { NewsNodePage } from '@poms/content-pages/News/NewsNodePage';
import { PublicationNodePage } from '@poms/content-pages/Publication/PublicationNodePage';
import { ProfileNodePage } from '@poms/content-pages/Profile/ProfileNodePage';
import { ContentNodePageRouter } from '@helpers/general/ContentNodePageRouter';
import { ContactNodePage } from '@poms/content-pages/Contact/ContactNodePage';
import { LinkNodePage } from '@poms/content-pages/Link/LinkNodePage';

export interface ContentEdited
{
    edited: boolean;
};

export class VerificationHelper
{
    // pages 
    private readonly applicationNodePage: ApplicationNodePage;
    private readonly articleNodePage: ArticleNodePage;
    private readonly consultationNodePage: ConsultationNodePage;
    private readonly contactNodePage: ContactNodePage;
    private readonly galleryNodePage: GalleryNodePage;
    private readonly newsNodePage: NewsNodePage;
    private readonly publicationNodePage: PublicationNodePage;
    private readonly profileNodePage: ProfileNodePage;
    private readonly linkNodePage: LinkNodePage;
    private readonly contentRouter: ContentNodePageRouter;

    constructor(
        private page: Page,
        // isolated test data
        private testSetUpData: typeof TestSetUpData,
        private testData: typeof TestData,
    )
    {
        // new instance of pages with this.page and this.testSetUpData parameters set
        this.applicationNodePage = new ApplicationNodePage(this.page, this.testSetUpData, this.testData);
        this.articleNodePage = new ArticleNodePage(this.page, this.testSetUpData, this.testData);
        this.consultationNodePage = new ConsultationNodePage(this.page, this.testSetUpData, this.testData);
        this.galleryNodePage = new GalleryNodePage(this.page, this.testSetUpData, this.testData, galleryImageDetails);
        this.newsNodePage = new NewsNodePage(this.page, this.testSetUpData, this.testData);
        this.publicationNodePage = new PublicationNodePage(this.page, this.testSetUpData, this.testData);
        this.profileNodePage = new ProfileNodePage(this.page, this.testSetUpData, this.testData);
        this.contactNodePage = new ContactNodePage(this.page, this.testSetUpData, this.testData);
        this.linkNodePage = new LinkNodePage(this.page, this.testSetUpData, this.testData);
        this.contentRouter = new ContentNodePageRouter(this.page, this.testSetUpData, this.testData);

    }

    async verifyChosenContent({ edited }: ContentEdited)
    {
        // Verify node URL using router (centralized routing logic)
        await this.contentRouter.verifyNodeURL(this.testSetUpData.contentTypeforTest.contentType);

        // verification switch to verify correct content type being tested
        switch (this.testSetUpData.contentTypeforTest.contentType)
        {
            case this.testSetUpData.validContentTypeList.application: {
                if (edited === false)
                {
                    await this.applicationNodePage.verifyApplication();
                }
                else
                {
                    await this.applicationNodePage.verifyEditedApplication();
                }
                break;
            }
            case this.testSetUpData.validContentTypeList.article: {
                if (edited === false)
                {
                    await this.articleNodePage.verifyArticle({
                    });
                }
                else
                {
                    await this.articleNodePage.verifyEditedArticle({
                    });
                }
                break;
            }
            case this.testSetUpData.validContentTypeList.articleCKEditorFull: {
                // ckeditor full functionality verification
                await this.articleNodePage.verifyArticleCKEditorFullFunctionality();
                break;
            }
            // case this.testSetUpData.validContentTypeList.articleCKEditorImportWord: {
            //     // ckeditor import word functionality verification
            //     await this.articleNodePage.verifyArticleCKEditorImportWord();
            //     break;
            // }
            case this.testSetUpData.validContentTypeList.consultation: {
                if (edited === false)
                {
                    await this.consultationNodePage.verifyConsultation({
                        preview: false,
                    });
                }
                else
                {
                    await this.consultationNodePage.verifyEditedConsultation({
                        preview: false,
                    });
                }
                break;
            }
            case this.testSetUpData.validContentTypeList.consultationFutureDate: {
                await this.consultationNodePage.verifyFutureConsultation({
                    preview: false,
                });
                break;
            }
            case this.testSetUpData.validContentTypeList.contact: {
                if (edited === false)
                {
                    await this.contactNodePage.verifyContact({
                    });
                }
                else
                {
                    await this.contactNodePage.verifyEditedContact({
                    });
                }
                break;
            }
            case this.testSetUpData.validContentTypeList.gallery: {
                if (edited === false)
                {
                    await this.galleryNodePage.verifyGallery({
                        preview: false,
                    });
                }
                else
                {
                    await this.galleryNodePage.verifyEditedGallery({
                        preview: false,
                    });
                }
                break;
            }
            case this.testSetUpData.validContentTypeList.link: {
                if (edited === false)
                {
                    await this.linkNodePage.verifyLink({
                        preview: false,
                    });
                }
                else
                {
                    await this.linkNodePage.verifyEditedLink({
                        preview: false,
                    });
                }
                break;
            }
            case this.testSetUpData.validContentTypeList.news: {
                // using news node page to verify published content is accurate
                await this.newsNodePage.newsNodeURLCheck();
                if (edited === false)
                {
                    await this.newsNodePage.verifyNews({
                    });
                }
                else
                {
                    await this.newsNodePage.verifyEditedNews({
                    });
                }
                break;
            }
            case this.testSetUpData.validContentTypeList.profile: {
                await this.profileNodePage.profileNodeURLCheck();
                if (edited === false)
                {
                    await this.profileNodePage.verifyProfile();
                }
                else
                {
                    await this.profileNodePage.verifyEditedProfile();
                }
                break;
            }
            case this.testSetUpData.validContentTypeList.publication: {
                // using publication node page to verify published content is accurate
                await this.publicationNodePage.publicationNodeURLCheck();
                if (edited === false)
                {
                    await this.publicationNodePage.verifyPublication({
                    });
                }
                else
                {
                    await this.publicationNodePage.verifyEditedPublication({
                    });
                }
                break;
            }
            case this.testSetUpData.validContentTypeList.publicationExternalLink: {
                // using publication external link node page to verify published content is accurate
                await this.publicationNodePage.publicationNodeURLCheck();
                if (edited === false)
                {
                    await this.publicationNodePage.verifyExternalLinkPublication({
                    });
                }
                else
                {
                    await this.publicationNodePage.verifyEditedExternalLinkPublication({
                    });
                }
                break;
            }
        }
    }
}