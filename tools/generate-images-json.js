const fs = require("fs");
const path = require("path");

const IMAGES_DIR = path.join(__dirname, "../images");
const IMAGE_REGEX = /\.(jpg|jpeg|png|webp)$/i;

const result = {};

fs.readdirSync(IMAGES_DIR).forEach((folder) => {
  const folderPath = path.join(IMAGES_DIR, folder);

  if (!fs.statSync(folderPath).isDirectory()) return;

  const images = fs
    .readdirSync(folderPath)
    .filter(
      (file) =>
        IMAGE_REGEX.test(file) &&
        fs.statSync(path.join(folderPath, file)).isFile()
    );

  if (images.length > 0) {
    result[folder] = images;
  }
});

fs.writeFileSync(
  path.join(__dirname, "../images.json"),
  JSON.stringify(result, null, 2)
);

console.log("✅ images.json generated");
