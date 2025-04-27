#!/bin/bash

# Exit script on any error
set -e

# Load .env variables if .env file exists
if [ -f ./.env ]; then
  export $(grep -v '^#' .env | xargs)
fi

function dbdoc() {
    if [ -z "$DBDOCS_TOKEN" ]; then
        echo "Error: DBDOCS_TOKEN is not set."
        exit 1
    fi
    # yarn global add dbdocs
    # DBDOCS_TOKEN="$DBDOCS_TOKEN" dbdocs build ./schema.dbml --project nestjs
}


function build() {
    yarn test:mutation
    dbdoc
}

function merge() {
    yarn lint
    yarn tsc --noEmit
    yarn test:mutation
}


command=$1
shift  # Remove the command name from the arguments

if declare -f "$command" > /dev/null; then
  "$command" "$@"
else
  echo "Command '$command' does not exist."
  exit 1
fi