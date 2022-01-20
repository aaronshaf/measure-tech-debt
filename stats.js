const { tsquery } = require("@phenomnomnominal/tsquery");
const fs = require("fs");
const glob = require("glob");
const path = require("path");

const extensions = ["coffee", "hbs", "handlebars"];

const identifiers = ["$"];

const imports = [
  "jquery",
  "underscore",
  "coffee",
  "handlebars",
  "hbs",
];

const isDirectory = (path_) => fs.lstatSync(path_).isDirectory();

exports.getStats = function (path_) {
  const stats = {};

  for (const import_ of imports) {
    if (!stats[`${import_} imports`]) {
      stats[`${import_} imports`] = 0;
    }
  }
  for (const identifier of identifiers) {
    if (!stats[`${identifier} identifiers`]) {
      stats[`${identifier} identifiers`] = 0;
    }
  }

  const globOptions = {};
  let scripts = [];

  if (isDirectory(path_)) {
    globOptions.cwd = path_;
    for (const extension of extensions) {
      const files = glob.sync(`**/*.+(${extension})`, globOptions);
      stats[`.${extension} extension`] = files.length;
    }
    scripts = glob
      .sync("**/*.+(jsx|js|tsx|ts)", globOptions)
      .map((file) => path.join(path_, file));
  } else {
    globOptions.cwd = process.cwd();
    scripts = [path_];
  }

  for (let file of scripts) {
    const source = fs.readFileSync(path.join(file), { encoding: "utf8" });
    const ast = tsquery.ast(source);

    for (const import_ of imports) {
      const nodes = tsquery(
        ast,
        `ImportDeclaration > StringLiteral[text=/${import_}/]`
      );
      if (nodes.length > 0) {
        stats[`${import_} imports`] += nodes.length;
      }
    }

    for (const identifier of identifiers) {
      const nodes = tsquery(ast, `Identifier[name="${identifier}"]`);
      if (nodes.length > 0) {
        stats[`${identifier} identifiers`] += nodes.length;
      }
    }
  }

  return stats;
};
