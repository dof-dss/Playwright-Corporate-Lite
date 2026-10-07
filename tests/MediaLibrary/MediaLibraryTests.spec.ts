// import { TestSteps } from '@poms/base-pages/TestSteps';
// import { test } from '@fixtures/MyFixtures';
// import { MediaHelper } from '@helpers/general/MediaHelper';
// import { GalleryHelper } from '@helpers/content/GalleryHelper';
// import { NewsHelper } from '@helpers/content/NewsHelper';
// import { ArticleHelper } from '@helpers/content/ArticleHelper';
// import { PublicationHelper } from '@helpers/content/PublicationHelper';
// import { ConsultationHelper } from '@helpers/content/ConsultationHelper';
// import { ContentModerationHelper } from '@helpers/general/ContentModerationHelper';
// import { NavigateToCreatedContentHelper } from '@helpers/general/NavigateToCreatedContentHelper';
// import { LoginHelper } from '@helpers/general/LoginHelper';
// import { BasePage } from '@poms/base-pages/BasePage';
// import { GalleryNodePage } from '@poms/content-pages/Gallery/GalleryNodePage';
// import { Page } from '@playwright/test';
// import { galleryImageDetails, resetMediaLibraryNames, TestData, TestSetUpData } from '@tdata/TestDataObject';

// type MediaNameKey = keyof typeof TestData.MediaLibrary;
// type ValidUserKey = keyof typeof TestSetUpData.validUserList;
// type ValidUrlKey = keyof typeof TestSetUpData.validTestURLList;

// interface MediaTypeConfig
// {
//     label: string;
//     nameKey: MediaNameKey;
//     create: (mediaHelper: MediaHelper, title?: string) => Promise<void>;
//     editGridView: (mediaHelper: MediaHelper) => Promise<void>;
//     editTableView: (mediaHelper: MediaHelper) => Promise<void>;
// }

// // standard media types, tested for Author / Supervisor roles
// const standardMediaTypes: MediaTypeConfig[] = [
//     {
//         label: 'Image',
//         nameKey: 'imageName',
//         create: (mediaHelper, title) => mediaHelper.createImageMediaLibrary(title),
//         editGridView: mediaHelper => mediaHelper.editImageMediaLibraryGridView(),
//         editTableView: mediaHelper => mediaHelper.editImageMediaLibraryTableView(),


//     },
//     {
//         label: 'Audio File',
//         nameKey: 'audioName',
//         create: (mediaHelper, title) => mediaHelper.createAudioMediaLibrary(title),
//         editGridView: mediaHelper => mediaHelper.editAudioMediaLibraryGridView(),
//         editTableView: mediaHelper => mediaHelper.editAudioMediaLibraryTableView(),
//     },
//     {
//         label: 'Remote Video',
//         nameKey: 'remoteVideoName',
//         create: (mediaHelper, title) => mediaHelper.createRemoteVideoMediaLibrary(title),
//         editGridView: mediaHelper => mediaHelper.editRemoteVideoMediaLibraryGridView(),
//         editTableView: mediaHelper => mediaHelper.editRemoteVideoMediaLibraryTableView(),
//     },
//     {
//         label: 'Attachment File',
//         nameKey: 'documentName',
//         create: (mediaHelper, title) => mediaHelper.createDocumentMediaLibrary(title),
//         editGridView: mediaHelper => mediaHelper.editDocumentMediaLibraryGridView(),
//         editTableView: mediaHelper => mediaHelper.editDocumentMediaLibraryTableView(),
//     },
//     {
//         label: 'Remote Document File',
//         nameKey: 'remoteDocumentName',
//         create: (mediaHelper, title) => mediaHelper.createRemoteDocumentMediaLibrary(title),
//         editGridView: mediaHelper => mediaHelper.editRemoteDocumentMediaLibraryGridView(),
//         editTableView: mediaHelper => mediaHelper.editRemoteDocumentMediaLibraryTableView(),
//     },
// ];

