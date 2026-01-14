let currentIndex = 0;
let startX = 0;
let startY = 0;

function openLightbox(index) {
  currentIndex = index;

  const box = document.createElement("div");
  box.className = "lightbox";

  const img = document.createElement("img");
  img.src = `images/${decodePath(viewImages[currentIndex].p)}`;

  box.appendChild(img);
  document.body.appendChild(box);

  document.onkeydown = (e) => {
    if (e.key === "ArrowRight") navigate(1);
    if (e.key === "ArrowLeft") navigate(-1);
    if (e.key === "Escape") closeLightbox();
  };

  box.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  });

  box.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 50) navigate(-1);
      if (dx < -50) navigate(1);
    } else {
      if (dy < -80) closeLightbox();
    }
  });

  box.onclick = closeLightbox;
}

function navigate(step) {
  currentIndex = (currentIndex + step + viewImages.length) % viewImages.length;
  document.querySelector(
    ".lightbox img"
  ).src = `images/${currentFolder}/${viewImages[currentIndex].p}`;
}

function closeLightbox() {
  document.onkeydown = null;
  document.querySelector(".lightbox")?.remove();
}
function navigate(step) {
  currentIndex = (currentIndex + step + viewImages.length) % viewImages.length;

  const img = document.querySelector(".lightbox img");
  img.src = `images/${decodePath(viewImages[currentIndex].p)}`;

  const galleryItems = document.querySelectorAll(".gallery-item");
  galleryItems[currentIndex]?.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}
