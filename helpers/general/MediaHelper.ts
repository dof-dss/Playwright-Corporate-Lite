import { Page } from '@playwright/test';
import { LoginPage } from '@poms/base-pages/LoginPage';
import { MediaPage } from '@poms/content-pages/Media/MediaPage';
import { AudioFileCreatePage } from '@poms/content-pages/Media/Audio/AudioFileCreatePage';
import { DocumentFileCreatePage } from '@poms/content-pages/Media/Document/DocumentFileCreatePage';
import { TestSetUpData, TestData } from '@tdata/TestDataObject';
import { AddMediaItemPage } from '@poms/content-pages/Media/AddMediaItemPage';
import { CreatePages } from '@poms/base-pages/CreatePages';
import { AudioFileEditPage } from '@poms/content-pages/Media/Audio/AudioFileEditPage';
import { DocumentFileEditPage } from '@poms/content-pages/Media/Document/DocumentFileEditPage';
import { DeleteMediaItemPage } from '@poms/content-pages/Media/DeleteMediaItemPage';
import { ImageCreatePage } from '@poms/content-pages/Media/Image/ImageFileCreatePage';
import { ImageFileEditPage } from '@poms/content-pages/Media/Image/ImageFileEditPage';
import { RemoteDocumentFileCreatePage } from '@poms/content-pages/Media/RemoteDocument/RemoteDocumentFileCreatePage';
import { RemoteDocumentFileEditPage } from '@poms/content-pages/Media/RemoteDocument/RemoteDocumentFileEditPage';
import { RemoteVideoFileCreatePage } from '@poms/content-pages/Media/RemoteVideo/RemoteVideoFileCreatePage';
import { RemoteVideoFileEditPage } from '@poms/content-pages/Media/RemoteVideo/RemoteVideoFileEditPage';

export interface DeleteOptions
{
    delete: boolean;
    cancel: boolean;
};

export class MediaHelper
{
    // pages
    private mediaPage: MediaPage;
    private addMediaItemPage: AddMediaItemPage;
    private audioFileCreatePage: AudioFileCreatePage;
    private documentFileCreatePage: DocumentFileCreatePage;
    private audioFileEditPage: AudioFileEditPage;
    private documentFileEditPage: DocumentFileEditPage;
    private imageFileCreatePage: ImageCreatePage;
    private createPage: CreatePages;
    private deleteMediaItemPage: DeleteMediaItemPage;
    private imageFileEditPage: ImageFileEditPage;
    private remoteDocumentFileCreatePage: RemoteDocumentFileCreatePage;
    private remoteDocumentFileEditPage: RemoteDocumentFileEditPage;
    private remoteVideoFileCreatePage: RemoteVideoFileCreatePage;
    private remoteVideoFileEditPage: RemoteVideoFileEditPage;

    constructor(
        private page: Page,
        // isolated instances of test data via constructor
        private testSetUpData: typeof TestSetUpData,
        private testData: typeof TestData
    )
    {
        // imported pages
        this.mediaPage = new MediaPage(page, testSetUpData);
        this.addMediaItemPage = new AddMediaItemPage(page, testSetUpData);
        this.audioFileCreatePage = new AudioFileCreatePage(page, testSetUpData, testData);
        this.audioFileEditPage = new AudioFileEditPage(page, testSetUpData, testData);
        this.documentFileCreatePage = new DocumentFileCreatePage(page, testSetUpData, testData);
        this.documentFileEditPage = new DocumentFileEditPage(page, testSetUpData, testData);
        this.imageFileCreatePage = new ImageCreatePage(page, testSetUpData, testData);
        this.imageFileEditPage = new ImageFileEditPage(page, testSetUpData, testData);
        this.remoteDocumentFileCreatePage = new RemoteDocumentFileCreatePage(page, testSetUpData, testData);
        this.remoteDocumentFileEditPage = new RemoteDocumentFileEditPage(page, testSetUpData, testData);
        this.remoteVideoFileCreatePage = new RemoteVideoFileCreatePage(page, testSetUpData, testData);
        this.remoteVideoFileEditPage = new RemoteVideoFileEditPage(page, testSetUpData, testData);

        this.createPage = new CreatePages(page, testSetUpData, testData);
        this.deleteMediaItemPage = new DeleteMediaItemPage(page);
    }