// interface MediaTestCategory
// {
//     title: (label: string) => string;
//     run: (mediaHelper: MediaHelper, name: string, type: MediaTypeConfig, extras: { galleryHelper: GalleryHelper; newsHelper: NewsHelper; loginHelper: LoginHelper; contentModerationHelper: ContentModerationHelper; basePage: BasePage; navigateToCreatedContentHelper: NavigateToCreatedContentHelper; articleHelper: ArticleHelper; publicationHelper: PublicationHelper; consultationHelper: ConsultationHelper; testData: typeof TestData; testSetUpData: typeof TestSetUpData; page: Page; roleLabel: string; }) => Promise<void>;
// }

// // each category runs once per media type, in the same order tests were originally numbered
// const categories: MediaTestCategory[] = [
//     {
//         title: label => `Upload - Upload ${label} as an "{role}" in media library, and use on create Node page Media Library Modal`,
//         run: async (mediaHelper, _name, type, { galleryHelper, articleHelper, newsHelper, publicationHelper, consultationHelper, testData, testSetUpData, page, roleLabel }) =>
//         {
//             await type.create(mediaHelper);

//             // IMAGE
//             // Use the uploaded image from the Media Library when creating a Gallery
//             if (type.nameKey === 'imageName')
//             {
//                 testSetUpData.contentTitleforTest.contentTitle = testData.Gallery.title;
//                 testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.gallery;
//                 testData.MediaLibrary.visibleInMediaLibrary = true;
//                 testData.Gallery.favourite = false;


//                 await galleryHelper.createGallery({
//                     preview: false,
//                     mandatoryFieldCheck: false,
//                     existingImageName: testData.MediaLibrary.imageName,
//                 });
//             }

//             if (type.nameKey === 'audioName')
//             {
//                 testSetUpData.contentTitleforTest.contentTitle = testData.Article.title;
//                 testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.article;

//                 await articleHelper.createArticleWithCKEditorFunctionality({
//                     preview: true,
//                     mandatoryFieldCheck: false,
//                     existingAudioName: testData.MediaLibrary.audioName,

//                 });
//             }


//             if (type.nameKey === 'remoteVideoName')
//             {
//                 testSetUpData.contentTitleforTest.contentTitle = testData.News.title;
//                 testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.news;

//                 await newsHelper.createNews({
//                     preview: true,
//                     mandatoryFieldCheck: true,
//                     existingRemoteVideoName: testData.MediaLibrary.remoteVideoName,

//                 });

//             }

//             if (type.nameKey === 'documentName')
//             {
//                 testSetUpData.contentTitleforTest.contentTitle = testData.Publication.title;
//                 testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.publication;

//                 await publicationHelper.createPublication({
//                     preview: true,
//                     mandatoryFieldCheck: false,
//                     existingDocumentName: testData.MediaLibrary.documentName,
//                 });

//             }

//             if (type.nameKey === 'remoteDocumentName')
//             {
//                 testSetUpData.contentTitleforTest.contentTitle = testData.Consultation.title;
//                 testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.consultation;

//                 testData.Consultation.respondeOnline = "Special EU Programmes Body";
//                 await consultationHelper.createConsultation({
//                     preview: true,
//                     mandatoryFieldCheck: false,
//                     existingRemoteDocumentName: testData.MediaLibrary.remoteDocumentName,
//                 });
//             }

//         }
//     },
//     {
//         title: label => `Edit - Edit ${label} as an "{role}" in media library and Verify`,
//         run: async (mediaHelper, _name, type, { galleryHelper, articleHelper, newsHelper, publicationHelper, consultationHelper, testData, testSetUpData, page, roleLabel }) =>
//         {
//             await type.create(mediaHelper);
//             await type.editGridView(mediaHelper);
//             await type.editTableView(mediaHelper);

//             // IMAGE
//             // Use the uploaded image from the Media Library when creating a Gallery
//             if (type.nameKey === 'imageName')
//             {
//                 testSetUpData.contentTitleforTest.contentTitle = testData.Gallery.title;
//                 testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.gallery;
//                 testData.MediaLibrary.visibleInMediaLibrary = true;
//                 testData.Gallery.favourite = false;

//                 await galleryHelper.createGallery({
//                     preview: false,
//                     mandatoryFieldCheck: false,
//                     existingImageName: testData.MediaLibrary.imageNameEdited,
//                 });
//             }

