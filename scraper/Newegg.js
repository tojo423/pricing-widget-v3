const jsdom = require("jsdom");
const { JSDOM } = jsdom;

class NeweggScraper {
  settings;

  priceSelector = `.product-buy-box .price-current`;

  constructor(settings) {
    this.settings = settings;
  }

  getProductPrice(url) {
    try {
      url = url.replace("www.newegg.com", "www-newegg-com.translate.goog");
      if (url.includes("?")) {
        url += "&_x_tr_sl=tr&_x_tr_tl=en&_x_tr_hl=en&_x_tr_pto=wapp";
      } else {
        url += "?_x_tr_sl=tr&_x_tr_tl=en&_x_tr_hl=en&_x_tr_pto=wapp";
      }
      
      return JSDOM.fromURL(url, {
        referrer: "https://www.translate.google.com/",
        includeNodeLocations: true,
        //storageQuota: 10000000,
        pretendToBeVisual: true,
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
        cookieJar: new jsdom.CookieJar(),
      }).then((dom) => {
        require("fs").writeFileSync(
          "newegg_product_page_sample2.html",
          dom.serialize()
        );
        const document = dom.window.document;
        const priceElements = [
          ...document.querySelectorAll(this.priceSelector),
        ].filter((priceElement) => {
          return priceElement.textContent.length > 2;
        });
        if (!priceElements) {
          console.log("[newegg Scraper] No Price Elements Found");
          return "N/A";
        }
        priceElements.forEach((priceElement) => {
          console.log(
            "[newegg Scraper] priceElement textContent:",
            priceElement.textContent
          );
        });
        const lastPriceElement = priceElements[priceElements.length - 1];
        const price = lastPriceElement.textContent;
        console.log("[newegg Scraper] price:", price);
        return price;
      });
    } catch (error) {
      console.log("[newegg Scraper] Failed to scrape product price", error);
      return Promise.resolve("N/A");
    }
  }
}

module.exports = NeweggScraper;
