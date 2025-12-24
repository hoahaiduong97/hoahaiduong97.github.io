let data = {};
let currentFolder = "";
let currentIndex = 0;

async function loadGallery() {
  data = await fetch("images.json").then((r) => r.json());
  renderTabs();
}

function renderTabs() {
  const tabs = document.getElementById("tabs");
  tabs.innerHTML = "";

  Object.keys(data).forEach((folder) => {
    const btn = document.createElement("button");
    btn.textContent = folder;
    btn.onclick = () => {
      document
        .querySelectorAll("header button")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderImages(folder);
    };
    tabs.appendChild(btn);
  });
}

function renderImages(folder) {
  currentFolder = folder;
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  data[folder].forEach((img, index) => {
    const div = document.createElement("div");
    div.className = "gallery-item";

    const image = document.createElement("img");
    image.src = `images/${folder}/${img}`;
    image.onclick = () => openLightbox(index);

    div.appendChild(image);
    gallery.appendChild(div);
  });
}

function setLayout(cls) {
  document.getElementById("gallery").className = cls;
}

function setGrid(cols) {
  const gallery = document.getElementById("gallery");
  const maxCols = window.innerWidth < 480 ? Math.min(cols, 4) : cols;
  gallery.style.setProperty("--cols", maxCols);
}

function loadImage(encodedPath) {
  const realPath = atob(encodedPath);

  return fetch(realPath)
    .then(res => res.blob())
    .then(blob => URL.createObjectURL(blob));
}
