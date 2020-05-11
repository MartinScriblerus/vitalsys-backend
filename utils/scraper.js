
const puppeteer = require('puppeteer');
var rita = require('rita');
var sentencesBeckett;

try {
(async (sentencesBeckett) => {


//Launching Puppeteer!
      const browser = await puppeteer.launch({});
      const page = await browser.newPage();
      await page.goto(`https://www.gutenberg.org/files/20/20-h/20-h.htm#link2HCH0002`);
    
        const tds = await page.evaluate(() => {
        const tds = Array.from(document.querySelectorAll('p'))
      return tds.map(td => td.innerHTML)
        });
  
    tempbeckett = (JSON.stringify(tds))
    beckett = tempbeckett.replace(/\\n/g, '') 
    console.log(tempbeckett)
    var rs = rita.RiString(beckett);
   
    rita.tokenize(beckett);
    rita.splitSentences(beckett);
    let rm = new rita.RiMarkov(5);
    rm.loadText(beckett);
    sentencesBeckett = rm.generateSentences(1);
    console.log(sentencesBeckett);
      
      // await page.waitFor(1000);
      await sentencesBeckett
      console.log(sentencesBeckett);
      await browser.close();
      return sentencesBeckett
 
  })();
} catch(error){
console.error(error)
}
if (sentencesBeckett !== undefined) {
  
}
