const url = "https://forms.gle/aXpZKC56CMbo69fU7"; // Team Applications

async function main() {
  const res = await fetch(url);
  const html = await res.text();
  
  // Let's print out parts of the page or inspect the elements
  // Let's find inputs or select boxes
  const inputMatches = html.match(/name="entry\.[^"]+"/g) || [];
  console.log("Found direct input names in HTML:", [...new Set(inputMatches)]);

  // Let's check if there are entry IDs containing _year, _month, _day
  // usually they are in the JSON or structure
  const fbDataMatch = html.match(/FB_PUBLIC_LOAD_DATA_\s*=\s*(.*?);<\/script>/s);
  if (fbDataMatch) {
    const dataObj = eval(fbDataMatch[1]);
    const topItems = dataObj[1] || [];
    for (const topItem of topItems) {
      if (Array.isArray(topItem)) {
        if (topItem.length > 0 && Array.isArray(topItem[0]) && typeof topItem[0][0] === 'number' && typeof topItem[0][1] === 'string') {
          for (const field of topItem) {
            const qText = field[1];
            const qType = field[3];
            let entryId = null;
            if (field[4] && field[4][0]) {
              entryId = field[4][0][0];
            }
            if (qType === 9 || qType === 10 || qText.toLowerCase().includes("date")) {
              console.log(`Date field found: "${qText}" (type ${qType}) => entry.${entryId}`);
            }
          }
        }
      }
    }
  }
}
main();
