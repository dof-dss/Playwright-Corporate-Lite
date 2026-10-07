import { Page, Locator, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestData, TestSetUpData } from '@tdata/TestDataObject';
import path from 'path';

export interface GalleryImageValues
{
    alt: string;
    title: string;
    caption: string;
    name: string;
};

export class UploadMedia
{
    // logging
    private readonly testSteps: TestSteps;

    // Locators
    // add media attachment button
    private readonly addMediaAttachmentButton: Locator;
    private readonly editPageAddMediaAttachmentButton: Locator;

    // add media publication button
    private readonly addMediaAttachmentPublicationButton: Locator;
    private readonly editPageAddMediaAttachmentPublicationButton: Locator;

    // add media secure publication button
    private readonly addSecureMediaAttachmentPublicationButton: Locator;
    private readonly editPageAddSecureMediaAttachmentPublicationButton: Locator;

    // add media standard button
    private readonly addMediaImageButton: Locator;
    private readonly editPageAddMediaImageButton: Locator;

    // add media banner buttons (behind the collapsed Banner summary/fieldset)
    private readonly bannerSectionSummary: Locator;
    private readonly addMediaBannerImageButton: Locator;
    private readonly addMediaBannerImageOverlayButton: Locator;
    private readonly addMediaBannerImageThinButton: Locator;

    // add media gallery button
    private readonly addGalleryMediaImageButton: Locator;
    private readonly editGalleryPageAddMediaImageButton: Locator;

    private readonly mediaModelGridButton: Locator;
    private readonly mediaModelFavouriteButton: Locator;
    private readonly mediaModelTableButton: Locator;

    // add remote video button
    private readonly addMediaRemoteVideoButton: Locator;
    private readonly editPageMediaRemoteVideoButton: Locator;

    private readonly uploadAttachmentField: Locator;
    private readonly uploadImageField: Locator;
    private readonly uploadRemoteVideoField: Locator;

    private readonly mediAltTextField: Locator;
    private readonly mediaTitleField: Locator;
    private readonly mediaCaptionField: Locator;
    private readonly mediaNameField: Locator;

    private readonly addMediaSave: Locator;
    private readonly mediaSearchNameField: Locator;
    private readonly applyFiltersButton: Locator;
    private readonly insertSelectedButton: Locator;

    private readonly uploadAudioField: Locator;

    private readonly importWordFileInputField: Locator;

    // Media Library
    private readonly mediaUploadAudioField: Locator;
    private readonly mediaUploadAttachmentField: Locator;
    private readonly mediaUploadImageField: Locator;

    private readonly mediAltTextFieldLibrary: Locator;
    private readonly mediaTitleFieldLibrary: Locator;
    private readonly mediaCaptionFieldLibrary: Locator;

    private readonly mediaSecureAttachment: Locator;
    private readonly mediaRemoteDocument: Locator;
    private readonly mediaRemoteVideo: Locator;

