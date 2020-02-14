#!/bin/bash

set -euo pipefail

# Get the name of the current branch.
BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Comparing master to $BRANCH to see if it needs screenshot testing..."

# Check if js, njk, or scss files were touched in the PR.
# If so, run Percy. Otherwise exit early.
# Note, grep will just exit if it doesn't find anything.
MATCHED_FILES=$(git --no-pager diff --name-only master...HEAD | egrep '^.*\.(js|njk|scss)$')
echo "The following files triggered screenshot testing:"
echo "$MATCHED_FILES"
npm run test:snapshots
