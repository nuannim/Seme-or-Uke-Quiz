const fs = require('fs');
const path = require('path');

const qnaPath = path.join(__dirname, '../public/data/qna3.js');
const content = fs.readFileSync(qnaPath, 'utf8');

// Clean comments
const cleanJson = content
  .split('\n')
  .filter(line => !line.trim().startsWith('//'))
  .join('\n')
  .trim();

const qna = JSON.parse(cleanJson);

console.log(`Total questions: ${qna.length}`);

let totalMaxSeme = 0;
let totalMinSeme = 0;
let totalMaxUke = 0;
let totalMinUke = 0;

qna.forEach((q, idx) => {
  const semeScores = q.choices.map(c => c.seme);
  const ukeScores = q.choices.map(c => c.uke);

  const maxSeme = Math.max(...semeScores);
  const minSeme = Math.min(...semeScores);
  const maxUke = Math.max(...ukeScores);
  const minUke = Math.min(...ukeScores);

  totalMaxSeme += maxSeme;
  totalMinSeme += minSeme;
  totalMaxUke += maxUke;
  totalMinUke += minUke;

  console.log(`Q${q.id} ("${q.question.substring(0, 30)}..."):`);
  q.choices.forEach(c => {
    console.log(`  Choice [${c.id}] (seme: ${c.seme}, uke: ${c.uke}): "${c.text}"`);
  });
});

console.log('\n--- OVERALL BOUNDS ---');
console.log(`Max possible Seme points: ${totalMaxSeme}`);
console.log(`Min possible Seme points: ${totalMinSeme}`);
console.log(`Max possible Uke points: ${totalMaxUke}`);
console.log(`Min possible Uke points: ${totalMinUke}`);

const absoluteMaxScore = totalMaxSeme; // assuming sum of seme + uke is constant per choice
console.log(`Absolute Max Seme Percentage: ${(totalMaxSeme / (totalMaxSeme + totalMinUke)) * 100}%`);
console.log(`Absolute Min Seme Percentage: ${(totalMinSeme / (totalMinSeme + totalMaxUke)) * 100}%`);