    // constructor
    constructor
        (
            private readonly page: Page,
            // isolated instances of test data via constructor
            private testSetUpData: typeof TestSetUpData,
            private testdata: typeof TestData
        )
    {
        // logging isolated instance
        this.testSteps = new TestSteps();

        // locators
        this.addMediaAttachmentButton = page.locator('#edit-field-attachment-open-button');
        this.editPageAddMediaAttachmentButton = page.locator('//input[contains(@id, "edit-field-attachment-open-button")]');

        this.addMediaAttachmentPublicationButton = page.locator('#edit-field-publication-files-open-button');
        this.editPageAddMediaAttachmentPublicationButton = page.locator('//input[contains(@id, "edit-field-publication-files-open-button")]');

        this.addSecureMediaAttachmentPublicationButton = page.locator('#edit-field-publication-secure-files-open-button');
        this.editPageAddSecureMediaAttachmentPublicationButton = page.locator('//input[contains(@id, "edit-field-publication-secure-files-open-button")]');

        this.addMediaImageButton = page.locator('#edit-field-photo-open-button');
        this.editPageAddMediaImageButton = page.locator('//input[contains(@id, "edit-field-photo-open-button")]');

        this.bannerSectionSummary = page.getByRole('button', { name: 'Banner', exact: true });
        this.addMediaBannerImageButton = page.locator('input[name="field_banner_image-media-library-open-button"]:not([disabled])');
        this.addMediaBannerImageOverlayButton = page.locator('input[name="field_banner_image_overlay-media-library-open-button"]:not([disabled])');
        this.addMediaBannerImageThinButton = page.locator('input[name="field_banner_image_thin-media-library-open-button"]:not([disabled])');

        this.addGalleryMediaImageButton = page.locator('#edit-field-gallery-images-open-button');
        this.editGalleryPageAddMediaImageButton = page.locator('//input[contains(@id, "edit-field-gallery-images-open-button")]');

        this.mediaModelGridButton = page.getByRole('link', { name: 'Grid' });
        this.mediaModelTableButton = page.getByRole('link', { name: 'Table' });
        this.mediaModelFavouriteButton = page.getByRole('link', { name: 'Favourites' });


        this.addMediaRemoteVideoButton = page.locator('#edit-field-video-open-button');
        this.editPageMediaRemoteVideoButton = page.locator('//input[contains(@id, "edit-field-video-open-button")]');

        this.uploadAttachmentField = page.locator('//input[contains(@id,"edit-upload-upload")][1]');
        this.uploadImageField = page.locator('//input[contains(@id,"edit-upload-upload")][1]');
        this.uploadRemoteVideoField = page.locator('//input[contains(@id,"edit-url")]');

        this.mediAltTextField = page.locator('//input[contains(@id,"edit-media-0-fields-field-media-image-0-alt")]');
        this.mediaTitleField = page.locator('//input[contains(@id,"edit-media-0-fields-field-media-image-0-title")]');
        this.mediaCaptionField = page.locator('//input[contains(@id,"edit-media-0-fields-field-caption-0-value")]');
        this.mediaNameField = page.locator('//input[contains(@id,"edit-media-0-fields-name-0-value")]');

        this.addMediaSave = page.locator('//button[text()="Save"]');
        this.mediaSearchNameField = page.locator('//input[contains(@id,"edit-name")]');
        this.applyFiltersButton = page.locator('//input[contains(@id,"edit-submit-media-library")]');
        this.insertSelectedButton = page.locator('//button[text()="Insert selected"]');

        this.uploadAudioField = page.locator('//input[contains(@id,"edit-upload-upload")][1]');

        this.importWordFileInputField = page.locator('//input[@class="ck-hidden"]');

        // Media Library
        this.mediaUploadAudioField = page.locator('//input[contains(@id,"edit-field-media-audio-file-0-upload")][1]');
        this.mediaUploadAttachmentField = page.locator('//input[contains(@id,"edit-field-media-file-0-upload")][1]');

        this.mediaUploadImageField = page.locator('//input[contains(@id,"edit-field-media-image-0-upload")][1]');
        this.mediAltTextFieldLibrary = page.locator('//input[contains(@id,"edit-field-media-image-0-alt")]');
        this.mediaTitleFieldLibrary = page.locator('//input[contains(@id,"edit-field-media-image-0-title")]');
        this.mediaCaptionFieldLibrary = page.locator('//input[contains(@id,"edit-field-caption-0-value")]');

        this.mediaRemoteDocument = page.locator('//input[contains(@id,"edit-field-media-media-remote-0-value")][1]');
        this.mediaRemoteVideo = page.locator('//input[contains(@id,"edit-field-media-oembed-video-0-value")][1]');
        this.mediaSecureAttachment = page.locator('//input[contains(@id,"edit-field-media-file-1-0-upload")][1]');

    }

    // ---------------------- BUTTONS ---------------------------

    // click Add media button for attachments
    async clickAddMediaAttachmentButton()
    {
        await this.testSteps.LogInfo('Clicking Add media attachment Button');
        if (this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.publication)
        {
            await this.addMediaAttachmentPublicationButton.click();
        }
        else
        {
            await this.addMediaAttachmentButton.click();
        }
    }

    // click Add media button for attachments
    async clickEditPageAddMediaAttachmentButton()
    {
        await this.testSteps.LogInfo('Clicking Add media attachment Button while editing');
        if (this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.publication)
        {
            await this.editPageAddMediaAttachmentPublicationButton.click();
        }
        else
        {
            await this.editPageAddMediaAttachmentButton.click();
        }
    }

    // click Add secure media button for attachments
    async clickAddSecureMediaAttachmentButton()
    {
        await this.testSteps.LogInfo('Clicking Add secure media attachment Button');
        await this.addSecureMediaAttachmentPublicationButton.click();
    }

