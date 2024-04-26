"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const brightdata_1 = require("../services/brightdata");
const json2csv_1 = __importDefault(require("json2csv"));
const fs_1 = __importDefault(require("fs"));
const data_json_1 = __importDefault(require("../data.json"));
let PageObject;
const openWindow = async () => {
    console.log('Opening window...');
    PageObject = await (0, brightdata_1.getPageObject)();
    if (!PageObject)
        return null;
};
const getFirstPage = async () => {
    const { page, browser } = PageObject;
    try {
        const SCRAPPING_URL = `https://totalcards.net/collections/pokemon-single-cards`;
        console.log('Connecting to scrapping data...', SCRAPPING_URL);
        await page.goto(SCRAPPING_URL, {
            waitUntil: 'networkidle0'
        });
        await page.waitForSelector('#main-collection-product-grid .product-box');
        let result = await page.evaluate(async () => {
            var _a, _b;
            const products = Array.from(document.querySelectorAll('#main-collection-product-grid .product-box'));
            let count = (_b = (_a = document
                .querySelector('#ProductCountDesktop')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim();
            count = (count === null || count === void 0 ? void 0 : count.length) ? count.match(/\d+/g).map(Number) : 0;
            return {
                list: products.map((prod) => {
                    var _a, _b, _c, _d, _e, _f;
                    const url = ((_a = prod
                        .querySelector('.product-title')) === null || _a === void 0 ? void 0 : _a.getAttribute('href')) || '';
                    const title = ((_c = (_b = prod
                        .querySelector('.product-title')) === null || _b === void 0 ? void 0 : _b.textContent) === null || _c === void 0 ? void 0 : _c.trim()) || '';
                    const price = ((_e = (_d = prod
                        .querySelector('.price')) === null || _d === void 0 ? void 0 : _d.textContent) === null || _e === void 0 ? void 0 : _e.trim().replace('£', '')) || '';
                    const image = ((_f = prod
                        .querySelector('.product-image img')) === null || _f === void 0 ? void 0 : _f.getAttribute('src')) || '';
                    return { url, title, price, image };
                }),
                count: count[0]
            };
        });
        return result;
    }
    catch (err) {
        console.error('🚀 ~ getFirstPage ~ err:', err);
        await browser.close();
        return null;
    }
};
const getData = async (num) => {
    const { page, browser } = PageObject;
    try {
        const SCRAPPING_URL = `https://totalcards.net/collections/pokemon-single-cards?page=${num}`;
        await page.goto(SCRAPPING_URL, {
            waitUntil: 'networkidle0'
        });
        await page.waitForSelector('#main-collection-product-grid .product-box');
        let result = await page.evaluate(async () => {
            const products = Array.from(document.querySelectorAll('#main-collection-product-grid .product-box'));
            return products.map((prod) => {
                var _a, _b, _c, _d, _e, _f;
                const url = ((_a = prod
                    .querySelector('.product-title')) === null || _a === void 0 ? void 0 : _a.getAttribute('href')) || '';
                const title = ((_c = (_b = prod.querySelector('.product-title')) === null || _b === void 0 ? void 0 : _b.textContent) === null || _c === void 0 ? void 0 : _c.trim()) ||
                    '';
                const price = ((_e = (_d = prod.querySelector('.price')) === null || _d === void 0 ? void 0 : _d.textContent) === null || _e === void 0 ? void 0 : _e.trim()) || '';
                const image = ((_f = prod
                    .querySelector('.product-image img')) === null || _f === void 0 ? void 0 : _f.getAttribute('src')) || '';
                return { url, title, price, image };
            });
        });
        return result;
    }
    catch (err) {
        console.error('🚀 ~ getData ~ err:', err);
        await browser.close();
        return [];
    }
};
const getDescritpion = async (data) => {
    let { page, browser } = PageObject;
    try {
        const SCRAPPING_URL = `https://totalcards.net${data.url}`;
        await page.goto(SCRAPPING_URL, {
            waitUntil: 'networkidle0'
        });
        await page.waitForSelector('.description .content-wrap p');
        let description = await page.evaluate(async () => {
            var _a, _b;
            const description = ((_b = (_a = document
                .querySelector('.description .content-wrap p')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || '';
            return description;
        });
        return Object.assign(Object.assign({}, data), { description });
    }
    catch (err) {
        console.error('🚀 ~ getDescritpion ~ err:', err);
        await browser.close();
        await openWindow();
        return await getDescritpion(data);
    }
};
const exportCSV = async (jsonData) => {
    console.log('Creating CSV...');
    const fields = ['title', 'image', 'price', 'description'];
    const csv = json2csv_1.default.parse(jsonData, { fields });
    fs_1.default.writeFile('output.csv', csv, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('CSV file has been saved.');
    });
};
const exportJSON = async (jsonData) => {
    fs_1.default.writeFile('data.json', JSON.stringify(jsonData), (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return;
        }
        console.log('File written successfully');
    });
};
const init = async () => {
    try {
        await openWindow();
        // let result: IProduct[] = [];
        // const firstList: IFirstList | null = await getFirstPage();
        // if (!firstList) return;
        // result = firstList.list;
        // const pageNum = Math.ceil(firstList.count / 20);
        // console.log(result.length, '///start///');
        // for (let index = 2; index < pageNum + 1; index++) {
        //     const list: IProduct[] = await getData(index);
        //     result = [...result, ...list];
        // }
        // console.log(result.length, '///end///');
        // await exportJSON(result);
        let allData = [];
        for (let index = 0; index < data_json_1.default.length; index++) {
            const list = await getDescritpion(data_json_1.default[index]);
            allData.push(list);
            console.log(index, '++++');
        }
        await exportJSON(allData);
        await exportCSV(allData);
    }
    catch (error) {
        await PageObject.browser.close();
        console.error(error);
        return;
    }
};
exports.init = init;
//# sourceMappingURL=scrapping.js.map