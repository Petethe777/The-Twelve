const url = "https://forms.gle/aXpZKC56CMbo69fU7"; // Team Applications

async function main() {
  const res = await fetch(url);
  const html = await res.text();
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
            let choices = [];
            if (field[4] && field[4][0]) {
              entryId = field[4][0][0];
              if (field[4][0][1]) {
                choices = field[4][0][1].map(c => c[0]);
              }
            }
            if (choices.length > 0 || qType === 2) {
              console.log(`Question: "${qText}" (ID: entry.${entryId})`);
              console.log(`  Choices: ${choices.join(' | ')}`);
            }
          }
        }
      }
    }
  }
}
main();