    // click Add secure media button for attachments on edit page 
    async clickEditPageAddSecureMediaAttachmentButton()
    {
        await this.testSteps.LogInfo('Clicking Add secure media attachment Button');
        await this.editPageAddSecureMediaAttachmentPublicationButton.click();
    }

    // click Add media button for images
    async clickAddMediaImageButton()
    {
        await this.testSteps.LogInfo('Clicking Add media image Button');
        if (this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.gallery)
        {
            await this.addGalleryMediaImageButton.click();
        }
        else
        {
            await this.addMediaImageButton.click();
        }
    }

    // click Add media button for attachments on edit page after removal of original pdf
    async clickEditPageAddMediaImageButton()
    {
        await this.testSteps.LogInfo('Clicking Add media image Button while editing');
        if (this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.gallery)
        {
            await this.editGalleryPageAddMediaImageButton.click();
        }
        else
        {
            await this.editPageAddMediaImageButton.click();
        }
    }

    // click Add media button for remote video
    async clickAddMediaRemoteVideoButton()
    {
        await this.testSteps.LogInfo('Clicking Add media remote video Button');
        await this.addMediaRemoteVideoButton.click();
    }

    // click Add media button for remote video
    async clickEditPageAddMediaRemoteVideoButton()
    {
        await this.testSteps.LogInfo('Clicking Add media remote video Button while editing');
        await this.editPageMediaRemoteVideoButton.click();
    }

    // click the Banner summary to expand the collapsed Banner fieldset, revealing its Add media buttons
    async clickBannerSummary()
    {
        await this.testSteps.LogInfo('Clicking Banner summary to expand the Banner fieldset');
        await this.bannerSectionSummary.click();
    }

    // click Add media button for the Banner image
    async clickAddMediaBannerImageButton()
    {
        await this.testSteps.LogInfo('Clicking Add media Banner image Button');
        await expect(this.addMediaBannerImageButton).toBeVisible();
        await expect(this.addMediaBannerImageButton).toBeEnabled();
        await this.addMediaBannerImageButton.click();
    }

    // click Add media button for the Banner image overlay
    async clickAddMediaBannerImageOverlayButton()
    {
        await this.testSteps.LogInfo('Clicking Add media Banner image overlay Button');
        await expect(this.addMediaBannerImageOverlayButton).toBeVisible();
        await expect(this.addMediaBannerImageOverlayButton).toBeEnabled();
        await this.addMediaBannerImageOverlayButton.click();
    }

    // click Add media button for the Banner image thin
    async clickAddMediaBannerImageThinButton()
    {
        await this.testSteps.LogInfo('Clicking Add media Banner image thin Button');
        await expect(this.addMediaBannerImageThinButton).toBeVisible();
        await expect(this.addMediaBannerImageThinButton).toBeEnabled();
        await this.addMediaBannerImageThinButton.click();
    }

    // remove the existing Banner image before inserting a replacement
    async removeBannerImage()
    {
        const removeBannerImageButton = this.page.locator('//input[contains(@id,"edit-field-banner-image-selection-0-remove-button")]');
        await this.testSteps.LogInfo('Removing the existing Banner image');
        await expect(removeBannerImageButton).toBeVisible();
        await expect(removeBannerImageButton).toBeEnabled();
        await removeBannerImageButton.click();
    }


    // Media Model 

    // Media Model 
    async clickMediaModelGridButton()
    {
        await this.testSteps.LogInfo('Clicking Media Model Grid Button');
        await this.mediaModelGridButton.click();
    }

    async clickMediaModelFavouriteButton()
    {
        await this.testSteps.LogInfo('Clicking Media Model Favourite Button');
        await this.mediaModelFavouriteButton.click();
    }


    // ---------------------- UPLOADS ---------------------------

    // Upload attachment
    async uploadAttachmnetProcess(attachmentFileName: string)
    {
        const filePath = path.join(process.cwd(), 'FileUploadSamples', attachmentFileName);
        await this.testSteps.LogInfo(`Uploading attachment "${attachmentFileName}" from files`);
        // resolves to whichever of the two upload fields is actually present
        await this.uploadAttachmentField.or(this.mediaUploadAttachmentField).setInputFiles(filePath);

    }

    // Upload secure attachment
    async uploadSecureAttachmentProcess(secureAttachmentFileName: string)
    {
        const filePath = path.join(process.cwd(), 'FileUploadSamples', secureAttachmentFileName);
        await this.testSteps.LogInfo(`Uploading secure attachment "${secureAttachmentFileName}" from files`);
        await this.uploadAttachmentField.or(this.mediaSecureAttachment).setInputFiles(filePath);

    }

