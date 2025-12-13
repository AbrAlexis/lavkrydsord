package db

import (
	"log"
	"os"
)

func Migrate() {
	sqlBytes, err := os.ReadFile("internal/db/schema.sql")
	if err != nil {
		log.Fatal(err)
	}

	if _, err := DB().Exec(string(sqlBytes)); err != nil {
		log.Fatal(err)
	}
}