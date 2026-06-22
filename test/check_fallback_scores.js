const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../app.js');
const content = fs.readFileSync(appPath, 'utf8');

// Match from qna = [ ... ] fallback block
// Let's find the start index of the fallback qna
const match = content.match(/qna\s*=\s*\[\s*\{\s*["']id["']:\s*1/);
if (!match) {
  console.error("Could not find the start of the qna array fallback in app.js");
  process.exit(1);
}

const startIdx = match.index + match[0].indexOf('[');

// Now, find the matching closing bracket for this array
let bracketCount = 1;
let endIdx = -1;
for (let i = startIdx + 1; i < content.length; i++) {
  if (content[i] === '[') bracketCount++;
  else if (content[i] === ']') bracketCount--;

  if (bracketCount === 0) {
    endIdx = i + 1;
    break;
  }
}

if (endIdx === -1) {
  console.error("Could not find the end of the qna array fallback in app.js");
  process.exit(1);
}

const qnaStr = content.substring(startIdx, endIdx);
const qna = eval(qnaStr);

console.log('--- Checking for anomalies in app.js fallback ---');
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
