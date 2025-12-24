const HASHED_PASSWORD =
  "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92";
const SESSION_TIME = 30 * 60 * 1000;
async function sha256(t) {
  const b = new TextEncoder().encode(t);
  const h = await crypto.subtle.digest("SHA-256", b);
  return [...new Uint8Array(h)]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}
async function login() {
  const u = username.value,
    p = password.value,
    h = await sha256(p);
  if (u === "phuong" && h === HASHED_PASSWORD) {
    sessionStorage.setItem("auth", "true");
    sessionStorage.setItem("loginTime", Date.now());
    location.href = "index.html";
  } else {
    error.textContent = "Sai username hoặc password";
  }
}
function checkAuth() {
  const a = sessionStorage.getItem("auth"),
    t = sessionStorage.getItem("loginTime");
  if (!a || Date.now() - t > SESSION_TIME) {
    sessionStorage.clear();
    location.href = "login.html";
  }
}
function togglePassword() {
  const input = document.getElementById("password");
  input.type = input.type === "password" ? "text" : "password";
}
function handleEnter(e) {
  e.preventDefault(); // chặn reload
  login();
}
let countdownInterval = null;

function startSessionCountdown() {
  const timerEl = document.getElementById("sessionTimer");
  if (!timerEl) return;

  const loginTime = Number(sessionStorage.getItem("loginTime"));

  function update() {
    const elapsed = Date.now() - loginTime;
    const remaining = SESSION_TIME - elapsed;

    if (remaining <= 0) {
      sessionStorage.clear();
      location.href = "login.html";
      return;
    }

    const min = Math.floor(remaining / 60000);
    const sec = Math.floor((remaining % 60000) / 1000);
    timerEl.textContent = `${String(min).padStart(2, "0")}:${String(
      sec
    ).padStart(2, "0")}`;
  }

  update();
  countdownInterval = setInterval(update, 1000);
}

function logout() {
  sessionStorage.clear();
  localStorage.removeItem("sessionExpire");

  window.location.href = "login.html";
}
