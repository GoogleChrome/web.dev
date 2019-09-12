workflow "Reindex and deploy" {
  on = "deployment"
  resolves = ["Index"]
}

action "Build" {
  uses = "run"
  runs = "npm run build:eleventy"
}

action "Index" {
  uses = "Index"
  runs = "node release.js"
  secrets = ["ALGOLIA_APP", "ALGOLIA_KEY"]
  needs = ["Build"]
}
