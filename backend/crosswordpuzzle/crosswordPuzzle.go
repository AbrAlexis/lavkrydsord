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

func removeEmptyEntriesFromSlice(inputSlice []string) []string {
	var sliceWithNoEmptyEntries []string
	for i := range inputSlice {
		if inputSlice[i] != "" {
			sliceWithNoEmptyEntries = append(sliceWithNoEmptyEntries, inputSlice[i])
		}
	}
	return sliceWithNoEmptyEntries
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

func createWorkingPuzzle(answerGrid [][]string) [][]string {
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
	re := regexp.MustCompile(`(?s)\n\n(A1.*)(\n\n)`)
	match := re.FindStringSubmatch(completePuzzleAsString)
	return match[1]
}

func createCluesSlice(cluesAsString string) []Clue {
	rawLines := regexp.MustCompile("\n").Split(cluesAsString, -1)
	lines := removeEmptyEntriesFromSlice(rawLines)
	listOfClues := make([]Clue, len(lines))
	clueRegex := regexp.MustCompile(`^([AD])(\d+)\.\s+(.*?)\s+~\s+([A-Z|]+)$`)

	for i := range lines {
		clue := clueRegex.FindStringSubmatch(lines[i])
		number, _ := strconv.Atoi(clue[2])
		listOfClues[i] = Clue{Orientation: clue[1], Number: number, Clue: clue[3], Answer: clue[4]}
	}
	return listOfClues
}

func IsPuzzleSolved(workingPuzzle [][]string, answerPuzzle [][]string) (bool, error) {
	nRowWorking := len(workingPuzzle)
	nColWorking := len(workingPuzzle[0])

	nRowAnswer := len(answerPuzzle)
	nColAnswer := len(answerPuzzle[0])

	if nRowWorking != nRowAnswer || nColWorking != nColAnswer {
		return false, fmt.Errorf("puzzles have different dimensions")
	}

	for i := range workingPuzzle {
		for j := range workingPuzzle[0] {
			if workingPuzzle[i][j] != answerPuzzle[i][j] {
				return false, nil
			}
		}
	}
	return true, nil
}

type Clue struct {
	Orientation string
	Number      int
	Clue        string
	Answer      string
}
type CrosswordPuzzle struct {
	MetaData       []string
	PuzzleSolution [][]string
	WorkingPuzzle  [][]string
	Clues          []Clue
}

func createCrosswordStructFromFile(filepath string) (CrosswordPuzzle, error) {
	completePuzzleAsString, err := getCompletePuzzle(filepath)
	if err != nil {
		return CrosswordPuzzle{}, err
	}

	metaDataAsString := getMetaData(completePuzzleAsString)
	metaData := createMetaDataList(metaDataAsString)

	puzzleSolutionAsString := getPuzzle(completePuzzleAsString)
	puzzleSolution := createCompletedPuzzle(puzzleSolutionAsString)

	workingPuzzle := createWorkingPuzzle(puzzleSolution)

	cluesAsString := getClues(completePuzzleAsString)
	clues := createCluesSlice(cluesAsString)

	crosswordPuzzle := CrosswordPuzzle{MetaData: metaData, PuzzleSolution: puzzleSolution, WorkingPuzzle: workingPuzzle, Clues: clues}
	return crosswordPuzzle, nil
}

func SetTile(workingPuzzle [][]string, row int, col int, input string) ([][]string, error) {

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

type Coord struct {
	Row int `json:"row"`
	Col int `json:"col"`
}

func checkPuzzle(workingPuzzle, puzzleSolution [][]string) []Coord {
	var mistakes []Coord
	for i := range workingPuzzle {
		for j := range workingPuzzle[i] {
			if workingPuzzle[i][j] == "" || workingPuzzle[i][j] == "#" {
				continue
			}
			if workingPuzzle[i][j] != puzzleSolution[i][j] {
				mistakes = append(mistakes, Coord{Row: i, Col: j})
			}
		}
	}
	return mistakes
}

func InitializeGame(filePath string) (completePuzzleStruct CrosswordPuzzle) {

	completePuzzleStructReturn, err := createCrosswordStructFromFile(filePath)

	if err != nil {
		fmt.Println("faile initializing game")
	}
	return completePuzzleStructReturn
}

// func Test(filepath string) {
// 	completePuzzleString, _ := getCompletePuzzle(filepath)
// 	cluesString := getClues(completePuzzleString)
// 	cluesSlice := createCluesSlice(cluesString)
// 	fmt.Println(cluesSlice)
// 	// fmt.Println(cluesString)
// }

func Test2(filepath string) {

	puzzleStruct := InitializeGame(filepath)

	puzzleSolution := puzzleStruct.PuzzleSolution
	workingPuzzle := puzzleStruct.WorkingPuzzle

	fmt.Println("is puzzle solved?")
	fmt.Println(IsPuzzleSolved(workingPuzzle, puzzleSolution))
	SetTile(workingPuzzle, 0, 0, "A")
	fmt.Println("is puzzle solved now?")
	fmt.Println(IsPuzzleSolved(workingPuzzle, puzzleSolution))

}
