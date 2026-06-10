const imageBox = document.getElementById("imageBox");
const dogImage = document.getElementById("dogImage");
const loading = document.getElementById("loading");
const mainControls = document.getElementById("mainControls");
const newDogBtn = document.getElementById("newDogBtn");
const likeBtn = document.getElementById("likeBtn");
const downloadBtn = document.getElementById("downloadBtn");
const slideBtn = document.getElementById("slideBtn");
const endBtn = document.getElementById("endBtn");
const resetBtn = document.getElementById("resetBtn");
const dogCount = document.getElementById("dogCount");

const currentDate = document.getElementById("currentDate");
const currentTime = document.getElementById("currentTime");
const cameraName = document.getElementById("cameraName");

let count = 0;
let currentImageUrl = "";
let likedDogs = [];

let slideInterval = null;
let isSliding = false;

const cameras = [
  "CAM-01 거실",
  "CAM-02 주방",
  "CAM-03 마당",
  "CAM-04 소파",
  "CAM-05 침실",
  "CAM-06 베란다",
  "CAM-07 현관",
  "CAM-08 강아지방",
  "CAM-09 놀이터",
  "CAM-10 식탁"
];

const bgColors = [
  "#0f172a",
  "#111827",
  "#1e293b",
  "#0b1120",
  "#172554"
];

/* 실시간 시계 */

function updateClock() {

  const now = new Date();

  currentDate.textContent =
    now.getFullYear() + "-" +
    String(now.getMonth() + 1).padStart(2, "0") + "-" +
    String(now.getDate()).padStart(2, "0");

  currentTime.textContent =
    String(now.getHours()).padStart(2, "0") + ":" +
    String(now.getMinutes()).padStart(2, "0") + ":" +
    String(now.getSeconds()).padStart(2, "0");
}

setInterval(updateClock, 1000);
updateClock();

/* 카메라 변경 */

function changeCamera() {

  const random =
    Math.floor(Math.random() * cameras.length);

  cameraName.textContent =
    cameras[random];
}

/* 배경색 변경 */

function changeBackgroundColor() {

  const random =
    Math.floor(Math.random() * bgColors.length);

  document.body.style.backgroundColor =
    bgColors[random];
}

/* 적외선 모드 */

function randomNightVision() {

  const chance =
    Math.floor(Math.random() * 100);

  if (chance < 25) {
    dogImage.classList.add("night-vision");

    loading.textContent =
      "🌙 적외선 카메라 활성화";
  } else {
    dogImage.classList.remove("night-vision");
  }
}

/* 강아지 가져오기 */

async function getDogImage() {

  loading.textContent =
    "📡 카메라 연결 중...";

  likeBtn.disabled = true;
  downloadBtn.disabled = true;

  try {

    const response =
      await fetch(
        "https://dog.ceo/api/breeds/image/random"
      );

    const data =
      await response.json();

    currentImageUrl =
      data.message;

    dogImage.src =
      currentImageUrl;

    dogImage.onload = () => {

      count++;
      dogCount.textContent =
        count;

      likeBtn.disabled = false;
      downloadBtn.disabled = false;

      changeBackgroundColor();
      changeCamera();
      randomNightVision();

      if (
        !dogImage.classList.contains(
          "night-vision"
        )
      ) {
        loading.textContent =
          "🟢 LIVE 연결됨";
      }
    };

  } catch (error) {

    if (isSliding) {
      toggleSlideShow();
    }

    loading.textContent =
      "❌ 카메라 연결 실패";

    console.error(error);
  }
}

/* 저장 */

function toggleLike() {

  if (
    !likedDogs.includes(
      currentImageUrl
    )
  ) {

    likedDogs.push(
      currentImageUrl
    );

    loading.textContent =
      "📸 순간 저장 완료!";
  }
}

/* 다운로드 */

async function downloadImage() {

  try {

    loading.textContent =
      "💾 저장 중...";

    const response =
      await fetch(
        currentImageUrl
      );

    const blob =
      await response.blob();

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;
    a.download =
      `homecam-${Date.now()}.jpg`;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    loading.textContent =
      "💾 저장 완료!";

  } catch (error) {

    loading.textContent =
      "❌ 저장 실패";

    console.error(error);
  }
}

/* 순찰모드 */

function toggleSlideShow() {

  if (!isSliding) {

    isSliding = true;

    slideBtn.innerHTML =
      "⏸️";

    slideBtn.style.background =
      "#dc2626";

    slideInterval =
      setInterval(
        getDogImage,
        3000
      );

    loading.textContent =
      "🚨 순찰모드 작동 중";

  } else {

    isSliding = false;

    slideBtn.innerHTML =
      "▶️";

    slideBtn.style.background =
      "#1e293b";

    clearInterval(
      slideInterval
    );

    loading.textContent =
      "⏸️ 순찰모드 중지";
  }
}

/* 종료 */

function finishSession() {

  if (isSliding) {
    toggleSlideShow();
  }

  loading.innerHTML =
    `
    🏠 오늘의 관찰 종료<br>
    관찰 장면 : ${count}회<br>
    저장한 순간 : ${likedDogs.length}개
    `;

  if (
    likedDogs.length > 0
  ) {

    let html =
      '<div class="like-grid">';

    likedDogs.forEach(url => {

      html +=
        `<img src="${url}" alt="saved">`;

    });

    html += "</div>";

    imageBox.innerHTML =
      html;

  } else {

    imageBox.innerHTML =
      `
      <p class="no-likes">
      저장한 장면이 없습니다 📷
      </p>
      `;
  }

  likeBtn.style.display =
    "none";

  downloadBtn.style.display =
    "none";

  mainControls.style.display =
    "none";

  endBtn.disabled = true;

  resetBtn.style.display =
    "block";
}

/* 다시 시작 */

function resetSession() {
  location.reload();
}

/* 이벤트 */

getDogImage();

newDogBtn.addEventListener(
  "click",
  getDogImage
);

likeBtn.addEventListener(
  "click",
  toggleLike
);

downloadBtn.addEventListener(
  "click",
  downloadImage
);

slideBtn.addEventListener(
  "click",
  toggleSlideShow
);

endBtn.addEventListener(
  "click",
  finishSession
);

resetBtn.addEventListener(
  "click",
  resetSession
);
