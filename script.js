const body = document.body;
const themeBtn = document.getElementById('themeBtn');
let theme = localStorage.getItem('theme') || 'light';
if (theme === 'dusky') body.dataset.theme = 'dusky';
themeBtn.textContent = theme === 'dusky' ? 'Light ☀️' : 'Dusky 🌙';
themeBtn.onclick = () => {
  theme = theme === 'dusky' ? 'light' : 'dusky';
  if (theme === 'dusky') body.dataset.theme = 'dusky';
  else body.removeAttribute('data-theme');
  localStorage.setItem('theme', theme);
  themeBtn.textContent = theme === 'dusky' ? 'Light ☀️' : 'Dusky 🌙';
};

const timeEl = document.getElementById('time');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const workLenInput = document.getElementById('workLen');
const breakLenInput = document.getElementById('breakLen');
const cyclesEl = document.getElementById('cycles');

let interval, isRunning = false, isWork = true, secondsLeft;
let cycles = +localStorage.getItem('cycles') || 0;
cyclesEl.textContent = `Completed pomodoros: ${cycles}`;

const fmt = s => {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
};

function setTime() {
  secondsLeft = ((isWork ? +workLenInput.value : +breakLenInput.value) * 60);
  timeEl.textContent = fmt(secondsLeft);
}

function tick() {
  secondsLeft--;
  timeEl.textContent = fmt(secondsLeft);
  if (secondsLeft <= 0) {
    clearInterval(interval);
    if (isWork) {
      cycles++;
      localStorage.setItem('cycles', cycles);
      cyclesEl.textContent = `Completed pomodoros: ${cycles}`;
    }
    isWork = !isWork;
    alert(isWork ? 'Break over! Back to work.' : 'Work session done! Time for a break.');
    setTime();
    startBtn.disabled = false;
    resetBtn.disabled = true;
    isRunning = false;
  }
}

startBtn.onclick = () => {
  if (isRunning) return;
  isRunning = true;
  startBtn.disabled = true;
  resetBtn.disabled = false;
  tick();
  interval = setInterval(tick, 1000);
};

resetBtn.onclick = () => {
  clearInterval(interval);
  isRunning = false;
  setTime();
  startBtn.disabled = false;
  resetBtn.disabled = true;
};

workLenInput.onchange = breakLenInput.onchange = () => {
  if (!isRunning) setTime();
};

setTime();
