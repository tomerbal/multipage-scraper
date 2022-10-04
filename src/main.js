
import { Actor } from 'apify';

import { PuppeteerCrawler } from 'crawlee';

await Actor.init();

let input = await Actor.getInput();
console.log(input)

const startUrls = input.urls;

// const proxyConfiguration = await Actor.createProxyConfiguration();

const crawler = new PuppeteerCrawler({

    async requestHandler({ page, request }) {

        const html = await page.evaluate(async () => {
            return document.documentElement.innerHTML;
        });
        await Actor.pushData({
            url: request.url,
            html: html
        });
    },

    async failedRequestHandler({ request }) {
        console.error(request.errorMessages);
        // This function is called when the crawling of a request failed too many times
        await Actor.pushData({
            status: true,
            message: request.errorMessages
        });
    },
});

await crawler.run(startUrls);

await Actor.exit();
