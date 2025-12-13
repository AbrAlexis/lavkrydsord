package routes

import (
	"encoding/json"
	"fmt"
	crosswordPuzzle "lavkrydsord/model"
	"net/http"
	"os"
	"path/filepath"
)

func PingHandler(w http.ResponseWriter, r *http.Request) {
	pong := "pong"
	w.Header().Set("Content-Type", "application/json")
	mString, _ := json.Marshal(pong)
	w.Write(mString)
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

func HandleCheckPuzzle(w http.ResponseWriter, r *http.Request) {
	var req [][]string
	json.NewDecoder(r.Body).Decode(&req)
	w.Header().Set("Content-Type", "application/json")
	puzzleStruct, err := crosswordPuzzle.CreateCrosswordStructFromFile("/home/abralexis/lavkrydsord/test.xd")
	if err != nil {
		fmt.Errorf("Fail in json helper")
	}
	solutionGrid := puzzleStruct.PuzzleSolution
	puzzleErrors := crosswordPuzzle.CheckPuzzle(req, solutionGrid)
	marshalled, err := json.Marshal(puzzleErrors)
	if err != nil {
		fmt.Errorf("marshalling failed")
	}
	w.Write(marshalled)
}

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
