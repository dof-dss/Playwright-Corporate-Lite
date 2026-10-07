import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { expect } from '@playwright/test';
import { UserPage } from '../../base-pages/UserPage';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { LinkNodePage } from './LinkNodePage';

export interface LinkEditData
{
  linkTitle: string;
  revisionLogMessage: string;
  linkURL: string;
  linkType: string;
  linkLanguage: string;
}

export class LinkEditPage
{
  // logging
  private readonly testSteps: TestSteps;

  // pages
  private readonly userPage: UserPage;
  private readonly createPages: CreatePages;
  private readonly previewPage: PreviewPage;
  private readonly linkNodePage: LinkNodePage;

  // locators - using ARIA roles first, then unique IDs, then XPaths
  private readonly linkTitleField: Locator;
  private readonly linkURLField: Locator;
  private readonly linkTypeSelect: Locator;
  private readonly linkLanguageSelect: Locator;

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

    // imported pages
    this.userPage = new UserPage(page, this.testSetUpData);
    this.createPages = new CreatePages(page, this.testSetUpData, this.testData);
    this.previewPage = new PreviewPage(page);
    this.linkNodePage = new LinkNodePage(page, this.testSetUpData, this.testData);

    // locators - prioritizing ARIA roles, then unique IDs, then XPaths
    this.linkTitleField = page.locator('#edit-title-0-value');
    this.linkURLField = page.locator('#edit-field-link-url-0-uri');
    this.linkTypeSelect = page.locator('#edit-field-link-type');
    this.linkLanguageSelect = page.locator('#edit-field-file-language');
  }

  // check url on edit link page
  async editLinkPageURLCheck()
  {
    await this.testSteps.LogInfo(`Verifying URL pattern matches /node/.+/edit`);
    await expect(this.page).toHaveURL(new RegExp('/node/.+/edit'));
  }

  // check url on return to edit link page after doing a preview 
  async returnFromPreviewLinkPageURLCheck()
  {
    await this.testSteps.LogInfo(`Verifying URL pattern matches /node/.+/edit\\?uuid`);
    await expect(this.page).toHaveURL(new RegExp('/node/.+/edit\\?uuid'));
  }

  // enter link title 
  async enterLinkTitle(linkTitle: string)
  {
    await this.testSteps.LogInfo(`Entering "${linkTitle}" into the Title field`);
    await this.linkTitleField.fill(linkTitle);
  }

  // enter link URL
  async enterLinkURL(linkURL: string)
  {
    await this.testSteps.LogInfo(`Entering "${linkURL}" into the Link URL field`);
    await this.linkURLField.fill(linkURL);
  }

  // select link type
  async selectLinkType(linkType: string)
  {
    await this.testSteps.LogInfo(`Selecting "${linkType}" from Link Type dropdown`);
    await this.linkTypeSelect.selectOption({ label: linkType });
  }

  // select link language
  async selectLinkLanguage(linkLanguage: string)
  {
    await this.testSteps.LogInfo(`Selecting "${linkLanguage}" from Link Language dropdown`);
    await this.linkLanguageSelect.selectOption({ label: linkLanguage });
  }

  // edit link form elements - title URL type language etc
  async editLinkForm(data: LinkEditData)
  {
    await this.editLinkPageURLCheck();
    await this.enterLinkTitle(data.linkTitle);
    await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);
    await this.enterLinkURL(data.linkURL);
    await this.selectLinkType(data.linkType);
    await this.selectLinkLanguage(data.linkLanguage);
  }
}
