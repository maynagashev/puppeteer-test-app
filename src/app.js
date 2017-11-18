const puppeteer = require('puppeteer');
const config = require('./config');
const path = require('path');
const moment = require('moment');
//console.log(config);

console.log('Pwd:', path.resolve());
console.log('Date:', (new Date()).toString());

//process.exit();

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
    await takeScreenshot(page, browser, 'profile');

    // goto main page
    await page.goto("https://stackoverflow.com/");
    await takeScreenshot(page, browser, 'homepage');    
    
    return await browser.close();
})();

async function initBrowser() {
    let browser = await puppeteer.launch({
        headless: true,
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

async function takeScreenshot(page, browser, n) {    
    let screenPath = buildScreenPath(n);
    return await page.screenshot({ path: screenPath });
}

function buildScreenPath(n) {
    let dateOnly = moment().utc().format('YYYY-MM-DD');
    // let date = (new Date()).toISOString().replace(/\:/g, '-');
    
    let screenPath = path.resolve(__dirname + '/..')
        + '/' 
        + config.screenPath
        + dateOnly
        + ((n) ? '-' + n : '')
        + '.png';

    return screenPath;
}