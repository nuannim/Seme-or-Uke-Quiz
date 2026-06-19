// Seme vs Uke Personality Test App Logic

let qna = [];
let results = [];
let songs = [];
let selectedSong = null;

let currentQuestionIndex = 0;
let userAnswers = [];

// YT Player variables
let ytPlayer = null;
let ytApiReady = false;
let playTimeCounter = 0;
let playTimerInterval = null;

// Elements
const introSection = document.getElementById('intro-section');
const quizSection = document.getElementById('quiz-section');
const resultSection = document.getElementById('result-section');

const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const copyBtn = document.getElementById('copy-btn');
const downloadBtn = document.getElementById('download-btn');
const skipVideoBtn = document.getElementById('skip-video-btn');
const skipContainer = document.getElementById('skip-container');

const questionNumberEl = document.getElementById('question-number');
const progressPercentEl = document.getElementById('progress-percent');
const progressFillEl = document.getElementById('progress-fill');
const questionTextEl = document.getElementById('question-text');
const choicesContainer = document.getElementById('choices-container');

// const resultBadgeEl = document.getElementById('result-badge');
const resultTitleEl = document.getElementById('result-title');
const resultDescriptionEl = document.getElementById('result-description');
const semeBarEl = document.getElementById('seme-bar');
const semePercentLabel = document.getElementById('seme-percent-label');
const ukePercentLabel = document.getElementById('uke-percent-label');
const toastEl = document.getElementById('toast');

// Load YouTube Iframe API dynamically
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

window.onYouTubeIframeAPIReady = function() {
  ytApiReady = true;
};

