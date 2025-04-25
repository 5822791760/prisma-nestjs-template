#!/bin/bash

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

function waitpg() {
  ./scripts/wait-pg.sh
}

function dev() {
  up
  yarn start:dev
}

function repl() {
  nest start --entryFile repl --watch
}

function cli() {
  NODE_ENV=cli ts-node -r tsconfig-paths/register ./src/cli.ts $@
}

function db:up() {
  yarn typeorm migration:run
}

function db:prev() {
  yarn typeorm migration:revert
}

function db:drop() {
  docker-compose up -d postgres
  docker-compose exec postgres dropdb -U postgres --if-exists postgres --force
  docker-compose exec postgres createdb -U postgres postgres
}

function db:gen() {
  if [ -z "$1" ]; then
    echo "Error: Please provide a name for the migration."
    exit 1
  fi

  docker-compose exec postgres dropdb -U postgres --if-exists temp --force
  docker-compose exec postgres createdb -U postgres temp

  yarn dbml2sql db.dbml -o _docker_volumes/postgres/dbml.sql
  docker compose exec postgres psql -q -U postgres -d temp -f /var/lib/postgresql/data/dbml.sql
  rm _docker_volumes/postgres/dbml.sql

  DATABASE_URL="postgresql://postgres:postgres@localhost:5432/temp" yarn prisma db pull

  yarn prisma migrate dev --name $1
}

test() {
  echo $DATABASE_URL
}

function db:reset() {
  db:drop
  db:up
}

function db:init() {
  db:reset
  yarn cli initials:seed
}

# Only run this after cloning project
function initproject() {
  cat .env.example > .env
  up
  yarn
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