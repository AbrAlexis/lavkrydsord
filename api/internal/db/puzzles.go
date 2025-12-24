package db

import (
	"fmt"
	"log"
	"regexp"
)

type PuzzleMetaData struct {
	ID     int
	Title  string
	Author string
	Date   string
}

func InsertPuzzle(fileAsString string) error {
	title, author, date := getMetaData(fileAsString)
	_, err := DB().Exec("INSERT INTO puzzles (xdPuzzle, title, author, date) VALUES (?, ?, ?, ?)",
		fileAsString,
		title,
		author,
		date,
	)
	if err != nil {
		log.Printf("ERROR inserting puzzle: %v", err)
		return fmt.Errorf("db insert failed: %w", err)
	}
	return nil
}

func GetPuzzlesMetaData() ([]PuzzleMetaData, error) {
	rows, err := DB().Query("SELECT id, title, author, date FROM puzzles")
	if err != nil {
		log.Printf("ERROR getting puzzles: %v", err)
		return nil, fmt.Errorf("error reading puzzles table: %w", err)
	}
	defer rows.Close()
	var metaDataList []PuzzleMetaData
	for rows.Next() {
		var id int
		var title string
		var author string
		var date string
		if err := rows.Scan(&id, &title, &author, &date); err != nil {
			log.Printf("ERROR scanning puzzle: %v", err)
			return nil, fmt.Errorf("error reading puzzles table: %w", err)
		}
		puzzleMetaData := PuzzleMetaData{ID: id, Title: title, Author: author, Date: date}
		metaDataList = append(metaDataList, puzzleMetaData)
	}
	return metaDataList, nil
}

func getMetaData(completePuzzleAsString string) (string, string, string) {
	result := []string{}

	var err error
	var title string = "Untitled"
	var author string = "Unknown Author"
	var date string = "0000-00-00"

	title, err = getGenericMetaData(completePuzzleAsString, "Title")
	if err != nil {
		log.Printf("Error getting title: %v", err)
	}

	author, err = getGenericMetaData(completePuzzleAsString, "Author")
	if err != nil {
		log.Printf("Error getting author: %v", err)
	}

	date, err = getGenericMetaData(completePuzzleAsString, "Date")
	if err != nil {
		log.Printf("Error getting date: %v", err)
	}

	result = append(result, title)
	result = append(result, author)
	result = append(result, date)

	return result[0], result[1], result[2]
}

func getGenericMetaData(completePuzzleAsString string, metaDataType string) (string, error) {
	re, err := regexp.Compile(`` + metaDataType + `:\s*(.*)\n`)
	if err != nil {
		//elegant error handling
		log.Printf("Error getting title: %v", err)
		return "", fmt.Errorf("trror getting title in getGenericMetaData: %w, err")
	}

	matches := re.FindStringSubmatch(completePuzzleAsString)

	if len(matches) < 2 {
		return "", fmt.Errorf("metaData not found")
	}

	metaData := matches[1]

	if len(metaData) > 0 {
		return metaData, nil
	} else {
		return "", fmt.Errorf("metaData found but was empty")
	}
}

func GetPuzzleByID(puzzleID int) (string, error) {
	var puzzleData string
	err := DB().QueryRow("SELECT xdPuzzle FROM puzzles WHERE id = ?", puzzleID).Scan(&puzzleData)
	if err != nil {
		log.Printf("ERROR getting puzzle by ID: %v", err)
		return "", fmt.Errorf("error reading puzzle by ID: %w", err)
	}
	return puzzleData, nil
}
