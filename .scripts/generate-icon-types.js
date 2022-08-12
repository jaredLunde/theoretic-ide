const path = require("path");
const fs = require("fs/promises");
const glob = require("glob");

glob(path.resolve(__dirname, "../public/icons/**/*.svg"), {}, (err, files) => {
  const iconPaths = files.map((file) => {
    return path
      .relative(path.resolve(__dirname, "../public/icons/"), file)
      .replace(".svg", "");
  });

  fs.writeFile(
    path.resolve(__dirname, "../types/icons.ts"),
    `export type Icons = \n  | "${iconPaths.join('"\n  | "')}"`
  );
});
