
window.onload = async function () {
    try {
        const response = await fetch("/puzzle");
        if (!response.ok) throw new Error("Failed to fetch puzzle");
        const puzzleData = await response.json();
            
        const workingPuzzle = puzzleData.WorkingPuzzle;
        console.log("Puzzle received:", puzzleData);
    
        const grid = document.getElementById("working-puzzle-grid");

        const rows = workingPuzzle.length;
        const cols = workingPuzzle[0].length;
      
        grid.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
        
        var clueCounter = 1;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
              const div = document.createElement("div");
              div.classList.add("puzzle-cell");
              
              if (workingPuzzle[row][col] === "#") {
                div.classList.add("blank");
              } else {
                if (row === 0 || col === 0 || workingPuzzle [row - 1][col] === "#" || workingPuzzle [row][col - 1] === "#") {
                    const clueNumber = document.createElement("span");
                    clueNumber.classList.add("clue-number");
                    clueNumber.textContent = clueCounter;
                    div.appendChild(clueNumber);

                    clueCounter++;
                }
                div.addEventListener("click", function(){
                  console.log(document.getElementById("working-puzzle-grid"));
                });

                
                const input = document.createElement("input");
                input.type = "text";
                input.maxLength = 1; // only allow one letter
                input.classList.add("cell-input");
                div.appendChild(input);
                document.getElementById("puzzle-checker-button").addEventListener("click", () => {
                  let htmlCounter = 0;
                  for (let row = 0; row < rows; row++) {
                    for (let col = 0; col < cols; col++) {
                      
                      if (workingPuzzle[row][col] === "#") {
                        htmlCounter++;
                        continue;
                      }
                      let currentCellValue = document.getElementById("working-puzzle-grid").children[htmlCounter].lastChild.value;
                      if (currentCellValue.toUpperCase() !== puzzleData.PuzzleSolution[row][col] && currentCellValue.toUpperCase() !== "") {
                        document.getElementById("working-puzzle-grid").children[htmlCounter].style.backgroundColor = "salmon";
                      }
                      htmlCounter++;                      
                    }
                    
                  }
                });
              }
              
              grid.appendChild(div);
            }
          }
      
      const clues = puzzleData.Clues
      console.log(clues[0])
      const cluesUI = document.getElementById("clues");
      const nClues = clues.length   
      for (let i = 0; i < nClues; i++) {
        const div = document.createElement("div");
        div.textContent = clues[i].Orientation + clues[i].Number + ". " + clues[i].Clue ;
        cluesUI.appendChild(div);
      }

  


    } catch (err) {
        console.error(err);
        document.getElementById("working-puzzle-grid").textContent = "Error loading puzzle.";
    }
  };




