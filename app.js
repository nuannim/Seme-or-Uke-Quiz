// Seme vs Uke Personality Test App Logic

let qna = [];
let results = [];
let songs = [];
let selectedSong = null;
let currentSongIndex = 0;

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

window.onYouTubeIframeAPIReady = function () {
  ytApiReady = true;
};

// Initialize the Application
async function init() {
  // Load data files
  try {
    const [qnaRes, resultsRes, songsRes] = await Promise.all([
      fetch(`data/qna3.js?_=${Date.now()}`),
      fetch(`data/result.js?_=${Date.now()}`),
      fetch(`data/song.js?_=${Date.now()}`)
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
        "question": "คนที่ชอบส่งข้อความมาว่า \"นอนยัง\" จะตอบว่า...",
        "choices": [
          { "id": "A", "text": "รอเธอทักมาอยู่พอดีเลย", "seme": 0, "uke": 3 },
          { "id": "B", "text": "ยัง ๆ ว่าไงงง", "seme": 1, "uke": 2 },
          { "id": "C", "text": "นอนแล้ว (แต่ตอบกลับใน 1 วินาทีนะ)", "seme": 2, "uke": 1 },
          { "id": "D", "text": "ปล่อยไว้ 2 ชั่วโมงแล้วค่อยตอบ", "seme": 3, "uke": 0 }
        ]
      },
      {
        "id": 2,
        "question": "เวลาเดินเข้าร้านอาหารกับเพื่อน คุณเป็นคนประเภทไหน",
        "choices": [
          { "id": "A", "text": "แล้วแต่เธอเลย กินอะไรก็ได้", "seme": 0, "uke": 3 },
          { "id": "B", "text": "ร้านนี้ก็ดีนะ (ยิ้มเสนอไอเดียเบาๆ)", "seme": 1, "uke": 2 },
          { "id": "C", "text": "ร้านไหนเรียกสุดสวย สุดหล่อ ก็ร้านนั้นล่ะ", "seme": 2, "uke": 1 },
          { "id": "D", "text": "ตามมา ข้าจองไว้แล้ว", "seme": 3, "uke": 0 }
        ]
      },
      {
        "id": 3,
        "question": "ถ้ามีคนเอาหัวมาซบไหล่ คุณจะ...",
        "choices": [
          { "id": "A", "text": "สะดุ้งตัวแข็งทื่อ เขินจนหน้าแดงทำอะไรไม่ถูก", "seme": 0, "uke": 3 },
          { "id": "B", "text": "เอียงหัวไปพิงกลับเบา ๆ แอบอมยิ้ม", "seme": 1, "uke": 2 },
          { "id": "C", "text": "แซวขำ ๆ ว่าคิดค่าเช่าไหล่นะ แต่ก็ยอมให้ซบต่อไป", "seme": 2, "uke": 1 },
          { "id": "D", "text": "เนียนโอบไหล่กลับหรือลูบหัวเขาเบา ๆ", "seme": 3, "uke": 0 }
        ]
      },
      {
        "id": 4,
        "question": "เวลาเจอหมาในซอยเห่าใส่ คุณจะ...",
        "choices": [
          { "id": "A", "text": "ตกใจสะดุ้งตัวโยน แล้วรีบเดินหลบไปอยู่ข้างหลังอีกคน", "seme": 0, "uke": 3 },
          { "id": "B", "text": "สะดุ้งนิดหน่อยแล้วเดินเลี่ยง ๆ แบบระวังตัว", "seme": 1, "uke": 2 },
          { "id": "C", "text": "เดินผ่านไปปกติแบบนิ่ง ๆ ไม่สนใจ", "seme": 2, "uke": 1 },
          { "id": "D", "text": "เดินบังอีกคนไว้ แล้วค่อย ๆ พาเดินผ่านไปนิ่ง ๆ", "seme": 3, "uke": 0 }
        ]
      },
      {
        "id": 5,
        "question": "ถ้ามีคนถามว่า \"คิดถึงไหม\" จะตอบว่า...",
        "choices": [
          { "id": "A", "text": "ตอบเบี่ยงประเด็นแก้เขิน แต่หูแดงไปหมดแล้ว", "seme": 0, "uke": 3 },
          { "id": "B", "text": "ก็...คิดถึงแหละ (พูดพึมพำเสียงเบา)", "seme": 1, "uke": 2 },
          { "id": "C", "text": "ถามกลับกวน ๆ ว่า 'ถามทำไม? ถ้าบอกว่าคิดถึงจะทำอะไรล่ะ'", "seme": 2, "uke": 1 },
          { "id": "D", "text": "คิดถึงสิ เดี๋ยวออกไปหาตอนนี้เลยไหม?", "seme": 3, "uke": 0 }
        ]
      },
      {
        "id": 6,
        "question": "เวลาถ่ายรูปหมู่ คุณจะ...",
        "choices": [
          { "id": "A", "text": "ยืนตรงที่ที่คนอื่นจัดให้ ทำท่าชูสองนิ้วน่ารัก ๆ ยิ้มแย้ม", "seme": 0, "uke": 3 },
          { "id": "B", "text": "ยืนแอบอยู่มุมข้าง ๆ หรือเกาะแขนเพื่อนไว้แก้เขิน", "seme": 1, "uke": 2 },
          { "id": "C", "text": "ยืนตรงไหนก็ได้ชิล ๆ ถ่ายเสร็จก็ผ่านไปไม่ได้ซีเรียส", "seme": 2, "uke": 1 },
          { "id": "D", "text": "เป็นคนคอยจัดแจงหามุมสวย ๆ ให้ทุกคน แล้วอาสาถ่ายรูปให้", "seme": 3, "uke": 0 }
        ]
      },
      {
        "id": 7,
        "question": "ถ้ามีคนบอกว่า \"ดูแลตัวเองดี ๆ นะ\" จะ...",
        "choices": [
          { "id": "A", "text": "หน้าร้อนผ่าว แอบเขินอ้อมแอ้มตอบกลับในใจแต่พิมพ์ไปแค่สติกเกอร์น่ารัก ๆ", "seme": 0, "uke": 3 },
          { "id": "B", "text": "พิมพ์ขอบคุณไปตามปกติ แต่ในใจแอบอมยิ้มแก้มตุ่ย", "seme": 1, "uke": 2 },
          { "id": "C", "text": "ตอบกลับสไตล์เป็นห่วงเหมือนกัน 'เธอก็ดูแลตัวเองดี ๆ ด้วยนะ'", "seme": 2, "uke": 1 },
          { "id": "D", "text": "หยอดกลับทันที 'ถ้าเป็นห่วงจริง ๆ ก็ย้ายมาดูแลกันใกล้ ๆ สิ'", "seme": 3, "uke": 0 }
        ]
      },
      {
        "id": 8,
        "question": "คุณต้องการลงรถไฟฟ้าสถานีนี้ แต่คนแน่นมากจนเดินออกไปไม่ได้ คุณจะ...",
        "choices": [
          { "id": "A", "text": "ยืนอึกอักทำตัวไม่ถูก ร้องขอทางเบา ๆ จนแทบไม่มีใครได้ยิน", "seme": 0, "uke": 3 },
          { "id": "B", "text": "ค่อย ๆ แทรกผ่านตัวผู้คนไป พร้อมกล่าวขอโทษเบา ๆ", "seme": 1, "uke": 2 },
          { "id": "C", "text": "พูด 'ขอทางหน่อยนะครับ/คะ' ด้วยความมั่นใจแล้วเดินพุ่งตรงสู่ประตู", "seme": 2, "uke": 1 },
          { "id": "D", "text": "เต้น Brazilian Dance ให้ทุกคนงงจนหลบหลีกเปิดทางให้เอง", "seme": 3, "uke": 0 }
        ]
      },
      {
        "id": 9,
        "question": "ถ้าคนที่ชอบบอกว่า \"หิว\" คุณจะพูดว่า...",
        "choices": [
          { "id": "A", "text": "อ้อนกลับ 'เค้าก็หิวเหมือนกัน ทำอะไรให้กินหน่อยสิ'", "seme": 0, "uke": 3 },
          { "id": "B", "text": "ส่งมีมรูปของกินกวน ๆ หรือบอก 'ไปหาอะไรกินกันนน'", "seme": 1, "uke": 2 },
          { "id": "C", "text": "ถามด้วยความใส่ใจ 'อยากกินอะไรเป็นพิเศษไหม? เดี๋ยวเค้าพาไปกินนะ'", "seme": 2, "uke": 1 },
          { "id": "D", "text": "บอก 'อยู่เฉย ๆ เลย เดี๋ยวสั่งของโปรดส่งตรงไปให้ที่บ้านเดี๋ยวนี้'", "seme": 3, "uke": 0 }
        ]
      },
      {
        "id": 10,
        "question": "ถ้าโลกกำลังจะแตกในอีก 10 นาที จะทำอะไร",
        "choices": [
          { "id": "A", "text": "เปิดเพลงที่ชอบฟัง แล้วนอนกอดตุ๊กตาตัวโปรดเงียบ ๆ รอเวลา", "seme": 0, "uke": 3 },
          { "id": "B", "text": "โทรหาครอบครัวหรือเพื่อนสนิท เพื่อบอกลากันเป็นครั้งสุดท้าย", "seme": 1, "uke": 2 },
          { "id": "C", "text": "หาของอร่อยกินประชดโลกไปเลย ถือว่าใช้ชีวิตคุ้มแล้ว", "seme": 2, "uke": 1 },
          { "id": "D", "text": "รีบเดินทางไปหาคนที่ชอบ เพื่อใช้ 10 นาทีสุดท้ายเคียงข้างกัน", "seme": 3, "uke": 0 }
        ]
      },
      {
        "id": 11,
        "question": "เมื่อเดินสะดุดขาตัวเองล้มต่อหน้าคนที่ชอบ คุณจะ...",
        "choices": [
          { "id": "A", "text": "เขินจนหน้าแดง ทำตัวไม่ถูก รีบลุกขึ้นแล้วเดินไปทางอื่น", "seme": 0, "uke": 3 },
          { "id": "B", "text": "รีบลุกขึ้นมาปัดฝุ่นกลบเกลื่อนความอาย 'แฮะ ๆ ไม่เจ็บหรอก สบายมาก'", "seme": 1, "uke": 2 },
          { "id": "C", "text": "เงยหน้าขึ้นมาหยอดมีมขำ ๆ 'พื้นตรงนี้มันอยากกอดเราน่ะ'", "seme": 2, "uke": 1 },
          { "id": "D", "text": "รีบเด้งตัวลุกขึ้นยืนตรงอย่างมั่นใจ 'ไม่มีอะไรเกิดขึ้นทั้งนั้นล่ะ!'", "seme": 3, "uke": 0 }
        ]
      },
      {
        "id": 12,
        "question": "เมื่อต้องเดินกลับบ้านกับเพื่อนท่ามกลางฝนตกหนัก แต่มีร่มอยู่แค่คันเดียว คุณจะ...",
        "choices": [
          { "id": "A", "text": "เนียนมุดเข้าไปเบียดในร่มคันเดียวกัน ยิ้มแห้ง ๆ แล้วบอก 'แบ่งกันบังหน่อยนะเพื่อน'", "seme": 0, "uke": 3 },
          { "id": "B", "text": "ส่งร่มให้เพื่อนเป็นคนถือ ส่วนเราคอยเดินขนาบข้าง ๆ", "seme": 1, "uke": 2 },
          { "id": "C", "text": "วิ่งลุยฝนนำหน้าไปก่อน", "seme": 2, "uke": 1 },
          { "id": "D", "text": "อาสาเป็นคนถือร่มให้ พยายามถือให้ไม่โดนฝนกันทั้งคู่", "seme": 3, "uke": 0 }
        ]
      },
      {
        "id": 13,
        "question": "ถ้าโดนทักว่า \"ช่วงนี้อ้วนขึ้นป่ะเนี่ย\" จะตอบว่า...",
        "choices": [
          { "id": "A", "text": "เอามือจับแก้มตัวเองทำหน้ามุ่ยงอนตุ๊บป่อง 'จริงเหรอ... งั้นต่อไปไม่คุยด้วยละ!'", "seme": 0, "uke": 3 },
          { "id": "B", "text": "บ่น 'จริงเหรอ... เสียใจนะเนี่ย พรุ่งนี้ค่อยเริ่มลดละกัน'", "seme": 1, "uke": 2 },
          { "id": "C", "text": "ตอบ 'เขาเรียกว่ามีน้ำมีนวลต่างหากล่ะ'", "seme": 2, "uke": 1 },
          { "id": "D", "text": "หัวเราะ 'อ้วนขึ้นแล้วไง มีตังค์กินซะอย่าง เดี๋ยวเลี้ยงชาบูแกด้วยเลยเอาป่ะ?'", "seme": 3, "uke": 0 }
        ]
      },
      {
        "id": 14,
        "question": "เมื่อมีคนมาจีบคนที่คุณชอบต่อหน้าต่อตา คุณจะ...",
        "choices": [
          { "id": "A", "text": "ทำหน้างอนตุ๊บป่อง ยืนกอดอกฟึดฟัดในใจแบบไม่พอใจเงียบ ๆ", "seme": 0, "uke": 3 },
          { "id": "B", "text": "ขยับเข้าไปยืนใกล้ ๆ เพื่อแสดงตัวว่าเรามาด้วยกัน", "seme": 1, "uke": 2 },
          { "id": "C", "text": "สะกิดถามคนของเราเสียงดังนิดนึง 'คนนี้ใครเหรอเธอ? รู้จักด้วยเหรอ?'", "seme": 2, "uke": 1 },
          { "id": "D", "text": "เดินเข้าไปโอบเอวหรือโอบไหล่คนของเราทันที 'ขอโทษทีครับ พอดีคนนี้มีเจ้าของแล้ว'", "seme": 3, "uke": 0 }
        ]
      },
      {
        "id": 15,
        "question": "เมื่ออยู่กับเพื่อน แล้วจู่ ๆ ไฟดับมืดสนิท คุณจะ...",
        "choices": [
          { "id": "A", "text": "ตกใจ แล้วคว้าแขนคนข้าง ๆ ไว้ก่อน", "seme": 0, "uke": 3 },
          { "id": "B", "text": "ใจหายวาบแต่พยายามตั้งสติ พึมพำเรียกชื่ออีกฝ่ายเบา ๆ แก้กลัว", "seme": 1, "uke": 2 },
          { "id": "C", "text": "ควานหาโทรศัพท์เปิดแฟลชแล้วหันไปถามอีกฝ่าย 'เป็นอะไรไหม?'", "seme": 2, "uke": 1 },
          { "id": "D", "text": "เอื้อมมือไปจับแล้วบอก 'ไม่ต้องกลัว เดี๋ยวมันก็ติด'", "seme": 3, "uke": 0 }
        ]
      },
      {
        "id": 16,
        "question": "เวลานั่งดูหนังผีฉากตุ้งแช่ (Jump Scare) คุณจะ...",
        "choices": [
          { "id": "A", "text": "สะดุ้งกรีดร้องลั่น เอาหมอนอุดหน้าไม่กล้ามองต่อ", "seme": 0, "uke": 3 },
          { "id": "B", "text": "สะดุ้งสุดตัวแล้วทำเป็นจกป็อปคอร์น", "seme": 1, "uke": 2 },
          { "id": "C", "text": "ตกใจนิดหน่อย แล้วบอก 'เชี่ย ผีหน้าตลกว่ะ'", "seme": 2, "uke": 1 },
          { "id": "D", "text": "เอามือไปบังตาคนข้าง ๆ", "seme": 3, "uke": 0 }
        ]
      },
      {
        "id": 17,
        "question": "เมื่อกำลังกินก๋วยเตี๋ยวอยู่ แล้วพบว่าคนที่ชอบนั่งอยู่โต๊ะข้าง ๆ คุณจะ...",
        "choices": [
          { "id": "A", "text": "เขินจนสำลักน้ำซุป ก้มหน้าก้มตาคีบเส้นกินแบบลนลานทำตัวไม่ถูก", "seme": 0, "uke": 3 },
          { "id": "B", "text": "ใจเต้นรัว แอบเนียนเหลือบมองเขาเป็นระยะ ๆ แต่ไม่กล้าเอ่ยปากทัก", "seme": 1, "uke": 2 },
          { "id": "C", "text": "เดินไปทักด้วยท่าทีปกติ 'อ้าว บังเอิญจัง! มากินร้านนี้เหมือนกันเหรอ'", "seme": 2, "uke": 1 },
          { "id": "D", "text": "แอบบอกเจ้าของร้านให้เช็คบิลรวมโต๊ะนั้นด้วยเงียบ ๆ เท่ ๆ", "seme": 3, "uke": 0 }
        ]
      },
      {
        "id": 18,
        "question": "ถ้าต้องไปสวนสนุก เครื่องเล่นอันไหนที่คุณจะเลือก?",
        "choices": [
          { "id": "A", "text": "บ้านผีสิง... แต่อยากมีใครสักคนให้เดินเกาะแขนหลับตาปี๋ไปด้วยกัน", "seme": 0, "uke": 3 },
          { "id": "B", "text": "ม้าหมุนฟรุ้งฟริ้ง ถ่ายรูปสวย ๆ น่ารัก ๆ กินสายไหมสบายใจ", "seme": 1, "uke": 2 },
          { "id": "C", "text": "ล่องแก่งหรือเครื่องเล่นปานกลาง พอให้ตื่นเต้นเสียวท้องน้อยขำ ๆ", "seme": 2, "uke": 1 },
          { "id": "D", "text": "รถไฟเหาะตีลังกาความเร็วสูงงงง ง ง งงง ง", "seme": 3, "uke": 0 }
        ]
      },
      {
        "id": 19,
        "question": "ถ้าคนที่ชอบส่งรูปตัวเองมาให้ดู คุณจะ...",
        "choices": [
          { "id": "A", "text": "กดหัวใจแล้วเขินอยู่คนเดียว", "seme": 0, "uke": 3 },
          { "id": "B", "text": "พิมพ์ถามกลับแก้เขิน 'ส่งมาทำไมเนี่ย... แอบชอบเราเหรอ?'", "seme": 1, "uke": 2 },
          { "id": "C", "text": "เขินแป๊บนึง แล้วถ่ายรูปตัวเองส่งกลับ", "seme": 2, "uke": 1 },
          { "id": "D", "text": "เขินเก็บทรง แล้วตอบทันทีว่า \"คนในรูปน่ารักจัง\"", "seme": 3, "uke": 0 }
        ]
      },
      {
        "id": 20,
        "question": "เมื่อมีคนเปิดประตูห้องน้ำมาเจอคุณกำลังอาบน้ำอยู่ (และไม่ได้ล็อกประตู) คุณจะ...",
        "choices": [
          { "id": "A", "text": "กรี๊ดลั่นพร้อมคว้าอะไรใกล้ตัวมาปิดตัวไว้ หน้าแดงแจ๋", "seme": 0, "uke": 3 },
          { "id": "B", "text": "สะดุ้งโหยงแล้วคว้าฝักบัวฉีดน้ำใส่หน้าผู้บุกรุกแก้เขินทันที!", "seme": 1, "uke": 2 },
          { "id": "C", "text": "ตะโกนวีนใส่ทันที 'เฮ้ย! ไม่มีตามารยาทหรือไง ปิดประตูเซ่!'", "seme": 2, "uke": 1 },
          { "id": "D", "text": "เสยผมเปียกน้ำ ส่งสายตาเจ้าชู้สุดแพรวพราว 'จะเข้ามาอาบน้ำด้วยกันเลยไหมล่ะ?'", "seme": 3, "uke": 0 }
        ]
      }
    ];
    results = [
      { "min": 0, "max": 30, "title": "🌸 เคะตัวแม่", "description": "เอ็งเกิดมาเพื่อถูกตามใจ" },
      { "min": 31, "max": 45, "title": "🩷 เคะ", "description": "ชอบให้คนอื่นเป็นฝ่ายเริ่มมากกว่า" },
      { "min": 46, "max": 54, "title": "⚖️ สลับโพ", "description": "วันนี้เมะ พรุ่งนี้เคะ แล้วแต่อารมณ์" },
      { "min": 55, "max": 69, "title": "💙 เมะ", "description": "มักเป็นฝ่ายนำและดูแลคนอื่น" },
      { "min": 80, "max": 100, "title": "🔥 เมะตัวพ่อ", "description": "เดี๋ยวข้าจัดการเอง" }
    ];
    songs = [
      {
        "id": 1,
        "url": '<iframe width="560" height="315" src="https://www.youtube.com/embed/g3RrDbY7FEk?si=GO8JV2oORGf0F2gg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        "title": "Ponytail to Shushu",
        "artist": "BNK48",
        "artist-cover-url": "images/BNK48_PonytailToShushu.webp"
      },
      {
        "id": 2,
        "url": '<iframe width="560" height="315" src="https://www.youtube.com/embed/HpQ9B13uv0w?si=zswoTGo6J4grw4i_" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        "title": "Sky Lantern Wish",
        "artist": "BNK48",
        "artist-cover-url": "images/BNK48_SkyLanternWish.jpg"
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
  const miniPlayBtn = document.getElementById('mini-play-btn');
  if (miniPlayBtn) {
    miniPlayBtn.addEventListener('click', () => {
      if (!ytPlayer) return;
      try {
        const state = ytPlayer.getPlayerState();
        if (state === 1) { // PLAYING
          ytPlayer.pauseVideo();
        } else {
          ytPlayer.playVideo();
        }
      } catch (e) {
        console.error("Mini player error:", e);
      }
    });
  }

  const prevSongBtn = document.getElementById('prev-song-btn');
  if (prevSongBtn) {
    prevSongBtn.addEventListener('click', () => {
      if (songs.length === 0) return;
      const newIndex = (currentSongIndex - 1 + songs.length) % songs.length;
      loadAndPlaySong(newIndex);
    });
  }

  const nextSongBtn = document.getElementById('next-song-btn');
  if (nextSongBtn) {
    nextSongBtn.addEventListener('click', () => {
      if (songs.length === 0) return;
      const newIndex = (currentSongIndex + 1) % songs.length;
      loadAndPlaySong(newIndex);
    });
  }

  const videoOverlay = document.querySelector('.video-overlay');
  if (videoOverlay) {
    videoOverlay.addEventListener('click', redirectToYoutube);
    videoOverlay.style.cursor = 'pointer';
  }

  const songCover = document.getElementById('song-cover');
  if (songCover) {
    songCover.addEventListener('click', redirectToYoutube);
    songCover.style.cursor = 'pointer';
  }
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

// Helper to update mini player controls state
function updateMiniPlayerState(state) {
  const miniPlayBtn = document.getElementById('mini-play-btn');
  if (!miniPlayBtn) return;
  const playIcon = miniPlayBtn.querySelector('.play-icon');
  const pauseIcon = miniPlayBtn.querySelector('.pause-icon');

  if (state === 1) { // PLAYING
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
  } else {
    // PAUSED, ENDED, CUED, UNSTARTED, etc.
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
  }
}

// Helper to load and play a song by its index
function loadAndPlaySong(index, shouldAutoplay = true) {
  if (songs.length === 0) return;
  currentSongIndex = index;
  selectedSong = songs[currentSongIndex];
  if (!selectedSong) return;

  const videoId = extractVideoId(selectedSong.url) || 'g3RrDbY7FEk';

  // Populate song info card details
  const songCover = document.getElementById('song-cover');
  const songTitle = document.getElementById('song-title');
  const songArtist = document.getElementById('song-artist');
  if (songCover) {
    songCover.src = selectedSong['artist-cover-url'] || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    songCover.alt = selectedSong.title || 'Cover';
  }
  if (songTitle) songTitle.innerText = selectedSong.title || '';
  if (songArtist) songArtist.innerText = selectedSong.artist || '';

  // Destroy previous player state if it exists
  if (ytPlayer) {
    try {
      ytPlayer.destroy();
      ytPlayer = null;
    } catch (e) {
      console.error("Error destroying YT player:", e);
    }
  }

  updateMiniPlayerState(-1); // Reset play icon

  // Initialize YT Player
  if (ytApiReady) {
    try {
      ytPlayer = new YT.Player('yt-player', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          'autoplay': shouldAutoplay ? 1 : 0,
          'playsinline': 1,
          'controls': 1,
          'rel': 0,
          'modestbranding': 1
        },
        events: {
          'onReady': (event) => {
            if (shouldAutoplay) {
              event.target.playVideo();
            }
          },
          'onStateChange': (event) => {
            updateMiniPlayerState(event.data);
          }
        }
      });
    } catch (e) {
      console.error("YT Player init error:", e);
    }
  } else {
    // API not ready yet — will load player when ready
    window.onYouTubeIframeAPIReady = function () {
      ytApiReady = true;
      try {
        ytPlayer = new YT.Player('yt-player', {
          height: '100%',
          width: '100%',
          videoId: videoId,
          playerVars: {
            'autoplay': shouldAutoplay ? 1 : 0,
            'playsinline': 1,
            'controls': 1,
            'rel': 0,
            'modestbranding': 1
          },
          events: {
            'onReady': (event) => {
              if (shouldAutoplay) {
                event.target.playVideo();
              }
            },
            'onStateChange': (event) => {
              updateMiniPlayerState(event.data);
            }
          }
        });
      } catch (e) { console.error(e); }
    };
  }
}

// Clear timers and video player state
function clearPlaybackState() {
  if (playTimerInterval) {
    clearInterval(playTimerInterval);
    playTimerInterval = null;
  }
  updateMiniPlayerState(-1); // Reset play icon
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

  // Reset container width and layout transition classes
  document.querySelector('.app-container').classList.remove('expanded');
  document.getElementById('result-layout').classList.remove('show-results-layout');

  // Load a random song but DO NOT autoplay
  const randIndex = Math.floor(Math.random() * songs.length);
  loadAndPlaySong(randIndex, false);

  // Hide songInfoCard (miniplayer) completely during loading
  const songInfoCard = document.getElementById('song-info-card');
  if (songInfoCard) {
    songInfoCard.style.display = 'none';
  }

  // Hide the video-overlay to allow direct click interaction on the YouTube player iframe
  const videoOverlay = document.querySelector('.video-overlay');
  if (videoOverlay) {
    videoOverlay.style.display = 'none';
  }

  document.getElementById('result-loading-header').style.display = 'block';
  document.getElementById('result-loading-status').style.display = 'block';

  const loadingMessage = document.getElementById('loading-message');
  const progressContainer = document.getElementById('video-progress-container');
  const progressFill = document.getElementById('video-progress-fill');

  loadingMessage.innerText = "กำลังคำนวณและวิเคราะห์จิตวิทยาความเป็นคุณ... 🔮";
  progressContainer.style.display = 'block';
  progressFill.style.width = '0%';
  progressFill.style.transition = 'width 0.1s linear'; // Make width animation smooth at 100ms intervals
  skipContainer.style.display = 'none';
  playTimeCounter = 0;

  if (playTimerInterval) clearInterval(playTimerInterval);
  playTimerInterval = null;

  // Progress countdown timer — only advances when video is actively playing!
  const targetSeconds = 8.0;
  playTimerInterval = setInterval(() => {
    let isPlaying = false;
    if (ytPlayer) {
      try {
        isPlaying = (ytPlayer.getPlayerState() === 1); // 1 = PLAYING
      } catch (e) {
        // Player might not be ready yet
      }
    }

    if (isPlaying) {
      playTimeCounter = Math.round((playTimeCounter + 0.1) * 10) / 10;

      // Calculate dynamic progress bar percentage with double suspense curve
      let percent = 0;
      if (playTimeCounter <= 5.0) {
        // Phase 1: Smoothly runs to 75% over 5 seconds
        percent = (playTimeCounter / 5.0) * 75;
      } else if (playTimeCounter <= 5.5) {
        // Phase 2: First pause at 5s (keeps 75% for 0.5s)
        percent = 75;
      } else if (playTimeCounter <= 6.0) {
        // Phase 3: Move during 5.5s - 6.0s (from 75% to 85%)
        percent = 75 + ((playTimeCounter - 5.5) / 0.5) * 10;
      } else if (playTimeCounter <= 7.0) {
        // Phase 4: Second pause at 6s (keeps 85% for 1.0s)
        percent = 85;
      } else {
        // Phase 5: Smooth run from 7s to 8s (from 85% to 100%)
        percent = 85 + ((playTimeCounter - 7.0) / 1.0) * 15;
      }

      percent = Math.min(percent, 100);
      progressFill.style.width = `${percent}%`;
      loadingMessage.innerText = `กำลังคำนวณและวิเคราะห์จิตวิทยาความเป็นคุณ... ✨`;

      if (playTimeCounter >= targetSeconds) {
        clearInterval(playTimerInterval);
        playTimerInterval = null;
        showResults();
      }
    } else {
      // Pause progress and ask user to play music
      loadingMessage.innerText = `กรุณาเล่นเพลงด้านบน เพื่อเริ่มวิเคราะห์ผลลัพธ์... 🎵`;
    }
  }, 100);
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
  const semePercentageRounded = Math.round(semePercentage);
  const matchedResult = results.find(res => semePercentageRounded >= res.min && semePercentageRounded <= res.max) || results[2];
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
  resultDescriptionEl.innerHTML = matchedResult.description;

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

  // Reveal miniplayer card (song-info-card) on the results screen
  const songInfoCard = document.getElementById('song-info-card');
  if (songInfoCard) {
    songInfoCard.style.display = 'flex';
  }

  // Restore the video-overlay to lock direct interaction on the iframe
  const videoOverlay = document.querySelector('.video-overlay');
  if (videoOverlay) {
    videoOverlay.style.display = 'block';
  }

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
    // 1. Draw solid background color matching the webpage
    ctx.fillStyle = '#c5d8ed';
    ctx.fillRect(0, 0, 1080, 1920);

    // 2. Soft glow spots matching body::before and body::after
    // Seme Blue Light (#9cb5d1) Glow on Top-Left
    const glow1 = ctx.createRadialGradient(150, 350, 0, 150, 350, 600);
    glow1.addColorStop(0, 'rgba(156, 181, 209, 0.5)');
    glow1.addColorStop(1, 'rgba(156, 181, 209, 0)');
    ctx.fillStyle = glow1;
    ctx.beginPath();
    ctx.arc(150, 350, 600, 0, Math.PI * 2);
    ctx.fill();

    // Uke Pink Light (#f08daf) Glow on Bottom-Right
    const glow2 = ctx.createRadialGradient(930, 1570, 0, 930, 1570, 600);
    glow2.addColorStop(0, 'rgba(240, 141, 175, 0.5)');
    glow2.addColorStop(1, 'rgba(240, 141, 175, 0)');
    ctx.fillStyle = glow2;
    ctx.beginPath();
    ctx.arc(930, 1570, 600, 0, Math.PI * 2);
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

    // 3. Main white card (representing results-card container)
    drawRoundRect(90, 300, 900, 1320, 60, '#FFFFFF', {
      color: 'rgba(15, 23, 42, 0.08)', blur: 50, ox: 0, oy: 20
    });

    // 4. Branding Header at the top of the card
    ctx.fillStyle = '#52608c'; // var(--color-text-muted)
    ctx.font = `700 28px ${FONT_TITLE}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SEME or UKE QUIZ', 540, 390);

    ctx.fillStyle = '#2d395e'; // var(--color-text-main)
    ctx.font = `700 38px ${FONT_TITLE}`;
    ctx.fillText('แบบทดสอบตัวตนของคุณ', 540, 450);

    // Divider line inside the card
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.08)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(180, 500);
    ctx.lineTo(900, 500);
    ctx.stroke();

    // 5. Result title (e.g. 🩷 เคะ)
    ctx.fillStyle = '#2d395e'; // var(--color-text-main)
    ctx.font = `700 68px ${FONT_TITLE}`;
    ctx.fillText(globalMatchedResult.title, 540, 590);

    // Helper to calculate description lines count
    const getLinesCount = (text, maxWidth) => {
      let processedText = text.replace(/<p>/gi, '').replace(/<\/p>/gi, '<br>');
      if (processedText.endsWith('<br>')) {
        processedText = processedText.slice(0, -4);
      }
      if (processedText.endsWith('<br>"')) {
        processedText = processedText.slice(0, -5) + '"';
      }

      const paragraphs = processedText.split('<br>');
      let linesCount = 0;
      paragraphs.forEach((paragraph, index) => {
        const cleanParagraph = paragraph.replace(/<\/?[^>]+(>|$)/g, "");
        const chars = cleanParagraph.split('');
        let line = '';
        for (let n = 0; n < chars.length; n++) {
          const testLine = line + chars[n];
          if (ctx.measureText(testLine).width > maxWidth && n > 0) {
            linesCount++;
            line = chars[n];
          } else {
            line = testLine;
          }
        }
        linesCount++;
        if (index < paragraphs.length - 1) {
          linesCount++; // Paragraph spacer (empty line)
        }
      });
      return linesCount;
    };

    // Calculate box height dynamically based on description lines count
    ctx.font = `600 32px ${FONT_TITLE}`;
    const descText = `"${globalMatchedResult.description}"`;
    const linesCount = getLinesCount(descText, 700);
    const boxHeight = 170 + (linesCount * 52); // 130px header height + lines + 40px bottom padding

    // 6. Description Box (representing result-description-card)
    drawRoundRect(140, 660, 800, boxHeight, 24, '#f7f6fb'); // var(--color-bg-base)

    // "คำวิเคราะห์ตัวตน" label inside the description card
    ctx.fillStyle = '#52608c'; // var(--color-text-muted)
    ctx.font = `700 24px ${FONT_TITLE}`;
    ctx.fillText('คำวิเคราะห์ตัวตน', 540, 720);

    // Description text (with wrap)
    ctx.fillStyle = '#2d395e'; // var(--color-text-main)
    ctx.font = `600 32px ${FONT_TITLE}`;
    const wrapText = (text, x, y, maxWidth, lineHeight) => {
      let processedText = text.replace(/<p>/gi, '').replace(/<\/p>/gi, '<br>');
      if (processedText.endsWith('<br>')) {
        processedText = processedText.slice(0, -4);
      }
      if (processedText.endsWith('<br>"')) {
        processedText = processedText.slice(0, -5) + '"';
      }

      const paragraphs = processedText.split('<br>');
      let currentY = y;
      paragraphs.forEach((paragraph) => {
        const cleanParagraph = paragraph.replace(/<\/?[^>]+(>|$)/g, "");
        const chars = cleanParagraph.split('');
        let line = '';
        for (let n = 0; n < chars.length; n++) {
          const testLine = line + chars[n];
          if (ctx.measureText(testLine).width > maxWidth && n > 0) {
            ctx.fillText(line, x, currentY);
            line = chars[n];
            currentY += lineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, x, currentY);
        currentY += lineHeight;
      });
    };
    wrapText(descText, 540, 790, 700, 52);

    // 7. Seme/Uke percentage bar section
    const semeVal = Math.round(globalSemePercent);
    const ukeVal = 100 - semeVal;

    // Shift the Seme/Uke section dynamically down based on the box height
    const boxEnd = 660 + boxHeight;
    const y_meter = boxEnd + 40;

    // Seme Label (Left)
    ctx.textAlign = 'left';
    ctx.fillStyle = '#265199'; // var(--color-seme-dark)
    ctx.font = `700 28px ${FONT_TITLE}`;
    ctx.fillText('♂ เมะ (Seme)', 140, y_meter + 30);

    // Uke Label (Right)
    ctx.textAlign = 'right';
    ctx.fillStyle = '#d44e7c'; // var(--color-uke-dark)
    ctx.fillText('♀ เคะ (Uke)', 940, y_meter + 30);

    // Bar background (Pink: var(--color-uke))
    ctx.textAlign = 'center';
    drawRoundRect(140, y_meter + 60, 800, 28, 14, '#f08daf');

    // Bar foreground (Blue: var(--color-seme))
    const semeWidth = Math.max((semeVal / 100) * 800, 15);
    drawRoundRect(140, y_meter + 60, semeWidth, 28, 14, '#9cb5d1');

    // Percentage ticks below the bar
    ctx.textAlign = 'left';
    ctx.fillStyle = '#52608c'; // var(--color-text-muted)
    ctx.font = `700 24px ${FONT_TITLE}`;
    ctx.fillText(`เมะ (Seme): ${semeVal}%`, 140, y_meter + 130);

    ctx.textAlign = 'right';
    ctx.fillText(`เคะ (Uke): ${ukeVal}%`, 940, y_meter + 130);

    // 8. Sharing URL Link at the bottom of the card
    ctx.textAlign = 'center';
    ctx.fillStyle = '#52608c';
    ctx.font = `600 22px ${FONT_TITLE}`;
    const playDomain = window.location.host || 'positiontest.thebeus.com';
    ctx.fillText(`เล่นได้ที่: ${playDomain}`, 540, 1530);

    // 9. Footer (outside the white card)
    ctx.fillStyle = '#52608c';
    ctx.font = `600 26px ${FONT_TITLE}`;
    ctx.fillText('Seme & Uke Personality Test © 2026', 540, 1820);

    // 10. Trigger Download
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

// Redirect to YouTube dynamically based on current song
function redirectToYoutube() {
  const isResultsVisible = document.getElementById('result-layout').classList.contains('show-results-layout');
  if (!isResultsVisible) return;

  if (selectedSong) {
    const videoId = extractVideoId(selectedSong.url) || 'g3RrDbY7FEk';
    const youtubeUrl = `https://youtu.be/${videoId}?si=Jku4RhPVZH2Vt3CV`;
    window.open(youtubeUrl, '_blank');
  }
}

// Run app init
document.addEventListener('DOMContentLoaded', init);
export default {};
