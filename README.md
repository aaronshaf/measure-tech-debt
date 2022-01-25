`measure-tech-debt` measures a folder's tech debt according to imports (e.g. handlebars, coffeescript), identifiers (e.g. $), and file extensions (e.g. .hbs, coffee)

```bash
npm install -y -g measure-tech-debt

npx measure-tech-debt .
npx measure-tech-debt *
```

## Output to JSON

```
npx measure-tech-debt * --json
npx measure-tech-debt * --json > techdebt.json
```

## Output to CSV

```
npx measure-tech-debt * --csv
npx measure-tech-debt * --csv > techdebt.csv
```
