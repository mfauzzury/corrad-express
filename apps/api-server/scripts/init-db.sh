#!/usr/bin/env sh
set -eu

DB_PATH="$(cd "$(dirname "$0")/.." && pwd)/prisma/dev.db"
SQL_PATH="$(cd "$(dirname "$0")/.." && pwd)/prisma/sql/init.sql"

mkdir -p "$(dirname "$DB_PATH")"
sqlite3 "$DB_PATH" < "$SQL_PATH"

echo "Initialized SQLite schema at $DB_PATH"
