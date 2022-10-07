const jsdom = require("jsdom");
const { JSDOM } = jsdom;

class AmazonScraper {
  settings;

  // selectors
  buyBoxDivSelector = "#buybox";

  outOfStockBuyBoxDivSelector = "#outOfStockBuyBox_feature_div";

  unqualifiedBuyBoxDivSelector = "#unqualifiedBuyBox";
  seeAllBuyingChoicesLinkSelector = "#buybox-see-all-buying-choices";
  allOffersDisplayScrollerDivSelector = "#all-offers-display-scroller";
  offerDivSelector = "#aod-offer";
  offerPriceSpanSeletor = "#aod-offer .a-offscreen";

  qualifiedBuyBoxDivSelector = "#qualifiedBuybox";
  priceDivSelector = "#corePrice_feature_div .a-offscreen";

  constructor(settings) {
    this.settings = settings;
  }

  getProductPrice(url) {
    try {
      url = url.replace("www.amazon.com", "www-amazon-com.translate.goog");
      if (url.includes("?")) {
        url += "&_x_tr_sl=tr&_x_tr_tl=en&_x_tr_hl=en&_x_tr_pto=wapp";
      } else {
        url += "?_x_tr_sl=tr&_x_tr_tl=en&_x_tr_hl=en&_x_tr_pto=wapp";
      }

      console.log("[AmazonScraper] URL:", url);

      return JSDOM.fromURL(url, {
        referrer: "https://www.amazon.com/",
        includeNodeLocations: true,
        //storageQuota: 10000000,
        pretendToBeVisual: true,
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
        cookieJar: new jsdom.CookieJar(),
      }).then((dom) => {
        const document = dom.window.document;

        let buyBox = document.querySelector(this.qualifiedBuyBoxDivSelector);
        if (!buyBox) {
          buyBox = document.querySelector("#buyBoxAccordion");
        }

        if (!buyBox) {
          console.log("[AmazonScraper] Qualified buybox not found");
          return "N/A";
        }

        const priceDiv = buyBox.querySelector(this.priceDivSelector);

        const price = priceDiv.textContent;

        return price;
      });
    } catch (error) {
      console.log("[Amazon Scraper] Failed to scrape product price", error);
      return Promise.resolve("N/A");
    }
  }
}

module.exports = AmazonScraper;
