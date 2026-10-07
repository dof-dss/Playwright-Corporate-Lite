import { GalleryImageValues } from "@poms/base-pages/UploadMedia";

export const TestSetUpData = {
  // QA Accounts Managment
  qaAccounts: {
    finance_url_ddev: process.env.FINANCE_URL!,
    qaAccountManagementToken: process.env.QA_ACCOUNT_MANAGEMENT_TOKEN!
  },

  // test data to be overridden in tests 
  urlForTest: { url: '' },
  userForTest: { username: '', password: '' },
  contentTypeforTest: { contentType: '' },
  contentTitleforTest: { contentTitle: '' },
  saveAsOptionForTest: { saveAsOption: '' },
  moderationStateForTest: { moderationState: '' },
  previewContentForTest: { preview: false },

  // valid urls 
  validTestURLList: {
    afbi_url: process.env.AFBI_URL!,
    etni_url: process.env.ETNI_URL!,
    hse_url: process.env.HSE_URL!,
    nmsc_url: process.env.NMSC_URL!,
    nisra_url: process.env.NISRA_URL!
  },

  // valid user list
  validUserList: {
    author_username: process.env.AUTHOR_USERNAME!,
    author_password: process.env.AUTHOR_PASSWORD!,
    supervisor_username: process.env.SUPERVISOR_USERNAME!,
    supervisor_password: process.env.SUPERVISOR_PASSWORD!,
    editor_username: process.env.EDITOR_USERNAME!,
    editor_password: process.env.EDITOR_PASSWORD!,
    homepage_supervisor_username: process.env.HOMEPAGE_SUPERVISOR_USERNAME!,
    homepage_supervisor_password: process.env.HOMEPAGE_SUPERVISOR_PASSWORD!,
    secure_stats_supervisor_username: process.env.SECURE_STATS_SUPERVISOR_USERNAME!,
    secure_stats_supervisor_password: process.env.SECURE_STATS_SUPERVISOR_PASSWORD!,
    secure_market_supervisor_username: process.env.SECURE_MARKET_SUPERVISOR_USERNAME!,
    secure_market_supervisor_password: process.env.SECURE_MARKET_SUPERVISOR_PASSWORD!,
    publication_series_super_username: process.env.PUBLICATION_SERIES_SUPER_USERNAME!,
    publication_series_super_password: process.env.PUBLICATION_SERIES_SUPER_PASSWORD!,
    admin_username: process.env.ADMIN_USERNAME!,
    admin_password: process.env.ADMIN_PASSWORD!
  },

  // valid content type list
  validContentTypeList: {
    alert: 'Alert',
    application: 'Application',
    article: 'Article',
    articleCKEditorFull: 'Article CKEditor Full',
    consultation: 'Consultation',
    consultationFutureDate: 'Consultation Future Date',
    contact: 'Contact',
    deptinfo: 'Departmental information',
    feature: 'Feature',
    featuredContentList: 'Featured Content List',
    gallery: 'Gallery',
    link: 'Link',
    news: 'News',
    page: 'Page',
    profile: 'Profile',
    publication: 'Publication',
    publicationExternalLink: 'Publication External Link',
    researcherProfile: 'Researcher Profile',
    secureStats: 'Secure Stats',
    secureMarket: 'Secure Market',
  },

  // valid save as option list
  validSaveAsOptionList: {
    draft: 'draft',
    needsreview: 'needs_review',
    published: 'published',
    archived: 'archived',
  },

  // valid Moderation states
  validModerationStates: {
    draft: 'Draft',
    needsreview: 'Needs Review',
    published: 'Published',
    archived: 'Archived',
    deleted: 'Deleted'
  }

};

// Logic for dynamic dates should be inside a function or calculated once
const getTimestamp = () => new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 16);
const getRandom10Digits = () => Math.floor(10000000 + Math.random() * 9000000000).toString();

// caches a random-suffixed name per key until resetMediaLibraryNames() is called
const mediaLibraryNameCache: Record<string, string> = {};
const cachedName = (key: string, prefix: string) =>
  mediaLibraryNameCache[key] ??= prefix + ' - ' + getRandom10Digits();
export const resetMediaLibraryNames = () =>
{
  for (const key of Object.keys(mediaLibraryNameCache)) delete mediaLibraryNameCache[key];
};

const startDate = new Date();
// Format to YYYY-MM-DD
const formattedStartDate = startDate.toISOString().split('T')[0];

const startDateEdited = new Date();
// adding 7 days to todays date
startDateEdited.setDate(startDateEdited.getDate() + 2);
// Format to YYYY-MM-DD
const formattedStarDateEdited = startDateEdited.toISOString().split('T')[0];

