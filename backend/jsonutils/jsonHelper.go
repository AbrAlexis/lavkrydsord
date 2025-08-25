package jsonutils

import (
	"encoding/json"
	"fmt"
	crosswordPuzzle "lavkrydsord/backend/crosswordpuzzle"
	"net/http"
)

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
	puzzleStruct, err := crosswordPuzzle.CreateCrosswordStructFromFile("C:\\Users\\Default User.DESKTOP-F6CKQMA\\OneDrive\\Skrivebord\\lavkrydsord\\TestPuzzles\\test1.xd")
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