//             if (type.nameKey === 'audioName')
//             {
//                 testSetUpData.contentTitleforTest.contentTitle = testData.Article.title;
//                 testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.article;

//                 await articleHelper.createArticleWithCKEditorFunctionality({
//                     preview: true,
//                     mandatoryFieldCheck: false,
//                     existingAudioName: testData.MediaLibrary.audioNameEdited,

//                 });
//             }

//             if (type.nameKey === 'remoteVideoName')
//             {
//                 testSetUpData.contentTitleforTest.contentTitle = testData.News.title;
//                 testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.news;

//                 await newsHelper.createNews({
//                     preview: true,
//                     mandatoryFieldCheck: true,
//                     existingRemoteVideoName: testData.MediaLibrary.remoteVideoNameEdited,

//                 });

//             }

//             if (type.nameKey === 'documentName')
//             {
//                 testSetUpData.contentTitleforTest.contentTitle = testData.Publication.title;
//                 testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.publication;

//                 await publicationHelper.createPublication({
//                     preview: true,
//                     mandatoryFieldCheck: false,
//                     existingDocumentName: testData.MediaLibrary.documentNameEdited,
//                 });

//             }

//             if (type.nameKey === 'remoteDocumentName')
//             {
//                 testSetUpData.contentTitleforTest.contentTitle = testData.Consultation.title;
//                 testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.consultation;

//                 testData.Consultation.respondeOnline = "Special EU Programmes Body";
//                 await consultationHelper.createConsultation({
//                     preview: true,
//                     mandatoryFieldCheck: false,
//                     existingRemoteDocumentName: testData.MediaLibrary.remoteDocumentNameEdited,
//                 });
//             }

//         },
//     },
//     {
//         title: label => `Delete - Delete ${label} as an "{role}" in media library and Verify`,
//         run: async (mediaHelper, name, type, { galleryHelper, articleHelper, newsHelper, publicationHelper, consultationHelper, testData, testSetUpData, page, roleLabel }) =>
//         {
//             await type.create(mediaHelper);
//             await mediaHelper.deleteMediaLibraryGridView(name, { delete: false, cancel: true });
//             await mediaHelper.deleteMediaLibraryGridView(name, { delete: true, cancel: false });

//             // IMAGE
//             // Use the uploaded image from the Media Library when creating a Gallery
//             if (type.nameKey === 'imageName')
//             {
//                 testSetUpData.contentTitleforTest.contentTitle = testData.Gallery.title;
//                 testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.gallery;
//                 testData.MediaLibrary.visibleInMediaLibrary = false;
//                 testData.Gallery.favourite = false;

//                 await galleryHelper.createGallery({
//                     preview: false,
//                     mandatoryFieldCheck: false,
//                     existingImageName: testData.MediaLibrary.imageName,
//                 });
//             }
//         },
//     },
//     {
//         title: label => `Media Favourites - Upload ${label} as an "{role}" in media library and add to favourites and verify displayed in modal favourites`,
//         run: async (mediaHelper, name, type, { galleryHelper, articleHelper, newsHelper, publicationHelper, consultationHelper, testData, testSetUpData, page, roleLabel }) =>
//         {
//             await type.create(mediaHelper);
//             await mediaHelper.favouriteMedia(name);

//             // IMAGE
//             // Use the uploaded image from the Media Library when creating a Gallery and ensure it is visible in the Media Library
//             if (type.nameKey === 'imageName')
//             {
//                 testSetUpData.contentTitleforTest.contentTitle = testData.Gallery.title;
//                 testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.gallery;
//                 testData.MediaLibrary.visibleInMediaLibrary = true;
//                 testData.Gallery.favourite = true;

//                 await galleryHelper.createGallery({
//                     preview: false,
//                     mandatoryFieldCheck: false,
//                     existingImageName: testData.MediaLibrary.imageName,
//                 });
//             }

//         },
//     },
//     {
//         title: label => `Media Favourites - Upload ${label} as an "{role}" in media library and add to favourites and remove from favourites verify removed in modal favourites`,
//         run: async (mediaHelper, name, type, { galleryHelper, articleHelper, newsHelper, publicationHelper, consultationHelper, testData, testSetUpData, page, roleLabel }) =>
//         {
//             await type.create(mediaHelper);
//             await mediaHelper.favouriteMedia(name);
//             await mediaHelper.unfavouriteMedia(name);

