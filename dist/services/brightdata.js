"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPageObject = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const getPageObject = async () => {
    try {
        const browser = await puppeteer_1.default.launch({
            // headless: false
            headless: 'shell',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            ignoreHTTPSErrors: true
        });
        const page = await browser.newPage();
        console.log('Connected! Navigating to https://vincitu.it...');
        return { page, browser };
    }
    catch (error) {
        console.log('getPageObject', error, new Date(), 'again calling');
        return false;
    }
};
exports.getPageObject = getPageObject;
//# sourceMappingURL=brightdata.js.map