    // Upload image
    async uploadImageProcess(imageFileName: string)
    {
        const filePath = path.join(process.cwd(), 'FileUploadSamples', imageFileName);
        await this.testSteps.LogInfo(`Uploading image "${imageFileName}" from files`);
        // resolves to whichever of the two upload fields is actually present
        await this.uploadAttachmentField.or(this.mediaUploadImageField).setInputFiles(filePath);

    }

    // Upload mulitple gallery images
    async uploadMultipleGalleryImagesProcess(galleryFileName: string, gallery2FileName: string, gallery3FileName: string, gallery4FileName: string, gallery5FileName: string,)
    {
        const gallery1FilePath = path.join(process.cwd(), 'FileUploadSamples', galleryFileName);
        const gallery2FilePath = path.join(process.cwd(), 'FileUploadSamples', gallery2FileName);
        const gallery3FilePath = path.join(process.cwd(), 'FileUploadSamples', gallery3FileName);
        const gallery4FilePath = path.join(process.cwd(), 'FileUploadSamples', gallery4FileName);
        const gallery5FilePath = path.join(process.cwd(), 'FileUploadSamples', gallery5FileName);

        await this.testSteps.LogInfo(`Uploading gallery images "${galleryFileName}" "${gallery2FileName}" "${gallery3FileName}" "${gallery4FileName}" "${gallery5FileName}" from files`);
        await this.uploadAttachmentField.setInputFiles([
            gallery1FilePath,
            gallery2FilePath,
            gallery3FilePath,
            gallery4FilePath,
            gallery5FilePath
        ]);
    }

    // Upload image
    async uploadAudioFileProcess(audioFileName: string)
    {
        const filePath = path.join(process.cwd(), 'FileUploadSamples', audioFileName);
        await this.testSteps.LogInfo(`Uploading audio file "${audioFileName}" from files`);

        // resolves to whichever of the two upload fields is actually present
        // This is due to differences between the media library and the add media model process
        await this.uploadAudioField.or(this.mediaUploadAudioField).setInputFiles(filePath);
    }

    // Upload remote video
    async addRemoteVideoLinkProcess(videoURL: string)
    {
        await this.testSteps.LogInfo(`Entering remote video URL "${videoURL}"`);
        await this.uploadRemoteVideoField.or(this.mediaRemoteVideo).fill(videoURL);
    }

    // Upload remote Document
    async addRemoteDocumentProcess(documentURL: string)
    {
        await this.testSteps.LogInfo(`Entering remote document URL "${documentURL}"`);
        await this.mediaRemoteDocument.fill(documentURL);
    }



    // Upload image
    async ImportWordFile(WordFile: string)
    {
        const filePath = path.join(process.cwd(), 'FileUploadSamples', WordFile);
        await this.testSteps.LogInfo(`Uploading image "${WordFile}" from files`);
        await this.importWordFileInputField.setInputFiles(filePath);
    }

    // ---------------------- FIELD NAMES ---------------------------

    // Add alt text, title, caption and name 
    async enterImageValues(addMediaAltText: string, addMediaTitle: string, addMediaCaption: string, addMediaName: string)
    {
        // alt text
        await this.testSteps.LogInfo(`Entering media Alt text "${addMediaAltText}"`);
        await this.mediAltTextField.fill(addMediaAltText);

        // title
        await this.testSteps.LogInfo(`Entering media Title "${addMediaTitle}"`);
        await this.mediaTitleField.fill(addMediaTitle);

        // caption
        await this.testSteps.LogInfo(`Entering media Caption "${addMediaCaption}"`);
        await this.mediaCaptionField.fill(addMediaCaption);

        // name
        await this.testSteps.LogInfo(`Entering media name "${addMediaName}"`);
        await this.mediaNameField.fill(addMediaName);
    }

    async enterImageValuesMediaLibrary(addMediaAltText: string, addMediaTitle: string, addMediaCaption: string)
    {
        // alt text
        await this.testSteps.LogInfo(`Entering media Alt text "${addMediaAltText}"`);
        await this.mediAltTextFieldLibrary.fill(addMediaAltText);

        // title
        await this.testSteps.LogInfo(`Entering media Title "${addMediaTitle}"`);
        await this.mediaTitleFieldLibrary.fill(addMediaTitle);

        // caption
        await this.testSteps.LogInfo(`Entering media Caption "${addMediaCaption}"`);
        await this.mediaCaptionFieldLibrary.fill(addMediaCaption);
    }



