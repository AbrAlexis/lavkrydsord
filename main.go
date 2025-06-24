package main

import (
	"fmt"
	"os"
	"regexp"
)

func check(e error) {
	if e != nil {
		panic(e)
	}
}

func getDimensions(puzzle string) (rows int, cols int) {
	lines := regexp.MustCompile("\n").Split(puzzle, -1)
	return len(lines), len(lines[0])
	// return lines.len(), lines[0].len
}

func getCompletePuzzle(xdPuzzlePath string) (string, error) {
	puzzle, err := os.ReadFile(xdPuzzlePath)
	if err != nil {
		return "", err
	} else {
		return string(puzzle), nil
	}
}

func getPuzzle(completePuzzle string) string {
	re := regexp.MustCompile(`(?s)\n\n\n(.*?)\n\n`)
	found := re.FindStringSubmatch(completePuzzle)
	grid := found[1]
	return grid
}

func createAnswerGrid(completePuzzle string) [][]string {
	nRows, nCols := getDimensions(completePuzzle)
	//Create the empty puzzle grid, later to be filled out
	answerGrid := make([][]string, nRows)

	for i := range answerGrid {
		answerGrid[i] = make([]string, nCols)
	}
	//Apparently strings are bytes or sum
	completePuzzleAsRune := []rune(completePuzzle)
	counter := 0
	for i := range answerGrid {
		for j := range answerGrid[i] {
			if completePuzzleAsRune[counter] != '\n' {
				answerGrid[i][j] = string(completePuzzleAsRune[counter])
				counter++
			} else {
				counter++
				continue

			}

		}
	}
	return answerGrid
}

func main() {
	puzzle, _ := getCompletePuzzle("/home/abralexis/lavkrydsord/xdData/gxd/aarp/1998/mm1998-05-06.xd")
	onlyPuzzle := getPuzzle(puzzle)
	//fmt.Println(getDimensions(onlyPuzzle))
	fmt.Println(createAnswerGrid(onlyPuzzle))
}