// Initialize the Application
async function init() {
  // Load data files
  try {
    const [qnaRes, resultsRes, songsRes] = await Promise.all([
      fetch('data/qna.js'),
      fetch('data/result.js'),
      fetch('data/song.js')
    ]);
    
    const qnaText = await qnaRes.text();
    const resultsText = await resultsRes.text();
    const songsText = await songsRes.text();
    
    // Strip JS-style // comments and Vite sourcemap comments so the file parses as valid JSON
    const cleanJson = (text) => {
      return text
        .split('\n')
        .filter(line => {
          const trimmed = line.trim();
          return !trimmed.startsWith('//'); // remove any // comment lines
        })
        .join('\n')
        .trim();
    };
    
    qna = JSON.parse(cleanJson(qnaText));
    results = JSON.parse(cleanJson(resultsText));
    songs = JSON.parse(cleanJson(songsText));
  } catch (err) {
    console.error('Failed to load quiz data files. Falling back to local data.', err);
    // Complete fallback containing all 20 questions to prevent issues when opened via file:// protocol
    qna = [
      {
        "id": 1,
        "question": "คนที่ชอบส่งข้อความมาว่า \"นอนยัง\"",
        "choices": [
          { "id": "A", "text": "ยังครับ มีไรครับ 😳", "seme": 0, "uke": 2 },
          { "id": "B", "text": "ยัง ๆ ว่าไงงง", "seme": 1, "uke": 1 },
          { "id": "C", "text": "ปล่อยไว้ 2 ชั่วโมงแล้วค่อยตอบ", "seme": 2, "uke": 0 }
        ]
      },
      {
        "id": 2,
        "question": "เวลาเดินเข้าร้านอาหารกับเพื่อน",
        "choices": [
          { "id": "A", "text": "กินอะไรก็ได้", "seme": 0, "uke": 2 },
          { "id": "B", "text": "ร้านนี้ก็ดีนะ", "seme": 1, "uke": 1 },
          { "id": "C", "text": "ตามข้ามา ข้าจองไว้แล้ว", "seme": 2, "uke": 0 }
        ]
      },
      {
        "id": 3,
        "question": "ถ้ามีคนเอาหัวมาซบไหล่",
        "choices": [
          { "id": "A", "text": "ตัวแข็งเป็นหิน", "seme": 0, "uke": 2 },
          { "id": "B", "text": "ซบได้ตามสบาย", "seme": 1, "uke": 1 },
          { "id": "C", "text": "ดึงเข้ามาใกล้อีกนิด", "seme": 2, "uke": 0 }
        ]
      },
      {
        "id": 4,
        "question": "เวลาเจอหมาในซอยเห่าใส่",
        "choices": [
          { "id": "A", "text": "หลบหลังเพื่อน", "seme": 0, "uke": 2 },
          { "id": "B", "text": "เดินผ่านปกติ", "seme": 1, "uke": 1 },
          { "id": "C", "text": "จ้องกลับ ใครกลัวก่อนแพ้", "seme": 2, "uke": 0 }
        ]
      },
      {
        "id": 5,
        "question": "ถ้ามีคนถามว่า \"คิดถึงไหม\"",
        "choices": [
          { "id": "A", "text": "คิดถึง 🥺", "seme": 0, "uke": 2 },
          { "id": "B", "text": "ก็คิดถึงแหละ", "seme": 1, "uke": 1 },
          { "id": "C", "text": "ทำไม ถ้าบอกว่าคิดถึงจะทำไร", "seme": 2, "uke": 0 }
        ]
      },
      {
        "id": 6,
        "question": "เวลาถ่ายรูปหมู่",
        "choices": [
          { "id": "A", "text": "ยืนริมสุด", "seme": 0, "uke": 2 },
          { "id": "B", "text": "ยืนตรงไหนก็ได้", "seme": 1, "uke": 1 },
          { "id": "C", "text": "ยืนกลางรูปแบบไม่ได้นัดหมาย", "seme": 2, "uke": 0 }
        ]
      },
      {
        "id": 7,
        "question": "ถ้ามีคนบอกว่า \"ดูแลตัวเองดี ๆ นะ\"",
        "choices": [
          { "id": "A", "text": "เขินทั้งวัน", "seme": 0, "uke": 2 },
          { "id": "B", "text": "ตอบขอบคุณ", "seme": 1, "uke": 1 },
          { "id": "C", "text": "เอ็งก็ดูแลตัวเองด้วย", "seme": 2, "uke": 0 }
        ]
      },
      {
        "id": 8,
        "question": "เวลาขึ้นรถไฟฟ้าคนแน่น",
        "choices": [
          { "id": "A", "text": "ขอทางไม่เป็น", "seme": 0, "uke": 2 },
          { "id": "B", "text": "ค่อย ๆ แทรกไป", "seme": 1, "uke": 1 },
          { "id": "C", "text": "ขอทางครับ แล้วพุ่งตรงสู่ประตู", "seme": 2, "uke": 0 }
        ]
      },
      {
        "id": 9,
        "question": "ถ้าคนที่ชอบบอกว่า \"หิว\"",
        "choices": [
          { "id": "A", "text": "โอ๋ ๆ", "seme": 0, "uke": 2 },
          { "id": "B", "text": "ไปหาอะไรกินกัน", "seme": 1, "uke": 1 },
          { "id": "C", "text": "เดี๋ยวซื้อให้", "seme": 2, "uke": 0 }
        ]
      },
      {
        "id": 10,
        "question": "ถ้าโลกกำลังจะแตกในอีก 10 นาที",
        "choices": [
          { "id": "A", "text": "โทรหาคนที่ชอบ", "seme": 0, "uke": 2 },
          { "id": "B", "text": "นั่งดูพระอาทิตย์ตก", "seme": 1, "uke": 1 },
          { "id": "C", "text": "ไปหาคนที่ชอบถึงหน้าบ้าน", "seme": 2, "uke": 0 }
        ]
      },
      {
        "id": 11,
        "question": "เมื่อเดินสะดุดขาตัวเองล้มต่อหน้าคนที่ชอบ",
        "choices": [
          { "id": "A", "text": "นั่งจุ้มปุ้กอยู่ที่พื้น ทำตาแป๋วรอน้ำตาคลอเบ้า", "seme": 0, "uke": 2 },
          { "id": "B", "text": "รีบลุกขึ้นมาปัดฝุ่นแล้วบอก \"ไม่เจ็บ ๆ ขำ ๆ อะ\"", "seme": 1, "uke": 1 },
          { "id": "C", "text": "โพสท่าโพเดียมแล้วบอก \"พื้นมันอยากกอดฉันน่ะ\"", "seme": 2, "uke": 0 }
        ]
      },
      {
        "id": 12,
        "question": "เวลาสั่งชานมไข่มุกแล้วร้านให้หลอดมาอันเดียว",
        "choices": [
          { "id": "A", "text": "ส่งแก้วให้เขาเจาะ แล้วเราค่อยขอดูดต่อแบบเนียน ๆ", "seme": 0, "uke": 2 },
          { "id": "B", "text": "เดินไปขอหลอดเพิ่มที่เคาน์เตอร์ดิ รออะไร", "seme": 1, "uke": 1 },
          { "id": "C", "text": "เจาะปึ้ง! กินก่อนคำนึงแล้วยื่นหลอดเดิมเข้าปากเขา", "seme": 2, "uke": 0 }
        ]
      },
      {
        "id": 13,
        "question": "ถ้าโดนทักว่า \"ช่วงนี้อ้วนขึ้นป่ะเนี่ย\"",
        "choices": [
          { "id": "A", "text": "เอามือจับแก้มตัวเองแล้วทำหน้ามุ่ย \"งดหมูกระทะละ!\"", "seme": 0, "uke": 2 },
          { "id": "B", "text": "ก็กินดีอยู่ดีอ่ะ มีไรป่ะ", "seme": 1, "uke": 1 },
          { "id": "C", "text": "อ้วนตรงไหน บีบดูดิ... หรือจะลองอุ้มดูล่ะ?", "seme": 2, "uke": 0 }
        ]
      },
      {
        "id": 14,
        "question": "เมื่อมีคนมาจีบคนที่คุณชอบต่อหน้าต่อตา",
        "choices": [
          { "id": "A", "text": "ยืนกำหมัดแน่น หน้างอเป็นจิวเวอรี่ แอบฟึดฟัดคนเดียว", "seme": 0, "uke": 2 },
          { "id": "B", "text": "สะกิดคนของเราแล้วถาม \"ใครอ่ะ รู้จักเหรอ?\"", "seme": 1, "uke": 1 },
          { "id": "C", "text": "เดินไปโอบไหล่คนของเรา แล้วหันไปยิ้มให้คนจีบ \"ขอโทษทีครับ พอดีชิ้นนี้มีเจ้าของแล้ว\"", "seme": 2, "uke": 0 }
        ]
      },
      {
        "id": 15,
        "question": "จู่ ๆ ไฟดับมืดสนิททั้งบ้าน",
        "choices": [
          { "id": "A", "text": "กรีดร้องเบา ๆ แล้วคว้าแขนคนข้าง ๆ ไว้ก่อนเลย", "seme": 0, "uke": 2 },
          { "id": "B", "text": "เปิดแฟลชโทรศัพท์หาเทียนพรรษามาจุด", "seme": 1, "uke": 1 },
          { "id": "C", "text": "ดึงอีกฝ่ายเข้ามากอดแล้วกระซิบ \"ไม่ต้องกลัวนะ อยู่กับฉันปลอดภัยแน่นอน\"", "seme": 2, "uke": 0 }
        ]
      },
      {
        "id": 16,
        "question": "เวลานั่งดูหนังผีฉากตุ้งแช่ (Jump Scare)",
        "choices": [
          { "id": "A", "text": "เอาหมอนอิงอุดหน้า หรือมุดเข้าใต้แขนเสื้ออีกคน", "seme": 0, "uke": 2 },
          { "id": "B", "text": "สะดุ้งนิดหน่อยแล้วสบถ \"เชี่ย ผีหน้าตาตลกว่ะ\"", "seme": 1, "uke": 1 },
          { "id": "C", "text": "เอามือไปปิดตาให้อีกฝ่ายทันที \"กลัวล่ะสิ ไม่ต้องดูก็ได้นะ\"", "seme": 2, "uke": 0 }
        ]
      },
      {
        "id": 17,
        "question": "เมื่อเปิดคลิปเต้น T-POP/K-POP แดนซ์ชาเลนจ์",
        "choices": [
          { "id": "A", "text": "แกะท่าหน้ากระจก เต้นพริ้ว ยิ้มโปรยเสน่ห์", "seme": 0, "uke": 2 },
          { "id": "B", "text": "นั่งโยกหัวตามจังหวะ ขยับมือเบา ๆ พอเป็นพิธี", "seme": 1, "uke": 1 },
          { "id": "C", "text": "ยืนกอดอกดูแล้ววิเคราะห์ \"อืม... ไลน์เต้นแข็งแรงดี\"", "seme": 2, "uke": 0 }
        ]
      },
      {
        "id": 18,
        "question": "ถ้าต้องไปสวนสนุก เครื่องเล่นอันไหนที่คุณจะเลือก?",
        "choices": [
          { "id": "A", "text": "ม้าหมุนฟรุ้งฟริ้ง หรือถ้วยหมุนชวนเวียนหัว", "seme": 0, "uke": 2 },
          { "id": "B", "text": "ล่องแก่งชิว ๆ พอได้เปียกสนุก ๆ", "seme": 1, "uke": 1 },
          { "id": "C", "text": "รถไฟเหาะตีลังกาความเร็วสูง แบบกูไม่ร้องไห้แน่นอน", "seme": 2, "uke": 0 }
        ]
      },
      {
        "id": 19,
        "question": "เวลาส่งสติกเกอร์ไลน์หาเพื่อนหรือคนที่ชอบ",
        "choices": [
          { "id": "A", "text": "น้อนหมี น้อนแมว ดุ๊กดิ๊ก ตาโต แก้มชมพู", "seme": 0, "uke": 2 },
          { "id": "B", "text": "สติกเกอร์กวนตีน ๆ หรือหน้ามีมตลก ๆ", "seme": 1, "uke": 1 },
          { "id": "C", "text": "สติกเกอร์ทางการ หรือไม่ใช้เลย พิมพ์ข้อความจบ", "seme": 2, "uke": 0 }
        ]
      },
      {
        "id": 20,
        "question": "เมื่อมีคนเปิดประตูห้องน้ำมาเจอคุณกำลังอาบน้ำอยู่ (และไม่ได้ล็อกประตู)",
        "choices": [
          { "id": "A", "text": "กรีดร้อง นั่งยอง ๆ เอาขันปิดหน้าอก หน้าแดงแปร๊ด", "seme": 0, "uke": 2 },
          { "id": "B", "text": "ตะโกนด่า \"เฮ้ย! ปิดประตูเซ่! ไม่มีตาเหรอ\"", "seme": 1, "uke": 1 },
          { "id": "C", "text": "เสยผมเปียก ๆ ขึ้นหนึ่งที เสกสายตาเจ้าชู้แล้วพูด \"จะเข้ามาอาบด้วยกันเลยไหมล่ะ?\"", "seme": 2, "uke": 0 }
        ]
      }
    ];
    results = [
      { "min": 0, "max": 20, "title": "🌸 เคะตัวแม่", "description": "เอ็งเกิดมาเพื่อถูกตามใจ" },
      { "min": 21, "max": 40, "title": "🩷 เคะ", "description": "ชอบให้คนอื่นเป็นฝ่ายเริ่มมากกว่า" },
      { "min": 41, "max": 59, "title": "⚖️ สลับโพ", "description": "วันนี้เมะ พรุ่งนี้เคะ แล้วแต่อารมณ์" },
      { "min": 60, "max": 79, "title": "💙 เมะ", "description": "มักเป็นฝ่ายนำและดูแลคนอื่น" },
      { "min": 80, "max": 100, "title": "🔥 เมะตัวพ่อ", "description": "เดี๋ยวข้าจัดการเอง" }
    ];
    songs = [
      {
        "id": 1,
        "url": '<iframe width="560" height="315" src="https://www.youtube.com/embed/g3RrDbY7FEk?si=GO8JV2oORGf0F2gg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        "title": "Ponytail to Shushu",
        "artist": "BNK48",
        "artist-cover-url": "/images/BNK48_PonytailToShushu.webp"
      },
      {
        "id": 2,
        "url": '<iframe width="560" height="315" src="https://www.youtube.com/embed/HpQ9B13uv0w?si=zswoTGo6J4grw4i_" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        "title": "Sky Lantern Wish",
        "artist": "BNK48",
        "artist-cover-url": "/images/BNK48_SkyLanternWish.jpg"
      }
    ];
  }

  // Event Listeners
  startBtn.addEventListener('click', startQuiz);
  restartBtn.addEventListener('click', restartQuiz);
  copyBtn.addEventListener('click', copyResults);
  downloadBtn.addEventListener('click', downloadResultImage);
  skipVideoBtn.addEventListener('click', () => {
    // Stop the countdown timer, but KEEP the player playing!
    if (playTimerInterval) {
      clearInterval(playTimerInterval);
      playTimerInterval = null;
    }
    showResults();
  });
}

