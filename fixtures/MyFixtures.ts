import { test as base } from '@playwright/test';
import { TestSetUpData, TestData } from '@tdata/TestDataObject';
import { LoginHelper } from '@helpers/general/LoginHelper';
import { ApplicationHelper } from '@helpers/content/ApplicationHelper';
import { ArticleHelper } from '@helpers/content/ArticleHelper';
import { ConsultationHelper } from '@helpers/content/ConsultationHelper';
import { ContactHelper } from '@helpers/content/ContactHelper';
import { NewsHelper } from '@helpers/content/NewsHelper';
import { PublicationHelper } from '@helpers/content/PublicationHelper';
import { GalleryHelper } from '@helpers/content/GalleryHelper';
import { ContentModerationHelper } from '@helpers/general/ContentModerationHelper';
import { AnonymousHelper } from '@helpers/general/AnonymousHelper';
import { NavigateToCreatedContentHelper } from '@helpers/general/NavigateToCreatedContentHelper';
import { RevisionHelper } from '@helpers/general/RevisionHelper';
import { WorkBenchHelper } from '@helpers/general/WorkBenchHelper';
import { BasePage } from '@poms/base-pages/BasePage';
import { LinkHelper } from '@helpers/content/LinkHelper';
import { ProfileHelper } from '@helpers/content/ProfileHelper';
import { HomePage } from '@poms/anon-pages/HomePage';
import { MediaHelper } from '@helpers/general/MediaHelper';

// setting my fixtures
import { ContentNodePageRouter } from '@helpers/general/ContentNodePageRouter';

type MyFixtures = {
    testSetUpData: typeof TestSetUpData;
    testData: typeof TestData;
    loginHelper: LoginHelper;
    applicationHelper: ApplicationHelper;
    articleHelper: ArticleHelper;
    consultationHelper: ConsultationHelper;
    newsHelper: NewsHelper;
    publicationHelper: PublicationHelper;
    galleryHelper: GalleryHelper;
    contactHelper: ContactHelper;
    linkHelper: LinkHelper;
    contentModerationHelper: ContentModerationHelper;
    anonymousHelper: AnonymousHelper;
    navigateToCreatedContentHelper: NavigateToCreatedContentHelper;
    revisionHelper: RevisionHelper;
    workBenchHelper: WorkBenchHelper;
    basePage: BasePage;
    contentNodePageRouter: ContentNodePageRouter;
    profileHelper: ProfileHelper;
    homePage: HomePage;
    mediaHelper: MediaHelper;
};

