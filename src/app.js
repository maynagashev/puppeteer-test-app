const puppeteer = require('puppeteer');
const config = require('./config');
//console.log(config);

(async () => {
    const browser = await initBrowser();
    const page = await openProfilePage(browser);

    // goto login
    await page.click('a.login-link.btn-clear');
    await page.waitForNavigation();

    // do login
    await page.focus('#email');
    await page.keyboard.type(config.userEmail);
    await page.focus('#password');
    await page.keyboard.type(config.userPassword);
    await page.click('#submit-button');
    await page.waitForNavigation();
    await takeScreenshot(page, browser);

    // goto main page
    await page.goto("https://stackoverflow.com/");
    await takeScreenshot(page, browser);    
    
    return await browser.close();
})();

async function initBrowser() {
    let browser = await puppeteer.launch({
        headless: false,
        args: ["--window-size=1920,1080"],
        //slowMo: 250node,
    });
    console.log('Chromimum executablePath:', puppeteer.executablePath());
    return browser;
}

async function openProfilePage(browser) {
    const page = await browser.newPage();
    page.setViewport({ width: 1920, height: 1080 });
    await page.goto(config.profileUrl);
    return page;
}

async function takeScreenshot(page, browser) {
    let date = (new Date()).toISOString().replace(/\:/g, '-');
    let path = config.screenPath.replace(/\.png/, '-' + date + '.png');
    return await page.screenshot({ path: path });
}