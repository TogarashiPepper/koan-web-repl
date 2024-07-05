set -e -x
npm run build
git switch gh-pages
rm -rf assets index.html vite.svg
cp -r dist/* .
rm -r dist
git add assets index.html vite.svg
git commit -m "upload from build script"
git push
git switch main
