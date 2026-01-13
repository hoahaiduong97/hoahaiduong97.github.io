const fs = require("fs");
const path = require("path");

const IMAGES_DIR = path.join(__dirname, "../images");
const IMAGE_REGEX = /\.(jpg|jpeg|png|webp)$/i;

function scan(dir) {
  const result = { images: [], children: {} };

  fs.readdirSync(dir).forEach((item) => {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      const child = scan(full);
      if (child.images.length || Object.keys(child.children).length) {
        result.children[item] = child;
      }
    } else if (IMAGE_REGEX.test(item)) {
      result.images.push({
        name: item,
        size: stat.size,
        mtime: stat.mtimeMs,
      });
    }
  });

  return result;
}

fs.writeFileSync(
  path.join(__dirname, "../images.json"),
  JSON.stringify(scan(IMAGES_DIR), null, 2)
);

console.log("✅ images.json generated");
