package main

import (
	"fmt"
	crosswordPuzzle "lavkrydsord/backend/crosswordpuzzle"
	"lavkrydsord/backend/jsonutils"
	"log"
	"net/http"
)

func main() {
	http.Handle("/", http.FileServer(http.Dir("./frontend")))

	http.HandleFunc("/puzzle", func(w http.ResponseWriter, r *http.Request) {
		crosswordPuzzleStruct := crosswordPuzzle.InitializeGame("/home/abralexis/lavkrydsord/gxd/usatoday/2025/usa2025-06-06.xd")

		jsonutils.MarshallPuzzleStruct(w, r, crosswordPuzzleStruct)
	})

	fmt.Println("Server running at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
