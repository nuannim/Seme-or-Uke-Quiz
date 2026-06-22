const fs = require('fs');
const path = require('path');

const qnaPath = path.join(__dirname, '../public/data/qna3.js');
const cleanJson = fs.readFileSync(qnaPath, 'utf8')
  .split('\n')
  .filter(line => !line.trim().startsWith('//'))
  .join('\n')
  .trim();

const qna = JSON.parse(cleanJson);

console.log('--- Checking for anomalies in qna3.js ---');
let invalidCount = 0;
let totalChoices = 0;
let semeSum = 0;
let ukeSum = 0;

qna.forEach((q, idx) => {
  if (!q.choices || !Array.isArray(q.choices)) {
    console.log(`Q${q.id} has no choices array!`);
    invalidCount++;
    return;
  }
  q.choices.forEach(c => {
    totalChoices++;
    if (typeof c.seme !== 'number' || isNaN(c.seme)) {
      console.log(`Q${q.id} Choice ${c.id} has invalid seme:`, c.seme);
      invalidCount++;
    } else {
      semeSum += c.seme;
    }
    if (typeof c.uke !== 'number' || isNaN(c.uke)) {
      console.log(`Q${q.id} Choice ${c.id} has invalid uke:`, c.uke);
      invalidCount++;
    } else {
      ukeSum += c.uke;
    }
    
    // Check if the sum is not 3
    if (c.seme + c.uke !== 3) {
      console.log(`Q${q.id} Choice ${c.id} does not sum to 3: seme=${c.seme}, uke=${c.uke}`);
    }
  });
});

console.log(`Total choices: ${totalChoices}`);
console.log(`Average seme score per choice: ${semeSum / totalChoices}`);
console.log(`Average uke score per choice: ${ukeSum / totalChoices}`);
console.log(`Anomaly count: ${invalidCount}`);
