const Company = require("../models/Company");
const axios = require('axios');
const cheerio = require('cheerio');

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

function getDomainName(url) {
    const hostname = new URL(url).hostname;
    const domainParts = hostname.split('.');
    return domainParts.length > 2 ? domainParts[1] : domainParts[0];
}

const getCompanies = async ({ id }) => {
    let and = [];
    if (id && id !== "" && id !== "undefined") {
        and.push({ _id: id });
    }
    if (and.length === 0) {
        and.push({});
    }
    const data = await Company.find({ $and: and });
    return { status: true, data };
};

const postCompany = async ({ url }) => {
    if(!url.includes('https://'))
    {
        url=`https://${url}`;
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(url, { waitUntil: 'networkidle2' });

    let title=getDomainName(url);

    // Scraping data
    // const websiteData = await page.evaluate(() => {
    //   return {
    //     // name: document.getElementsByTagName('title')?.[0]?.innerText || '',
    //     // title,
    //     description: document.querySelector('meta[name="description"]')?.content || '',
    //     logo: document.querySelector('img[alt*="logo"], img[src*="logo"]')?.src || '',
    //     facebook: document.querySelector('a[href*="facebook.com"]')?.href || `https://facebook.com/${title}`,
    //     linkedin: document.querySelector('a[href*="linkedin.com"]')?.href || `https://linkedin.com/company/${title}`,
    //     twitter: document.querySelector('a[href*="twitter.com"]')?.href || `https://x.com/${title}`,
    //     instagram: document.querySelector('a[href*="instagram.com"]')?.href || `https://instagram.com/${title}`,
    //     address: document.querySelector('[itemprop="address"]')?.innerText.trim() || '',
    //     phone: document.querySelector('a[href^="tel:"]')?.innerText.trim() || '',
    //     email: document.querySelector('a[href^="mailto:"]')?.href.replace('mailto:', '') || '',
    //   };
    // });

    // Taking screenshot
    const filename = `${new Date().getTime()}.png`;
    const screenshotPath = path.join('./screenshots', filename);
    await page.screenshot({ path: screenshotPath, fullPage: false });

    await browser.close();

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const websiteData = {
        url,
        name: $('title').text(),
        title,
        description: $('meta[name="description"]').attr('content') || '',
        logo: $('meta[name="apple-touch-icon"]').attr('content') || '',
        facebook: $('a[href*="facebook"]').attr('href') || `https://facebook.com/${title}`,
        linkedin: $('a[href*="linkedin"]').attr('href') || `https://linkedin.com/company/${title}`,
        twitter: $('a[href*="x.com"]').attr('href') || `https://x.com/${title}`,
        instagram: $('a[href*="instagram"]').attr('href') || `https://instagram.com/${title}`,
        address: $('[itemprop="address"]').text().trim() || $('address').text().trim() || '',
        phone: $('a[href^="tel:"]').text().trim() || $('[itemprop="telephone"]').text().trim() || '',
        email: $('a[href^="mailto:"]').attr('href')?.replace('mailto:', '') || `contact@${title}.com`,
    };

    const screenshotUrl = `/screenshots/${filename}`;
    const newCompany = new Company({...websiteData, screenshot: screenshotUrl});
    let data = await newCompany.save();
    return { status: true, message: 'Scrap Success', data };
};

const putCompany = async ({ }) => {
    //
};

const deleteCompany = async ({ ids }) => {
    // console.log(ids);
    const data=await Company.deleteMany({_id: {$in: ids}});
    return {status: true, data};
};

module.exports = {
    getCompanies,
    postCompany,
    putCompany,
    deleteCompany
};
