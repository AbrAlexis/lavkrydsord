package jsonutils

import (
	"encoding/json"
	"fmt"
	crosswordPuzzle "lavkrydsord/backend/crosswordpuzzle"
)

func MarshallPuzzle(crosswordPuzzleStruct crosswordPuzzle.CrosswordPuzzle) ([]byte, error) {
	marshalled, err := json.Marshal(abe.Puzzle)
	if err != nil {
		return nil, fmt.Errorf("marshall went wrong")
	}
	return marshalled, nil
}
