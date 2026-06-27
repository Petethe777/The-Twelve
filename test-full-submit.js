import fs from 'fs';

async function main() {
  const fields = JSON.parse(fs.readFileSync('detected-fields.json', 'utf8'));
  const fData = new URLSearchParams();
  
  for (const f of fields) {
    if (!f.entryId) continue;
    
    // Choose appropriate dummy data based on the label and type
    let value = 'Test';
    const label = f.label.toLowerCase();
    
    if (label.includes('email')) {
      value = 'test@example.com';
    } else if (label.includes('cell') || label.includes('phone') || label.includes('number')) {
      value = '0815411335';
    } else if (label.includes('postal code')) {
      value = '3610';
    } else if (label.includes('date')) {
      value = '2026-06-27';
    } else if (label.includes('id number') || label.includes('passport')) {
      value = '0402115123081';
    } else if (label.includes('age')) {
      value = '21';
    } else if (label.includes('stamina') || label.includes('health') || label.includes('walk')) {
      value = '10';
    } else if (label.includes('gender')) {
      value = 'Male';
    } else if (label.includes('size')) {
      value = 'M';
    } else if (label.includes('agree') || label.includes('declaration')) {
      value = 'Yes, I Agree';
    } else if (f.type === 2) { // Multiple Choice
      value = 'Yes';
    }
    
    fData.append(`entry.${f.entryId}`, value);
  }
  
  const url = 'https://docs.google.com/forms/d/e/1FAIpQLSdXO4imsA_PLOg2JCwJ0PejbTMiau4oX9NC5q-zyD4Z-e-Q_Q/formResponse';
  console.log('Sending full mock payload to Google Form...');
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: fData.toString()
  });
  
  console.log('Response Status:', res.status);
  const text = await res.text();
  fs.writeFileSync('full-submit-response.html', text);
  console.log('Saved response to full-submit-response.html. Size:', text.length);
  
  if (text.includes('Your response has been recorded') || text.includes('has been recorded')) {
    console.log('SUCCESS: Google Form successfully recorded the FULL response!');
  } else {
    console.log('WARNING: Full response not recorded. Let\'s check for missing required fields.');
    // Find lines with error or validation
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('This is a required question')) {
        console.log(`Line ${i} has error: ${lines[i].substring(0, 300)}`);
      }
    }
  }
}

main().catch(console.error);
