let currentIndex = 0;

// swipe
let startX = 0;
let startY = 0;

// zoom
let scale = 1;
let translateX = 0;
let translateY = 0;

let lastTouchDistance = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;

let lastTap = 0;

function openLightbox(index) {
  currentIndex = index;

  scale = 1;
  translateX = 0;
  translateY = 0;

  const box = document.createElement("div");
  box.className = "lightbox";

  const img = document.createElement("img");
  img.src = `images/${decodePath(viewImages[currentIndex].p)}`;

  box.appendChild(img);
  document.body.appendChild(box);

  /* ===== KEYBOARD ===== */
  document.onkeydown = (e) => {
    if (e.key === "ArrowRight") navigate(1);
    if (e.key === "ArrowLeft") navigate(-1);
    if (e.key === "Escape") closeLightbox();
  };

  /* ===== APPLY TRANSFORM ===== */
  function applyTransform() {
    img.style.transform = `
      translate(${translateX}px, ${translateY}px)
      scale(${scale})
    `;
  }

  /* ===== MOUSE WHEEL ZOOM ===== */
  box.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.15 : 0.15;
      scale = Math.min(Math.max(1, scale + delta), 5);
      applyTransform();
    },
    { passive: false }
  );

  /* ===== DOUBLE CLICK / TAP ===== */
  box.addEventListener("click", () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      scale = scale === 1 ? 2.5 : 1;
      translateX = 0;
      translateY = 0;
      applyTransform();
    }
    lastTap = now;
  });

  /* ===== DRAG IMAGE (PC) ===== */
  img.addEventListener("mousedown", (e) => {
    if (scale <= 1) return;

    isDragging = true;
    dragStartX = e.clientX - translateX;
    dragStartY = e.clientY - translateY;
    img.style.cursor = "grabbing";
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    translateX = e.clientX - dragStartX;
    translateY = e.clientY - dragStartY;
    applyTransform();
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
    img.style.cursor = "grab";
  });

  /* ===== TOUCH START ===== */
  box.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  });

  /* ===== PINCH TO ZOOM ===== */
  box.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();

        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.hypot(dx, dy);

        if (lastTouchDistance) {
          const delta = (distance - lastTouchDistance) / 200;
          scale = Math.min(Math.max(1, scale + delta), 5);
          applyTransform();
        }

        lastTouchDistance = distance;
      }
    },
    { passive: false }
  );

  box.addEventListener("touchend", () => {
    lastTouchDistance = 0;
  });

  /* ===== SWIPE NAV / CLOSE ===== */
  box.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;

    if (scale > 1) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 60) navigate(-1);
      if (dx < -60) navigate(1);
    } else if (dy < -80) {
      closeLightbox();
    }
  });

  /* ===== CLICK BACKGROUND CLOSE ===== */
  box.addEventListener("click", (e) => {
    if (e.target === box) closeLightbox();
  });

  /* ===== NAVIGATE ===== */
  function navigate(step) {
    currentIndex =
      (currentIndex + step + viewImages.length) % viewImages.length;

    scale = 1;
    translateX = 0;
    translateY = 0;

    img.src = `images/${decodePath(viewImages[currentIndex].p)}`;
    applyTransform();

    document
      .querySelectorAll(".gallery-item")
      [currentIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
  }

  /* ===== CLOSE ===== */
  function closeLightbox() {
    document.onkeydown = null;
    box.remove();
  }
}
