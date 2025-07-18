#!/bin/bash

# Exit script on any error
set -e

# Load .env variables if .env file exists
if [ -f ./.env ]; then
  export $(grep -v '^#' .env | xargs)
fi

function up() {
  docker-compose up -d
}

function down() {
  docker-compose down --remove-orphans
}

function stop() {
  docker-compose stop
}

function waitpg() {
  ./scripts/wait-pg.sh
}

function dev() {
  up
  npx nest start --watch
}

function repl() {
  npx nest start --entryFile repl --watch
}

function cli() {
  NODE_ENV=cli ts-node -r tsconfig-paths/register ./src/cli.ts $@
}

function dbml() {
  npx db2dbml postgres "$DATABASE_URL" -o schema.dbml
}

function db:up() {
  git clean -fd src/core/db/migrations
  npx prisma migrate deploy
  npx prisma generate
  # dbml
}

function db:make() {
  npx prisma migrate dev --create-only
}

function db:push() {
  npx prisma migrate dev
  # dbml
}

function db:drop() {
  docker-compose up -d postgres
  docker-compose exec postgres dropdb -U postgres --if-exists postgres --force
  docker-compose exec postgres createdb -U postgres postgres
}

function db:reset() {
  db:drop
  db:up
}

function db:init() {
  db:reset
  npm run cli initials:seed
}

# Only run this after cloning project
function initproject() {
  cat .env.example > .env
  up
  npm i
  waitpg
  db:init
}

command=$1
shift  # Remove the command name from the arguments

if declare -f "$command" > /dev/null; then
  "$command" "$@"
else
  echo "Command '$command' does not exist."
  exit 1
fi