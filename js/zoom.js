function openLightbox(index) {
  currentIndex = index;

  const box = document.createElement("div");
  box.className = "lightbox";

  const img = document.createElement("img");
  img.src = `images/${currentFolder}/${data[currentFolder][currentIndex]}`;

  const prev = document.createElement("button");
  prev.className = "prev";
  prev.innerHTML = "❮";
  prev.onclick = (e) => {
    e.stopPropagation();
    navigate(-1);
  };

  const next = document.createElement("button");
  next.className = "next";
  next.innerHTML = "❯";
  next.onclick = (e) => {
    e.stopPropagation();
    navigate(1);
  };

  const close = document.createElement("button");
  close.className = "close";
  close.innerHTML = "✕";
  close.onclick = () => box.remove();

  box.onclick = () => box.remove();

  box.append(img, prev, next, close);
  document.body.appendChild(box);
}

function navigate(step) {
  const list = data[currentFolder];
  currentIndex = (currentIndex + step + list.length) % list.length;
  document.querySelector(
    ".lightbox img"
  ).src = `images/${currentFolder}/${list[currentIndex]}`;
}
