package jsonutils

import (
	"encoding/json"
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

}
