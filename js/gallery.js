let data = {};
let currentFolder = "";
let currentImages = [];
let viewImages = [];
let pageSize = 50;
let currentPage = 1;
let activeMenuItem = null;
let headerCollapsed = false;
const SECRET = "g@ll3ry";

async function loadGallery() {
  data = await fetch("images.json").then((r) => r.json());
  renderMenu(data, document.getElementById("menu"), "");
}

function renderMenu(node, container, basePath) {
  container.innerHTML = "";

  Object.entries(node.children).forEach(([name, value]) => {
    const item = document.createElement("div");
    item.className = "menu-item";

    const label = document.createElement("div");
    label.className = "menu-label";
    label.textContent = name;

    const fullPath = basePath ? `${basePath}/${name}` : name;

    label.onclick = (e) => {
      e.stopPropagation();

      if (activeMenuItem) {
        activeMenuItem.classList.remove("active");
      }
      item.classList.add("active");
      activeMenuItem = item;

      if (Object.keys(value.children).length) {
        item.classList.toggle("open");
      }

      // render images
      if (value.images && value.images.length) {
        renderImages(fullPath, value.images);
      }
    };

    item.appendChild(label);

    if (Object.keys(value.children).length) {
      const sub = document.createElement("div");
      sub.className = "submenu";
      renderMenu(value, sub, fullPath);
      item.appendChild(sub);
    }

    container.appendChild(item);
  });
}

document.addEventListener("click", () => {
  document
    .querySelectorAll(".menu-item.open")
    .forEach((el) => el.classList.remove("open"));
});

function renderImages(folder, images) {
  currentFolder = folder;
  currentImages = [...images];

  viewImages = [...currentImages].sort(() => Math.random() - 0.5);
  currentPage = 1;

  renderPage();
}

function applySort(mode) {
  viewImages = [...currentImages];

  if (mode === "name") {
    viewImages.sort((a, b) =>
      decodePath(a.p).localeCompare(decodePath(b.p))
    );
  }

  if (mode === "date") {
    viewImages.sort((a, b) => b.t - a.t);
  }

  if (mode === "size") {
    viewImages.sort((a, b) => b.s - a.s);
  }

  if (mode === "random") {
    viewImages.sort(() => Math.random() - 0.5);
  }

  currentPage = 1;
  renderPage();
}

function changePageSize(size) {
  pageSize = Number(size);
  currentPage = 1;
  renderPage();
}

function renderPage() {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  const start = (currentPage - 1) * pageSize;
  const pageItems = viewImages.slice(start, start + pageSize);

  pageItems.forEach((img, i) => {
    const div = document.createElement("div");
    div.className = "gallery-item";

    const image = document.createElement("img");
    image.dataset.src = `images/${decodePath(img.p)}`;
    image.alt = img.name;
    image.className = "lazy";
    image.onclick = () => openLightbox(start + i);

    div.appendChild(image);
    gallery.appendChild(div);
  });

  renderPagination();
  observeLazyImages();
}

function renderPagination() {
  const total = Math.ceil(viewImages.length / pageSize);
  const p = document.getElementById("pagination");
  p.innerHTML = "";

  for (let i = 1; i <= total; i++) {
    const b = document.createElement("button");
    b.textContent = i;
    b.onclick = () => {
      currentPage = i;
      renderPage();
    };
    if (i === currentPage) b.classList.add("active");
    p.appendChild(b);
  }
}

let lazyObserver = null;

if ("IntersectionObserver" in window) {
  lazyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.onload = () => img.classList.remove("lazy");
          lazyObserver.unobserve(img);
        }
      });
    },
    {
      rootMargin: "300px",
      threshold: 0.1,
    }
  );
}

function observeLazyImages() {
  const lazyImages = document.querySelectorAll("img.lazy");

  if (!lazyObserver) {
    lazyImages.forEach((img) => {
      img.src = img.dataset.src;
      img.classList.remove("lazy");
    });
    return;
  }

  lazyImages.forEach((img) => lazyObserver.observe(img));
}

function setGrid(cols) {
  document.getElementById("gallery").style.setProperty("--cols", cols);
}

/* ================= HEADER AUTO HIDE ================= */
let lastScrollY = window.scrollY;
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;

  // kéo xuống → ẩn
  if (currentScroll > lastScrollY && currentScroll > 80) {
    header.classList.add("hide");
  }
  // kéo lên → hiện
  else {
    header.classList.remove("hide");
  }

  lastScrollY = currentScroll;
});

function toggleHeader() {
  headerCollapsed = !headerCollapsed;
  document
    .getElementById("mainHeader")
    .classList.toggle("collapsed", headerCollapsed);
}

/* Back to top */
const backBtn = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  backBtn.style.display = window.scrollY > 300 ? "block" : "none";
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
async function loadGallery() {
  data = await fetch("images.json").then((r) => r.json());
  renderMenu(data, document.getElementById("menu"), "");
}

function renderMenu(node, container, basePath) {
  container.innerHTML = "";

  Object.entries(node.children).forEach(([name, value]) => {
    const item = document.createElement("div");
    item.className = "menu-item";

    const label = document.createElement("div");
    label.className = "menu-label";
    label.textContent = name;

    const fullPath = basePath ? `${basePath}/${name}` : name;

    label.onclick = (e) => {
      e.stopPropagation();
      item.classList.toggle("open");

      if (value.images?.length) {
        renderImages(fullPath, value.images);
      }
    };

    item.appendChild(label);

    if (Object.keys(value.children).length) {
      const search = document.createElement("input");
      search.className = "submenu-search";
      search.placeholder = "Search...";
      search.oninput = () => filterSubmenu(search.value, sub);

      const sub = document.createElement("div");
      sub.className = "submenu";

      sub.appendChild(search);
      renderMenu(value, sub, fullPath);

      item.appendChild(sub);
    }

    container.appendChild(item);
  });
}

function filterSubmenu(keyword, submenu) {
  submenu.querySelectorAll(".menu-item").forEach((item) => {
    item.style.display = item.textContent
      .toLowerCase()
      .includes(keyword.toLowerCase())
      ? ""
      : "none";
  });
}
function renderMenu(node, container, basePath) {
  container.innerHTML = "";

  Object.entries(node.children).forEach(([name, value]) => {
    const item = document.createElement("div");
    item.className = "menu-item";

    const label = document.createElement("div");
    label.className = "menu-label";
    label.textContent = name;

    const fullPath = basePath ? `${basePath}/${name}` : name;

    label.onclick = (e) => {
      e.stopPropagation();

      // active
      document
        .querySelectorAll(".menu-item.active")
        .forEach((x) => x.classList.remove("active"));
      item.classList.add("active");

      // toggle dropdown
      if (Object.keys(value.children).length) {
        item.classList.toggle("open");
      }

      // render ảnh
      if (value.images?.length) {
        renderImages(fullPath, value.images);
      }
    };

    item.appendChild(label);

    if (Object.keys(value.children).length) {
      const sub = document.createElement("div");
      sub.className = "submenu";

      const search = document.createElement("input");
      search.className = "submenu-search";
      search.placeholder = "Search...";
      search.oninput = () => filterSubmenu(search.value, sub);

      sub.appendChild(search);
      renderMenu(value, sub, fullPath);
      item.appendChild(sub);
    }

    container.appendChild(item);
  });
}

function decodePath(encoded) {
  const decoded = atob(encoded);
  return [...decoded]
    .map((c, i) =>
      String.fromCharCode(
        c.charCodeAt(0) ^ SECRET.charCodeAt(i % SECRET.length)
      )
    )
    .join("");
}
