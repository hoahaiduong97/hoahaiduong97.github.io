node tools/generate-images-json.js
npm install -g clean-css-cli
cleancss -o dist/app.min.css css/bootstrap.css css/style.css
npm install -g terser
terser js/auth.js js/gallery.js js/boostrap.js js/zoom.js -c -m -o dist/app.min.js