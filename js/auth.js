/* ================= CONFIG ================= */
const SALT = "ERP@2026!@#";
const SESSION_TIME = 30 * 60 * 1000;

/* HASHED CREDENTIALS */
const HASHED_USERNAME =
  "30e6887bb768dda4d5f46972425c7fdc6cbbe52c756f86ddbceecec6294c0881";
const HASHED_PASSWORD =
  "ea21bf6af5fcc61806f8c9c6fd4c55be6cbd483dc3d1b071c191fddbccdc3ff0";
const HASHED_CODE =
  "f328c46a2072541ea7c9c483dac103e8a8f690cb6251ba2558fc5d90b9f7875d";

/* ================= CRYPTO ================= */
async function sha256(text) {
  const data = new TextEncoder().encode(text + SALT);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacSHA256(key, data) {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(data));
  return [...new Uint8Array(sig)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/* ================= FINGERPRINT ================= */
function getFingerprint() {
  return [
    navigator.userAgent,
    screen.width,
    screen.height,
    navigator.language,
  ].join("|");
}

/* ================= AUTH CORE ================= */
async function generateToken(loginTime) {
  const secret = SALT + getFingerprint();
  return await hmacSHA256(secret, String(loginTime));
}

async function login() {
  const hu = await sha256(username.value.trim());
  const hp = await sha256(password.value);
  const hc = await sha256(code.value.trim());

  if (
    hu === HASHED_USERNAME &&
    hp === HASHED_PASSWORD &&
    hc === HASHED_CODE
  ) {
    const loginTime = Date.now();
    const token = await generateToken(loginTime);

    sessionStorage.setItem("loginTime", loginTime);
    sessionStorage.setItem("token", token);

    location.href = "index.html";
  } else {
    error.textContent = "Incorrect login information";
  }
}

/* ================= VERIFY ================= */
async function checkAuth() {
  const loginTime = Number(sessionStorage.getItem("loginTime"));
  const token = sessionStorage.getItem("token");

  if (!loginTime || !token) {
    logout();
    return;
  }

  if (Date.now() - loginTime > SESSION_TIME) {
    logout();
    return;
  }

  const expectedToken = await generateToken(loginTime);
  if (token !== expectedToken) {
    logout();
  }
}

/* ================= SESSION TIMER ================= */
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

/* ================= LOGOUT ================= */
function logout() {
  sessionStorage.clear();
  location.href = "login.html";
}

/* ================= UI ================= */
function handleEnter(e) {
  e.preventDefault();
  login();
}

function togglePassword(el) {
  const input = el.closest(".password-wrapper")?.querySelector("input");
  if (!input) return;

  const isPwd = input.type === "password";
  input.type = isPwd ? "text" : "password";
  el.textContent = isPwd ? "🙈" : "👁";
}

/* Anti DevTools basic */
// document.addEventListener("contextmenu", (e) => e.preventDefault());
// document.onkeydown = (e) => {
//   if (e.key === "F12" || (e.ctrlKey && e.shiftKey)) e.preventDefault();
// };