// Show specific app section with transition classes
function showSection(section) {
  const sections = [introSection, quizSection, resultSection];
  sections.forEach(s => {
    if (s && s !== section) s.classList.remove('active');
  });
  if (section) section.classList.add('active');
}

// Start Quiz flow
function startQuiz() {
  currentQuestionIndex = 0;
  userAnswers = [];
  renderQuestion();
  showSection(quizSection);
}

// Helper to shuffle an array
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Render current question
function renderQuestion() {
  if (currentQuestionIndex >= qna.length) {
    startLoadingResults();
    return;
  }

  const currentQ = qna[currentQuestionIndex];
  
  // Progress calculations
  const progressRatio = currentQuestionIndex / qna.length;
  const progressPercent = Math.round(progressRatio * 100);
  
  progressFillEl.style.width = `${progressPercent}%`;
  progressPercentEl.innerText = `${progressPercent}%`;
  questionNumberEl.innerText = `คำถามข้อที่ ${currentQuestionIndex + 1} / ${qna.length}`;
  questionTextEl.innerText = currentQ.question;

  // Clear and inject choice elements
  choicesContainer.innerHTML = '';
  const shuffledChoices = shuffleArray(currentQ.choices);
  shuffledChoices.forEach((choice, index) => {
    const choiceBtn = document.createElement('button');
    choiceBtn.className = 'choice-item';
    
    const badge = document.createElement('span');
    badge.className = 'choice-badge';
    badge.innerText = String.fromCharCode(65 + index); // A, B, C...
    
    const textSpan = document.createElement('span');
    textSpan.innerText = choice.text;
    
    choiceBtn.appendChild(badge);
    choiceBtn.appendChild(textSpan);
    
    // On click, transition to next question
    choiceBtn.addEventListener('click', () => {
      userAnswers.push(choice);
      currentQuestionIndex++;
      
      // Brief delay so the user feels the selection feedback
      choiceBtn.style.transform = 'scale(0.95)';
      setTimeout(() => {
        renderQuestion();
      }, 200);
    });
    
    choicesContainer.appendChild(choiceBtn);
  });
}

