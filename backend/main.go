package main

import (
	"fmt"
	crosswordPuzzle "lavkrydsord/backend/crosswordpuzzle"
	"lavkrydsord/backend/jsonutils"
	"log"
	"net/http"
)

// func main() {
// 	// crosswordpuzzle.Test2("/home/abralexis/lavkrydsord/gxd/aarp/1998/mm1998-05-06.xd")
// 	// crosswordpuzzle.Test2("/home/abralexis/lavkrydsord/test.xd")
// 	// workingPuzzle, completedPuzzle := (crosswordpuzzle.InitializeGame("/home/abralexis/lavkrydsord/gxd/aarp/1998/mm1998-05-06.xd"))
// 	// fmt.Println(workingPuzzle)
// 	// fmt.Println("seperator")
// 	// fmt.Println(completedPuzzle)
// 	_, complete := crosswordPuzzle.InitializeGame("/home/abralexis/lavkrydsord/test.xd")
// 	fmt.Println(jsonutils.MarshallPuzzle(complete))

// }

func main() {
	http.Handle("/", http.FileServer(http.Dir("./frontend")))

	http.HandleFunc("/puzzle", func(w http.ResponseWriter, r *http.Request) {
		crosswordPuzzleStruct := crosswordPuzzle.InitializeGame("//home/abralexis/lavkrydsord/gxd/bostonglobe/1982/bg1982-03-14.xd")

		jsonutils.MarshallPuzzleStruct(w, r, crosswordPuzzleStruct)
	})

	fmt.Println("Server running at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