    // shared start of every add-media flow
    async startAddMediaFlow()
    {
        await this.page.waitForTimeout(500);
        //await this.page.getByRole('link', { name: 'Content', exact: true }).first().waitFor({ state: 'visible' });
        await this.page.getByRole('link', { name: 'Content', exact: true }).first().hover();

        await this.page.waitForTimeout(500);
        //await this.page.getByRole('link', { name: 'Media', exact: true }).first().waitFor({ state: 'visible' });
        await this.page.getByRole('link', { name: 'Media', exact: true }).first().hover();

        await this.page.waitForTimeout(500);
        //await this.page.getByRole('link', { name: 'Media library', exact: true }).waitFor({ state: 'visible' });
        await this.page.getByRole('link', { name: 'Media library', exact: true }).click();

        await this.mediaPage.mediaPageURLCheck();

        await this.mediaPage.clickAddMediaButton();
        await this.addMediaItemPage.addMediaItemPageURLCheck();
    }


    // shared final step for every create/edit media flow
    private async saveAndVerifyMediaPage()
    {
        await this.createPage.clickSaveButton();
        await this.mediaPage.mediaPageURLCheck();
    }

    // ----- CREATE MEDIA -----

    // create Audio file
    async createAudioMediaLibrary(title = this.testData.MediaLibrary.audioName)
    {
        await this.startAddMediaFlow();
        await this.addMediaItemPage.addAudioButton();

        await this.audioFileCreatePage.createAudioPageURLCheck();
        await this.audioFileCreatePage.fillAudioForm({
            audioTitle: title,
            revisionLogMessage: this.testData.MediaLibrary.revision,
        });

        await this.saveAndVerifyMediaPage();
    }

    // create Document file
    async createDocumentMediaLibrary(title = this.testData.MediaLibrary.documentName)
    {
        await this.startAddMediaFlow();
        await this.addMediaItemPage.addDocumentButton();

        await this.documentFileCreatePage.createDocumentPageURLCheck();
        await this.documentFileCreatePage.fillDocumentForm({
            documentTitle: title,
            revisionLogMessage: this.testData.MediaLibrary.revision,
        });

        await this.saveAndVerifyMediaPage();
    }

    // create Image file
    async createImageMediaLibrary(title = this.testData.MediaLibrary.imageName)
    {
        await this.startAddMediaFlow();
        await this.addMediaItemPage.addImageButton();

        await this.imageFileCreatePage.createImagePageURLCheck();
        await this.imageFileCreatePage.fillImageForm({
            imageTitle: title,
            revisionLogMessage: this.testData.MediaLibrary.revision,
        });

        await this.saveAndVerifyMediaPage();
    }

    // create Remote document file
    async createRemoteDocumentMediaLibrary(title = this.testData.MediaLibrary.remoteDocumentName)
    {
        await this.startAddMediaFlow();
        await this.addMediaItemPage.addRemoteDocumentButton();

        await this.remoteDocumentFileCreatePage.createRemoteDocumentPageURLCheck();
        await this.remoteDocumentFileCreatePage.fillRemoteDocumentFileForm({
            remoteDocumentTitle: title,
            revisionLogMessage: this.testData.MediaLibrary.revision,
            remoteDocumentURL: this.testData.MediaLibrary.remoteDocument,
        });

        await this.saveAndVerifyMediaPage();
    }

    // create Remote video file
    async createRemoteVideoMediaLibrary(title = this.testData.MediaLibrary.remoteVideoName)
    {
        await this.startAddMediaFlow();
        await this.addMediaItemPage.addRemoteVideoButton();

        await this.remoteVideoFileCreatePage.createRemoteVideoPageURLCheck();
        await this.remoteVideoFileCreatePage.fillRemoteVideoFileForm({
            remoteVideoTitle: title,
            revisionLogMessage: this.testData.MediaLibrary.revision,
            remoteVideoURL: this.testData.MediaLibrary.remoteVideoURL,
        });

        await this.saveAndVerifyMediaPage();
    }


    // ----- EDIT MEDIA -----
    // shared navigation to the edit page for any media type
    private async reachEditPageTableView(contentTitle: string)
    {
        await this.mediaPage.clickTableView();

        await this.mediaPage.enterContentTitleInSearch(contentTitle);
        await this.mediaPage.clickSearchButton();
        await this.mediaPage.clickEditMediaButtonTableView();
    }

    private async reachEditPageGridView(contentTitle: string)
    {
        await this.mediaPage.clickGridView();
        await this.mediaPage.enterContentTitleInSearch(contentTitle);
        await this.mediaPage.clickSearchButton();
        await this.mediaPage.clickEditMediaButtonGridView(contentTitle);
    }


    // shared fill and save for edit Audio media 
    private async fillAndSaveEditedAudioForm()
    {
        await this.audioFileEditPage.editAudioPageURLCheck();
        await this.audioFileEditPage.fillEditedAudioForm({
            audioTitle: this.testData.MediaLibrary.audioNameEdited,
            revisionLogMessage: this.testData.MediaLibrary.revisionEdited,
        });

        await this.saveAndVerifyMediaPage();
    }