// Helper to extract Video ID from Youtube embed code
function extractVideoId(iframeStr) {
  const match = iframeStr.match(/embed\/([^"?\s>]+)/);
  return match ? match[1] : null;
}

// Clear timers and video player state
function clearPlaybackState() {
  if (playTimerInterval) {
    clearInterval(playTimerInterval);
    playTimerInterval = null;
  }
  if (ytPlayer) {
    try {
      ytPlayer.destroy();
      ytPlayer = null;
    } catch (e) {
      console.error(e);
    }
  }
}

// Start loading transition and play YouTube Video to progress
function startLoadingResults() {
  showSection(resultSection);
  
  // Select random song
  const randIndex = Math.floor(Math.random() * songs.length);
  selectedSong = songs[randIndex];
  
  const videoId = extractVideoId(selectedSong.url) || 'g3RrDbY7FEk';
  
  // Reset container width and layout transition classes
  document.querySelector('.app-container').classList.remove('expanded');
  document.getElementById('result-layout').classList.remove('show-results-layout');

  // Populate song info card details
  const songInfoCard = document.getElementById('song-info-card');
  const songCover = document.getElementById('song-cover');
  const songTitle = document.getElementById('song-title');
  const songArtist = document.getElementById('song-artist');
  if (songInfoCard && selectedSong) {
    // Use artist-cover-url from song.js (local file path or URL)
    songCover.src = selectedSong['artist-cover-url'] || `https://img.youtube.com/vi/${extractVideoId(selectedSong.url) || 'g3RrDbY7FEk'}/hqdefault.jpg`;
    songCover.alt = selectedSong.title || 'Cover';
    songTitle.innerText = selectedSong.title || '';
    songArtist.innerText = selectedSong.artist || '';
    // Reset animation so entrance plays fresh every time
    songInfoCard.style.animation = 'none';
    songInfoCard.style.display = 'flex';
    void songInfoCard.offsetWidth; // trigger reflow
    songInfoCard.style.animation = '';
  }
  document.getElementById('result-loading-header').style.display = 'block';
  document.getElementById('result-loading-status').style.display = 'block';
  
  const loadingMessage = document.getElementById('loading-message');
  const progressContainer = document.getElementById('video-progress-container');
  const progressFill = document.getElementById('video-progress-fill');
  
  loadingMessage.innerText = "กำลังคำนวณและวิเคราะห์จิตวิทยาความเป็นคุณ... 🔮";
  progressContainer.style.display = 'block';
  progressFill.style.width = '0%';
  skipContainer.style.display = 'none';
  playTimeCounter = 0;
  
  if (playTimerInterval) clearInterval(playTimerInterval);
  playTimerInterval = null;
  
  // Auto-start countdown immediately — no need to wait for video to play
  const targetSeconds = 8;
  playTimerInterval = setInterval(() => {
    playTimeCounter += 1;
    const percent = Math.min((playTimeCounter / targetSeconds) * 100, 100);
    progressFill.style.width = `${percent}%`;
    loadingMessage.innerText = `กำลังคำนวณและวิเคราะห์จิตวิทยาความเป็นคุณ... ✨`;
    if (playTimeCounter >= targetSeconds) {
      clearInterval(playTimerInterval);
      playTimerInterval = null;
      showResults();
    }
  }, 1000);

  // Initialize YT Player with Autoplay — plays in background for view boosting
  if (ytApiReady) {
    try {
      ytPlayer = new YT.Player('yt-player', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          'autoplay': 1,
          'controls': 1,
          'rel': 0,
          'modestbranding': 1
        },
        events: {
          'onReady': (event) => {
            event.target.playVideo();
          }
          // No onStateChange — timer runs independently, not tied to video state
        }
      });
    } catch (e) {
      console.error("YT Player init error:", e);
      // Timer already running, no fallback needed
    }
  } else {
    // API not ready yet — timer already counting, player will load when ready
    window.onYouTubeIframeAPIReady = function() {
      ytApiReady = true;
      try {
        ytPlayer = new YT.Player('yt-player', {
          height: '100%',
          width: '100%',
          videoId: videoId,
          playerVars: { 'autoplay': 1, 'controls': 1, 'rel': 0, 'modestbranding': 1 },
          events: { 'onReady': (e) => e.target.playVideo() }
        });
      } catch (e) { console.error(e); }
    };
  }
}


// Show Quiz Results
let globalSemePercent = 50;
let globalMatchedResult = null;

function showResults() {
  let totalSeme = 0;
  let totalUke = 0;
  
  userAnswers.forEach(ans => {
    totalSeme += ans.seme || 0;
    totalUke += ans.uke || 0;
  });
  
  const totalScore = totalSeme + totalUke;
  const semePercentage = totalScore === 0 ? 50 : (totalSeme / totalScore) * 100;
  const ukePercentage = 100 - semePercentage;

  globalSemePercent = semePercentage;

  // Match result criteria
  const matchedResult = results.find(res => semePercentage >= res.min && semePercentage <= res.max) || results[2];
  globalMatchedResult = matchedResult;

  // Configure Badge appearance (Commented out as badge-wrapper is removed)
  /*
  resultBadgeEl.className = 'result-badge'; // reset
  if (matchedResult.min === 0) {
    resultBadgeEl.classList.add('badge-uke-mom');
    resultBadgeEl.innerText = '🌸 เคะตัวแม่';
  } else if (matchedResult.min === 21) {
    resultBadgeEl.classList.add('badge-uke');
    resultBadgeEl.innerText = '🩷 เคะ';
  } else if (matchedResult.min === 41) {
    resultBadgeEl.classList.add('badge-switch');
    resultBadgeEl.innerText = '⚖️ สลับโพ';
  } else if (matchedResult.min === 60) {
    resultBadgeEl.classList.add('badge-seme');
    resultBadgeEl.innerText = '💙 เมะ';
  } else if (matchedResult.min === 80) {
    resultBadgeEl.classList.add('badge-seme-dad');
    resultBadgeEl.innerText = '🔥 เมะตัวพ่อ';
  }
  */

  // Populate data
  resultTitleEl.innerText = matchedResult.title;
  resultDescriptionEl.innerText = matchedResult.description;
  
  // Set percentage bar widths and text
  semeBarEl.style.width = `${semePercentage}%`;
  semePercentLabel.innerText = `เมะ (Seme): ${Math.round(semePercentage)}%`;
  ukePercentLabel.innerText = `เคะ (Uke): ${Math.round(ukePercentage)}%`;

  // Hide loading content
  document.getElementById('result-loading-header').style.display = 'none';
  document.getElementById('result-loading-status').style.display = 'none';
  
  // Reveal predictions box on the left/top
  // (visibility and expansion managed smoothly by CSS classes)

  // Trigger container width and layout animation classes to shift the playing video to the side/below
  document.querySelector('.app-container').classList.add('expanded');
  document.getElementById('result-layout').classList.add('show-results-layout');

  showSection(resultSection);
}

// Copy results text to clipboard
function copyResults() {
  const ukePercentage = 100 - globalSemePercent;
  const shareText = `✨ แบบทดสอบ Seme or Uke? ✨\n\nโพซิชั่นของฉันคือ: ${globalMatchedResult.title}\n"${globalMatchedResult.description}"\n\n💙 เมะ (Seme): ${Math.round(globalSemePercent)}%\n🌸 เคะ (Uke): ${Math.round(ukePercentage)}%\n\nมาลองทดสอบของคุณได้เลย! ✨`;

  navigator.clipboard.writeText(shareText).then(() => {
    toastEl.classList.add('show');
    setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2000);
  }).catch(err => {
    console.error('Could not copy results to clipboard', err);
  });
}

