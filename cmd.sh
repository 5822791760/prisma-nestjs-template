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
  yarn prisma migrate deploy
}

function db:gen() {
  yarn prisma migrate dev --create-only
}

function db:push() {
  yarn prisma migrate dev
}

function db:drop() {
  docker-compose up -d postgres
  docker-compose exec postgres dropdb -U postgres --if-exists postgres --force
  docker-compose exec postgres createdb -U postgres postgres
}

function sync() {
  docker-compose exec postgres dropdb -U postgres --if-exists temp --force > /dev/null 2>&1
  docker-compose exec postgres createdb -U postgres temp

  yarn dbml2sql db.dbml -o _docker_volumes/postgres/dbml.sql
  docker compose exec postgres psql -q -U postgres -d temp -f /var/lib/postgresql/data/dbml.sql
  rm _docker_volumes/postgres/dbml.sql

  DATABASE_URL="postgresql://postgres:postgres@localhost:5432/temp" yarn prisma db pull

  docker-compose exec postgres dropdb -U postgres --if-exists temp --force
  yarn format:prisma
  yarn prisma generate
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