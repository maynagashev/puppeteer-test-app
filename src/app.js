const puppeteer = require('puppeteer');
const config = require('./config');

console.log(config);
(async () => {
    const browser = await initBrowser();
    const page = await openProfilePage(browser);

    await page.click('a.login-link.btn-clear');
    await page.waitForNavigation();

    await wrappingUp(page, browser);
})();

async function initBrowser() {
    let browser = await puppeteer.launch({
        headless: false,
        args: ["--window-size=1920,1080"],
        slowMo: 250,
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

async function wrappingUp(page, browser) {
    await page.screenshot({ path: config.screenPath });
    return await browser.close();
}