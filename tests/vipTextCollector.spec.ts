import { test } from '@playwright/test';
import Navigator from '../src/Navigator/Navigator';
import { VIP_CREDS } from '../src/Data/AccountData/vipNoVip';
import fs from "fs"
import {Collector}  from '../src/Collector/Collector';


test.describe('Vip page text collectyor', () => {
    let nav
    let collector

        for (const [account_name, creds] of Object.entries(VIP_CREDS)){

            test(`Extract text from ${account_name}`, async ({page}) => {
                nav = new Navigator(page)
                collector = new Collector(page)

                await page.addLocatorHandler(page.locator('#gist-embed-message'), async () => {
                    await page.evaluate(() => document.querySelector('#gist-embed-message').remove())
                })


                await nav.navigateTo({url: 'https://www.kingbillycasino.com/', locator: '#header_log_in_btn'}, )
                await nav.clickOnElement('#accept_initial_notification_button')
                await nav.clickOnElement('#header_log_in_btn')
                await nav.fillInCredentials({email: creds.email, password: creds.password})
                await nav.page.waitForTimeout(1000)

                await nav.navigateTo({url:'https://www.kingbillycasino.com/vip-club'})

                const vipPageText = await collector.collectTextFromElement('.new-vip-page')

                fs.mkdirSync(`ExtractedText/VIPpage/${account_name}/`, {recursive: true})
                fs.writeFileSync(`ExtractedText/VIPpage/${account_name}/${account_name} VIPpage text.xlsx`, vipPageText)
                console.log(`Finished extraction for ${account_name}`)
                
            })
        }

    })