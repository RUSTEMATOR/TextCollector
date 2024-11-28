import { test, expect } from '@playwright/test';

import Navigator from '../src/Navigator/Navigator';
import { CREDS } from '../src/AccountData/vipNoVip';
import fs from "fs"
import {Collector}  from '../src/Collector/Collector';


test.describe('fawef', () => {
let nav
let collector

test.beforeEach( async ({page}) => {
  nav = new Navigator(page)
  collector = new Collector(page)
  
  await nav.navigateTo({url: 'https://www.kingbillycasino.com/', locator: '#header_log_in_btn'}, )
  await nav.clickOnElement('#header_log_in_btn')
  await nav.fillInCredentials({email: CREDS.noDep.email, password: CREDS.noDep.password})
  await nav.page.waitForTimeout(1000)
})

test('fawef', async ({ page }) => {
  await nav.navigateTo({url:'https://www.kingbillycasino.com/promotions'})
 
  
  const numberOfCards = await nav.checkNumberOfElements('.promo-item')

  console.log(numberOfCards)


  for (let i = 1; i <= numberOfCards; i++) {
    const Availabability = await collector.checkIfEnabled(`div.promo-item:nth-of-type(${i}`)
    
    if(Availabability === true) {
        console.log(`Element ${i} is enabled`)
        
        await page.locator(`div.promo-item:nth-of-type(${i}) button.promo-item__info`).click()
        await collector.collectTextFromElement('.promo-modal__right')
        const text = await page.locator(`.promo-modal__right`).innerText()
        
        await page.locator('.modal__close-button').click()
        console.log(text)
        fs.writeFileSync(`file${i}.txt`, text)
    } else {
      console.log(`Element ${i} is disabled`)
      continue  
    }

    // await page.locator(`div.promo-item:nth-of-type(${i}) button.promo-item__info`).click()
    // const text = await page.locator(`.promo-modal__right`).innerText()
    // await page.locator('.modal__close-button').click()
    // console.log(text)
    // fs.writeFileSync(`file${i}.xlsx`, text)
  }

})

})
