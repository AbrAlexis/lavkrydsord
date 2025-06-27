package crosswordPuzzle

import (
	"fmt"
	"os"
	"regexp"
	"strconv"
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

func getPuzzle(completePuzzle string) string {
	re := regexp.MustCompile(`(?s)\n\n\n(.*?)\n\n`)
	found := re.FindStringSubmatch(completePuzzle)
	grid := found[1]
	return grid
}

func getDimensions(puzzle string) (rows int, cols int) {
	lines := regexp.MustCompile("\n").Split(puzzle, -1)
	return len(lines), len(lines[0])
}

func getMetaData(completePuzzleAsString string) string {
	re := regexp.MustCompile(`(?m)^(.+\n){0,3}.+`)
	found := re.FindStringSubmatch(completePuzzleAsString)[0]
	return found
}
func createMetaDataList(metaDataAsString string) []string {
	return regexp.MustCompile("\n").Split(metaDataAsString, -1)
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

func getClues(completePuzzleAsString string) string {
	re := regexp.MustCompile(`(?ms)^copyright:.*?\n\n(.*)`)
	match := re.FindStringSubmatch(completePuzzleAsString)
	return match[1]
}

func createCluesSlice(cluesAsString string) []Clue {
	lines := regexp.MustCompile("\n").Split(cluesAsString, -1)
	listOfClues := make([]Clue, len(lines))
	clueRegex := regexp.MustCompile(`^([AD])(\d+)\.\s+(.*?)\s+~\s+([A-Z|]+)$`)

	for i := range lines {
		clue := clueRegex.FindStringSubmatch(lines[i])
		number, _ := strconv.Atoi(clue[2])
		listOfClues[i] = Clue{Orientation: clue[1], Number: number, Clue: clue[3], Answer: clue[4]}
	}
	return listOfClues
}

type Clue struct {
	Orientation string
	Number      int
	Clue        string
	Answer      string
}
type CrosswordPuzzle struct {
	metaData []string
	puzzle   [][]string
	clues    []Clue
}

func createCrosswordStructFromFile(filepath string) (CrosswordPuzzle, error) {
	completePuzzleAsString, err := getCompletePuzzle(filepath)
	if err != nil {
		return CrosswordPuzzle{}, err
	}

	metaDataAsString := getMetaData(completePuzzleAsString)
	metaData := createMetaDataList(metaDataAsString)

	puzzle := getPuzzle(completePuzzleAsString)

	cluesAsString := getClues(completePuzzleAsString)
	clues := createCluesSlice(cluesAsString)

	crosswordPuzzle := CrosswordPuzzle{metaData: metaData, puzzle: puzzle, clues: clues}

}

func setTile(workingPuzzle [][]string, row int, col int, input string) ([][]string, error) {
	nRows := len(workingPuzzle)

	nCols := len(workingPuzzle[0])

	if row < 0 || row >= nRows {
		return workingPuzzle, fmt.Errorf("row invalid")
	}

	if col < 0 || col >= nCols {
		return workingPuzzle, fmt.Errorf("column invalid")
	}

	if workingPuzzle[row][col] == "#" {
		return workingPuzzle, fmt.Errorf("cant place tile on black square")
	}

	workingPuzzle[row][col] = input
	return workingPuzzle, nil
}

func InitializeGame(filePath string) (workingPuzzle [][]string, completedPuzzle [][]string) {
	puzzleAllData, _ := getCompletePuzzle(filePath)
	onlyGrid := getPuzzle(puzzleAllData)
	metaData := getMetaData(puzzleAllData)
	metaDataToMap(metaData)
	completedPuzzleReturn := createCompletedPuzzle(onlyGrid)
	workingPuzzleReturn := createPuzzleToBeFilled(completedPuzzleReturn)

	return workingPuzzleReturn, completedPuzzleReturn
}
