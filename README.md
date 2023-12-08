`measure-tech-debt` measures a folder's tech debt according to:

* imports (e.g. handlebars, coffeescript)
* identifiers (e.g. $)
* file extensions (e.g. .hbs, coffee)

It's secret sauce is [tsquery](phenomnomnominal/tsquery).

[![See it on NPM!](https://img.shields.io/npm/v/measure-tech-debt.svg?style=for-the-badge&color=orange)](https://www.npmjs.com/package/measure-tech-debt)
[![License](https://img.shields.io/npm/l/measure-tech-debt.svg?color=blue&style=for-the-badge)](https://tldrlegal.com/license/mit-license)

## Install

```bash
npm install -y -g measure-tech-debt
```

## Single folder

```bash
npx measure-tech-debt .
```

## Multiple folders

```
npx measure-tech-debt *
```

## Output to JSON (default)

```bash
npx measure-tech-debt * --json
npx measure-tech-debt * --json > techdebt.json
```

```json
[{"path":".","jquery imports":41,"underscore imports":10,"coffee imports":2,"handlebars imports":3,"hbs imports":0,"$ identifiers":110,".coffee extension":1,".hbs extension":0,".handlebars extension":2}]
```

## Output of Pretty JSON

```bash
npx measure-tech-debt . --json | python -m json.tool
```

```json
[
  {
    "path": ".",
    "jquery imports": 41,
    "underscore imports": 10,
    "coffee imports": 2,
    "handlebars imports": 3,
    "hbs imports": 0,
    "$ identifiers": 110,
    ".coffee extension": 1,
    ".hbs extension": 0,
    ".handlebars extension": 2
  }
]
```

## Output to CSV

```bash
npx measure-tech-debt * --csv
npx measure-tech-debt * --csv > techdebt.csv
```

```csv
path,jquery imports,underscore imports,coffee imports,handlebars imports,hbs imports,$ identifiers,.coffee extension,.hbs extension,.handlebars extension
.,41,10,2,3,0,110,1,0,2%
```