// Extend the base test with isolated clones and helper instances
export const test = base.extend<MyFixtures>({

    // Fixture for TestSetUpData
    testSetUpData: async ({ }, use) =>
    {
        // Validation: If this is undefined, the import path is likely wrong
        if (!TestSetUpData)
        {
            throw new Error("testSetUpData is undefined. Check import path in baseTest.ts");
        }

        // structuredClone is the standard deep-clone method
        const freshData = structuredClone(TestSetUpData);
        await use(freshData);
    },

    // Fixture for TestData
    testData: async ({ }, use, testInfo) =>
    {
        if (!TestData)
        {
            throw new Error("testData is undefined. Check import path in baseTest.ts");
        }

        // structuredClone is the standard deep-clone method
        const freshDataForContent = structuredClone(TestData);

        // creating unique identifier because tests running in parrellel were breaking on duplicate titles
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(8, 14); // MMDDHH format
        const uniqueId = `W${testInfo.parallelIndex}-${timestamp}-${Math.floor(Math.random() * 1000)}`;

        // inject the unique ID into the title
        freshDataForContent.Application.title = freshDataForContent.Application.title + ' - ' + uniqueId;
        freshDataForContent.Application.titleEdited = freshDataForContent.Application.titleEdited + ' - ' + uniqueId;
        freshDataForContent.Article.title = freshDataForContent.Article.title + ' - ' + uniqueId;
        freshDataForContent.Article.titleEdited = freshDataForContent.Article.titleEdited + ' - ' + uniqueId;
        freshDataForContent.Contact.title = freshDataForContent.Contact.title + ' - ' + uniqueId;
        freshDataForContent.Contact.titleEdited = freshDataForContent.Contact.titleEdited + ' - ' + uniqueId;
        freshDataForContent.Consultation.title = freshDataForContent.Consultation.title + ' - ' + uniqueId;
        freshDataForContent.Consultation.titleEdited = freshDataForContent.Consultation.titleEdited + ' - ' + uniqueId;
        freshDataForContent.Link.title = freshDataForContent.Link.title + ' - ' + uniqueId;
        freshDataForContent.Link.titleEdited = freshDataForContent.Link.titleEdited + ' - ' + uniqueId;
        freshDataForContent.Gallery.title = freshDataForContent.Gallery.title + ' - ' + uniqueId;
        freshDataForContent.Gallery.titleEdited = freshDataForContent.Gallery.titleEdited + ' - ' + uniqueId;
        freshDataForContent.News.title = freshDataForContent.News.title + ' - ' + uniqueId;
        freshDataForContent.News.titleEdited = freshDataForContent.News.titleEdited + ' - ' + uniqueId;
        freshDataForContent.Publication.title = freshDataForContent.Publication.title + ' - ' + uniqueId;
        freshDataForContent.Publication.titleEdited = freshDataForContent.Publication.titleEdited + ' - ' + uniqueId;

        await use(freshDataForContent);
    },

    // Fixture for LoginHelper (Injects isolated testSetUpData)
    loginHelper: async ({ page, testSetUpData }, use) =>
    {
        await use(new LoginHelper(page, testSetUpData));
    },
    applicationHelper: async ({ page, testSetUpData, testData }, use) =>
    {
        await use(new ApplicationHelper(page, testSetUpData, testData));
    },
    revisionHelper: async ({ page, testSetUpData, testData }, use) =>
    {
        await use(new RevisionHelper(page, testSetUpData, testData));
    },
    articleHelper: async ({ page, testSetUpData, testData }, use) =>
    {
        await use(new ArticleHelper(page, testSetUpData, testData));
    },
    contentModerationHelper: async ({ page, testSetUpData, testData }, use) =>
    {
        await use(new ContentModerationHelper(page, testSetUpData, testData));
    },
    anonymousHelper: async ({ page, testSetUpData, testData }, use) =>
    {
        await use(new AnonymousHelper(page, testSetUpData, testData));
    },
    navigateToCreatedContentHelper: async ({ page, testSetUpData, testData }, use) =>
    {
        await use(new NavigateToCreatedContentHelper(page, testSetUpData, testData));
    },
    workBenchHelper: async ({ page, testSetUpData, testData }, use) =>
    {
        await use(new WorkBenchHelper(page, testSetUpData, testData));
    },
    basePage: async ({ page, testSetUpData }, use) =>
    {
        await use(new BasePage(page, testSetUpData));
    },
    publicationHelper: async ({ page, testSetUpData, testData }, use) =>
    {
        await use(new PublicationHelper(page, testSetUpData, testData));
    },
    consultationHelper: async ({ page, testSetUpData, testData }, use) =>
    {
        await use(new ConsultationHelper(page, testSetUpData, testData));
    },
    newsHelper: async ({ page, testSetUpData, testData }, use) =>
    {
        await use(new NewsHelper(page, testSetUpData, testData));
    },
    galleryHelper: async ({ page, testSetUpData, testData }, use) =>
    {
        await use(new GalleryHelper(page, testSetUpData, testData));
    },
    contentNodePageRouter: async ({ page, testSetUpData, testData }, use) =>
    {
        await use(new ContentNodePageRouter(page, testSetUpData, testData));
    },

});

/* Re-export expect - to create a single, unified entry point for the test script.
// Without the re-export, every test file will require two separate import lines from different locations:
*/
export { expect } from '@playwright/test';