import test, { Page, Locator, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { UploadMedia } from '@poms/base-pages/UploadMedia';
import { TestSetUpData, TestData } from '@tdata/TestDataObject';


export class CKEditor
{
    // logging
    private readonly testSteps: TestSteps;

    // Upload Media Page
    private readonly uploadMedia: UploadMedia;


    // Locators
    private readonly enterAdditionalInfo: Locator;
    private readonly enterBeforeYouStart: Locator;
    private readonly enterBodyField: Locator;
    private readonly enterNoteToEditorField: Locator;

    // constructor
    constructor(
        private readonly page: Page,
        // isolated instances of test data 
        private testSetUpData: typeof TestSetUpData,
        private testData: typeof TestData,
    )
    {
        // logging isolated instance
        this.testSteps = new TestSteps();

        this.uploadMedia = new UploadMedia(page, this.testSetUpData, this.testData);

        this.enterAdditionalInfo = page.locator('#edit-field-additional-information-wrapper').getByRole('textbox', { name: 'Rich Text Editor. Editing' });
        this.enterBeforeYouStart = page.locator('#edit-body-wrapper').getByRole('textbox', { name: 'Rich Text Editor. Editing' });
        this.enterBodyField = page.locator('#edit-body-wrapper').getByRole('textbox', { name: 'Rich Text Editor. Editing' });
        this.enterNoteToEditorField = page.locator('#edit-field-notes-to-editors-wrapper').getByRole('paragraph');
    }


    // enter additional information CKEditor
    async enterCKEditorAdditionalInfo(additionalinfo: string)
    {
        await this.testSteps.LogInfo(`Entering "${additionalinfo}" into the Additional info field`);
        await this.enterAdditionalInfo.fill(additionalinfo);
    }

    // enter before you start CKEditor 
    async enterCKEditorBeforeYouStart(beforeyoustart: string)
    {
        await this.testSteps.LogInfo(`Entering "${beforeyoustart}" into the Before you Start field`);
        await this.enterBeforeYouStart.fill(beforeyoustart);
    }

    // enter body CKEditor 
    async enterCKEditorBody(body: string)
    {
        await this.testSteps.LogInfo(`Entering "${body}" into the Body field`);
        await this.enterBodyField.fill(body);
    }

    // enter body CKEditor 
    async enterCKEditorBodyFunctionality(body: string, existingAudioName?: string)
    {
        await this.testSteps.LogInfo(`Entering "${body}" into the Body field`);
        await this.enterBodyField.fill(body);

        await this.ckEditorFullWorkflow(existingAudioName);
    }

    // enter body CKEditor 
    async enterCKEditorBodyImportFromWord(body: string)
    {
        await this.testSteps.LogInfo(`Entering "${body}" into the Body field`);
        await this.enterBodyField.fill(body);

        await this.ImportWordFileToBodyField();
    }


    // enter body CKEditor 
    async linkInternalNodeCKEditor(link: string)
    {
        await this.testSteps.LogInfo(`Entering "${link}" into the Body field`);
        await this.page.locator('#edit-body-wrapper').getByRole('button', { name: 'Link' }).click();
        await this.testSteps.LogInfo(`Inputing Link "${link}" to attach Gallery`);
        await this.page.getByRole('textbox', { name: 'Link URL' }).fill(link);
        await this.testSteps.LogInfo(`Clicking "${link}" to Add`);
        await this.page.locator(`//li/div/span[contains(text(), "${link}")]`).click();
        await this.testSteps.LogInfo('Clicking insert');
        await this.page.getByRole('button', { name: 'Insert', exact: true }).click();
    }

    // enter body CKEditor 
    async enterNoteToEditors(noteToEditor: string)
    {
        await this.testSteps.LogInfo(`Entering "${noteToEditor}" into the Note to Editor field`);
        await this.enterNoteToEditorField.fill(noteToEditor);
    }

    // CK Editor Functionlity
    async ckEditorFullWorkflow(existingAudioName?: string)
    {
        // if (existingAudioName)
        // {
        //     await this.addAudioFileToBodyField(existingAudioName);
        // }
        // else
        // {
        // body formatting 
        await this.addBoldTextToBodyField();
        // itcalics formating
        await this.addItalicTextToBodyField();
        // block qoute formating 
        await this.addBlockQouteToBodyField();
        // superscript formating 
        await this.addSuperScriptToBodyField();
        // paragraph formatting
        await this.addParagraphToBodyField();
        // heading 2 formating
        await this.addHeading2ToBodyField();
        // heading 3 formating
        await this.addHeading3ToBodyField();
        // heading 4 formating
        await this.addHeading4ToBodyField();
        // information notice formating 
        await this.addInformationNoticeToBodyField();
        // Bullet Points formatting
        await this.addBulletPointsToBodyField();
        // Number list formatting 
        await this.addNumbersToBodyField();
        await this.addSpecificNumbersToBodyField();
        // Number list revrersed order formatting 
        await this.addReverseNumbersToBodyField();
        // Adding Image via CK Editor
        await this.addMediaImageToBodyField();
        // Adding Audio File
        await this.addAudioFileToBodyField();
        // Adding Remote Video File
        await this.addRemoteVideoToBodyField();
        // Adding special Characters
        await this.addSpecialCharactersToBodyField();
        // table formating 
        await this.addTableToBodyField();
        // }
    }


    async addBoldTextToBodyField()
    {
        // If this method is to be expanded out to all content types it will need to be updated to include ids on selectors 

        await this.testSteps.LogInfo('Hitting "Enter" on keyboard to take a new line');
        await this.page.keyboard.press('Enter');

        await this.page.waitForTimeout(1000);
        await this.testSteps.LogInfo('Verifying "Bold" Format option is enabled');
        await expect(this.page.getByRole('button', { name: 'Bold' })).toBeEnabled();

        await this.testSteps.LogInfo('Clicking "Bold" Format option');
        await this.page.getByRole('button', { name: 'Bold' }).click();

        await this.page.waitForTimeout(1000);
        await this.testSteps.LogInfo('Verifying "Bold" Format option is selected');
        await expect(this.page.locator('//span[contains(text(), "Bold")]/ancestor::button[@class="ck ck-button ck-on"]')).toBeVisible();

        await this.testSteps.LogInfo('Entering "This is Bold" text into CKEditor');
        await this.enterBodyField.pressSequentially('This is Bold');

        await this.testSteps.LogInfo('Verifying "Remove Format" option is enabled');
        await expect(this.page.getByRole('button', { name: 'Remove Format' })).toBeEnabled();

        await this.testSteps.LogInfo('Clicking "Remove Format" option');
        await this.page.getByRole('button', { name: 'Remove Format' }).click();

        await this.testSteps.LogInfo('Verifying "Bold" Format option is NOT selected');
        await expect(this.page.locator('//span[contains(text(), "Bold")]/ancestor::button[@class="ck ck-button ck-off"]')).toBeVisible();
    }

    async addItalicTextToBodyField()
    {
        // If this method is to be expanded out to all content types it will need to be updated to include ids on selectors 

        await this.testSteps.LogInfo('Hitting "Enter" on keyboard to take a new line');
        await this.page.keyboard.press('Enter');

        await this.page.waitForTimeout(1000);
        await this.testSteps.LogInfo('Verifying "Italic" Format option is enabled');
        await expect(this.page.getByRole('button', { name: 'Italic' })).toBeEnabled();

        await this.testSteps.LogInfo('Clicking "Italic" Format option');
        await this.page.getByRole('button', { name: 'Italic' }).click();

        await this.page.waitForTimeout(1000);
        await this.testSteps.LogInfo('Verifying "Italics" Format option is selected');
        await expect(this.page.locator('//span[contains(text(), "Italic")]/ancestor::button[@class="ck ck-button ck-on"]')).toBeVisible();

        await this.testSteps.LogInfo('Entering "This is Italics" text into CKEditor');
        await this.enterBodyField.pressSequentially('This is Italics');

        await this.testSteps.LogInfo('Verifying "Remove Format" option is enabled');
        await expect(this.page.getByRole('button', { name: 'Remove Format' })).toBeEnabled();

        await this.testSteps.LogInfo('Clicking "Remove Format" option');
        await this.page.getByRole('button', { name: 'Remove Format' }).click();

        await this.testSteps.LogInfo('Verifying "Italics" Format option is NOT selected');
        await expect(this.page.locator('//span[contains(text(), "Bold")]/ancestor::button[@class="ck ck-button ck-off"]')).toBeVisible();
    }

    async addBlockQouteToBodyField()
    {
        // If this method is to be expanded out to all content types it will need to be updated to include ids on selectors 

        await this.testSteps.LogInfo('Hitting "Enter" on keyboard to take a new line');
        await this.page.keyboard.press('Enter');

        await this.page.waitForTimeout(1000);
        await this.testSteps.LogInfo('Verifying "Block quote" Format option is enabled');
        await expect(this.page.getByRole('button', { name: 'Block quote' })).toBeEnabled();

        await this.testSteps.LogInfo('Clicking "Block quote" Format option');
        await this.page.getByRole('button', { name: 'Block quote' }).click();

        await this.page.waitForTimeout(1000);
        await this.testSteps.LogInfo('Verifying "Block quote" Format option is selected');
        await expect(this.page.locator('//span[contains(text(), "Block quote")]/ancestor::button[@class="ck ck-button ck-on"]')).toBeVisible();

        await this.testSteps.LogInfo('Entering "This is a Block quote" text into CKEditor');
        await this.enterBodyField.pressSequentially('This is a Block quote');

        await this.testSteps.LogInfo('Hitting "Enter" on keyboard to take a new line');
        await this.page.keyboard.press('Enter');

        await this.testSteps.LogInfo('Verifying "Block quoute" option is enabled');
        await expect(this.page.getByRole('button', { name: 'Block quote' })).toBeEnabled();

        await this.testSteps.LogInfo('Clicking "Block quote" option');
        await this.page.getByRole('button', { name: 'Block quote' }).click();

        await this.testSteps.LogInfo('Verifying "Block quote" Format option is NOT selected');
        await expect(this.page.locator('//span[contains(text(), "Block quote")]/ancestor::button[@class="ck ck-button ck-off"]')).toBeVisible();
    }

    async addSuperScriptToBodyField()
    {
        // If this method is to be expanded out to all content types it will need to be updated to include ids on selectors 

        await this.testSteps.LogInfo('Hitting "Enter" on keyboard to take a new line');
        await this.page.keyboard.press('Enter');

        await this.page.waitForTimeout(1000);
        await this.testSteps.LogInfo('Verifying "Superscript" Format option is enabled');
        await expect(this.page.getByRole('button', { name: 'Superscript' })).toBeEnabled();

        await this.testSteps.LogInfo('Clicking "Superscript" Format option');
        await this.page.getByRole('button', { name: 'Superscript' }).click();

        await this.page.waitForTimeout(1000);
        await this.testSteps.LogInfo('Verifying "Superscript" Format option is selected');
        await expect(this.page.locator('//span[contains(text(), "Superscript")]/ancestor::button[@class="ck ck-button ck-on"]')).toBeVisible();

        await this.testSteps.LogInfo('Entering "This is a Superscript" text into CKEditor');
        await this.enterBodyField.pressSequentially('This is a Superscript');

        await this.testSteps.LogInfo('Verifying "Remove Format" option is enabled');
        await expect(this.page.getByRole('button', { name: 'Remove Format' })).toBeEnabled();

        await this.testSteps.LogInfo('Clicking "Remove Format" option');
        await this.page.getByRole('button', { name: 'Remove Format' }).click();

        await this.testSteps.LogInfo('Verifying "Superscript" Format option is NOT selected');
        await expect(this.page.locator('//span[contains(text(), "Superscript")]/ancestor::button[@class="ck ck-button ck-off"]')).toBeVisible();
    }

    async addParagraphToBodyField()
    {
        // If this method is to be expanded out to all content types it will need to be updated to include ids on selectors 

        await this.testSteps.LogInfo('Hitting "Enter" on keyboard to take a new line');
        await this.page.keyboard.press('Enter');

        await this.page.waitForTimeout(1000);
        await this.testSteps.LogInfo('Verifying "Paragraph, Heading" Format option is enabled');
        await expect(this.page.getByRole('button', { name: 'Paragraph, Heading' })).toBeEnabled();

        await this.testSteps.LogInfo('Clicking "Paragraph, Heading" Format option');
        await this.page.getByRole('button', { name: 'Paragraph, Heading' }).click();

        await this.page.waitForTimeout(1000);
        await this.testSteps.LogInfo('Entering "This is a normal Paragraph" text into CKEditor');
        await this.enterBodyField.pressSequentially('This is a normal Paragraph');
    }

    async addHeading2ToBodyField()
    {
        // If this method is to be expanded out to all content types it will need to be updated to include ids on selectors 

        await this.testSteps.LogInfo('Hitting "Enter" on keyboard to take a new line');
        await this.page.keyboard.press('Enter');

        // Inputing Heading 2 text into CK Editor field        
        await this.page.waitForTimeout(1000);
        await this.testSteps.LogInfo('Verifying "Paragraph, Heading" Format option is enabled');
        await expect(this.page.getByRole('button', { name: 'Paragraph, Heading' })).toBeEnabled();

        await this.testSteps.LogInfo('Clicking "Paragraph, Heading" Format option');
        await this.page.getByRole('button', { name: 'Paragraph, Heading' }).click();

        await this.testSteps.LogInfo('Verifying "Heading 2" Format option is enabled');
        await expect(this.page.getByRole('menuitemradio', { name: 'Heading 2' })).toBeEnabled();

        await this.testSteps.LogInfo('Clicking "Heading 2" Format option');
        await this.page.getByRole('menuitemradio', { name: 'Heading 2' }).click();

        await this.page.waitForTimeout(1000);
        await this.testSteps.LogInfo('Entering "This is Heading 2" text into CKEditor');
        await this.enterBodyField.pressSequentially('This is Heading 2');
    }

    async addHeading3ToBodyField()
    {
        // If this method is to be expanded out to all content types it will need to be updated to include ids on selectors 

        await this.testSteps.LogInfo('Hitting "Enter" on keyboard to take a new line');
        await this.page.keyboard.press('Enter');

        // Inputing Heading 2 text into CK Editor field        
        await this.page.waitForTimeout(1000);
        await this.testSteps.LogInfo('Verifying "Paragraph, Heading" Format option is enabled');
        await expect(this.page.getByRole('button', { name: 'Paragraph, Heading' })).toBeEnabled();

        await this.testSteps.LogInfo('Clicking "Paragraph, Heading" Format option');
        await this.page.getByRole('button', { name: 'Paragraph, Heading' }).click();

        await this.testSteps.LogInfo('Verifying "Heading 3" Format option is enabled');
        await expect(this.page.getByRole('menuitemradio', { name: 'Heading 3' })).toBeEnabled();

        await this.testSteps.LogInfo('Clicking "Heading 3" Format option');
        await this.page.getByRole('menuitemradio', { name: 'Heading 3' }).click();

        await this.page.waitForTimeout(1000);
        await this.testSteps.LogInfo('Entering "This is Heading 3" text into CKEditor');
        await this.enterBodyField.pressSequentially('This is Heading 3');
    }

    async addHeading4ToBodyField()
    {
        // If this method is to be expanded out to all content types it will need to be updated to include ids on selectors 

        await this.testSteps.LogInfo('Hitting "Enter" on keyboard to take a new line');
        await this.page.keyboard.press('Enter');

        // Inputing Heading 2 text into CK Editor field        
        await this.page.waitForTimeout(1000);
        await this.testSteps.LogInfo('Verifying "Paragraph, Heading" Format option is enabled');
        await expect(this.page.getByRole('button', { name: 'Paragraph, Heading' })).toBeEnabled();

        await this.testSteps.LogInfo('Clicking "Paragraph, Heading" Format option');
        await this.page.getByRole('button', { name: 'Paragraph, Heading' }).click();

        await this.testSteps.LogInfo('Verifying "Heading 4" Format option is enabled');
        await expect(this.page.getByRole('menuitemradio', { name: 'Heading 4' })).toBeEnabled();

        await this.testSteps.LogInfo('Clicking "Heading 4" Format option');
        await this.page.getByRole('menuitemradio', { name: 'Heading 4' }).click();

        await this.page.waitForTimeout(1000);
        await this.testSteps.LogInfo('Entering "This is Heading 4" text into CKEditor');
        await this.enterBodyField.pressSequentially('This is Heading 4');
    }

    async addInformationNoticeToBodyField()
    {
        // If this method is to be expanded out to all content types it will need to be updated to include ids on selectors 

        await this.testSteps.LogInfo('Hitting "Enter" on keyboard to take a new line');
        await this.page.keyboard.press('Enter');

        await this.page.waitForTimeout(1000);
        await this.testSteps.LogInfo('Verifying "Styles" Format option is enabled');
        await expect(this.page.getByRole('button', { name: 'Styles' })).toBeEnabled();

        await this.testSteps.LogInfo('Clicking "Styles" Format option');
        await this.page.getByRole('button', { name: 'Styles' }).click();

        await this.page.waitForTimeout(1000);
        await this.testSteps.LogInfo('Verifying "Information notice" Format option is enabled');
        await expect(this.page.getByRole('option', { name: 'Information notice' })).toBeEnabled();

        await this.testSteps.LogInfo('Clicking "Information notice" Format option');
        await this.page.getByRole('option', { name: 'Information notice' }).click();

        await this.page.waitForTimeout(1000);
        await this.testSteps.LogInfo('Entering "This is an information notice" text into CKEditor');
        await this.page.getByRole('textbox', { name: 'Rich Text Editor. Editing' }).pressSequentially('This is an information notice');

        await this.testSteps.LogInfo('Hitting "Enter" on keyboard to take a new line');
        await this.page.keyboard.press('Enter');

        await this.page.waitForTimeout(1000);
        await this.testSteps.LogInfo('Verifying "Information notice" Format option is enabled');
        await expect(this.page.getByRole('button', { name: 'Information notice' })).toBeEnabled();

        await this.testSteps.LogInfo('Clicking "Information notice" Format option');
        await this.page.getByRole('button', { name: 'Information notice' }).click();

        await this.page.waitForTimeout(1000);
        await this.testSteps.LogInfo('Verifying "Information notice" Format option is enabled');
        await expect(this.page.getByRole('option', { name: 'Information notice' })).toBeEnabled();

        await this.testSteps.LogInfo('Clicking "Information notice" Format option');
        await this.page.getByRole('option', { name: 'Information notice' }).click();
    }

    async addBulletPointsToBodyField()
    {
        // If this method is to be expanded out to all content types it will need to be updated to include ids on selectors 

        await this.testSteps.LogInfo('Hitting "Enter" on keyboard to take a new line');
        await this.page.keyboard.press('Enter');

        await this.page.waitForTimeout(1000);
        await this.testSteps.LogInfo('Verifying "Bullet Points" Format option is enabled');
        await expect(this.page.getByRole('button', { name: 'Bulleted List' })).toBeEnabled();

        await this.testSteps.LogInfo('Clicking "Bullet points" Format option');
        await this.page.getByRole('button', { name: 'Bulleted List' }).click();

        await this.testSteps.LogInfo('Entering "First This is a Bullet point test" Format option');
        await this.enterBodyField.pressSequentially('First This is a Bullet point test');

        await this.testSteps.LogInfo('Hitting "Enter" on keyboard to take a new line');
        await this.page.keyboard.press('Enter');
        await this.testSteps.LogInfo('Entering "Second Bullet point"');
        await this.enterBodyField.pressSequentially('Second Bullet point');

        await this.testSteps.LogInfo('Hitting "Enter" on keyboard to take a new line');
        await this.page.keyboard.press('Enter');
        await this.testSteps.LogInfo('Entering "Third Bullet point"');
        await this.enterBodyField.pressSequentially('Third Bullet point');

        await this.testSteps.LogInfo('Hitting "Enter" twice on keyboard to break out of Numbered list option');
        await this.page.keyboard.press('Enter');
        await this.page.keyboard.press('Enter');

    }

    async addNumbersToBodyField()
    {
        // If this method is to be expanded out to all content types it will need to be updated to include ids on selectors 

        await this.testSteps.LogInfo('Hitting "Enter" on keyboard to take a new line');
        await this.page.keyboard.press('Enter');

        await this.page.waitForTimeout(1000);
        // await this.testSteps.LogInfo('Verifying "Numbered List" Format option is enabled');
        // await expect(this.page.getByRole('button', { name: 'Numbered List' })).toBeEnabled();

        await this.testSteps.LogInfo('Clicking "Numbered List" Format option');
        await this.page.getByRole('button', { name: 'Numbered List' }).first().click();

        await this.testSteps.LogInfo('Entering "This is a Numbered List point test"');
        await this.enterBodyField.pressSequentially('Number 1 This is a Numbered List point test.');

        await this.testSteps.LogInfo('Hitting "Enter" on keyboard to take a new line');
        await this.page.keyboard.press('Enter');
        await this.testSteps.LogInfo('Entering "Number 2" for the 2nd Number list ');
        await this.enterBodyField.pressSequentially('Number 2');

        await this.testSteps.LogInfo('Hitting "Enter" on keyboard to take a new line');
        await this.page.keyboard.press('Enter');
        await this.testSteps.LogInfo('Entering "Number 3" for the 2nd Number list ');
        await this.enterBodyField.pressSequentially('Number 3');

        await this.testSteps.LogInfo('Hitting "Enter" twice on keyboard to break out of Numbered list option');
        await this.page.keyboard.press('Enter');
        await this.page.keyboard.press('Enter');
    }

    async addSpecificNumbersToBodyField()
    {
        // If this method is to be expanded out to all content types it will need to be updated to include ids on selectors 

        await this.testSteps.LogInfo('Hitting "Enter" on keyboard to take a new line');
        await this.page.keyboard.press('Enter');

        await this.page.waitForTimeout(1000);
        await this.testSteps.LogInfo('Clicking "Numbered List" Format option');
        await this.page.getByRole('button', { name: 'Numbered List' }).first().click();

        await this.testSteps.LogInfo('Clicking "Numbered List" Format options to display options');
        await this.page.getByRole('button', { name: 'Numbered List' }).nth(1).click();

        await this.testSteps.LogInfo('Clicking "Start at" option');
        await this.page.getByRole('spinbutton', { name: 'Start at' }).click();

        await this.testSteps.LogInfo('Entering Start at "10" ');
        await this.page.getByRole('spinbutton', { name: 'Start at' }).fill('10');

        await this.testSteps.LogInfo('Clicking on formatted number to enter text');
        await this.page.locator('//ol[@start="10"]').click();

        await this.testSteps.LogInfo('Entering "This is a reverse Numbered List point test"');
        await this.enterBodyField.pressSequentially('Number 10 This is Numbered List point test when started at value 10.');

        await this.testSteps.LogInfo('Hitting "Enter" on keyboard to take a new line');
        await this.page.keyboard.press('Enter');
        await this.testSteps.LogInfo('Entering "Number 11" for the 2nd Number list ');
        await this.enterBodyField.pressSequentially('Number 11');

        await this.testSteps.LogInfo('Hitting "Enter" on keyboard to take a new line');
        await this.page.keyboard.press('Enter');
        await this.testSteps.LogInfo('Entering "Number 12" for the 2nd Number list ');
        await this.enterBodyField.pressSequentially('Number 12');

        await this.testSteps.LogInfo('Hitting "Enter" twice on keyboard to break out of Numbered list option');
        await this.page.keyboard.press('Enter');
        await this.page.keyboard.press('Enter');
    }

    async addReverseNumbersToBodyField()
    {
        // If this method is to be expanded out to all content types it will need to be updated to include ids on selectors 

        await this.testSteps.LogInfo('Hitting "Enter" on keyboard to take a new line');
        await this.page.keyboard.press('Enter');

        await this.page.waitForTimeout(1000);
        await this.testSteps.LogInfo('Clicking "Numbered List" Format option');
        await this.page.getByRole('button', { name: 'Numbered List' }).first().click();

        await this.testSteps.LogInfo('Clicking "Numbered List" Format options to display options');
        await this.page.getByRole('button', { name: 'Numbered List' }).nth(1).click();

        await this.testSteps.LogInfo('Clicking "Start at" option');
        await this.page.getByRole('spinbutton', { name: 'Start at' }).click();

        await this.testSteps.LogInfo('Entering Start at "50" ');
        await this.page.getByRole('spinbutton', { name: 'Start at' }).fill('50');

        await this.testSteps.LogInfo('Clicking "Revered order" toggle button');
        await this.page.getByRole('button', { name: 'Reversed order' }).click();

        await this.testSteps.LogInfo('Clicking on formatted number to enter text');
        await this.page.waitForTimeout(500);
        await this.page.locator('//ol[@reversed="reversed" and @start="50"]').click();
        await this.page.waitForTimeout(500);

        await this.testSteps.LogInfo('Entering "This is a reverse Numbered List point test"');
        await this.enterBodyField.pressSequentially('Number 50 This is a reverse Numbered List point test.');

        await this.testSteps.LogInfo('Hitting "Enter" on keyboard to take a new line');
        await this.page.keyboard.press('Enter');
        await this.testSteps.LogInfo('Entering "Number 49" for the 2nd Number list ');
        await this.enterBodyField.pressSequentially('Number 49');

        await this.testSteps.LogInfo('Hitting "Enter" on keyboard to take a new line');
        await this.page.keyboard.press('Enter');
        await this.testSteps.LogInfo('Entering "Number 48" for the 2nd Number list ');
        await this.enterBodyField.pressSequentially('Number 48');

        await this.testSteps.LogInfo('Hitting "Enter" twice on keyboard to break out of Numbered list option');
        await this.page.keyboard.press('Enter');
        await this.page.keyboard.press('Enter');
    }

    async addMediaImageToBodyField()
    {
        // If this method is to be expanded out to all content types it will need to be updated to include ids on selectors 

        await this.testSteps.LogInfo('Hitting "Enter" on keyboard to take a new line');
        await this.page.keyboard.press('Enter');

        await this.page.waitForTimeout(1000);
        await this.testSteps.LogInfo('Verifying "Insert Media" Format option is enabled');
        await expect(this.page.getByRole('button', { name: 'Insert Media' })).toBeEnabled();

        await this.testSteps.LogInfo('Clicking "Insert Media" Format option');
        await this.page.getByRole('button', { name: 'Insert Media' }).click();

        // uploading image
        await this.uploadMedia.uploadImageProcess(TestData.Media.imageFileName);
        await this.uploadMedia.enterImageValues(TestData.Media.imageAltText, TestData.Media.imageTitle, TestData.Media.imageCaption, TestData.Media.imageName);

        await this.uploadMedia.clickMediaSave();
        await this.uploadMedia.clickInsertSelectedButton();

        await this.page.locator(`//div[contains(@aria-label, "${TestData.Media.imageName}")]//following-sibling::div//div[@title="Insert paragraph after block"]`).click();
    }

    async addAudioFileToBodyField(existingAudioName?: string)
    {
        await this.testSteps.LogInfo('Hitting "Enter" on keyboard to take a new line');
        await this.page.keyboard.press('Enter');

        await this.page.waitForTimeout(1000);
        await this.testSteps.LogInfo('Verifying "Insert Media" Format option is enabled');
        await expect(this.page.getByRole('button', { name: 'Insert Media' })).toBeEnabled();

        await this.testSteps.LogInfo('Clicking "Insert Media" Format option');
        await this.page.getByRole('button', { name: 'Insert Media' }).click();

        await this.page.waitForTimeout(1000);
        await this.testSteps.LogInfo('Verifying "Audio" button option is enabled');
        await expect(this.page.getByRole('button', { name: 'Audio' })).toBeEnabled();

        await this.testSteps.LogInfo('Clicking "Audio" Format option');
        await this.page.getByRole('button', { name: 'Audio' }).click();
        await this.page.waitForTimeout(1000);

        let audioName = TestData.Media.audioFileName;

        if (existingAudioName)
        {
            // select an already existing audio file from the Media Library instead of uploading a new one
            await this.uploadMedia.enterMediaSearchTitleField(existingAudioName);
            await this.uploadMedia.clickApplyFilters();
            await this.uploadMedia.selectMediaLibraryItemByName(existingAudioName);
            await this.page.waitForTimeout(1000);
            await this.uploadMedia.clickInsertSelectedButton();

            audioName = existingAudioName;
        }
        else
        {
            await this.uploadMedia.uploadAudioFileProcess(TestData.Media.audioFile);
            await this.uploadMedia.enterMediaName(TestData.Media.audioFileName);
            await this.uploadMedia.clickMediaSave();
            await this.uploadMedia.clickInsertSelectedButton();
        }

        await this.page.locator(`//div[contains(@aria-label, "${audioName}")]//following-sibling::div//div[@title="Insert paragraph after block"]`).click();
    }

    async addRemoteVideoToBodyField()
    {
        // If this method is to be expanded out to all content types it will need to be updated to include ids on selectors 

        await this.testSteps.LogInfo('Hitting "Enter" on keyboard to take a new line');
        await this.page.keyboard.press('Enter');

        await this.page.waitForTimeout(1000);
        await this.testSteps.LogInfo('Verifying "Insert Media" Format option is enabled');
        await expect(this.page.getByRole('button', { name: 'Insert Media' })).toBeEnabled();

        await this.testSteps.LogInfo('Clicking "Insert Media" Format option');
        await this.page.getByRole('button', { name: 'Insert Media' }).click();

        await this.page.waitForTimeout(1000);
        await this.testSteps.LogInfo('Verifying "Remote video" button option is enabled');
        await expect(this.page.getByRole('button', { name: 'Remote video' })).toBeEnabled();

        await this.testSteps.LogInfo('Clicking "Remote video" Format option');
        await this.page.getByRole('button', { name: 'Remote video' }).click();

        // uploading Audio
        await this.uploadMedia.addRemoteVideoLinkProcess(TestData.Media.remoteVideoURL);
        await this.page.getByRole('button', { name: 'Add', exact: true }).click();

        await this.uploadMedia.clickMediaSave();
        await this.uploadMedia.clickInsertSelectedButton();

        await this.page.locator('//div[contains(@aria-label, "Finance Minister Caoimhe Archibald welcomed to the Department")]//following-sibling::div//div[@title="Insert paragraph after block"]').click();
    }

    async addSpecialCharactersToBodyField()
    {

        // If this method is to be expanded out to all content types it will need to be updated to include ids on selectors 
        await this.testSteps.LogInfo('Hitting "Enter" on keyboard to take a new line');
        await this.page.keyboard.press('Enter');

        await this.testSteps.LogInfo('Entering "This is a test for Special Characters" Text');
        await this.enterBodyField.pressSequentially('This is a test for Special Characters');
        await this.testSteps.LogInfo('Hitting "Enter" on keyboard to take a new line');
        await this.page.keyboard.press('Enter');

        await this.page.waitForTimeout(1000);
        await this.testSteps.LogInfo('Verifying "Show more items" option is enabled');
        await expect(this.page.getByRole('button', { name: 'Show more items' })).toBeEnabled();

        await this.testSteps.LogInfo('Clicking "Show more items" option clicked');
        await this.page.getByRole('button', { name: 'Show more items' }).click();
        await this.testSteps.LogInfo('Verifying "Special characters" option is enabled');
        await expect(this.page.getByRole('button', { name: 'Special characters' })).toBeEnabled();

        await this.testSteps.LogInfo('Clicking "Special characters" option clicked');
        await this.page.getByRole('button', { name: 'Special characters' }).click();
        await this.testSteps.LogInfo('Entering "This is adding a "$" from special characters"');
        await this.enterBodyField.pressSequentially('This is adding a dollar sign from special characters:  ');
        await this.page.getByRole('button', { name: '$' }).click();
        await this.testSteps.LogInfo('Closing "Special Characters" option');
        await this.page.getByRole('button', { name: 'Close' }).click();

        await this.testSteps.LogInfo('Hitting "Enter" on keyboard to take a new line');
        await this.page.keyboard.press('Enter');
        await this.testSteps.LogInfo('Clicking "Show more items" option clicked');
        await this.page.getByRole('button', { name: 'Show more items' }).click();
        await this.testSteps.LogInfo('Clicking "Special characters" option clicked');
        await this.page.getByRole('button', { name: 'Special characters' }).click();
        await this.testSteps.LogInfo('Entering "This is adding a "‱" from special characters"');
        await this.enterBodyField.pressSequentially('This is adding a permyriad sign from special characters:  ');
        await this.page.getByRole('button', { name: '‱' }).click();
        await this.testSteps.LogInfo('Closing "Special Characters" option');
        await this.page.getByRole('button', { name: 'Close' }).click();
    }

    async addTableToBodyField()
    {

        // If this method is to be expanded out to all content types it will need to be updated to include ids on selectors 
        await this.testSteps.LogInfo('Hitting "Enter" on keyboard to take a new line');
        await this.page.keyboard.press('Enter');

        await this.page.waitForTimeout(1000);
        await this.testSteps.LogInfo('Verifying "Insert table" Format option is enabled');
        await expect(this.page.getByRole('button', { name: 'Insert table' })).toBeEnabled();

        await this.testSteps.LogInfo('Clicking "Insert table" Format option');
        await this.page.getByRole('button', { name: 'Insert table' }).click();

        await this.testSteps.LogInfo('Verifying "2 x 3 Format option is enabled');
        await expect(this.page.getByRole('button', { name: '2 × 3' })).toBeEnabled();

        await this.testSteps.LogInfo('Clicking "2 x 3" Format option');
        await this.page.getByRole('button', { name: '2 × 3' }).click();

        await this.testSteps.LogInfo('Typing "Row 1, Column 1" Into First row, first Column');
        await this.page.getByRole('cell').first().pressSequentially('Row 1, Column 1');
        await this.testSteps.LogInfo('Tabbing to next column');
        await this.page.getByRole('cell').first().press('Tab');

        await this.testSteps.LogInfo('Typing "Row 1, Column 2" Into First row, Second Column');
        await this.page.getByRole('cell').nth(1).pressSequentially('Row 1, Column 2');
        await this.testSteps.LogInfo('Tabbing to next column');
        await this.page.getByRole('cell').first().press('Tab');

        await this.testSteps.LogInfo('Typing "Row 1, Column 3" Into First row, Third Column');
        await this.page.getByRole('cell').nth(2).pressSequentially('Row 1, Column 3');
        await this.testSteps.LogInfo('Tabbing to next column');
        await this.page.getByRole('cell').first().press('Tab');

        await this.testSteps.LogInfo('Typing "Row 2, Column 1" Into Second row, First Column');
        await this.page.getByRole('cell').nth(3).pressSequentially('Row 2, Column 1');
        await this.testSteps.LogInfo('Tabbing to next column');
        await this.page.getByRole('cell').first().press('Tab');

        await this.testSteps.LogInfo('Typing "Row 2, Column 2" Into Second row, Second Column');
        await this.page.getByRole('cell').nth(4).pressSequentially('Row 2, Column 2');
        await this.testSteps.LogInfo('Tabbing to next column');
        await this.page.getByRole('cell').first().press('Tab');

        await this.testSteps.LogInfo('Typing "Row 2, Column 3" Into Second row, Third Column');
        await this.page.getByRole('cell').nth(5).pressSequentially('Row 2, Column 3');
    }

    async ImportWordFileToBodyField()
    {

        // If this method is to be expanded out to all content types it will need to be updated to include ids on selectors 
        await this.enterBodyField.clear();

        await this.testSteps.LogInfo('Hitting "Enter" on keyboard to take a new line');
        await this.page.keyboard.press('Enter');

        await this.page.waitForTimeout(1000);
        await this.testSteps.LogInfo('Verifying "Show more items" option is enabled');
        await expect(this.page.getByRole('button', { name: 'Show more items' })).toBeEnabled();

        await this.testSteps.LogInfo('Clicking "Show more items" option clicked');
        await this.page.getByRole('button', { name: 'Show more items' }).click();

        await this.testSteps.LogInfo('Verifying "Import from Word" option is enabled');
        await expect(this.page.getByRole('button', { name: 'Import from Word' })).toBeEnabled();

        // uploading Audio
        await this.uploadMedia.ImportWordFile(TestData.Media.wordFile);
        await this.page.waitForTimeout(1000);
    }
}