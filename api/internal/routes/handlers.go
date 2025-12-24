package routes

import (
	"encoding/json"
	"fmt"
	"io"
	"lavkrydsord/internal/db"
	crosswordPuzzle "lavkrydsord/model"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/go-chi/chi/v5"
)

func PingHandler(w http.ResponseWriter, r *http.Request) {
	pong := "pong"
	w.Header().Set("Content-Type", "application/json")
	mString, _ := json.Marshal(pong)
	w.Write(mString)
}

func UploadPuzzleHandler(w http.ResponseWriter, r *http.Request) {
	file, _, err := r.FormFile("textfile")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()
	fileBytes, err := io.ReadAll(file)
	fileAsString := string(fileBytes)
	dbErr := db.InsertPuzzle(fileAsString)
	if dbErr != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(fileBytes)
}

func getPuzzlesMetaDataHandler(w http.ResponseWriter, r *http.Request) {
	puzzles, err := db.GetPuzzlesMetaData()
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	marshalled, err := json.Marshal(puzzles)
	if err != nil {
		http.Error(w, "Failed to marshal puzzle", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(marshalled)
}
func MarshallPuzzleStruct(w http.ResponseWriter, r *http.Request, crosswordPuzzleStruct crosswordPuzzle.CrosswordPuzzle) {
	marshalled, err := json.Marshal(crosswordPuzzleStruct)
	if err != nil {
		http.Error(w, "Failed to marshal puzzle", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(marshalled)
}

// func HandleCheckPuzzle(w http.ResponseWriter, r *http.Request) {
// 	var req [][]string
// 	json.NewDecoder(r.Body).Decode(&req)
// 	w.Header().Set("Content-Type", "application/json")
// 	puzzleStruct, err := crosswordPuzzle.CreateCrosswordStructFromFile("/home/abralexis/lavkrydsord/test.xd")
// 	if err != nil {
// 		fmt.Errorf("Fail in json helper")
// 	}
// 	solutionGrid := puzzleStruct.PuzzleSolution
// 	puzzleErrors := crosswordPuzzle.CheckPuzzle(req, solutionGrid)
// 	marshalled, err := json.Marshal(puzzleErrors)
// 	if err != nil {
// 		fmt.Errorf("marshalling failed")
// 	}
// 	w.Write(marshalled)
// }

func HandleFrontpage(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	exe, err := os.Executable()
	if err != nil {
		fmt.Errorf("could not get executable path")
	}
	fmt.Printf(exe + "\n")
	exeDir := filepath.Dir(exe)
	fmt.Printf(exeDir + "\n")

	puzzlesFolderPath := filepath.Join(exeDir, "homemadePuzzles")
	fmt.Printf(puzzlesFolderPath + "\n")
	files, err := os.ReadDir(puzzlesFolderPath)
	if err != nil {
		fmt.Errorf("could not read directory")
	}

	for _, file := range files {
		fmt.Println(file.Name())
	}
	fmt.Println(len(files))

	marshalled, err := json.Marshal(files)
	if err != nil {
		fmt.Errorf("marshalling failed")
	}

	w.Write(marshalled)
}

func getPuzzleByIDHandler(w http.ResponseWriter, r *http.Request) {
	puzzleIDStr := chi.URLParam(r, "puzzleId")
	puzzleID, err := strconv.Atoi(puzzleIDStr)
	if err != nil {
		http.Error(w, "Invalid puzzle ID", http.StatusBadRequest)
		return
	}

	puzzleData, err := db.GetPuzzleByID(puzzleID)
	if err != nil {
		http.Error(w, "Puzzle not found", http.StatusNotFound)
		return
	}

	puzzleStruct, err := crosswordPuzzle.CreateCrosswordStructFromString(puzzleData)
	if err != nil {
		http.Error(w, "Failed to parse puzzle data", http.StatusInternalServerError)
		return
	}

	MarshallPuzzleStruct(w, r, puzzleStruct)
}
