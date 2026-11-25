
/* =================================
   기본 설정
================================= */

// 관리자 코드
const EDIT_CODE = "leegunwoohandsome";

// 최초 기본 날짜와 문구
const DEFAULT_DATE = "2027-02-05";
const DEFAULT_TEXT = "졸업까지";


/* =================================
   HTML 요소
================================= */

const accessCode = document.getElementById("accessCode");
const accessStatus = document.getElementById("accessStatus");

const calendarYear = document.getElementById("calendarYear");
const calendarMonth = document.getElementById("calendarMonth");
const calendarGrid = document.getElementById("calendarGrid");

const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");

const countdown = document.getElementById("countdown");
const eventText = document.getElementById("eventText");

const settingsOverlay = document.getElementById("settingsOverlay");
const dateInput = document.getElementById("dateInput");
const textInput = document.getElementById("textInput");

const closeSettings = document.getElementById("closeSettings");
const cancelSettings = document.getElementById("cancelSettings");
const saveSettings = document.getElementById("saveSettings");


/* =================================
   데이터 불러오기
================================= */

let savedDate =
  localStorage.getItem("graduationDate") || DEFAULT_DATE;

let savedText =
  localStorage.getItem("graduationText") || DEFAULT_TEXT;


/* =================================
   달력 이동 범위 설정
================================= */

const initialToday = new Date();

const initialMonth =
  initialToday.getFullYear() * 12 +
  initialToday.getMonth();

// 처음에는 현재 월을 보여줌
let viewYear = initialToday.getFullYear();
let viewMonth = initialToday.getMonth();

// 현재 월 기준 전후 12개월
const minMonth = initialMonth - 12;
const maxMonth = initialMonth + 12;


/* =================================
   날짜 계산
================================= */

function getDayNumber(dateString) {
  const [year, month, day] =
    dateString.split("-").map(Number);

  return Date.UTC(year, month - 1, day) / 86400000;
}

function updateCountdown() {

  const today = new Date();

  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
  ].join("-");

  const difference =
    getDayNumber(savedDate) -
    getDayNumber(todayString);

  if (difference > 0) {

    countdown.textContent = `D-${difference}`;

  } else if (difference < 0) {

    countdown.textContent = `D+${Math.abs(difference)}`;

  } else {

    countdown.textContent = "D-DAY";

  }

  eventText.textContent = savedText;
}


/* =================================
   달력 생성
================================= */

function renderCalendar() {

  const year = viewYear;
  const month = viewMonth + 1;

  const [targetYear, targetMonth, targetDay] =
    savedDate.split("-").map(Number);

  // 연도와 월 표시
  calendarYear.textContent = `${year}년`;
  calendarMonth.textContent = `${month}월`;

  // 기존 달력 초기화
  calendarGrid.innerHTML = "";

  // 이동 버튼 범위 제한
  const currentIndex = year * 12 + viewMonth;

  prevMonth.disabled = currentIndex <= minMonth;
  nextMonth.disabled = currentIndex >= maxMonth;

  // 요일 생성
  const weekdays = [
    "일", "월", "화", "수", "목", "금", "토"
  ];

  weekdays.forEach(day => {

    const cell = document.createElement("div");

    cell.className = "calendar-day weekday";
    cell.textContent = day;

    calendarGrid.appendChild(cell);

  });

  // 해당 월의 첫 요일
  const firstDay =
    new Date(year, viewMonth, 1).getDay();

  // 해당 월의 마지막 날짜
  const lastDate =
    new Date(year, viewMonth + 1, 0).getDate();

  const today = new Date();

  // 시작 전 빈칸
  for (let i = 0; i < firstDay; i++) {

    const empty = document.createElement("div");

    calendarGrid.appendChild(empty);

  }

  // 날짜 생성
  for (let day = 1; day <= lastDate; day++) {

    const cell = document.createElement("div");

    cell.className = "calendar-day";
    cell.textContent = day;

    // 목표 날짜 강조
    if (
      year === targetYear &&
      month === targetMonth &&
      day === targetDay
    ) {

      cell.classList.add("target");

    }

    // 오늘 날짜 테두리
    if (
      year === today.getFullYear() &&
      month === today.getMonth() + 1 &&
      day === today.getDate()
    ) {

      cell.classList.add("today");

    }

    calendarGrid.appendChild(cell);

  }

}


