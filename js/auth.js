const SALT = "ERP@2026!@#";

const HASHED_USERNAME =
  "30e6887bb768dda4d5f46972425c7fdc6cbbe52c756f86ddbceecec6294c0881";
const HASHED_PASSWORD =
  "ea21bf6af5fcc61806f8c9c6fd4c55be6cbd483dc3d1b071c191fddbccdc3ff0";
const HASHED_CODE =
  "f328c46a2072541ea7c9c483dac103e8a8f690cb6251ba2558fc5d90b9f7875d";

const SESSION_TIME = 30 * 60 * 1000;

async function sha256(text) {
  const data = new TextEncoder().encode(text + SALT);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function login() {
  const hu = await sha256(username.value.trim());
  const hp = await sha256(password.value);
  const hc = await sha256(code.value.trim());
  if (hu === HASHED_USERNAME && hp === HASHED_PASSWORD && hc === HASHED_CODE) {
    sessionStorage.setItem("auth", "true");
    sessionStorage.setItem("loginTime", Date.now());
    location.href = "index.html";
  } else {
    error.textContent = "Incorrect login information";
  }
}

function handleEnter(e) {
  e.preventDefault();
  login();
}

function checkAuth() {
  const t = sessionStorage.getItem("loginTime");
  if (!sessionStorage.getItem("auth") || Date.now() - t > SESSION_TIME) {
    logout();
  }
}

function startSessionCountdown() {
  const el = document.getElementById("sessionTimer");
  if (!el) return;

  setInterval(() => {
    const start = Number(sessionStorage.getItem("loginTime"));
    const remain = SESSION_TIME - (Date.now() - start);
    if (remain <= 0) logout();

    const m = Math.floor(remain / 60000);
    const s = Math.floor((remain % 60000) / 1000);
    el.textContent = `${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  }, 1000);
}

function logout() {
  sessionStorage.clear();
  location.href = "login.html";
}

function togglePassword(el) {
  const wrapper = el.closest(".password-wrapper");
  const input = wrapper.querySelector("input");

  if (!input) return;

  const isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";
  el.textContent = isPassword ? "🙈" : "👁";
}

/* Anti DevTools basic */
// document.addEventListener("contextmenu", (e) => e.preventDefault());
// document.onkeydown = (e) => {
//   if (e.key === "F12" || (e.ctrlKey && e.shiftKey)) e.preventDefault();
// };
