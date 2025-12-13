package db

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

var database *sql.DB

func Init() {
	path := os.Getenv("SQLITE_PATH")
	if path == "" {
		path = "app.db" // sensible default for local dev
	}

	db, err := sql.Open("sqlite3", path)
	if err != nil {
		log.Fatal(err)
	}

	// SQLite recommended pragmas
	db.Exec("PRAGMA foreign_keys = ON;")
	db.Exec("PRAGMA journal_mode = WAL;")

	// Test connection
	if err := db.Ping(); err != nil {
		log.Fatal(err)
	}

	database = db
	log.Println("SQLite connected:", path)

}

func DB() *sql.DB {
	if database == nil {
		log.Fatal("database not initialized")
	}
	return database
}
