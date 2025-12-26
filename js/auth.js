const HASHED_USERNAME =
  "ae4743afb621676d91fbd995954400c5d55a016474b815ada8c5ade55c1b340f"; 

const HASHED_PASSWORD =
  "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92";

const SESSION_TIME = 30 * 60 * 1000;

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

async function login() {
  const u = username.value.trim();
  const p = password.value;

  const hu = await sha256(u);
  const hp = await sha256(p);

  if (hu === HASHED_USERNAME && hp === HASHED_PASSWORD) {
    sessionStorage.setItem("auth", "true");
    sessionStorage.setItem("loginTime", Date.now());
    location.href = "index.html";
  } else {
    error.textContent = "Sai username hoặc password";
  }
}

function handleEnter(e) {
  e.preventDefault();
  login();
}

function checkAuth() {
  const auth = sessionStorage.getItem("auth");
  const time = sessionStorage.getItem("loginTime");

  if (!auth || Date.now() - time > SESSION_TIME) {
    sessionStorage.clear();
    location.href = "login.html";
  }
}

function startSessionCountdown() {
  const el = document.getElementById("sessionTimer");
  if (!el) return;

  const start = Number(sessionStorage.getItem("loginTime"));

  setInterval(() => {
    const remain = SESSION_TIME - (Date.now() - start);
    if (remain <= 0) logout();

    const m = Math.floor(remain / 60000);
    const s = Math.floor((remain % 60000) / 1000);
    el.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, 1000);
}

function logout() {
  sessionStorage.clear();
  location.href = "login.html";
}

function togglePassword(el) {
  const input = document.getElementById("password");

  if (input.type === "password") {
    input.type = "text";
    el.textContent = "🙈";
  } else {
    input.type = "password";
    el.textContent = "👁";
  }
}