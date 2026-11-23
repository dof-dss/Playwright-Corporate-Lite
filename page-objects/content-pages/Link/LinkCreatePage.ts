import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { expect } from '@playwright/test';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export const LINK_TYPES = [
  //'Corporate link',
  'Data tools / Popular links',
  'Popular statistics',
] as const;

export interface LinkSaveData
{
  linkTitle: string;
  revisionLogMessage: string;
  linkURL: string;
  linkType: string;
  topics: string[];
}

export class LinkCreatePage
{
  // logging
  private readonly testSteps: TestSteps;

  // pages
  private readonly createPages: CreatePages;

  // locators - using ARIA roles first, then unique IDs, then XPaths
  private readonly linkTitleField: Locator;
  private readonly linkURLField: Locator;
  private readonly linkTypeSelect: Locator;

  // error messages
  private readonly titleFieldIsRequired: Locator;
  private readonly linkURLFieldIsRequired: Locator;
  private readonly linkTypeFieldIsRequired: Locator;

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
    this.createPages = new CreatePages(page, this.testSetUpData, this.testData);

    // locators - prioritizing ARIA roles, then unique IDs, then XPaths
    this.linkTitleField = page.locator('#edit-title-0-value');
    this.linkURLField = page.locator('#edit-field-link-url-0-uri');
    this.linkTypeSelect = page.locator('#edit-field-link-type');

    // Error messages
    this.titleFieldIsRequired = page.getByText("Link text field is required.");
    this.linkURLFieldIsRequired = page.getByText("Link URL field is required.");
    this.linkTypeFieldIsRequired = page.getByText("Link type field is required.");
  }

  // ------------------------ asserts ------------------------

  // check url on create link page
  async createLinkPageURLCheck()
  {
    await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/node/add/link"`);
    await expect(this.page).toHaveURL(`${this.testSetUpData.urlForTest.url}/node/add/link`);
  }

  // check url on return to create link page after doing a preview 
  async returnFromPreviewLinkPageURLCheck()
  {
    await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/node/add/link\\?uuid"`);
    await expect(this.page).toHaveURL(new RegExp(`${this.testSetUpData.urlForTest.url}/node/add/link\\?uuid`));
  }


  // ------------------------ filling link form ------------------------

  // enter link title 
  async enterLinkTitle(linkTitle: string)
  {
    await this.testSteps.LogInfo(`Entering "${linkTitle}" into the Link text field`);
    await this.linkTitleField.fill(linkTitle);
  }

  // enter link URL
  async enterLinkURL(linkURL: string)
  {
    await this.testSteps.LogInfo(`Entering "${linkURL}" into the Link URL field and selecting matching item`);
    await this.linkURLField.pressSequentially(linkURL);
    const matchingSuggestion = this.page.getByText(linkURL, { exact: true });
    await expect(matchingSuggestion).toBeVisible();
    await matchingSuggestion.click();
  }

  // select link type
  async selectLinkType(linkType: string)
  {
    await this.testSteps.LogInfo(`Selecting "${linkType}" from Link Type dropdown`);
    await this.linkTypeSelect.selectOption({ label: linkType });
  }

  // Mandatory Field Check link
  async mandatoryFieldCheck()
  {
    await this.testSteps.LogInfo('Performing mandatory field check');
    await this.testSteps.LogInfo('Clicking save button');
    await this.createPages.clickSaveButton();
    await this.testSteps.LogInfo('Verifying Link text field error message appears');
    await expect(this.titleFieldIsRequired).toBeVisible();
    await this.testSteps.LogInfo('Verifying Link URL field error message appears');
    await expect(this.linkURLFieldIsRequired).toBeVisible();
    await this.testSteps.LogInfo('Verifying Link Type field error message appears');
    await expect(this.linkTypeFieldIsRequired).toBeVisible();
  }

  // fill in link form fields
  async fillLinkForm(data: LinkSaveData)
  {
    await this.createLinkPageURLCheck();
    await this.enterLinkTitle(data.linkTitle);
    await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);
    await this.enterLinkURL(data.linkURL);
    await this.selectLinkType(data.linkType);
    await this.createPages.selectTopics(data.topics);
  }
}
