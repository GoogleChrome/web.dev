# web.dev + eleventy

## Get started

Compile docs into the `_site` directory.

```
npm run build
```

Start a BrowserSync server that watches for changes and recompiles.

```
npm run dev
```

Learn more about eleventy @ [http://11ty.io](http://11ty.io)

## Structure

```
├── _data         # Global data
├── _includes     # Page templates
├── _site         # Output directory
├── content       # Our docs
├── css           # DevSite stylesheet and Prism.js stylesheet
└── .eleventy.js  # Configuration file for Eleventy
```