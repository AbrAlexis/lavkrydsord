package db

import (
	"log"
)

func InsertPuzzle(fileAsString string) error {
	_, err := DB().Exec("INSERT INTO puzzles (xdPuzzle) VALUES (?)",
		fileAsString,
	)
	if err != nil {
		log.Fatal(err)
	}
	return err
}
