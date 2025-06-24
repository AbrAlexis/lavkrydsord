package main

import (
	"fmt"
	"os"
	"regexp"
)

func copyStringSliceGrid(grid [][]string) [][]string {
	copyGrid := make([][]string, len(grid))
	for i := range grid {
		copyGrid[i] = make([]string, len(grid[i]))
		copy(copyGrid[i], grid[i])
	}
	return copyGrid
}

func check(e error) {
	if e != nil {
		panic(e)
	}
}

func getCompletePuzzle(xdPuzzlePath string) (string, error) {
	puzzle, err := os.ReadFile(xdPuzzlePath)
	if err != nil {
		return "", err
	} else {
		return string(puzzle), nil
	}
}

func getDimensions(puzzle string) (rows int, cols int) {
	lines := regexp.MustCompile("\n").Split(puzzle, -1)
	return len(lines), len(lines[0])
	// return lines.len(), lines[0].len
}

func getPuzzle(completePuzzle string) string {
	re := regexp.MustCompile(`(?s)\n\n\n(.*?)\n\n`)
	found := re.FindStringSubmatch(completePuzzle)
	grid := found[1]
	return grid
}

func createCompletedPuzzle(completePuzzle string) [][]string {
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
		j := 0
		for j < nCols {
			if completePuzzleAsRune[counter] != '\n' {
				answerGrid[i][j] = string(completePuzzleAsRune[counter])
				j++
			}
			counter++
		}
	}
	return answerGrid
}

func createPuzzleToBeFilled(answerGrid [][]string) [][]string {
	workingPuzzle := copyStringSliceGrid(answerGrid)
	for i := range workingPuzzle {
		for j := range workingPuzzle[i] {
			if workingPuzzle[i][j] != "#" {
				workingPuzzle[i][j] = ""
			}
		}
	}
	return workingPuzzle
}

func initializeGame(filePath string) (workingPuzzle [][]string, completedPuzzle [][]string) {
	puzzleAllData, _ := getCompletePuzzle(filePath)
	onlyGrid := getPuzzle(puzzleAllData)
	completedPuzzleReturn := createCompletedPuzzle(onlyGrid)
	workingPuzzleReturn := createPuzzleToBeFilled(completedPuzzleReturn)
	return workingPuzzleReturn, completedPuzzleReturn
}

func main() {
	// abe, _ := getCompletePuzzle("gxd\\aarp\\1998\\mm1998-05-06.xd")
	// bjørn := getPuzzle(abe)
	// bi := createCompletedPuzzle(bjørn)
	// fmt.Println(bi)

	workingPuzzle, completedPuzzle := (initializeGame("gxd\\aarp\\1998\\mm1998-05-06.xd"))
	fmt.Println(workingPuzzle)
	fmt.Println("seperator")
	fmt.Println(completedPuzzle)
}
