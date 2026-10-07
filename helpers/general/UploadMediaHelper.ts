import { Page, expect } from '@playwright/test';
import { TestSetUpData, TestData, galleryImageDetails } from '../../test-data/TestDataObject';
import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';
import { ApplicationNodePage } from '@poms/content-pages/Application/ApplicationNodePage';
import { RevisionPage } from '@poms/base-pages/RevisionPage';
import { ApplicationComparePage } from '@poms/content-pages/Application/ApplicationComparePage';
import { DeleteRevisionsPage } from '@poms/base-pages/DeleteRevisionsPage';
import { RevertRevisionsPage } from '@poms/base-pages/RevertRevisionsPage';
import { UploadMedia } from '@poms/base-pages/UploadMedia';
import { GalleryImageValues } from '@poms/base-pages/UploadMedia';

export interface UploadState
{
    original: boolean;
    edited: boolean;
};

export interface GalleryUploadState
{
    gallery: boolean;
    galleryEdit: boolean;
};

export interface BannerUploadState
{
    bannerImage?: boolean;
    bannerImageEdit?: boolean;
    bannerImageOverlay?: boolean;
    bannerImageThin?: boolean;
};

export class UploadMediaHelper
{
    // pages
    private readonly moderationSideBar: ModerationSideBar;
    private readonly applicationNodePage: ApplicationNodePage;
    private readonly revisionPage: RevisionPage;
    private readonly applicationComparePage: ApplicationComparePage;
    private readonly deleteRevisionsPage: DeleteRevisionsPage;
    private readonly revertRevisionsPage: RevertRevisionsPage;
    private readonly uploadMedia: UploadMedia;

    constructor(
        private page: Page,
        // isolated instances of test data via constructor
        private testSetUpData: typeof TestSetUpData,
        private testdata: typeof TestData
    )
    {
        // imported pages
        this.moderationSideBar = new ModerationSideBar(page, this.testSetUpData, this.testdata);
        this.applicationNodePage = new ApplicationNodePage(page, this.testSetUpData, this.testdata);
        this.revisionPage = new RevisionPage(page);
        this.applicationComparePage = new ApplicationComparePage(page, this.testSetUpData, this.testdata);
        this.deleteRevisionsPage = new DeleteRevisionsPage(page);
        this.revertRevisionsPage = new RevertRevisionsPage(page);
        this.uploadMedia = new UploadMedia(page, this.testSetUpData, this.testdata);
    }

    // upload Attachment
    async uploadAttachmentWorkflow(options: UploadState)
    {
        if (options.original)
        {
            await this.uploadMedia.clickAddMediaAttachmentButton();
            await this.uploadMedia.uploadAttachmnetProcess(this.testdata.Media.attachmentFileName);
            await this.uploadMedia.enterMediaName(this.testdata.Media.attachmentName);
        }
        else
        {
            await this.uploadMedia.clickEditPageAddMediaAttachmentButton();
            await this.uploadMedia.uploadAttachmnetProcess(this.testdata.Media.attachmentFileNameEdited);
            await this.uploadMedia.enterMediaName(this.testdata.Media.attachmentNameEdited);
        }
        await this.uploadMedia.clickMediaSave();
        await this.uploadMedia.clickInsertSelectedButton();
        await this.uploadMedia.verifyAttachmentUploaded();
    }

    // upload Secure Attachment
    async uploadSecureAttachmentWorkflow(options: UploadState)
    {
        if (options.original)
        {
            await this.uploadMedia.clickAddSecureMediaAttachmentButton();
            await this.uploadMedia.uploadAttachmnetProcess(this.testdata.Media.secureAttachmentFileName);
            await this.uploadMedia.enterMediaName(this.testdata.Media.secureAttachmentName);
        }
        else
        {
            await this.uploadMedia.clickEditPageAddSecureMediaAttachmentButton();
            await this.uploadMedia.uploadAttachmnetProcess(this.testdata.Media.secureAttachmentFileNameEdited);
            await this.uploadMedia.enterMediaName(this.testdata.Media.secureAttachmentNameEdited);
        }
        await this.uploadMedia.clickMediaSave();
        await this.uploadMedia.clickInsertSelectedButton();
        await this.uploadMedia.verifySecureAttachmentUploaded();
    }

    // upload image workflow
    async uploadImageWorkflow(options: UploadState)
    {
        if (options.original)
        {
            await this.uploadMedia.clickAddMediaImageButton();
            await this.uploadMedia.uploadImageProcess(this.testdata.Media.imageFileName);
            await this.uploadMedia.enterImageValues(this.testdata.Media.imageAltText, this.testdata.Media.imageTitle, this.testdata.Media.imageCaption, this.testdata.Media.imageName);
        }

        if (options.edited)
        {
            await this.uploadMedia.clickEditPageAddMediaImageButton();
            await this.uploadMedia.uploadImageProcess(this.testdata.Media.imageFileNameEdited);
            await this.uploadMedia.enterMediaName(this.testdata.Media.imageNameEdited);
        }

        await this.uploadMedia.clickMediaSave();
        await this.uploadMedia.clickInsertSelectedButton();
        await this.uploadMedia.verifyImageUploaded();
    }