//             // IMAGE
//             // Use the uploaded image from the Media Library when creating a Gallery and ensure it is visible in the Media Library
//             if (type.nameKey === 'imageName')
//             {
//                 testSetUpData.contentTitleforTest.contentTitle = testData.Gallery.title;
//                 testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.gallery;
//                 testData.MediaLibrary.visibleInMediaLibrary = true;
//                 testData.Gallery.favourite = false;

//                 await galleryHelper.createGallery({
//                     preview: false,
//                     mandatoryFieldCheck: false,
//                     existingImageName: testData.MediaLibrary.imageName,
//                 });
//             }
//         },
//     },
//     {
//         title: label => `Bottom ToolBar - Delete (Singular Item) ${label}`,
//         run: async (mediaHelper, name, type, { galleryHelper, articleHelper, newsHelper, publicationHelper, consultationHelper, testData, testSetUpData, page, roleLabel }) =>
//         {
//             await type.create(mediaHelper);
//             await mediaHelper.deleteMediaLibraryBulkOption(name, { delete: false, cancel: true });
//             await mediaHelper.deleteMediaLibraryBulkOption(name, { delete: true, cancel: false });

//             // IMAGE
//             // Use the uploaded image from the Media Library when creating a Gallery and ensure it is visible in the Media Library
//             if (type.nameKey === 'imageName')
//             {
//                 testSetUpData.contentTitleforTest.contentTitle = testData.Gallery.title;
//                 testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.gallery;
//                 testData.MediaLibrary.visibleInMediaLibrary = false;
//                 testData.Gallery.favourite = false;

//                 await galleryHelper.createGallery({
//                     preview: false,
//                     mandatoryFieldCheck: false,
//                     existingImageName: testData.MediaLibrary.imageName,
//                 });
//             }
//         },
//     },
//     {
//         title: label => `Bottom ToolBar - Delete (Multiple Item) ${label}`,
//         run: async (mediaHelper, name, type, { galleryHelper, articleHelper, newsHelper, publicationHelper, consultationHelper, testData, testSetUpData, page, roleLabel }) =>
//         {
//             await type.create(mediaHelper);
//             await type.create(mediaHelper, `${name} - secondary`);
//             await mediaHelper.deleteMediaLibraryBulkOptionMultiple(name, { delete: false, cancel: true });
//             await mediaHelper.deleteMediaLibraryBulkOptionMultiple(name, { delete: true, cancel: false });

//             // IMAGE
//             // Use the uploaded image from the Media Library when creating a Gallery and ensure it is visible in the Media Library
//             if (type.nameKey === 'imageName')
//             {
//                 testSetUpData.contentTitleforTest.contentTitle = testData.Gallery.title;
//                 testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.gallery;
//                 testData.MediaLibrary.visibleInMediaLibrary = false;
//                 testData.Gallery.favourite = false;

//                 await galleryHelper.createGallery({
//                     preview: false,
//                     mandatoryFieldCheck: false,
//                     existingImageName: testData.MediaLibrary.imageName,
//                     unavailableImageNames: [name, `${name} - secondary`],
//                 });
//             }
//         },
//     },
//     {
//         title: label => `Bottom ToolBar - Unpublish (Singular Item) ${label}`,
//         run: async (mediaHelper, name, type, { galleryHelper, articleHelper, newsHelper, publicationHelper, consultationHelper, testData, testSetUpData, page, roleLabel }) =>
//         {
//             await type.create(mediaHelper);
//             await mediaHelper.unpublishMediaLibraryBulkOption(name);

//             // IMAGE
//             // Use the uploaded image from the Media Library when creating a Gallery and ensure it is visible in the Media Library
//             if (type.nameKey === 'imageName')
//             {
//                 testSetUpData.contentTitleforTest.contentTitle = testData.Gallery.title;
//                 testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.gallery;
//                 testData.MediaLibrary.visibleInMediaLibrary = false;
//                 testData.Gallery.favourite = false;

