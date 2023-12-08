const { tsquery } = require("@phenomnomnominal/tsquery");
const fs = require("fs");
const glob = require("glob");
const path = require("path");

const identifiers = ["$"];
const imports = ["jquery", "underscore", "handlebars"];
const isDirectory = (path_) => fs.lstatSync(path_).isDirectory();

const getOwner = (dir) => {
  const packageJsonPath = path.join(dir, "package.json");
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    return packageJson.owner || null;
  }
  return null;
};

const calculateTsPercentage = (dir) => {
  const tsFiles = glob.sync("**/*.+(tsx|ts)", { cwd: dir }).length;
  const allRelevantFiles = glob.sync("**/*.+(jsx|js|tsx|ts)", {
    cwd: dir,
  }).length;
  return allRelevantFiles > 0
    ? Math.round((tsFiles / allRelevantFiles) * 100)
    : 0;
};

const countLinesExcludingComments = (filePath) => {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");

  return lines.reduce((count, line) => {
    const trimmedLine = line.trim();
    if (
      !trimmedLine.startsWith("//") &&
      !trimmedLine.startsWith("/*") &&
      !trimmedLine !== "*/" &&
      trimmedLine !== ""
    ) {
      count++;
    }
    return count;
  }, 0);
};

exports.getStats = function (path_) {
  const stats = {};

  const owner = getOwner(path_);
  stats["owner"] = owner || "Unknown";

  const tsPercentage = calculateTsPercentage(path_);
  stats["TypeScript"] = `${tsPercentage}%`;

  let totalLines = 0;
  const globOptions = { cwd: path_ };
  const scripts = isDirectory(path_)
    ? glob
        .sync("**/*.+(jsx|js|tsx|ts)", globOptions)
        .map((file) => path.join(path_, file))
    : [path_];

  for (let file of scripts) {
    if (/\.(jsx|js|tsx|ts)$/.test(file)) {
      totalLines += countLinesExcludingComments(file);
    }
  }
  stats["Lines of Code"] = totalLines;

  for (const import_ of imports) {
    stats[`${import_} imports`] = 0;
  }
  for (const identifier of identifiers) {
    stats[`${identifier} identifiers`] = 0;
  }

  for (let file of scripts) {
    const source = fs.readFileSync(file, { encoding: "utf8" });
    try {
      const ast = tsquery.ast(source);
      for (const import_ of imports) {
        const nodes = tsquery(
          ast,
          `ImportDeclaration > StringLiteral[text=/${import_}/]`
        );
        stats[`${import_} imports`] += nodes.length;
      }
      for (const identifier of identifiers) {
        const nodes = tsquery(ast, `Identifier[name="${identifier}"]`);
        stats[`${identifier} identifiers`] += nodes.length;
      }
    } catch (err) {}
  }

  return stats;
};
