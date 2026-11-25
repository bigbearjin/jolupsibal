
/* 관리자 코드 */
const EDIT_CODE = "leegunwoohandsome";

/* 기본 정보 */
const DEFAULT_DATE = "2027-02-05";
const DEFAULT_TEXT = "졸업까지";

/* 요소 */
const accessCode = document.getElementById("accessCode");
const accessStatus = document.getElementById("accessStatus");

const calendarYear = document.getElementById("calendarYear");
const calendarMonth = document.getElementById("calendarMonth");
const calendarGrid = document.getElementById("calendarGrid");

const countdown = document.getElementById("countdown");
const eventText = document.getElementById("eventText");

const settingsOverlay = document.getElementById("settingsOverlay");
const dateInput = document.getElementById("dateInput");
const textInput = document.getElementById("textInput");

const closeSettings = document.getElementById("closeSettings");
const cancelSettings = document.getElementById("cancelSettings");
const saveSettings = document.getElementById("saveSettings");

/* 저장된 데이터 */
let savedDate =
  localStorage.getItem("graduationDate") || DEFAULT_DATE;

let savedText =
  localStorage.getItem("graduationText") || DEFAULT_TEXT;


/* 날짜 계산 */
function getDayNumber(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
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
    getDayNumber(savedDate) - getDayNumber(todayString);

  if (difference > 0) {
    countdown.textContent = `D-${difference}`;
  } else if (difference < 0) {
    countdown.textContent = `D+${Math.abs(difference)}`;
  } else {
    countdown.textContent = "D-DAY";
  }

  eventText.textContent = savedText;
}


/* 달력 생성 */
function renderCalendar() {
  const [year, month, targetDay] =
    savedDate.split("-").map(Number);

  calendarYear.textContent = `${year}년`;
  calendarMonth.textContent = `${month}월`;

  calendarGrid.innerHTML = "";

  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  weekdays.forEach(day => {
    const cell = document.createElement("div");
    cell.className = "calendar-day weekday";
    cell.textContent = day;
    calendarGrid.appendChild(cell);
  });

  const firstDay = new Date(year, month - 1, 1).getDay();
  const lastDate = new Date(year, month, 0).getDate();

  const today = new Date();

  const isCurrentMonth =
    today.getFullYear() === year &&
    today.getMonth() + 1 === month;

  for (let i = 0; i < firstDay; i++) {
    calendarGrid.appendChild(document.createElement("div"));
  }

  for (let day = 1; day <= lastDate; day++) {
    const cell = document.createElement("div");

    cell.className = "calendar-day";
    cell.textContent = day;

    if (day === targetDay) {
      cell.classList.add("target");
    }

    if (isCurrentMonth && day === today.getDate()) {
      cell.classList.add("today");
    }

    calendarGrid.appendChild(cell);
  }
}


/* 화면 갱신 */
function updatePage() {
  updateCountdown();
  renderCalendar();
}


/* 관리자 창 열기 */
function openSettings() {
  dateInput.value = savedDate;
  textInput.value = savedText;

  settingsOverlay.classList.add("active");
}

/* 관리자 코드 확인 */
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


/* 창 닫기 */
function closeSettingsWindow() {
  settingsOverlay.classList.remove("active");
}

closeSettings.addEventListener("click", closeSettingsWindow);
cancelSettings.addEventListener("click", closeSettingsWindow);

settingsOverlay.addEventListener("click", (e) => {
  if (e.target === settingsOverlay) {
    closeSettingsWindow();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeSettingsWindow();
  }
});


/* 설정 저장 */
saveSettings.addEventListener("click", () => {
  const newDate = dateInput.value;
  const newText = textInput.value.trim();

  if (!newDate) {
    alert("날짜를 선택해 주세요.");
    return;
  }

  if (!newText) {
    alert("표시할 문구를 입력해 주세요.");
    return;
  }

  savedDate = newDate;
  savedText = newText;

  localStorage.setItem("graduationDate", savedDate);
  localStorage.setItem("graduationText", savedText);

  updatePage();
  closeSettingsWindow();
});


/* 시작 */
updatePage();

/* 날짜 변경 자동 확인 */
setInterval(updateCountdown, 60000);
