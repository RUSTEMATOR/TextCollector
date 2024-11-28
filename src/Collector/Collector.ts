import { type Page } from "@playwright/test";
import fs from "fs";

export class Collector {

    private page: Page;

    constructor(page: Page){
        this.page = page;
    }


    async collectTextFromElement(locator: string){
        const text = await this.page.locator(locator).innerText()
        console.log(`Collected text: ${text}`)
        return text
    }

    async writeTextToFile({text, collectedTextLocation}){
        fs.writeFileSync(`${collectedTextLocation}.txt`, text)
        return this
    }


    async checkIfEnabled(locator: string){
        const isEnabled = await this.page.evaluate((locator: string) => {

        
            const promoItems = document.querySelectorAll(locator);
                if (promoItems.length === 0) return false; 

                const classes = promoItems[0].classList;
                console.log([...classes]);

                if (classes.contains('promo-item--disabled')) {
                    console.log('is disabled');
                    return false;
                } else {
                    console.log('is enabled');
                    return true;
                }
            }, locator)
            console.log(`Element ${isEnabled}`)
            return isEnabled
        }
    
}