    // fill image details 
    async fillMultipleGalleryImageDetails(details: GalleryImageValues[])
    {
        for (let i = 0; i < details.length; i++)
        {
            const values = details[i];
            await this.page.fill(`//input[contains(@id, "edit-media-${i}-fields-field-media-image-0-alt")]`, values.alt);
            await this.page.fill(`//input[contains(@id, "edit-media-${i}-fields-field-media-image-0-title")]`, values.title);
            await this.page.fill(`//input[contains(@id, "edit-media-${i}-fields-field-caption-0-value")]`, values.caption);
            await this.page.fill(`//input[contains(@id, "edit-media-${i}-fields-name-0-value")]`, values.name);
        }
    }


    // Add just Name ( mainly used in edit tests )
    async enterMediaName(addMediaName: string)
    {

        await this.testSteps.LogInfo('Verifying media name field option is enabled');
        await expect(this.mediaNameField).toBeEnabled();

        await this.testSteps.LogInfo(`Entering media name "${addMediaName}"`);
        await this.mediaNameField.fill(addMediaName);
    }

    // ---------------------- SAVE BUTTON ---------------------------


    // click Media Save
    async clickMediaSave()
    {
        await this.testSteps.LogInfo('Clicking Save');
        await this.addMediaSave.click();
    }

    // ---------------------- MODAL ACTIONS ---------------------------

    // Enter Media Seach name
    async enterMediaSearchTitleField(mediaSearchName: string)
    {
        await this.testSteps.LogInfo(`Entering media name "${mediaSearchName}" in search field`);
        await this.mediaSearchNameField.fill(mediaSearchName);
    }

    // click Apply Filter
    async clickApplyFilters()
    {
        await this.testSteps.LogInfo('Clicking Apply Filter button');
        await this.applyFiltersButton.click();
    }

    // select an already existing media item from the Media Library grid by its name
    async selectMediaLibraryItemByName(itemName: string)
    {
        await this.testSteps.LogInfo(`Selecting media item "${itemName}" from Media Library`);
        await this.page.getByRole('checkbox', { name: `Select ${itemName}` }).first().check();
    }

    // click Insert Selected button
    async clickInsertSelectedButton()
    {
        await this.testSteps.LogInfo('Clicking Insert Selected button');
        await this.insertSelectedButton.click();
    }

    // ---------------------- verification ---------------------------

    //verify Attachment is uploaded 
    async verifyAttachmentUploaded()
    {
        await this.testSteps.LogInfo('Verifying Attachement is uploaded');

        // looking for 'x' button to remove to ensure it has been properly uploaded
        if (this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.publication)
        {
            await expect(this.page.locator('//input[contains(@id,"edit-field-publication-files-selection-0-remove-button")]')).toBeVisible();
            await expect(this.page.locator('//input[contains(@id,"edit-field-publication-files-selection-0-remove-button")]')).toBeEnabled();
        }
        else
        {
            await expect(this.page.locator('//input[contains(@id,"edit-field-attachment-selection-0-remove-button")]')).toBeVisible();
            await expect(this.page.locator('//input[contains(@id,"edit-field-attachment-selection-0-remove-button")]')).toBeEnabled();
        }
    }

    //verify Secure Attachment is uploaded 
    async verifySecureAttachmentUploaded()
    {
        await this.testSteps.LogInfo('Verifying Secure Attachement is uploaded');
        await expect(this.page.locator('//input[contains(@id,"edit-field-publication-secure-files-selection-0-remove-button")]')).toBeVisible();
        await expect(this.page.locator('//input[contains(@id,"edit-field-publication-secure-files-selection-0-remove-button")]')).toBeEnabled();
    }

    //verify Image is uploaded 
    async verifyImageUploaded()
    {
        await this.testSteps.LogInfo('Verifying Image is uploaded');

        // looing for 'x' button to remove to ensure it has been properly uploaded
        await expect(this.page.locator('//input[contains(@id,"edit-field-photo-selection-0-remove-button")]')).toBeVisible();
        await expect(this.page.locator('//input[contains(@id,"edit-field-photo-selection-0-remove-button")]')).toBeEnabled();
    }

