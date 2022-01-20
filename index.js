#!/usr/bin/env node
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const csv = require("fast-csv");
const argv = yargs(hideBin(process.argv)).argv;

const path = require("path");
const { getStats } = require("./stats");

const paths = (argv["_"].length > 0 ? argv["_"] : ["."]).map((p) =>
  path.resolve(p)
);

const csvStream = argv.csv ? csv.format({ headers: true }) : null;

if (argv.csv) {
  csvStream.pipe(process.stdout).on("end", () => process.exit());
}

const aggregateStats = paths.map((p) => {
  const displayPath = p.replace(`${process.cwd()}`, ".");

  const result = {
    path: displayPath,
    ...getStats(p),
  };

  if (argv.csv) {
    csvStream.write(result);
  } else if (!argv.quiet) {
    console.log(displayPath);
  }

  return result;
});

if (argv.csv) {
  csvStream.end();
} else {
  console.log(JSON.stringify(aggregateStats, null, 2));
}