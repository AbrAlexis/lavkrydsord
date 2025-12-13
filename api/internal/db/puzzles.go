package db

import (
	"log"
)

func insertPuzzle(xdPuzzle string) error {
	_, err := DB().Exec("INSERT INTO puzzles (xdPuzzle) VALUES (?)",
		xdPuzzle,
	)
	if err != nil {
		log.Fatal(err)
	}
	return err
}