//                 await galleryHelper.createGallery({
//                     preview: false,
//                     mandatoryFieldCheck: false,
//                     existingImageName: testData.MediaLibrary.imageName,
//                 });
//             }
//         },
//     },
//     {
//         title: label => `Bottom ToolBar - Publish (Singular Item) ${label}`,
//         run: async (mediaHelper, name, type, { galleryHelper, articleHelper, newsHelper, publicationHelper, consultationHelper, testData, testSetUpData, page, roleLabel }) =>
//         {
//             await type.create(mediaHelper);
//             await mediaHelper.unpublishMediaLibraryBulkOption(name);
//             await mediaHelper.publishMediaLibraryBulkOption(name);

//             // IMAGE
//             // Use the uploaded image from the Media Library when creating a Gallery and ensure it is visible in the Media Library
//             if (type.nameKey === 'imageName')
//             {
//                 testSetUpData.contentTitleforTest.contentTitle = testData.Gallery.title;
//                 testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.gallery;
//                 testData.MediaLibrary.visibleInMediaLibrary = true;
//                 testData.Gallery.favourite = false;

//                 await galleryHelper.createGallery({
//                     preview: false,
//                     mandatoryFieldCheck: false,
//                     existingImageName: testData.MediaLibrary.imageName,
//                 });
//             }
//         },
//     },
// ];

// interface RoleConfig
// {
//     describeName: string;
//     testPrefix: string;
//     roleLabel: string;
//     urlKey: ValidUrlKey;
//     usernameKey: ValidUserKey;
//     passwordKey: ValidUserKey;
//     mediaTypes: MediaTypeConfig[];
// }

// const roleConfigs: RoleConfig[] = [
//     {
//         describeName: 'Media Library Author Tests',
//         testPrefix: 'MediaLibrary-Auth-TC',
//         roleLabel: 'Author',
//         urlKey: 'finance_url',
//         usernameKey: 'author_username',
//         passwordKey: 'author_password',
//         mediaTypes: standardMediaTypes,
//     },
//     {
//         describeName: 'Media Library Supervisor Tests',
//         testPrefix: 'MediaLibrary-Super-TC',
//         roleLabel: 'Supervisor',
//         urlKey: 'finance_url',
//         usernameKey: 'supervisor_username',
//         passwordKey: 'supervisor_password',
//         mediaTypes: standardMediaTypes,
//     },
// ];

// for (const role of roleConfigs)
// {
//     test.describe(role.describeName, () =>
//     {
//         test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
//         {
//             resetMediaLibraryNames();

//             const testSteps = new TestSteps();
//             await testSteps.LogInfo('Test starting');
//             await testSteps.LogInfo(testInfo.title);

//             testSetUpData.urlForTest.url = testSetUpData.validTestURLList[role.urlKey];
//             testSetUpData.userForTest.username = testSetUpData.validUserList[role.usernameKey];
//             testSetUpData.userForTest.password = testSetUpData.validUserList[role.passwordKey];
//             testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.article;
//             testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

//             await loginHelper.loginWithValidUser();
//         });

//         let testCaseNumber = 0;
//         for (const category of categories)
//         {
//             for (const type of role.mediaTypes)
//             {
//                 testCaseNumber++;
//                 const testCaseId = `${role.testPrefix}${String(testCaseNumber).padStart(2, '0')}`;
//                 const testTitle = `${testCaseId} - ${category.title(type.label).replace('{role}', role.roleLabel)}`;

//                 test(testTitle, { tag: '@regression' },
//                     async ({ mediaHelper, galleryHelper, newsHelper, loginHelper, contentModerationHelper, basePage, navigateToCreatedContentHelper, articleHelper, publicationHelper, consultationHelper, testData, testSetUpData, page }) =>
//                     {
//                         await category.run(mediaHelper, testData.MediaLibrary[type.nameKey] as string, type, { galleryHelper, newsHelper, loginHelper, contentModerationHelper, basePage, navigateToCreatedContentHelper, articleHelper, publicationHelper, consultationHelper, testData, testSetUpData, page, roleLabel: role.roleLabel });
//                     });
//             }
//         }
//     });
// }
