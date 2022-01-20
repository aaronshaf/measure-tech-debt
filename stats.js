const { tsquery } = require("@phenomnomnominal/tsquery");
const fs = require("fs");
const glob = require("glob");

const extensions = ["coffee", "hbs", "handlebars"];

const identifiers = ["$"];

const imports = [
  "jquery",
  "underscore",
  "spin.js",
  "coffee",
  "handlebars",
  "hbs",
];

exports.getStats = function (path) {
  const stats = {};

  for (const extension of extensions) {
    const files = glob.sync(`**/*.+(${extension})`, {
      cwd: process.cwd(),
    });
    stats[`.${extension} extension`] = files.length;
  }

  const scripts = glob.sync("**/*.+(jsx|js|tsx|ts)", {
    cwd: process.cwd(),
  });

  for (let file of scripts) {
    const source = fs.readFileSync(file, { encoding: "utf8" });
    const ast = tsquery.ast(source);

    for (const import_ of imports) {
      const nodes = tsquery(
        ast,
        `ImportDeclaration > StringLiteral[text=/${import_}/]`
      );
      if (nodes.length > 0) {
        if (!stats[`${import_} imports`]) {
          stats[`${import_} imports`] = 0;
        }
        stats[`${import_} imports`] += nodes.length;
      }
    }

    for (const identifier of identifiers) {
      const nodes = tsquery(ast, `Identifier[name="${identifier}"]`);
      if (nodes.length > 0) {
        if (!stats[`${identifier} identifiers`]) {
          stats[`${identifier} identifiers`] = 0;
        }
        stats[`${identifier} identifiers`] += nodes.length;
      }
    }
  }

  return stats;
};
