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
  const basicData = await page.$$eval(
    "tbody > tr",
    (data, category) => {
      const rows = data.map((item) => {
        return Object.keys(item.childNodes)
          .filter((key) => item.childNodes[key].innerText !== "100g")
          .map((key, index) => {
            const data = item.childNodes[key].innerText;

            if (index === 1) {
              return Number(data.substr(0, data.indexOf("kcal")));
            }
            return data;
          })
          .slice(0, 2);
      });

      const extendRows = rows.map((item) => {
        item.push("kcal");
        item.push("g");
        item.push(category);
        return item;
      });

      return extendRows;
    },
    category
  );

  const buttons = await page.$$(".calorie-filter-button");
  await buttons[1].click();

  const portions = await page.$$eval(".serving.portion", (data) => {
    return data.slice(1, data.length).map((portion) => {
      const portionText = portion.textContent;

      const weightStart = portionText.indexOf("(");
      const weightEnd = portionText.indexOf(")");

      const portionName = portionText.substr(2, weightStart - 3);
      const portionWeight = portionText.slice(weightStart + 1, weightEnd - 2);

      return [portionName, portionWeight].join(",");
    });
  });

  const newHtml = basicData
    .slice(1, basicData.length)
    .map((item, index) => [...item, portions[index]].join(","))
    .join("\n");

  return newHtml;
};

const scrapData = async (browser, categories) => {
  const headers = [
    "Żywność,Kalorie,JednostkaKalorii,JednostkaWagi,Kategoria,Porcja,WagaPorcji",
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
  categories.unshift("category");
  const data = await scrapData(browser, categories);
  await browser.close();
  writeFile("data.csv", data);
  writeFile("categories.csv", categories.join("\n"));
};

main();