    // upload banner images workflow (Banner image / Banner image overlay / Banner image thin)
    async uploadBannerImagesWorkflow(bannerOptions: BannerUploadState)
    {
        // Banner fieldset is collapsed by default - expand it to reveal its Add media buttons
        await this.page.waitForTimeout(1000);
        await this.uploadMedia.clickBannerSummary();

        if (bannerOptions.bannerImage)
        {
            await this.uploadMedia.clickAddMediaBannerImageButton();
            await this.uploadMedia.uploadImageProcess(this.testdata.Media.BannerImageFileName);
            await this.uploadMedia.enterImageValues(
                this.testdata.Media.bannerImageAltText,
                this.testdata.Media.bannerImageTitle,
                this.testdata.Media.bannerImageCaption,
                this.testdata.Media.bannerName
            );
            await this.uploadMedia.clickMediaSave();
            await this.uploadMedia.clickInsertSelectedButton();
            await this.uploadMedia.verifyBannerImageUploaded();
        }

        if (bannerOptions.bannerImageEdit)
        {
            await this.uploadMedia.removeBannerImage();
            await this.uploadMedia.clickAddMediaBannerImageButton();
            await this.uploadMedia.uploadImageProcess(this.testdata.Media.BannerImageFileNameEdited);
            await this.uploadMedia.enterImageValues(
                this.testdata.Media.bannerImageAltTextEdited,
                this.testdata.Media.bannerImageTitleEdited,
                this.testdata.Media.bannerImageCaptionEdited,
                this.testdata.Media.bannerNameEdited
            );
            await this.uploadMedia.clickMediaSave();
            await this.uploadMedia.clickInsertSelectedButton();
            await this.uploadMedia.verifyBannerImageUploaded();
        }

        if (bannerOptions.bannerImageOverlay)
        {
            await this.uploadMedia.clickAddMediaBannerImageOverlayButton();
            await this.uploadMedia.uploadImageProcess(this.testdata.Media.BannerOverlayImageFileName);
            await this.uploadMedia.enterImageValues(
                this.testdata.Media.bannerOverlayImageAltText,
                this.testdata.Media.bannerOverlayImageTitle,
                this.testdata.Media.bannerOverlayImageCaption,
                this.testdata.Media.bannerOverlayName
            );
            await this.uploadMedia.clickMediaSave();
            await this.uploadMedia.clickInsertSelectedButton();
            await this.uploadMedia.verifyBannerImageOverlayUploaded();
        }

        if (bannerOptions.bannerImageThin)
        {
            await this.uploadMedia.clickAddMediaBannerImageThinButton();
            await this.uploadMedia.uploadImageProcess(this.testdata.Media.BannerImageThinFileName);
            await this.uploadMedia.enterImageValues(
                this.testdata.Media.bannerThinImageAltText,
                this.testdata.Media.bannerThinImageTitle,
                this.testdata.Media.bannerThinImageCaption,
                this.testdata.Media.bannerThinName
            );
            await this.uploadMedia.clickMediaSave();
            await this.uploadMedia.clickInsertSelectedButton();
            await this.uploadMedia.verifyBannerImageThinUploaded();
        }
    }

    // upload image workflow
    async uploadGalleryImageWorkflow(galleryOptions: GalleryUploadState, details: GalleryImageValues[], mediaDialogOpen = false)
    {
        if (galleryOptions.gallery && details.length !== 5)
        {
            throw new Error(`Expected 5 gallery images, but got ${details.length}`);
        }

        if (galleryOptions.gallery)
        {
            if (!mediaDialogOpen)
            {
                await this.uploadMedia.clickAddMediaImageButton();
            }
            await this.uploadMedia.uploadMultipleGalleryImagesProcess(this.testdata.Media.galleryImage1FileName, this.testdata.Media.galleryImage2FileName,
                this.testdata.Media.galleryImage3FileName, this.testdata.Media.galleryImage4FileName, this.testdata.Media.galleryImage5FileName
            );
            await this.uploadMedia.fillMultipleGalleryImageDetails(details);
            await this.uploadMedia.clickMediaSave();
            await this.uploadMedia.clickInsertSelectedButton();
            await this.uploadMedia.verifyGalleryImagesUploaded();
        }

        if (galleryOptions.galleryEdit)
        {
            await this.uploadMedia.clickEditPageAddMediaImageButton();
            await this.uploadMedia.uploadImageProcess(this.testdata.Media.imageFileNameEdited);
            await this.uploadMedia.enterMediaName(this.testdata.Media.galleryImage1NameEdited);
            await this.uploadMedia.clickMediaSave();
            await this.uploadMedia.clickInsertSelectedButton();
            await this.uploadMedia.verifyGalleryImagesUploadedEdited();
        }

    }


