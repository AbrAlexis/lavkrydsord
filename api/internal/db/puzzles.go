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

func GetPuzzles() []string {
	rows, err := DB().Query("SELECT * FROM puzzles")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()
	var puzzles []string
	for rows.Next() {
		var puzzle string
		var id int
		if err := rows.Scan(&id, &puzzle); err != nil {
			log.Fatal(err)
		}
		puzzles = append(puzzles, puzzle)
	}
	return puzzles
}
