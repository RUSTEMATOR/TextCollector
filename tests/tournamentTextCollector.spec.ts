import { test } from '@playwright/test';
import Navigator from '../src/Navigator/Navigator';
import { CREDS } from '../src/Data/AccountData/vipNoVip';
import fs from "fs"
import {Collector}  from '../src/Collector/Collector';


test.describe('Tournament text collectyor', () => {
    let nav
    let collector

        for (const [account_name, creds] of Object.entries(CREDS)){

            test(`Extracting tournament text for ${account_name}`, async ({ page }) => {
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

                await nav.navigateTo({url:'https://www.kingbillycasino.com/tournaments'})

                const numberOfTournaments = await nav.checkNumberOfElements('.tourn-item')


                console.log(numberOfTournaments)

                for (let i = 1; i <= numberOfTournaments; i++) {

                    const title = `.tourn-item:nth-of-type(${i}) .tourn-item__content`
                    const cardOuterText = `.tourn-item:nth-of-type(${i})`
                    const openTournamentButton = `.tourn-item:nth-of-type(${i}) .link-btn`
                    const allTournamentText = `.full-tourn__wrapper`
                    

                    const tournName = await collector.collectTextFromElement(title)
                    const tournCardContent = await collector.collectTextFromElement(cardOuterText)

                  
                    await nav.clickOnElement(openTournamentButton)
                    await nav.page.waitForTimeout(2000)

                    // await nav.deleteElement(`.tourn-winners__list`, 'winners list')

                    await nav.page.evaluate(async () => {
                        await document.querySelector(`.tourn-winners__list`).remove()
                      })
                    console.log('Deleted winners list')

                    await nav.page.evaluate(async () => {
                        await document.querySelector(`.promos-slider`).remove()
                      })
                    console.log('Deleted promo slider')

                    await nav.page.evaluate(async () => {
                        await document.querySelector(`.slick-slider.game-slider--home`).remove()
                      })
                    console.log('Deleted games')

                    const tournContent = await collector.collectTextFromElement(allTournamentText)


                    const combineTournText = async () => {
                        let allText = ''

                        allText += await tournCardContent
                        allText += await tournContent

                        return allText

                    }

                    const allTextContent = await combineTournText()


                    fs.mkdirSync(`ExtractedText/TournamentPage/${account_name}/`, {recursive: true})
                    fs.writeFileSync(`ExtractedText/TournamentPage/${account_name}/${i}_${tournName}.xlsx`, allTextContent)
                    
                    await nav.page.goBack()
                    console.log(`Text extraction for ${tournName} finished \n Going back to the tournament page`)

                }
        })



    }
})