const endDate = new Date();
// adding 7 days to todays date
endDate.setDate(endDate.getDate() + 7);
// Format to YYYY-MM-DD
const formattedEndDate = endDate.toISOString().split('T')[0];

const endDateEdited = new Date();
// adding 7 days to todays date
endDateEdited.setDate(endDateEdited.getDate() + 14);
// Format to YYYY-MM-DD
const formattedEndDateEdited = endDateEdited.toISOString().split('T')[0];

const futureStartDate = new Date();
// adding 7 days to todays date
futureStartDate.setDate(futureStartDate.getDate() + 3);
// Format to YYYY-MM-DD
const formattedFutureStartDate = futureStartDate.toISOString().split('T')[0];


///////////////////////////////////////////////////////////////////////////

// verification date times 

const verifyStartDate = new Date();
const verifyStartDateFormated = verifyStartDate.toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
});

const verifyEndDate = new Date();
verifyEndDate.setDate(verifyEndDate.getDate() + 7);
const verifyEndDateFormated = verifyEndDate.toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
});

const verifyFutureStartDateFormat = new Date();
verifyFutureStartDateFormat.setDate(verifyFutureStartDateFormat.getDate() + 3);
const verifyFutureStartDateFormated = verifyFutureStartDateFormat.toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
});

export const TestData = {

  get dateTime() { return new Date().toISOString(); },

  Media: {
    // attachment 1 values
    attachmentFileName: 'AutomationTesting.pdf',
    attachmentFileNameEdited: 'AutomationTestingEdited.pdf',

    secureAttachmentFileName: 'SecurePublication.pdf',
    secureAttachmentFileNameEdited: 'SecurePublicationEdited.pdf',

    // image 1 values 
    imageFileName: 'TestingImage.jpg',
    imageAltText: '',
    imageTitle: '',
    imageCaption: '',
    imageName: 'Automated image Testing New',

    // image 2 name has no other values as this tests that the other fields are not mandatory
    imageFileNameEdited: 'TestingImageEdited.png',
    imageNameEdited: 'Automated attachement Testing Edited',

    // gallery image values
    galleryImage1FileName: 'TestGallery.jpg',
    galleryImageAltText: 'Gallery Image 1 alt text',
    galleryImageTitle: 'Gallery Image 1 Title',
    galleryImageCaption: 'This is Gallery Image 1 Caption',
    galleryImageName: 'Automated gallery image 1 Testing New',

    // gallery image 2 values
    galleryImage2FileName: 'TestGallery2.jpg',
    galleryImage2AltText: 'Gallery Image 2 alt text',
    galleryImage2Title: 'Gallery Image 2 Title',
    galleryImage2Caption: 'This is Gallery Image 2 Caption',
    galleryImage2Name: 'Automated gallery image 2  Testing New',

    // gallery image 3 values
    galleryImage3FileName: 'TestGallery3.jpg',
    galleryImage3AltText: 'Gallery Image 3 alt text',
    galleryImage3Title: 'Gallery Image 3 Title',
    galleryImage3Caption: 'This is Gallery Image 3 Caption',
    galleryImage3Name: 'Automated gallery image 3  Testing New',

    // gallery image 4 values
    galleryImage4FileName: 'TestGallery4.jpg',
    galleryImage4AltText: 'Gallery Image 4 alt text',
    galleryImage4Title: 'Gallery Image 4 Title',
    galleryImage4Caption: 'This is Gallery Image 4 Caption',
    galleryImage4Name: 'Automated gallery image 4 Testing New',

    // gallery image 5 values
    galleryImage5FileName: 'TestGallery5.jpg',
    galleryImage5AltText: 'Gallery Image 5 alt text',
    galleryImage5Title: 'Gallery Image 5 Title',
    galleryImage5Caption: 'This is Gallery Image 5 Caption',
    galleryImage5Name: 'Automated gallery image 5 Testing New',

    // Gallery image edited name has no other values as this tests that the other fields are not mandatory
    galleryImage1FileNameEdited: 'TestingImageEdited.png',
    galleryImage1NameEdited: 'Gallery image edited',

    BannerImageFileName: 'BannerImage.jpg',
    BannerImageFileNameEdited: 'BannerImageEdit.png',
    bannerName: 'Automated Banner Testing New',
    bannerNameEdited: 'Automated Banner Testing Edited',
    bannerImageAltText: 'Banner Image alt text',
    bannerImageTitle: 'Banner Image Title',
    bannerImageCaption: 'This is Banner Image Caption',
    bannerImageAltTextEdited: 'Banner Image edited alt text',
    bannerImageTitleEdited: 'Banner Image Edited Title',
    bannerImageCaptionEdited: 'This is Edited Banner Image Caption',

    BannerOverlayImageFileName: 'BannerOverlayImage.jpg',
    BannerOverlayImageFileNameEdited: 'BannerOverlayImageEdited.jpg',
    bannerOverlayName: 'Automated Banner Overlay Testing New',
    bannerOverlayNameEdited: 'Automated Banner Overlay Testing Edited',
    bannerOverlayImageAltText: 'Banner Overlay Image alt text',
    bannerOverlayImageTitle: 'Banner Overlay Image Title',
    bannerOverlayImageCaption: 'This is Banner Overlay Image Caption',

    BannerImageThinFileName: 'BannerThinImage.jpg',
    BannerImageThinFileNameEdited: 'BannerThinImageEdited.jpg',
    bannerThinName: 'Automated Banner Thin Testing New',
    bannerThinNameEdited: 'Automated Banner Thin Testing Edited',
    bannerThinImageAltText: 'Banner Thin Image alt text',
    bannerThinImageTitle: 'Banner Thin Image Title',
    bannerThinImageCaption: 'This is Banner Thin Image Caption',

    remoteVideoURL: 'https://www.youtube.com/watch?v=thZ21emNdns',
    remoteVideoURLEdited: 'https://www.youtube.com/watch?v=H6k77SXU6cU',

    attachmentName: 'Automated attachment Testing New',
    attachmentNameEdited: 'Automated attachement Testing Edited',

    secureAttachmentName: 'Automated secure attachment Testing New',
    secureAttachmentNameEdited: 'Automated secure attachement Testing Edited',

    audioFile: 'AutomationAudio.wav',
    audioFileName: 'Automation Audio File Wav',

    wordFile: 'ImportFromWord.docx',
  },

  HSE_SiteTopics: {
    topic: 'Diving',
    topicEdited: 'Petrol',
    topic2: 'COMAH',
  },

  Alert: {
    title: 'Automated Test - New sample Alert title' + ' - ' + getTimestamp(),
    titleEdited: 'Automated Test - Edited sample Alert title' + ' - ' + getTimestamp(),
    revisionlog: 'This is an automated revision log message',
    revisionlogEdited: 'This is an edited automated revision log message',
    summary: 'This is new alert summary',
    publishedDateEdited: 'This is an edited alert note',
    body: 'This is a new alert body content',
    bodyEdited: 'This is an edited alert body content',
    teaser: 'This is a new alert teaser',
    teaserEdited: 'This is an edited alert teaser',
  },

  Application: {
    title: 'Automated Test - New sample Application title' + ' - ' + getTimestamp(),
    titleEdited: 'Automated Test - Edited sample Application title' + ' - ' + getTimestamp(),
    revisionlog: 'This is an automated revision log message',
    revisionlogEdited: 'This is an edited automated revision log message',
    summary: 'This is new application summary',
    summaryEdited: 'This is edited application summary',
    additionalinfo: 'This is new application additional information',
    additionalinfoEdited: 'This is edited application additional information',
    beforeyoustart: 'This is new application before you start',
    beforeyoustartEdited: 'This is edited application before you start',
    LinkURL: 'Professional medical and environmental health advice',
    LinkURLEdited: 'https://www.nidirect.gov.uk',
    LinkText: 'Professional medical and environmental health advice',
    LinkTextEdited: 'NI Direct External'
  },

  Article: {
    title: 'Automated Test - New sample Article title' + ' - ' + getTimestamp(),
    titleEdited: 'Automated Test - Edited sample Article title' + ' - ' + getTimestamp(),
    revisionlog: 'This is an automated revision log message',
    revisionlogEdited: 'This is an edited automated revision log message',
    summary: 'This is a new Article summary',
    summaryEdited: 'This is a edited Article summary',
    body: 'This is a new article body content',
    bodyEdited: 'This is a edited article body content',
  },

  Books: {
    BookTitle: 'Automated Test - New sample Book title' + ' - ' + getTimestamp(),
    BookTitleEdited: 'Automated Test - Edited sample Book title' + ' - ' + getTimestamp(),

    Chapter1Title: 'Chapter One' + ' - ' + getRandom10Digits(),
    Chapter1TitleEdited: 'Chapter One Edited' + ' - ' + getRandom10Digits(),
    Chapter2Title: 'Chapter Two' + ' - ' + getRandom10Digits(),
    Chapter2TitleEdited: 'Chapter Two Edited' + ' - ' + getRandom10Digits(),

    Paragraph1Title: 'Para One' + ' - ' + getRandom10Digits(),
    Paragraph1TitleEdited: 'Para One Edited' + ' - ' + getRandom10Digits(),
    Paragraph2Title: 'Para Two' + ' - ' + getRandom10Digits(),
    Paragraph2TitleEdited: 'Para Two Edited' + ' - ' + getRandom10Digits(),

    Glossery1Title: 'Glossery One' + ' - ' + getRandom10Digits(),
    Glossery1TitleEdited: 'Glossery One Edited' + ' - ' + getRandom10Digits(),
    Glossery2Title: 'Glossery Two' + ' - ' + getRandom10Digits(),
    Glossery2TitleEdited: 'Glossery Two Edited' + ' - ' + getRandom10Digits(),
  },

  Consultation: {
    title: 'Automated Test - New sample Consultation title' + ' - ' + getTimestamp(),
    titleEdited: 'Automated Test - Edited sample Consultation title' + ' - ' + getTimestamp(),
    datePublished: '2025-12-31',
    revisionlog: 'This is an automated revision log message',
    revisionlogEdited: 'This is an edited automated revision log message',
    summary: 'This is new consultation summary',
    summaryEdited: 'This is edited consultation summary',
    startDate: formattedStartDate,
    startDateEdited: '2025-12-31',
    startTime: '00:00:00',
    startTimeEdited: '10:00:00',
    endDate: formattedEndDate,
    endDateEdited: '2025-12-31',
    endTime: '23:59:59',
    endTimeEdited: '17:00:00',
    body: 'This is new consultation body field',
    bodyEdited: 'This is edited consultation body field',
    respondeOnline: 'Public appointments - Certification Officer for Northern Ireland',
    respondeOnlineEdited: 'https://www.nidirect.gov.uk',
    emailAddress: 'test@test.com',
    emailAddressEdited: 'automated@test.com',
    postalAddress: 'Stormont Estate Upper Newtownards Road Belfast BT4 3SH',
    postalAddressEdited: 'NICS Library Service Craigantlet Buildings Stoney LE3 3SX',
    verifyStartDateAndTime: verifyStartDateFormated + ', ' + '12.00 am',
    verifyEndDateAndTime: verifyEndDateFormated + ', ' + '11.59 pm',
    verifyStartDate: verifyStartDateFormated,
    verifyEndDate: verifyEndDateFormated,
    futureStartDate: formattedFutureStartDate,
    verifyFutureStartDate: verifyFutureStartDateFormated + ', ' + '12.00 am',
  },

  Contact: {
    title: 'Automated Test - New sample Contact title' + ' - ' + getTimestamp(),
    titleEdited: 'Automated Test - Edited sample Contact title' + ' - ' + getTimestamp(),
    revisionlog: 'This is an automated revision log message',
    revisionlogEdited: 'This is an edited automated revision log message',
    body: 'This is new contact body field',
    bodyEdited: 'This is edited contact body field',
    mapName: 'Belfast City Hall',
    mapLatitude: '54.5966',
    mapLongitude: ' -5.9299',
    mapNameEdited: 'Stormount',
    mapLocationModalName: 'Stormount',
  },



  Gallery: {
    title: 'Automated Test - New sample Gallery title' + ' - ' + getTimestamp(),
    titleEdited: 'Automated Test - Edited sample Gallery title' + ' - ' + getTimestamp(),
    revisionlog: 'This is an automated revision log message',
    revisionlogEdited: 'This is an edited automated revision log message',
    summary: 'This is a new Gallery summary',
    summaryEdited: 'This is a edited Gallery summary',
    body: 'This is a new Gallery body content',
    bodyEdited: 'This is a edited Gallery body content',
    favourite: false,
  },

  Link: {
    title: 'Automated Test - New Sample Link title' + ' - ' + getTimestamp(),
    titleEdited: 'Automated Test - Edited Sample Link title' + ' - ' + getTimestamp(),
    revisionlog: 'This is an automated revision log message',
    revisionlogEdited: 'This is an edited automated revision log message',
    linkURL: 'Murphy welcomes Fiscal Commission report',
    linkURLEdited: 'https://www.nidirect.gov.uk',
    linkType: 'Quick link',
    linkTypeEdited: 'Corporate link',
    linkLanguage: 'English',
    linkLanguageEdited: 'Irish',
  },

  News: {
    title: 'Automated Test - New sample News title' + ' - ' + getTimestamp(),
    titleEdited: 'Automated Test - Edited sample News title' + ' - ' + getTimestamp(),
    revisionlog: 'This is an automated revision log message',
    revisionlogEdited: 'This is an edited automated revision log message',
    newsType: 'news',
    newsTypeEdited: 'pressrelease',
    introductoryParagraph: 'This is a new introductory paragraph',
    introductoryParagraphEdited: 'This is a edited introductory paragraph',
    publicationDateEdited: '2025-12-31',
    teaser: 'This is a new news teaser',
    teaserEdited: 'This is a edited news teaser',
    body: 'This is new news body field',
    bodyEdited: 'This is edited news body field',
    notesToEditor: 'This is a new notes to editor',
    notesToEditorEdited: 'This is a edited notes to editor'
  },

  Profile: {
    title: 'Automated Test - New sample Profile title' + ' - ' + getTimestamp(),
    titleEdited: 'Automated Test - Edited sample Profile title' + ' - ' + getTimestamp(),
    revisionlog: 'This is an automated revision log message',
    revisionlogEdited: 'This is an edited automated revision log message',
    department: 'new Profile department',
    departmentEdited: 'edited Profile department',
    body: 'This is a new Profile body content',
    bodyEdited: 'This is a edited Profile body content',
    summary: 'This is a new Profile summary',
    summaryEdited: 'This is a edited Profile summary',

  },

  Publication: {
    title: 'Automated Test - New sample Publication title' + ' - ' + getTimestamp(),
    titleEdited: 'Automated Test - Edited sample Publication title' + ' - ' + getTimestamp(),
    datePublished: '2025-12-31',
    revisionlog: 'This is an automated revision log message',
    revisionlogEdited: 'This is an edited automated revision log message',
    lastUpdatedDateEdited: formattedStartDate,
    lastUpdatedTimeEdited: '00:00:00',
    publicationType: 'Circulars',
    publicationTypeEdited: 'Agendas and minutes',
    summary: 'This is new Publication summary',
    summaryEdited: 'This is edited Publication summary',
    body: 'This is new news body field',
    bodyEdited: 'This is edited news body field',
    externalPublication: 'https://www.nidirect.gov.uk',
    linkTextPubllication: 'NI Direct',
    externalPublicationEdited: 'https://www.bbc.co.uk',
    linkTextPubllicationEdited: 'BBC News',
    verifyDatePublished: verifyStartDateFormated,
    verifyLastUpdatedDate: verifyStartDateFormated,
  },

  MediaLibrary: {
    // getters cache their value until resetMediaLibraryNames() is called, so the same
    // random suffix is reused for create -> edit -> delete within a test, but differs test-to-test
    get audioName() { return cachedName('audioName', 'Audio File Automated'); },
    get audioNameEdited() { return cachedName('audioNameEdited', 'Audio File Automated Edited'); },

    get documentName() { return cachedName('documentName', 'Document File Automated'); },
    get documentNameEdited() { return cachedName('documentNameEdited', 'Document File Automated Edited'); },

    get imageName() { return cachedName('imageName', 'Image File Automated'); },
    get imageNameEdited() { return cachedName('imageNameEdited', 'Image File Automated Edited'); },


    // imageName: 'Image File Automated' + ' - ' + getTimestamp(),
    // imageNameEdited: 'Image File Automated Edited' + ' - ' + getTimestamp(),

    get remoteDocumentName() { return cachedName('remoteDocumentName', 'Remote Document Automated'); },
    get remoteDocumentNameEdited() { return cachedName('remoteDocumentNameEdited', 'Remote Document Automated Edited'); },
    remoteDocument: 'https://www.nidirect.gov.uk/sites/default/files/2026-07/about-savings-and-investment-form-pc1h.pdf',
    remoteDocumentEdited: 'https://www.nidirect.gov.uk/sites/default/files/2026-06/form-of-authority-19-12-17.pdf',

    get remoteVideoName() { return cachedName('remoteVideoName', 'Remote Video Automated'); },
    get remoteVideoNameEdited() { return cachedName('remoteVideoNameEdited', 'Remote Video Automated Edited'); },
    remoteVideoURL: 'https://www.youtube.com/watch?v=thZ21emNdns',
    remoteVideoURLEdited: 'https://www.youtube.com/watch?v=H6k77SXU6cU',

    revision: 'This is an automated Media Library log message',
    revisionEdited: 'This is an automated Media Library log message',

    visibleInMediaLibrary: true,
  },

  duplicated: {
    title: 'Automated Test - New sample Duplication title',
  }
};

export const galleryImageDetails: GalleryImageValues[] = Array.from({ length: 5 }, (_, i) => ({
  alt: `Gallery Image ${i + 1} alt text`,
  title: `Gallery Image ${i + 1} Title`,
  caption: `This is Gallery Image ${i + 1} Caption`,
  name: `Automated gallery image ${i + 1} Testing`,
}));