    // upload remote video 
    async uploadRemoteVideo(options: UploadState)
    {
        if (options.original)
        {
            await this.uploadMedia.clickAddMediaRemoteVideoButton();
            await this.uploadMedia.addRemoteVideoLinkProcess(this.testdata.Media.remoteVideoURL);
            await this.page.getByRole('button', { name: 'Add', exact: true }).click();
        }
        else
        {
            await this.uploadMedia.clickEditPageAddMediaRemoteVideoButton();
            await this.uploadMedia.addRemoteVideoLinkProcess(this.testdata.Media.remoteVideoURLEdited);
            await this.page.getByRole('button', { name: 'Add', exact: true }).click();
        }
        await this.uploadMedia.clickMediaSave();
        await this.uploadMedia.clickInsertSelectedButton();
        await this.uploadMedia.verifyRemoteVideoUploaded();
    }


    // Select from Media Library
    // select an already existing Attachment/Document from the Media Library, instead of uploading a new one
    async selectExistingAttachmentFromLibrary(attachmentName: string)
    {
        await this.uploadMedia.clickAddMediaAttachmentButton();
        await this.searchAndInsertMedia(attachmentName);
        await this.uploadMedia.verifyAttachmentUploaded();
    }



    // select an already existing Attachment/Document from the Media Library, instead of uploading a new one
    async selectExistingSecureAttachmentFromLibrary(secureAttachmentName: string)
    {
        await this.uploadMedia.clickAddSecureMediaAttachmentButton();
        await this.searchAndInsertMedia(secureAttachmentName);
        await this.uploadMedia.verifySecureAttachmentUploaded();
    }



    private mediaLibraryItem(name: string)
    {
        return this.page.locator(`//div[normalize-space()="${name}"]`).first();
    }

    private async searchMediaLibrary(name: string)
    {
        await this.uploadMedia.enterMediaSearchTitleField(name);
        await this.uploadMedia.clickApplyFilters();
    }

    private async searchAndInsertMedia(name: string)
    {
        await this.searchMediaLibrary(name);
        await this.uploadMedia.selectMediaLibraryItemByName(name);
        await this.uploadMedia.clickInsertSelectedButton();
    }

    // select an already existing image from the Media Library, instead of uploading a new one
    async selectExistingImageFromLibrary(imageName: string, unavailableImageNames: string[] = [imageName])
    {
        await this.uploadMedia.clickAddMediaImageButton();

        // Creating this as any tests where content is not visible in media library model 
        // May be deleted or unpublished from the Media Library 
        if (this.testdata.MediaLibrary.visibleInMediaLibrary)
        {
            if (this.testdata.Gallery.favourite)
            {
                await this.uploadMedia.clickMediaModelFavouriteButton();
                await expect(this.mediaLibraryItem(imageName)).toBeVisible();
            }
            else 
            {
                await this.uploadMedia.clickMediaModelFavouriteButton();
                await this.searchMediaLibrary(imageName);
                await expect(this.mediaLibraryItem(imageName)).toBeHidden();

                // back to grid view: a non-favourite image must still be insertable
                await this.uploadMedia.clickMediaModelGridButton();
            }

            await this.searchAndInsertMedia(imageName);
        }
        else
        {
            for (const unavailableImageName of unavailableImageNames)
            {
                await expect(this.mediaLibraryItem(unavailableImageName)).toBeHidden();
            }

            // As no existing image is available in the Media Library, upload a new one
            await this.uploadGalleryImageWorkflow({
                gallery: true,
                galleryEdit: false,
            },
                galleryImageDetails, true);
        }
    }

    // select an already existing remote video from the Media Library, instead of uploading a new one
    async selectExistingRemoteVideoFromLibrary(remoteVideoName: string)
    {
        await this.uploadMedia.clickAddMediaRemoteVideoButton();
        await this.searchAndInsertMedia(remoteVideoName);
        await this.uploadMedia.verifyRemoteVideoUploaded();
    }


    // select an already existing remote document from the Media Library, instead of uploading a new one
    async selectExistingRemoteDocumentFromLibrary(documentName: string)
    {
        await this.uploadMedia.clickAddMediaAttachmentButton();
        await this.page.getByRole('button', { name: 'Remote document' }).click();

        await this.searchAndInsertMedia(documentName);
        //await this.uploadMedia.verifyRemoteDocumentUploaded();
    }



}