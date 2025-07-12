package main

import (
	"fmt"
	crosswordPuzzle "lavkrydsord/backend/crosswordpuzzle"
	"lavkrydsord/backend/jsonutils"
)

func main() {
	// crosswordpuzzle.Test2("/home/abralexis/lavkrydsord/gxd/aarp/1998/mm1998-05-06.xd")
	// crosswordpuzzle.Test2("/home/abralexis/lavkrydsord/test.xd")
	// workingPuzzle, completedPuzzle := (crosswordpuzzle.InitializeGame("/home/abralexis/lavkrydsord/gxd/aarp/1998/mm1998-05-06.xd"))
	// fmt.Println(workingPuzzle)
	// fmt.Println("seperator")
	// fmt.Println(completedPuzzle)
	_, complete := crosswordPuzzle.InitializeGame("/home/abralexis/lavkrydsord/test.xd")
	fmt.Println(jsonutils.MarshallPuzzle(complete))

}
