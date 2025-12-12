package main

import (
	"fmt"
	"lavkrydsord/backend/jsonutils"
	"log"
	"net/http"
)

func main() {
	http.Handle("/", http.FileServer(http.Dir("../frontend")))

	// http.HandleFunc("/puzzle", func(w http.ResponseWriter, r *http.Request) {
	// 	// crosswordPuzzleStruct := crosswordPuzzle.InitializeGame("C:\\Users\\Default User.DESKTOP-F6CKQMA\\OneDrive\\Skrivebord\\lavkrydsord\\gxd\\aarp\\1998\\mm1998-07-08.xd")
	// 	crosswordPuzzleStruct := crosswordPuzzle.InitializeGame("/home/abralexis/lavkrydsord/gxd/nytimes/2024/nyt2024-01-01.xd")

	// 	jsonutils.MarshallPuzzleStruct(w, r, crosswordPuzzleStruct)
	// })

	// http.HandleFunc("/puzzle/test1", jsonutils.HandleCheckPuzzle)
	http.HandleFunc("/games", func(w http.ResponseWriter, r *http.Request) {
		jsonutils.HandleFrontpage(w, r)
	})
	fmt.Println("Server running at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
