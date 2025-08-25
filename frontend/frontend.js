
window.onload = async function () {
    try {
        const response = await fetch("/puzzle");
        if (!response.ok) throw new Error("Failed to fetch puzzle");
        const puzzleData = await response.json();
            
        const workingPuzzle = puzzleData.WorkingPuzzle;
        const testVariable = "test1";
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
                  if (div.style.backgroundColor === "salmon") {
                    div.style.backgroundColor = "white";
                  }
                });

                
                const input = document.createElement("input");
                input.type = "text";
                input.maxLength = 1; // only allow one letter
                input.classList.add("cell-input");
                div.appendChild(input);

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
      document.getElementById("marshall-tester-button").addEventListener("click", () => {
        const payload = marshalPuzzle(workingPuzzle);
        fetch("/puzzle/" + testVariable, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload
        });
      });

    } catch (err) {
        console.error(err);
        document.getElementById("working-puzzle-grid").textContent = "Error loading puzzle.";
    }
  };



function marshalPuzzle(workingPuzzle) {
  const grid = document.getElementById("working-puzzle-grid");
  
  const nRows = workingPuzzle.length;
  const nCols = workingPuzzle[0].length;

  const result = [];
  let htmlCounter = 0;

  for (let row = 0; row < nRows; row++) {
    const rowArray = [];
      for (let col = 0; col < nCols; col++) {
        if (workingPuzzle[row][col] === "#" ) {
          rowArray.push("#");
          htmlCounter++;
        } else {
          rowArray.push(grid.children[htmlCounter].lastChild.value.toUpperCase());
          htmlCounter++;
        } 

      }
    result.push(rowArray);
  }
  return JSON.stringify(result)
}
