const puppeter = require("puppeteer");
const fs = require("fs");

const url = "https://www.tabelakalorii.net/zywnosc/";

const links = [
  "owoce",
  "owoce-tropikalne-i-egzotyczne",
  "owoce-w-puszkach",
  "produkty-ziemniaczane",
  "warzywa",
  "fast-food",
  "pizza",
  "jogurt",
  "mleko-i-produkty-mleczne",
  "ser",
  "ser-topiony",
  "ser-w-plasterkach",
  "drob-i-ptactwo",
  "dziczyzna",
  "kielbasa",
  "mieso-i-produkty-miesne",
  "podroby",
  "wedliny-i-mieso-obiadowe",
  "wieprzowina",
  "wolowina-i-cielecina",
  "ciastka-i-ciasta",
  "cukierki-i-slodycze",
  "lody-i-desery-mrozone",
  "napoje-alkoholowe-i-napitki",
  "napoje-bezalkoholowe-i-napitki",
  "napoje-sodowe-i-lekkie",
  "piwo",
  "soki-owocowe",
  "wino",
  "makaron-i-noodle",
  "platki-owsiane-kukurydziane-i-musli",
  "zboza-i-produkty-zbozowe",
  "dania-i-posilki",
  "zupy",
  "orzechy-i-nasiona",
  "rosliny-straczkowe",
  "oleje-i-tluszcze",
  "oleje-roslinne",
  "pasty",
  "ryby-i-owoce-morza",
  "skladniki-do-pieczenia",
  "sosy-i-dressingi",
  "wyroby-cukiernicze-chleb-i-wypieki",
  "ziola-i-przyprawy",
];

const configurePage = async (browser, url) => {
  const page = await browser.newPage();
  page.on("console", (consoleObj) => console.log(consoleObj.text()));
  await page.goto(url);
  return page;
};

const convertLinksToCategories = (links) => {
  return links.map((link) => link.replace(/-/g, " "));
};

const getHtml = async (page, category) => {
  const html = await page.evaluate((category) => {
    const tbodyRows = Array.from(document.querySelectorAll("tbody > tr")).map(
      (item) => {
        return Object.keys(item.childNodes)
          .map((key, index) => {
            const data = item.childNodes[key].innerText;

            if (index === 1) {
              return Number(data.slice(0, 3));
            }
            if (index === 2) {
              return Number(data.substr(0, data.indexOf("kcal")));
            }
            return data;
          })
          .slice(0, 3);
      }
    );

    const rows = tbodyRows.map((item) => {
      if (item[1] === 100) {
        item.push("g");
      }

      item.push("kcal");
      item.push(category);

      return item.join(",");
    });

    return rows.join("\n");
  }, category);
  return html;
};

const scrapData = async (browser, categories) => {
  const headers = [
    "Żywność,Porcja,Kalorie,Jednostka wagi,Jednostka kalorii,Kategoria",
  ].join(",");
  const rows = await Promise.all(
    links.map(async (link, index) => {
      const page = await configurePage(browser, url + link);
      const html = await getHtml(page, categories[index]);
      return html;
    })
  );

  return [headers, ...rows].join("\n");
};

const writeFile = (fileName, data) => {
  fs.writeFile(fileName, data, (err) => {
    if (err) {
      console.log(err);
    }
  });
};

const main = async () => {
  const browser = await puppeter.launch();
  const categories = convertLinksToCategories(links);
  const data = await scrapData(browser, categories);
  await browser.close();
  writeFile("data.csv", data);
  writeFile("categories.csv", categories.join("\n"));
  console.log(categories);
};

main();