    async editAudioMediaLibraryTableView()
    {
        await this.reachEditPageTableView(this.testData.MediaLibrary.audioNameEdited);
        await this.fillAndSaveEditedAudioForm();
    }

    async editAudioMediaLibraryGridView()
    {
        await this.reachEditPageGridView(this.testData.MediaLibrary.audioName);
        await this.fillAndSaveEditedAudioForm();
    }


    // shared fill and save for edit Document media
    private async fillAndSaveEditedDocumentForm()
    {
        await this.documentFileEditPage.editDocumentPageURLCheck();
        await this.documentFileEditPage.fillEditedDocumentForm({
            documentTitle: this.testData.MediaLibrary.documentNameEdited,
            revisionLogMessage: this.testData.MediaLibrary.revisionEdited,
        });

        await this.saveAndVerifyMediaPage();
    }

    async editDocumentMediaLibraryTableView()
    {
        await this.reachEditPageTableView(this.testData.MediaLibrary.documentNameEdited);
        await this.fillAndSaveEditedDocumentForm();
    }

    async editDocumentMediaLibraryGridView()
    {
        await this.reachEditPageGridView(this.testData.MediaLibrary.documentName);
        await this.fillAndSaveEditedDocumentForm();
    }

    // shared fill and save for edit Image media
    private async fillAndSaveEditedImageForm()
    {
        await this.imageFileEditPage.editImagePageURLCheck();
        await this.imageFileEditPage.fillEditedImageForm({
            imageTitle: this.testData.MediaLibrary.imageNameEdited,
            revisionLogMessage: this.testData.MediaLibrary.revisionEdited,
        });

        await this.saveAndVerifyMediaPage();
    }

    async editImageMediaLibraryTableView()
    {
        await this.reachEditPageTableView(this.testData.MediaLibrary.imageNameEdited);
        await this.fillAndSaveEditedImageForm();
    }

    async editImageMediaLibraryGridView()
    {
        await this.reachEditPageGridView(this.testData.MediaLibrary.imageName);
        await this.fillAndSaveEditedImageForm();
    }


    // shared fill and save for edit Remote document media
    private async fillAndSaveEditedRemoteDocumentForm()
    {
        await this.remoteDocumentFileEditPage.editRemoteDocumentPageURLCheck();
        await this.remoteDocumentFileEditPage.fillEditedRemoteDocumentForm({
            remoteDocumentTitle: this.testData.MediaLibrary.remoteDocumentNameEdited,
            revisionLogMessage: this.testData.MediaLibrary.revisionEdited,
            remoteDocumentURL: this.testData.MediaLibrary.remoteDocumentEdited,
        });

        await this.saveAndVerifyMediaPage();
    }

    async editRemoteDocumentMediaLibraryTableView()
    {
        await this.reachEditPageTableView(this.testData.MediaLibrary.remoteDocumentNameEdited);
        await this.fillAndSaveEditedRemoteDocumentForm();
    }

    async editRemoteDocumentMediaLibraryGridView()
    {
        await this.reachEditPageGridView(this.testData.MediaLibrary.remoteDocumentName);
        await this.fillAndSaveEditedRemoteDocumentForm();
    }


    // shared fill and save for edit Remote video media
    private async fillAndSaveEditedRemoteVideoForm()
    {
        await this.remoteVideoFileEditPage.editRemoteVideoPageURLCheck();
        await this.remoteVideoFileEditPage.fillEditedRemoteVideoForm({
            remoteVideoTitle: this.testData.MediaLibrary.remoteVideoNameEdited,
            revisionLogMessage: this.testData.MediaLibrary.revisionEdited,
            remoteVideoURL: this.testData.MediaLibrary.remoteVideoURLEdited,
        });

        await this.saveAndVerifyMediaPage();
    }

    async editRemoteVideoMediaLibraryTableView()
    {
        await this.reachEditPageTableView(this.testData.MediaLibrary.remoteVideoNameEdited);
        await this.fillAndSaveEditedRemoteVideoForm();
    }

    async editRemoteVideoMediaLibraryGridView()
    {
        await this.reachEditPageGridView(this.testData.MediaLibrary.remoteVideoName);
        await this.fillAndSaveEditedRemoteVideoForm();
    }