    //verify Banner image is uploaded
    async verifyBannerImageUploaded()
    {
        await this.testSteps.LogInfo('Verifying Banner image is uploaded');
        await expect(this.page.locator('//input[contains(@id,"edit-field-banner-image-selection-0-remove-button")]')).toBeVisible();
        await expect(this.page.locator('//input[contains(@id,"edit-field-banner-image-selection-0-remove-button")]')).toBeEnabled();
    }

    //verify Banner image overlay is uploaded
    async verifyBannerImageOverlayUploaded()
    {
        await this.testSteps.LogInfo('Verifying Banner image overlay is uploaded');
        await expect(this.page.locator('//input[contains(@id,"edit-field-banner-image-overlay-selection-0-remove-button")]')).toBeVisible();
        await expect(this.page.locator('//input[contains(@id,"edit-field-banner-image-overlay-selection-0-remove-button")]')).toBeEnabled();
    }

    //verify Banner image thin is uploaded
    async verifyBannerImageThinUploaded()
    {
        await this.testSteps.LogInfo('Verifying Banner image thin is uploaded');
        await expect(this.page.locator('//input[contains(@id,"edit-field-banner-image-thin-selection-0-remove-button")]')).toBeVisible();
        await expect(this.page.locator('//input[contains(@id,"edit-field-banner-image-thin-selection-0-remove-button")]')).toBeEnabled();
    }

    //verify Gallery image is uploaded 
    async verifyGalleryImagesUploaded()
    {
        await this.testSteps.LogInfo('Verifying First Image is uploaded');
        // looing for 'x' button to remove to ensure it has been properly uploaded
        await expect(this.page.locator('//input[contains(@id,"edit-field-gallery-images-selection-0-remove-button")]')).toBeVisible();
        await expect(this.page.locator('//input[contains(@id,"edit-field-gallery-images-selection-0-remove-button")]')).toBeEnabled();

        await this.testSteps.LogInfo('Verifying Second Image is uploaded');
        // looing for 'x' button to remove to ensure it has been properly uploaded
        await expect(this.page.locator('//input[contains(@id,"edit-field-gallery-images-selection-1-remove-button")]')).toBeVisible();
        await expect(this.page.locator('//input[contains(@id,"edit-field-gallery-images-selection-1-remove-button")]')).toBeEnabled();

        await this.testSteps.LogInfo('Verifying Third Image is uploaded');
        // looing for 'x' button to remove to ensure it has been properly uploaded
        await expect(this.page.locator('//input[contains(@id,"edit-field-gallery-images-selection-2-remove-button")]')).toBeVisible();
        await expect(this.page.locator('//input[contains(@id,"edit-field-gallery-images-selection-2-remove-button")]')).toBeEnabled();

        await this.testSteps.LogInfo('Verifying Fourth Image is uploaded');
        // looing for 'x' button to remove to ensure it has been properly uploaded
        await expect(this.page.locator('//input[contains(@id,"edit-field-gallery-images-selection-3-remove-button")]')).toBeVisible();
        await expect(this.page.locator('//input[contains(@id,"edit-field-gallery-images-selection-3-remove-button")]')).toBeEnabled();

        await this.testSteps.LogInfo('Verifying Fifth Image is uploaded');
        // looing for 'x' button to remove to ensure it has been properly uploaded
        await expect(this.page.locator('//input[contains(@id,"edit-field-gallery-images-selection-4-remove-button")]')).toBeVisible();
        await expect(this.page.locator('//input[contains(@id,"edit-field-gallery-images-selection-4-remove-button")]')).toBeEnabled();
    }

    //verify Gallery image Edited uploaded 
    async verifyGalleryImagesUploadedEdited()
    {
        await this.testSteps.LogInfo('Verifying First Image is uploaded');
        // looing for 'x' button to remove to ensure it has been properly uploaded
        await expect(this.page.locator('//input[contains(@id,"edit-field-gallery-images-selection-0-remove-button")]')).toBeVisible();
        await expect(this.page.locator('//input[contains(@id,"edit-field-gallery-images-selection-0-remove-button")]')).toBeEnabled();
    }

    //verify Attachment is uploaded 
    async verifyRemoteVideoUploaded()
    {
        await this.testSteps.LogInfo('Verifying Remote video is uploaded');

        // looing for 'x' button to remove to ensure it has been properly uploaded
        await expect(this.page.locator('//input[contains(@id,"edit-field-video-selection-0-remove-button")]')).toBeVisible();
        await expect(this.page.locator('//input[contains(@id,"edit-field-video-selection-0-remove-button")]')).toBeEnabled();
    }


}