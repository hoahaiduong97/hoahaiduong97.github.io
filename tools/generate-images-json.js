const fs = require("fs");
const path = require("path");
const SECRET = "g@ll3ry";

const IMAGES_DIR = path.join(__dirname, "../images");
const IMAGE_REGEX = /\.(jpg|jpeg|png|webp)$/i;

function encode(str) {
  return Buffer.from(
    [...str].map(
      (c, i) => c.charCodeAt(0) ^ SECRET.charCodeAt(i % SECRET.length)
    )
  ).toString("base64");
}

function scan(dir, relative = "") {
  const result = { images: [], children: {} };

  fs.readdirSync(dir).forEach((item) => {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      const child = scan(full, path.join(relative, item));
      if (child.images.length || Object.keys(child.children).length) {
        result.children[item] = child;
      }
    } else if (IMAGE_REGEX.test(item)) {
      const imagePath = path.join(relative, item).replace(/\\/g, "/");

      result.images.push({
        p: encode(imagePath), // 👈 encoded path
        s: stat.size,
        t: stat.mtimeMs,
      });
    }
  });

  return result;
}

fs.writeFileSync(
  path.join(__dirname, "../images.json"),
  JSON.stringify(scan(IMAGES_DIR), null, 2)
);

console.log("✅ images.json encoded");