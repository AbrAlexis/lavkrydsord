package main

import (
	"fmt"
	crosswordpuzzle "lavkrydsord/backend/crosswordpuzzle"
	"lavkrydsord/backend/jsonutils"
)

func main() {
	// abe, _ := getCompletePuzzle("gxd\\aarp\\1998\\mm1998-05-06.xd")
	// bjørn := getPuzzle(abe)
	// bi := createCompletedPuzzle(bjørn)
	// fmt.Println(bi)

	workingPuzzle, completedPuzzle := (crosswordpuzzle.InitializeGame("gxd\\aarp\\1998\\mm1998-05-06.xd"))
	fmt.Println(workingPuzzle)
	fmt.Println("seperator")
	fmt.Println(completedPuzzle)
	jsonutils.TestAbe()
}
