<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]

<!-- LANGUAGE SELECTOR -->
<div align="center">
  <a href="#english">English</a> | <a href="#thai">ภาษาไทย</a>
</div>

<hr />

<a id="english"></a>
<!-- PROJECT LOGO (ENGLISH) -->
<br />
<div align="center">
  <h3 align="center">Seme or Uke Quiz</h3>
  <p align="center">
    A cute and playful position personality test website
    <br />
    <strong>My first vibecoding mini project</strong>
    <br />
    <a href="https://github.com/nuannim/Seme-or-Uke-Quiz">Explore the docs »</a>
    &middot;
    <a href="https://github.com/nuannim/Seme-or-Uke-Quiz/issues/new?labels=bug">Report Bug</a>
    &middot;
    <a href="https://github.com/nuannim/Seme-or-Uke-Quiz/issues/new?labels=enhancement">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS (ENGLISH) -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

A cute, playful position personality test website designed to determine if you are a **"Seme" (Top/Giver)** or an **"Uke" (Bottom/Receiver)**. Inspired by classic position tests, users answer 20 psychological and behavioral questions to analyze their personality, accompanied by charming background music during result calculation.

### Key Features:
* **20 Psychological Questions**: Fun, engaging questions with choices mapped to Seme or Uke points.
* **Music & Analysis Screen**: Requires users to play a YouTube embedded song which serves as a soundtrack during progress bar calculation.
* **Canvas Story Share Generator**: Client-side vertical (9:16) image generator that renders results in high resolution (1080x1920 px) ready to share on Instagram or Facebook Stories.
* **Aesthetic Ponytail to Shushu Theme**: Pastel color scheme and animated polka dot background, fully responsive on smartphones.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* HTML5 / CSS3
* Vanilla JavaScript
* [Vite](https://vite.dev/)
* [YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference)
* Canvas API

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* npm (comes with Node.js)
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/nuannim/Seme-or-Uke-Quiz.git
   ```
2. Install npm packages:
   ```sh
   npm install
   ```
3. Run the development server:
   ```sh
   npm run dev
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage

1. **Enter Website**: Read the soft disclaimer message and click "เริ่มทำแบบทดสอบกันเลย" (Start Quiz).
2. **Answer Questions**: Complete the 20 multiple-choice questions (A, B, C).
3. **Song Playback & Analysis**: Play the randomized YouTube embed to start result calculation (progress bar ticks up to 100%).
4. **View Results**: 
   - View your matched category (🌸 เคะตัวแม่, 🩷 เคะ, ⚖️ สลับโพ, 💙 เมะ, 🔥 เมะตัวพ่อ) with description and percentage gauges.
   - Click **บันทึกรูปภาพ** (Save Image) to generate and download a 1080x1920 vertical card layout for story posts.
   - Click **คัดลอกลิงก์ผลลัพธ์** (Copy Result Link) to copy shareable text to clipboard.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

- [x] Design pastel layouts and matching vector bubble icons
- [x] Write 20 quiz questions with mapped choices
- [x] Build YouTube Player API integration and progress analysis logic
- [x] Build Canvas API client-side Story Image generator
- [x] Ensure smartphone responsive view width and height bounds
- [x] Clear JSON cache dynamically upon loading to ensure fresh assets

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Project Link: [https://github.com/nuannim/Seme-or-Uke-Quiz](https://github.com/nuannim/Seme-or-Uke-Quiz)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Vite.js](https://vite.dev/)
* [YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference)
* [Google Fonts](https://fonts.google.com/) (Google Sans, IBM Plex Sans Thai, Mitr, Noto Sans Thai, Poppins)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<hr />

<a id="thai"></a>
<!-- PROJECT LOGO (THAI) -->
<br />
<div align="center">
  <h3 align="center">แบบทดสอบ Seme or Uke Quiz</h3>
  <p align="center">
    แบบทดสอบ เมะ หรือ เคะ? | เว็บไซต์วัดผลระดับโพซิชั่นสำหรับคุณแบบน่ารัก ๆ
    <br />
    <strong>โปรเจกต์มินิ Vibecoding ชิ้นแรกของฉัน (My first vibecoding mini project)</strong>
    <br />
    <a href="https://github.com/nuannim/Seme-or-Uke-Quiz">สำรวจคู่มือการใช้งาน »</a>
    &middot;
    <a href="https://github.com/nuannim/Seme-or-Uke-Quiz/issues/new?labels=bug">รายงานบั๊ก</a>
    &middot;
    <a href="https://github.com/nuannim/Seme-or-Uke-Quiz/issues/new?labels=enhancement">ขอฟีเจอร์เพิ่มเติม</a>
  </p>
</div>

<!-- TABLE OF CONTENTS (THAI) -->
<details>
  <summary>สารบัญ</summary>
  <ol>
    <li>
      <a href="#เกี่ยวกับโปรเจกต์">เกี่ยวกับโปรเจกต์</a>
      <ul>
        <li><a href="#เทคโนโลยีที่ใช้">เทคโนโลยีที่ใช้</a></li>
      </ul>
    </li>
    <li>
      <a href="#การเริ่มต้นใช้งาน">การเริ่มต้นใช้งาน</a>
      <ul>
        <li><a href="#สิ่งจำเป็นก่อนเริ่มติดตั้ง">สิ่งจำเป็นก่อนเริ่มติดตั้ง</a></li>
        <li><a href="#ขั้นตอนการติดตั้ง">ขั้นตอนการติดตั้ง</a></li>
      </ul>
    </li>
    <li><a href="#วิธีการเล่น">วิธีการเล่น</a></li>
    <li><a href="#โรดแมป">โรดแมป</a></li>
    <li><a href="#ช่องทางการติดต่อ">ช่องทางการติดต่อ</a></li>
    <li><a href="#กิตติกรรมประกาศ">กิตติกรรมประกาศ</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT (THAI) -->
<a id="เกี่ยวกับโปรเจกต์"></a>
## เกี่ยวกับโปรเจกต์

แบบทดสอบบุคลิกภาพแบบน่ารัก ๆ ไม่ซีเรียส เพื่อวัดระดับความเป็น **"เมะ (รุก)"** หรือ **"เคะ (รับ)"** โดยได้แรงบันดาลใจมาจากเว็บทดสอบตำแหน่งในตำนาน ผู้ใช้จะได้ตอบคำถามจิตวิทยาและพฤติกรรมในชีวิตประจำวัน 20 ข้อเพื่อวิเคราะห์โพซิชั่นของตนเอง พร้อมรับฟังเพลงน่ารัก ๆ ในระหว่างรอการคำนวณผลลัพธ์

### คุณสมบัติเด่นของโปรเจกต์:
* **20 คำถามวิเคราะห์ตัวตน**: คำถามสนุก ๆ กวน ๆ และมีตัวเลือกที่ตอบสนองต่อระดับคะแนนเมะ/เคะอย่างชัดเจน
* **ระบบเครื่องเล่นเพลงและวิเคราะห์ผล**: บังคับให้เล่นวิดีโอเพลงของ YouTube เพื่อเป็นซาวด์แทร็กในการประมวลผลด้วยเกจเปอร์เซ็นต์ที่สมจริง
* **บันทึกรูปภาพลง Story (9:16)**: เจนเนอเรตรูปภาพผลลัพธ์แบบแนวตั้งที่ออกแบบมาเป็นพิเศษสำหรับแชร์ลง Instagram หรือ Facebook Story โดยใช้ HTML5 Canvas API ทั้งหมดผ่านฝั่งไคลเอนต์
* **ดีไซน์น่ารัก สไตล์ Ponytail to Shushu**: ชุดสีพาสเทลและพื้นหลังลายจุด (Polka Dot) ที่เป็นมิตรและตอบสนองได้ดีบนสมาร์ทโฟน

<p align="right">(<a href="#readme-top">กลับสู่ด้านบน</a>)</p>

<a id="เทคโนโลยีที่ใช้"></a>
### เทคโนโลยีที่ใช้

* HTML5 / CSS3
* Vanilla JavaScript
* [Vite](https://vite.dev/)
* [YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference)
* Canvas API

<p align="right">(<a href="#readme-top">กลับสู่ด้านบน</a>)</p>

<!-- GETTING STARTED (THAI) -->
<a id="การเริ่มต้นใช้งาน"></a>
## การเริ่มต้นใช้งาน

ทำตามขั้นตอนด้านล่างเพื่อรันและทดสอบโปรเจกต์บนเครื่องของคุณเอง

<a id="สิ่งจำเป็นก่อนเริ่มติดตั้ง"></a>
### สิ่งจำเป็นก่อนเริ่มติดตั้ง

* npm (มาพร้อมกับ Node.js)
  ```sh
  npm install npm@latest -g
  ```

<a id="ขั้นตอนการติดตั้ง"></a>
### ขั้นตอนการติดตั้ง

1. โคลนรีโพสิทอรี
   ```sh
   git clone https://github.com/nuannim/Seme-or-Uke-Quiz.git
   ```
2. ติดตั้งแพ็กเกจ
   ```sh
   npm install
   ```
3. รันโปรเจกต์ในโหมดพัฒนา (Development Mode)
   ```sh
   npm run dev
   ```

<p align="right">(<a href="#readme-top">กลับสู่ด้านบน</a>)</p>

<!-- USAGE EXAMPLES (THAI) -->
<a id="วิธีการเล่น"></a>
## วิธีการเล่น

1. **เข้าสู่เว็บไซต์**: อ่านคำชี้แจงและกดปุ่ม "เริ่มทำแบบทดสอบกันเลย"
2. **ตอบคำถาม**: ตอบคำถามทั้งหมด 20 ข้อ โดยระบบจะเก็บคะแนนสะสม เมะ (Seme) และ เคะ (Uke) ตามตัวเลือกที่เลือก
3. **หน้าเล่นเพลงเพื่อวิเคราะห์**: เมื่อทำครบ ระบบจะสุ่มเพลงขึ้นมาและขอให้คุณกดปุ่มเล่นเพลงของ YouTube เพื่อเริ่มประมวลผลจนเต็ม 100%
4. **แสดงผลลัพธ์**:
   - ระบบจะระบุผลลัพธ์ (เช่น 🔥 เมะตัวพ่อ, 💙 เมะ, ⚖️ สลับโพ, 🩷 เคะ, 🌸 เคะตัวแม่) พร้อมคำอธิบายและเปอร์เซ็นต์โพซิชั่นของคุณ
   - ปุ่ม **บันทึกรูปภาพ** จะแปลงผลลัพธ์ของคุณเป็นรูปการ์ดแนวตั้งความละเอียดสูง ขนาด 1080x1920 พิกเซล เหมาะสำหรับแชร์ลงโซเชียลมีเดีย
   - ปุ่ม **คัดลอกลิงก์ผลลัพธ์** จะเซฟข้อความแชร์ลงคลิปบอร์ด

<p align="right">(<a href="#readme-top">กลับสู่ด้านบน</a>)</p>

<!-- ROADMAP (THAI) -->
<a id="โรดแมป"></a>
## โรดแมป

- [x] ออกแบบหน้าเว็บสไตล์พาสเทลและไอคอน
- [x] เพิ่มคำถามและชอยส์วิเคราะห์ 20 ข้อ
- [x] พัฒนาระบบนับเวลาและจำลองโหลดผลลัพธ์จากการเล่น YouTube Player
- [x] พัฒนาระบบแชร์และการเจนเนอเรตรูป Canvas ในรูปแบบ Story
- [x] รองรับการแสดงผลแบบ Responsive บนสมาร์ทโฟน
- [x] ล้างแคช JSON อัตโนมัติทุกครั้งที่เข้าหน้าเว็บเพื่ออัปเดตข้อมูลล่าสุด

<p align="right">(<a href="#readme-top">กลับสู่ด้านบน</a>)</p>

<!-- CONTACT (THAI) -->
<a id="ช่องทางการติดต่อ"></a>
## ช่องทางการติดต่อ

ลิงก์โปรเจกต์: [https://github.com/nuannim/Seme-or-Uke-Quiz](https://github.com/nuannim/Seme-or-Uke-Quiz)

<p align="right">(<a href="#readme-top">กลับสู่ด้านบน</a>)</p>

<!-- ACKNOWLEDGMENTS (THAI) -->
<a id="กิตติกรรมประกาศ"></a>
## กิตติกรรมประกาศ

* [Vite.js](https://vite.dev/)
* [YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference)
* [Google Fonts](https://fonts.google.com/) (Google Sans, IBM Plex Sans Thai, Mitr, Noto Sans Thai, Poppins)

<p align="right">(<a href="#readme-top">กลับสู่ด้านบน</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/nuannim/Seme-or-Uke-Quiz.svg?style=for-the-badge
[contributors-url]: https://github.com/nuannim/Seme-or-Uke-Quiz/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/nuannim/Seme-or-Uke-Quiz.svg?style=for-the-badge
[forks-url]: https://github.com/nuannim/Seme-or-Uke-Quiz/network/members
[stars-shield]: https://img.shields.io/github/stars/nuannim/Seme-or-Uke-Quiz.svg?style=for-the-badge
[stars-url]: https://github.com/nuannim/Seme-or-Uke-Quiz/stargazers
[issues-shield]: https://img.shields.io/github/issues/nuannim/Seme-or-Uke-Quiz.svg?style=for-the-badge
[issues-url]: https://github.com/nuannim/Seme-or-Uke-Quiz/issues