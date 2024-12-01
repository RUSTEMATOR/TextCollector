import { type Page, expect } from "@playwright/test";

export default class Navigator {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  static async init(page: Page) {
    return new Navigator(page);
  }

  async navigateTo({ url, locator }: { url: string; locator?: string }) {
    await this.page.goto(url);
    console.log(` Navigated to ${url}`);
    if (locator) {
      await this.page.waitForSelector(locator);
      console.log(`Found element ${locator}`);
    }
    return this;
  }

  async fillInCredentials({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    await this.page.locator("#login_modal_email_input").fill(email);
    await this.page.locator('[name="password"]').fill(password);
    await this.page.locator("#submit_login").click();
    console.log(`Filled in credentials`);

    await this.page.waitForSelector("#header_dep_btn");
    console.log("User is logged in");
    return this;
  }

  async clickOnElement(locator: string) {
    console.log(`Clicked on element ${locator}`);
    await this.page.locator(locator).click();
    return this;
  }

  async waitForTimeout() {
    await this.page.waitForTimeout(100000000);
    console.log("Timeout reached");
    return this;
  }

  async checkNumberOfElements(selector: string): Promise<number> {
    const locator = this.page.locator(selector);
    const numberOfCards = await locator.evaluateAll(
      (elements) => elements.length,
    );
    // const count = await this.page.evaluate(async () => await document.querySelectorAll(`${locator}`).length)
    console.log(`Number of elements: ${numberOfCards}`);
    return numberOfCards;
  }

  async goBack(){
    this.page.goBack()
  }

  async deleteElement(selector: string, elementDescription: string): Promise<any> {
    await this.page.evaluate(async () => {
      await document.querySelector(selector).remove()
    })
    console.log(`Deleted element ${elementDescription}`);
  }
}
