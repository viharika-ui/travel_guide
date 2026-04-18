import fs from 'fs';

const languages = ['hi','te','kn','ml','ta','bn','or','pa','gu']; // test first

const english = JSON.parse(
  fs.readFileSync('./src/i18n/locales/en.json', 'utf-8')
);

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function translateText(text, target) {
  const url =
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${target}`;

  const response = await fetch(url);

  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const data = await response.json();

  return data.responseData.translatedText;
}

async function translateObj(obj, lang) {
  const result = {};

  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      try {
        result[key] = await translateText(obj[key], lang);
        console.log(`✓ ${obj[key]}`);
        await sleep(1500);
      } catch (err) {
        console.log(`Failed: ${obj[key]} - ${err.message}`);
        result[key] = obj[key];
      }
    } else {
      result[key] = await translateObj(obj[key], lang);
    }
  }

  return result;
}

async function run() {
  for (const lang of languages) {
    const translated = await translateObj(english, lang);

    fs.writeFileSync(
      `./src/i18n/locales/${lang}.json`,
      JSON.stringify(translated, null, 2)
    );
  }

  console.log("Done");
}

run();