// Generate vertical Story Image (9:16) client-side using Canvas API
function downloadResultImage() {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');

  // Fonts used on website — must match exactly what Google Fonts loaded
  const FONT_TITLE = '"Google Sans", "IBM Plex Sans Thai", sans-serif';

  document.fonts.ready.then(() => {
    // 1. Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 1920);
    gradient.addColorStop(0, '#E2EEFF');
    gradient.addColorStop(0.5, '#FFF0F2');
    gradient.addColorStop(1, '#FFE6EA');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1920);

    // 2. Soft glow spots
    ctx.fillStyle = 'rgba(134, 179, 252, 0.45)';
    ctx.beginPath();
    ctx.arc(150, 350, 400, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 158, 170, 0.45)';
    ctx.beginPath();
    ctx.arc(930, 1570, 400, 0, Math.PI * 2);
    ctx.fill();

    // Helper: rounded rect
    const drawRoundRect = (x, y, w, h, r, fillColor, shadowOptions) => {
      ctx.save();
      if (shadowOptions) {
        ctx.shadowColor = shadowOptions.color || 'rgba(0,0,0,0.05)';
        ctx.shadowBlur = shadowOptions.blur || 30;
        ctx.shadowOffsetX = shadowOptions.ox || 0;
        ctx.shadowOffsetY = shadowOptions.oy || 15;
      }
      ctx.fillStyle = fillColor;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // 3. Main card
    drawRoundRect(90, 200, 900, 1520, 60, '#FFFFFF', {
      color: 'rgba(15, 23, 42, 0.08)', blur: 50, ox: 0, oy: 20
    });

    // 4. Seme bubble
    const semeGrad = ctx.createLinearGradient(430, 320, 530, 420);
    semeGrad.addColorStop(0, '#86B3FC');
    semeGrad.addColorStop(1, '#3B82F6');
    ctx.fillStyle = semeGrad;
    ctx.beginPath();
    ctx.arc(480, 380, 65, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold 50px ${FONT_TITLE}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('\u2642', 480, 378);

    // 4b. Uke bubble
    const ukeGrad = ctx.createLinearGradient(550, 320, 650, 420);
    ukeGrad.addColorStop(0, '#FF9EAA');
    ukeGrad.addColorStop(1, '#EC4899');
    ctx.fillStyle = ukeGrad;
    ctx.beginPath();
    ctx.arc(600, 380, 65, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('\u2640', 600, 378);

    // 5. Subtitle
    ctx.fillStyle = '#475569';
    ctx.font = `700 30px ${FONT_TITLE}`;
    ctx.fillText('SEME or UKE QUIZ', 540, 510);

    ctx.fillStyle = '#0F172A';
    ctx.font = `700 46px ${FONT_TITLE}`;
    ctx.fillText('\u0e41\u0e1a\u0e1a\u0e17\u0e14\u0e2a\u0e2d\u0e1a\u0e42\u0e1e\u0e0b\u0e34\u0e0a\u0e31\u0e48\u0e19\u0e02\u0e2d\u0e07\u0e04\u0e38\u0e13', 540, 575);

    // 6. Badge (Commented out as badge-wrapper is removed)
    /*
    let badgeText = '';
    let badgeBg = '';
    let badgeFg = '';
    if (globalMatchedResult.min === 0)  { badgeText = '\ud83c\udf38 \u0e40\u0e04\u0e30\u0e15\u0e31\u0e27\u0e41\u0e21\u0e48'; badgeBg = '#FCE7F3'; badgeFg = '#9D174D'; }
    else if (globalMatchedResult.min === 21) { badgeText = '\ud83d\udc97 \u0e40\u0e04\u0e30'; badgeBg = '#FCE7F3'; badgeFg = '#9D174D'; }
    else if (globalMatchedResult.min === 41) { badgeText = '\u2696\ufe0f \u0e2a\u0e25\u0e31\u0e1a\u0e42\u0e1e'; badgeBg = '#EDE9FE'; badgeFg = '#5B21B6'; }
    else if (globalMatchedResult.min === 60) { badgeText = '\ud83d\udc99 \u0e40\u0e21\u0e30'; badgeBg = '#DBEAFE'; badgeFg = '#1E40AF'; }
    else { badgeText = '\ud83d\udd25 \u0e40\u0e21\u0e30\u0e15\u0e31\u0e27\u0e1e\u0e48\u0e2d'; badgeBg = '#DBEAFE'; badgeFg = '#1E40AF'; }

    drawRoundRect(540 - 200, 640, 400, 86, 43, badgeBg);
    ctx.fillStyle = badgeFg;
    ctx.font = `700 38px ${FONT_TITLE}`;
    ctx.fillText(badgeText, 540, 686);
    */

    // 7. Result title
    ctx.fillStyle = '#0F172A';
    ctx.font = `700 54px ${FONT_TITLE}`;
    ctx.fillText(globalMatchedResult.title, 540, 790);

    // 8. Description (with wrap)
    ctx.fillStyle = '#0F172A';
    ctx.font = `600 34px ${FONT_TITLE}`;
    const wrapText = (text, x, y, maxWidth, lineHeight) => {
      const chars = text.split('');
      let line = '';
      for (let n = 0; n < chars.length; n++) {
        const testLine = line + chars[n];
        if (ctx.measureText(testLine).width > maxWidth && n > 0) {
          ctx.fillText(line, x, y);
          line = chars[n];
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, y);
    };
    drawRoundRect(140, 848, 800, 200, 24, '#F8FAFC');
    wrapText(`"${globalMatchedResult.description}"`, 540, 910, 700, 52);

    // 9. Seme/Uke percentage bar
    const semeVal = Math.round(globalSemePercent);
    const ukeVal = 100 - semeVal;

    ctx.textAlign = 'left';
    ctx.fillStyle = '#3B82F6';
    ctx.font = `700 30px ${FONT_TITLE}`;
    ctx.fillText(`\u0e40\u0e21\u0e30 (Seme): ${semeVal}%`, 140, 1110);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#EC4899';
    ctx.fillText(`\u0e40\u0e04\u0e30 (Uke): ${ukeVal}%`, 940, 1110);

    ctx.textAlign = 'center';
    drawRoundRect(140, 1135, 800, 28, 14, '#F3F4F6');
    const semeWidth = Math.max((semeVal / 100) * 800, 15);
    const semeGradFill = ctx.createLinearGradient(140, 0, 140 + semeWidth, 0);
    semeGradFill.addColorStop(0, '#86B3FC');
    semeGradFill.addColorStop(1, '#3B82F6');
    drawRoundRect(140, 1135, semeWidth, 28, 14, semeGradFill);

    // 10. Footer
    ctx.fillStyle = '#475569';
    ctx.font = `600 26px ${FONT_TITLE}`;
    ctx.fillText('Seme \u0026 Uke Personality Test \u00a9 2026', 540, 1820);

    // 11. Download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const titleCleaned = globalMatchedResult.title.replace(/[^a-zA-Z0-9\u0e00-\u0e7f]/g, '');
      link.download = `seme_uke_result_${titleCleaned}.png`;
      link.href = url;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, 'image/png');
  }).catch(err => {
    console.error('Font load and rendering failed:', err);
  });
}




// Restart Quiz
function restartQuiz() {
  clearPlaybackState();
  currentQuestionIndex = 0;
  userAnswers = [];
  
  // Reset container widths and transition classes
  document.querySelector('.app-container').classList.remove('expanded');
  document.getElementById('result-layout').classList.remove('show-results-layout');
  
  // Hide song info card
  const songInfoCard = document.getElementById('song-info-card');
  if (songInfoCard) songInfoCard.style.display = 'none';
  
  showSection(introSection);
}

// Run app init
document.addEventListener('DOMContentLoaded', init);
export default {};
