import { test, expect } from '@playwright/test';

import Navigator from '../src/Navigator/Navigator';
import { CREDS } from '../src/AccountData/vipNoVip';
import fs from "fs"
import {Collector}  from '../src/Collector/Collector';


test.describe('fawef', () => {
let nav
let collector


  for (const [account_name, creds] of Object.entries(CREDS)){

    test(`Extracting promo text for ${account_name}`, async ({ page }) => {
      nav = new Navigator(page)
      collector = new Collector(page)

      await nav.navigateTo({url: 'https://www.kingbillycasino.com/', locator: '#header_log_in_btn'}, )
      await nav.clickOnElement('#header_log_in_btn')
      await nav.fillInCredentials({email: creds.email, password: creds.password})
      await nav.page.waitForTimeout(1000)

      await nav.navigateTo({url:'https://www.kingbillycasino.com/promotions'})
    
      
      const numberOfCards = await nav.checkNumberOfElements('.promo-item')

      console.log(numberOfCards)


      for (let i = 1; i <= numberOfCards; i++) {
        const Availabability = await collector.checkIfEnabled(`div.promo-item:nth-of-type(${i})`)
        
        if(Availabability === true) {
            console.log(`Element ${i} is enabled`)
            
            await page.locator(`div.promo-item:nth-of-type(${i}) button.promo-item__info`).click()
            const text = await collector.collectTextFromElement('.promo-modal__right')

            const promoTitle = await page.locator('.promo-modal__right-title').textContent()
            // const text = await page.locator(`.promo-modal__right`).innerText()
            
            await page.locator('.modal__close-button').click()
            console.log(text)

            fs.mkdirSync(`ExtractedText/PromoPage/${account_name}/Text`, {recursive: true})
            fs.mkdirSync(`ExtractedText/PromoPage/${account_name}/Table`, {recursive: true})
            fs.writeFileSync(`ExtractedText/PromoPage/${account_name}/Text/${i}_${promoTitle}.txt`, text)
            fs.writeFileSync(`ExtractedText/PromoPage/${account_name}/Table/${i}_${promoTitle}.xlsx`, text)



        } else {
          console.log(`Element ${i} is disabled`)
          continue  
        }


      }

    })
  }
})
