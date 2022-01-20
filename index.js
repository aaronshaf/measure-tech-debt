#!/usr/bin/env node
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const csv = require("fast-csv");
const argv = yargs(hideBin(process.argv)).argv;
const Table = require("cli-table");

const path = require("path");
const { getStats } = require("./stats");

const paths = (argv["_"].length > 0 ? argv["_"] : ["."]).map((p) =>
  path.resolve(p)
);

const csvStream = argv.csv ? csv.format({ headers: true }) : null;

if (argv.csv) {
  csvStream.pipe(process.stdout).on("end", () => process.exit());
} else {
  console.log("[");
}

paths.forEach((p, index, array) => {
  // if (!p.includes('jst')) return
  const displayPath = p.replace(`${process.cwd()}`, ".");

  const result = {
    path: displayPath,
    ...getStats(p),
  };

  if (argv.csv) {
    csvStream.write(result);
  } else {
    console.log(
      "  " + JSON.stringify(result) + (index < array.length - 1 ? "," : "")
    );
  }
});

if (argv.csv) {
  csvStream.end();
} else {
  console.log("]");
}