    // ----- DELETE MEDIA -----
    async deleteMediaLibraryGridView(contentTitle: string, options: DeleteOptions)
    {
        // click edit content
        await this.mediaPage.clickGridView();
        await this.mediaPage.enterContentTitleInSearch(contentTitle);
        await this.mediaPage.clickSearchButton();
        await this.mediaPage.clickDeleteMediaButtonGridView(contentTitle);

        if (options.delete === true)
        {
            await this.deleteMediaItemPage.clickDelete();
            await this.deleteMediaItemPage.deleteMediaItemConfirmationCheck();
            //await this.contentPage.confirmContentDoesNotExist(this.testSetUpData.contentTitleforTest.contentTitle);
            // test moderation state updated to deleted 
            this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.deleted;
        }
        else if (options.cancel === true)
        {
            await this.deleteMediaItemPage.clickCancel();
            //await this.applicationNodePage.applicationNodeURLCheck();
        }
    }


    // ----- FAVOURITES MEDIA -----
    async favouriteMedia(contentTitle: string)
    {
        await this.mediaPage.clickGridView();
        await this.mediaPage.enterContentTitleInSearch(contentTitle);
        await this.mediaPage.clickSearchButton();
        await this.mediaPage.clickFavouriteMediaButtonGridView();

        await this.mediaPage.clickFavourtiesView();
        await this.mediaPage.enterContentTitleInSearch(contentTitle);
        await this.mediaPage.clickSearchButton();
    }

    // ----- FAVOURITE MEDIA -----
    async unfavouriteMedia(contentTitle: string)
    {
        await this.mediaPage.clickFavourtiesView();
        await this.mediaPage.enterContentTitleInSearch(contentTitle);
        await this.mediaPage.clickSearchButton();
        await this.mediaPage.clickUnfavouriteMediaButtonGridView();

        await this.mediaPage.clickGridView();
        await this.mediaPage.enterContentTitleInSearch(contentTitle);
        await this.mediaPage.clickSearchButton();
    }


    // ----- BULK OPTIONS -----
    async deleteMediaLibraryBulkOption(contentTitle: string, options: DeleteOptions)
    {
        // click edit content
        await this.mediaPage.clickGridView();
        await this.mediaPage.enterContentTitleInSearch(contentTitle);
        await this.mediaPage.clickSearchButton();

        await this.mediaPage.deleteSingleMediaFromBulkOptions(contentTitle);


        if (options.delete === true)
        {
            await this.deleteMediaItemPage.clickDelete();
            await this.deleteMediaItemPage.deleteMediaItemConfirmationCheck();
            //await this.contentPage.confirmContentDoesNotExist(this.testSetUpData.contentTitleforTest.contentTitle);
            // test moderation state updated to deleted 
            this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.deleted;
        }
        else if (options.cancel === true)
        {
            await this.deleteMediaItemPage.clickCancel();
            //await this.applicationNodePage.applicationNodeURLCheck();
        }
    }

    async deleteMediaLibraryBulkOptionMultiple(contentTitle: string, options: DeleteOptions)
    {
        const searchTitle = contentTitle.slice(0, -11).trimEnd();

        await this.mediaPage.clickTableView();
        await this.mediaPage.enterContentTitleInSearch(searchTitle);
        await this.mediaPage.clickSearchButton();

        await this.mediaPage.deleteMultipleMediaFromBulkOptions();
        // // click edit content
        // await this.mediaPage.clickGridView();
        // await this.mediaPage.enterContentTitleInSearch(contentTitle);
        // await this.mediaPage.clickSearchButton();

        //await this.mediaPage.chooseDeleteMediaFromBulkOptions(contentTitle);

        if (options.delete === true)
        {
            await this.deleteMediaItemPage.clickDelete();
            await this.deleteMediaItemPage.deleteMediaItemConfirmationCheck();
            //await this.contentPage.confirmContentDoesNotExist(this.testSetUpData.contentTitleforTest.contentTitle);
            // test moderation state updated to deleted 
            this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.deleted;

            await this.page.locator('form#views-form-media-library-default-page').getByText('No media available.', { exact: true }).waitFor({ state: 'visible' });

        }
        else if (options.cancel === true)
        {
            await this.deleteMediaItemPage.clickCancel();
            //await this.applicationNodePage.applicationNodeURLCheck();
        }
    }

    async unpublishMediaLibraryBulkOption(contentTitle: string)
    {
        // click edit content
        await this.mediaPage.clickGridView();
        await this.mediaPage.enterContentTitleInSearch(contentTitle);
        await this.mediaPage.clickSearchButton();

        await this.mediaPage.chooseUnpublishMediaFromBulkOptions(contentTitle);
    }

    async publishMediaLibraryBulkOption(contentTitle: string)
    {
        // click edit content
        await this.mediaPage.clickGridView();
        await this.mediaPage.enterContentTitleInSearch(contentTitle);
        await this.mediaPage.clickSearchButton();

        await this.mediaPage.choosePublishMediaFromBulkOptions(contentTitle);

    }


}