/* =================================
   이전 달 이동
================================= */

prevMonth.addEventListener("click", () => {

  const currentIndex =
    viewYear * 12 + viewMonth;

  if (currentIndex <= minMonth) return;

  viewMonth--;

  if (viewMonth < 0) {

    viewMonth = 11;
    viewYear--;

  }

  renderCalendar();

});


/* =================================
   다음 달 이동
================================= */

nextMonth.addEventListener("click", () => {

  const currentIndex =
    viewYear * 12 + viewMonth;

  if (currentIndex >= maxMonth) return;

  viewMonth++;

  if (viewMonth > 11) {

    viewMonth = 0;
    viewYear++;

  }

  renderCalendar();

});


/* =================================
   전체 화면 업데이트
================================= */

function updatePage() {

  updateCountdown();
  renderCalendar();

}


/* =================================
   관리자 설정창 열기
================================= */

function openSettings() {

  dateInput.value = savedDate;
  textInput.value = savedText;

  settingsOverlay.classList.add("active");

}


/* =================================
   관리자 코드 확인
================================= */

accessCode.addEventListener("keydown", (e) => {

  if (e.key !== "Enter") return;

  if (accessCode.value === EDIT_CODE) {

    openSettings();

    accessCode.value = "";
    accessCode.blur();

    accessStatus.textContent = "";

  } else {

    accessStatus.textContent = "코드 오류";
    accessStatus.style.color = "#ed9292";

    accessCode.value = "";

    setTimeout(() => {

      accessStatus.textContent = "";

    }, 1800);

  }

});


/* =================================
   설정창 닫기
================================= */

function closeSettingsWindow() {

  settingsOverlay.classList.remove("active");

}

closeSettings.addEventListener(
  "click",
  closeSettingsWindow
);

cancelSettings.addEventListener(
  "click",
  closeSettingsWindow
);

// 바깥 영역 클릭 시 닫기
settingsOverlay.addEventListener("click", (e) => {

  if (e.target === settingsOverlay) {

    closeSettingsWindow();

  }

});

// ESC 키로 닫기
document.addEventListener("keydown", (e) => {

  if (e.key === "Escape") {

    closeSettingsWindow();

  }

});


/* =================================
   설정 저장
================================= */

saveSettings.addEventListener("click", () => {

  const newDate = dateInput.value;
  const newText = textInput.value.trim();

  if (!newDate) {

    alert("날짜를 선택해 주세요.");
    return;

  }

  // 날짜 형식 및 실제 날짜 유효성 검사
  const [year, month, day] =
    newDate.split("-").map(Number);

  const checkDate = new Date(year, month - 1, day);

  if (
    checkDate.getFullYear() !== year ||
    checkDate.getMonth() !== month - 1 ||
    checkDate.getDate() !== day
  ) {

    alert("올바른 날짜를 선택해 주세요.");
    return;

  }

  if (!newText) {

    alert("표시할 문구를 입력해 주세요.");
    return;

  }

  // 정보 변경
  savedDate = newDate;
  savedText = newText;

  // 브라우저에 저장
  localStorage.setItem(
    "graduationDate",
    savedDate
  );

  localStorage.setItem(
    "graduationText",
    savedText
  );

  // 목표 날짜가 있는 달로 달력 이동
  const [newYear, newMonth] =
    savedDate.split("-").map(Number);

  const targetIndex =
    newYear * 12 + (newMonth - 1);

  if (targetIndex >= minMonth && targetIndex <= maxMonth) {
    viewYear = newYear;
    viewMonth = newMonth - 1;
  }

  // 화면 갱신
  updatePage();

  // 설정창 닫기
  closeSettingsWindow();

});


/* =================================
   최초 실행
================================= */

updatePage();

// 날짜 변경 확인
setInterval(updateCountdown, 60000);
